-- Add systemin column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS systemin TEXT;
