-- Add has_certificate column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS has_certificate BOOLEAN DEFAULT FALSE;

-- Update existing courses to have certificate enabled by default (optional, but good for transition)
-- UPDATE courses SET has_certificate = TRUE; 
-- Actually, user wants control, so let's keep it FALSE by default for safety, or TRUE if they want existing ones to work.
-- Given the user's complaint "it gives certificate too easily", FALSE is safer.
