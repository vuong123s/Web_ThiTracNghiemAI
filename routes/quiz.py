import os
import random
from datetime import datetime

from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_login import current_user, login_required
from sqlalchemy import and_, or_
from werkzeug.utils import secure_filename

from forms import JoinClassForm, QuizAccessForm
from models import Answer, ClassDocument, Classroom, Option, Question, Quiz, Submission, UserClass, db

quiz_bp = Blueprint("quiz", __name__)


def _quiz_is_accessible(quiz: Quiz) -> bool:
    return quiz.is_available(datetime.utcnow())


def _has_class_access(quiz: Quiz) -> bool:
    if not quiz.class_id:
        return True
    if not current_user.is_authenticated:
        return False
    if current_user.is_admin():
        return True
    if current_user.is_teacher():
        return quiz.teacher_id == current_user.id
    if current_user.is_student():
        return (
            UserClass.query.filter_by(
                user_id=current_user.id, class_id=quiz.class_id, status="approved"
            ).first()
            is not None
        )
    return False


def _submission_owner_ok(submission: Submission) -> bool:
    if current_user.is_authenticated:
        if submission.student_id == current_user.id:
            return True
        if submission.student_email and submission.student_email == current_user.email:
            return True
    identity = session.get(f"quiz_identity_{submission.quiz_id}")
    if identity and submission.student_email and identity.get("student_email") == submission.student_email:
        return True
    return False


def _parse_selected_ids(form_key: str) -> list[int]:
    values = request.form.getlist(form_key)
    selected_ids = []
    for value in values:
        if value and value.isdigit():
            selected_ids.append(int(value))
    return selected_ids


def _save_essay_image(quiz_id: int, question_id: int, file_storage):
    if not file_storage or not file_storage.filename:
        return None
    filename = secure_filename(file_storage.filename)
    if not filename:
        return None
    folder = os.path.join(current_app.root_path, "static", "uploads", "essay", str(quiz_id), str(question_id))
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, filename)
    file_storage.save(path)
    return url_for(
        "static",
        filename=f"uploads/essay/{quiz_id}/{question_id}/{filename}",
        _external=False,
    )


@quiz_bp.route("/")
@login_required
def library():
    search = request.args.get("search", "").strip()
    class_id = request.args.get("class_id", type=int)

    query = Quiz.query.filter_by(is_published=True)
    if search:
        query = query.filter(Quiz.title.ilike(f"%{search}%"))
    if class_id:
        query = query.filter_by(class_id=class_id)

    quizzes = [quiz for quiz in query.order_by(Quiz.created_at.desc()).all() if _quiz_is_accessible(quiz)]

    enrolled_class_ids = []
    if current_user.is_authenticated and current_user.is_student():
        enrolled_class_ids = [
            row.class_id
            for row in UserClass.query.filter_by(user_id=current_user.id, status="approved").all()
        ]
        quizzes = [
            quiz for quiz in quizzes if (not quiz.class_id) or (quiz.class_id in enrolled_class_ids)
        ]

    join_form = JoinClassForm()
    return render_template(
        "quiz/library.html",
        quizzes=quizzes,
        enrolled_class_ids=enrolled_class_ids,
        join_form=join_form,
        current_search=search,
    )


@quiz_bp.route("/join-class", methods=["POST"])
@login_required
def join_class():
    if not current_user.is_student():
        flash("Chỉ học sinh mới có thể tham gia lớp bằng mã.", "warning")
        return redirect(url_for("quiz.library"))

    form = JoinClassForm()
    if not form.validate_on_submit():
        flash("Mã lớp chưa hợp lệ.", "danger")
        return redirect(url_for("quiz.library"))

    code = form.join_code.data.strip().upper()
    _join_class_by_code(code)
    return redirect(url_for("quiz.library"))


@quiz_bp.route("/classes/documents")
@login_required
def class_documents():
    if not current_user.is_student():
        flash("Chức năng này chỉ dành cho học sinh.", "warning")
        return redirect(url_for("quiz.library"))

    memberships = UserClass.query.filter_by(user_id=current_user.id, status="approved").all()
    class_ids = [row.class_id for row in memberships]
    classes = (
        Classroom.query.filter(Classroom.id.in_(class_ids)).order_by(Classroom.name.asc()).all()
        if class_ids
        else []
    )
    documents = (
        ClassDocument.query.filter(ClassDocument.class_id.in_(class_ids))
        .order_by(ClassDocument.uploaded_at.desc())
        .all()
        if class_ids
        else []
    )
    docs_by_class = {}
    for doc in documents:
        docs_by_class.setdefault(doc.class_id, []).append(doc)

    return render_template(
        "quiz/class_documents.html",
        classes=classes,
        docs_by_class=docs_by_class,
    )


@quiz_bp.route("/join/<string:join_code>")
@login_required
def join_class_by_link(join_code):
    if not current_user.is_student():
        flash("Chỉ học sinh mới có thể tham gia lớp bằng mã.", "warning")
        return redirect(url_for("quiz.library"))

    code = (join_code or "").strip().upper()
    if not code:
        flash("Mã lớp không hợp lệ.", "danger")
        return redirect(url_for("quiz.library"))

    _join_class_by_code(code)
    return redirect(url_for("quiz.library"))


