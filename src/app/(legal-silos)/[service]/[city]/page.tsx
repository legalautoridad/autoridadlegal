import { getSiloConfig, SILO_CONFIGS } from "@/lib/silo-config";
import { getLocationBySlug, getLocations } from "@/lib/db/locations";
import { notFound, permanentRedirect } from "next/navigation";
import { HeroSection } from "@/components/silo/HeroSection";
import { TrustSignals } from "@/components/silo/TrustSignals";
import { ValueProposition } from "@/components/silo/ValueProposition";
import { StatsRow } from "@/components/silo/StatsRow";
import { PainPoints } from "@/components/silo/PainPoints";
import { Metadata } from "next";
import { SchemaOrg } from "@/components/seo/SchemaOrg";

import { ARTICLES } from "@/data/articles";
import Link from "next/link";
import { FAQSection } from "@/components/seo/FAQSection";

type Props = {
    params: Promise<{ service: string; city: string }>;
};

// 1. Validation & Data Fetching Helper
async function getData(params: Props['params']) {
    const { service, city } = await params;
    const config = getSiloConfig(service);

    // Fetch from Database
    const location = await getLocationBySlug(city);

    if (!config || !location) {
        return null;
    }

    return { config, location, service, city };
}

// 2. SEO: Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const data = await getData(params);
    if (!data) return {};

    const { config, location, service } = data;

    // Aligned with proper Power Messages
    const titles: Record<string, string> = {
        'alcoholemia': `Abogado Alcoholemia ${location.name} | Juicios Rápidos`,
        'herencias': `Abogado Herencias ${location.name} | Desbloqueo y Sucesiones`,
        'accidentes': `Abogado Accidentes ${location.name} | Indemnización Máxima`
    };

    const baseUrl = "https://autoridadlegal.com";
    const canonicalUrl = `${baseUrl}/${service}/${location.slug}`;

    return {
        title: titles[service] || `Abogado ${config.hero.specialty} ${location.name}`,
        description: `Servicio legal experto en ${location.name}. Especialistas en ${config.hero.specialty}. Asistencia urgente en ${location.courts?.name}.`,
        alternates: {
            canonical: canonicalUrl,
        }
    };
}

// 3. Static Generation (Cartesian Product: Service x City)
export async function generateStaticParams() {
    const params: { service: string; city: string }[] = [];
    const verticals = Object.keys(SILO_CONFIGS);

    // Fetch from Database
    const dbLocations = await getLocations();

    verticals.forEach((service) => {
        dbLocations.forEach((loc) => {
            if (!loc.redirect_slug) {
                params.push({ service, city: loc.slug });
            }
        });
    });

    return params;
}

