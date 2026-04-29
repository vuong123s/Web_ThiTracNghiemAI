"""
Script them du lieu mau cho QuizFlow (schema moi).
Chay: python seed_data.py
"""

from datetime import datetime, timedelta
import random

from app import create_app
from models import Answer, BankOption, QuestionBank, Quiz, Submission, User, db

app = create_app()

# Du lieu cau hoi mau - 10 cau dau cho Teacher1 (Toan), 10 cau sau cho Teacher2 (Khoa hoc)
SAMPLE_QUESTIONS = [
    # Toan hoc - Teacher 1 (10 cau)
    {
        "content": "Ket qua cua phep tinh 5 + 3 = ?",
        "option_a": "7",
        "option_b": "8",
        "option_c": "9",
        "option_d": "10",
        "correct_answer": "B",
        "topic": "Toan hoc",
        "difficulty": "easy",
        "explanation": "Phep cong co ban: 5 + 3 = 8",
    },
    {
        "content": "So nao la so chan?",
        "option_a": "3",
        "option_b": "5",
        "option_c": "6",
        "option_d": "7",
        "correct_answer": "C",
        "topic": "Toan hoc",
        "difficulty": "easy",
        "explanation": "So chan la so chia het cho 2. Chi co 6 chia het cho 2.",
    },
    {
        "content": "10 - 4 = ?",
        "option_a": "4",
        "option_b": "5",
        "option_c": "6",
        "option_d": "7",
        "correct_answer": "C",
        "topic": "Toan hoc",
        "difficulty": "easy",
        "explanation": "Phep tru co ban: 10 - 4 = 6",
    },
    {
        "content": "Dien tich hinh vuong canh 5cm la bao nhieu?",
        "option_a": "20 cm2",
        "option_b": "25 cm2",
        "option_c": "10 cm2",
        "option_d": "15 cm2",
        "correct_answer": "B",
        "topic": "Toan hoc",
        "difficulty": "medium",
        "explanation": "Dien tich hinh vuong = canh x canh = 5 x 5 = 25 cm2",
    },
    {
        "content": "Gia tri cua x trong phuong trinh 2x + 4 = 10 la?",
        "option_a": "2",
        "option_b": "3",
        "option_c": "4",
        "option_d": "5",
        "correct_answer": "B",
        "topic": "Toan hoc",
        "difficulty": "medium",
        "explanation": "2x + 4 = 10 -> 2x = 6 -> x = 3",
    },
    {
        "content": "Chu vi hinh tron ban kinh 7cm la? (pi ~ 3.14)",
        "option_a": "43.96 cm",
        "option_b": "21.98 cm",
        "option_c": "14 cm",
        "option_d": "49 cm",
        "correct_answer": "A",
        "topic": "Toan hoc",
        "difficulty": "medium",
        "explanation": "Chu vi = 2pi r = 2 x 3.14 x 7 = 43.96 cm",
    },
    {
        "content": "Dao ham cua ham so f(x) = x^3 + 2x^2 - 5x + 1 la?",
        "option_a": "3x^2 + 4x - 5",
        "option_b": "3x^2 + 2x - 5",
        "option_c": "x^2 + 4x - 5",
        "option_d": "3x^2 + 4x + 5",
        "correct_answer": "A",
        "topic": "Toan hoc",
        "difficulty": "hard",
        "explanation": "f'(x) = 3x^2 + 4x - 5",
    },
    {
        "content": "Tich phan (2x + 1) dx = ?",
        "option_a": "x^2 + x + C",
        "option_b": "x^2 + C",
        "option_c": "2x^2 + x + C",
        "option_d": "x^2 + x",
        "correct_answer": "A",
        "topic": "Toan hoc",
        "difficulty": "hard",
        "explanation": "Tich phan (2x + 1) dx = x^2 + x + C",
    },
    {
        "content": "log2(8) bang bao nhieu?",
        "option_a": "2",
        "option_b": "3",
        "option_c": "4",
        "option_d": "8",
        "correct_answer": "B",
        "topic": "Toan hoc",
        "difficulty": "medium",
        "explanation": "2^3 = 8 nen log2(8) = 3",
    },
    {
        "content": "Sin^2 x + Cos^2 x bang?",
        "option_a": "0",
        "option_b": "1",
        "option_c": "2",
        "option_d": "sinx.cosx",
        "correct_answer": "B",
        "topic": "Toan hoc",
        "difficulty": "easy",
        "explanation": "Dang thuc luong giac co ban: sin^2 x + cos^2 x = 1",
    },
    # Khoa hoc - Teacher 2 (10 cau)
    {
        "content": "Nuoc soi o nhiet do bao nhieu do C (o ap suat khi quyen)?",
        "option_a": "90 C",
        "option_b": "100 C",
        "option_c": "110 C",
        "option_d": "80 C",
        "correct_answer": "B",
        "topic": "Khoa hoc",
        "difficulty": "easy",
        "explanation": "Nuoc soi o 100 C trong dieu kien tieu chuan",
    },
    {
        "content": "Trai Dat quay quanh gi?",
        "option_a": "Mat Trang",
        "option_b": "Sao Hoa",
        "option_c": "Mat Troi",
        "option_d": "Sao Kim",
        "correct_answer": "C",
        "topic": "Khoa hoc",
        "difficulty": "easy",
        "explanation": "Trai Dat quay quanh Mat Troi theo quy dao elip",
    },
    {
        "content": "Cong thuc hoa hoc cua nuoc la gi?",
        "option_a": "H2O",
        "option_b": "CO2",
        "option_c": "NaCl",
        "option_d": "O2",
        "correct_answer": "A",
        "topic": "Khoa hoc",
        "difficulty": "easy",
        "explanation": "Nuoc co cong thuc H2O",
    },
    {
        "content": "Nguyen to nao chiem nhieu nhat trong khi quyen?",
        "option_a": "Oxy",
        "option_b": "Nito",
        "option_c": "Carbon dioxide",
        "option_d": "Argon",
        "correct_answer": "B",
        "topic": "Khoa hoc",
        "difficulty": "medium",
        "explanation": "Nito chiem khoang 78% khi quyen",
    },
    {
        "content": "Dinh luat bao toan nang luong phat bieu rang:",
        "option_a": "Nang luong co the tu sinh ra",
        "option_b": "Nang luong khong the chuyen hoa",
        "option_c": "Nang luong khong tu sinh ra va khong mat di",
        "option_d": "Nang luong luon giam",
        "correct_answer": "C",
        "topic": "Khoa hoc",
        "difficulty": "medium",
        "explanation": "Nang luong khong tu sinh ra, khong tu mat di",
    },
    {
        "content": "Toc do anh sang trong chan khong la khoang:",
        "option_a": "300,000 km/s",
        "option_b": "150,000 km/s",
        "option_c": "500,000 km/s",
        "option_d": "100,000 km/s",
        "correct_answer": "A",
        "topic": "Khoa hoc",
        "difficulty": "hard",
        "explanation": "Toc do anh sang c ~ 300,000 km/s",
    },
    {
        "content": "HTML la viet tat cua?",
        "option_a": "Hyper Text Markup Language",
        "option_b": "High Tech Modern Language",
        "option_c": "Hyper Transfer Markup Language",
        "option_d": "Home Tool Markup Language",
        "correct_answer": "A",
        "topic": "Tin hoc",
        "difficulty": "easy",
        "explanation": "HTML = HyperText Markup Language",
    },
    {
        "content": "1 Gigabyte bang bao nhieu Megabyte?",
        "option_a": "100 MB",
        "option_b": "500 MB",
        "option_c": "1000 MB",
        "option_d": "1024 MB",
        "correct_answer": "D",
        "topic": "Tin hoc",
        "difficulty": "medium",
        "explanation": "1 GB = 1024 MB (he nhi phan)",
    },
    {
        "content": "Gia toc trong truong tren Trai Dat xap xi bang:",
        "option_a": "9.8 m/s2",
        "option_b": "10.8 m/s2",
        "option_c": "8.9 m/s2",
        "option_d": "11 m/s2",
        "correct_answer": "A",
        "topic": "Khoa hoc",
        "difficulty": "medium",
        "explanation": "g ~ 9.8 m/s2",
    },
    {
        "content": "Nguyen to nao co ky hieu hoa hoc la Fe?",
        "option_a": "Flo",
        "option_b": "Sat",
        "option_c": "Dong",
        "option_d": "Kem",
        "correct_answer": "B",
        "topic": "Khoa hoc",
        "difficulty": "easy",
        "explanation": "Fe la ky hieu cua nguyen to Sat",
    },
]


