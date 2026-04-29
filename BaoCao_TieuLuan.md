# BÁO CÁO TIỂU LUẬN
# WEBSITE THI TRẮC NGHIỆM TRỰC TUYẾN
## QuizFlow - Hệ Thống Quản Lý Bài Thi Trắc Nghiệm

---

## MỤC LỤC

1. [Mở đầu](#1-mở-đầu)
2. [Phân tích yêu cầu](#2-phân-tích-yêu-cầu)
3. [Thiết kế cơ sở dữ liệu](#3-thiết-kế-cơ-sở-dữ-liệu)
4. [Thiết kế hệ thống](#4-thiết-kế-hệ-thống)
5. [Các chức năng chính](#5-các-chức-năng-chính)
6. [Các chức năng bổ sung](#6-các-chức-năng-bổ-sung)
7. [Hướng dẫn cài đặt và sử dụng](#7-hướng-dẫn-cài-đặt-và-sử-dụng)
8. [Kết luận và hướng phát triển](#8-kết-luận-và-hướng-phát-triển)

---

## 1. MỞ ĐẦU

### 1.1 Lý do chọn đề tài

Trong bối cảnh chuyển đổi số và giáo dục 4.0, việc ứng dụng công nghệ thông tin vào hoạt động dạy và học ngày càng trở nên quan trọng. Đặc biệt, phương pháp đánh giá bằng hình thức trắc nghiệm trực tuyến mang lại nhiều lợi ích:

- **Tiết kiệm thời gian**: Chấm điểm tự động, kết quả ngay lập tức
- **Khách quan**: Loại bỏ yếu tố chủ quan trong đánh giá
- **Linh hoạt**: Học sinh có thể thi mọi lúc, mọi nơi
- **Quản lý hiệu quả**: Thống kê, phân tích kết quả dễ dàng
- **Thân thiện môi trường**: Giảm thiểu sử dụng giấy

Từ những lý do trên, nhóm chúng em quyết định xây dựng **QuizFlow** - Hệ thống thi trắc nghiệm trực tuyến hoàn chỉnh với các tính năng hiện đại.

### 1.2 Mục tiêu đề tài

**Mục tiêu chính:**
- Xây dựng hệ thống thi trắc nghiệm trực tuyến hoàn chỉnh
- Phân quyền nghiêm ngặt cho 3 vai trò: Admin, Teacher, Student
- Giao diện thân thiện, đáp ứng (responsive) trên mọi thiết bị

**Mục tiêu cụ thể:**
- Quản lý câu hỏi, bài thi với phân quyền sở hữu
- Hỗ trợ import/export dữ liệu từ Excel
- Thống kê, báo cáo với biểu đồ trực quan
- Bảng xếp hạng (leaderboard) cho học sinh
- Dashboard cá nhân hóa theo từng vai trò

### 1.3 Phạm vi đề tài

**Phạm vi bao gồm:**
- Hệ thống xác thực và phân quyền người dùng
- Module quản lý câu hỏi trắc nghiệm 4 đáp án
- Module quản lý bài thi với nhiều tùy chọn
- Module làm bài và chấm điểm tự động
- Module thống kê và báo cáo
- Import/Export dữ liệu Excel

**Phạm vi không bao gồm:**
- Giám sát thi (proctoring) và chống gian lận nâng cao
- Thông báo real-time (email/push)
- Tích hợp LMS hoặc thanh toán
- Ứng dụng mobile native

---

## 2. PHÂN TÍCH YÊU CẦU

### 2.1 Yêu cầu chức năng

#### 2.1.1 Phân quyền người dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Admin** | Toàn quyền: quản lý tài khoản, xem tất cả câu hỏi/bài thi/kết quả, báo cáo tổng hợp |
| **Teacher** | Quản lý câu hỏi và bài thi DO CHÍNH MÌNH tạo, xem kết quả bài thi của mình |
| **Student** | Làm bài thi được phép, xem kết quả cá nhân |

#### 2.1.2 Quản lý câu hỏi

- Tạo, sửa, xóa câu hỏi trong ngân hàng (single/multiple/essay)
- Phân loại theo chủ đề, độ khó, tags
- Thêm giải thích đáp án
- Import từ Excel/Word và NineGPT
- Export ra file Excel

#### 2.1.3 Quản lý bài thi

- Tạo đề thi từ ngân hàng câu hỏi (chọn tay hoặc random)
- Gán lớp học và cấu hình lịch thi (mở/đóng)
- Cài đặt thời gian làm bài, trộn câu/đáp án
- Cho phép làm lại, bật/tắt công khai
- Chia sẻ đề thi qua link/QR

#### 2.1.4 Làm bài thi

- Kiểm tra điều kiện truy cập (publish, lịch thi, thành viên lớp)
- Hiển thị câu hỏi theo thứ tự hoặc ngẫu nhiên
- Đếm ngược thời gian
- Cho phép upload ảnh cho câu tự luận
- Chấm tự động cho câu objective, chấm tay cho tự luận
- Hiển thị kết quả ngay sau khi nộp

#### 2.1.5 Thống kê & Báo cáo

- Dashboard theo vai trò
- Leaderboard top 10 học sinh
- Báo cáo theo lớp/đề thi và thống kê đúng/sai theo câu
- Export báo cáo Excel

### 2.2 Yêu cầu phi chức năng

| Yêu cầu | Mô tả |
|---------|-------|
| **Hiệu năng** | Phản hồi < 3 giây cho mọi tác vụ |
| **Bảo mật** | Mã hóa mật khẩu, phân quyền nghiêm ngặt |
| **Khả năng mở rộng** | Kiến trúc Blueprint dễ thêm module |
| **Tương thích** | Responsive design, hoạt động trên mọi trình duyệt |
| **Độ tin cậy** | Backup database định kỳ |

### 2.3 Đối tượng sử dụng

1. **Quản trị viên (Admin)**: Quản lý toàn bộ hệ thống
2. **Giáo viên (Teacher)**: Tạo câu hỏi và bài thi
3. **Học sinh (Student)**: Làm bài và xem kết quả

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 3.1 ER Diagram (Text-based)

```
USER (teacher) 1---* CLASSROOM
USER (student) 1---* USER_CLASS *---1 CLASSROOM
CLASSROOM 1---* CLASS_DOCUMENT

USER (teacher) 1---* QUESTION_BANK 1---* BANK_OPTIONS
USER (teacher) 1---* QUIZ *---0..1 CLASSROOM
QUIZ 1---* QUESTION 1---* OPTION
QUIZ 1---* SUBMISSION 1---* ANSWER
```

### 3.2 Mô tả chi tiết các bảng

#### Bảng USER
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| username | VARCHAR(50) | Tên định danh nội bộ |
| email | VARCHAR(100) | Email đăng nhập, duy nhất |
| password_hash | VARCHAR(255) | Mật khẩu đã hash |
| full_name | VARCHAR(100) | Họ tên đầy đủ |
| role | ENUM | 'admin', 'teacher', 'student' |
| avatar_url | TEXT | Ảnh đại diện (tùy chọn) |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### Bảng CLASSROOM
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| name | VARCHAR(100) | Tên lớp |
| description | TEXT | Mô tả |
| join_code | VARCHAR(10) | Mã tham gia lớp |
| teacher_id | INTEGER (FK) | Giáo viên phụ trách |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### Bảng USER_CLASS
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| user_id | INTEGER (FK) | Học sinh |
| class_id | INTEGER (FK) | Lớp |
| status | ENUM | 'pending' / 'approved' |
| enrolled_at | DATETIME | Thời điểm tham gia |

#### Bảng QUESTION_BANK
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| teacher_id | INTEGER (FK) | Giáo viên tạo |
| text | TEXT | Nội dung câu hỏi |
| type | ENUM | 'single' / 'multiple' / 'essay' |
| category | VARCHAR(100) | Chủ đề |
| difficulty | ENUM | 'easy', 'medium', 'hard' |
| tags | VARCHAR(255) | Nhãn |
| explanation | TEXT | Giải thích |
| created_at | DATETIME | Ngày tạo |

#### Bảng BANK_OPTIONS
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| question_bank_id | INTEGER (FK) | Câu hỏi ngân hàng |
| text | TEXT | Nội dung đáp án |
| is_correct | BOOLEAN | Đáp án đúng |
| order_index | INTEGER | Thứ tự đáp án |

#### Bảng QUIZ
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| title | VARCHAR(200) | Tiêu đề đề thi |
| description | TEXT | Mô tả |
| time_limit_minutes | INTEGER | Thời gian làm bài (phút) |
| is_shuffled | BOOLEAN | Trộn câu hỏi |
| shuffle_options | BOOLEAN | Trộn đáp án |
| is_published | BOOLEAN | Trạng thái công khai |
| allow_retake | BOOLEAN | Cho phép làm lại |
| teacher_id | INTEGER (FK) | Giáo viên tạo |
| class_id | INTEGER (FK) | Lớp học (tùy chọn) |
| scheduled_at | DATETIME | Thời gian mở |
| expires_at | DATETIME | Thời gian đóng |
| share_token | VARCHAR(64) | Token chia sẻ |
| created_at | DATETIME | Ngày tạo |

#### Bảng QUESTION
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| quiz_id | INTEGER (FK) | Đề thi |
| text | TEXT | Nội dung câu hỏi |
| type | ENUM | 'single' / 'multiple' / 'essay' |
| points | INTEGER | Điểm |
| order_index | INTEGER | Thứ tự câu hỏi |
| topic | VARCHAR(100) | Chủ đề |
| difficulty | ENUM | 'easy', 'medium', 'hard' |
| created_by | INTEGER (FK) | Người tạo |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### Bảng OPTION
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| question_id | INTEGER (FK) | Câu hỏi |
| text | TEXT | Nội dung đáp án |
| is_correct | BOOLEAN | Đáp án đúng |
| order_index | INTEGER | Thứ tự đáp án |

#### Bảng SUBMISSION
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| quiz_id | INTEGER (FK) | Đề thi |
| student_id | INTEGER (FK) | Học sinh (nullable) |
| student_name | VARCHAR(100) | Tên hiển thị |
| student_email | VARCHAR(100) | Email hiển thị |
| total_score | INTEGER | Điểm đạt |
| max_score | INTEGER | Điểm tối đa |
| status | ENUM | 'in_progress' / 'submitted' / 'graded' |
| attempt_no | INTEGER | Lần thi |
| started_at | DATETIME | Bắt đầu |
| submitted_at | DATETIME | Nộp bài |

#### Bảng ANSWER
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| submission_id | INTEGER (FK) | Bài làm |
| question_id | INTEGER (FK) | Câu hỏi |
| option_id | INTEGER (FK) | Đáp án (nullable) |
| essay_answer | TEXT | Trả lời tự luận |
| essay_image_url | TEXT | Ảnh bài làm |
| is_correct | BOOLEAN | Đúng/sai |
| score_awarded | INTEGER | Điểm chấm |
| feedback | TEXT | Nhận xét |
| answered_at | DATETIME | Thời gian trả lời |

#### Bảng CLASS_DOCUMENT
| Tên trường | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| id | INTEGER (PK) | Khóa chính |
| class_id | INTEGER (FK) | Lớp |
| teacher_id | INTEGER (FK) | Giáo viên |
| title | VARCHAR(200) | Tiêu đề |
| file_url | TEXT | Link tài liệu |
| file_type | VARCHAR(50) | Loại file |
| uploaded_at | DATETIME | Thời điểm upload |

---

## 4. THIẾT KẾ HỆ THỐNG

### 4.1 Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Bootstrap 5 + Custom CSS + Chart.js          │    │
│  │              Jinja2 Templates                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Auth   │ │  Admin   │ │ Teacher  │ │  Quiz    │       │
│  │ Blueprint│ │ Blueprint│ │ Blueprint│ │ Blueprint│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                                  │
│  │ Profile  │ │  Report  │    Flask-Login + Decorators      │
│  │ Blueprint│ │ Blueprint│                                  │
│  └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Flask-SQLAlchemy ORM                    │    │
│  │    User | Classroom | QuestionBank | BankOption       │    │
│  │    Quiz | Question | Option | Submission | Answer     │    │
│  │    ClassDocument                                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               MySQL Database (ninequiz_db)           │    │
│  │                    UTF8MB4 Charset                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Cấu trúc thư mục dự án

```
web_exam/
├── app.py                    # Entry point, khởi tạo app
├── config.py                 # Cấu hình database, app
├── requirements.txt          # Dependencies
├── ninequiz_schema.sql       # Schema khởi tạo DB
├── sample_data.sql           # Dữ liệu mẫu
├── BaoCao_TieuLuan.md        # Báo cáo này
│
├── models/
│   ├── __init__.py
│   └── models.py             # SQLAlchemy models
│
├── routes/
│   ├── __init__.py
│   ├── auth.py               # Đăng nhập/đăng ký
│   ├── admin.py              # Routes cho admin
│   ├── teacher.py            # Routes cho teacher
│   ├── quiz.py               # Làm bài thi
│   ├── profile.py            # Quản lý hồ sơ
│   └── report.py             # Báo cáo thống kê
│
├── templates/
│   ├── base.html             # Template base
│   ├── dashboard.html        # Dashboard
│   ├── leaderboard.html      # Bảng xếp hạng
│   ├── auth/                 # Templates đăng nhập
│   ├── admin/                # Templates admin
│   ├── teacher/              # Templates teacher
│   ├── quiz/                 # Templates làm bài
│   ├── profile/              # Templates hồ sơ
│   └── report/               # Templates báo cáo
│
└── static/
    ├── css/style.css         # Custom CSS
    └── js/quiz.js            # JavaScript cho quiz
```

### 4.3 Thiết kế phân quyền

#### Decorator phân quyền

```python
# Admin only
@admin_required
def admin_route():
    pass

# Teacher only (chỉ thấy dữ liệu của mình)
@teacher_required  
def teacher_route():
    pass

# Kiểm tra truy cập lớp (quiz thuộc lớp)
if quiz.class_id and not is_approved_member:
   return redirect(url_for("quiz.library"))
```

#### Ma trận phân quyền

| Chức năng | Admin | Teacher | Student |
|-----------|:-----:|:-------:|:-------:|
| Quản lý người dùng | ✓ | ✗ | ✗ |
| Quản lý lớp học & duyệt thành viên | ✓ | ✓ | ✗ |
| Ngân hàng câu hỏi | ✓ | ✓ | ✗ |
| Tạo đề thi & gán lớp | ✓ | ✓ | ✗ |
| Làm bài thi | ✗ | ✗ | ✓ |
| Xem kết quả | ✓ | ✓ | ✓ |
| Chấm tự luận | ✓ | ✓ | ✗ |
| Upload/xem tài liệu lớp | ✓ | ✓ | ✓ (xem) |
| Báo cáo/Export | ✓ | ✓ | ✗ |

---

## 5. CÁC CHỨC NĂNG CHÍNH

### 5.1 Xác thực người dùng (Authentication)

**Đăng ký:**
- Nhập email, mật khẩu, họ tên
- Kiểm tra email đã tồn tại
- Hash mật khẩu bằng Werkzeug
- Cho phép chọn Student/Teacher (mặc định student)

**Đăng nhập:**
- Kiểm tra email và mật khẩu
- Tạo session với Flask-Login
- Redirect theo vai trò

**Đăng xuất:**
- Xóa session
- Redirect về trang chủ

### 5.2 Quản lý câu hỏi

**Tạo câu hỏi trong ngân hàng:**
```
Input: text, type, category, difficulty, tags, explanation
   (options và correct_answers nếu type != essay)
Process: Validate → Lưu question_bank → Lưu bank_options
Output: Redirect về danh sách với flash message
```

**Import từ Excel/Word:**
```
Input: File .xlsx/.xls/.docx với cột:
   text | type | category | difficulty | tags | option_a | option_b | option_c | option_d | correct_answers | explanation
Note: Với câu essay, có thể để trống option_a-d và correct_answers
Process:
   1. Đọc file bằng openpyxl hoặc python-docx
   2. Validate từng dòng/câu hỏi
   3. Bỏ qua dòng lỗi, đếm success/failed
   4. Commit transaction
Output: Flash message với số lượng import thành công
```

**NineGPT (AI generate):**
- Nhập chủ đề, số lượng câu hỏi, độ khó, chọn provider
- Hệ thống lưu trực tiếp vào question_bank

**Export ra Excel:**
```
Input: Filter theo chủ đề/độ khó hoặc export toàn bộ
Process: Query question_bank → tạo workbook → ghi header và data
Output: File .xlsx download
```

### 5.3 Quản lý bài thi

**Tạo bài thi:**
- Chọn câu hỏi từ ngân hàng (chọn tay hoặc random)
- Gán lớp học (tùy chọn) và lịch thi (scheduled_at/expires_at)
- Cài đặt: time_limit_minutes, is_shuffled, shuffle_options, allow_retake, is_published

**Chia sẻ đề thi:**
- Tạo link share_token và QR code để học sinh truy cập nhanh

**Tùy chọn nâng cao:**
- `allow_retake`: Cho phép làm lại
- `is_shuffled`: Xáo trộn thứ tự câu hỏi
- `shuffle_options`: Xáo trộn đáp án
- `scheduled_at/expires_at`: Thời gian cho phép thi

### 5.4 Làm bài thi

**Luồng xử lý:**

```
1. Kiểm tra điều kiện:
   - Quiz đã publish và trong thời gian cho phép?
   - Học sinh thuộc lớp (nếu quiz gán lớp)?
   - Chính sách làm lại (allow_retake)?

2. Bắt đầu thi:
   - Tạo Submission với attempt_no
   - Nếu is_shuffled: shuffle câu hỏi
   - Nếu shuffle_options: shuffle đáp án
   - Lưu thứ tự vào session

3. Làm bài:
   - Hiển thị câu hỏi theo thứ tự
   - Đếm ngược thời gian (JavaScript)
   - Câu tự luận cho phép upload ảnh

4. Nộp bài:
   - Chấm tự động cho câu objective
   - Câu tự luận chờ giáo viên/admin chấm
   - Cập nhật điểm và trạng thái submission

5. Hiển thị kết quả:
   - Điểm số, số câu đúng
   - Chi tiết từng câu và giải thích
```

### 5.5 Dashboard cá nhân hóa

**Admin Dashboard:**
- Tổng số user, câu hỏi, bài thi, lượt thi
- Biểu đồ lượt thi theo ngày
- Hoạt động gần đây

**Teacher Dashboard:**
- Số câu hỏi, bài thi đã tạo
- Số học sinh đã thi bài của mình
- Điểm trung bình bài thi của mình

**Student Dashboard:**
- Số bài thi đã làm
- Điểm trung bình
- Bài thi được đề xuất
- Bài thi gần đây

---

## 6. CÁC CHỨC NĂNG BỔ SUNG

### 6.1 Leaderboard (Bảng xếp hạng)

- Top 10 học sinh có điểm trung bình cao nhất
- Có thể lọc theo từng bài thi
- Hiển thị podium cho top 3
- Hiển thị vị trí của current_user (nếu không trong top 10)

### 6.2 Import/Export Excel/Word

**Import câu hỏi:**
- Download template mẫu
- Upload file .xlsx/.xls/.docx
- Validate dữ liệu trước khi import
- Báo cáo số lượng thành công/thất bại
- Hỗ trợ NineGPT sinh câu hỏi tự động

**Export dữ liệu:**
- Teacher: Export ngân hàng câu hỏi/đề thi của mình
- Admin: Export toàn bộ ngân hàng câu hỏi, đề thi, kết quả

### 6.3 Báo cáo tổng hợp (Teacher/Admin)

- Teacher: bảng điểm lớp, thống kê theo đề, tỉ lệ đúng/sai từng câu, export Excel
- Admin: xem toàn bộ kết quả và dữ liệu tổng quan, lọc theo đề thi

### 6.4 Quản lý hồ sơ cá nhân

- Xem thông tin cá nhân
- Cập nhật email, họ tên
- Đổi mật khẩu (xác nhận mật khẩu cũ)
- Xem lịch sử làm bài (student)

### 6.5 Tìm kiếm và phân trang

- Tìm kiếm: theo nội dung, chủ đề
- Lọc: theo độ khó, trạng thái
- Phân trang: 10 items/page mặc định
- Giữ trạng thái filter khi chuyển trang

### 6.6 So sánh với NineQuiz và phân quyền cập nhật

**Đối chiếu nhanh:**

| Nhóm chức năng | NineQuiz | QuizFlow hiện tại |
|---|---|---|
| Quản trị người dùng & phân quyền | Có | Có (Admin module) |
| Lớp học, join code, duyệt thành viên | Có | Có |
| Tài liệu lớp học | Có | Có (học sinh xem theo lớp đã duyệt) |
| Ngân hàng câu hỏi nhiều loại | Có | Có (single/multiple/essay) |
| Lịch thi, trộn câu/đáp án, làm lại | Có | Có |
| Chia sẻ đề/QR | Có | Có |
| Chấm tự luận | Có | Có |
| Báo cáo/Export | Có | Có (teacher + admin export) |

**Khoảng cách đã bổ sung:**
- Kích hoạt module Admin quản trị toàn hệ thống
- Siết quyền truy cập đề thi theo lớp (chỉ học sinh đã duyệt)
- Trang tài liệu lớp học cho học sinh

**Chức năng còn thiếu/đề xuất:**
- Proctoring/chống gian lận nâng cao
- Thông báo tự động (email/push)
- Phân tích nâng cao theo lớp/chương và rubric chấm tự luận

**Ma trận phân quyền cập nhật:**

| Chức năng | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| Quản lý người dùng | ✓ | ✗ | ✗ |
| Quản lý lớp học & duyệt thành viên | ✓ | ✓ | ✗ |
| Ngân hàng câu hỏi | ✓ | ✓ | ✗ |
| Tạo đề thi & gán lớp | ✓ | ✓ | ✗ |
| Làm bài thi | ✗ | ✗ | ✓ |
| Xem kết quả | ✓ | ✓ | ✓ |
| Chấm tự luận | ✓ | ✓ | ✗ |
| Upload/xem tài liệu lớp | ✓ | ✓ | ✓ (xem) |
| Báo cáo/Export | ✓ | ✓ | ✗ |

---

## 7. HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG

### 7.1 Yêu cầu hệ thống

- Python 3.8+
- MySQL 8+ (schema mặc định: ninequiz_db)
- pip (Python package manager)
- Trình duyệt web hiện đại

### 7.2 Cài đặt

**Bước 1: Chuẩn bị môi trường**

```bash
# Clone/Download project
cd web_exam

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

**Bước 2: Cài đặt dependencies**

```bash
pip install -r requirements.txt
```

**Bước 3: Cấu hình MySQL**

```sql
-- Đăng nhập MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE ninequiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thoát MySQL
exit
```

**Bước 4: Cấu hình ứng dụng**

Tạo file `.env` (hoặc chỉnh biến môi trường):
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ninequiz_db
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

**Bước 5: Khởi tạo/seed database**

```bash
# Tạo bảng lần đầu
mysql -u root -p ninequiz_db < ninequiz_schema.sql

# Import dữ liệu mẫu (tùy chọn)
mysql -u root -p ninequiz_db < sample_data.sql
```

**Bước 6: Chạy ứng dụng**

```bash
python app.py
```

Truy cập: http://127.0.0.1:5000

### 7.3 Tài khoản mẫu

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| teacher@ninequiz.vn | 123456 | Teacher |
| student@ninequiz.vn | 123456 | Student |
| teacher1@quizflow.com | 123456 | Teacher (sample_data.sql) |
| student1@quizflow.com | 123456 | Student (sample_data.sql) |

*Ghi chú:* Có thể tạo Admin bằng cách cập nhật role trong DB hoặc tạo tài khoản mới rồi gán role=admin.

### 7.4 Hướng dẫn sử dụng

**Dành cho Admin:**
1. Đăng nhập → Dashboard tổng quan
2. Menu "Quản lý người dùng" → Tạo/Sửa/Xóa user
3. Menu "Lớp học" → Duyệt thành viên, quản lý tài liệu
4. Menu "Câu hỏi" → Xem tất cả, Import/Export
5. Menu "Bài thi" → Quản lý đề thi, chia sẻ link/QR
6. Menu "Kết quả" → Chấm tự luận, xem chi tiết
7. Menu "Báo cáo" → Thống kê hệ thống, export

**Dành cho Teacher:**
1. Đăng nhập → Dashboard cá nhân
2. Menu "Lớp học" → Tạo lớp, duyệt thành viên, upload tài liệu
3. Menu "Câu hỏi của tôi" → Tạo/Sửa/Xóa/Import/Export/NineGPT
4. Menu "Bài thi của tôi" → Tạo/Sửa quiz, gán lớp, chia sẻ link/QR
5. Menu "Kết quả" → Xem kết quả và chấm tự luận

**Dành cho Student:**
1. Đăng nhập → Dashboard với bài thi có thể làm
2. Tham gia lớp → Chờ duyệt
3. Chọn bài thi → Xem thông tin → Bắt đầu thi
4. Làm bài → Nộp bài → Xem kết quả
5. Menu "Lịch sử" → Xem lại các bài đã thi
6. Menu "Tài liệu"/Leaderboard → Xem tài liệu lớp và xếp hạng

---

## 8. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 8.1 Kết quả đạt được

**Về mặt kỹ thuật:**
- Xây dựng thành công hệ thống web với Flask và MySQL
- Triển khai kiến trúc Blueprint modular
- Phân quyền nghiêm ngặt với decorator pattern
- Import/Export Excel/Word với openpyxl và python-docx
- Tích hợp AI sinh câu hỏi (NineGPT)
- Biểu đồ thống kê với Chart.js
- Giao diện responsive với Bootstrap 5

**Về mặt chức năng:**
- Hệ thống xác thực đầy đủ
- Quản lý lớp học, duyệt thành viên, tài liệu lớp
- Ngân hàng câu hỏi nhiều loại với ownership
- Tạo và quản lý bài thi linh hoạt (lịch thi, chia sẻ link/QR)
- Làm bài thi với đếm giờ, random, upload tự luận
- Dashboard cá nhân hóa theo vai trò
- Leaderboard, báo cáo thống kê

### 8.2 Hạn chế

- Chưa có proctoring/chống gian lận nâng cao
- Chưa có thông báo tự động (email/push) cho lịch thi/kết quả
- Upload media trực tiếp trong ngân hàng câu hỏi còn hạn chế
- Chưa tích hợp WebSocket cho thi trực tiếp real-time

### 8.3 Hướng phát triển

**Ngắn hạn:**
- Thêm loại câu hỏi: điền khuyết, ghép cặp
- Upload hình ảnh cho câu hỏi
- Email notification (nhắc lịch thi, gửi kết quả)
- Export PDF cho đề thi và kết quả

**Dài hạn:**
- Ứng dụng mobile (React Native/Flutter)
- Real-time quiz với WebSocket
- AI-powered question generation
- Proctoring với camera monitoring
- LMS integration (Moodle, Canvas)

### 8.4 Lời cảm ơn

Nhóm xin chân thành cảm ơn:
- Giảng viên hướng dẫn đã tận tình chỉ bảo
- Các bạn trong nhóm đã cùng nhau hoàn thành
- Tài liệu và cộng đồng Flask, Bootstrap

---

## PHỤ LỤC

### A. Requirements.txt

```
Flask==2.3.3
Flask-SQLAlchemy==3.1.1
Flask-Login==0.6.2
PyMySQL==1.1.0
Werkzeug==2.3.7
openpyxl==3.1.2
```

### B. Tài liệu tham khảo

1. Flask Documentation - https://flask.palletsprojects.com/
2. Flask-SQLAlchemy - https://flask-sqlalchemy.palletsprojects.com/
3. Bootstrap 5 - https://getbootstrap.com/docs/5.0/
4. Chart.js - https://www.chartjs.org/docs/
5. OpenPyXL - https://openpyxl.readthedocs.io/

---

*Báo cáo được hoàn thành bởi nhóm phát triển QuizFlow*

*Năm học 2024-2025*
