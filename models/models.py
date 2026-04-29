from __future__ import annotations

import random
import secrets
import string
from datetime import datetime

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(
        db.String(50),
        unique=True,
        nullable=False,
        default=lambda: f"user_{secrets.token_hex(4)}",
    )
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    role = db.Column(
        db.Enum("teacher", "student", "admin", name="user_role"),
        nullable=False,
        default="student",
    )
    avatar_url = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    classes_taught = db.relationship(
        "Classroom",
        back_populates="teacher",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    class_memberships = db.relationship(
        "UserClass",
        back_populates="user",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    quizzes = db.relationship(
        "Quiz", back_populates="teacher", lazy="dynamic", cascade="all, delete-orphan"
    )
    created_questions = db.relationship(
        "Question",
        back_populates="creator",
        lazy="dynamic",
        foreign_keys="Question.created_by",
    )
    submissions = db.relationship("Submission", back_populates="student", lazy="dynamic")
    question_bank_items = db.relationship(
        "QuestionBank",
        back_populates="teacher",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    uploaded_documents = db.relationship(
        "ClassDocument",
        back_populates="teacher",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @property
    def display_name(self) -> str:
        return self.full_name or self.username

    def is_teacher(self) -> bool:
        return self.role == "teacher"

    def is_student(self) -> bool:
        return self.role == "student"

    def is_admin(self) -> bool:
        return self.role == "admin"

    def can_manage_questions(self) -> bool:
        return self.is_teacher() or self.is_admin()

    def can_manage_quizzes(self) -> bool:
        return self.is_teacher() or self.is_admin()

    def __repr__(self) -> str:
        return f"<User {self.username}:{self.role}>"


class Classroom(db.Model):
    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    join_code = db.Column(db.String(10), unique=True, nullable=False, index=True)
    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    teacher = db.relationship("User", back_populates="classes_taught")
    memberships = db.relationship(
        "UserClass",
        back_populates="classroom",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    quizzes = db.relationship("Quiz", back_populates="classroom", lazy="dynamic")
    documents = db.relationship(
        "ClassDocument",
        back_populates="classroom",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    @staticmethod
    def generate_join_code(length: int = 6) -> str:
        alphabet = string.ascii_uppercase + string.digits
        while True:
            code = "".join(random.choice(alphabet) for _ in range(length))
            if not Classroom.query.filter_by(join_code=code).first():
                return code

    @property
    def approved_students(self) -> list[User]:
        return [item.user for item in self.memberships.filter_by(status="approved").all()]

    def __repr__(self) -> str:
        return f"<Classroom {self.name}>"


class UserClass(db.Model):
    __tablename__ = "user_class"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    class_id = db.Column(
        db.Integer,
        db.ForeignKey("classes.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    status = db.Column(
        db.Enum("pending", "approved", name="class_membership_status"),
        nullable=False,
        default="pending",
        index=True,
    )
    enrolled_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", back_populates="class_memberships")
    classroom = db.relationship("Classroom", back_populates="memberships")

    __table_args__ = (
        db.UniqueConstraint("user_id", "class_id", name="uq_user_class_user_class"),
    )

    def __repr__(self) -> str:
        return f"<UserClass user={self.user_id} class={self.class_id} status={self.status}>"


class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    time_limit_minutes = db.Column(db.Integer, nullable=False, default=60)
    is_shuffled = db.Column(db.Boolean, nullable=False, default=False)
    shuffle_options = db.Column(db.Boolean, nullable=False, default=False)
    is_published = db.Column(db.Boolean, nullable=False, default=False, index=True)
    allow_retake = db.Column(db.Boolean, nullable=False, default=False)
    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    class_id = db.Column(
        db.Integer,
        db.ForeignKey("classes.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )
    scheduled_at = db.Column(db.DateTime, nullable=True, index=True)
    expires_at = db.Column(db.DateTime, nullable=True, index=True)
    share_token = db.Column(db.String(64), unique=True, nullable=True, index=True)
    brand_logo_url = db.Column(db.Text, nullable=True)
    brand_color = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    teacher = db.relationship("User", back_populates="quizzes")
    classroom = db.relationship("Classroom", back_populates="quizzes")
    questions = db.relationship(
        "Question", back_populates="quiz", lazy="dynamic", cascade="all, delete-orphan"
    )
    submissions = db.relationship(
        "Submission",
        back_populates="quiz",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def is_available(self, now: datetime | None = None) -> bool:
        if not self.is_published:
            return False
        check_time = now or datetime.utcnow()
        if self.scheduled_at and check_time < self.scheduled_at:
            return False
        if self.expires_at and check_time > self.expires_at:
            return False
        return True

    def get_ordered_questions(self) -> list["Question"]:
        return self.questions.order_by(Question.order_index.asc(), Question.id.asc()).all()

    def get_questions_for_attempt(self, seed: int | None = None) -> list["Question"]:
        questions = self.get_ordered_questions()
        if self.is_shuffled and len(questions) > 1:
            rng = random.Random(seed)
            rng.shuffle(questions)
        return questions

    def ensure_share_token(self) -> str:
        if self.share_token:
            return self.share_token
        while True:
            token = secrets.token_urlsafe(18)
            if not Quiz.query.filter_by(share_token=token).first():
                self.share_token = token
                return token

    @property
    def max_score(self) -> int:
        return sum(q.points for q in self.questions.all())

    def __repr__(self) -> str:
        return f"<Quiz {self.id}:{self.title}>"


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(
        db.Integer,
        db.ForeignKey("quizzes.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, nullable=True)
    youtube_url = db.Column(db.String(255), nullable=True)
    explanation = db.Column(db.Text, nullable=True)
    type = db.Column(
        db.Enum("single", "multiple", "essay", name="question_type"),
        nullable=False,
        default="single",
        index=True,
    )
    points = db.Column(db.Integer, nullable=False, default=1)
    order_index = db.Column(db.Integer, nullable=False, default=0)
    topic = db.Column(db.String(100), nullable=True, index=True)
    difficulty = db.Column(
        db.Enum("easy", "medium", "hard", name="question_difficulty"),
        nullable=False,
        default="medium",
        index=True,
    )
    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    quiz = db.relationship("Quiz", back_populates="questions")
    creator = db.relationship("User", back_populates="created_questions")
    options = db.relationship(
        "Option", back_populates="question", lazy="dynamic", cascade="all, delete-orphan"
    )
    answers = db.relationship(
        "Answer", back_populates="question", lazy="dynamic", cascade="all, delete-orphan"
    )

    @property
    def correct_options(self) -> list["Option"]:
        return self.options.filter_by(is_correct=True).order_by(Option.order_index.asc()).all()

    @property
    def correct_option_ids(self) -> set[int]:
        return {opt.id for opt in self.correct_options}

    def get_options_for_attempt(self, shuffle: bool = False, seed: int | None = None) -> list["Option"]:
        options = self.options.order_by(Option.order_index.asc(), Option.id.asc()).all()
        if shuffle and len(options) > 1:
            rng = random.Random(seed)
            rng.shuffle(options)
        return options

    def evaluate_objective_answer(self, selected_option_ids: list[int] | None) -> bool:
        if self.type == "essay":
            return False
        selected = set(selected_option_ids or [])
        if self.type == "single":
            return selected == self.correct_option_ids and len(selected) == 1
        return selected == self.correct_option_ids

    def get_explanation(self) -> str:
        if self.explanation:
            return self.explanation
        correct_text = ", ".join([opt.text for opt in self.correct_options])
        if not correct_text:
            return "No explanation available."
        return f"Correct answer: {correct_text}"

    def __repr__(self) -> str:
        return f"<Question {self.id} quiz={self.quiz_id}>"


class Option(db.Model):
    __tablename__ = "options"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(
        db.Integer,
        db.ForeignKey("questions.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False, default=False, index=True)
    order_index = db.Column(db.Integer, nullable=False, default=0)

    question = db.relationship("Question", back_populates="options")
    answers = db.relationship("Answer", back_populates="option", lazy="dynamic")

    @property
    def label(self) -> str:
        # 1 -> A, 2 -> B, ...
        index = max(self.order_index, 1)
        return chr(ord("A") + index - 1)

    def __repr__(self) -> str:
        return f"<Option {self.id} question={self.question_id}>"


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(
        db.Integer,
        db.ForeignKey("quizzes.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )
    student_name = db.Column(db.String(100), nullable=True)
    student_email = db.Column(db.String(100), nullable=True, index=True)
    total_score = db.Column(db.Integer, nullable=False, default=0)
    max_score = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(
        db.Enum("in_progress", "submitted", "graded", name="submission_status"),
        nullable=False,
        default="in_progress",
        index=True,
    )
    attempt_no = db.Column(db.Integer, nullable=False, default=1)
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime, nullable=True, index=True)
    ip_address = db.Column(db.String(45), nullable=True)

    __table_args__ = (
        db.UniqueConstraint(
            "quiz_id", "student_id", "attempt_no", name="uq_submissions_quiz_student_attempt"
        ),
    )

    quiz = db.relationship("Quiz", back_populates="submissions")
    student = db.relationship("User", back_populates="submissions")
    answers = db.relationship(
        "Answer", back_populates="submission", lazy="dynamic", cascade="all, delete-orphan"
    )

    @property
    def display_student_name(self) -> str:
        if self.student and self.student.display_name:
            return self.student.display_name
        return self.student_name or "Guest"

    @property
    def display_student_email(self) -> str:
        if self.student and self.student.email:
            return self.student.email
        return self.student_email or ""

    @property
    def score_percent(self) -> float:
        if self.max_score <= 0:
            return 0.0
        return round((self.total_score / self.max_score) * 100, 2)

    @property
    def is_passed(self) -> bool:
        return self.score_percent >= 50

    def submit(self) -> None:
        self.status = "submitted"
        self.submitted_at = datetime.utcnow()

    def recalculate_scores(self) -> None:
        rows = self.answers.all()
        question_map = {row.question_id: row.question for row in rows}

        self.max_score = sum(q.points for q in question_map.values())

        total = 0
        for row in rows:
            question = row.question
            if question.type == "essay":
                total += max(row.score_awarded or 0, 0)
            elif row.is_correct:
                total += question.points
        self.total_score = total

    def get_time_spent_seconds(self) -> int:
        if not self.started_at:
            return 0
        end_time = self.submitted_at or datetime.utcnow()
        return max(int((end_time - self.started_at).total_seconds()), 0)

    def __repr__(self) -> str:
        return f"<Submission {self.id} quiz={self.quiz_id} score={self.total_score}/{self.max_score}>"


class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(
        db.Integer,
        db.ForeignKey("submissions.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id = db.Column(
        db.Integer,
        db.ForeignKey("questions.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    option_id = db.Column(
        db.Integer,
        db.ForeignKey("options.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=True,
        index=True,
    )
    essay_answer = db.Column(db.Text, nullable=True)
    essay_image_url = db.Column(db.Text, nullable=True)
    is_correct = db.Column(db.Boolean, nullable=False, default=False, index=True)
    score_awarded = db.Column(db.Integer, nullable=False, default=0)
    feedback = db.Column(db.Text, nullable=True)
    answered_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("submission_id", "question_id", name="uq_answers_submission_question"),
    )

    submission = db.relationship("Submission", back_populates="answers")
    question = db.relationship("Question", back_populates="answers")
    option = db.relationship("Option", back_populates="answers")

    def apply_manual_grading(self, score: int, feedback: str | None = None) -> None:
        self.score_awarded = max(score, 0)
        if feedback is not None:
            self.feedback = feedback

    def __repr__(self) -> str:
        return f"<Answer {self.id} submission={self.submission_id} question={self.question_id}>"


class QuestionBank(db.Model):
    __tablename__ = "question_bank"

    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    text = db.Column(db.Text, nullable=False)
    type = db.Column(
        db.Enum("single", "multiple", "essay", name="bank_question_type"),
        nullable=False,
        default="single",
    )
    category = db.Column(db.String(100), nullable=True, index=True)
    difficulty = db.Column(
        db.Enum("easy", "medium", "hard", name="bank_question_difficulty"),
        nullable=False,
        default="medium",
        index=True,
    )
    tags = db.Column(db.String(255), nullable=True)
    explanation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    teacher = db.relationship("User", back_populates="question_bank_items")
    options = db.relationship(
        "BankOption",
        back_populates="question_bank",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def clone_to_quiz(self, quiz_id: int, order_index: int = 0, created_by: int | None = None) -> "Question":
        question = Question(
            quiz_id=quiz_id,
            text=self.text,
            type=self.type,
            points=1,
            order_index=order_index,
            topic=self.category,
            difficulty=self.difficulty,
            created_by=created_by,
            explanation=self.explanation,
        )
        for opt in self.options.order_by(BankOption.order_index.asc()).all():
            question.options.append(
                Option(text=opt.text, is_correct=opt.is_correct, order_index=opt.order_index)
            )
        return question

    def __repr__(self) -> str:
        return f"<QuestionBank {self.id} teacher={self.teacher_id}>"


class BankOption(db.Model):
    __tablename__ = "bank_options"

    id = db.Column(db.Integer, primary_key=True)
    question_bank_id = db.Column(
        db.Integer,
        db.ForeignKey("question_bank.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False, default=False, index=True)
    order_index = db.Column(db.Integer, nullable=False, default=0)

    question_bank = db.relationship("QuestionBank", back_populates="options")

    @property
    def label(self) -> str:
        index = max(self.order_index, 1)
        return chr(ord("A") + index - 1)

    def __repr__(self) -> str:
        return f"<BankOption {self.id} bank_question={self.question_bank_id}>"


class ClassDocument(db.Model):
    __tablename__ = "class_documents"

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(
        db.Integer,
        db.ForeignKey("classes.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
        index=True,
    )
    title = db.Column(db.String(200), nullable=False)
    file_url = db.Column(db.Text, nullable=True)
    file_type = db.Column(db.String(50), nullable=True, index=True)
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    classroom = db.relationship("Classroom", back_populates="documents")
    teacher = db.relationship("User", back_populates="uploaded_documents")

    def __repr__(self) -> str:
        return f"<ClassDocument {self.id} class={self.class_id}>"


# ---------------------------------------------------------------------------
# Legacy aliases so existing imports keep working while routes are refactored.
# ---------------------------------------------------------------------------
Result = Submission
UserAnswer = Answer
Class = Classroom


class QuizQuestion:
    """
    Deprecated compatibility placeholder.
    The new schema stores quiz-question relation directly in questions.quiz_id.
    """


