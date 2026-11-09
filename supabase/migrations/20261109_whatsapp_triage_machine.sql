-- MIGRATION: 20261109_whatsapp_triage_machine.sql
-- OBJECTIVE: Support WhatsApp automatic triage machine and idempotency tracking

-- 1. Add state machine column to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS wa_state text;  -- 'ask_name' | 'ask_incident' | 'done'

-- 2. Add conversation history in JSONB format
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS conversation jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 3. Idempotency table for WhatsApp events (RLS enabled, zero public policies)
CREATE TABLE IF NOT EXISTS public.whatsapp_events (
  message_id text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_events ENABLE ROW LEVEL SECURITY;

-- 4. Partial index for fast lookups on WhatsApp leads by phone number
CREATE INDEX IF NOT EXISTS leads_whatsapp_phone_idx 
  ON public.leads (phone) 
  WHERE systemin = 'whatsapp';

