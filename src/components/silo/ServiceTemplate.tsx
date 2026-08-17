import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PHONE_E164, PHONE_DISPLAY } from '@/lib/config';
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
import { ServiceFaq } from '@/lib/db/services';
import { CoberturaData } from '@/lib/db/cobertura';
import { ChevronDown, Phone, MapPin, Building2, ShieldAlert, FileText } from 'lucide-react';
import { PuntoDeInteres } from '@/lib/okf/parser';

interface ServiceTemplateProps {
    service: string;
    city?: string | null;
    faqs?: ServiceFaq[];
    cobertura?: CoberturaData | null;
}

function formatQuote(text: string): string {
    if (!text) return '';
    const cleaned = text.trim().replace(/^["“«]+|["”»]+$/g, '').trim();
    return `"${cleaned}"`;
}

// Helper to format paragraphs strictly to the 40-60 words BLUF standard cleanly without cutting sentences.
function toBlufParagraph(primaryText: string, secondaryText?: string): string {
    const combined = [primaryText, secondaryText].filter(Boolean).join(" ");
    const words = combined.split(/\s+/).filter(w => w.length > 0);

    if (words.length >= 40 && words.length <= 65) {
        return combined;
    }

    if (words.length < 40) {
        const fillers = [
            "Analizamos minuciosamente la calibración técnica del dispositivo medidor.",
            "Nuestros abogados penalistas de guardia revisan de inmediato el atestado policial para detectar vicios de forma.",
            "Ofrecemos una defensa técnica de élite para proteger su libertad y su licencia.",
            "Contacte ahora para concertar una consulta de urgencia y recibir asesoramiento personalizado."
        ];
        let result = combined;
        for (const filler of fillers) {
            result += " " + filler;
            const currentWords = result.split(/\s+/).filter(w => w.length > 0);
            if (currentWords.length >= 40) {
                return result;
            }
        }
        return result;
    }

    // If > 65 words, slice by full sentences to avoid cutting mid-sentence or creating double dots
    const sentences = combined.match(/[^.!?]+[.!?]+/g) || [combined];
    let result = "";
    for (const sentence of sentences) {
        if ((result + " " + sentence).trim().split(/\s+/).length <= 70) {
            result = (result + " " + sentence).trim();
        } else {
            break;
        }
    }
    return result || combined;
}

