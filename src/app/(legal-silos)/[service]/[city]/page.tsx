import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import { getLocationBySlug, getLocations } from '@/lib/db/locations';
import { SchemaFactory } from '@/lib/seo/schema-factory';
import ServiceTemplate from '@/components/silo/ServiceTemplate';

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

    if (!config || !location) {
        return null;
    }

    return { config, location, service, city };
}

// 2. SEO: Dynamic Metadata
export async function generateMetadata({ params }: LeafPageProps): Promise<Metadata> {
    const data = await getLeafData(params);
    if (!data) return {};

    const { config, location, service } = data;
    const title = `Abogado ${config.hero.specialty} ${location.name} | Urgencias 24h`;
    const description = `Asistencia legal 24h en ${location.name} por ${config.hero.specialty}. Defensa en comisarías y en los ${location.courts?.name || 'Juzgados locales'}.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://autoridadlegal.com/${service}/${location.slug}`,
        }
    };
}

// 3. Localized Service Leaf Page Implementation
export default async function LocalizedServiceLeafPage({ params }: LeafPageProps) {
    const data = await getLeafData(params);

    if (!data) {
        return notFound();
    }

    const { config, location, service, city } = data;

    // Handle redirection if the location has a redirect_slug
    if (location.redirect_slug && city !== location.redirect_slug) {
        permanentRedirect(`/${service}/${location.redirect_slug}`);
    }

    // Generate JSON-LD Graph for SEO and Search Crawlers
    const jsonLdGraph = SchemaFactory.generateEmergencyGraph({
        baseUrl: "https://autoridadlegal.com",
        service: service,
        city: location.slug,
        cityName: location.name,
        specialtyName: config.hero.specialty
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
    const dbLocations = await getLocations();
    const params: { service: string; city: string }[] = [];

    VALID_SERVICES.forEach((service) => {
        dbLocations.forEach((loc) => {
            if (!loc.redirect_slug) {
                params.push({ service, city: loc.slug });
            }
        });
    });

    return params;
}