def _ensure_user(email: str, full_name: str, role: str, password: str) -> User:
    user = User.query.filter_by(email=email).first()
    if user:
        return user
    user = User(email=email, full_name=full_name, role=role)
    user.set_password(password)
    db.session.add(user)
    return user


def _add_bank_question(teacher: User, payload: dict) -> QuestionBank:
    item = QuestionBank(
        teacher_id=teacher.id,
        text=payload["content"],
        type="single",
        category=payload.get("topic"),
        difficulty=payload.get("difficulty", "medium"),
        tags=None,
        explanation=payload.get("explanation") or None,
    )
    db.session.add(item)
    db.session.flush()

    correct_letter = (payload.get("correct_answer") or "").strip().upper()
    options = [
        ("A", payload.get("option_a")),
        ("B", payload.get("option_b")),
        ("C", payload.get("option_c")),
        ("D", payload.get("option_d")),
    ]
    for idx, (letter, text) in enumerate(options, start=1):
        if not text:
            continue
        db.session.add(
            BankOption(
                question_bank_id=item.id,
                text=text,
                is_correct=letter == correct_letter,
                order_index=idx,
            )
        )

    return item


def _create_quiz(
    teacher: User,
    title: str,
    description: str,
    bank_items: list[QuestionBank],
    minutes: int,
    is_shuffled: bool,
) -> Quiz:
    quiz = Quiz(
        title=title,
        description=description,
        time_limit_minutes=minutes,
        is_shuffled=is_shuffled,
        shuffle_options=True,
        is_published=True,
        allow_retake=True,
        teacher_id=teacher.id,
    )
    db.session.add(quiz)
    db.session.flush()

    for idx, bank_item in enumerate(bank_items, start=1):
        db.session.add(bank_item.clone_to_quiz(quiz.id, order_index=idx, created_by=teacher.id))

    return quiz


