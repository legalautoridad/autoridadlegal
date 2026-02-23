-- 1. Añadir columna service_type a la tabla juristic_knowledge
ALTER TABLE public.juristic_knowledge 
ADD COLUMN IF NOT EXISTS service_type TEXT;

-- 2. Actualizar la función de búsqueda para soportar el filtro por service_type
-- Eliminamos la versión anterior para recrearla con el nuevo parámetro
DROP FUNCTION IF EXISTS match_knowledge(vector, float, int, uuid);

CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding VECTOR(3072),
  match_threshold FLOAT,
  match_count INT,
  p_location_id UUID DEFAULT NULL,
  p_service_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  embedding VECTOR(3072),
  similarity FLOAT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT
      jk.id,
      jk.content,
      jk.embedding,
      1 - (jk.embedding <=> query_embedding) AS similarity
    FROM juristic_knowledge jk
    WHERE (1 - (jk.embedding <=> query_embedding)) > match_threshold
      AND (p_location_id IS NULL OR jk.location_id = p_location_id OR jk.is_general = true)
      AND (p_service_type IS NULL OR jk.service_type = p_service_type)
    ORDER BY jk.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
