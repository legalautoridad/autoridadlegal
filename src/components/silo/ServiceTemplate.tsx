import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiloConfig } from '@/lib/silo-config';
import { getLocationBySlug, getLocations } from '@/lib/db/locations';
import { DefenseStrategySelector } from '@/lib/strategies/strategy-selector';
import { VideoFacade } from '@/components/silo/VideoFacade';
import { ZeroLeakageMenu } from '@/components/silo/ZeroLeakageMenu';
import { StatsRow } from '@/components/silo/StatsRow';
import { TrustSignals } from '@/components/silo/TrustSignals';
import { OKFService } from '@/lib/okf/okf-service';
import { OKFPointsMap } from '@/components/silo/OKFPointsMap';
import { MunicipalitySearch } from '@/components/silo/MunicipalitySearch';


interface ServiceTemplateProps {
    service: string;
    city?: string | null;
}

// Helper to format paragraphs strictly to the 40-60 words BLUF standard.
function toBlufParagraph(primaryText: string, secondaryText?: string): string {
    const combined = [primaryText, secondaryText].filter(Boolean).join(" ");
    const words = combined.split(/\s+/).filter(w => w.length > 0);

    if (words.length >= 40 && words.length <= 60) {
        return combined;
    }

    if (words.length < 40) {
        const fillers = [
            "Analizamos minuciosamente la calibración técnica del dispositivo medidor.",
            "Nuestros abogados penalistas de guardia revisan de inmediato el atestado policial para detectar vicios de forma.",
            "Garantizamos una defensa técnica de élite para proteger su libertad y su licencia.",
            "Contacte ahora para concertar una consulta de urgencia y recibir asesoramiento personalizado."
        ];
        let result = combined;
        for (const filler of fillers) {
            result += " " + filler;
            const currentWords = result.split(/\s+/).filter(w => w.length > 0);
            if (currentWords.length >= 40) {
                if (currentWords.length > 60) {
                    return currentWords.slice(0, 50).join(" ") + ".";
                }
                return result;
            }
        }
        return result;
    }

    return words.slice(0, 50).join(" ") + ".";
}