def _add_submission(
    student: User,
    quiz: Quiz,
    correct_count: int,
    submitted_at: datetime,
    attempt_no: int = 1,
) -> None:
    submission = Submission(
        quiz_id=quiz.id,
        student_id=student.id,
        student_name=student.full_name,
        student_email=student.email,
        status="graded",
        attempt_no=attempt_no,
        started_at=submitted_at - timedelta(minutes=quiz.time_limit_minutes or 30),
        submitted_at=submitted_at,
    )
    db.session.add(submission)
    db.session.flush()

    questions = quiz.get_ordered_questions()
    correct_count = min(correct_count, len(questions))

    for index, question in enumerate(questions, start=1):
        options = question.get_options_for_attempt(shuffle=False)
        correct_options = question.correct_options
        if index <= correct_count and correct_options:
            selected = correct_options[0]
        else:
            selected = next(
                (opt for opt in options if opt not in correct_options),
                options[0] if options else None,
            )

        is_correct = selected in correct_options if selected else False
        db.session.add(
            Answer(
                submission_id=submission.id,
                question_id=question.id,
                option_id=selected.id if selected else None,
                is_correct=is_correct,
                score_awarded=question.points if is_correct else 0,
                answered_at=submitted_at,
            )
        )

    submission.recalculate_scores()
    submission.status = "graded"


