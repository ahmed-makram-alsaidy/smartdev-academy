-- إصلاح Row Level Security (RLS) لجدول quiz_attempts
-- هذا السكريبت يسمح للأدمن بقراءة جميع محاولات الاختبارات

-- 1. تفعيل RLS على الجدول
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 2. حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;

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

-- 6. التحقق من السياسات (optional - للتأكد)
-- SELECT * FROM pg_policies WHERE tablename = 'quiz_attempts';
