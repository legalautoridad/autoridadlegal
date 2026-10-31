import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/server';

export const revalidate = 3600; // Recalculate sitemap every hour via ISR

const BASE_URL = 'https://www.autoridad.legal';

// Fixed content modification date (never new Date() on each request)
const CONTENT_LAST_MODIFIED = new Date('2026-10-31T00:00:00.000Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();
    const { data: courts } = await supabase
        .from('courts')
        .select('slug, created_at')
        .order('slug', { ascending: true });

    const courtPages: MetadataRoute.Sitemap = (courts || []).map((court) => ({
        url: `${BASE_URL}/juzgados/${court.slug}`,
        lastModified: CONTENT_LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Strictly 34 indexable URLs:
    // 1 home + 1 /juzgados + 25 /juzgados/{partido} + 5 silos + 1 /honorarios + 1 /glosario
    const entries: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/juzgados`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        ...courtPages,
        {
            url: `${BASE_URL}/alcoholemia`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/drogas`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/velocidad`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/sin-carnet`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/profesionales`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/honorarios`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/glosario`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return entries;
}
