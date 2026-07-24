import { MetadataRoute } from 'next';
import { getAllGlosarioTerms } from '@/lib/db/glosario';
import { getLiveCoberturaParams } from '@/lib/db/cobertura';

export const revalidate = 3600; // Recalculate sitemap every hour via ISR when web_published rows are activated

const SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];
const BASE_URL = 'https://www.autoridad.legal';

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

    // Service landing pages (HTML and Raw Markdown for LLMs)
    SERVICES.forEach(service => {
        // Core Service HTML URL
        staticPages.push({
            url: `${BASE_URL}/${service}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.85,
        });

        // /servicios/[slug] HTML URL
        staticPages.push({
            url: `${BASE_URL}/servicios/${service}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.85,
        });

        // /[service].md Raw Markdown for LLMs
        staticPages.push({
            url: `${BASE_URL}/${service}.md`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
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

    // 3. Dynamic Location Service Pages (ONLY live combinations governed by web_published = true)
    const liveCoberturas = await getLiveCoberturaParams();
    const locationPages: MetadataRoute.Sitemap = [];

    liveCoberturas.forEach(cob => {
        // HTML Localized Page
        locationPages.push({
            url: `${BASE_URL}/${cob.service}/${cob.city}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.75,
        });

        // Raw Markdown URL for LLMs
        locationPages.push({
            url: `${BASE_URL}/${cob.service}/${cob.city}.md`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.55,
        });
    });

    return [...staticPages, ...glosarioPages, ...locationPages];
}
