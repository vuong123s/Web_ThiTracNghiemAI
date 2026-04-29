# 🚀 NineGPT Quick Start

## ⚡ 3 Bước để bắt đầu

### 1️⃣ Cài đặt thư viện AI (nếu chưa có)
```bash
pip install openai google-generativeai
```

### 2️⃣ Cấu hình API keys
```bash
# Copy template
cp .env.example .env

# Edit .env và thêm:
# OPENAI_API_KEY=sk-proj-your-key-here
# GEMINI_API_KEY=AIza-your-key-here
```

### 3️⃣ Khởi động Flask
```bash
python app.py
```

## 📝 Sử dụng NineGPT

1. Truy cập: **http://localhost:5000/teacher/questions/ai-generate**
2. Login: `teacher@ninequiz.vn` / `123456`
3. Kiểm tra status: Xem ✓ hoặc ✗ bên cạnh provider
4. Nhập thông tin:
   - **Chủ đề**: Lịch sử, Toán học, etc
   - **Độ khó**: Dễ / Trung bình / Khó
   - **Số câu**: 5-10
5. Click **"Tạo câu hỏi bằng AI"**
6. Câu hỏi sẽ lưu vào "Ngân hàng câu hỏi"

## 🔑 Lấy API Keys

### OpenAI (gpt-4o-mini)
1. Truy cập: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key (bắt đầu `sk-proj-`)
4. Thêm vào `.env`:
```
OPENAI_API_KEY=sk-proj-...
```

### Google Gemini (gemini-1.5-flash)
1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy key (bắt đầu `AIza...`)
4. Thêm vào `.env`:
```
GEMINI_API_KEY=AIza...
```

## ✅ Trạng thái Provider

Khi vào trang NineGPT, bạn sẽ thấy:

```
✓ OpenAI đã sẵn sàng              ← Xanh lá cây = OK
✗ Chưa cấu hình GEMINI_API_KEY  ← Đỏ = Cần cấu hình
```

Nút submit sẽ **disabled** nếu provider được chọn chưa sẵn sàng.

## ❌ Lỗi thường gặp

| Lỗi | Giải pháp |
|-----|----------|
| "✗ Chưa cấu hình OpenAI key" | Thêm OPENAI_API_KEY vào .env |
| "OpenAI API lỗi (401)" | API key sai hoặc hết hạn |
| "Module not found: openai" | `pip install openai google-generativeai` |
| Gemini timeout | Thử lại hoặc dùng OpenAI |
| Không có Internet | Kiểm tra kết nối mạng |

## 💡 Tips

- **Chủ đề chi tiết hơn** → Câu hỏi chất lượng hơn
  - ✓ "Python: Exception Handling"
  - ✗ "Programming"

- **Độ khó "Trung bình"** → Câu hỏi đa dạng nhất

- **Luôn kiểm tra câu hỏi** trước khi dùng

## 📚 Xem thêm

- Hướng dẫn chi tiết: `NINEGPT_SETUP.md`
- Summary thay đổi: `IMPLEMENTATION_SUMMARY.md`
- Verification: `VERIFICATION_CHECKLIST.md`

## 🎓 Ví dụ câu hỏi sinh ra

**AI sẽ tạo câu hỏi như:**
```
Chủ đề: Python - List Comprehension
Độ khó: Trung bình
Số câu: 3

[Câu 1] Kết quả của [x*2 for x in range(3)] là gì?
A) [0, 2, 4]
B) [0, 1, 2]
C) [2, 4, 6]
D) [1, 2, 3]

[Câu 2] List comprehension với điều kiện...
...
```

Tất cả được lưu vào database để dùng trong bộ đề thi!

---

**Bạn đã sẵn sàng!** Hãy tạo một câu hỏi AI ngay bây giờ! 🎉
