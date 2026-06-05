-- MIGRATION: 20260512_add_missing_fields_to_cases.sql
-- OBJECTIVE: Ensure all lead data is correctly captured in the case snapshot

ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS rate TEXT,
  ADD COLUMN IF NOT EXISTS citation_date_time TEXT,
  ADD COLUMN IF NOT EXISTS systemin TEXT;
