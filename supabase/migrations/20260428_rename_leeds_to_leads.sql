-- Rename the table from leeds to leads
ALTER TABLE IF EXISTS public.leeds RENAME TO leads;

-- Update policies if needed (Supabase usually handles this but it's safer to check)
-- Actually, it's better to recreate them if they are bound to the old name in some logic
-- But RENAME TO generally preserves policies. 

-- If the table doesn't exist yet (for new setups), create it as leads
CREATE TABLE IF NOT EXISTS public.leads (
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

-- Ensure RLS is on
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Re-apply policies for the new name if they were dropped or for fresh create
DROP POLICY IF EXISTS "Allow anonymous inserts on leeds" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated users to read leeds" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous inserts on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON public.leads;

CREATE POLICY "Allow anonymous inserts on leads" ON public.leads
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read leads" ON public.leads
FOR SELECT USING (auth.role() = 'authenticated');
