-- Fix Blog Posts RLS
-- Ensure the posts table exists (it should, but just in case)
CREATE TABLE IF NOT EXISTS public.posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  content text,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (is_published = true);

-- Allow admins to manage posts
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Fix Users Table RLS (for profiles)
-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Allow public to view basic user info (optional, e.g. for blog authors)
-- Uncomment if needed:
-- CREATE POLICY "Public can view user names" ON public.users
--   FOR SELECT USING (true);
