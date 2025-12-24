-- إضافة عمود time_taken لجدول quiz_attempts
-- يستخدم لتتبع الوقت الذي استغرقه الطالب في حل الاختبار

-- إضافة العمود
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS time_taken INTEGER DEFAULT 0;

-- إضافة comment للتوضيح
COMMENT ON COLUMN quiz_attempts.time_taken IS 'Time taken to complete the quiz in seconds';

-- تحديث السجلات القديمة (اختياري)
UPDATE quiz_attempts 
SET time_taken = 0 
WHERE time_taken IS NULL;
