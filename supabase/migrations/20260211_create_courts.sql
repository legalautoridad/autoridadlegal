-- Create COURTS table
CREATE TABLE IF NOT EXISTS public.courts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for courts
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courts
CREATE POLICY "Allow public read access to courts"
    ON public.courts FOR SELECT
    USING (true);

-- Insert unique court names from current locations table
INSERT INTO public.courts (name)
SELECT DISTINCT court 
FROM public.locations
WHERE court IS NOT NULL;

-- Add court_id to locations
ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS court_id UUID REFERENCES public.courts(id);

-- Update locations with the new foreign keys
UPDATE public.locations l
SET court_id = c.id
FROM public.courts c
WHERE l.court = c.name;

-- After verification, you might want to drop the original court column:
-- ALTER TABLE public.locations DROP COLUMN court;
