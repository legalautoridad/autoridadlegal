import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDistrictData, getPublishedDistrictSlugs } from '@/lib/db/district-content';
import { getFormattedServicePrice, PRICING_ADDONS, PRICING_SUMMARY } from '@/lib/config/pricing';
import {
    CABECERA_TEXTOS,
    PASOS_QUE_HACER,
    AVISO_DETENIDO,
    PASOS_COMO_ES_JUICIO_RAPIDO,
    DELITOS_TARJETAS,
    joinListSpanish,
} from '@/lib/juicio-rapido/textos';
import { DistrictMunicipalitySection } from '@/components/juicio-rapido/DistrictMunicipalitySection';
import { Phone, MessageCircle, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { DEFAULT_OG_IMAGE, PHONE_E164, WHATSAPP_URL } from '@/lib/config';

export const revalidate = 3600; // ISR 1 hour

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return await getPublishedDistrictSlugs();
}

function buildMetaTitle(partido: string): string {
    const fullTitle = `Juicio rápido en ${partido}: qué hacer y juzgado de guardia | Autoridad Legal`;
    if (fullTitle.length > 70) {
        return `Juicio rápido en ${partido}: qué hacer y juzgado de guardia`;
    }
    return fullTitle;
}

function buildMetaDescription(partido: string, n: number): string {
    const munLabel = n === 1 ? '1 municipio' : `${n} municipios`;
    const fullDesc = `¿Te han parado o citado a juicio rápido en ${partido}? Qué hacer, tu juzgado de guardia (${munLabel}) y abogado penalista 24 h. Llama al 605 118 871.`;
    if (fullDesc.length <= 160) {
        return fullDesc;
    }
    return `¿Te han parado o citado a juicio rápido en ${partido}? Qué hacer, juzgado de guardia (${munLabel}) y abogado 24 h. Llama al 605 118 871.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await getDistrictData(slug);

    if (!data || !data.published) {
        return {};
    }

    const partido = data.court.judicialDistrict;
    const n = data.municipalities.length;
    const title = buildMetaTitle(partido);
    const description = buildMetaDescription(partido, n);
    const canonicalUrl = `https://www.autoridad.legal/juzgados/${slug}`;

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
            type: 'website',
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [DEFAULT_OG_IMAGE],
        },
    };
}

