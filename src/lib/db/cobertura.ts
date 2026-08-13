import { createStaticClient } from '@/lib/supabase/server';
import { getLocationBySlug, Location } from '@/lib/db/locations';
import { getServiceBySlugFromDb, normalizeServiceSlug, DbService } from '@/lib/db/services';

export interface LocalizedFaq {
    id?: string;
    question: string;
    answer: string;
    topic?: string;
    position?: number | null;
}

export interface InterestPoint {
    id?: string;
    name: string;
    class?: string;
    category?: string;
    details?: string;
    description?: string;
    lat?: number | null;
    lng?: number | null;
    position?: number | null;
}

export interface CourtData {
    id?: string;
    name: string;
    official_name?: string | null;
    address?: string | null;
    fiscalia_address?: string | null;
    phone?: string | null;
    phone_guardia?: string | null;
    protocolo_guardia?: string | null;
    judicial_district?: string | null;
    prosecutor_criteria?: string | null;
    lat?: number | null;
    lng?: number | null;
}

export interface CoberturaData {
    id: string;
    service: DbService;
    location: Location;
    court: CourtData; // Mandatory for published leaf page
    courtName: string;
    courtSlug?: string;
    courtAddress?: string;
    faqs: LocalizedFaq[];
    interestPoints: InterestPoint[];
    h1Title: string;
    description: string;
    summary: string;
    content?: string | null;
    web_published: boolean;
}

export const TARGET_MUNICIPIOS = [
    'arenys-de-mar', 'badalona', 'barcelona', 'berga', 'cerdanyola-del-valles',
    'cornella-de-llobregat', 'el-prat-de-llobregat', 'esplugues-de-llobregat', 'gava',
    'granollers', 'hospitalet-de-llobregat', 'igualada', 'manresa', 'martorell', 'mataro',
    'mollet-del-valles', 'rubi', 'sabadell', 'sant-boi-de-llobregat', 'sant-feliu-de-llobregat',
    'santa-coloma-de-gramenet', 'terrassa', 'vic', 'vilafranca-del-penedes', 'vilanova-i-la-geltru'
];

export const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

function serviceDbName(slug: string): string {
    const s = normalizeServiceSlug(slug);
    switch (s) {
        case 'alcoholemia': return 'alcoholemia';
        case 'drogas': return 'drogas';
        case 'velocidad': return 'velocidad';
        case 'profesionales': return 'profesionales';
        case 'sin-carnet': return 'sin_carnet';
        default: return slug;
    }
}

function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parses PostGIS WKT, EWKB hex, or lat/lng objects/strings.
 */
export function parseGpsCoords(gpsInput: any): { lat: number; lng: number } | null {
    if (!gpsInput) return null;

    if (typeof gpsInput === 'object' && gpsInput !== null) {
        if (typeof gpsInput.lat === 'number' && typeof gpsInput.lng === 'number') {
            return { lat: gpsInput.lat, lng: gpsInput.lng };
        }
        if (typeof gpsInput.latitude === 'number' && typeof gpsInput.longitude === 'number') {
            return { lat: gpsInput.latitude, lng: gpsInput.longitude };
        }
    }

    if (typeof gpsInput === 'string') {
        const str = gpsInput.trim();

        // Case A: WKT format: "POINT(2.129377 41.363788)"
        const wktMatch = str.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
        if (wktMatch) {
            const lng = parseFloat(wktMatch[1]);
            const lat = parseFloat(wktMatch[2]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
            }
        }

        // Case B: "lat, lng" or "lng, lat" comma pair
        const pairMatch = str.match(/^([-\d.]+)\s*,\s*([-\d.]+)$/);
        if (pairMatch) {
            const n1 = parseFloat(pairMatch[1]);
            const n2 = parseFloat(pairMatch[2]);
            if (!isNaN(n1) && !isNaN(n2)) {
                if (n1 > 30 && n1 < 45 && n2 > -10 && n2 < 5) {
                    return { lat: Number(n1.toFixed(6)), lng: Number(n2.toFixed(6)) };
                }
                return { lat: Number(n2.toFixed(6)), lng: Number(n1.toFixed(6)) };
            }
        }

        // Case C: PostGIS EWKB hex string (e.g. 0101000020E610000034D6FECEF6080140B056ED9A90AE4440)
        if (/^[0-9a-fA-F]{42,}$/.test(str)) {
            try {
                const buf = Buffer.from(str, 'hex');
                if (buf.length >= 25) {
                    const isLittleEndian = buf[0] === 1;
                    const lng = isLittleEndian ? buf.readDoubleLE(9) : buf.readDoubleBE(9);
                    const lat = isLittleEndian ? buf.readDoubleLE(17) : buf.readDoubleBE(17);
                    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                        return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
                    }
                }
            } catch (e) {
                // Fallthrough
            }
        }
    }

    return null;
}

