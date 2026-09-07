-- Migration: Create location_services_faq table
-- Objective: Store location-service specific FAQs linked to location_services table

CREATE TABLE IF NOT EXISTS public.location_services_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_service_id UUID NOT NULL REFERENCES public.location_services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    topic TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookups by location_service_id
CREATE INDEX IF NOT EXISTS location_services_faq_ls_id_idx ON public.location_services_faq (location_service_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.location_services_faq ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_services_faq;
CREATE POLICY "Enable read access for all users" ON public.location_services_faq
    FOR SELECT USING (true);
