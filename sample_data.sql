-- ============================================
-- QuizFlow - Sample Data SQL (new schema)
-- Requires tables from ninequiz_schema.sql
-- Password for all accounts below: 123456
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM answers;
DELETE FROM submissions;
DELETE FROM options;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM user_class;
DELETE FROM classes;
DELETE FROM bank_options;
DELETE FROM question_bank;
DELETE FROM class_documents;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1) USERS
-- ============================================
INSERT INTO users (id, username, email, password_hash, full_name, role)
VALUES
  (1, 'teacher1', 'teacher1@quizflow.com',
   'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29',
   'Nguyen Van Thay', 'teacher'),
  (2, 'student1', 'student1@quizflow.com',
   'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29',
   'Le Van An', 'student'),
  (3, 'student2', 'student2@quizflow.com',
   'scrypt:32768:8:1$JlHc4qtpzj7QiI8V$6c319adb25393a51c1c6a56588273c670d8a61e984aac53ec386f9d01f28f60686d5b1542f2d3ab8835e7f11f9b81c642e22dfee657e5a879bf58a1049b84f29',
   'Pham Thi Binh', 'student');

-- ============================================
-- 2) CLASS + MEMBERS
-- ============================================
INSERT INTO classes (id, name, description, join_code, teacher_id)
VALUES
  (1, 'Lop 12A1 - Toan', 'Lop mau', 'QF12A1', 1);

INSERT INTO user_class (id, user_id, class_id, status)
VALUES
  (1, 2, 1, 'approved'),
  (2, 3, 1, 'approved');

-- ============================================
-- 3) QUIZ + QUESTIONS + OPTIONS
-- ============================================
INSERT INTO quizzes (
  id, title, description, time_limit_minutes, is_shuffled, shuffle_options,
  is_published, allow_retake, teacher_id, class_id, scheduled_at, expires_at
) VALUES
  (
    1,
    'Toan co ban - De 1',
    'De mau cho hoc sinh lop 12',
    20,
    FALSE,
    TRUE,
    TRUE,
    TRUE,
    1,
    1,
    DATE_ADD(NOW(), INTERVAL -1 DAY),
    DATE_ADD(NOW(), INTERVAL 30 DAY)
  );

INSERT INTO questions (id, quiz_id, text, type, points, order_index, topic, difficulty, created_by)
VALUES
  (1, 1, '12 + 8 bang bao nhieu?', 'single', 1, 1, 'Toan', 'easy', 1),
  (2, 1, '9 x 7 bang bao nhieu?', 'single', 1, 2, 'Toan', 'easy', 1),
  (3, 1, 'So nao sau day la so nguyen to?', 'single', 1, 3, 'Toan', 'medium', 1);

INSERT INTO options (id, question_id, text, is_correct, order_index)
VALUES
  (1, 1, '18', FALSE, 1),
  (2, 1, '20', TRUE, 2),
  (3, 1, '22', FALSE, 3),
  (4, 1, '24', FALSE, 4),
  (5, 2, '56', FALSE, 1),
  (6, 2, '63', TRUE, 2),
  (7, 2, '72', FALSE, 3),
  (8, 2, '81', FALSE, 4),
  (9, 3, '21', FALSE, 1),
  (10, 3, '27', FALSE, 2),
  (11, 3, '29', TRUE, 3),
  (12, 3, '35', FALSE, 4);

-- ============================================
-- 4) QUESTION BANK (OPTIONAL)
-- ============================================
INSERT INTO question_bank (id, teacher_id, text, type, category, difficulty, tags)
VALUES
  (1, 1, 'Can bac hai cua 81 la bao nhieu?', 'single', 'Toan', 'easy', 'toan');

INSERT INTO bank_options (id, question_bank_id, text, is_correct, order_index)
VALUES
  (1, 1, '7', FALSE, 1),
  (2, 1, '8', FALSE, 2),
  (3, 1, '9', TRUE, 3),
  (4, 1, '10', FALSE, 4);

-- ============================================
-- 5) SUBMISSION + ANSWERS
-- ============================================
INSERT INTO submissions (
  id, quiz_id, student_id, student_name, student_email,
  total_score, max_score, status, attempt_no, started_at, submitted_at, ip_address
) VALUES
  (
    1,
    1,
    2,
    'Le Van An',
    'student1@quizflow.com',
    2,
    3,
    'graded',
    1,
    DATE_ADD(NOW(), INTERVAL -1 DAY),
    DATE_ADD(DATE_ADD(NOW(), INTERVAL -1 DAY), INTERVAL 15 MINUTE),
    '127.0.0.1'
  );

INSERT INTO answers (id, submission_id, question_id, option_id, is_correct, score_awarded, answered_at)
VALUES
  (1, 1, 1, 2, TRUE, 1, DATE_ADD(DATE_ADD(NOW(), INTERVAL -1 DAY), INTERVAL 5 MINUTE)),
  (2, 1, 2, 6, TRUE, 1, DATE_ADD(DATE_ADD(NOW(), INTERVAL -1 DAY), INTERVAL 8 MINUTE)),
  (3, 1, 3, 10, FALSE, 0, DATE_ADD(DATE_ADD(NOW(), INTERVAL -1 DAY), INTERVAL 12 MINUTE));

-- ============================================
-- DONE
-- ============================================
SELECT 'Sample data imported successfully!' AS status;
SELECT 'Users:', COUNT(*) FROM users;
SELECT 'Quizzes:', COUNT(*) FROM quizzes;
SELECT 'Questions:', COUNT(*) FROM questions;
SELECT 'Submissions:', COUNT(*) FROM submissions;
