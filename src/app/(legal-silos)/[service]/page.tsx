import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getServiceFaqs, getServiceBySlugFromDb, getServiceJsonLdConfig, normalizeServiceSlug } from '@/lib/db/services';
import { SERVICES_PRICING, PRICING_ADDONS } from '@/lib/config/pricing';
import { DEFAULT_OG_IMAGE } from '@/lib/config';

interface PageProps {
    params: Promise<{ service: string }>;
}

const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(normalizeServiceSlug(service));
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

    const canonicalUrl = `https://www.autoridad.legal/${normSlug}`;

    return {
        title: `${config.seo.title} | Autoridad Legal`,
        description: config.seo.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: config.seo.title,
            description: config.seo.description,
            url: canonicalUrl,
            siteName: 'Autoridad Legal',
            locale: 'es_ES',
            type: 'website',
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: config.seo.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: config.seo.title,
            description: config.seo.description,
            images: [DEFAULT_OG_IMAGE],
        },
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
    const pricingConfig = SERVICES_PRICING.find(s => s.slug === normSlug);

    if (!config) {
        return notFound();
    }

    const canonicalUrl = `https://www.autoridad.legal/${normSlug}`;

    const offersObj: any = {
        "@type": "Offer",
        "@id": `${canonicalUrl}#offer`,
        "url": canonicalUrl,
        "availability": "https://schema.org/InStock",
        "priceCurrency": "EUR",
        "priceSpecification": {
            "@type": "PriceSpecification",
            "price": pricingConfig ? pricingConfig.basePrice : jsonLdConfig.price.toFixed(2),
            "priceCurrency": "EUR",
            "valueAddedTaxIncluded": true
        },
        "offeredBy": {
            "@type": "Organization",
            "@id": "https://www.autoridad.legal/#organization"
        },
        "seller": {
            "@type": "Person",
            "@id": "https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person"
        }
    };

    if (pricingConfig && pricingConfig.applicableAddOns.length > 0) {
        offersObj["addOn"] = pricingConfig.applicableAddOns.map(addOnId => {
            const addOn = PRICING_ADDONS[addOnId];
            return {
                "@type": "Offer",
                "name": addOn.name,
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": addOn.price,
                    "priceCurrency": "EUR",
                    "valueAddedTaxIncluded": true
                },
                "description": addOn.description
            };
        });
    }

    // Schema.org Service + FAQPage Graph (Unified Offer pattern matching coverage pages)
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
                    "name": "Cataluña"
                },
                "provider": {
                    "@type": "Organization",
                    "@id": "https://www.autoridad.legal/#organization"
                },
                "offers": offersObj
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
