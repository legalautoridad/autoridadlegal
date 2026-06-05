-- Migration: 20260512_add_main_specialty_to_lawyer_profiles.sql
-- Objective: Fix "42703: undefined_column" error in Admin Dashboard by ensuring main_specialty exists.

-- 1. Add main_specialty to lawyer_profiles if it's missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lawyer_profiles' AND column_name = 'main_specialty') THEN
        ALTER TABLE public.lawyer_profiles ADD COLUMN main_specialty TEXT;
    END IF;
END $$;

-- 2. Add comment for clarity
COMMENT ON COLUMN public.lawyer_profiles.main_specialty IS 'Área legal principal de especialización del abogado';

-- 3. Ensure index exists for filtering
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_main_specialty ON public.lawyer_profiles(main_specialty);
