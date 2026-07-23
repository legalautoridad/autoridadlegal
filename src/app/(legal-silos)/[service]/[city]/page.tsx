import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import { getLocationBySlug, getLocations } from '@/lib/db/locations';
import { SchemaFactory } from '@/lib/seo/schema-factory';
import ServiceTemplate from '@/components/silo/ServiceTemplate';
import { OKFService } from '@/lib/okf/okf-service';

interface LeafPageProps {
    params: Promise<{ service: string; city: string }>;
}

const VALID_SERVICES = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

// Validate service parameter
function isValidService(service: string): boolean {
    return VALID_SERVICES.includes(service.toLowerCase());
}

// 1. Data Fetching & Validation Helper
async function getLeafData(params: LeafPageProps['params']) {
    const { service, city } = await params;
    
    if (!isValidService(service)) {
        return null;
    }

    const config = getSiloConfig(service);
    const location = await getLocationBySlug(city);
    const okfCobertura = OKFService.getCobertura(service, city);

    if (!config && !okfCobertura) {
        return null;
    }

    return { config, location, okfCobertura, service, city };
}

// 2. SEO & GEO: Dynamic Metadata
export async function generateMetadata({ params }: LeafPageProps): Promise<Metadata> {
    const data = await getLeafData(params);
    if (!data) return {};

    const { config, location, okfCobertura, service, city } = data;

    const title = okfCobertura?.h1Title || okfCobertura?.frontmatter.title ||
        (location
            ? (service === 'alcoholemia'
                ? `Abogado Penalista para Juicio Rápido por Alcoholemia en ${location.name} | Asistencia de Guardia`
                : `Abogado Especialista en ${config?.hero.specialty} en ${location.name} | Urgencias 24h`)
            : `Abogado Especialista | Urgencias 24h`);

    const description = okfCobertura?.frontmatter.description ||
        (location ? `Asistencia legal 24h en ${location.name} por ${config?.hero.specialty}. Defensa técnica en comisarías y juzgados locales.` : `Asistencia legal urgente 24h en Cataluña.`);

    const canonicalUrl = `https://autoridadlegal.com/${service}/${city}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Autoridad Legal',
            locale: 'es_ES',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

// 3. Localized Service Leaf Page Implementation
export default async function LocalizedServiceLeafPage({ params }: LeafPageProps) {
    const data = await getLeafData(params);

    if (!data) {
        return notFound();
    }

    const { config, location, okfCobertura, service, city } = data;

    const cityName = location?.name || city.replace(/-/g, ' ');
    const specialtyName = config?.hero.specialty || service;
    const okfFaqs = OKFService.getFaqs(service, city);

    // Generate JSON-LD Graph for SEO and Search Crawlers (GEO / LLM optimized)
    const jsonLdGraph = SchemaFactory.generateEmergencyGraph({
        baseUrl: "https://autoridadlegal.com",
        service: service,
        city: city,
        cityName: cityName,
        specialtyName: specialtyName,
        courtName: location?.courts?.name,
        courtAddress: location?.courts?.address || undefined,
        faqs: okfFaqs,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />
            <ServiceTemplate service={service} city={city} />
        </>
    );
}


// 4. Static Generation
export async function generateStaticParams() {
    const okfParams = OKFService.getStaticParams();
    if (okfParams.length > 0) {
        return okfParams;
    }

    const dbLocations = await getLocations();
    const params: { service: string; city: string }[] = [];

    VALID_SERVICES.forEach((service) => {
        dbLocations.forEach((loc) => {
            params.push({ service, city: loc.slug });
        });
    });

    return params;
}

