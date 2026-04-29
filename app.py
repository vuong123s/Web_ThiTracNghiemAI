from datetime import datetime
import os

import pymysql
from flask import Flask, redirect, render_template, request, url_for
from flask_login import LoginManager, current_user
from sqlalchemy import and_, or_

from config import Config
from models import Question, Quiz, Submission, User, UserClass, db

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message = "Vui lòng đăng nhập để tiếp tục."
login_manager.login_message_category = "warning"


def ensure_database_exists(config_class: type[Config]) -> None:
    connection = pymysql.connect(
        host=config_class.MYSQL_HOST,
        port=int(config_class.MYSQL_PORT),
        user=config_class.MYSQL_USER,
        password=config_class.MYSQL_PASSWORD,
        charset="utf8mb4",
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{config_class.MYSQL_DATABASE}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
        connection.commit()
    finally:
        connection.close()


def _split_sql_statements(sql_text: str) -> list[str]:
    lines = []
    for line in sql_text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("--"):
            continue
        lines.append(line)
    merged = "\n".join(lines)

    statements = []
    current = []
    in_single = False
    in_double = False
    prev = ""

    for ch in merged:
        if ch == "'" and not in_double and prev != "\\":
            in_single = not in_single
        elif ch == '"' and not in_single and prev != "\\":
            in_double = not in_double

        if ch == ";" and not in_single and not in_double:
            stmt = "".join(current).strip()
            if stmt:
                statements.append(stmt)
            current = []
        else:
            current.append(ch)
        prev = ch

    last_stmt = "".join(current).strip()
    if last_stmt:
        statements.append(last_stmt)
    return statements


def ensure_ninequiz_schema(config_class: type[Config]) -> None:
    connection = pymysql.connect(
        host=config_class.MYSQL_HOST,
        port=int(config_class.MYSQL_PORT),
        user=config_class.MYSQL_USER,
        password=config_class.MYSQL_PASSWORD,
        database=config_class.MYSQL_DATABASE,
        charset="utf8mb4",
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = %s
                  AND table_name IN ('users', 'quizzes', 'questions')
                """,
                (config_class.MYSQL_DATABASE,),
            )
            tables = {row[0] for row in cursor.fetchall()}

            if "users" not in tables:
                return

            def _get_columns(table_name: str) -> set[str]:
                cursor.execute(
                    """
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_schema = %s
                      AND table_name = %s
                    """,
                    (config_class.MYSQL_DATABASE, table_name),
                )
                return {row[0] for row in cursor.fetchall()}

            user_columns = _get_columns("users")

            if "username" not in user_columns:
                cursor.execute("ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL")
                cursor.execute(
                    "UPDATE users SET username = CONCAT('user_', id) "
                    "WHERE username IS NULL OR username = ''"
                )
                cursor.execute("ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NOT NULL")

            if "email" not in user_columns:
                cursor.execute("ALTER TABLE users ADD COLUMN email VARCHAR(100) NULL")

            if "password_hash" not in user_columns:
                cursor.execute("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL")

            if "full_name" not in user_columns:
                cursor.execute("ALTER TABLE users ADD COLUMN full_name VARCHAR(100) NULL")

            if "role" not in user_columns:
                cursor.execute(
                    "ALTER TABLE users ADD COLUMN role "
                    "ENUM('teacher', 'student', 'admin') NOT NULL DEFAULT 'student'"
                )
            else:
                cursor.execute(
                    "ALTER TABLE users MODIFY COLUMN role "
                    "ENUM('teacher', 'student', 'admin') NOT NULL DEFAULT 'student'"
                )

            if "avatar_url" not in user_columns:
                cursor.execute("ALTER TABLE users ADD COLUMN avatar_url TEXT NULL")

            if "created_at" not in user_columns:
                cursor.execute(
                    "ALTER TABLE users ADD COLUMN created_at "
                    "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
                )

            if "updated_at" not in user_columns:
                cursor.execute(
                    "ALTER TABLE users ADD COLUMN updated_at "
                    "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                )

            if "quizzes" in tables:
                quiz_columns = _get_columns("quizzes")

                if "time_limit_minutes" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN time_limit_minutes INT NOT NULL DEFAULT 60"
                    )

                if "is_shuffled" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN is_shuffled BOOLEAN NOT NULL DEFAULT FALSE"
                    )

                if "shuffle_options" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN shuffle_options BOOLEAN NOT NULL DEFAULT FALSE"
                    )

                if "is_published" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT FALSE"
                    )

                if "allow_retake" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN allow_retake BOOLEAN NOT NULL DEFAULT FALSE"
                    )

                if "teacher_id" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN teacher_id INT NULL")

                if "class_id" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN class_id INT NULL")

                if "scheduled_at" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN scheduled_at DATETIME NULL")

                if "expires_at" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN expires_at DATETIME NULL")

                if "share_token" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN share_token VARCHAR(64) NULL")

                if "brand_logo_url" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN brand_logo_url TEXT NULL")

                if "brand_color" not in quiz_columns:
                    cursor.execute("ALTER TABLE quizzes ADD COLUMN brand_color VARCHAR(20) NULL")

                if "created_at" not in quiz_columns:
                    cursor.execute(
                        "ALTER TABLE quizzes ADD COLUMN created_at "
                        "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
                    )

                quiz_columns = _get_columns("quizzes")

                if "duration" in quiz_columns and "time_limit_minutes" in quiz_columns:
                    cursor.execute(
                        "UPDATE quizzes SET time_limit_minutes = duration "
                        "WHERE duration IS NOT NULL"
                    )

                if "is_random" in quiz_columns and "is_shuffled" in quiz_columns:
                    cursor.execute("UPDATE quizzes SET is_shuffled = is_random")

                if "is_active" in quiz_columns and "is_published" in quiz_columns:
                    cursor.execute("UPDATE quizzes SET is_published = is_active")

                if "created_by" in quiz_columns and "teacher_id" in quiz_columns:
                    cursor.execute(
                        "UPDATE quizzes SET teacher_id = created_by "
                        "WHERE teacher_id IS NULL"
                    )

                if "start_time" in quiz_columns and "scheduled_at" in quiz_columns:
                    cursor.execute(
                        "UPDATE quizzes SET scheduled_at = start_time "
                        "WHERE scheduled_at IS NULL"
                    )

                if "end_time" in quiz_columns and "expires_at" in quiz_columns:
                    cursor.execute(
                        "UPDATE quizzes SET expires_at = end_time "
                        "WHERE expires_at IS NULL"
                    )

            if "questions" in tables:
                question_columns = _get_columns("questions")

                if "quiz_id" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN quiz_id INT NULL")

                if "text" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN text TEXT NULL")

                if "image_url" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN image_url TEXT NULL")

                if "youtube_url" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN youtube_url VARCHAR(255) NULL")

                if "explanation" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN explanation TEXT NULL")

                if "type" not in question_columns:
                    cursor.execute(
                        "ALTER TABLE questions ADD COLUMN type "
                        "ENUM('single', 'multiple', 'essay') NOT NULL DEFAULT 'single'"
                    )

                if "points" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN points INT NOT NULL DEFAULT 1")

                if "order_index" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN order_index INT NOT NULL DEFAULT 0")

                if "topic" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN topic VARCHAR(100) NULL")

                if "difficulty" not in question_columns:
                    cursor.execute(
                        "ALTER TABLE questions ADD COLUMN difficulty "
                        "ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium'"
                    )

                if "created_by" not in question_columns:
                    cursor.execute("ALTER TABLE questions ADD COLUMN created_by INT NULL")

                if "created_at" not in question_columns:
                    cursor.execute(
                        "ALTER TABLE questions ADD COLUMN created_at "
                        "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
                    )

                if "updated_at" not in question_columns:
                    cursor.execute(
                        "ALTER TABLE questions ADD COLUMN updated_at "
                        "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                    )

                question_columns = _get_columns("questions")

                if "content" in question_columns and "text" in question_columns:
                    cursor.execute(
                        "UPDATE questions SET text = content "
                        "WHERE text IS NULL OR text = ''"
                    )
        connection.commit()
    finally:
        connection.close()


def create_app(config_class: type[Config] = Config) -> Flask:
    ensure_database_exists(config_class)
    ensure_ninequiz_schema(config_class)

    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)

    # Blueprints
    from routes.admin import admin_bp
    from routes.auth import auth_bp
    from routes.profile import profile_bp
    from routes.quiz import quiz_bp
    from routes.report import report_bp
    from routes.teacher import teacher_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(teacher_bp, url_prefix="/teacher")
    app.register_blueprint(quiz_bp, url_prefix="/quiz")
    app.register_blueprint(profile_bp, url_prefix="/profile")
    app.register_blueprint(report_bp, url_prefix="/report")

    @app.route("/")
    def index():
        if current_user.is_authenticated:
            return redirect(url_for("dashboard"))
        return render_template("landing.html")

    @app.route("/dashboard")
    def dashboard():
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login"))

        if current_user.is_admin():
            return redirect(url_for("admin.dashboard"))

        if current_user.is_teacher():
            my_quizzes = Quiz.query.filter_by(teacher_id=current_user.id).order_by(Quiz.created_at.desc())
            my_quiz_ids = [quiz.id for quiz in my_quizzes.all()]

            total_questions = Question.query.filter_by(created_by=current_user.id).count()
            total_quizzes = len(my_quiz_ids)
            recent_quizzes = my_quizzes.limit(5).all()

            if my_quiz_ids:
                recent_results = (
                    Submission.query.filter(
                        Submission.quiz_id.in_(my_quiz_ids),
                        Submission.status.in_(["submitted", "graded"]),
                    )
                    .order_by(Submission.submitted_at.desc())
                    .limit(10)
                    .all()
                )
            else:
                recent_results = []

            all_scores = [row.score_percent for row in recent_results if row.max_score > 0]
            avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0
            unique_students = {
                (row.student_id or row.display_student_email.lower())
                for row in recent_results
                if row.student_id or row.display_student_email
            }

            return render_template(
                "teacher/dashboard_v2.html",
                total_questions=total_questions,
                total_quizzes=total_quizzes,
                total_students=len(unique_students),
                total_results=len(recent_results),
                recent_quizzes=recent_quizzes,
                recent_results=recent_results,
                avg_score=avg_score,
            )

        # Student dashboard
        my_results = (
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

        completed_results = [row for row in my_results if row.status in ["submitted", "graded"]]
        avg_score = (
            sum(row.score_percent for row in completed_results) / len(completed_results)
            if completed_results
            else 0
        )
        highest_score = max((row.score_percent for row in completed_results), default=0)

        available_quizzes = [
            quiz
            for quiz in Quiz.query.filter_by(is_published=True).order_by(Quiz.created_at.desc()).all()
            if quiz.is_available(datetime.utcnow())
        ]

        if current_user.is_student():
            enrolled_class_ids = [
                row.class_id
                for row in UserClass.query.filter_by(user_id=current_user.id, status="approved").all()
            ]
            available_quizzes = [
                quiz
                for quiz in available_quizzes
                if (not quiz.class_id) or (quiz.class_id in enrolled_class_ids)
            ]

        return render_template(
            "dashboard_v2.html",
            recent_results=completed_results[:5],
            available_quizzes=available_quizzes[:6],
            recommended_quizzes=available_quizzes[:4],
            completed_count=len(completed_results),
            avg_score=avg_score / 10,  # keep legacy template scale if needed
            highest_score=highest_score / 10,
            weekly_progress=min(len(completed_results) * 20, 100),
            study_hours=len(completed_results),
            points_earned=int(sum(row.total_score for row in completed_results)),
            total_quizzes=len(available_quizzes),
            results=completed_results,
        )

    @app.route("/leaderboard")
    def leaderboard():
        quiz_id = request.args.get("quiz_id", type=int)
        quizzes = Quiz.query.filter_by(is_published=True).order_by(Quiz.created_at.desc()).all()

        base_query = Submission.query.filter(Submission.status.in_(["submitted", "graded"]))
        if quiz_id:
            base_query = base_query.filter_by(quiz_id=quiz_id)

        score_map: dict[str, dict] = {}
        for row in base_query.all():
            key = str(row.student_id) if row.student_id else f"guest:{row.display_student_email.lower()}"
            if key not in score_map:
                score_map[key] = {
                    "user_id": row.student_id,
                    "name": row.display_student_name,
                    "scores": [],
                }
            score_map[key]["scores"].append(row.score_percent / 10)

        leaderboard_data = []
        for item in score_map.values():
            scores = item["scores"]
            leaderboard_data.append(
                {
                    "user_id": item["user_id"],
                    "name": item["name"],
                    "total_quizzes": len(scores),
                    "avg_score": round(sum(scores) / len(scores), 2),
                    "highest_score": round(max(scores), 2),
                }
            )

        leaderboard_data.sort(key=lambda x: (-x["avg_score"], -x["highest_score"], x["name"]))

        user_position = None
        if current_user.is_authenticated and current_user.is_student():
            for idx, item in enumerate(leaderboard_data, start=1):
                if item["user_id"] == current_user.id:
                    user_position = {
                        "rank": idx,
                        "avg_score": item["avg_score"],
                        "highest_score": item["highest_score"],
                        "total_quizzes": item["total_quizzes"],
                    }
                    break

        return render_template(
            "leaderboard.html",
            leaderboard=leaderboard_data[:10],
            quizzes=quizzes,
            quiz_id=quiz_id,
            user_position=user_position,
        )

    @app.errorhandler(404)
    def not_found_error(error):
        return render_template("errors/404.html"), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template("errors/500.html"), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        return render_template("errors/403.html"), 403

    with app.app_context():
        db.create_all()
        seed_default_users()

    return app


def seed_default_users() -> None:
    if not User.query.filter_by(email="teacher@ninequiz.vn").first():
        teacher = User(
            username="teacher_default",
            email="teacher@ninequiz.vn",
            full_name="Giáo viên mặc định",
            role="teacher",
        )
        teacher.set_password("123456")
        db.session.add(teacher)

    if not User.query.filter_by(email="student@ninequiz.vn").first():
        student = User(
            username="student_default",
            email="student@ninequiz.vn",
            full_name="Học sinh mặc định",
            role="student",
        )
        student.set_password("123456")
        db.session.add(student)

    db.session.commit()


@login_manager.user_loader
def load_user(user_id: str):
    return db.session.get(User, int(user_id))


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)

