-- SQL Script: Self-Healing Sync & Fix Relationship
-- Objective: Fix the "key not present" error by syncing missing lawyers from auth.users.

-- 1. Ensure all authenticated users who should be lawyers are in lawyer_members
-- This populates lawyer_members from the master auth.users table
INSERT INTO public.lawyer_members (id, email, full_name)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. Optional: Remove records from lawyer_profiles that have NO match in auth.users
-- (Orphaned data that would break the Foreign Key anyway)
DELETE FROM public.lawyer_profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. Now safely apply the Foreign Key constraint
ALTER TABLE public.lawyer_profiles 
DROP CONSTRAINT IF EXISTS lawyer_profiles_id_fkey;

ALTER TABLE public.lawyer_profiles
ADD CONSTRAINT lawyer_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES public.lawyer_members(id) 
ON DELETE CASCADE;

-- 4. Verify the counts
SELECT 
    (SELECT count(*) FROM lawyer_members) as total_members,
    (SELECT count(*) FROM lawyer_profiles) as total_profiles;
