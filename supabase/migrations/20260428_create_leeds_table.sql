-- Create the leeds table based on the Slot Map definition
CREATE TABLE IF NOT EXISTS public.leeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT,
    email TEXT,
    work_status TEXT,
    incident_date_time TIMESTAMPTZ,
    incident_type TEXT,
    city TEXT,
    needs_license_for_work BOOLEAN DEFAULT FALSE,
    rate TEXT,
    judicial_district TEXT,
    citation_date_time TIMESTAMPTZ,
    priors BOOLEAN DEFAULT FALSE,
    priors_details TEXT,
    concerns TEXT,
    calculated_price NUMERIC,
    chosen_quota TEXT,
    dependents TEXT,
    income_data TEXT,
    has_citation BOOLEAN DEFAULT FALSE,
    contact_date_time TIMESTAMPTZ,
    "lastUpdate" TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leeds ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the chatbot)
CREATE POLICY "Allow anonymous inserts on leeds" ON public.leeds
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read leeds" ON public.leeds
FOR SELECT USING (auth.role() = 'authenticated');
