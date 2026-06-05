-- MIGRATION: 20260512_consolidate_lawyer_tables.sql
-- OBJECTIVE: Eliminate repetition and inconsistencies between lawyer_members and lawyer_profiles.

-- 1. CLEANUP lawyer_members
ALTER TABLE public.lawyer_members 
  -- Remove legacy credit_balance if it exists (now in lawyer_wallets)
  DROP COLUMN IF EXISTS credit_balance,
  -- Add is_verified if missing (for quick UI badges)
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  -- Ensure specialties and judicial_districts exist
  ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS judicial_districts text[] DEFAULT '{}';

-- 2. CLEANUP lawyer_profiles
ALTER TABLE public.lawyer_profiles
  -- Remove notification_email (redundant with lawyer_members.email)
  DROP COLUMN IF EXISTS notification_email,
  -- Remove main_specialty (redundant with lawyer_members.specialties)
  DROP COLUMN IF EXISTS main_specialty,
  -- Remove is_verified from profiles (keep only in lawyer_members for badges)
  DROP COLUMN IF EXISTS is_verified,
  -- Remove verification_status (is_verified bool is enough)
  DROP COLUMN IF EXISTS verification_status;

-- 4. UPDATE handle_new_user TRIGGER
-- Ensure it initializes lawyer_members with correct defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into lawyer_members
  INSERT INTO public.lawyer_members (id, email, full_name, is_active, is_verified)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    false, -- Default to inactive until verified/ready
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

  -- Create Wallet
  INSERT INTO public.lawyer_wallets (lawyer_id, balance)
  VALUES (new.id, 0)
  ON CONFLICT (lawyer_id) DO NOTHING;

  -- Create Stats
  INSERT INTO public.lawyer_stats (lawyer_id)
  VALUES (new.id)
  ON CONFLICT (lawyer_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RE-APPLY TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created_init_lawyer ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_member ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_lawyer_members_verified ON lawyer_members(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_lawyer_members_active ON lawyer_members(is_active) WHERE is_active = true;
