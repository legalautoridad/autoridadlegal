import { MetadataRoute } from 'next';
import { getAllGlosarioTerms } from '@/lib/db/glosario';
import { getLocations } from '@/lib/db/locations';

const SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];
const BASE_URL = 'https://autoridadlegal.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date();

    // 1. Static Core Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/municipios`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/glosario`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/recursos`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/entitymap.html`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Service landing pages
    SERVICES.forEach(service => {
        staticPages.push({
            url: `${BASE_URL}/${service}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.85,
        });
    });

    // 2. Glossary Term Pages & Raw Markdown URLs from Supabase
    const terms = await getAllGlosarioTerms();
    const glosarioPages: MetadataRoute.Sitemap = [];

    terms.forEach(term => {
        // HTML Term Page
        glosarioPages.push({
            url: `${BASE_URL}/glosario/${term.slug}`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        });

        // Raw Markdown URL for LLMs
        glosarioPages.push({
            url: `${BASE_URL}/glosario/${term.slug}.md`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.5,
        });
    });

    // 3. Dynamic Location Service Pages
    const locations = await getLocations();
    const locationPages: MetadataRoute.Sitemap = [];

    SERVICES.forEach(service => {
        locations.forEach(loc => {
            locationPages.push({
                url: `${BASE_URL}/${service}/${loc.slug}`,
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.75,
            });
        });
    });

    return [...staticPages, ...glosarioPages, ...locationPages];
}
