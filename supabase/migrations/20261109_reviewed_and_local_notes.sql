-- Migración: Añadir last_reviewed en services y courts, y local_notes_md en courts

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS last_reviewed date;
ALTER TABLE public.courts ADD COLUMN IF NOT EXISTS last_reviewed date;
ALTER TABLE public.courts ADD COLUMN IF NOT EXISTS local_notes_md text;

