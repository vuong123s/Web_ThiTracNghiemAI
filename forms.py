from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import (
    BooleanField,
    FloatField,
    IntegerField,
    PasswordField,
    SelectField,
    StringField,
    SubmitField,
    TextAreaField,
)
from wtforms.validators import (
    DataRequired,
    Email,
    EqualTo,
    Length,
    NumberRange,
    Optional,
    ValidationError,
)

from models import User


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Mật khẩu", validators=[DataRequired()])
    remember = BooleanField("Ghi nhớ đăng nhập")


class RegisterForm(FlaskForm):
    full_name = StringField("Họ và tên", validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField(
        "Mật khẩu",
        validators=[
            DataRequired(),
            Length(min=6, message="Mật khẩu phải có ít nhất 6 ký tự"),
        ],
    )
    confirm_password = PasswordField(
        "Xác nhận mật khẩu",
        validators=[
            DataRequired(),
            EqualTo("password", message="Mật khẩu xác nhận không khớp"),
        ],
    )
    role = SelectField(
        "Vai trò",
        choices=[
            ("student", "Học sinh"),
            ("teacher", "Giáo viên"),
        ],
        default="student",
    )

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("Email này đã được sử dụng.")


class ProfileForm(FlaskForm):
    full_name = StringField("Họ và tên", validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField("Email", validators=[DataRequired(), Email()])

    def __init__(self, original_email=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.original_email = original_email

    def validate_email(self, email):
        if self.original_email and email.data != self.original_email:
            user = User.query.filter_by(email=email.data).first()
            if user:
                raise ValidationError("Email này đã được sử dụng.")


class ChangePasswordForm(FlaskForm):
    current_password = PasswordField("Mật khẩu hiện tại", validators=[DataRequired()])
    new_password = PasswordField(
        "Mật khẩu mới",
        validators=[
            DataRequired(),
            Length(min=6, message="Mật khẩu phải có ít nhất 6 ký tự"),
        ],
    )
    confirm_password = PasswordField(
        "Xác nhận mật khẩu mới",
        validators=[
            DataRequired(),
            EqualTo("new_password", message="Mật khẩu xác nhận không khớp"),
        ],
    )


class QuestionForm(FlaskForm):
    content = TextAreaField("Nội dung câu hỏi", validators=[DataRequired(), Length(min=10)])
    option_a = StringField("Đáp án A", validators=[DataRequired(), Length(max=500)])
    option_b = StringField("Đáp án B", validators=[DataRequired(), Length(max=500)])
    option_c = StringField("Đáp án C", validators=[DataRequired(), Length(max=500)])
    option_d = StringField("Đáp án D", validators=[DataRequired(), Length(max=500)])
    correct_answer = SelectField(
        "Đáp án đúng",
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")],
        validators=[DataRequired()],
    )
    explanation = TextAreaField("Giải thích đáp án", validators=[Optional(), Length(max=1000)])
    topic = StringField("Chủ đề", validators=[Optional(), Length(max=100)])
    difficulty = SelectField(
        "Độ khó",
        choices=[
            ("easy", "Dễ"),
            ("medium", "Trung bình"),
            ("hard", "Khó"),
        ],
        default="medium",
    )


class QuizForm(FlaskForm):
    title = StringField("Tiêu đề", validators=[DataRequired(), Length(max=200)])
    description = TextAreaField("Mô tả")
    topic = StringField("Chủ đề", validators=[Optional(), Length(max=100)])
    difficulty = SelectField(
        "Độ khó",
        choices=[
            ("easy", "Dễ"),
            ("medium", "Trung bình"),
            ("hard", "Khó"),
            ("mixed", "Hỗn hợp"),
        ],
        default="medium",
    )
    duration_minutes = IntegerField(
        "Thời gian (phút)",
        validators=[
            DataRequired(),
            NumberRange(min=1, max=180, message="Thời gian từ 1-180 phút"),
        ],
        default=30,
    )
    question_count = IntegerField(
        "Số câu hỏi",
        validators=[
            DataRequired(),
            NumberRange(min=1, max=100, message="Số câu từ 1-100"),
        ],
        default=10,
    )
    max_attempts = IntegerField(
        "Số lần thi tối đa (0 = không giới hạn)",
        validators=[NumberRange(min=0, max=100)],
        default=0,
    )
    is_random = BooleanField("Random thứ tự câu hỏi", default=False)
    pass_score = FloatField("Điểm đạt", validators=[NumberRange(min=0, max=10)], default=5.0)
    is_active = BooleanField("Kích hoạt", default=True)


class UserForm(FlaskForm):
    full_name = StringField("Họ và tên", validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Mật khẩu", validators=[Optional(), Length(min=6)])
    role = SelectField(
        "Vai trò",
        choices=[
            ("student", "Học sinh"),
            ("teacher", "Giáo viên"),
            ("admin", "Quản trị viên"),
        ],
    )


class ImportQuestionsForm(FlaskForm):
    file = FileField(
        "File Excel",
        validators=[
            DataRequired(),
            FileAllowed(["xlsx", "xls"], "Chỉ chấp nhận file Excel!"),
        ],
    )
    topic = StringField("Chủ đề mặc định", validators=[Optional(), Length(max=100)])


class ClassroomForm(FlaskForm):
    name = StringField("Tên lớp", validators=[DataRequired(), Length(max=100)])
    description = TextAreaField("Mô tả", validators=[Optional(), Length(max=1000)])
    submit = SubmitField("Lưu lớp học")


class QuestionBankForm(FlaskForm):
    text = TextAreaField("Nội dung câu hỏi", validators=[DataRequired(), Length(min=5)])
    type = SelectField(
        "Loại câu hỏi",
        choices=[
            ("single", "Single choice"),
            ("multiple", "Multiple choice"),
            ("essay", "Essay"),
        ],
        default="single",
    )
    category = StringField("Chủ đề", validators=[Optional(), Length(max=100)])
    difficulty = SelectField(
        "Độ khó",
        choices=[("easy", "Dễ"), ("medium", "Trung bình"), ("hard", "Khó")],
        default="medium",
    )
    tags = StringField("Tags", validators=[Optional(), Length(max=255)])
    explanation = TextAreaField("Giải thích đáp án", validators=[Optional(), Length(max=2000)])

    option_a = StringField("Đáp án A", validators=[Optional(), Length(max=1000)])
    option_b = StringField("Đáp án B", validators=[Optional(), Length(max=1000)])
    option_c = StringField("Đáp án C", validators=[Optional(), Length(max=1000)])
    option_d = StringField("Đáp án D", validators=[Optional(), Length(max=1000)])
    correct_answers = StringField(
        "Đáp án đúng (A hoặc A,B)",
        validators=[Optional(), Length(max=20)],
    )
    submit = SubmitField("Lưu câu hỏi")


class ImportBankForm(FlaskForm):
    file = FileField(
        "File import",
        validators=[
            DataRequired(),
            FileAllowed(["xlsx", "xls", "docx"], "Chỉ hỗ trợ Excel/Word (.xlsx/.xls/.docx)"),
        ],
    )
    default_category = StringField("Chủ đề mặc định", validators=[Optional(), Length(max=100)])
    default_difficulty = SelectField(
        "Độ khó mặc định",
        choices=[("easy", "Dễ"), ("medium", "Trung bình"), ("hard", "Khó")],
        default="medium",
    )
    submit = SubmitField("Import")


class QuizBuilderForm(FlaskForm):
    title = StringField("Tiêu đề đề thi", validators=[DataRequired(), Length(max=200)])
    description = TextAreaField("Mô tả", validators=[Optional(), Length(max=2000)])
    class_id = SelectField("Lớp học", coerce=int, validators=[Optional()])
    time_limit_minutes = IntegerField(
        "Thời gian (phút)",
        validators=[DataRequired(), NumberRange(min=1, max=300)],
        default=60,
    )
    is_shuffled = BooleanField("Trộn thứ tự câu hỏi", default=True)
    shuffle_options = BooleanField("Trộn thứ tự đáp án", default=True)
    is_published = BooleanField("Công khai đề thi", default=False)
    allow_retake = BooleanField("Cho phép làm lại", default=False)
    scheduled_at = StringField("Mở thi (YYYY-MM-DD HH:MM)", validators=[Optional(), Length(max=25)])
    expires_at = StringField("Đóng thi (YYYY-MM-DD HH:MM)", validators=[Optional(), Length(max=25)])
    brand_logo_url = StringField("Logo URL", validators=[Optional(), Length(max=500)])
    brand_color = StringField("Brand color", validators=[Optional(), Length(max=20)])

    source_mode = SelectField(
        "Nguồn câu hỏi",
        choices=[("selected", "Chọn thủ công"), ("random", "Sinh ngẫu nhiên từ ngân hàng")],
        default="selected",
    )
    random_category = StringField("Chủ đề lọc", validators=[Optional(), Length(max=100)])
    random_difficulty = SelectField(
        "Độ khó lọc",
        choices=[("", "Tất cả"), ("easy", "Dễ"), ("medium", "Trung bình"), ("hard", "Khó")],
        default="",
    )
    random_count = IntegerField(
        "Số câu random",
        validators=[Optional(), NumberRange(min=1, max=200)],
        default=10,
    )
    submit = SubmitField("Lưu đề thi")


class DocumentUploadForm(FlaskForm):
    title = StringField("Tiêu đề tài liệu", validators=[DataRequired(), Length(max=200)])
    file = FileField(
        "Tệp tài liệu",
        validators=[
            DataRequired(),
            FileAllowed(
                ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "mov", "mkv"],
                "Chỉ hỗ trợ file tài liệu/video phổ biến",
            ),
        ],
    )
    submit = SubmitField("Upload")


class EssayGradingForm(FlaskForm):
    score_awarded = IntegerField(
        "Điểm chấm",
        validators=[DataRequired(), NumberRange(min=0, max=100)],
    )
    feedback = TextAreaField("Nhận xét", validators=[Optional(), Length(max=3000)])
    submit = SubmitField("Lưu chấm điểm")


class QuizAccessForm(FlaskForm):
    student_name = StringField("Họ và tên", validators=[DataRequired(), Length(max=100)])
    student_email = StringField("Email", validators=[DataRequired(), Email(), Length(max=100)])
    submit = SubmitField("Bắt đầu làm bài")


class JoinClassForm(FlaskForm):
    join_code = StringField("Mã lớp", validators=[DataRequired(), Length(min=4, max=10)])
    submit = SubmitField("Tham gia lớp")


class AIGenerateQuestionsForm(FlaskForm):
    provider = SelectField(
        "AI Provider",
        choices=[("openai", "OpenAI"), ("gemini", "Gemini")],
        default="openai",
    )
    topic = StringField("Chủ đề", validators=[DataRequired(), Length(min=3, max=200)])
    category = StringField("Danh mục lưu", validators=[Optional(), Length(max=100)])
    difficulty = SelectField(
        "Độ khó",
        choices=[("easy", "Dễ"), ("medium", "Trung bình"), ("hard", "Khó")],
        default="medium",
    )
    question_count = IntegerField(
        "Số câu hỏi",
        validators=[DataRequired(), NumberRange(min=5, max=10)],
        default=5,
    )
    submit = SubmitField("Tạo câu hỏi bằng AI")