export default async function ServiceTemplate({ service, city }: ServiceTemplateProps) {
    const config = getSiloConfig(service);
    if (!config) {
        return notFound();
    }

    const location = city ? await getLocationBySlug(city) : null;
    const strategy = city ? DefenseStrategySelector.getStrategy(city) : null;

    const okfCobertura = city ? OKFService.getCobertura(service, city) : null;
    const okfFaqs = city ? OKFService.getFaqs(service, city) : [];
    const okfPuntos = city ? OKFService.getPuntosDeInteres(city) : [];


    // Build the dynamic H1 and subheadline from OKF cobertura data
    const h1 = okfCobertura?.h1Title || okfCobertura?.frontmatter.title || (city && location
        ? (service === 'alcoholemia'
            ? `Abogado Penalista para Juicio Rápido por Alcoholemia en ${location.name} | Asistencia de Guardia`
            : `Abogado Especialista en ${config.hero.specialty} en ${location.name}`)
        : config.hero.title);


    const bannerText = city && location
        ? `⚠️ ATENCIÓN: Teléfono de Urgencias Activo en ${location.name} (24 horas)`
        : `⚠️ ATENCIÓN: Teléfono de Urgencias Activo en Cataluña (24 horas)`;

    const badgeText = city && location
        ? `Asistencia Inmediata en ${location.name}`
        : `Atención de Guardia 24 Horas`;

    // WhatsApp parameters
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34657420999';
    const whatsappMessage = encodeURIComponent(
        city && location
            ? `Hola Autoridad Legal, necesito asistencia urgente por un tema de ${config.hero.specialty} en ${location.name}.`
            : `Hola Autoridad Legal, necesito asistencia urgente por un tema de ${config.hero.specialty}.`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Get all locations for the cluster directory
    const allLocations = await getLocations();
    const activeLocations = allLocations.filter(loc => !loc.redirect_slug);

    return (
        <main className="min-h-screen bg-slate-900 text-white pb-32">
            {/* Top Warning Shield */}
            <div className="bg-red-600 text-white text-center py-3 px-4 border-b border-red-500/20 font-semibold tracking-wide text-xs md:text-sm">
                {bannerText}
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.15),rgba(255,255,255,0))]"></div>
                <div className="container relative z-10 px-4 md:px-16 mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

                        {/* Hero Texts */}
                        <div className="space-y-6 lg:col-span-7 text-left">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prestige-gold/15 border border-prestige-gold/30 text-xs text-prestige-gold font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-prestige-gold animate-pulse"></span>
                                {badgeText}
                            </span>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                                {h1}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-bold">
                                Especialistas en la defensa técnica de delitos de tráfico. Actuamos con urgencia para proteger tus derechos y minimizar consecuencias penales.
                            </p>
                        </div>

                        {/* Facade Vertical Image */}
                        <div className="lg:col-span-5 flex justify-center w-full">
                            <VideoFacade service={service} />
                        </div>

                    </div>
                </div>
            </section>

            {/* Zero Leakage Navigation Menu (only for active location leaf) */}
            {city && location ? (
                <ZeroLeakageMenu
                    currentService={service}
                    municipalitySlug={location.slug}
                    municipalityName={location.name}
                />
            ) : (
                <div className="bg-slate-900 border-y border-white/5 py-4 text-center text-xs text-slate-400">
                    Defensa de Tránsito de Guardia Permanente en toda Cataluña
                </div>
            )}

            {/* BLUF Methodology Factual Content Layer */}
            <section className="py-20 bg-slate-950 border-b border-white/5">
                <div className="container px-4 md:px-16 mx-auto">
                    <div className="max-w-3xl mx-auto space-y-12">

                        {/* OKF Ground Truth BLUF Summary */}
                        {okfCobertura?.bluf && (
                            <div className="p-6 bg-slate-900/90 rounded-2xl border border-prestige-gold/40 shadow-xl space-y-3">
                                <div className="flex items-center gap-2 text-prestige-gold font-semibold text-xs tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-prestige-gold animate-pulse"></span>
                                    Dictamen de Doctrina OKF (Fuente Oficial)
                                </div>
                                <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium italic">
                                    "{okfCobertura.bluf}"
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                ¿Por qué actuar en las primeras 24 horas?
                            </h2>
                            <p className="text-slate-355 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    "Cuando das positivo en un control o eres investigado, la policía redacta un atestado que se remite al juzgado de inmediato. Contratar un abogado experto de guardia en las primeras horas permite interceptar el informe, proponer pruebas de descargo y evitar la apertura de juicios rápidos complejos."
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                Consecuencias Penales Directas
                            </h2>
                            <p className="text-slate-355 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    `Los delitos contra la seguridad vial por ${config.hero.specialty} acarrean multas diarias muy elevadas, trabajos comunitarios y la retirada del permiso de conducir hasta por cuatro años. En supuestos graves de reincidencia o tasas muy elevadas, la fiscalía solicita penas de prisión de hasta seis meses.`
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                La Reducción del Tercio de Condena
                            </h2>
                            <p className="text-slate-355 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    "Si compareces en el Juzgado de Guardia con un abogado especialista de guardia y se llega a una conformidad con el fiscal, la ley reduce la condena final y el periodo de retirada del carné de conducir en un tercio de forma automática."
                                )}
                            </p>
                        </div>

                        {/* OKF Local FAQs Layer */}
                        {okfFaqs.length > 0 && (
                            <div className="space-y-6 pt-6 border-t border-white/10">
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                    Preguntas Frecuentes
                                </h2>
                                <div className="space-y-4">
                                    {okfFaqs.map((faq, idx) => (
                                        <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-prestige-gold/30 transition-all">
                                            <h3 className="text-base font-bold text-prestige-gold mb-2">
                                                {faq.question}
                                            </h3>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* OKF Interactive Google Map & Puntos de Interés Layer */}
                        {okfPuntos.length > 0 && (
                            <OKFPointsMap
                                cityName={location?.name || city || ''}
                                points={okfPuntos}
                            />
                        )}



                        {/* Localized Strategy Layer */}
                        {city && location && strategy && (
                            <>
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                                        Particularidades de Guardia en {location.name}
                                    </h2>
                                    <p className="text-slate-355 text-sm md:text-base leading-relaxed font-medium">
                                        {toBlufParagraph(strategy.getLocalPoliceQuirks(), strategy.getLegalAdvice())}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                                        Consejos en los Juzgados de {location.name}
                                    </h2>
                                    <p className="text-slate-355 text-sm md:text-base leading-relaxed font-medium">
                                        {toBlufParagraph(strategy.getCourthouseTips(), `Utilizan habitualmente el alcoholímetro de tipo ${strategy.getEtilometroType()}.`)}
                                    </p>
                                </div>
                            </>
                        )}


                    </div>
                </div>
            </section>

            {/* Local Courthouse Details */}
            {city && location && location.courts && (
                <section className="py-16 bg-slate-900 border-b border-white/5">
                    <div className="container px-4 md:px-16 mx-auto">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-4">
                                Juzgado competente para {location.name}
                            </h3>
                            <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/10 grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                                <div className="space-y-2">
                                    <p className="text-white font-bold uppercase text-xs tracking-wider text-prestige-gold">Órgano Judicial</p>
                                    <p className="font-semibold">{location.courts.name}</p>
                                    <p className="text-xs text-slate-400">Jurisdicción de adscripción y enjuiciamiento preferente.</p>
                                </div>
                                {location.courts.address && (
                                    <div className="space-y-2">
                                        <p className="text-white font-bold uppercase text-xs tracking-wider text-prestige-gold">Dirección Física</p>
                                        <p className="font-semibold">{location.courts.address}</p>
                                        <p className="text-xs text-slate-400">Punto de presentación y asistencia del letrado penalista de guardia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Interactive Municipality Directory & Search Section */}
            <section className="py-20 bg-slate-900 border-b border-white/5">
                <div className="container px-4 md:px-12 mx-auto">
                    <MunicipalitySearch
                        initialService={service}
                        initialMunicipios={OKFService.getCoveredMunicipios(service)}
                        title={`Buscador de Municipios Cubiertos para ${config.hero.specialty}`}
                        subtitle={`Busque su municipio en Cataluña para acceder a asistencia jurídica especializada de urgencia adaptada a los juzgados y comisarías locales.`}
                    />
                </div>
            </section>

            {/* Standard Stats & Trust Signals */}
            <StatsRow config={config} />
            <div className="bg-slate-950/50 py-12">
                <TrustSignals />
            </div>

            {/* STICKY BOTTOM EMERGENCY CTA (MVP TELEPHONE) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl flex justify-center">
                <div className="w-full max-w-xl">
                    <a
                        href="tel:+34605118871"
                        className="py-4 px-6 rounded-2xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-sans font-black text-sm sm:text-base md:text-lg text-center shadow-xl shadow-prestige-gold/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                        aria-label="Llamar a la línea de guardia de urgencia 24 horas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Llamar Abogado de Guardia 24h (+34 605 118 871)
                    </a>
                </div>
            </div>
        </main>
    );
}
