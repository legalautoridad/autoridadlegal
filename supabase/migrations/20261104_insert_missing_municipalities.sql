-- Migration: Insert missing municipalities in Barcelona province (Sant Feliu de Codines and Jorba)
-- Brings total active municipalities from 309 to 311 (completing all municipalities in Barcelona province).

INSERT INTO locations (name, slug, court_id, location_type, population, wikidata_qid, wikipedia_url)
VALUES 
    (
        'Sant Feliu de Codines',
        'sant-feliu-de-codines',
        (SELECT id FROM courts WHERE slug = 'granollers' LIMIT 1),
        'municipio',
        6549,
        'Q15444',
        'https://es.wikipedia.org/wiki/San_Fel%C3%ADu_de_Codinas'
    ),
    (
        'Jorba',
        'jorba',
        (SELECT id FROM courts WHERE slug = 'igualada' LIMIT 1),
        'municipio',
        828,
        'Q15951',
        'https://es.wikipedia.org/wiki/Jorba'
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    court_id = EXCLUDED.court_id,
    location_type = EXCLUDED.location_type,
    population = EXCLUDED.population,
    wikidata_qid = EXCLUDED.wikidata_qid,
    wikipedia_url = EXCLUDED.wikipedia_url;

