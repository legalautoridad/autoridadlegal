-- MIGRATION: 20260512_implement_lead_claiming.sql
-- OBJECTIVE: Support lead claiming by lawyers and case management

-- 1. Update leads table to track if it was taken
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS is_taken BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

-- 2. Update cases table to include lead reference and observations
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id),
  ADD COLUMN IF NOT EXISTS observations TEXT,
  -- Add fields to store lead snapshot as requested ("copied to the cases table")
  ADD COLUMN IF NOT EXISTS incident_type TEXT,
  ADD COLUMN IF NOT EXISTS incident_date_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS judicial_district TEXT,
  ADD COLUMN IF NOT EXISTS priors BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS priors_details TEXT,
  ADD COLUMN IF NOT EXISTS concerns TEXT,
  ADD COLUMN IF NOT EXISTS calculated_price NUMERIC,
  ADD COLUMN IF NOT EXISTS chosen_quota TEXT,
  ADD COLUMN IF NOT EXISTS dependents TEXT,
  ADD COLUMN IF NOT EXISTS income_data TEXT,
  ADD COLUMN IF NOT EXISTS has_citation BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS work_status TEXT,
  ADD COLUMN IF NOT EXISTS needs_license_for_work BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS contact_date_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS jail BOOLEAN DEFAULT FALSE;

-- 3. RLS for Cases
-- Ensure RLS is enabled
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Policy for Lawyers to see their own cases
DROP POLICY IF EXISTS "Lawyers can see assigned cases" ON public.cases;
CREATE POLICY "Lawyers can see assigned cases" ON public.cases
  FOR SELECT USING (auth.uid() = assigned_lawyer_id);

-- Policy for Lawyers to update their own cases
DROP POLICY IF EXISTS "Lawyers can update assigned cases" ON public.cases;
CREATE POLICY "Lawyers can update assigned cases" ON public.cases
  FOR UPDATE USING (auth.uid() = assigned_lawyer_id)
  WITH CHECK (auth.uid() = assigned_lawyer_id);

-- Policy for Admins (if any admin role exists in JWT, but usually we use a service role or check a table)
-- For now, let's allow authenticated users to read leads if they are not taken (or all if we filter in UI)
-- The existing policy for leads is:
-- CREATE POLICY "Allow authenticated users to read leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
-- We should probably update it to only show untaken leads for lawyers, but maybe admins want to see all.
-- Let's stick to UI filtering for now unless security is a hard requirement for lead visibility.
-- 6. Index for performance
CREATE INDEX IF NOT EXISTS idx_leads_is_taken ON leads(is_taken) WHERE is_taken = false;
