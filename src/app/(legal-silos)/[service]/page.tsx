import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getServiceFaqs, getServiceBySlugFromDb, getServiceJsonLdConfig, normalizeServiceSlug } from '@/lib/db/services';

interface PageProps {
    params: Promise<{ service: string }>;
}

const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(service.toLowerCase());
}

// 1. SEO: Generate Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { service } = await params;
    if (!isValidService(service)) {
        return {};
    }

    const normSlug = normalizeServiceSlug(service);
    const config = getSiloConfig(normSlug);
    if (!config) {
        return {};
    }

    return {
        title: `${config.seo.title} | Autoridad Legal`,
        description: config.seo.description,
        alternates: {
            canonical: `https://www.autoridad.legal/${normSlug}`,
        }
    };
}

// 2. Parent Service Hub Page Implementation
export default async function ParentServicePage({ params }: PageProps) {
    const { service } = await params;
    
    if (!isValidService(service)) {
        return notFound();
    }

    const normSlug = normalizeServiceSlug(service);
    const config = getSiloConfig(normSlug);
    const dbService = await getServiceBySlugFromDb(normSlug);
    const serviceFaqs = await getServiceFaqs(normSlug);
    const jsonLdConfig = getServiceJsonLdConfig(normSlug);

    if (!config) {
        return notFound();
    }

    const canonicalUrl = `https://www.autoridad.legal/${normSlug}`;

    // Schema.org Service + FAQPage Graph
    const jsonLdGraph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": `${canonicalUrl}#service`,
                "name": jsonLdConfig.name,
                "serviceType": jsonLdConfig.serviceType,
                "description": jsonLdConfig.description,
                "url": canonicalUrl,
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "Provincia de Barcelona"
                },
                "provider": {
                    "@id": "https://www.autoridad.legal/#organization"
                },
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": jsonLdConfig.minPrice,
                        "priceCurrency": "EUR",
                        "valueAddedTaxIncluded": true
                    }
                }
            },
            ...(serviceFaqs.length > 0 ? [{
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": serviceFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }] : [])
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />
            <ServiceTemplate service={normSlug} city={null} faqs={serviceFaqs} />
        </>
    );
}

// 3. Static Generation
export function generateStaticParams() {
    return VALID_SERVICES.map((service) => ({
        service,
    }));
}
