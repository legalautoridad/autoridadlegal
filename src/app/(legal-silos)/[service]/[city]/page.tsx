import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getCoberturaData, getLiveCoberturaParams, VALID_SERVICES } from '@/lib/db/cobertura';

export const revalidate = 3600; // ISR revalidation every 1 hour
export const dynamicParams = true; // Allow newly published DB rows to render dynamically via ISR without redeploy

interface LeafPageProps {
    params: Promise<{ service: string; city: string }>;
}

function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(service.toLowerCase());
}

// 1. Dynamic SEO Metadata Generation (Single source of truth: web_published gate)
export async function generateMetadata({ params }: LeafPageProps): Promise<Metadata> {
    const { service, city } = await params;
    if (!isValidService(service)) return {};

    const cobertura = await getCoberturaData(service, city);
    if (!cobertura) return {};

    const canonicalUrl = `https://autoridadlegal.com/${cobertura.service.slug}/${cobertura.location.slug}`;

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
        },
        twitter: {
            card: 'summary_large_image',
            title: cobertura.h1Title,
            description: cobertura.description,
        },
    };
}

// 2. Localized Service Leaf Page Component (Server Rendered)
export default async function LocalizedServiceLeafPage({ params }: LeafPageProps) {
    const { service, city } = await params;
    if (!isValidService(service)) return notFound();

    const cobertura = await getCoberturaData(service, city);
    if (!cobertura) {
        return notFound();
    }

    const canonicalUrl = `https://autoridadlegal.com/${cobertura.service.slug}/${cobertura.location.slug}`;

    // Schema.org LegalService + FAQPage Graph
    const jsonLdGraph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LegalService",
                "@id": `${canonicalUrl}#legal-service`,
                "name": cobertura.h1Title,
                "description": cobertura.description,
                "url": canonicalUrl,
                "telephone": "+34605118871",
                "priceRange": "980€",
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": cobertura.location.name
                },
                "provider": {
                    "@type": "Organization",
                    "@id": "https://autoridadlegal.com/#organization",
                    "name": "Autoridad Legal",
                    "url": "https://autoridadlegal.com"
                },
                "author": {
                    "@type": "Person",
                    "name": "Santiago Giménez Olavarriaga",
                    "jobTitle": "Director Jurídico y Abogado Penalista",
                    "identifier": "ICAB 31.389",
                    "sameAs": "https://autoridadlegal.com/abogados/santiago-gimenez-olavarriaga"
                }
            },
            {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": cobertura.faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />
            <ServiceTemplate service={cobertura.service.slug} city={cobertura.location.slug} />
        </>
    );
}

// 3. Static Generation: Strictly LIVE combinations from location_services (web_published = true & faq_json non-empty)
export async function generateStaticParams() {
    return await getLiveCoberturaParams();
}
