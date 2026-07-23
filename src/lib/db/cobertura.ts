import { createStaticClient } from '@/lib/supabase/server';
import { getLocationBySlug, Location } from '@/lib/db/locations';
import { getServiceBySlugFromDb, normalizeServiceSlug, DbService } from '@/lib/db/services';
import { OKFService } from '@/lib/okf/okf-service';

export interface LocalizedFaq {
    id?: string;
    question: string;
    answer: string;
    specific_topic?: string;
}

export interface InterestPoint {
    category?: string;
    name: string;
    description?: string;
    gps?: string;
}

export interface CoberturaData {
    id: string;
    service: DbService;
    location: Location;
    courtName?: string;
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

/**
 * Fetches single CoberturaData combining location_services row, location, service, court, faqs, and interest points.
 * RETURNS NULL if web_published != true OR faq_json is empty.
 */
export async function getCoberturaData(serviceSlug: string, citySlug: string): Promise<CoberturaData | null> {
    const supabase = createStaticClient();
    const service = await getServiceBySlugFromDb(serviceSlug);
    const location = await getLocationBySlug(citySlug);

    if (!service || !location) {
        return null;
    }

    const srvName = serviceDbName(serviceSlug);

    // Query location_services row for this location_id & service
    const { data: row, error } = await supabase
        .from('location_services')
        .select('*')
        .eq('location_id', location.id)
        .or(`service.eq.${srvName},service.eq.${serviceSlug}`)
        .single();

    if (error || !row) {
        return null;
    }

    // Gate check: web_published MUST be true AND faq_json MUST NOT be empty
    const isLive = row.web_published === true && Array.isArray(row.faq_json) && row.faq_json.length > 0;
    if (!isLive) {
        return null;
    }

    const faqs: LocalizedFaq[] = row.faq_json.map((f: any) => ({
        question: f.q || f.question,
        answer: f.a || f.answer,
    }));

    const court = location.courts as any;
    const courtName = court?.name || court?.official_name || undefined;
    const courtSlug = court?.slug || undefined;
    const courtAddress = court?.address || undefined;

    const interestPoints: InterestPoint[] = (location.interest_points && location.interest_points.length > 0)
        ? location.interest_points.map((p: any) => ({
            category: p.class || p.category,
            name: p.name,
            description: p.details || p.description,
            gps: p.gps,
        }))
        : OKFService.getPuntosDeInteres(location.slug).map(p => ({
            category: p.category,
            name: p.name,
            description: p.description,
            gps: p.gps,
        }));

    const h1Title = row.h1_headline || (service.slug === 'alcoholemia'
        ? `Abogado Penalista para Juicio Rápido por Alcoholemia en ${location.name}`
        : `Abogado Especialista en ${service.name} en ${location.name} | Urgencias 24h`);

    const summary = row.bluf_summary || `Asistencia legal inmediata y defensa penal de urgencia en comisarías y Juzgados de Guardia de ${location.name} (${courtName || 'Partido Judicial'}).`;
    const description = `${h1Title}. Defensa técnica en comisarías y juzgados de ${location.name} por tarifa plana de 980€ todo incluido.`;

    return {
        id: row.id,
        service,
        location,
        courtName,
        courtSlug,
        courtAddress,
        faqs,
        interestPoints,
        h1Title,
        description,
        summary,
        content: row.content,
        web_published: row.web_published,
    };
}

/**
 * Returns strictly LIVE combinations (web_published = true, faq_json non-empty) for static generation and sitemap.
 */
export async function getLiveCoberturaParams() {
    const supabase = createStaticClient();
    const { data: rows, error } = await supabase
        .from('location_services')
        .select('service, location_id, locations(slug), web_published, faq_json')
        .eq('web_published', true);

    if (error || !rows) {
        return [];
    }

    const params: { service: string; city: string }[] = [];

    rows.forEach(r => {
        if (!r.web_published || !Array.isArray(r.faq_json) || r.faq_json.length === 0) {
            return;
        }

        const citySlug = (r.locations as any)?.slug;
        if (!citySlug || !TARGET_MUNICIPIOS.includes(citySlug)) {
            return;
        }

        const rawService = (r.service || '').toLowerCase().replace(/_/g, '-');
        if (VALID_SERVICES.includes(rawService)) {
            params.push({ service: rawService, city: citySlug });
        }
    });

    return params;
}
