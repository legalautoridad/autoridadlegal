-- Add region column to juristic_knowledge
ALTER TABLE public.juristic_knowledge
ADD COLUMN IF NOT EXISTS region TEXT;

-- Update the match_knowledge function to support region filtering
DROP FUNCTION IF EXISTS match_knowledge(vector, float, int, uuid, text);

CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding VECTOR(3072),
  match_threshold FLOAT,
  match_count INT,
  p_location_id UUID DEFAULT NULL,
  p_service_type TEXT DEFAULT NULL,
  p_region TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  embedding VECTOR(3072),
  similarity FLOAT,
  is_general BOOLEAN,
  service_type TEXT,
  location_id UUID,
  court_id UUID,
  region TEXT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT
      jk.id,
      jk.content,
      jk.embedding,
      1 - (jk.embedding <=> query_embedding) AS similarity,
      jk.is_general,
      jk.service_type,
      jk.location_id,
      jk.court_id,
      jk.region
    FROM juristic_knowledge jk
    WHERE (1 - (jk.embedding <=> query_embedding)) > match_threshold
      AND (p_location_id IS NULL OR jk.location_id = p_location_id OR jk.is_general = true)
      AND (p_service_type IS NULL OR jk.service_type = p_service_type)
      AND (p_region IS NULL OR jk.region = p_region)
    ORDER BY jk.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
