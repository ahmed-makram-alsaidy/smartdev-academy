-- ==========================================
-- SmartDev Academy - Final Database Setup (Updated)
-- ==========================================

-- 1. Fix Infinite Recursion in RLS Policies (Admin Function)
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

-- 2. Fix Users Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins full access users" ON public.users;

CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 3. Create/Update Quizzes Tables
CREATE TABLE IF NOT EXISTS public.quizzes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  course_id bigint NOT NULL,
  title text NOT NULL,
  description text,
  time_limit_minutes integer DEFAULT 0,
  passing_score integer DEFAULT 70,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  quiz_id bigint NOT NULL,
  question_text text NOT NULL,
  question_type text DEFAULT 'mcq',
  options jsonb DEFAULT '[]'::jsonb,
  correct_answer text,
  points integer DEFAULT 10,
  "order" integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  quiz_id bigint NOT NULL,
  score integer DEFAULT 0,
  passed boolean DEFAULT false,
  answers jsonb DEFAULT '{}'::jsonb,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes Policies
DROP POLICY IF EXISTS "Public quizzes are viewable by everyone" ON public.quizzes;
CREATE POLICY "Public quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin());

-- Questions Policies
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.quiz_questions;
CREATE POLICY "Questions are viewable by everyone" ON public.quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage questions" ON public.quiz_questions FOR ALL USING (public.is_admin());

-- Attempts Policies
DROP POLICY IF EXISTS "Users can view own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create attempts" ON public.quiz_attempts;
CREATE POLICY "Users can create attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts FOR SELECT USING (public.is_admin());

-- 4. Create/Update Materials Table (Resources)
CREATE TABLE IF NOT EXISTS public.materials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text DEFAULT 'link',
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT materials_pkey PRIMARY KEY (id)
);

-- Ensure columns exist (for existing tables)
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS file_type text DEFAULT 'link';

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public materials are viewable by everyone" ON public.materials;
CREATE POLICY "Public materials are viewable by everyone" ON public.materials FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage materials" ON public.materials;
CREATE POLICY "Admins can manage materials" ON public.materials FOR ALL USING (public.is_admin());

-- 5. Create/Update Posts Table (Blog)
CREATE TABLE IF NOT EXISTS public.posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  content text,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- Ensure columns exist
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts FOR ALL USING (public.is_admin());

-- 6. Create Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  u.id as user_id,
  u.full_name,
  u.email,
  u.avatar_url,
  (
    (SELECT COALESCE(sum(cardinality(e.completed_lessons)), 0) FROM public.enrollments e 
     WHERE e.user_id = u.id) * 10
    +
    COALESCE((SELECT sum(score) FROM public.quiz_attempts qa WHERE qa.user_id = u.id), 0)
  ) as total_score
FROM public.users u
WHERE u.role = 'student'
ORDER BY total_score DESC;

GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;
