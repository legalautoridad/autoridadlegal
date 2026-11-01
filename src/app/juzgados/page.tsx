import { Metadata } from 'next';
import Link from 'next/link';
import { getAllDistrictsIndexData, SearchableMunicipality } from '@/lib/db/district-content';
import {
    CABECERA_TEXTOS,
    PASOS_QUE_HACER,
    AVISO_DETENIDO,
    PASOS_COMO_ES_JUICIO_RAPIDO,
} from '@/lib/juicio-rapido/textos';
import { HubMunicipalitySearch } from '@/components/juicio-rapido/HubMunicipalitySearch';
import { Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { DEFAULT_OG_IMAGE, PHONE_E164, WHATSAPP_URL } from '@/lib/config';

const HUB_TITLE = 'Juicio rápido en Barcelona: qué hacer y qué juzgado te corresponde | Autoridad Legal';
const HUB_DESCRIPTION =
    '¿Te han parado o citado a juicio rápido en la provincia de Barcelona? Qué hacer, busca tu juzgado de guardia (25 partidos, 309 municipios) y llama al 605 118 871.';
const CANONICAL_URL = 'https://www.autoridad.legal/juzgados';

export const metadata: Metadata = {
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    alternates: {
        canonical: CANONICAL_URL,
    },
    openGraph: {
        title: HUB_TITLE,
        description: HUB_DESCRIPTION,
        url: CANONICAL_URL,
        siteName: 'Autoridad Legal',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: HUB_TITLE,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: HUB_TITLE,
        description: HUB_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
};

interface HubPageProps {
    searchParams?: Promise<{ q?: string }>;
}

export default async function JuzgadosIndexPage({ searchParams }: HubPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const initialQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';

    const districts = await getAllDistrictsIndexData();
    const totalActiveMunicipalities = districts.reduce((acc, d) => acc + d.municipalities.length, 0);

    const allMunicipalities: SearchableMunicipality[] = [];
    districts.forEach(d => {
        d.municipalities.forEach(m => {
            allMunicipalities.push({
                id: m.id,
                slug: m.slug,
                name: m.name,
                courtSlug: d.slug,
                partido: d.judicialDistrict,
                oficial: d.officialName,
                address: d.address,
            });
        });
    });
    allMunicipalities.sort((a, b) => a.name.localeCompare(b.name, 'ca'));

    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${CANONICAL_URL}#webpage`,
                url: CANONICAL_URL,
                name: HUB_TITLE,
                description: HUB_DESCRIPTION,
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
                    '@id': `${CANONICAL_URL}#breadcrumb`,
                },
                mainEntity: {
                    '@id': `${CANONICAL_URL}#partidos`,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${CANONICAL_URL}#breadcrumb`,
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
                        item: CANONICAL_URL,
                    },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${CANONICAL_URL}#partidos`,
                name: 'Partidos judiciales de la provincia de Barcelona',
                numberOfItems: districts.length,
                itemListElement: districts.map((d, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: `Juicio rápido en ${d.judicialDistrict} (${d.officialName})`,
                    url: `https://www.autoridad.legal/juzgados/${d.slug}`,
                })),
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 sm:pb-0 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />

            {/* CABECERA (fondo oscuro, igual que 1.1 pero en general) */}
            <section className="bg-slate-900 text-white pt-6 pb-12 md:py-16 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
                    {/* Migas */}
                    <nav aria-label="Ruta de navegación" className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
                        <Link href="/" className="underline hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <span aria-hidden="true">›</span>
                        <span className="text-slate-200 font-medium">Juicio rápido</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-7 space-y-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#ffe088] leading-relaxed">
                                Provincia de Barcelona · {districts.length} partidos judiciales · {totalActiveMunicipalities} municipios
                            </p>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                                Juicio rápido en la provincia de Barcelona: qué hacer y dónde te juzgan
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                                {CABECERA_TEXTOS.entradillaHub}
                            </p>

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

                        {/* Tarjeta blanca "Qué hacer, paso a paso" */}
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
                                                            href="#partidos"
                                                            className="underline font-semibold text-slate-900 hover:text-slate-700"
                                                        >
                                                            juzgado de guardia que te corresponda
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
                {/* BUSCADOR DESTACADO + 25 PARTIDOS JUDICIALES */}
                <section id="partidos" className="bg-white text-slate-900 border-b border-slate-200 py-12 md:py-16 scroll-mt-24">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Busca tu juzgado de guardia por municipio
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                                Escribe el municipio donde te pararon para ver a qué partido judicial pertenece y cuál es tu juzgado de guardia.
                            </p>
                            <HubMunicipalitySearch
                                allMunicipalities={allMunicipalities}
                                initialQuery={initialQuery}
                            />
                        </div>

                        {/* 25 partidos como <a href> en el HTML servido */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Los 25 partidos judiciales de la provincia de Barcelona
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                Selecciona directamente tu partido judicial para consultar qué hacer y los datos del juzgado de guardia:
                            </p>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                                {districts.map(dist => (
                                    <li key={dist.slug}>
                                        <Link
                                            href={`/juzgados/${dist.slug}`}
                                            className="min-h-[48px] p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-colors flex items-center justify-between gap-3"
                                        >
                                            <span className="font-bold text-slate-900 text-sm sm:text-base">
                                                {dist.judicialDistrict}{' '}
                                                <span className="font-normal text-slate-500 text-xs sm:text-sm">
                                                    ({dist.municipalities.length}{' '}
                                                    {dist.municipalities.length === 1 ? 'municipio' : 'municipios'})
                                                </span>
                                            </span>
                                            <span aria-hidden="true" className="text-slate-900 font-bold text-sm">
                                                →
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

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

                {/* TABLA SSR DE LOS 309 MUNICIPIOS -> PARTIDO */}
                <section className="bg-white text-slate-900 border-b border-slate-200 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                Los {allMunicipalities.length} municipios de la provincia de Barcelona y su partido judicial
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600">
                                Listado alfabético completo con enlace directo al juzgado de guardia correspondiente:
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                                        <th className="py-3 px-4 font-bold">Municipio</th>
                                        <th className="py-3 px-4 font-bold">Partido judicial</th>
                                        <th className="py-3 px-4 font-bold">Juzgado de guardia</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {allMunicipalities.map(item => (
                                        <tr key={item.slug} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                                                <Link
                                                    href={`/juzgados/${item.courtSlug}`}
                                                    className="hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="py-2.5 px-4 text-slate-700">
                                                <Link
                                                    href={`/juzgados/${item.courtSlug}`}
                                                    className="underline font-medium text-slate-900 hover:text-slate-700"
                                                >
                                                    {item.partido}
                                                </Link>
                                            </td>
                                            <td className="py-2.5 px-4 text-slate-600">
                                                {item.oficial}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 1.8 CTA final (fondo oscuro) */}
                <section className="bg-slate-900 text-white py-12 md:py-14">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                ¿Te han citado a juicio rápido en la provincia de Barcelona?
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

            {/* 1.9 Móvil (≤ 640 px): Barra fija inferior */}
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
