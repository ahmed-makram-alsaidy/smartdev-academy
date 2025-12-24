-- Create Materials Table (Resources)
CREATE TABLE public.materials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text DEFAULT 'link' CHECK (file_type IN ('link', 'pdf', 'video', 'image')),
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT materials_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can view published materials
CREATE POLICY "Public materials are viewable by everyone" ON public.materials
  FOR SELECT USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage materials" ON public.materials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );
