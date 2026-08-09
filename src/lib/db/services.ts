import { createStaticClient } from '@/lib/supabase/server';

export interface DbService {
    id: string;
    slug: string;
    name: string;
    theme?: string;
    seo?: {
        title: string;
        description: string;
    };
    hero?: {
        cta: string;
        title: string;
        subtitle: string;
        specialty: string;
        badge_text: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface ServiceFaq {
    id?: string;
    question: string;
    answer: string;
    topic?: string;
}

/**
 * Normalizes service slug (e.g. sin_carnet -> sin-carnet)
 */
export function normalizeServiceSlug(slug: string): string {
    const s = slug.toLowerCase().trim();
    if (s === 'sin-carnet' || s === 'sin_carnet') return 'sin-carnet';
    return s;
}

/**
 * Localizes generic FAQ text for provincial root service pages (e.g. /alcoholemia).
 * Replaces "tu municipio" with "Cataluña" and adjusts court references to provincial scope with strict grammar normalizations.
 */
export function localizeProvincialFaqText(text: string): string {
    if (!text) return '';

    let result = text
        // Specific phrase replacements to preserve natural Spanish grammar
        .replace(/Juzgado de Guardia de tu municipio/gi, 'Juzgado de Guardia de su partido judicial')
        .replace(/juzgado competente de tu municipio/gi, 'el juzgado competente')
        .replace(/en el partido judicial de tu municipio/gi, 'en su partido judicial')
        .replace(/en el partido judicial en Cataluña/gi, 'en su partido judicial')
        .replace(/el hospital de tu municipio/gi, 'un hospital de Cataluña')
        .replace(/el hospital en Cataluña/gi, 'un hospital de Cataluña')
        .replace(/de urgencias en Cataluña/gi, 'de urgencias')
        .replace(/en tu municipio/gi, 'en Cataluña')
        .replace(/\s+de tu municipio/gi, ' en Cataluña')
        .replace(/tu municipio/gi, 'Cataluña')
        .replace(/\bX\s*mg\/l\b/gi, '0,60 mg/l o más');

    // Grammar & Duplication Cleanup Rules
    result = result
        // Rule 1: "al el" -> "al"
        .replace(/\bal\s+el\b/gi, 'al')
        // Rule 2: "del el" -> "del"
        .replace(/\bdel\s+el\b/gi, 'del')
        // Rule 3: "ante el el" -> "ante el"
        .replace(/\bante\s+el\s+el\b/gi, 'ante el')
        // Collapsing duplicated prepositions
        .replace(/\ben Cataluña\s+en Cataluña\b/gi, 'en Cataluña')
        .replace(/\bde Cataluña\s+de Cataluña\b/gi, 'de Cataluña')
        .replace(/\ben su partido judicial\s+en Cataluña\b/gi, 'en su partido judicial')
        .replace(/\bde su partido judicial\s+en Cataluña\b/gi, 'de su partido judicial')
        .replace(/\bel\s+el\b/gi, 'el')
        .replace(/\s+/g, ' ')
        .trim();

    // Rule 4: Capitalize first letter if needed
    if (result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
}

/**
 * Fetches all 5 services from Supabase.
 */
export async function getAllServicesFromDb(): Promise<DbService[]> {
    const supabase = createStaticClient();
    const { data, error } = await supabase.from('services').select('*');

    if (error || !data) {
        console.error('Error fetching services from Supabase:', error);
        return [];
    }

    return data.map(item => ({
        ...item,
        slug: item.slug === 'sin_carnet' ? 'sin-carnet' : item.slug,
    }));
}

/**
 * Fetches a single service by slug from Supabase.
 */
export async function getServiceBySlugFromDb(slug: string): Promise<DbService | null> {
    const normSlug = normalizeServiceSlug(slug);
    const services = await getAllServicesFromDb();
    return services.find(s => normalizeServiceSlug(s.slug) === normSlug) || null;
}

/**
 * Fetches FAQs for a service from public.service_faqs table in Supabase and localizes them to provincial scope.
 */
export async function getServiceFaqs(serviceSlug: string): Promise<ServiceFaq[]> {
    const normSlug = normalizeServiceSlug(serviceSlug);
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('service_faqs')
        .select('question, answer, topic')
        .or(`service_slug.eq.${normSlug},service_slug.eq.${normSlug === 'sin-carnet' ? 'sin_carnet' : normSlug}`)
        .order('position', { ascending: true });

    if (error || !data) {
        console.error(`Error fetching service_faqs for ${normSlug}:`, error);
        return [];
    }

    return data.map((f: any) => ({
        question: localizeProvincialFaqText(f.question),
        answer: localizeProvincialFaqText(f.answer),
        topic: f.topic || undefined,
    })) as ServiceFaq[];
}

export interface ServiceJsonLdConfig {
    name: string;
    serviceType: string;
    description: string;
    price: number;
}

export function getServiceJsonLdConfig(slug: string): ServiceJsonLdConfig {
    const norm = normalizeServiceSlug(slug);
    switch (norm) {
        case 'alcoholemia':
            return {
                name: "Defensa penal por alcoholemia",
                serviceType: "Defensa penal por conducción bajo influencia de alcohol",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por alcoholemia en Cataluña. Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base.",
                price: 980
            };
        case 'drogas':
            return {
                name: "Defensa penal por drogas al volante",
                serviceType: "Defensa penal por conducción bajo influencia de drogas",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por drogas al volante en Cataluña. Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base.",
                price: 980
            };
        case 'velocidad':
            return {
                name: "Defensa penal por exceso de velocidad",
                serviceType: "Defensa penal por delito de exceso de velocidad",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por exceso de velocidad constitutivo de delito en Cataluña. Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base.",
                price: 980
            };
        case 'sin-carnet':
            return {
                name: "Defensa penal por conducción sin permiso",
                serviceType: "Defensa penal por conducción sin permiso o licencia",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por conducir sin carnet o sin puntos en Cataluña. Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base.",
                price: 980
            };
        case 'profesionales':
            return {
                name: "Defensa penal para conductores profesionales",
                serviceType: "Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)",
                description: "Defensa penal y asistencia urgente 24h para transportistas y conductores profesionales en Cataluña. Precio cerrado de 1.480 € (IVA y procurador incluidos) para el supuesto base.",
                price: 1480
            };
        default:
            return {
                name: "Defensa penal por delitos contra la seguridad vial",
                serviceType: "Defensa penal de tráfico",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos en Cataluña.",
                price: 980
            };
    }
}
