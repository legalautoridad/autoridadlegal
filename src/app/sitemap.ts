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
        // Pricing & Honorarios Page
        {
            url: `${BASE_URL}/honorarios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
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
        // Author / E-E-A-T Profile Page
        {
            url: `${BASE_URL}/abogados/santiago-gimenez-olavarriaga`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
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

    // 3. Dynamic Cobertura Pages (5 Specialties x 129 Municipios = 645 URLs)
    const { data: coberturaRows } = await supabase
        .from('location_services')
        .select('service, location_id, web_published, updated_at, created_at, locations(slug)')
        .eq('web_published', true);

    const timestampMap = new Map<string, Date>();
    const alcoholemiaMunicipiosSet = new Set<string>();

    (coberturaRows || []).forEach(row => {
        if (!row.web_published) {
            return;
        }

        const citySlug = (row.locations as any)?.slug;
        if (!citySlug) {
            return;
        }

        const rawService = (row.service || '').toLowerCase().replace(/_/g, '-');
        const timestamp = row.updated_at || row.created_at;
        const dateVal = timestamp ? new Date(timestamp) : now;

        timestampMap.set(`${rawService}:${citySlug}`, dateVal);

        if (rawService === 'alcoholemia') {
            alcoholemiaMunicipiosSet.add(citySlug);
        }
    });

    // Reference list of 129 canonical municipios from alcoholemia
    const municipiosList = Array.from(alcoholemiaMunicipiosSet).sort((a, b) => a.localeCompare(b));

    const coberturaPagesMap = new Map<string, MetadataRoute.Sitemap[number]>();

    VALID_SERVICES.forEach(service => {
        municipiosList.forEach(citySlug => {
            const url = `${BASE_URL}/${service}/${citySlug}`;
            const lastMod =
                timestampMap.get(`${service}:${citySlug}`) ||
                timestampMap.get(`alcoholemia:${citySlug}`) ||
                now;

            coberturaPagesMap.set(url, {
                url,
                lastModified: lastMod,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
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
