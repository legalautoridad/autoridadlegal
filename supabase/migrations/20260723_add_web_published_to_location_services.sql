-- Migration: Add web_published boolean flag to location_services for phase-based rollout
ALTER TABLE location_services ADD COLUMN IF NOT EXISTS web_published boolean NOT NULL DEFAULT false;

-- Initially set web_published = true for rows with non-empty faq_json
UPDATE location_services
SET web_published = true
WHERE faq_json IS NOT NULL 
  AND jsonb_array_length(faq_json) > 0;
