import { MetadataRoute } from 'next';
import { getPublishedDistrictSlugs } from '@/lib/db/district-content';

export const revalidate = 3600; // Recalculate sitemap every hour via ISR

const BASE_URL = 'https://www.autoridad.legal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static content modification date (prevents dynamic build-time stamp on every request)
    const SITE_LAST_MODIFIED = new Date('2026-09-08T00:00:00.000Z');

    // 1. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // 5 Core Service Pages
        {
            url: `${BASE_URL}/alcoholemia`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/drogas`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/velocidad`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/sin-carnet`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/profesionales`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // Pricing & Honorarios Pages
        {
            url: `${BASE_URL}/honorarios`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/acuerdo-honorarios`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Glossary Index
        {
            url: `${BASE_URL}/glosario`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        // Public Directory & Legal Pages
        {
            url: `${BASE_URL}/juzgados`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/recursos`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/legal/legal-notice`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/privacy`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/terms`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/legal/cookies`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        // Author / E-E-A-T Profile Page
        {
            url: `${BASE_URL}/abogados/santiago-gimenez-olavarriaga`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // 2. Dynamic Published District / Juzgados Pages
    const publishedDistricts = await getPublishedDistrictSlugs();
    const districtPages: MetadataRoute.Sitemap = publishedDistricts.map(({ slug }) => ({
        url: `${BASE_URL}/juzgados/${slug}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Combine & Deduplicate (zero /[service]/[city] or /glosario/[slug] URLs included)
    const allEntries = [...staticPages, ...districtPages];
    const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();
    allEntries.forEach(entry => {
        if (!uniqueMap.has(entry.url)) {
            uniqueMap.set(entry.url, entry);
        }
    });

    return Array.from(uniqueMap.values());
}
