# QuizFlow - Hướng dẫn cài đặt và sử dụng

## 1. Yêu cầu hệ thống
- Python 3.8+
- MySQL 8+ (schema mặc định: `ninequiz_db`)

## 2. Cài đặt

### Bước 1: Cài đặt dependencies
```bash
cd web_exam
pip install -r requirements.txt
```

### Bước 2: Chạy ứng dụng
```bash
python app.py
```
Mở trình duyệt: http://localhost:5000

## 3. Tài khoản mặc định
- **Giáo viên:** `teacher@ninequiz.vn` / `123456`
- **Học sinh:** `student@ninequiz.vn` / `123456`

## 4. Cấu hình Database

**Bước 1:** Tạo database trong MySQL:
```sql
CREATE DATABASE ninequiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc chạy script khởi tạo đầy đủ schema + dữ liệu mẫu:
```bash
mysql -u root -p < ninequiz_schema.sql
```

**Bước 2:** Sửa file `.env`:
```
USE_SQLITE=false
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ninequiz_db
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
```

**Bước 3:** Chạy lại ứng dụng:
```bash
python app.py
```

## 5. Các vai trò người dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Teacher** | Quản lý lớp học, ngân hàng câu hỏi, đề thi, chấm điểm, báo cáo |
| **Student** | Tham gia lớp bằng mã, làm bài thi, xem lịch sử và kết quả của mình |

## 6. Hướng dẫn sử dụng

### Đối với Teacher:
1. Đăng nhập → Dashboard giáo viên
2. **Lớp học:** tạo lớp, lấy join code, duyệt học sinh, upload tài liệu
3. **Ngân hàng câu hỏi:** tạo thủ công/import Excel-Word/NineGPT
4. **Đề thi:** tạo đề từ câu hỏi chọn tay hoặc random, bật trộn câu/trộn đáp án, cấu hình lịch thi
5. **Chấm điểm & báo cáo:** chấm tự luận, xem bảng điểm lớp, export Excel

### Đối với Student:
1. Đăng nhập → Thư viện bài thi
3. Chọn bài thi → Bắt đầu làm bài
4. Làm bài trong thời gian quy định (có đồng hồ đếm ngược)
5. Nộp bài → Xem kết quả chi tiết

## 7. Thêm dữ liệu mẫu

Chạy lệnh sau để thêm dữ liệu mẫu:
```bash
python seed_data.py
```

## 8. Cấu trúc thư mục
```
web_exam/
├── app.py              # Ứng dụng Flask chính
├── config.py           # Cấu hình database
├── ninequiz_schema.sql # Script tạo CSDL ninequiz_db + dữ liệu mẫu
├── seed_data.py        # Script thêm dữ liệu mẫu
├── models/             # Database models
├── routes/             # API routes (auth, admin, quiz)
├── static/             # CSS, JavaScript
├── templates/          # Giao diện HTML
└── requirements.txt    # Thư viện (bao gồm openpyxl, python-docx)
```

## 9. Xử lý lỗi thường gặp

**Lỗi "Access denied" với MySQL:**
- Kiểm tra username/password trong file `.env`
- Đảm bảo database `ninequiz_db` đã được tạo

**Lỗi import file Word (.docx):**
```bash
pip install python-docx
```

**Lỗi NineGPT không hoạt động:**

Nếu giao diện hiển thị "✗ Chưa cấu hình OpenAI key" hoặc "✗ Chưa cấu hình Gemini key":

1. **Cài đặt libraries AI** (phiên bản mới đã bao gồm):
```bash
pip install openai google-generativeai
```

2. **Cấu hình file `.env`** - Sao chép từ `.env.example`:
```bash
cp .env.example .env
```

3. **Thêm API keys vào `.env`**:
```
# OpenAI (từ https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Gemini (từ https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=AIza-your-actual-key-here
```

4. **Khởi động lại Flask** để load `.env` mới:
```bash
python app.py
```

5. **Kiểm tra trạng thái**: Khi vào trang NineGPT, bạn sẽ thấy:
   - ✓ **Xanh lá cây** = Provider sẵn sàng
   - ✗ **Đỏ** = Chưa cấu hình (xem lỗi chi tiết ở dòng thông báo)

6. **Nếu lỗi vẫn xuất hiện**:
   - Kiểm tra key có đúng định dạng không (ví dụ OpenAI phải bắt đầu `sk-proj-`)
   - Kiểm tra key có còn hạn không (tại https://platform.openai.com hoặc https://makersuite.google.com)
   - Kiểm tra console/terminal xem có lỗi gì khi gọi API
   - Kiểm tra xem có quota API còn không

**Lỗi "Module not found":**
```bash
pip install -r requirements.txt
```

**Lỗi port 5000 đã sử dụng:**
```bash
python app.py --port 5001
```
