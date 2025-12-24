-- Fix Infinite Recursion in RLS Policies

-- 1. Create a secure function to check if a user is an admin
-- This function runs with "SECURITY DEFINER" privileges, meaning it bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the problematic recursive policies on the 'users' table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins full access users" ON public.users;

-- 3. Re-create the Admin policy using the new function (avoids recursion)
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE
  USING (public.is_admin());

-- 4. Ensure basic user policies exist and are correct
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- 5. Fix Enrollments Policies (Prevent recursion if any)
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.enrollments;
CREATE POLICY "Admins manage enrollments" ON public.enrollments
  FOR ALL
  USING (public.is_admin());

-- 6. Fix Courses Policies
DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL
  USING (public.is_admin());

-- 7. Fix Quizzes Policies
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL
  USING (public.is_admin());

-- 8. Fix Questions Policies
DROP POLICY IF EXISTS "Admins can manage questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage questions" ON public.quiz_questions
  FOR ALL
  USING (public.is_admin());

-- 9. Fix Posts Policies
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts
  FOR ALL
  USING (public.is_admin());