// 4. Page Implementation
export default async function LocalLandingPage({ params }: Props) {
    const data = await getData(params);

    if (!data) {
        return notFound();
    }

    const { config, location, service, city } = data;

    // Handle redirection if the city has a redirect_slug
    if (location.redirect_slug && city !== location.redirect_slug) {
        permanentRedirect(`/${service}/${location.redirect_slug}`);
    }

    // --- Dynamic Content Injection (Power Messages) ---
    // --- Dynamic Content Injection (Power Messages) ---
    const POWER_MESSAGES: Record<string, { title: string; subtitle: string }> = {
        'alcoholemia': {
            title: `Defensa Especializada en Alcoholemia en ${location.name}`,
            subtitle: `Seguridad Vial y Juicios Rápidos en ${location.courts?.name || 'los juzgados'}.`
        },
        'herencias': {
            title: `Desbloqueo de Herencias y Sucesiones en ${location.name}`,
            subtitle: `Planificación patrimonial experta y resolución de conflictos familiares.`
        },
        'accidentes': {
            title: `Indemnización Máxima por Accidente en ${location.name}`,
            subtitle: `Peritos médicos independientes y reclamación de daños en ${location.courts?.name || 'los juzgados'}.`
        }
    };

    const powerMessage = POWER_MESSAGES[service] || {
        title: `Abogado Especialista en ${config.hero.specialty} en ${location.name}`,
        subtitle: `Asistencia legal urgente en la zona de ${location.zone}.`
    };

    const localConfig = {
        ...config,
        hero: {
            ...config.hero,
            title: powerMessage.title,
            subtitle: powerMessage.subtitle,
        }
    };

    // Default FAQs (could be localized further if needed)
    const faqs = [
        {
            question: `¿Actuáis en los ${location.courts?.name || 'juzgados'}?`,
            answer: `Sí, nuestros abogados penalistas asisten diariamente a detenidos y vistas en los ${location.courts?.name || 'juzgados'} y comisarías de ${location.name}.`
        },
        {
            question: "¿Cuánto tardan en llegar?",
            answer: "Garantizamos asistencia letrada en menos de 30 minutos en cualquier centro de detención de la zona metropolitana."
        },
        {
            question: `¿El precio es diferente en ${location.name}?`,
            answer: "No. Mantenemos tarifas estandarizadas para toda la provincia, sin recargos por desplazamiento."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Schema Injection */}
            <SchemaOrg
                type="LegalService"
                data={{
                    name: `Abogado ${config.hero.specialty} ${location.name}`,
                    description: `Servicio legal experto en ${location.name}. Especialistas en ${config.hero.specialty}.`,
                    areaServed: {
                        "@type": "City",
                        "name": location.name
                    },
                    location: {
                        "@type": "Place",
                        "name": location.courts?.name || "Juzgado competente"
                    }
                }}
            />


            {/* Hero with Localized Text */}
            <HeroSection config={localConfig} />

            {/* Jurisdiction Notice (e.g. for Abrera -> Martorell) */}
            {location.slug === 'martorell' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en <span className="font-bold text-blue-900">Abrera, Castellví de Rosanes, Collbató, Esparraguera, Masquefa, Olesa de Montserrat, San Andrés de la Barca o San Esteban de Sasroviras</span>, el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Martorell</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Bages -> Manresa) */}
            {location.slug === 'manresa' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones del Bages (<span className="font-bold text-blue-900">Artés, Cardona, Navás, Sallent, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Manresa</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Vallès Oriental -> Granollers) */}
            {location.slug === 'granollers' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones del Vallès Oriental (<span className="font-bold text-blue-900">Cardedeu, La Garriga, Sant Celoni, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Granollers</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Maresme -> Mataró) */}
            {location.slug === 'mataro' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones del Maresme (<span className="font-bold text-blue-900">El Masnou, Premiá de Mar, Vilasar de Mar, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Mataró</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Osona -> Vic) */}
            {location.slug === 'vic' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones de Osona (<span className="font-bold text-blue-900">Manlleu, Vic, Torelló, Tona, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Vic</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Arenys District -> Arenys de Mar) */}
            {location.slug === 'arenys-de-mar' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones colindantes (<span className="font-bold text-blue-900">Calella, Pineda de Mar, Tordera, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Arenys de Mar</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Anoia -> Igualada) */}
            {location.slug === 'igualada' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones de la Anoia (<span className="font-bold text-blue-900">Piera, Capellades, Vilanova del Camí, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Igualada</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Berguedà -> Berga) */}
            {location.slug === 'berga' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones del Berguedà (<span className="font-bold text-blue-900">Gironella, Puig-reig, Bagà, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Berga</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Alt Penedès -> Vilafranca) */}
            {location.slug === 'vilafranca-del-penedes' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones del Alt Penedès (<span className="font-bold text-blue-900">Sant Sadurní d'Anoia, Santa Margarida i els Monjos, Gelida, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Vilafranca del Penedès</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Badalona District -> Badalona) */}
            {location.slug === 'badalona' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en cualquiera de las poblaciones colindantes (<span className="font-bold text-blue-900">Montgat, Sant Adrià de Besòs, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Badalona</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Sant Boi District -> Sant Boi) */}
            {location.slug === 'sant-boi-de-llobregat' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Sant Climent de Llobregat, Santa Coloma de Cervelló, Torrelles de Llobregat, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Sant Boi de Llobregat</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Sabadell District -> Sabadell) */}
            {location.slug === 'sabadell' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Castellar del Vallès, Palau-solità i Plegamans, Santa Perpètua de Mogoda, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Sabadell</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Vilanova District -> Vilanova) */}
            {location.slug === 'vilanova-i-la-geltru' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del Garraf (<span className="font-bold text-blue-900">Sitges, Sant Pere de Ribes, Cubelles, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Vilanova i la Geltrú</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Terrassa District -> Terrassa) */}
            {location.slug === 'terrassa' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Matadepera, Viladecavalls, Ullastrell, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Terrassa</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Sant Feliu District -> Sant Feliu) */}
            {location.slug === 'sant-feliu-de-llobregat' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del Baix Llobregat (<span className="font-bold text-blue-900">Sant Joan Despí, Molins de Rei, Sant Vicenç dels Horts, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Sant Feliu de Llobregat</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Cerdanyola District -> Cerdanyola) */}
            {location.slug === 'cerdanyola-del-valles' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Barberà del Vallès, Ripollet, Montcada i Reixac, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Cerdanyola del Vallès</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Gavà District -> Gavà) */}
            {location.slug === 'gava' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Castelldefels, Viladecans, Begues, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Gavà</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Mollet District -> Mollet) */}
            {location.slug === 'mollet-del-valles' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Parets, Montmeló, La Llagosta, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Mollet del Vallès</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Esplugues District -> Esplugues) */}
            {location.slug === 'esplugues-de-llobregat' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Sant Just Desvern, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Esplugues de Llobregat</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Jurisdiction Notice (e.g. for Rubí District -> Rubí) */}
            {location.slug === 'rubi' && (
                <div className="bg-blue-50 border-y border-blue-100 py-3">
                    <div className="container px-4 md:px-6 mx-auto">
                        <p className="text-blue-800 text-sm md:text-base text-center font-medium">
                            Si la infracción se ha producido en poblaciones del distrito judicial (<span className="font-bold text-blue-900">Sant Cugat del Vallès, Castellbisbal, etc.</span>), el juzgado que le corresponde es el de <span className="font-bold text-blue-900">Rubí</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Court Detailed Information Section */}
            {location.courts && (location.courts.address || location.courts.phone || location.courts.information) && (
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4 font-serif">
                                Información del {location.courts.name}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8 text-slate-700">
                                {location.courts.information && (
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest text-blue-600">Información General</h3>
                                        <p className="text-sm leading-relaxed">{location.courts.information}</p>
                                    </div>
                                )}
                                {location.courts.address && (
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest text-blue-600">Dirección</h3>
                                        <p className="text-sm leading-relaxed font-medium">{location.courts.address}</p>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.courts.name + ' ' + location.courts.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-blue-600 text-xs font-bold hover:underline"
                                        >
                                            Ver en Google Maps →
                                        </a>
                                    </div>
                                )}
                                {location.courts.phone && (
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest text-blue-600">Teléfono de Contacto</h3>
                                        <p className="text-lg font-bold text-slate-900">{location.courts.phone}</p>
                                        <p className="text-[10px] text-slate-500 italic">Llamar preferiblemente en horario de mañana (09:00 - 14:00).</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {/* Standard Conversion Stack */}
            <StatsRow config={config} />
            <TrustSignals />
            <PainPoints config={config} />
            <ValueProposition config={config} />

            {/* --- FAQ SECTION (High Authority) --- */}
            <FAQSection category={service} city={location.name} />

            {/* Related Articles (E-E-A-T) */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Actualidad Jurídica en {config.hero.specialty}</h2>
                        <p className="text-slate-600">Análisis experto redactado por nuestros abogados colegiados.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {ARTICLES
                            .filter(a => a.category === service) // Filter by current silo
                            .slice(0, 3) // Limit to 3
                            .map(article => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group block"
                                >
                                    <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    {/* Empty State Fallback (Optional) */}
                    {ARTICLES.filter(a => a.category === service).length === 0 && (
                        <p className="text-center text-slate-400 italic">Pronto publicaremos artículos sobre esta materia.</p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
                <p>© 2024 Autoridad Legal. Todos los derechos reservados.</p>
                <p className="mt-2 text-slate-600">Servicio activo en {location.name} ({location.zone})</p>
            </footer>
        </main>
    );
}