export default async function JuzgadoDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getDistrictData(slug);

    if (!data || !data.published) {
        return notFound();
    }

    const {
        court,
        municipalities,
        topMunicipalities,
        allMunicipalities,
        policeBodies,
        publicTransport,
        reviewedCourtFaqs,
    } = data;

    const partido = court.judicialDistrict;
    const oficial = court.officialName;
    const n = municipalities.length;
    const canonicalUrl = `https://www.autoridad.legal/juzgados/${slug}`;
    const pageTitle = buildMetaTitle(partido);
    const pageDescription = buildMetaDescription(partido, n);

    // 1.1 Antetítulo
    const antetitulo =
        n <= 4
            ? `Partido judicial de ${partido} · ${joinListSpanish(
                  municipalities.map(m => m.name),
                  'y'
              )}`
            : `Partido judicial de ${partido} · ${n} municipios`;

    // 1.4 Línea de recargos desde la fuente de precios
    const recargosLine = [
        `${PRICING_ADDONS.reincidencia.shortLabel} ${PRICING_ADDONS.reincidencia.displayPrice}`,
        `${PRICING_ADDONS.noConformidad.shortLabel} ${PRICING_ADDONS.noConformidad.displayPrice} (no aplica a profesionales)`,
        `${PRICING_ADDONS.riesgoPrision.shortLabel} ${PRICING_ADDONS.riesgoPrision.displayPrice}`,
        `${PRICING_ADDONS.asistenciaDetenido.shortLabel} ${PRICING_ADDONS.asistenciaDetenido.displayPrice}`,
    ].join(', ');

    // 1.5 Tarjetas prácticas (cada una solo si hay dato)
    const practicalCards: { title: string; content: string }[] = [];
    if (policeBodies.length > 0) {
        practicalCards.push({
            title: 'Quién interviene',
            content: `${joinListSpanish(policeBodies, 'y')}.`,
        });
    }
    if (court.practicalReviewed && court.atestadoInfo) {
        practicalCards.push({
            title: 'Dónde se tramita el atestado',
            content: court.atestadoInfo,
        });
    }
    if (court.practicalReviewed && court.hospitalContraste) {
        practicalCards.push({
            title: 'Prueba de contraste en sangre',
            content: court.hospitalContraste,
        });
    }
    if (court.practicalReviewed && court.depositoVehiculos) {
        practicalCards.push({
            title: 'Si te inmovilizan el vehículo',
            content: court.depositoVehiculos,
        });
    }

    // 1.7 FAQs (en orden estricto: 1. municipio si n > 1, 2. court_faqs reviewed, 3. precio desde fuente)
    const faqs: { question: string; answer: string }[] = [];

    if (n > 1) {
        const otroMunicipio =
            topMunicipalities.find(m => m.name.toLowerCase() !== partido.toLowerCase()) ||
            municipalities.find(m => m.name.toLowerCase() !== partido.toLowerCase()) ||
            municipalities[0];

        if (otroMunicipio) {
            faqs.push({
                question: `Me han parado en ${otroMunicipio.name}, ¿dónde es el juicio rápido?`,
                answer: `En el juzgado de guardia de ${partido} (${oficial}): ${otroMunicipio.name} pertenece al partido judicial de ${partido}.`,
            });
        }
    }

    reviewedCourtFaqs.forEach(row => {
        faqs.push({
            question: row.question.trim(),
            answer: row.answer.trim(),
        });
    });

    faqs.push({
        question: `¿Cuánto cuesta un abogado para el juicio rápido en ${partido}?`,
        answer: `${PRICING_SUMMARY.basePriceDisplay} (IVA incluido) para el supuesto base en alcoholemia, drogas, velocidad y sin carnet; ${PRICING_SUMMARY.proPriceDisplay} para conductores profesionales. Los recargos están tasados y se comunican por escrito y por adelantado.`,
    });

    // PASO 2: JSON-LD en un único @graph (sin crear Organization ni Person nuevos)
    const courthouseNode: Record<string, any> = {
        '@type': 'Courthouse',
        '@id': `${canonicalUrl}#courthouse`,
        name: oficial,
    };
    if (court.address) {
        courthouseNode.address = {
            '@type': 'PostalAddress',
            streetAddress: court.address,
            addressLocality: partido,
            addressRegion: 'Barcelona',
            addressCountry: 'ES',
        };
    }
    if (court.gpsCoords) {
        courthouseNode.geo = {
            '@type': 'GeoCoordinates',
            latitude: court.gpsCoords.lat,
            longitude: court.gpsCoords.lng,
        };
    }

    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${canonicalUrl}#webpage`,
                url: canonicalUrl,
                name: pageTitle,
                description: pageDescription,
                inLanguage: 'es',
                isPartOf: {
                    '@id': 'https://www.autoridad.legal/#website',
                },
                provider: {
                    '@id': 'https://www.autoridad.legal/#organization',
                },
                publisher: {
                    '@id': 'https://www.autoridad.legal/#organization',
                },
                breadcrumb: {
                    '@id': `${canonicalUrl}#breadcrumb`,
                },
                about: courthouseNode,
                areaServed: municipalities.map(m => ({
                    '@type': 'City',
                    name: m.name,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Inicio',
                        item: 'https://www.autoridad.legal',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Juicio rápido',
                        item: 'https://www.autoridad.legal/juzgados',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: partido,
                        item: canonicalUrl,
                    },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                mainEntity: faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            },
        ],
    };

    const googleMapsQuery = encodeURIComponent(
        court.address ? `${oficial}, ${court.address}` : oficial
    );
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;
    const mapEmbedUrl = court.gpsCoords
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${court.gpsCoords.lng - 0.006}%2C${court.gpsCoords.lat - 0.004}%2C${court.gpsCoords.lng + 0.006}%2C${court.gpsCoords.lat + 0.004}&layer=mapnik&marker=${court.gpsCoords.lat}%2C${court.gpsCoords.lng}`
        : null;

    const formattedCourtPhone = court.phone ? court.phone.replace(/^\+34\s*/, '').trim() : null;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 sm:pb-0 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />

            {/* 1.1 CABECERA (fondo oscuro, primera pantalla) */}
            <section className="bg-slate-900 text-white pt-6 pb-12 md:py-16 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
                    {/* Migas */}
                    <nav aria-label="Ruta de navegación" className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
                        <Link href="/" className="underline hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <span aria-hidden="true">›</span>
                        <Link href="/juzgados" className="underline hover:text-white transition-colors">
                            Juicio rápido
                        </Link>
                        <span aria-hidden="true">›</span>
                        <span className="text-slate-200 font-medium">{partido}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* Left Column: Antetítulo, H1, Entradilla, CTAs, Firma */}
                        <div className="lg:col-span-7 space-y-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#ffe088] leading-relaxed">
                                {antetitulo}
                            </p>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                                Juicio rápido en {partido}: qué hacer si te han parado o citado
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                                {CABECERA_TEXTOS.entradillaPartido(partido)}
                            </p>

                            {/* Botones CTA */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                                <a
                                    href={`tel:${PHONE_E164}`}
                                    className="min-h-[48px] px-6 py-3.5 rounded-xl bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg transition-colors"
                                >
                                    <Phone className="w-4 h-4 shrink-0" />
                                    <span>{CABECERA_TEXTOS.ctaPrimaryLabel}</span>
                                </a>

                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="min-h-[48px] px-5 py-3.5 rounded-xl border border-slate-600 hover:border-slate-400 text-white font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 shrink-0" />
                                    <span>{CABECERA_TEXTOS.ctaSecondaryLabel}</span>
                                </a>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed">
                                {CABECERA_TEXTOS.lawyerLine}
                            </p>
                        </div>

                        {/* Right Column: Tarjeta blanca "Qué hacer, paso a paso" */}
                        <div className="lg:col-span-5 w-full">
                            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    {CABECERA_TEXTOS.stepsCardTitle}
                                </h2>

                                <ol className="space-y-4">
                                    {PASOS_QUE_HACER.map(step => (
                                        <li key={step.number} className="flex items-start gap-3.5">
                                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                {step.number}
                                            </span>
                                            <div className="text-xs sm:text-sm leading-relaxed text-slate-600">
                                                <strong className="font-bold text-slate-900 block">
                                                    {step.title}
                                                </strong>
                                                {step.hasCourtAnchor ? (
                                                    <span>
                                                        En el{' '}
                                                        <a
                                                            href="#juzgado"
                                                            className="underline font-semibold text-slate-900 hover:text-slate-700"
                                                        >
                                                            juzgado de guardia de {partido}
                                                        </a>
                                                        , {step.description}
                                                    </span>
                                                ) : (
                                                    <span>{step.description}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>

                                {/* Aviso de detenido dentro de la tarjeta */}
                                <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-4 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-2.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                    <p>
                                        <strong className="font-bold">{AVISO_DETENIDO.boldLead}</strong>{' '}
                                        {AVISO_DETENIDO.beforePhone}
                                        <a
                                            href={AVISO_DETENIDO.phoneHref}
                                            className="font-bold underline text-amber-950 hover:text-amber-800"
                                        >
                                            {AVISO_DETENIDO.phoneDisplay}
                                        </a>
                                        {AVISO_DETENIDO.afterPhone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main>
                {/* 1.2 "¿Es este tu juzgado de guardia?" (fondo blanco) */}
                <DistrictMunicipalitySection
                    partido={partido}
                    oficial={oficial}
                    currentCourtSlug={slug}
                    municipalities={municipalities}
                    topMunicipalities={topMunicipalities}
                    allMunicipalities={allMunicipalities}
                />

                {/* 1.3 "Cómo es un juicio rápido" (fondo slate-50) */}
                <section className="bg-slate-50 text-slate-900 border-b border-slate-200 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
                        <div className="space-y-2 max-w-3xl">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Cómo es un juicio rápido
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                El procedimiento para los delitos contra la seguridad vial cuando la policía identifica al conductor en el momento.
                            </p>
                        </div>

                        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {PASOS_COMO_ES_JUICIO_RAPIDO.map(paso => (
                                <li
                                    key={paso.number}
                                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs"
                                >
                                    <span className="text-xs font-bold text-slate-400 block">
                                        {paso.number}
                                    </span>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        {paso.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {paso.description}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* 1.4 "Tu caso en {partido}, según el delito" (fondo blanco) */}
                <section className="bg-white text-slate-900 border-b border-slate-200 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
                        <div className="space-y-2 max-w-3xl">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Tu caso en {partido}, según el delito
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                Precio cerrado para el supuesto base (juicio rápido con conformidad), IVA incluido. Los casos más complejos llevan recargos tasados, comunicados por escrito y por adelantado.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {DELITOS_TARJETAS.map(delito => (
                                <div
                                    key={delito.slug}
                                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <h3 className="text-base font-extrabold text-slate-900">
                                            {delito.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                                            {delito.summary}
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        <p className="text-xl font-black text-slate-900">
                                            {getFormattedServicePrice(delito.slug)}
                                        </p>
                                        <Link
                                            href={delito.href}
                                            className="inline-block text-xs sm:text-sm font-bold text-slate-900 underline hover:text-slate-700 py-1"
                                        >
                                            {delito.linkLabelPrefix} en {partido} →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                            Recargos: {recargosLine}.{' '}
                            <Link
                                href="/honorarios"
                                className="font-bold text-slate-900 underline hover:text-slate-700"
                            >
                                Ver honorarios completos
                            </Link>
                        </p>
                    </div>
                </section>

                {/* 1.5 "Si te han parado en el partido judicial de {partido}" (fondo slate-50) */}
                {practicalCards.length > 0 && (
                    <section className="bg-slate-50 text-slate-900 border-b border-slate-200 py-12 md:py-16">
                        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Si te han parado en el partido judicial de {partido}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {practicalCards.map(card => (
                                    <div
                                        key={card.title}
                                        className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs"
                                    >
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {card.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 1.6 "El juzgado de guardia de {partido}" (id="juzgado", fondo blanco) */}
                <section
                    id="juzgado"
                    className="bg-white text-slate-900 border-b border-slate-200 py-12 md:py-16 scroll-mt-24"
                >
                    <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-6 space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                El juzgado de guardia de {partido}
                            </h2>

                            <dl className="space-y-4 text-sm sm:text-base">
                                <div className="space-y-0.5">
                                    <dt className="font-bold text-slate-900">Nombre oficial</dt>
                                    <dd className="text-slate-600">{oficial} — servicio de guardia</dd>
                                </div>

                                {court.address && (
                                    <div className="space-y-0.5">
                                        <dt className="font-bold text-slate-900">Dirección</dt>
                                        <dd className="text-slate-600">{court.address}</dd>
                                    </div>
                                )}

                                {publicTransport.length > 0 && (
                                    <div className="space-y-0.5">
                                        <dt className="font-bold text-slate-900">Cómo llegar</dt>
                                        <dd className="text-slate-600">{publicTransport.join(' · ')}</dd>
                                    </div>
                                )}

                                {court.fiscaliaAddress && (
                                    <div className="space-y-0.5">
                                        <dt className="font-bold text-slate-900">Fiscalía</dt>
                                        <dd className="text-slate-600">{court.fiscaliaAddress}</dd>
                                    </div>
                                )}

                                {formattedCourtPhone && (
                                    <div className="space-y-0.5">
                                        <dt className="font-bold text-slate-900">Teléfono del juzgado</dt>
                                        <dd className="text-slate-600">
                                            {formattedCourtPhone} · solo para gestiones con el juzgado
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="lg:col-span-6 w-full space-y-3">
                            {mapEmbedUrl ? (
                                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                                    <iframe
                                        title={`Mapa del ${oficial}`}
                                        src={mapEmbedUrl}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-56 rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center p-6 text-center">
                                    <p className="text-sm text-slate-600">
                                        {oficial}
                                        {court.address ? ` — ${court.address}` : ''}
                                    </p>
                                </div>
                            )}
                            <div>
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 underline hover:text-slate-700 py-1"
                                >
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span>Abrir ubicación en Google Maps</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 1.7 "Preguntas frecuentes sobre el juicio rápido en {partido}" (fondo slate-50) */}
                <section className="bg-slate-50 text-slate-900 border-b border-slate-200 py-12 md:py-16">
                    <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            Preguntas frecuentes sobre el juicio rápido en {partido}
                        </h2>

                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <details
                                    key={faq.question}
                                    open={idx === 0}
                                    className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
                                >
                                    <summary className="font-bold text-slate-900 text-sm sm:text-base cursor-pointer list-none flex items-center justify-between gap-3">
                                        <span>{faq.question}</span>
                                        <span
                                            aria-hidden="true"
                                            className="text-slate-400 text-xs transition-transform group-open:rotate-180 shrink-0"
                                        >
                                            ▼
                                        </span>
                                    </summary>
                                    <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 1.8 CTA final (fondo oscuro) */}
                <section className="bg-slate-900 text-white py-12 md:py-14">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                ¿Te han citado a juicio rápido en {partido}?
                            </h2>
                            <p className="text-sm sm:text-base text-slate-300">
                                Llámanos ahora y preparamos tu defensa antes de la fecha.
                            </p>
                        </div>

                        <a
                            href={`tel:${PHONE_E164}`}
                            className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm sm:text-base text-center inline-flex items-center justify-center shrink-0 transition-colors"
                        >
                            Llamar al 605 118 871
                        </a>
                    </div>
                </section>
            </main>

            {/* 1.9 Móvil (≤ 640 px): Barra fija inferior con dos botones: Llamar y WhatsApp (≥ 48 px de alto) */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-3 grid grid-cols-2 gap-3 shadow-2xl">
                <a
                    href={`tel:${PHONE_E164}`}
                    className="min-h-[48px] rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Llamar</span>
                </a>
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] rounded-xl bg-[#ffe088] text-slate-900 font-bold text-sm flex items-center justify-center gap-2"
                >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>WhatsApp</span>
                </a>
            </div>
        </div>
    );
}
