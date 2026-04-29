-- =========================================================
-- NineQuiz Database Bootstrap Script
-- Mục tiêu:
-- 1) Tạo database ninequiz_db
-- 2) Tạo đầy đủ schema + constraints + indexes
-- 3) Thêm dữ liệu mẫu kiểm thử
-- 4) Chạy SELECT mẫu để kiểm tra dữ liệu
-- =========================================================

CREATE DATABASE IF NOT EXISTS `ninequiz_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ninequiz_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `options`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `quizzes`;
DROP TABLE IF EXISTS `user_class`;
DROP TABLE IF EXISTS `class_documents`;
DROP TABLE IF EXISTS `bank_options`;
DROP TABLE IF EXISTS `question_bank`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- 1) users
-- =========================================================
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính người dùng',
  `username` VARCHAR(50) NOT NULL COMMENT 'Tên đăng nhập duy nhất',
  `email` VARCHAR(100) NOT NULL COMMENT 'Email duy nhất',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã băm',
  `full_name` VARCHAR(100) NULL COMMENT 'Họ tên hiển thị',
  `role` ENUM('teacher', 'student', 'admin') NOT NULL DEFAULT 'student' COMMENT 'Vai trò người dùng',
  `avatar_url` TEXT NULL COMMENT 'URL ảnh đại diện',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách người dùng (giáo viên/học sinh)';

-- =========================================================
-- 2) classes
-- =========================================================
CREATE TABLE `classes` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính lớp học',
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên lớp học',
  `description` TEXT NULL COMMENT 'Mô tả lớp học',
  `join_code` VARCHAR(10) NOT NULL COMMENT 'Mã tham gia lớp',
  `teacher_id` INT NOT NULL COMMENT 'Giáo viên phụ trách (users.id)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo lớp',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật lớp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_classes_join_code` (`join_code`),
  KEY `idx_classes_teacher_id` (`teacher_id`),
  KEY `idx_classes_created_at` (`created_at`),
  CONSTRAINT `fk_classes_teacher`
    FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Lớp học do giáo viên quản lý';

