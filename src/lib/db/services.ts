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
 * Replaces "tu municipio" with "Cataluña" and adjusts court references to provincial scope.
 */
export function localizeProvincialFaqText(text: string): string {
    if (!text) return '';

    let result = text
        // Replace "Juzgado de Guardia de tu municipio" -> "Juzgado de Guardia de su partido judicial"
        .replace(/Juzgado de Guardia de tu municipio/gi, 'Juzgado de Guardia de su partido judicial')
        // Replace "juzgado competente de tu municipio" -> "el juzgado competente"
        .replace(/juzgado competente de tu municipio/gi, 'el juzgado competente')
        // Replace "en tu municipio" -> "en Cataluña"
        .replace(/en tu municipio/gi, 'en Cataluña')
        // Replace "de tu municipio" -> "en Cataluña"
        .replace(/\s+de tu municipio/gi, ' en Cataluña')
        // Replace remaining "tu municipio" -> "Cataluña"
        .replace(/tu municipio/gi, 'Cataluña')
        // Replace raw placeholder "X mg/l" -> "0,60 mg/l o más"
        .replace(/\bX\s*mg\/l\b/gi, '0,60 mg/l o más');

    // Anti-duplication Regex Normalization for provincial text
    result = result
        .replace(/\ben Cataluña\s+en Cataluña\b/gi, 'en Cataluña')
        .replace(/\bde Cataluña\s+de Cataluña\b/gi, 'de Cataluña')
        .replace(/\bel el juzgado\b/gi, 'el juzgado')
        .replace(/\s+/g, ' ');

    return result.trim();
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
    minPrice: number;
}

export function getServiceJsonLdConfig(slug: string): ServiceJsonLdConfig {
    const norm = normalizeServiceSlug(slug);
    switch (norm) {
        case 'alcoholemia':
            return {
                name: "Defensa penal por alcoholemia",
                serviceType: "Defensa penal por conducción bajo influencia de alcohol",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por alcoholemia en Cataluña. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: 980
            };
        case 'drogas':
            return {
                name: "Defensa penal por drogas al volante",
                serviceType: "Defensa penal por conducción bajo influencia de drogas",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por drogas al volante en Cataluña. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: 980
            };
        case 'velocidad':
            return {
                name: "Defensa penal por exceso de velocidad",
                serviceType: "Defensa penal por delito de exceso de velocidad",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por exceso de velocidad constitutivo de delito en Cataluña. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: 980
            };
        case 'sin-carnet':
            return {
                name: "Defensa penal por conducción sin permiso",
                serviceType: "Defensa penal por conducción sin permiso o licencia",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por conducir sin carnet o sin puntos en Cataluña. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: 980
            };
        case 'profesionales':
            return {
                name: "Defensa penal para conductores profesionales",
                serviceType: "Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)",
                description: "Defensa penal y asistencia urgente 24h para transportistas y conductores profesionales en Cataluña. Honorarios cerrados desde 1.080 € con IVA y procurador incluidos.",
                minPrice: 1080
            };
        default:
            return {
                name: "Defensa penal por delitos contra la seguridad vial",
                serviceType: "Defensa penal de tráfico",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos en Cataluña.",
                minPrice: 980
            };
    }
}
