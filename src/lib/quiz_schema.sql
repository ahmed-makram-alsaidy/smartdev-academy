-- ============================================
-- Quiz System - Complete Database Schema
-- ============================================

-- 1. جدول الاختبارات (Quizzes)
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 0,
    passing_score INTEGER DEFAULT 70,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول الأسئلة (Quiz Questions)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'mcq',
    options JSONB,
    correct_answer TEXT,
    points INTEGER DEFAULT 10,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول محاولات الاختبارات (Quiz Attempts)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT false,
    answers JSONB,
    time_taken INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes للأداء
-- ============================================

CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_published ON quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes Policies
CREATE POLICY "Quizzes viewable by enrolled students" ON quizzes
    FOR SELECT
    USING (
        is_published = true OR
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage quizzes" ON quizzes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Quiz Questions Policies
CREATE POLICY "Quiz questions viewable by students" ON quiz_questions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.is_published = true
        ) OR
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage quiz questions" ON quiz_questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Quiz Attempts Policies
CREATE POLICY "Students can view their own attempts" ON quiz_attempts
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Students can create attempts" ON quiz_attempts
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all attempts" ON quiz_attempts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- ============================================
-- Comments للتوضيح
-- ============================================

COMMENT ON TABLE quizzes IS 'جدول الاختبارات الخاصة بالدورات';
COMMENT ON TABLE quiz_questions IS 'جدول أسئلة الاختبارات';
COMMENT ON TABLE quiz_attempts IS 'جدول محاولات الطلاب في الاختبارات';

COMMENT ON COLUMN quiz_attempts.time_taken IS 'الوقت المستغرق في الاختبار بالثواني';
COMMENT ON COLUMN quizzes.passing_score IS 'النسبة المئوية المطلوبة للنجاح';