-- =========================================================
-- 3) user_class (n-n users <-> classes)
-- =========================================================
CREATE TABLE `user_class` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính enrollment',
  `user_id` INT NOT NULL COMMENT 'Học sinh tham gia lớp (users.id)',
  `class_id` INT NOT NULL COMMENT 'Lớp học (classes.id)',
  `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái tham gia lớp',
  `enrolled_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm vào lớp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_class_user_class` (`user_id`, `class_id`),
  KEY `idx_user_class_class_id` (`class_id`),
  KEY `idx_user_class_status` (`status`),
  KEY `idx_user_class_enrolled_at` (`enrolled_at`),
  CONSTRAINT `fk_user_class_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_class_class`
    FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Bảng liên kết nhiều-nhiều giữa users và classes';

-- =========================================================
-- 4) quizzes
-- =========================================================
CREATE TABLE `quizzes` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính đề thi',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tiêu đề đề thi',
  `description` TEXT NULL COMMENT 'Mô tả đề thi',
  `time_limit_minutes` INT NOT NULL DEFAULT 60 COMMENT 'Thời gian làm bài (phút)',
  `is_shuffled` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Có trộn thứ tự câu hỏi hay không',
  `shuffle_options` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Có trộn thứ tự đáp án hay không',
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Trạng thái công khai đề thi',
  `allow_retake` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Cho phép làm lại bài',
  `teacher_id` INT NOT NULL COMMENT 'Giáo viên tạo đề (users.id)',
  `class_id` INT NULL COMMENT 'Lớp được gán đề (classes.id)',
  `scheduled_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Thời gian mở thi',
  `expires_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Thời gian đóng thi',
  `share_token` VARCHAR(64) NULL COMMENT 'Token chia sẻ link bài thi',
  `brand_logo_url` TEXT NULL COMMENT 'Logo thương hiệu cho bài thi',
  `brand_color` VARCHAR(20) NULL COMMENT 'Màu thương hiệu (hex)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo đề',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_quizzes_share_token` (`share_token`),
  KEY `idx_quizzes_teacher_id` (`teacher_id`),
  KEY `idx_quizzes_class_id` (`class_id`),
  KEY `idx_quizzes_published` (`is_published`),
  KEY `idx_quizzes_scheduled_at` (`scheduled_at`),
  KEY `idx_quizzes_expires_at` (`expires_at`),
  KEY `idx_quizzes_class_published` (`class_id`, `is_published`),
  CONSTRAINT `fk_quizzes_teacher`
    FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_quizzes_class`
    FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Đề thi thuộc về giáo viên và có thể gán cho lớp';

-- =========================================================
-- 5) questions
-- =========================================================
CREATE TABLE `questions` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính câu hỏi',
  `quiz_id` INT NOT NULL COMMENT 'Đề thi chứa câu hỏi (quizzes.id)',
  `text` TEXT NOT NULL COMMENT 'Nội dung câu hỏi',
  `image_url` TEXT NULL COMMENT 'Ảnh minh họa cho câu hỏi',
  `youtube_url` VARCHAR(255) NULL COMMENT 'Link video YouTube đính kèm',
  `explanation` TEXT NULL COMMENT 'Giải thích đáp án đúng',
  `type` ENUM('single', 'multiple', 'essay') NOT NULL DEFAULT 'single' COMMENT 'Loại câu hỏi',
  `points` INT NOT NULL DEFAULT 1 COMMENT 'Số điểm của câu',
  `order_index` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị trong đề',
  `topic` VARCHAR(100) NULL COMMENT 'Chủ đề của câu hỏi',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium' COMMENT 'Độ khó',
  `created_by` INT NULL COMMENT 'Người tạo câu hỏi (users.id)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo câu hỏi',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật câu hỏi',
  PRIMARY KEY (`id`),
  KEY `idx_questions_quiz_id` (`quiz_id`),
  KEY `idx_questions_type` (`type`),
  KEY `idx_questions_topic` (`topic`),
  KEY `idx_questions_difficulty` (`difficulty`),
  KEY `idx_questions_created_by` (`created_by`),
  KEY `idx_questions_quiz_order` (`quiz_id`, `order_index`),
  CONSTRAINT `fk_questions_quiz`
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_questions_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách câu hỏi của từng đề thi';

-- =========================================================
-- 6) options
-- =========================================================
CREATE TABLE `options` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính đáp án',
  `question_id` INT NOT NULL COMMENT 'Câu hỏi chứa đáp án (questions.id)',
  `text` TEXT NOT NULL COMMENT 'Nội dung đáp án',
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đánh dấu đáp án đúng',
  `order_index` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự A/B/C/D',
  PRIMARY KEY (`id`),
  KEY `idx_options_question_id` (`question_id`),
  KEY `idx_options_question_order` (`question_id`, `order_index`),
  CONSTRAINT `fk_options_question`
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Các phương án trả lời cho câu hỏi trắc nghiệm';

-- =========================================================
-- 7) submissions
-- =========================================================
CREATE TABLE `submissions` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính bài làm',
  `quiz_id` INT NOT NULL COMMENT 'Đề thi được nộp (quizzes.id)',
  `student_id` INT NULL COMMENT 'Học sinh đã đăng nhập (users.id), có thể NULL',
  `student_name` VARCHAR(100) NULL COMMENT 'Tên thí sinh nếu làm bài không login',
  `student_email` VARCHAR(100) NULL COMMENT 'Email thí sinh nếu làm bài không login',
  `total_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm thực tế đạt được',
  `max_score` INT NOT NULL DEFAULT 0 COMMENT 'Điểm tối đa của bài thi',
  `status` ENUM('in_progress', 'submitted', 'graded') NOT NULL DEFAULT 'in_progress' COMMENT 'Trạng thái bài làm',
  `attempt_no` INT NOT NULL DEFAULT 1 COMMENT 'Lần làm bài thứ mấy',
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm bắt đầu',
  `submitted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Thời điểm nộp',
  `ip_address` VARCHAR(45) NULL COMMENT 'IP của thí sinh',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_submissions_quiz_student_attempt` (`quiz_id`, `student_id`, `attempt_no`),
  KEY `idx_submissions_student_id` (`student_id`),
  KEY `idx_submissions_attempt_no` (`attempt_no`),
  KEY `idx_submissions_status` (`status`),
  KEY `idx_submissions_submitted_at` (`submitted_at`),
  KEY `idx_submissions_student_email` (`student_email`),
  CONSTRAINT `fk_submissions_quiz`
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_submissions_student`
    FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Bài nộp của học sinh cho từng đề thi';

-- =========================================================
-- 8) answers
-- =========================================================
CREATE TABLE `answers` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính câu trả lời',
  `submission_id` INT NOT NULL COMMENT 'Bài làm chứa câu trả lời (submissions.id)',
  `question_id` INT NOT NULL COMMENT 'Câu hỏi được trả lời (questions.id)',
  `option_id` INT NULL COMMENT 'Đáp án được chọn (options.id), NULL cho tự luận',
  `essay_answer` TEXT NULL COMMENT 'Nội dung tự luận',
  `essay_image_url` TEXT NULL COMMENT 'Ảnh đính kèm cho câu trả lời tự luận',
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đúng/sai (áp dụng cho chấm tự động)',
  `score_awarded` INT NOT NULL DEFAULT 0 COMMENT 'Điểm được chấm cho câu trả lời',
  `feedback` TEXT NULL COMMENT 'Nhận xét từ giáo viên',
  `answered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm trả lời',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_answers_submission_question` (`submission_id`, `question_id`),
  KEY `idx_answers_question_id` (`question_id`),
  KEY `idx_answers_option_id` (`option_id`),
  KEY `idx_answers_is_correct` (`is_correct`),
  CONSTRAINT `fk_answers_submission`
    FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_answers_question`
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_answers_option`
    FOREIGN KEY (`option_id`) REFERENCES `options` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Chi tiết câu trả lời cho từng câu trong bài nộp';

-- =========================================================
-- 9) question_bank
-- =========================================================
CREATE TABLE `question_bank` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính ngân hàng câu hỏi',
  `teacher_id` INT NOT NULL COMMENT 'Giáo viên sở hữu câu hỏi (users.id)',
  `text` TEXT NOT NULL COMMENT 'Nội dung câu hỏi ngân hàng',
  `type` ENUM('single', 'multiple', 'essay') NOT NULL DEFAULT 'single' COMMENT 'Loại câu hỏi',
  `category` VARCHAR(100) NULL COMMENT 'Chủ đề/môn học',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium' COMMENT 'Độ khó',
  `tags` VARCHAR(255) NULL COMMENT 'Nhãn phân loại',
  `explanation` TEXT NULL COMMENT 'Giải thích đáp án đúng',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
  PRIMARY KEY (`id`),
  KEY `idx_question_bank_teacher_id` (`teacher_id`),
  KEY `idx_question_bank_category` (`category`),
  KEY `idx_question_bank_difficulty` (`difficulty`),
  KEY `idx_question_bank_teacher_difficulty` (`teacher_id`, `difficulty`),
  CONSTRAINT `fk_question_bank_teacher`
    FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Ngân hàng câu hỏi dùng để tái sử dụng tạo đề';

-- =========================================================
-- 10) bank_options
-- =========================================================
CREATE TABLE `bank_options` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính đáp án ngân hàng',
  `question_bank_id` INT NOT NULL COMMENT 'Câu hỏi ngân hàng (question_bank.id)',
  `text` TEXT NOT NULL COMMENT 'Nội dung đáp án',
  `is_correct` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đáp án đúng hay không',
  `order_index` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị đáp án',
  PRIMARY KEY (`id`),
  KEY `idx_bank_options_question_bank_id` (`question_bank_id`),
  KEY `idx_bank_options_question_order` (`question_bank_id`, `order_index`),
  CONSTRAINT `fk_bank_options_question_bank`
    FOREIGN KEY (`question_bank_id`) REFERENCES `question_bank` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Đáp án của câu hỏi trong ngân hàng';

