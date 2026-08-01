import { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getCoberturaData, getLiveCoberturaParams, VALID_SERVICES } from '@/lib/db/cobertura';
import { normalizeServiceSlug } from '@/lib/db/services';
import { generateCoberturaJsonLd } from '@/lib/seo/cobertura-jsonld';

export const revalidate = 3600; // ISR revalidation every 1 hour
export const dynamicParams = true; // Allow dynamic rendering for valid published rows

interface LeafPageProps {
    params: Promise<{ service: string; city: string }>;
}

function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(normalizeServiceSlug(service));
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: LeafPageProps): Promise<Metadata> {
    const { service, city } = await params;
    const normService = normalizeServiceSlug(service);
    if (!isValidService(normService)) return {};

    const cobertura = await getCoberturaData(normService, city);
    if (!cobertura) return {};

    const canonicalUrl = `https://www.autoridad.legal/${cobertura.service.slug}/${cobertura.location.slug}`;

    return {
        title: `${cobertura.h1Title} | Autoridad Legal`,
        description: cobertura.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: cobertura.h1Title,
            description: cobertura.description,
            url: canonicalUrl,
            siteName: 'Autoridad Legal',
            locale: 'es_ES',
            type: 'article',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: cobertura.h1Title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: cobertura.h1Title,
            description: cobertura.description,
            images: ['/og-image.jpg'],
        },
    };
}

// 2. Localized Service Leaf Page Component (Server Rendered)
export default async function LocalizedServiceLeafPage({ params }: LeafPageProps) {
    const { service, city } = await params;
    const normService = normalizeServiceSlug(service);

    if (!isValidService(normService)) {
        redirect('/alcoholemia', RedirectType.replace);
    }

    const cobertura = await getCoberturaData(normService, city);

    // Gate: Long-tail / unpublished municipios permanently redirect 301 to root service page
    if (!cobertura) {
        redirect(`/${normService}`, RedirectType.replace);
    }

    const canonicalUrl = `https://www.autoridad.legal/${cobertura.service.slug}/${cobertura.location.slug}`;
    const jsonLdGraph = generateCoberturaJsonLd(cobertura, canonicalUrl);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />
            <ServiceTemplate
                service={cobertura.service.slug}
                city={cobertura.location.slug}
                cobertura={cobertura}
            />
        </>
    );
}

// 3. Static Generation: Strictly LIVE combinations from TARGET_MUNICIPIOS with web_published = true
export async function generateStaticParams() {
    return await getLiveCoberturaParams();
}
