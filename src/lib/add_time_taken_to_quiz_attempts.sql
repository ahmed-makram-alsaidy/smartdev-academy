-- Add time_taken column to quiz_attempts table
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS time_taken integer DEFAULT 0;

-- Comment on column
COMMENT ON COLUMN public.quiz_attempts.time_taken IS 'Time taken to complete the quiz in seconds';
