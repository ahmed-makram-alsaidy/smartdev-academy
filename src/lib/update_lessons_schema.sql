-- Add columns to lessons table if they don't exist
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_assignment boolean DEFAULT false;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_final boolean DEFAULT false;
