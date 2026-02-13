-- SQL Script: Fix Relationship for Lawyer Management
-- Objective: Ensure Supabase can join lawyer_members and lawyer_profiles.

-- 1. Add Foreign Key if missing or redirect it to lawyer_members
-- This assumes both tables use the same 'id' (from auth.users)
ALTER TABLE public.lawyer_profiles 
DROP CONSTRAINT IF EXISTS lawyer_profiles_id_fkey;

ALTER TABLE public.lawyer_profiles
ADD CONSTRAINT lawyer_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES public.lawyer_members(id) 
ON DELETE CASCADE;

-- 2. Grant permissions just in case
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_members ENABLE ROW LEVEL SECURITY;