def _join_class_by_code(code: str) -> None:
    classroom = Classroom.query.filter_by(join_code=code).first()
    if not classroom:
        flash("Không tìm thấy lớp với mã tham gia này.", "danger")
        return

    existed = UserClass.query.filter_by(user_id=current_user.id, class_id=classroom.id).first()
    if existed:
        if existed.status == "approved":
            flash("Bạn đã ở trong lớp này.", "info")
        else:
            flash("Bạn đã gửi yêu cầu tham gia lớp, vui lòng chờ giáo viên duyệt.", "warning")
        return

    membership = UserClass(user_id=current_user.id, class_id=classroom.id, status="pending")
    db.session.add(membership)
    db.session.commit()
    flash("Đã gửi yêu cầu tham gia lớp. Chờ giáo viên duyệt.", "success")


@quiz_bp.route("/shared/<token>", methods=["GET", "POST"])
def shared_quiz_entry(token):
    quiz = Quiz.query.filter_by(share_token=token, is_published=True).first_or_404()
    return redirect(url_for("quiz.start_quiz", quiz_id=quiz.id))


@quiz_bp.route("/<int:quiz_id>/start", methods=["GET", "POST"])
def start_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)

    if not _quiz_is_accessible(quiz):
        flash("Đề thi chưa mở hoặc đã đóng.", "warning")
        return redirect(url_for("quiz.library") if current_user.is_authenticated else url_for("index"))

    if quiz.class_id and not _has_class_access(quiz):
        if not current_user.is_authenticated:
            flash("Bạn cần đăng nhập để làm đề thi của lớp.", "warning")
            return redirect(url_for("auth.login"))
        if current_user.is_student():
            flash("Bạn chưa được duyệt vào lớp để làm đề này.", "warning")
        else:
            flash("Bạn không có quyền truy cập đề thi này.", "danger")
        return redirect(url_for("quiz.library"))

    form = QuizAccessForm()
    if request.method == "GET" and current_user.is_authenticated:
        form.student_name.data = current_user.display_name
        form.student_email.data = current_user.email

    if form.validate_on_submit():
        student_id = current_user.id if current_user.is_authenticated else None
        student_name = form.student_name.data.strip()
        student_email = form.student_email.data.strip().lower()

        if current_user.is_authenticated and current_user.is_student() and not quiz.allow_retake:
            existing = Submission.query.filter_by(
                quiz_id=quiz.id,
                student_id=current_user.id,
                status="graded",
            ).first()
            if existing:
                flash("Giáo viên chưa bật chế độ làm lại cho đề này.", "warning")
                return redirect(url_for("quiz.result", result_id=existing.id))

        latest_attempt = (
            Submission.query.filter_by(quiz_id=quiz.id, student_id=student_id)
            .order_by(Submission.attempt_no.desc())
            .first()
            if student_id
            else None
        )
        attempt_no = (latest_attempt.attempt_no + 1) if latest_attempt else 1

        submission = Submission(
            quiz_id=quiz.id,
            student_id=student_id,
            student_name=student_name,
            student_email=student_email,
            status="in_progress",
            attempt_no=attempt_no,
            started_at=datetime.utcnow(),
            ip_address=request.remote_addr,
        )
        db.session.add(submission)
        db.session.commit()

        session[f"active_submission_{quiz.id}"] = submission.id
        session[f"quiz_identity_{quiz.id}"] = {
            "student_name": student_name,
            "student_email": student_email,
        }

        question_ids = [q.id for q in quiz.get_ordered_questions()]
        if quiz.is_shuffled and len(question_ids) > 1:
            random.shuffle(question_ids)
        session[f"question_order_{submission.id}"] = question_ids

        option_order = {}
        for qid in question_ids:
            option_ids = [
                opt.id
                for opt in Option.query.filter_by(question_id=qid).order_by(Option.order_index.asc())
            ]
            if quiz.shuffle_options and len(option_ids) > 1:
                random.shuffle(option_ids)
            option_order[str(qid)] = option_ids
        session[f"option_order_{submission.id}"] = option_order
        session.modified = True

        return redirect(url_for("quiz.take_quiz", quiz_id=quiz.id))

    return render_template("quiz/start.html", quiz=quiz, form=form)


