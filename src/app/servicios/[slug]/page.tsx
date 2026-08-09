import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getServiceFaqs, getServiceBySlugFromDb, getServiceJsonLdConfig, normalizeServiceSlug } from '@/lib/db/services';

interface PageProps {
    params: Promise<{ slug: string }>;
}

const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(service.toLowerCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    if (!isValidService(slug)) {
        return {};
    }

    const normSlug = normalizeServiceSlug(slug);
    const config = getSiloConfig(normSlug);
    if (!config) {
        return {};
    }

    return {
        title: `${config.seo.title} | Autoridad Legal`,
        description: config.seo.description,
        alternates: {
            canonical: `https://www.autoridad.legal/servicios/${normSlug}`,
        }
    };
}

export default async function ServicioSlugPage({ params }: PageProps) {
    const { slug } = await params;
    
    if (!isValidService(slug)) {
        return notFound();
    }

    const normSlug = normalizeServiceSlug(slug);
    const config = getSiloConfig(normSlug);
    const dbService = await getServiceBySlugFromDb(normSlug);
    const serviceFaqs = await getServiceFaqs(normSlug);
    const jsonLdConfig = getServiceJsonLdConfig(normSlug);

    if (!config) {
        return notFound();
    }

    const canonicalUrl = `https://www.autoridad.legal/servicios/${normSlug}`;

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
                        "price": jsonLdConfig.price.toFixed(2),
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

export function generateStaticParams() {
    return VALID_SERVICES.map((slug) => ({
        slug,
    }));
}
