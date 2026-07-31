import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/db/glosario';
import { TARGET_MUNICIPIOS, VALID_SERVICES } from '@/lib/db/cobertura';

export const revalidate = 3600; // Recalculate sitemap every hour via ISR

const BASE_URL = 'https://www.autoridad.legal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();
    const now = new Date();

    // 1. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // 5 Core Service Pages
        {
            url: `${BASE_URL}/alcoholemia`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/drogas`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/velocidad`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/sin-carnet`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/profesionales`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // Glossary Index
        {
            url: `${BASE_URL}/glosario`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        // Public Directory & Legal Pages
        {
            url: `${BASE_URL}/municipios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/recursos`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/legal/legal-notice`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/cookies`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // 2. Dynamic Glossary Term Pages (ONLY ACTIVE status from Supabase)
    const { data: termsData } = await supabase
        .from('semantic_entities')
        .select('name, status, updated_at, created_at')
        .eq('status', 'ACTIVE');

    const glossaryPages: MetadataRoute.Sitemap = (termsData || [])
        .map(term => {
            const slug = slugify(term.name);
            const timestamp = term.updated_at || term.created_at;
            return {
                url: `${BASE_URL}/glosario/${slug}`,
                lastModified: timestamp ? new Date(timestamp) : now,
                changeFrequency: 'yearly' as const,
                priority: 0.4,
            };
        })
        .sort((a, b) => a.url.localeCompare(b.url));

    // 3. Dynamic Cobertura Pages (ONLY web_published = true & in TARGET_MUNICIPIOS)
    const { data: coberturaRows } = await supabase
        .from('location_services')
        .select('service, location_id, web_published, updated_at, created_at, locations(slug)')
        .eq('web_published', true);

    const coberturaPagesMap = new Map<string, MetadataRoute.Sitemap[number]>();

    (coberturaRows || []).forEach(row => {
        if (!row.web_published) {
            return;
        }

        const citySlug = (row.locations as any)?.slug;
        if (!citySlug || !TARGET_MUNICIPIOS.includes(citySlug)) {
            return;
        }

        const rawService = (row.service || '').toLowerCase().replace(/_/g, '-');
        if (!VALID_SERVICES.includes(rawService)) {
            return;
        }

        const url = `${BASE_URL}/${rawService}/${citySlug}`;
        const timestamp = row.updated_at || row.created_at;

        if (!coberturaPagesMap.has(url)) {
            coberturaPagesMap.set(url, {
                url,
                lastModified: timestamp ? new Date(timestamp) : now,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        }
    });

    const coberturaPages = Array.from(coberturaPagesMap.values()).sort((a, b) =>
        a.url.localeCompare(b.url)
    );

    // Combine & Deduplicate
    const allEntries = [...staticPages, ...glossaryPages, ...coberturaPages];
    const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();
    allEntries.forEach(entry => {
        if (!uniqueMap.has(entry.url)) {
            uniqueMap.set(entry.url, entry);
        }
    });

    return Array.from(uniqueMap.values());
}
