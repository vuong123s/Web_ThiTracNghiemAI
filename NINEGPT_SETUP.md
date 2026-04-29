# NineGPT - Hướng dẫn cài đặt và sử dụng

## 📋 Tổng quan

NineGPT là tính năng sinh câu hỏi trắc nghiệm tự động bằng AI. QuizFlow hỗ trợ hai AI provider:
- **OpenAI** (GPT-4o-mini, GPT-3.5-turbo)
- **Google Gemini** (Gemini-1.5-flash)

## 🚀 Cài đặt nhanh

### 1. Cài đặt dependencies
```bash
cd web_exam
pip install -r requirements.txt
```

Kiểm tra thư viện AI đã cài:
```bash
python -c "import openai; import google.generativeai; print('✓ AI libraries installed')"
```

### 2. Tạo file `.env` từ template
```bash
cp .env.example .env
```

### 3. Lấy API keys

#### **OpenAI API Key:**
1. Truy cập: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key (định dạng: `sk-proj-...`)
4. Thêm vào `.env`:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

#### **Gemini API Key:**
1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy key (định dạng: `AIza...`)
4. Thêm vào `.env`:
```
GEMINI_API_KEY=AIza-your-key-here
```

### 4. Khởi động Flask
```bash
python app.py
```

Truy cập: http://localhost:5000

## 📖 Sử dụng NineGPT

### Bước 1: Đăng nhập là Giáo viên
- Email: `teacher@ninequiz.vn`
- Password: `123456`

### Bước 2: Vào "Câu hỏi của tôi" → NineGPT
- URL: http://localhost:5000/teacher/questions/ai-generate

### Bước 3: Nhập thông tin
| Trường | Ví dụ | Ghi chú |
|-------|-------|--------|
| **AI Provider** | OpenAI hoặc Gemini | Chọn provider có ✓ sẵn sàng |
| **Chủ đề** | Lịch sử Việt Nam thời Lý | Yêu cầu ≥ 3 ký tự |
| **Danh mục lưu** | Lịch sử | Để trống = dùng chủ đề |
| **Độ khó** | Trung bình | Dễ / Trung bình / Khó |
| **Số câu hỏi** | 5 | Từ 5-10 câu |

### Bước 4: Xem kết quả
- Câu hỏi được lưu tự động vào "Ngân hàng câu hỏi"
- Có thể chỉnh sửa hoặc xóa câu hỏi
- Thêm vào bộ đề thi

## ✅ Kiểm tra trạng thái Provider

Giao diện NineGPT hiển thị trạng thái hai provider:

```
✓ OpenAI đã sẵn sàng              → Xanh lá cây = Sẵn sàng
✗ Chưa cấu hình GEMINI_API_KEY   → Đỏ = Chưa cấu hình
```

Nút "Tạo câu hỏi bằng AI" sẽ disabled nếu provider được chọn chưa sẵn sàng.

## 🐛 Troubleshooting

### Vấn đề: "✗ Chưa cấu hình OpenAI key"

**Nguyên nhân:** API key không được tìm thấy hoặc rỗng

**Giải pháp:**
```bash
# 1. Kiểm tra file .env tồn tại
ls -la .env

# 2. Kiểm tra key có giá trị
grep OPENAI_API_KEY .env

# 3. Khởi động lại Flask
python app.py
```

### Vấn đề: "OpenAI API lỗi (401): Unauthorized"

**Nguyên nhân:** API key không đúng hoặc hết hạn

**Giải pháp:**
1. Truy cập https://platform.openai.com/api-keys
2. Kiểm tra key còn hiệu lực
3. Tạo key mới nếu cần
4. Cập nhật `.env` và restart Flask

### Vấn đề: "Gemini không trả về dữ liệu câu hỏi"

**Nguyên nhân:** API quota hết hoặc rate limit

**Giải pháp:**
1. Đợi 1-2 phút
2. Thử lại với số câu ít hơn (5 thay vì 10)
3. Chuyển sang OpenAI tạm thời

### Vấn đề: Lỗi "Module not found: openai"

**Giải pháp:**
```bash
pip install openai google-generativeai
# hoặc
pip install -r requirements.txt
```

### Vấn đề: "Lỗi khi gọi OpenAI: [Errno -2] Name or service not known"

**Nguyên nhân:** Không có kết nối Internet

**Giải pháp:**
1. Kiểm tra kết nối Internet
2. Kiểm tra firewall/proxy không chặn API calls

## 📊 API Response Format

NineGPT kỳ vọng AI trả về JSON theo format này:

```json
{
  "questions": [
    {
      "text": "Nội dung câu hỏi",
      "type": "single|multiple|essay",
      "category": "Chủ đề",
      "difficulty": "easy|medium|hard",
      "tags": "tag1,tag2",
      "explanation": "Giải thích",
      "options": [
        {"text": "Đáp án A", "is_correct": true},
        {"text": "Đáp án B", "is_correct": false},
        {"text": "Đáp án C", "is_correct": false},
        {"text": "Đáp án D", "is_correct": false}
      ]
    }
  ]
}
```

## 🔍 Debug mode

Để xem logs chi tiết từ AI API calls:

```bash
# Chạy Flask với debug mode
python app.py

# Kiểm tra console output của Flask để thấy logs
# [INFO] Calling OpenAI with model=gpt-4o-mini, topic=..., count=5, difficulty=medium
# [INFO] OpenAI returned 2456 characters of content
```

## 💡 Tips & Tricks

### Chủ đề hay tạo câu hỏi chất lượng tốt:
- ✓ "Python: Vòng lặp và điều kiện"
- ✓ "Toán học: Hàm bậc hai"
- ✓ "Tiếng Anh: Present Perfect Tense"
- ✗ "Một số chủ đề" (quá chung chung)
- ✗ "Này" (quá ngắn)

### Độ khó mong muốn:
- **Dễ**: Kiểm tra kiến thức cơ bản
- **Trung bình**: Kiểm tra áp dụng kiến thức
- **Khó**: Kiểm tra phân tích/tổng hợp

### Số câu hỏi:
- 5-7 câu: Kiểm tra nhanh
- 10 câu: Bộ đề chuẩn

## 🔐 Security Notes

- ⚠️ **Không commit `.env` lên Git** (chứa API keys)
- ⚠️ **API keys là bí mật** - không chia sẻ với người khác
- ✓ `.env.example` có thể commit (mẫu template không có key)
- ✓ Rotate key định kỳ tại https://platform.openai.com

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra log console của Flask
2. Xem phần Troubleshooting ở trên
3. Kiểm tra API key hạn chế (quota, billing)
4. Thử provider khác (OpenAI ↔ Gemini)
