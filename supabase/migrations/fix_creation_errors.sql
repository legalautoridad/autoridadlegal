-- SQL Script: Consolidate Triggers and Relax Constraints
-- Objective: Fix "Database error creating new user" by ensuring triggers are clean and profile data is flexible.

-- 1. Relax NOT NULL constraints on lawyer_profiles
-- This allows creating a lawyer from admin without having all documents/bar info immediately.
ALTER TABLE public.lawyer_profiles ALTER COLUMN document_number DROP NOT NULL;
ALTER TABLE public.lawyer_profiles ALTER COLUMN bar_association DROP NOT NULL;
ALTER TABLE public.lawyer_profiles ALTER COLUMN bar_number DROP NOT NULL;
ALTER TABLE public.lawyer_profiles ALTER COLUMN office_address DROP NOT NULL;
ALTER TABLE public.lawyer_profiles ALTER COLUMN notification_phone DROP NOT NULL;

-- 2. Consolidate Trigger Function
-- Make it robust and ensure it only uses the new lawyer_members table.
CREATE OR REPLACE FUNCTION public.handle_new_lawyer_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert safely into lawyer_members
  INSERT INTO public.lawyer_members (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-map Triggers
-- Remove any old triggers to avoid multiple inserts or conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_member ON auth.users;

CREATE TRIGGER on_auth_user_created_lawyer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_lawyer_member();

-- 4. Ensure lawyer_members permissions for service role
GRANT ALL ON public.lawyer_members TO service_role;
GRANT ALL ON public.lawyer_profiles TO service_role;
