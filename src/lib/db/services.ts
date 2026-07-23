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

export interface CanonicalFaq {
    id: string;
    service: string;
    specific_topic: string;
    question: string;
    answer: string;
}

/**
 * Normalizes service slug (e.g. sin_carnet -> sin-carnet)
 */
export function normalizeServiceSlug(slug: string): string {
    const s = slug.toLowerCase().trim();
    if (s === 'sin-carnet' || s === 'sin_carnet') return 'sin-carnet';
    return s;
}

function getServiceDbName(slug: string): string {
    const norm = normalizeServiceSlug(slug);
    switch (norm) {
        case 'alcoholemia': return 'Alcoholemia';
        case 'drogas': return 'Drogas';
        case 'velocidad': return 'Velocidad';
        case 'profesionales': return 'Profesionales';
        case 'sin-carnet': return 'Sin Carnet';
        default: return slug;
    }
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
 * Fetches the canonical base FAQs for a service from Supabase.
 * Deduplicates the ~44,330 location variants down to the base canonical FAQs.
 */
export async function getCanonicalFaqsForService(serviceSlug: string): Promise<CanonicalFaq[]> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('thematic_faqs')
        .select('id, service, specific_topic, question, answer');

    if (error || !data) {
        console.error(`Error fetching canonical FAQs for ${serviceSlug}:`, error);
        return [];
    }

    const targetService = getServiceDbName(serviceSlug);
    const canonicalMap = new Map<string, CanonicalFaq>();

    data.forEach(item => {
        const itemService = (item.service || '').toLowerCase().trim();
        if (itemService === targetService.toLowerCase()) {
            const key = item.specific_topic.toLowerCase().trim();
            if (!canonicalMap.has(key)) {
                canonicalMap.set(key, {
                    id: item.id,
                    service: item.service,
                    specific_topic: item.specific_topic,
                    question: item.question,
                    answer: item.answer,
                });
            }
        }
    });

    return Array.from(canonicalMap.values());
}
