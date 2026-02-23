-- Añadir especialidad a los perfiles de abogados
ALTER TABLE public.lawyer_profiles
ADD COLUMN IF NOT EXISTS main_specialty TEXT;

-- Comentario descriptivo
COMMENT ON COLUMN public.lawyer_profiles.main_specialty IS 'Área legal principal de especialización del abogado';
