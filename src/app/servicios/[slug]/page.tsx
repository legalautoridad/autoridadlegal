import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { getCanonicalFaqsForService, getServiceBySlugFromDb } from '@/lib/db/services';

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

    const config = getSiloConfig(slug);
    if (!config) {
        return {};
    }

    return {
        title: `${config.seo.title} | Autoridad Legal`,
        description: config.seo.description,
        alternates: {
            canonical: `https://autoridadlegal.com/servicios/${slug}`,
        }
    };
}

export default async function ServicioSlugPage({ params }: PageProps) {
    const { slug } = await params;
    
    if (!isValidService(slug)) {
        return notFound();
    }

    const config = getSiloConfig(slug);
    const dbService = await getServiceBySlugFromDb(slug);
    const canonicalFaqs = await getCanonicalFaqsForService(slug);

    if (!config) {
        return notFound();
    }

    const canonicalUrl = `https://autoridadlegal.com/servicios/${slug}`;
    const title = dbService?.seo?.title || config.seo.title;
    const description = dbService?.seo?.description || config.seo.description;

    const jsonLdGraph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LegalService",
                "@id": `${canonicalUrl}#legal-service`,
                "name": `Autoridad Legal - Abogados Especialistas en ${config.hero.specialty}`,
                "description": description,
                "url": canonicalUrl,
                "telephone": "+34605118871",
                "priceRange": "980€",
                "image": "https://autoridadlegal.com/images/lawyer_video_thumbnail.png",
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "Provincia de Barcelona, Cataluña"
                },
                "provider": {
                    "@type": "Organization",
                    "name": "Autoridad Legal",
                    "url": "https://autoridadlegal.com",
                    "logo": "https://autoridadlegal.com/images/logo-transparent.png"
                },
                "author": {
                    "@type": "Person",
                    "name": "Santiago Giménez Olavarriaga",
                    "jobTitle": "Director Jurídico y Abogado Penalista",
                    "identifier": "ICAB 31.389",
                    "sameAs": "https://autoridadlegal.com/abogados/santiago-gimenez-olavarriaga"
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
            <ServiceTemplate service={slug} city={null} />
        </>
    );
}

export function generateStaticParams() {
    return VALID_SERVICES.map((slug) => ({
        slug,
    }));
}
