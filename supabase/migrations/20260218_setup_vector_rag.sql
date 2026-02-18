-- 1. Habilitar la extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Limpieza previa para cambio de dimensiones
DROP TABLE IF EXISTS public.juristic_knowledge CASCADE;

-- 2. Crear la tabla de conocimiento jerárquico
CREATE TABLE IF NOT EXISTS public.juristic_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(3072), -- Usaremos el máximo de Gemini para mayor precisión
    is_general BOOLEAN DEFAULT TRUE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Omitimos el índice para este volumen de datos (<1k filas)
-- Esto evita el error de límite de dimensiones y mantiene la precisión íntegra.

-- 4. Función de búsqueda híbrida para ser llamada vía RPC
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding VECTOR(3072),
  match_threshold FLOAT,
  match_count INT,
  p_location_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  is_general BOOLEAN,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    jk.id,
    jk.content,
    jk.is_general,
    1 - (jk.embedding <=> query_embedding) AS similarity
  FROM juristic_knowledge jk
  WHERE 
    (jk.is_general = TRUE OR jk.location_id = p_location_id)
    AND 1 - (jk.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