-- =========================================================
-- 11) class_documents
-- =========================================================
CREATE TABLE `class_documents` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính tài liệu lớp',
  `class_id` INT NOT NULL COMMENT 'Lớp học chứa tài liệu (classes.id)',
  `teacher_id` INT NOT NULL COMMENT 'Giáo viên tải tài liệu (users.id)',
  `title` VARCHAR(200) NOT NULL COMMENT 'Tiêu đề tài liệu',
  `file_url` TEXT NULL COMMENT 'Đường dẫn file tài liệu',
  `file_type` VARCHAR(50) NULL COMMENT 'Loại file (pdf, video, docx...)',
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tải lên',
  PRIMARY KEY (`id`),
  KEY `idx_class_documents_class_id` (`class_id`),
  KEY `idx_class_documents_teacher_id` (`teacher_id`),
  KEY `idx_class_documents_file_type` (`file_type`),
  KEY `idx_class_documents_uploaded_at` (`uploaded_at`),
  CONSTRAINT `fk_class_documents_class`
    FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_class_documents_teacher`
    FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tài liệu học tập của lớp';

-- =========================================================
-- SAMPLE DATA
-- Yêu cầu tối thiểu:
-- - 1 giáo viên
-- - 3 học sinh
-- - 1 lớp học
-- - 2 đề thi
-- - mỗi đề 5 câu hỏi
-- - mỗi câu 4 đáp án
-- =========================================================

INSERT INTO `users`
(`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `avatar_url`)
VALUES
  (1, 'teacher_nam', 'teacher.nam@ninequiz.vn', 'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29', 'Nguyễn Minh Nam', 'teacher', NULL),
  (2, 'student_an', 'an@student.ninequiz.vn', 'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29', 'Lê Minh An', 'student', NULL),
  (3, 'student_binh', 'binh@student.ninequiz.vn', 'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29', 'Trần Thu Bình', 'student', NULL),
  (4, 'student_chi', 'chi@student.ninequiz.vn', 'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29', 'Phạm Ngọc Chi', 'student', NULL);

INSERT INTO `classes`
(`id`, `name`, `description`, `join_code`, `teacher_id`)
VALUES
  (1, 'Lớp 12A1 - Toán/Tổng hợp', 'Lớp học thử nghiệm trên hệ thống NineQuiz', 'NQ12A1', 1);

INSERT INTO `user_class`
(`id`, `user_id`, `class_id`, `status`)
VALUES
  (1, 2, 1, 'approved'),
  (2, 3, 1, 'approved'),
  (3, 4, 1, 'approved');

INSERT INTO `quizzes`
(`id`, `title`, `description`, `time_limit_minutes`, `is_shuffled`, `is_published`, `teacher_id`, `class_id`, `scheduled_at`, `expires_at`)
VALUES
  (
    1,
    'Toán cơ bản - Đề số 1',
    'Đề gồm các câu hỏi toán cơ bản cho học sinh lớp 12',
    30,
    TRUE,
    TRUE,
    1,
    1,
    DATE_ADD(NOW(), INTERVAL -1 DAY),
    DATE_ADD(NOW(), INTERVAL 30 DAY)
  ),
  (
    2,
    'Lịch sử Việt Nam - Đề số 1',
    'Đề lịch sử Việt Nam với các mốc kiến thức trọng tâm',
    25,
    FALSE,
    TRUE,
    1,
    1,
    DATE_ADD(NOW(), INTERVAL -1 DAY),
    DATE_ADD(NOW(), INTERVAL 30 DAY)
  );

INSERT INTO `questions`
(`id`, `quiz_id`, `text`, `image_url`, `type`, `points`, `order_index`)
VALUES
  (1, 1, '12 + 8 bằng bao nhiêu?', NULL, 'single', 1, 1),
  (2, 1, '9 x 7 bằng bao nhiêu?', NULL, 'single', 1, 2),
  (3, 1, 'Số nào sau đây là số nguyên tố?', NULL, 'single', 1, 3),
  (4, 1, 'Nghiệm của phương trình 2x - 6 = 0 là?', NULL, 'single', 1, 4),
  (5, 1, 'Diện tích hình vuông cạnh 6cm là?', NULL, 'single', 1, 5),
  (6, 2, 'Văn Miếu - Quốc Tử Giám được lập vào triều đại nào?', NULL, 'single', 1, 1),
  (7, 2, 'Người chỉ huy chiến thắng Bạch Đằng năm 1288 là ai?', NULL, 'single', 1, 2),
  (8, 2, 'Tuyên ngôn Độc lập năm 1945 được đọc tại đâu?', NULL, 'single', 1, 3),
  (9, 2, 'Chiến dịch Điện Biên Phủ kết thúc vào năm nào?', NULL, 'single', 1, 4),
  (10, 2, 'Năm giải phóng miền Nam, thống nhất đất nước là?', NULL, 'single', 1, 5);

