-- 1. Eliminar la función existente para evitar conflictos de firma
DROP FUNCTION IF EXISTS match_knowledge(vector, float, int, uuid, text, text);

-- 2. Alterar la columna de embedding para usar 768 dimensiones (Estándar de Vertex/Google)
ALTER TABLE juristic_knowledge 
ALTER COLUMN embedding TYPE vector(768);

-- 3. Re-crear la función con la nueva dimensión (768)
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_location_id uuid DEFAULT NULL,
  p_service_type text DEFAULT NULL,
  p_region text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  is_general boolean,
  service_type text,
  location_id uuid,
  region text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.content,
    k.is_general,
    k.service_type,
    k.location_id,
    k.region,
    k.metadata,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM juristic_knowledge k
  WHERE 1 - (k.embedding <=> query_embedding) > match_threshold
    AND (p_location_id IS NULL OR k.location_id = p_location_id OR k.is_general = true)
    AND (p_service_type IS NULL OR k.service_type = p_service_type)
    AND (p_region IS NULL OR k.region = p_region)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
