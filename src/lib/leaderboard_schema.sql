-- Create Leaderboard View
-- This view calculates the score for each user based on completed lessons and quiz attempts

CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  u.id as user_id,
  u.full_name,
  u.email,
  u.avatar_url,
  (
    -- Points from completed lessons (e.g., 10 points per lesson)
    (SELECT count(*) FROM public.enrollments e 
     CROSS JOIN LATERAL jsonb_array_elements_text(e.completed_lessons) 
     WHERE e.user_id = u.id) * 10
    +
    -- Points from quiz attempts (sum of scores)
    COALESCE((SELECT sum(score) FROM public.quiz_attempts qa WHERE qa.user_id = u.id), 0)
  ) as total_score
FROM public.users u
WHERE u.role = 'student'
ORDER BY total_score DESC;

-- Grant access to the view
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;