INSERT INTO `options`
(`id`, `question_id`, `text`, `is_correct`, `order_index`)
VALUES
  -- Q1
  (1, 1, '18', FALSE, 1),
  (2, 1, '20', TRUE, 2),
  (3, 1, '22', FALSE, 3),
  (4, 1, '24', FALSE, 4),
  -- Q2
  (5, 2, '56', FALSE, 1),
  (6, 2, '63', TRUE, 2),
  (7, 2, '72', FALSE, 3),
  (8, 2, '81', FALSE, 4),
  -- Q3
  (9, 3, '21', FALSE, 1),
  (10, 3, '27', FALSE, 2),
  (11, 3, '29', TRUE, 3),
  (12, 3, '35', FALSE, 4),
  -- Q4
  (13, 4, '2', FALSE, 1),
  (14, 4, '3', TRUE, 2),
  (15, 4, '4', FALSE, 3),
  (16, 4, '6', FALSE, 4),
  -- Q5
  (17, 5, '24 cm2', FALSE, 1),
  (18, 5, '30 cm2', FALSE, 2),
  (19, 5, '36 cm2', TRUE, 3),
  (20, 5, '42 cm2', FALSE, 4),
  -- Q6
  (21, 6, 'Triều Lý', TRUE, 1),
  (22, 6, 'Triều Trần', FALSE, 2),
  (23, 6, 'Triều Lê sơ', FALSE, 3),
  (24, 6, 'Triều Nguyễn', FALSE, 4),
  -- Q7
  (25, 7, 'Trần Hưng Đạo', TRUE, 1),
  (26, 7, 'Lê Lợi', FALSE, 2),
  (27, 7, 'Quang Trung', FALSE, 3),
  (28, 7, 'Ngô Quyền', FALSE, 4),
  -- Q8
  (29, 8, 'Hồ Gươm', FALSE, 1),
  (30, 8, 'Quảng trường Ba Đình', TRUE, 2),
  (31, 8, 'Dinh Độc Lập', FALSE, 3),
  (32, 8, 'Nhà hát Lớn Hà Nội', FALSE, 4),
  -- Q9
  (33, 9, '1952', FALSE, 1),
  (34, 9, '1953', FALSE, 2),
  (35, 9, '1954', TRUE, 3),
  (36, 9, '1955', FALSE, 4),
  -- Q10
  (37, 10, '1973', FALSE, 1),
  (38, 10, '1974', FALSE, 2),
  (39, 10, '1975', TRUE, 3),
  (40, 10, '1976', FALSE, 4);

INSERT INTO `question_bank`
(`id`, `teacher_id`, `text`, `type`, `category`, `difficulty`, `tags`)
VALUES
  (1, 1, 'Căn bậc hai của 81 là bao nhiêu?', 'single', 'Toán học', 'easy', 'toan,can-ban'),
  (2, 1, 'Năm bắt đầu Cách mạng tháng Tám?', 'single', 'Lịch sử', 'medium', 'lich-su,viet-nam'),
  (3, 1, 'Viết ngắn gọn ý nghĩa của chiến thắng Điện Biên Phủ.', 'essay', 'Lịch sử', 'hard', 'lich-su,tu-luan');

INSERT INTO `bank_options`
(`id`, `question_bank_id`, `text`, `is_correct`, `order_index`)
VALUES
  (1, 1, '7', FALSE, 1),
  (2, 1, '8', FALSE, 2),
  (3, 1, '9', TRUE, 3),
  (4, 1, '10', FALSE, 4),
  (5, 2, '1943', FALSE, 1),
  (6, 2, '1944', FALSE, 2),
  (7, 2, '1945', TRUE, 3),
  (8, 2, '1946', FALSE, 4);

INSERT INTO `class_documents`
(`id`, `class_id`, `teacher_id`, `title`, `file_url`, `file_type`)
VALUES
  (
    1,
    1,
    1,
    'Tài liệu ôn tập giữa kỳ',
    'https://cdn.ninequiz.vn/docs/on-tap-giua-ky.pdf',
    'pdf'
  );

INSERT INTO `submissions`
(`id`, `quiz_id`, `student_id`, `student_name`, `student_email`, `total_score`, `max_score`, `status`, `started_at`, `submitted_at`, `ip_address`)
VALUES
  (
    1,
    1,
    2,
    'Lê Minh An',
    'an@student.ninequiz.vn',
    4,
    5,
    'graded',
    DATE_ADD(NOW(), INTERVAL -2 HOUR),
    DATE_ADD(NOW(), INTERVAL -90 MINUTE),
    '203.113.10.20'
  ),
  (
    2,
    2,
    3,
    'Trần Thu Bình',
    'binh@student.ninequiz.vn',
    0,
    5,
    'in_progress',
    DATE_ADD(NOW(), INTERVAL -30 MINUTE),
    NULL,
    '203.113.10.21'
  );

INSERT INTO `answers`
(`id`, `submission_id`, `question_id`, `option_id`, `essay_answer`, `is_correct`, `answered_at`)
VALUES
  (1, 1, 1, 2, NULL, TRUE, DATE_ADD(NOW(), INTERVAL -110 MINUTE)),
  (2, 1, 2, 6, NULL, TRUE, DATE_ADD(NOW(), INTERVAL -108 MINUTE)),
  (3, 1, 3, 11, NULL, TRUE, DATE_ADD(NOW(), INTERVAL -106 MINUTE)),
  (4, 1, 4, 14, NULL, TRUE, DATE_ADD(NOW(), INTERVAL -104 MINUTE)),
  (5, 1, 5, 20, NULL, FALSE, DATE_ADD(NOW(), INTERVAL -102 MINUTE)),
  (6, 2, 6, 22, NULL, FALSE, DATE_ADD(NOW(), INTERVAL -20 MINUTE)),
  (7, 2, 7, 25, NULL, TRUE, DATE_ADD(NOW(), INTERVAL -18 MINUTE));

-- =========================================================
-- SELECT mẫu kiểm tra dữ liệu
-- =========================================================

-- 1) Số lượng người dùng theo vai trò
SELECT `role`, COUNT(*) AS `total_users`
FROM `users`
GROUP BY `role`;

-- 2) Danh sách học sinh trong lớp
SELECT c.`name` AS `class_name`,
       u.`full_name` AS `student_name`,
       u.`email`
FROM `user_class` uc
JOIN `classes` c ON c.`id` = uc.`class_id`
JOIN `users` u ON u.`id` = uc.`user_id`
ORDER BY c.`id`, u.`id`;

-- 3) Tổng số câu hỏi theo từng đề thi
SELECT q.`id`,
       q.`title`,
       COUNT(ques.`id`) AS `question_count`
FROM `quizzes` q
LEFT JOIN `questions` ques ON ques.`quiz_id` = q.`id`
GROUP BY q.`id`, q.`title`
ORDER BY q.`id`;

-- 4) Kiểm tra mỗi câu hỏi có 4 đáp án
SELECT ques.`id` AS `question_id`,
       COUNT(o.`id`) AS `option_count`
FROM `questions` ques
LEFT JOIN `options` o ON o.`question_id` = ques.`id`
GROUP BY ques.`id`
ORDER BY ques.`id`;

-- 5) Kết quả bài làm
SELECT s.`id` AS `submission_id`,
       q.`title` AS `quiz_title`,
       COALESCE(u.`full_name`, s.`student_name`) AS `student_name`,
       s.`total_score`,
       s.`max_score`,
       s.`status`,
       s.`submitted_at`
FROM `submissions` s
JOIN `quizzes` q ON q.`id` = s.`quiz_id`
LEFT JOIN `users` u ON u.`id` = s.`student_id`
ORDER BY s.`id`;

-- 6) Tỷ lệ trả lời đúng theo câu hỏi (cho dữ liệu đã có)
SELECT a.`question_id`,
       ROUND(AVG(CASE WHEN a.`is_correct` THEN 1 ELSE 0 END) * 100, 2) AS `correct_rate_percent`,
       COUNT(*) AS `attempt_count`
FROM `answers` a
GROUP BY a.`question_id`
ORDER BY a.`question_id`;
