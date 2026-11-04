-- Migration: Add Wikidata / Wikipedia / Maps identifiers to courts and locations
-- Used to build a verifiable schema.org `areaServed` (partido judicial → municipios)
-- in the JSON-LD of /juzgados/[slug]. All columns are nullable; no existing column is touched.

-- courts: partido judicial identifiers + map references of the guard court
ALTER TABLE courts ADD COLUMN IF NOT EXISTS wikidata_qid TEXT;
ALTER TABLE courts ADD COLUMN IF NOT EXISTS wikipedia_url TEXT;
ALTER TABLE courts ADD COLUMN IF NOT EXISTS maps_url TEXT;
ALTER TABLE courts ADD COLUMN IF NOT EXISTS plus_code TEXT;

-- locations: municipality identifiers
ALTER TABLE locations ADD COLUMN IF NOT EXISTS wikidata_qid TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS wikipedia_url TEXT;

-- Format guards for QIDs (NULL allowed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courts_wikidata_qid_format') THEN
        ALTER TABLE courts
            ADD CONSTRAINT courts_wikidata_qid_format CHECK (wikidata_qid IS NULL OR wikidata_qid ~ '^Q[0-9]+$');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'locations_wikidata_qid_format') THEN
        ALTER TABLE locations
            ADD CONSTRAINT locations_wikidata_qid_format CHECK (wikidata_qid IS NULL OR wikidata_qid ~ '^Q[0-9]+$');
    END IF;
END $$;
