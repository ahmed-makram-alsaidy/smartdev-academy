-- ⚠️ IMPORTANT: يجب تطبيق هذا السكريبت على قاعدة بيانات Supabase
-- This script MUST be run on your Supabase database

-- إصلاح Row Level Security (RLS) لجدول quiz_attempts
-- هذا السكريبت يسمح للأدمن بقراءة جميع محاولات الاختبارات

-- 1. تفعيل RLS على الجدول
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 2. حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON public.quiz_attempts;

-- 3. السماح للمستخدمين بقراءة محاولاتهم الخاصة
CREATE POLICY "Users can view their own quiz attempts"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. السماح للمستخدمين بإضافة محاولات جديدة لأنفسهم
CREATE POLICY "Users can insert their own quiz attempts"
ON public.quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. السماح للأدمن بقراءة جميع المحاولات (هذا المهم!)
CREATE POLICY "Admins can view all quiz attempts"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 6. التحقق من السياسات
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'quiz_attempts'
ORDER BY policyname;

-- 7. اختبار البيانات - عرض بعض المحاولات (للتأكد من وجود بيانات)
SELECT 
    qa.id,
    qa.quiz_id,
    qa.user_id,
    qa.score,
    qa.passed,
    qa.time_taken,
    qa.started_at,  -- ✅ الـ column الصحيح هو started_at
    qa.completed_at,
    u.full_name,
    u.email,
    q.title as quiz_title
FROM quiz_attempts qa
LEFT JOIN users u ON u.id = qa.user_id
LEFT JOIN quizzes q ON q.id = qa.quiz_id
ORDER BY qa.started_at DESC
LIMIT 10;