def seed_data() -> None:
    with app.app_context():
        if User.query.count() > 0 or Quiz.query.count() > 0:
            print("Du lieu da ton tai. Bo qua...")
            return

        print("Dang tao tai khoan mau...")
        teacher1 = _ensure_user("teacher1@quizflow.com", "Nguyen Van Thay", "teacher", "123456")
        teacher2 = _ensure_user("teacher2@quizflow.com", "Tran Thi Co", "teacher", "123456")

        students = [
            _ensure_user("student1@quizflow.com", "Le Van An", "student", "123456"),
            _ensure_user("student2@quizflow.com", "Pham Thi Binh", "student", "123456"),
            _ensure_user("student3@quizflow.com", "Hoang Van Cuong", "student", "123456"),
            _ensure_user("student4@quizflow.com", "Ngo Thi Dung", "student", "123456"),
            _ensure_user("student5@quizflow.com", "Vu Van Em", "student", "123456"),
        ]
        db.session.commit()
        print("✓ Da tao tai khoan mau")

        print("Dang tao ngan hang cau hoi...")
        teacher1_items = [_add_bank_question(teacher1, payload) for payload in SAMPLE_QUESTIONS[:10]]
        teacher2_items = [_add_bank_question(teacher2, payload) for payload in SAMPLE_QUESTIONS[10:]]
        db.session.commit()
        print(f"✓ Da them {len(SAMPLE_QUESTIONS)} cau hoi vao ngan hang")

        print("Dang tao bai thi mau...")
        quiz1 = _create_quiz(
            teacher1,
            "Kiem tra Toan co ban",
            "Bai kiem tra cac kien thuc toan hoc co ban",
            teacher1_items[:5],
            minutes=15,
            is_shuffled=False,
        )
        quiz2 = _create_quiz(
            teacher1,
            "On tap Giai tich",
            "Bai on tap ve dao ham va tich phan",
            teacher1_items[2:7],
            minutes=20,
            is_shuffled=True,
        )
        quiz3 = _create_quiz(
            teacher2,
            "Kiem tra Khoa hoc",
            "Bai kiem tra kien thuc khoa hoc tu nhien",
            teacher2_items[:5],
            minutes=15,
            is_shuffled=False,
        )
        quiz4 = _create_quiz(
            teacher2,
            "Tong hop Ly - Hoa - Tin",
            "Bai thi tong hop cac mon",
            teacher2_items[5:],
            minutes=20,
            is_shuffled=True,
        )
        db.session.commit()
        print("✓ Da tao 4 bai thi")

        print("Dang tao luot lam bai mau...")
        now = datetime.utcnow()
        _add_submission(students[0], quiz1, 4, now - timedelta(days=10))
        _add_submission(students[0], quiz2, 3, now - timedelta(days=8))
        _add_submission(students[1], quiz1, 5, now - timedelta(days=9))
        _add_submission(students[1], quiz3, 4, now - timedelta(days=4))
        _add_submission(students[2], quiz1, 3, now - timedelta(days=8), attempt_no=1)
        _add_submission(students[2], quiz1, 4, now - timedelta(days=6), attempt_no=2)
        _add_submission(students[3], quiz2, 2, now - timedelta(days=3))
        _add_submission(students[4], quiz4, 3, now - timedelta(days=1))
        db.session.commit()
        print("✓ Da tao du lieu ket qua")

        print("\n" + "=" * 50)
        print("HOAN THANH! Tai khoan mac dinh:")
        print("=" * 50)
        print("Teacher1: teacher1@quizflow.com / 123456")
        print("Teacher2: teacher2@quizflow.com / 123456")
        print("Student1: student1@quizflow.com / 123456")
        print("Student2: student2@quizflow.com / 123456")
        print("Student3: student3@quizflow.com / 123456")
        print("Student4: student4@quizflow.com / 123456")
        print("Student5: student5@quizflow.com / 123456")
        print("=" * 50)


if __name__ == "__main__":
    seed_data()
