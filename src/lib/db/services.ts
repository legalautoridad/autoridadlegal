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
 * Fetches FAQs for a service from public.service_faqs table in Supabase.
 */
export async function getServiceFaqs(serviceSlug: string): Promise<ServiceFaq[]> {
    const normSlug = normalizeServiceSlug(serviceSlug);
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('service_faqs')
        .select('question, answer, topic')
        .eq('service_slug', normSlug)
        .order('position', { ascending: true });

    if (error || !data) {
        console.error(`Error fetching service_faqs for ${normSlug}:`, error);
        return [];
    }

    return data as ServiceFaq[];
}

export interface ServiceJsonLdConfig {
    name: string;
    serviceType: string;
    description: string;
    minPrice: string;
}

export function getServiceJsonLdConfig(slug: string): ServiceJsonLdConfig {
    const norm = normalizeServiceSlug(slug);
    switch (norm) {
        case 'alcoholemia':
            return {
                name: "Defensa penal por alcoholemia",
                serviceType: "Defensa penal por conducción bajo influencia de alcohol",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por alcoholemia en la provincia de Barcelona. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: "980.00"
            };
        case 'drogas':
            return {
                name: "Defensa penal por drogas al volante",
                serviceType: "Defensa penal por conducción bajo influencia de drogas",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por drogas al volante en la provincia de Barcelona. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: "980.00"
            };
        case 'velocidad':
            return {
                name: "Defensa penal por exceso de velocidad",
                serviceType: "Defensa penal por delito de exceso de velocidad",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por exceso de velocidad constitutivo de delito en la provincia de Barcelona. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: "980.00"
            };
        case 'sin-carnet':
            return {
                name: "Defensa penal por conducción sin permiso",
                serviceType: "Defensa penal por conducción sin permiso o licencia",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos por conducir sin carnet o sin puntos en la provincia de Barcelona. Honorarios cerrados desde 980 € con IVA y procurador incluidos.",
                minPrice: "980.00"
            };
        case 'profesionales':
            return {
                name: "Defensa penal para conductores profesionales",
                serviceType: "Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)",
                description: "Defensa penal y asistencia urgente 24h para transportistas y conductores profesionales en la provincia de Barcelona. Honorarios cerrados desde 1.080 € con IVA y procurador incluidos.",
                minPrice: "1080.00"
            };
        default:
            return {
                name: "Defensa penal por delitos contra la seguridad vial",
                serviceType: "Defensa penal de tráfico",
                description: "Defensa penal y asistencia urgente 24h en juicios rápidos en la provincia de Barcelona.",
                minPrice: "980.00"
            };
    }
}

