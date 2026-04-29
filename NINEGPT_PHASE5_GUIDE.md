# NineGPT Phase 5 - Question Preview & Management

## 🎯 Tổng quan

Phase 5 thêm khả năng **xem trước, chỉnh sửa, và quản lý câu hỏi trước khi lưu** vào database.

Thay vì tự động lưu hết, người dùng giờ có thể:
- ✅ Xem câu hỏi sinh ra bên cạnh form
- ✅ Chỉnh sửa nội dung câu hỏi, đáp án, giải thích
- ✅ Xóa câu không phù hợp
- ✅ Chọn một số câu để lưu (không phải hết)
- ✅ Tạo quiz mới tự động từ câu hỏi chọn

---

## 🚀 Workflow Mới

### 1. Truy cập NineGPT
```
Dashboard → Câu hỏi của tôi → NineGPT
URL: http://localhost:5000/teacher/questions/ai-generate
```

### 2. Nhập thông tin tạo câu hỏi
- Chọn AI Provider (OpenAI / Gemini)
- Nhập chủ đề
- Chọn danh mục lưu (optional)
- Chọn độ khó
- Nhập số câu (5-10)
- Click **"Tạo câu hỏi bằng AI"**

### 3. Preview & Edit (BẠN ĐANG Ở BƯỚC NÀY)
Bên phải form, bạn sẽ thấy:

```
┌─────────────────────────────────────┐
│ Preview Câu hỏi sinh ra (5)          │
│ ☐ Chọn tất cả                       │
├─────────────────────────────────────┤
│ ┌─ Câu 1 ─────────────────────────┐ │
│ │ ☐ 📌 Chọn 1 đáp án | Độ khó: Khó│ │
│ │                                   │ │
│ │ Nội dung câu hỏi này...          │ │
│ │                                   │ │
│ │ ☐ A. Đáp án A                   │ │
│ │ ☑ B. Đáp án B ✓                 │ │
│ │ ☐ C. Đáp án C                   │ │
│ │ ☐ D. Đáp án D                   │ │
│ │                                   │ │
│ │ Tags: lịch sử, việt nam          │ │
│ │ Giải thích: Năm ... là ...       │ │
│ │                                   │ │
│ │ [✏️ Sửa] [🗑️ Xóa]               │ │
│ └─────────────────────────────────┘ │
│ ... (Câu 2, 3, 4, 5) ...            │
├─────────────────────────────────────┤
│ ☐ Chọn tất cả (0/5 câu)             │
│ [💾 Lưu các câu đã chọn]           │
│ [📝 Tạo bài kiểm tra từ câu chọn]  │
└─────────────────────────────────────┘
```

### 4. Thao tác trên từng câu

#### **Chỉnh sửa (Edit)**
- Click nút **"✏️ Sửa"** trên câu hỏi
- Modal hiện ra cho phép sửa:
  - Nội dung câu hỏi
  - Loại câu (chọn 1 / chọn nhiều / tự luận)
  - Các đáp án A, B, C, D
  - Đáp án đúng (checkboxes)
  - Tags
  - Giải thích
- Click **"Lưu thay đổi"** → câu được cập nhật trong danh sách

#### **Xóa (Delete)**
- Click nút **"🗑️ Xóa"** trên câu hỏi
- Confirm xóa
- Câu biến mất khỏi danh sách

### 5. Thao tác hàng loạt

#### **Chọn câu hỏi**
- Checkbox ☐ bên mỗi câu để chọn câu riêng
- Hoặc checkbox **"☐ Chọn tất cả"** ở trên cùng

#### **Lưu các câu đã chọn**
1. Chọn câu hỏi (checkbox ☐)
2. Click **"💾 Lưu các câu đã chọn"**
3. Toast notification: ✓ Đã lưu X câu hỏi
4. Các câu lưu được xóa khỏi danh sách preview

**Kết quả:** Câu hỏi được lưu vào "Ngân hàng câu hỏi" → có thể dùng trong quiz

#### **Tạo bài kiểm tra từ câu chọn**
1. Chọn câu hỏi (checkbox ☐)
2. Click **"📝 Tạo bài kiểm tra từ câu chọn"**
3. Dialog hỏi tên bài kiểm tra
4. Nhập tên (ví dụ: "Lịch sử Việt Nam - 2025-01-15")
5. Click **"OK"**
6. Tự động:
   - Tạo quiz mới
   - Thêm X câu hỏi vào quiz
   - Redirect sang trang chỉnh sửa quiz
   - Toast: ✓ Tạo bài kiểm tra thành công

---

## 💡 Ví dụ Workflow Thực Tế

**Kịch bản:** Giáo viên muốn tạo một bài thi lịch sử

### Bước 1: Sinh câu hỏi
- Chủ đề: "Lịch sử Việt Nam thời Lý"
- Danh mục: "Lịch sử"
- Độ khó: "Trung bình"
- Số câu: 10
- Click "Tạo câu hỏi bằng AI"

