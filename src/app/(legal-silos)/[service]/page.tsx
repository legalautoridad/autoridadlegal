import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PHONE_E164 } from '@/lib/config';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getCanonicalFaqsForService, getServiceBySlugFromDb } from '@/lib/db/services';

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

    const config = getSiloConfig(service);
    if (!config) {
        return {};
    }

    return {
        title: `${config.seo.title} | Autoridad Legal`,
        description: config.seo.description,
        alternates: {
            canonical: `https://www.autoridad.legal/${service}`,
        }
    };
}

// 2. Parent Service Hub Page Implementation
export default async function ParentServicePage({ params }: PageProps) {
    const { service } = await params;
    
    if (!isValidService(service)) {
        return notFound();
    }

    const config = getSiloConfig(service);
    const dbService = await getServiceBySlugFromDb(service);
    const canonicalFaqs = await getCanonicalFaqsForService(service);

    if (!config) {
        return notFound();
    }

    const canonicalUrl = `https://www.autoridad.legal/${service}`;
    const title = dbService?.seo?.title || config.seo.title;
    const description = dbService?.seo?.description || config.seo.description;

    // Schema.org LegalService + FAQPage Graph
    const jsonLdGraph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LegalService",
                "@id": `${canonicalUrl}#legal-service`,
                "name": `Autoridad Legal - Abogados Especialistas en ${config.hero.specialty}`,
                "description": description,
                "url": canonicalUrl,
                "telephone": PHONE_E164,
                "priceRange": "980€",
                "image": "https://www.autoridad.legal/images/lawyer_video_thumbnail.png",
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "Provincia de Barcelona, Cataluña"
                },
                "provider": {
                    "@type": "Organization",
                    "name": "Autoridad Legal",
                    "url": "https://www.autoridad.legal",
                    "logo": "https://www.autoridad.legal/images/logo-transparent.png"
                },
                "author": {
                    "@type": "Person",
                    "name": "Santiago Giménez Olavarriaga",
                    "jobTitle": "Director Jurídico y Abogado Penalista",
                    "identifier": "ICAB 31.389",
                    "sameAs": "https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga"
                }
            },
            ...(canonicalFaqs.length > 0 ? [{
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": canonicalFaqs.map(faq => ({
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
            <ServiceTemplate service={service} city={null} />
        </>
    );
}

// 3. Static Generation
export function generateStaticParams() {
    return VALID_SERVICES.map((service) => ({
        service,
    }));
}
