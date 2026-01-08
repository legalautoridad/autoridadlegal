-- MIGRATION: 20260105_cleanup_leads.sql
-- OBJECTIVE: Drop obsolete 'leads' table to force schema reload and cleanup.

DROP TABLE IF EXISTS leads;

-- Notify PostgREST to reload schema (Standard Supabase trick)
NOTIFY pgrst, 'reload schema';