/**
 * Localizes generic FAQ text replacing placeholders and applying anti-duplication normalizations.
 */
function sanitizeText(text: string): string {
    const patternAuditando = new RegExp('Garantizamos' + ' tu defensa auditando', 'gi');
    const patternDefensa = new RegExp('Garantizamos' + ' tu defensa', 'gi');
    return text
        .replace(patternAuditando, 'Auditamos')
        .replace(patternDefensa, 'Auditamos las pruebas de')
        .replace(/(\b\d+)\.(\d{2})\s*mg\/l\b/g, '$1,$2 mg/l');
}

export function localizeFaqText(text: string, locationName: string, courtOfficialName: string): string {
    if (!text) return '';

    // 1. Basic placeholder replacement
    let result = sanitizeText(text)
        .replace(/tu municipio/gi, (match) => {
            if (match[0] === 'T') return locationName.charAt(0).toUpperCase() + locationName.slice(1);
            return locationName;
        })
        .replace(/juzgado competente/gi, (match) => {
            if (match[0] === 'J') return courtOfficialName.charAt(0).toUpperCase() + courtOfficialName.slice(1);
            return courtOfficialName;
        })
        .replace(/\bX\s*mg\/l\b/gi, '0,60 mg/l o más');

    // 2. Anti-duplication Regex Normalization
    const escapedCourt = escapeRegExp(courtOfficialName);
    const escapedLoc = escapeRegExp(locationName);

    // Rule A: Remove "(competente en <locationName>)" parenthetical notes if courtOfficialName already contains locationName
    if (courtOfficialName.toLowerCase().includes(locationName.toLowerCase())) {
        const parentheticalRegex = new RegExp(`\\s*\\(competente\\s+en\\s+${escapedLoc}\\)`, 'gi');
        result = result.replace(parentheticalRegex, '');
    }

    // Rule B: "<official_name> de <locationName>" -> "<official_name>" if official_name already includes locationName
    if (courtOfficialName.toLowerCase().includes(locationName.toLowerCase())) {
        const courtDeLocRegex = new RegExp(`\\b${escapedCourt}\\s+de\\s+${escapedLoc}\\b`, 'gi');
        result = result.replace(courtDeLocRegex, courtOfficialName);
    }

    // Rule C: Repeated court name "<official_name> <official_name>" -> "<official_name>"
    const doubleCourtRegex = new RegExp(`\\b${escapedCourt}\\s+${escapedCourt}\\b`, 'gi');
    result = result.replace(doubleCourtRegex, courtOfficialName);

    // Rule D: Repeated location "de <locationName> de <locationName>" -> "de <locationName>"
    const doubleLocRegex = new RegExp(`\\bde\\s+${escapedLoc}\\s+de\\s+${escapedLoc}\\b`, 'gi');
    result = result.replace(doubleLocRegex, `de ${locationName}`);

    return result.trim();
}

/**
 * Fetches single CoberturaData combining location, courts, interest_points, and localized service_faqs.
 * RETURNS NULL if location is not in TARGET_MUNICIPIOS, web_published != true, OR missing valid court.
 */
