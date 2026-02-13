-- Add new columns to courts table
ALTER TABLE public.courts 
ADD COLUMN IF NOT EXISTS information TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update existing records with any available data (Optional/Placeholder)
-- UPDATE public.courts SET address = 'Carrer de Pere Esmendia, 15', phone = '93 588 15 55' WHERE name = 'Juzgados de Rubí';