### Bước 2: AI sinh 10 câu → hiển thị preview

### Bước 3: Chỉnh sửa câu không phù hợp
- Câu 3: Câu hỏi có typo
  - Click "✏️ Sửa"
  - Fix typo
  - Click "Lưu thay đổi"

- Câu 7: Không thích câu này
  - Click "🗑️ Xóa"

### Bước 4: Lưu các câu thích hợp
- Chọn tất cả (9 câu còn lại)
- Click "💾 Lưu các câu đã chọn"
- ✓ Đã lưu 9 câu hỏi

### Bước 5: Tạo bài thi
- Chọn 8 câu dễ nhất (bỏ 1 câu khó)
- Click "📝 Tạo bài kiểm tra từ câu chọn"
- Nhập tên: "Kiểm tra 1 tiết - Lịch sử thời Lý"
- ✓ Tạo bài kiểm tra thành công
- Redirect sang trang edit quiz

### Bước 6: Hoàn thành quiz
- Thêm câu hỏi khác nếu cần
- Cấu hình điểm số, thời gian
- Publish quiz

---

## 🔧 Kỹ Thuật Phía Sau

### Frontend (JavaScript)
- **NineGPTPreview class**: Quản lý danh sách câu hỏi tạm thời
- **handleFormSubmit**: Submit form via AJAX, nhận JSON từ backend
- **renderQuestions**: Hiển thị câu hỏi dạng card
- **Edit Modal**: Modal chỉnh sửa câu hỏi
- **Toast notifications**: Thông báo thành công/lỗi

### Backend (Flask Routes)
1. **POST /teacher/questions/ai-generate**
   - Input: Form data (provider, topic, difficulty, etc.)
   - Output: JSON {success, questions[], category, difficulty}
   - Không lưu vào database, chỉ sinh câu

2. **POST /teacher/questions/save-ai-batch**
   - Input: JSON {questions[], category, difficulty}
   - Output: JSON {success, saved_count, errors[]}
   - Lưu câu hỏi vào `question_bank` + `bank_options`

3. **POST /teacher/questions/create-quiz-from-ai**
   - Input: JSON {quiz_name, questions[]}
   - Output: JSON {success, redirect_url}
   - Tạo Quiz → thêm Questions → thêm Options → redirect

### Database
- Sử dụng bảng cũ: `question_bank`, `bank_options`
- Không cần schema mới
- Lưu nhanh sau khi user confirm

---

## ⚠️ Cần Chú Ý

### Câu hỏi tạm thời (Session)
- Câu hỏi được giữ trong JavaScript array (browser memory)
- Nếu reload page → mất dữ liệu
- **Giải pháp:** Lưu vào database hoặc localStorage (Phase 6)

### Validation
- Backend validate mọi câu hỏi trước lưu
- Nếu câu không hợp lệ → bỏ qua (skipped)
- Frontend thông báo số câu skip

### Permissions
- Chỉ giáo viên mới truy cập `/teacher/questions/ai-generate`
- Câu hỏi được lưu với owner là giáo viên hiện tại
- Học sinh không thấy được

---

## 🐛 Troubleshooting

### "Lỗi khi gọi AI"
- Kiểm tra API key (OpenAI / Gemini)
- Kiểm tra Internet connection
- Xem console log (F12 > Console)

### "✗ Đã lưu X câu hỏi" nhưng số lớn
- Backend validation bỏ qua câu không hợp lệ
- Kiểm tra format đáp án (phải có ≥2 đáp án)

### Câu hỏi không hiện
- Reload page
- Kiểm tra Browser Console (F12)
- Kiểm tra Flask backend logs

### Edit modal không hiện
- Kiểm tra Bootstrap CSS/JS được load
- Xem console error
- Thử browser khác

---

## 🎓 Best Practices

1. **Preview trước khi lưu**
   - Đọc kỹ câu hỏi, đáp án
   - Sửa typo, lỗi ngữ pháp
   - Đảm bảo đáp án đúng

2. **Xóa câu không cần**
   - AI có thể sinh ra câu không phù hợp
   - Xóa ngay để danh sách gọn

3. **Sử dụng Tags & Giải thích**
   - Tags: giúp tìm kiếm câu hỏi sau
   - Giải thích: hỗ trợ học sinh hiểu

4. **Tạo Quiz từ AI**
   - Nhanh hơn tạo thủ công
   - Có thể edit câu sau trong quiz
   - Tiết kiệm thời gian giáo viên

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra Console (F12 > Console) để xem error
2. Kiểm tra Flask logs (terminal chạy `python app.py`)
3. Reset page (Ctrl+R hoặc Cmd+R)
4. Xem file `NINEGPT_SETUP.md` troubleshooting section