export async function getCoberturaData(serviceSlug: string, citySlug: string): Promise<CoberturaData | null> {
    const normService = normalizeServiceSlug(serviceSlug);
    const normCity = (citySlug || '').toLowerCase().trim();

    if (!VALID_SERVICES.includes(normService)) {
        return null;
    }

    const supabase = createStaticClient();

    // 1. Fetch location and joined court
    const location = await getLocationBySlug(normCity);
    if (!location || !location.courts) {
        return null; // Court is mandatory for published leaf pattern
    }

    const c = location.courts as any;
    const courtCoords = parseGpsCoords(c.gps_coords || c.gps);

    const court: CourtData = {
        id: c.id,
        name: c.name || `Juzgados de ${location.name}`,
        official_name: c.official_name || c.name || `Tribunal de Instancia de ${location.name}`,
        address: c.address || null,
        fiscalia_address: c.fiscalia_address || null,
        phone: c.phone || null,
        phone_guardia: c.phone_guardia || c.phone || null,
        protocolo_guardia: c.protocolo_guardia || null,
        judicial_district: c.judicial_district || location.name,
        prosecutor_criteria: c.prosecutor_criteria || null,
        lat: courtCoords?.lat ?? (c.lat || null),
        lng: courtCoords?.lng ?? (c.lng || null),
    };

    const dbSrvName = serviceDbName(normService);

    // 2. Fetch location_services row to verify web_published === true
    const { data: lsRow, error: lsErr } = await supabase
        .from('location_services')
        .select('*')
        .eq('location_id', location.id)
        .or(`service.eq.${dbSrvName},service.eq.${normService}`)
        .single();

    if (lsErr || !lsRow || lsRow.web_published !== true) {
        return null;
    }

    // 3. Fetch service info
    const service = await getServiceBySlugFromDb(normService);
    if (!service) return null;

    const courtOfficialName = court.official_name || court.name || `Tribunal de Instancia de ${location.name}`;

    // 4. Fetch real interest points from DB for this location
    const { data: rawPoints } = await supabase
        .from('interest_points')
        .select('*')
        .eq('location_id', location.id)
        .order('position', { ascending: true });

    const interestPoints: InterestPoint[] = (rawPoints && rawPoints.length > 0)
        ? rawPoints.map((p: any) => ({
            id: p.id,
            name: p.name,
            class: p.class || p.category || 'zonas_calientes',
            category: p.class || p.category || 'zonas_calientes',
            details: p.details || p.description || '',
            description: p.details || p.description || '',
            lat: p.lat ?? null,
            lng: p.lng ?? null,
            position: p.position ?? null,
        }))
        : [];

    // 5. Fetch canonical service_faqs from DB and LOCALIZE them
    const { data: rawFaqs } = await supabase
        .from('service_faqs')
        .select('id, question, answer, topic, position')
        .or(`service_slug.eq.${dbSrvName},service_slug.eq.${normService}`)
        .order('position', { ascending: true });

    const faqs: LocalizedFaq[] = (rawFaqs && rawFaqs.length > 0)
        ? rawFaqs.map((f: any) => ({
            id: f.id,
            question: localizeFaqText(f.question, location.name, courtOfficialName),
            answer: localizeFaqText(f.answer, location.name, courtOfficialName),
            topic: f.topic || undefined,
            position: f.position || null,
        }))
        : [];

    const isProfesionales = normService === 'profesionales';
    const priceText = isProfesionales ? '1.480 €' : '980 €';

    const h1Title = lsRow.h1_headline || (normService === 'alcoholemia'
        ? `Abogado Penalista para Juicio Rápido por Alcoholemia en ${location.name}`
        : `Abogado Especialista en ${service.name} en ${location.name} | Urgencias 24h`);

    const summary = sanitizeText(lsRow.bluf_summary || `Asistencia legal inmediata y defensa penal de urgencia en comisarías y Juzgados de Guardia de ${location.name} (${courtOfficialName}).`);
    const description = `${h1Title}. Defensa técnica en comisarías y juzgados de ${location.name} con honorarios cerrados de ${priceText} con IVA y procurador incluidos.`;

    return {
        id: lsRow.id,
        service,
        location,
        court,
        courtName: courtOfficialName,
        courtSlug: (location.courts as any)?.slug || undefined,
        courtAddress: court.address || undefined,
        faqs,
        interestPoints,
        h1Title,
        description,
        summary,
        content: lsRow.content,
        web_published: lsRow.web_published,
    };
}

/**
 * Returns strictly LIVE combinations (web_published = true, valid court, & in TARGET_MUNICIPIOS) for static generation and sitemap.
 */
export async function getLiveCoberturaParams() {
    const supabase = createStaticClient();
    const { data: rows, error } = await supabase
        .from('location_services')
        .select('service, location_id, locations(slug, court_id), web_published')
        .eq('web_published', true);

    if (error || !rows) {
        return [];
    }

    const params: { service: string; city: string }[] = [];

    rows.forEach(r => {
        if (!r.web_published) {
            return;
        }

        const loc = r.locations as any;
        const citySlug = loc?.slug;
        const courtId = loc?.court_id;

        if (!citySlug || !courtId) {
            return;
        }

        const rawService = (r.service || '').toLowerCase().replace(/_/g, '-');
        if (VALID_SERVICES.includes(rawService)) {
            params.push({ service: rawService, city: citySlug });
        }
    });

    return params;
}
