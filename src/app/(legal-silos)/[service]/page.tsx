import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import ServiceTemplate from '@/components/silo/ServiceTemplate';

interface PageProps {
    params: Promise<{ service: string }>;
}

const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

// Validate service parameter
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
            canonical: `https://autoridadlegal.com/${service}`,
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
    if (!config) {
        return notFound();
    }

    // Generate JSON-LD for the Parent Service
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LegalService",
        "@id": `https://autoridadlegal.com/${service}#legal-service`,
        "name": `Autoridad Legal - Abogados Especialistas en ${config.hero.specialty}`,
        "description": config.seo.description,
        "url": `https://autoridadlegal.com/${service}`,
        "telephone": "+34605118871",
        "priceRange": "980€",
        "image": "https://autoridadlegal.com/images/lawyer_video_thumbnail.png",
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Cataluña"
        },
        "provider": {
            "@type": "Organization",
            "name": "Autoridad Legal",
            "url": "https://autoridadlegal.com"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