@quiz_bp.route("/<int:quiz_id>/take")
def take_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if quiz.class_id and not _has_class_access(quiz):
        if not current_user.is_authenticated:
            flash("Bạn cần đăng nhập để truy cập đề thi của lớp.", "warning")
            return redirect(url_for("auth.login"))
        flash("Bạn không có quyền truy cập đề thi này.", "danger")
        return redirect(url_for("quiz.library"))

    submission_id = session.get(f"active_submission_{quiz.id}")
    if not submission_id:
        flash("Bạn cần xác nhận thông tin trước khi bắt đầu.", "warning")
        return redirect(url_for("quiz.start_quiz", quiz_id=quiz.id))

    submission = Submission.query.get_or_404(submission_id)
    if submission.status != "in_progress":
        return redirect(url_for("quiz.result", result_id=submission.id))

    if not _submission_owner_ok(submission):
        flash("Không thể truy cập phiên làm bài này.", "danger")
        return redirect(url_for("quiz.start_quiz", quiz_id=quiz.id))

    question_ids = session.get(f"question_order_{submission.id}") or [q.id for q in quiz.get_ordered_questions()]
    questions = [Question.query.get(qid) for qid in question_ids if Question.query.get(qid)]

    option_order = session.get(f"option_order_{submission.id}", {})
    ordered_options = {}
    for question in questions:
        ids = option_order.get(str(question.id)) or [
            opt.id for opt in question.options.order_by(Option.order_index.asc())
        ]
        ordered_options[question.id] = [Option.query.get(opt_id) for opt_id in ids if Option.query.get(opt_id)]

    return render_template(
        "quiz/take.html",
        quiz=quiz,
        submission=submission,
        questions=questions,
        ordered_options=ordered_options,
        duration_seconds=quiz.time_limit_minutes * 60,
    )


@quiz_bp.route("/<int:quiz_id>/submit", methods=["POST"])
def submit_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if quiz.class_id and not _has_class_access(quiz):
        if not current_user.is_authenticated:
            flash("Bạn cần đăng nhập để nộp bài thi của lớp.", "warning")
            return redirect(url_for("auth.login"))
        flash("Bạn không có quyền nộp bài cho đề thi này.", "danger")
        return redirect(url_for("quiz.library"))

    submission_id = session.get(f"active_submission_{quiz.id}")
    if not submission_id:
        flash("Phiên làm bài đã hết hiệu lực.", "warning")
        return redirect(url_for("quiz.start_quiz", quiz_id=quiz.id))

    submission = Submission.query.get_or_404(submission_id)
    if submission.status != "in_progress":
        return redirect(url_for("quiz.result", result_id=submission.id))
    if not _submission_owner_ok(submission):
        flash("Không thể nộp bài cho phiên này.", "danger")
        return redirect(url_for("quiz.start_quiz", quiz_id=quiz.id))

    question_ids = session.get(f"question_order_{submission.id}") or [q.id for q in quiz.get_ordered_questions()]
    questions = [Question.query.get(qid) for qid in question_ids if Question.query.get(qid)]

    for question in questions:
        answer = Answer(submission_id=submission.id, question_id=question.id)

        if question.type == "essay":
            essay_text = request.form.get(f"essay_{question.id}", "").strip()
            answer.essay_answer = essay_text or None
            image_file = request.files.get(f"essay_image_{question.id}")
            answer.essay_image_url = _save_essay_image(quiz.id, question.id, image_file)
            answer.is_correct = False
            answer.score_awarded = 0
        else:
            if question.type == "single":
                selected_raw = request.form.get(f"question_{question.id}")
                selected_ids = [int(selected_raw)] if selected_raw and selected_raw.isdigit() else []
            else:
                selected_ids = _parse_selected_ids(f"question_{question.id}")
                answer.essay_answer = ",".join(str(x) for x in selected_ids) if selected_ids else None

            if question.type == "single":
                answer.option_id = selected_ids[0] if selected_ids else None

            is_correct = question.evaluate_objective_answer(selected_ids)
            answer.is_correct = is_correct
            answer.score_awarded = question.points if is_correct else 0
            answer.feedback = question.get_explanation() if not is_correct else None

        db.session.add(answer)

    submission.submit()
    if all(q.type != "essay" for q in questions):
        submission.status = "graded"
    submission.recalculate_scores()

    db.session.commit()

    session.pop(f"active_submission_{quiz.id}", None)
    session.pop(f"question_order_{submission.id}", None)
    session.pop(f"option_order_{submission.id}", None)
    session.modified = True

    flash("Đã nộp bài thành công.", "success")
    return redirect(url_for("quiz.result", result_id=submission.id))


@quiz_bp.route("/result/<int:result_id>")
def result(result_id):
    submission = Submission.query.get_or_404(result_id)
    if not _submission_owner_ok(submission) and not (
        current_user.is_authenticated and current_user.is_teacher() and submission.quiz.teacher_id == current_user.id
    ):
        flash("Bạn không có quyền xem kết quả này.", "danger")
        return redirect(url_for("quiz.library") if current_user.is_authenticated else url_for("index"))

    user_answers = submission.answers.order_by(Answer.id.asc()).all()
    return render_template(
        "quiz/result.html",
        result=submission,
        quiz=submission.quiz,
        user_answers=user_answers,
    )


@quiz_bp.route("/history")
@login_required
def history():
    results = (
        Submission.query.filter(
            or_(
                Submission.student_id == current_user.id,
                and_(
                    Submission.student_id.is_(None),
                    Submission.student_email == current_user.email,
                ),
            )
        )
        .order_by(Submission.submitted_at.desc())
        .all()
    )
    return render_template("quiz/history.html", results=results)

