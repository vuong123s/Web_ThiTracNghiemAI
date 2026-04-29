from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from sqlalchemy import and_, or_

from forms import ChangePasswordForm, ProfileForm
from models import QuestionBank, Quiz, Submission, db

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/")
@login_required
def view():
    stats = {}

    if current_user.is_student():
        results = (
            Submission.query.filter(
                or_(
                    Submission.student_id == current_user.id,
                    and_(
                        Submission.student_id.is_(None),
                        Submission.student_email == current_user.email,
                    ),
                ),
                Submission.status.in_(["submitted", "graded"]),
            )
            .order_by(Submission.submitted_at.desc())
            .all()
        )

        avg_score = round(sum(row.score_percent for row in results) / len(results), 2) if results else 0
        highest_score = round(max((row.score_percent for row in results), default=0), 2)
        passed_quizzes = sum(1 for row in results if row.is_passed)

        stats = {
            "total_quizzes": len(results),
            "avg_score": avg_score,
            "highest_score": highest_score,
            "passed_quizzes": passed_quizzes,
        }

    elif current_user.is_teacher():
        quizzes = Quiz.query.filter_by(teacher_id=current_user.id).all()
        quiz_ids = [quiz.id for quiz in quizzes]
        total_attempts = (
            Submission.query.filter(
                Submission.quiz_id.in_(quiz_ids),
                Submission.status.in_(["submitted", "graded"]),
            ).count()
            if quiz_ids
            else 0
        )
        unique_students = set()
        if quiz_ids:
            rows = Submission.query.filter(
                Submission.quiz_id.in_(quiz_ids),
                Submission.status.in_(["submitted", "graded"]),
            ).all()
            for row in rows:
                unique_students.add(row.student_id or row.display_student_email.lower())

        stats = {
            "total_questions": QuestionBank.query.filter_by(teacher_id=current_user.id).count(),
            "total_quizzes": len(quizzes),
            "total_students": len(unique_students),
            "total_attempts": total_attempts,
        }

    return render_template("profile/view.html", user=current_user, stats=stats)


@profile_bp.route("/edit", methods=["GET", "POST"])
@login_required
def edit():
    form = ProfileForm(original_email=current_user.email, obj=current_user)

    if form.validate_on_submit():
        current_user.full_name = form.full_name.data
        current_user.email = form.email.data
        db.session.commit()
        flash("Cập nhật thông tin thành công!", "success")
        return redirect(url_for("profile.view"))

    return render_template("profile/edit.html", form=form)


@profile_bp.route("/change-password", methods=["GET", "POST"])
@login_required
def change_password():
    form = ChangePasswordForm()

    if form.validate_on_submit():
        if not current_user.check_password(form.current_password.data):
            flash("Mật khẩu hiện tại không đúng.", "danger")
            return render_template("profile/change_password.html", form=form)

        current_user.set_password(form.new_password.data)
        db.session.commit()
        flash("Đổi mật khẩu thành công!", "success")
        return redirect(url_for("profile.view"))

    return render_template("profile/change_password.html", form=form)


@profile_bp.route("/history")
@login_required
def history():
    if not current_user.is_student():
        flash("Chức năng này chỉ dành cho học sinh.", "warning")
        return redirect(url_for("profile.view"))

    page = request.args.get("page", 1, type=int)
    results = (
        Submission.query.filter(
            or_(
                Submission.student_id == current_user.id,
                and_(
                    Submission.student_id.is_(None),
                    Submission.student_email == current_user.email,
                ),
            ),
            Submission.status.in_(["submitted", "graded"]),
        )
        .order_by(Submission.submitted_at.desc())
        .paginate(page=page, per_page=10, error_out=False)
    )

    return render_template("profile/history.html", results=results)
