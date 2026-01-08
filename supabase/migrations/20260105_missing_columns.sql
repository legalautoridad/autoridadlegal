-- MIGRATION: 20260105_missing_columns.sql
-- OBJECTIVE: Add columns that were missed from 'fix_schema.sql'

alter table cases 
  add column if not exists client_city text,
  add column if not exists client_email text,
  add column if not exists close_reason text;

-- Ensure RLS is active just in case
alter table cases enable row level security;