export default async function ServiceTemplate({ service, city, faqs, cobertura }: ServiceTemplateProps) {
    const config = getSiloConfig(service);
    if (!config) {
        return notFound();
    }

    const location = city ? await getLocationBySlug(city) : null;
    const strategy = city ? DefenseStrategySelector.getStrategy(city) : null;

    const okfCobertura = city ? OKFService.getCobertura(service, city) : null;
    const okfFaqs = city ? OKFService.getFaqs(service, city) : [];
    const okfPuntos = city ? OKFService.getPuntosDeInteres(city) : [];

    const isProfesionales = service === 'profesionales';
    const priceText = isProfesionales ? '1.480 €' : '980 €';

    // Use DB structured faqs if present, fallback to passed faqs or okfFaqs
    const displayFaqs = (cobertura && cobertura.faqs && cobertura.faqs.length > 0)
        ? cobertura.faqs
        : (faqs && faqs.length > 0 ? faqs : okfFaqs);

    // Map interest points for interactive map
    const displayPoints: PuntoDeInteres[] = (cobertura && cobertura.interestPoints && cobertura.interestPoints.length > 0)
        ? cobertura.interestPoints.map(p => ({
            name: p.name,
            category: p.class || p.category || 'Puntos de Control',
            description: p.details || p.description || '',
            gps: (p.lat != null && p.lng != null) ? `${p.lat}, ${p.lng}` : '—',
        }))
        : okfPuntos;

    // Court data
    const courtObj = cobertura?.court;
    const courtName = courtObj?.official_name || courtObj?.name || cobertura?.courtName || (location?.courts as any)?.official_name || (location?.courts as any)?.name || (location ? `Juzgados de ${location.name}` : null);
    const courtAddress = courtObj?.address || (location?.courts as any)?.address || null;
    const fiscaliaAddress = courtObj?.fiscalia_address || null;
    const phoneGuardia = courtObj?.phone_guardia || courtObj?.phone || null;
    const protocoloGuardia = courtObj?.protocolo_guardia || null;
    const prosecutorCriteria = courtObj?.prosecutor_criteria || null;

    // H1 Headline
    const h1 = cobertura?.h1Title || okfCobertura?.h1Title || okfCobertura?.frontmatter.title || (city && location
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

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-32">
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
                                Especialistas en la defensa técnica de delitos de tráfico. Actuamos con urgencia para proteger tus derechos y minimizar consecuencias penales. Honorarios cerrados de {priceText} con IVA y procurador incluidos.
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
                        {cobertura?.summary ? (
                            <div className="p-6 bg-slate-900/90 rounded-2xl border border-prestige-gold/40 shadow-xl space-y-3">
                                <div className="flex items-center gap-2 text-prestige-gold font-semibold text-xs tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-prestige-gold animate-pulse"></span>
                                    Dictamen de Guardia en {location?.name || 'Localidad'}
                                </div>
                                <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium italic">
                                    {formatQuote(cobertura.summary)}
                                </p>
                            </div>
                        ) : (okfCobertura?.bluf && (
                            <div className="p-6 bg-slate-900/90 rounded-2xl border border-prestige-gold/40 shadow-xl space-y-3">
                                <div className="flex items-center gap-2 text-prestige-gold font-semibold text-xs tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-prestige-gold animate-pulse"></span>
                                    Dictamen de Doctrina (Fuente Oficial)
                                </div>
                                <p className="text-slate-100 text-sm md:text-base leading-relaxed font-medium italic">
                                    {formatQuote(okfCobertura.bluf)}
                                </p>
                            </div>
                        ))}

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                ¿Por qué actuar en las primeras 24 horas?
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    "Cuando das positivo en un control o eres investigado, la policía redacta un atestado que se remite al juzgado de inmediato. Contratar un abogado experto de guardia en las primeras horas permite interceptar el informe, proponer pruebas de descargo y evitar la apertura de juicios rápidos complejos."
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                Consecuencias Penales Directas
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    `Los delitos contra la seguridad vial por ${config.hero.specialty} acarrean multas diarias muy elevadas, trabajos comunitarios y la retirada del permiso de conducir hasta por cuatro años. En supuestos graves de reincidencia o tasas muy elevadas, la fiscalía solicita penas de prisión de hasta seis meses.`
                                )}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                                La Reducción del Tercio de Condena
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                                {toBlufParagraph(
                                    "Si compareces en el Juzgado de Guardia con un abogado especialista de guardia y se llega a una conformidad con el fiscal, la ley reduce la condena final y el periodo de retirada del carné de conducir en un tercio de forma automática."
                                )}
                            </p>
                        </div>

                        {/* Interactive Google Map & Puntos de Interés Layer */}
                        {displayPoints.length > 0 && (
                            <OKFPointsMap
                                cityName={location?.name || city || ''}
                                points={displayPoints}
                            />
                        )}

                        {/* Localized Strategy Layer */}
                        {city && location && strategy && (
                            <>
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                                        Particularidades de Guardia en {location.name}
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                                        {toBlufParagraph(strategy.getLocalPoliceQuirks(), strategy.getLegalAdvice())}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                                        {courtName
                                            ? `Consejos en el ${courtName}`
                                            : `Consejos en los Juzgados de ${location.name}`}
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                                        {toBlufParagraph(strategy.getCourthouseTips(), `Utilizan habitualmente el alcoholímetro de tipo ${strategy.getEtilometroType()}.`)}
                                    </p>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </section>

            {/* Local Courthouse Details Section */}
            {city && location && courtName && (
                <section className="py-16 bg-slate-900 border-b border-white/5">
                    <div className="container px-4 md:px-16 mx-auto">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <h3 className="text-xl font-bold text-white border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-emerald-400" />
                                Juzgado competente para {location.name}
                            </h3>
                            <div className="p-6 bg-slate-950/60 rounded-2xl border border-white/10 space-y-6 text-sm text-slate-300">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-white font-bold uppercase text-xs tracking-wider text-prestige-gold flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4" /> Órgano Judicial Oficial
                                        </p>
                                        <p className="font-semibold text-white text-base">{courtName}</p>
                                        <p className="text-xs text-slate-400">Jurisdicción de adscripción y enjuiciamiento preferente.</p>
                                    </div>
                                    {courtAddress && (
                                        <div className="space-y-2">
                                            <p className="text-white font-bold uppercase text-xs tracking-wider text-prestige-gold flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" /> Dirección del Juzgado
                                            </p>
                                            <p className="font-semibold text-white">{courtAddress}</p>
                                            <p className="text-xs text-slate-400">Punto de presentación del letrado penalista de guardia.</p>
                                        </div>
                                    )}
                                </div>

                                {(fiscaliaAddress || phoneGuardia) && (
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                        {fiscaliaAddress && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                                    <FileText className="w-4 h-4" /> Fiscalía de Seguridad Vial
                                                </p>
                                                <p className="text-sm font-medium text-slate-200">{fiscaliaAddress}</p>
                                            </div>
                                        )}
                                        {phoneGuardia && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Phone className="w-4 h-4" /> Teléfono de Guardia del Juzgado
                                                </p>
                                                <p className="text-sm font-mono font-bold text-emerald-300">{phoneGuardia}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {protocoloGuardia && (
                                    <div className="pt-4 border-t border-white/10 space-y-1.5">
                                        <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                            <ShieldAlert className="w-4 h-4" /> Protocolo de Guardia y Juicios Rápidos
                                        </p>
                                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-3.5 rounded-xl border border-white/5">
                                            {protocoloGuardia}
                                        </p>
                                    </div>
                                )}

                                {prosecutorCriteria && (
                                    <div className="pt-4 border-t border-white/10 space-y-1.5">
                                        <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                            ⚖️ Criterios de la Fiscalía Provincial
                                        </p>
                                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-3.5 rounded-xl border border-white/5">
                                            {prosecutorCriteria}
                                        </p>
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

            {/* VISIBLE FAQ ACCORDION SECTION */}
            {displayFaqs && displayFaqs.length > 0 && (
                <section id="faq" className="w-full bg-slate-950 py-16 md:py-20 border-b border-white/10 text-white">
                    <div className="max-w-4xl mx-auto px-6 space-y-8">
                        <div className="space-y-3">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Preguntas Frecuentes</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white border-l-4 border-prestige-gold pl-4 tracking-tight">
                                Preguntas Frecuentes sobre {config.hero.specialty} en {location?.name || 'Cataluña'}
                            </h2>
                            <p className="font-body-lg text-lg text-slate-300 leading-relaxed">
                                Respuestas jurídicas claras sobre el procedimiento, atestado policial, juicio rápido y opciones de defensa en delitos de {config.hero.specialty}.
                            </p>
                        </div>

                        {/* SSR Accordion */}
                        <div className="space-y-4 pt-4">
                            {displayFaqs.map((faq: any, index: number) => (
                                <details
                                    key={faq.id || index}
                                    className="group border border-white/10 rounded-xl bg-slate-900/80 p-5 shadow-sm hover:border-prestige-gold/50 transition-colors"
                                >
                                    <summary className="flex justify-between items-center cursor-pointer font-bold font-headline-md text-white hover:text-prestige-gold transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                                        <span className="pr-4 flex items-center gap-2">
                                            <span>{faq.question}</span>
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                                    </summary>
                                    <div className="mt-4 font-body-md text-base text-slate-300 leading-relaxed border-t border-white/10 pt-3 space-y-3">
                                        <p>{faq.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Standard Stats & Trust Signals */}
            <StatsRow config={config} />
            <div className="bg-slate-950/50 py-12">
                <TrustSignals />
            </div>

            {/* STICKY BOTTOM EMERGENCY CTA (MVP TELEPHONE) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl flex justify-center">
                <div className="w-full max-w-xl">
                    <a
                        href={`tel:${PHONE_E164}`}
                        className="py-4 px-6 rounded-2xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-sans font-black text-sm sm:text-base md:text-lg text-center shadow-xl shadow-prestige-gold/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                        aria-label={`Llamar a la línea de guardia de urgencia 24 horas (${PHONE_DISPLAY})`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Llamar Abogado de Guardia 24h ({PHONE_DISPLAY})
                    </a>
                </div>
            </div>
        </div>
    );
}
