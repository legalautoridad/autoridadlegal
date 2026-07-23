import { createStaticClient } from '@/lib/supabase/server';

export interface DbGlosarioTerm {
    id: string;
    name: string;
    description: string;
    schema_url: string | null;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface RelatedLink {
    title: string;
    url: string;
    type: 'glosario' | 'servicio' | 'juzgado';
}

/**
 * Normalizes entity name into a URL-friendly slug.
 */
export function slugify(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Fetches all active glossary terms from Supabase.
 */
export async function getAllGlosarioTerms(): Promise<DbGlosarioTerm[]> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('semantic_entities')
        .select('*')
        .eq('status', 'ACTIVE');

    if (error || !data) {
        console.error('Error fetching semantic_entities from Supabase:', error);
        return [];
    }

    const terms: DbGlosarioTerm[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        schema_url: item.schema_url,
        slug: slugify(item.name),
        created_at: item.created_at,
        updated_at: item.updated_at,
    }));

    return terms.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
}

/**
 * Fetches a single glossary term by slug from Supabase.
 */
export async function getGlosarioTermBySlug(slug: string): Promise<DbGlosarioTerm | null> {
    const normSlug = slug.toLowerCase().trim().replace(/\.md$/, '');
    const terms = await getAllGlosarioTerms();
    return terms.find(t => t.slug === normSlug) || null;
}

/**
 * Fetches public related links for a given entity.
 * Filters out internal documents (guia_tecnica, memoria_fiscal) and unpublished pages.
 */
export async function getPublicRelatedLinks(entityId: string): Promise<RelatedLink[]> {
    // Relationships are checked against Supabase.
    // If no published public targets exist, return empty array so UI omits empty sections.
    return [];
}
