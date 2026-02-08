import { getSiloConfig, SILO_CONFIGS } from "@/lib/silo-config";
import { LOCATIONS } from "@/data/locations";
import { notFound } from "next/navigation";
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
    const location = LOCATIONS.find((l) => l.slug === city);

    if (!config || !location) {
        // Console log for debugging if needed, but not in production code
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
        'alcoholemia': `Abogado Alcoholemia ${location.name} | Juicios Rápidos 24h`,
        'herencias': `Abogado Herencias ${location.name} | Desbloqueo y Sucesiones`,
        'accidentes': `Abogado Accidentes ${location.name} | Indemnización Máxima`
    };

    return {
        title: titles[service] || `Abogado ${config.hero.badge_text} ${location.name}`,
        description: `Servicio legal experto en ${location.name}. Especialistas en ${config.hero.badge_text}. Asistencia urgente en ${location.court}.`,
    };
}

// 3. Static Generation (Cartesian Product: Service x City)
export function generateStaticParams() {
    const params: { service: string; city: string }[] = [];
    const verticals = Object.keys(SILO_CONFIGS);

    verticals.forEach((service) => {
        LOCATIONS.forEach((location) => {
            params.push({ service, city: location.slug });
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

    const { config, location, service } = data;

    // --- Dynamic Content Injection (Power Messages) ---
    // --- Dynamic Content Injection (Power Messages) ---
    const POWER_MESSAGES: Record<string, { title: string; subtitle: string }> = {
        'alcoholemia': {
            title: `Defensa Especializada en Alcoholemia en ${location.name}`,
            subtitle: `Seguridad Vial y Juicios Rápidos en ${location.court}. Asistencia inmediata 24h.`
        },
        'herencias': {
            title: `Desbloqueo de Herencias y Sucesiones en ${location.name}`,
            subtitle: `Planificación patrimonial experta y resolución de conflictos familiares.`
        },
        'accidentes': {
            title: `Indemnización Máxima por Accidente en ${location.name}`,
            subtitle: `Peritos médicos independientes y reclamación de daños en ${location.court}.`
        }
    };

    const powerMessage = POWER_MESSAGES[service] || {
        title: `Abogado Especialista en ${config.hero.badge_text} en ${location.name}`,
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
            question: `¿Actuáis en los ${location.court}?`,
            answer: `Sí, nuestros abogados penalistas asisten diariamente a detenidos y vistas en los ${location.court} y comisarías de ${location.name}.`
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
                    name: `Abogado ${config.hero.badge_text} ${location.name}`,
                    description: `Servicio legal experto en ${location.name}. Especialistas en ${config.hero.badge_text}.`,
                    areaServed: {
                        "@type": "City",
                        "name": location.name
                    },
                    location: {
                        "@type": "Place",
                        "name": location.court // Linking semantically to the court builds authority
                    }
                }}
            />


            {/* Hero with Localized Text */}
            <HeroSection config={localConfig} />

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
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Actualidad Jurídica en {config.hero.badge_text}</h2>
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
