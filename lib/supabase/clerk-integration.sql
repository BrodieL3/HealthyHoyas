-- This SQL file contains the necessary setup for integrating Clerk with Supabase
-- Run these commands in the Supabase SQL Editor

-- 1. Create a function to get the Clerk user ID from the JWT token
CREATE OR REPLACE FUNCTION auth.clerk_user_id() 
RETURNS TEXT AS $$
BEGIN
  -- Extract the 'sub' claim from the JWT payload
  -- The 'sub' claim contains the Clerk user ID
  RETURN (current_setting('request.jwt.claims', true)::json->>'sub')::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a table to store user profiles (if not exists)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row Level Security on the user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy to allow users to read only their own profile
CREATE POLICY "Users can read their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (clerk_user_id = auth.clerk_user_id());

-- 5. Create RLS policy to allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (clerk_user_id = auth.clerk_user_id());

-- 6. Create RLS policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (clerk_user_id = auth.clerk_user_id());

-- 7. Create a secure function to get the current user's profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS SETOF public.user_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.user_profiles
  WHERE clerk_user_id = auth.clerk_user_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Example: Create a meals table with RLS for user data
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  calories INTEGER,
  protein_grams DECIMAL,
  carbs_grams DECIMAL,
  fat_grams DECIMAL,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Enable RLS on the meals table
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policy for the meals table
CREATE POLICY "Users can CRUD their own meals"
  ON public.meals
  USING (user_id = auth.clerk_user_id());

-- 11. Create a trigger to automatically update the updated_at field
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_user_profiles
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_meals
BEFORE UPDATE ON public.meals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at(); 