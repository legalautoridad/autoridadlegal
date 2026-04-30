-- Change date columns to TEXT to allow natural language input from the chatbot
ALTER TABLE public.leads 
ALTER COLUMN incident_date_time TYPE TEXT,
ALTER COLUMN citation_date_time TYPE TEXT,
ALTER COLUMN contact_date_time TYPE TEXT;

-- We keep "lastUpdate" as TIMESTAMPTZ if we want to use default now(), 
-- but the chatbot might try to send its own string. 
-- In the code we use ISO strings for lastUpdate, so it should be fine.
-- However, to be safe and consistent with the others:
ALTER TABLE public.leads ALTER COLUMN "lastUpdate" TYPE TEXT;
