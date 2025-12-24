-- Create Quizzes Table
CREATE TABLE public.quizzes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  course_id bigint NOT NULL,
  title text NOT NULL,
  description text,
  time_limit_minutes integer DEFAULT 0, -- 0 means no limit
  passing_score integer DEFAULT 70,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT quizzes_pkey PRIMARY KEY (id),
  CONSTRAINT quizzes_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Create Quiz Questions Table
CREATE TABLE public.quiz_questions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  quiz_id bigint NOT NULL,
  question_text text NOT NULL,
  question_type text DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'text')),
  options jsonb DEFAULT '[]'::jsonb, -- Array of strings for MCQ options
  correct_answer text, -- The correct option string or text answer
  points integer DEFAULT 10,
  "order" integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE
);

-- Create Quiz Attempts Table (Student Submissions)
CREATE TABLE public.quiz_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  quiz_id bigint NOT NULL,
  score integer DEFAULT 0,
  passed boolean DEFAULT false,
  answers jsonb DEFAULT '{}'::jsonb, -- Store user answers {question_id: answer}
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for Quizzes
-- Everyone can read published quizzes
CREATE POLICY "Public quizzes are viewable by everyone" ON public.quizzes
  FOR SELECT USING (true);

-- Admins can do everything with quizzes
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Policies for Questions
-- Everyone can read questions (usually only when taking the quiz, but for simplicity we allow read)
CREATE POLICY "Questions are viewable by everyone" ON public.quiz_questions
  FOR SELECT USING (true);

-- Admins can manage questions
CREATE POLICY "Admins can manage questions" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Policies for Attempts
-- Users can view their own attempts
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own attempts
CREATE POLICY "Users can create attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all attempts
CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );
