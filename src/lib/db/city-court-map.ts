import MAPA from '@/data/municipio-a-partido.json';

/**
 * Synchronous mapping of all municipalities in Barcelona/Cataluña to their governing judicial district court slug.
 * Source of truth: locations.court_id -> courts.slug (311 entries: 310 municipalities + alias lluca).
 */
export const CITY_TO_COURT_MAP: Record<string, string> = MAPA as Record<string, string>;

export function getCourtSlugForCity(citySlug: string): string {
    const norm = (citySlug || '').toLowerCase().trim();
    return CITY_TO_COURT_MAP[norm] || norm;
}

export interface PartidoJudicialItem {
    slug: string;
    name: string;
    officialName: string;
}

/**
 * The 25 judicial districts (partidos judiciales) of the province of Barcelona.
 * Matches `courts` table in Supabase.
 */
export const PARTIDOS_JUDICIALES: PartidoJudicialItem[] = [
    { slug: 'arenys-de-mar', name: 'Arenys de Mar', officialName: 'Tribunal de Instancia de Arenys de Mar' },
    { slug: 'badalona', name: 'Badalona', officialName: 'Tribunal de Instancia de Badalona' },
    { slug: 'barcelona', name: 'Barcelona', officialName: 'Tribunal de Instancia de Barcelona' },
    { slug: 'berga', name: 'Berga', officialName: 'Tribunal de Instancia de Berga' },
    { slug: 'cerdanyola-del-valles', name: 'Cerdanyola del Vallès', officialName: 'Tribunal de Instancia de Cerdanyola del Vallès' },
    { slug: 'cornella-de-llobregat', name: 'Cornellà de Llobregat', officialName: 'Tribunal de Instancia de Cornellà de Llobregat' },
    { slug: 'el-prat-de-llobregat', name: 'El Prat de Llobregat', officialName: 'Tribunal de Instancia de El Prat de Llobregat' },
    { slug: 'esplugues-de-llobregat', name: 'Esplugues de Llobregat', officialName: 'Tribunal de Instancia de Esplugues de Llobregat' },
    { slug: 'gava', name: 'Gavà', officialName: 'Tribunal de Instancia de Gavà' },
    { slug: 'granollers', name: 'Granollers', officialName: 'Tribunal de Instancia de Granollers' },
    { slug: 'hospitalet-de-llobregat', name: "L'Hospitalet de Llobregat", officialName: "Tribunal de Instancia de L'Hospitalet de Llobregat" },
    { slug: 'igualada', name: 'Igualada', officialName: 'Tribunal de Instancia de Igualada' },
    { slug: 'manresa', name: 'Manresa', officialName: 'Tribunal de Instancia de Manresa' },
    { slug: 'martorell', name: 'Martorell', officialName: 'Tribunal de Instancia de Martorell' },
    { slug: 'mataro', name: 'Mataró', officialName: 'Tribunal de Instancia de Mataró' },
    { slug: 'mollet-del-valles', name: 'Mollet del Vallès', officialName: 'Tribunal de Instancia de Mollet del Vallès' },
    { slug: 'rubi', name: 'Rubí', officialName: 'Tribunal de Instancia de Rubí' },
    { slug: 'sabadell', name: 'Sabadell', officialName: 'Tribunal de Instancia de Sabadell' },
    { slug: 'sant-boi-de-llobregat', name: 'Sant Boi de Llobregat', officialName: 'Tribunal de Instancia de Sant Boi de Llobregat' },
    { slug: 'sant-feliu-de-llobregat', name: 'Sant Feliu de Llobregat', officialName: 'Tribunal de Instancia de Sant Feliu de Llobregat' },
    { slug: 'santa-coloma-de-gramenet', name: 'Santa Coloma de Gramenet', officialName: 'Tribunal de Instancia de Santa Coloma de Gramenet' },
    { slug: 'terrassa', name: 'Terrassa', officialName: 'Tribunal de Instancia de Terrassa' },
    { slug: 'vic', name: 'Vic', officialName: 'Tribunal de Instancia de Vic' },
    { slug: 'vilafranca-del-penedes', name: 'Vilafranca del Penedès', officialName: 'Tribunal de Instancia de Vilafranca del Penedès' },
    { slug: 'vilanova-i-la-geltru', name: 'Vilanova i la Geltrú', officialName: 'Tribunal de Instancia de Vilanova i la Geltrú' },
];
