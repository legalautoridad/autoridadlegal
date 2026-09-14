import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDistrictData, getPublishedDistrictSlugs } from '@/lib/db/district-content';
import { Building2, MapPin, Phone, ShieldAlert, FileText, ChevronRight, Scale, Clock, AlertTriangle, PhoneCall } from 'lucide-react';
import { DEFAULT_OG_IMAGE, PHONE_E164, PHONE_DISPLAY } from '@/lib/config';

export const revalidate = 3600; // ISR 1 hour

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return await getPublishedDistrictSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await getDistrictData(slug);

    if (!data || !data.published) {
        return {};
    }

    const title = `${data.court.officialName} | Autoridad Legal`;
    const munNames = data.municipalities.map(m => m.name).join(', ');
    const description = `Información oficial, fiscalía de guardia y asistencia penal de urgencia 24h en el ${data.court.officialName} (${munNames}).`;
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

    // Gate: Unpublished district or invalid slug returns 404
    if (!data || !data.published) {
        return notFound();
    }

    const { court, municipalities, interestPoints, authored } = data;
    const canonicalUrl = `https://www.autoridad.legal/juzgados/${slug}`;
    const munListFormatted = municipalities.map(m => m.name).join(', ');

    // Schema.org Structured Data
    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Inicio',
                        'item': 'https://www.autoridad.legal',
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Juzgados',
                        'item': 'https://www.autoridad.legal/juzgados',
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': court.officialName,
                        'item': canonicalUrl,
                    },
                ],
            },
            {
                '@type': 'LegalService',
                '@id': `${canonicalUrl}#service`,
                'name': `Autoridad Legal - ${court.officialName}`,
                'description': `Defensa penal especializada y guardia 24 horas en el ${court.officialName}.`,
                'url': canonicalUrl,
                'telephone': PHONE_E164,
                'areaServed': municipalities.map(m => ({
                    '@type': 'AdministrativeArea',
                    'name': m.name,
                })),
                'provider': {
                    '@type': 'Organization',
                    '@id': 'https://www.autoridad.legal/#organization',
                },
            },
        ],
    };

    // Group interest points by category
    const pointsByCategory = new Map<string, typeof interestPoints>();
    interestPoints.forEach(pt => {
        const cat = pt.category || 'Puntos de Control y Comisarías';
        if (!pointsByCategory.has(cat)) {
            pointsByCategory.set(cat, []);
        }
        pointsByCategory.get(cat)!.push(pt);
    });

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />

            {/* Breadcrumb Header */}
            <div className="bg-slate-950 border-b border-white/10 py-3 px-4">
                <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-slate-400">
                    <Link href="/" className="hover:text-prestige-gold transition-colors">Inicio</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/juzgados" className="hover:text-prestige-gold transition-colors">Juzgados</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-white font-medium">{court.officialName}</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="pt-10 pb-12 bg-slate-900 border-b border-white/5 relative">
                <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/15 border border-prestige-gold/30 text-xs text-prestige-gold font-bold uppercase tracking-widest">
                        <Scale className="w-4 h-4" /> Órgano Judicial Competente
                    </span>

                    {/* H1 Title: Juzgado de [name] */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                        {court.officialName}
                    </h1>

                    {/* Server-Rendered Subline naming the municipalities this court covers */}
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                        Atiende los municipios de: <strong className="text-white font-bold">{munListFormatted}</strong>
                    </p>

                    {authored.entradilla && (
                        <p className="text-base md:text-lg text-slate-200 leading-relaxed pt-2 border-t border-white/10">
                            {authored.entradilla}
                        </p>
                    )}
                </div>
            </section>

            <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-16">
                {/* POSITION 1: POSITION-ONE "Qué hacer ahora" BLOCK */}
                <section className="p-6 md:p-8 bg-slate-950 rounded-3xl border-2 border-prestige-gold/40 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                        <div className="space-y-1">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-prestige-gold animate-pulse" />
                                Urgencia Penal &bull; Primeros Pasos
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                ¿Qué Hacer Ahora?
                            </h2>
                        </div>
                        <a
                            href={`tel:${PHONE_E164}`}
                            className="px-5 py-3 rounded-xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                        >
                            <PhoneCall className="w-4 h-4" />
                            Llamar Abogado de Guardia ({PHONE_DISPLAY})
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                        {court.phoneGuardia && (
                            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" /> Teléfono de Guardia del Juzgado
                                </p>
                                <p className="text-lg font-mono font-bold text-emerald-300">{court.phoneGuardia}</p>
                            </div>
                        )}

                        {court.protocoloGuardia && (
                            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                                <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                    <ShieldAlert className="w-4 h-4" /> Protocolo de Guardia
                                </p>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                    {court.protocoloGuardia}
                                </p>
                            </div>
                        )}
                    </div>

                    {authored.queHacerAhoraNotes && (
                        <div className="pt-4 border-t border-white/10 text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                            {authored.queHacerAhoraNotes}
                        </div>
                    )}

                    {/* Prominent Link to Acuerdo de Honorarios (Part 3: 1 prominent link only, zero agreement prose copied) */}
                    <div className="pt-4 border-t border-white/10 flex justify-start">
                        <Link
                            href="/acuerdo-honorarios"
                            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-prestige-gold/40 text-prestige-gold font-bold text-sm transition-all shadow-md"
                        >
                            <FileText className="w-4 h-4 text-prestige-gold shrink-0" />
                            <span>Consultar Modelo Oficial de Hoja de Encargo y Honorarios →</span>
                        </Link>
                    </div>
                </section>

                {/* POSITION 2: Municipios que abarca */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                        Municipios que Abarca
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Este juzgado ostenta la competencia judicial exclusiva para los siguientes <strong className="text-white font-semibold">{municipalities.length} municipios activos</strong>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                        {municipalities.map(m => (
                            <div
                                key={m.id}
                                className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex items-center gap-2 text-sm text-slate-200 font-medium"
                            >
                                <MapPin className="w-4 h-4 text-prestige-gold shrink-0" />
                                <span>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* POSITION 3: El juzgado */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-emerald-400" />
                        El Juzgado
                    </h2>

                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-6 text-sm text-slate-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold uppercase text-prestige-gold tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4" /> Órgano Judicial Oficial
                                </p>
                                <p className="font-semibold text-white text-base">{court.officialName}</p>
                            </div>

                            {court.address && (
                                <div className="space-y-1.5">
                                    <p className="text-xs font-bold uppercase text-prestige-gold tracking-wider flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" /> Dirección del Edificio
                                    </p>
                                    <p className="font-semibold text-white">{court.address}</p>
                                </div>
                            )}
                        </div>

                        {court.phone && (
                            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4 text-emerald-400" />
                                <span>Teléfono general de atención: <strong className="text-white font-mono">{court.phone}</strong></span>
                            </div>
                        )}

                        {court.buildingOrganization && (
                            <div className="pt-4 border-t border-white/10 space-y-1.5">
                                <p className="text-xs font-bold uppercase text-prestige-gold tracking-wider">Organización de Sedes y Secciones</p>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-white/5">
                                    {court.buildingOrganization}
                                </p>
                            </div>
                        )}

                        {authored.juzgadoNotes && (
                            <div className="pt-4 border-t border-white/10 space-y-1.5">
                                <p className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Notas Prácticas del Juzgado</p>
                                <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                                    {authored.juzgadoNotes}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* POSITION 4: Fiscalía */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                        Fiscalía
                    </h2>
                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4 text-sm text-slate-300">
                        {court.fiscaliaAddress && (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" /> Dirección de Fiscalía
                                </p>
                                <p className="text-base font-semibold text-white">{court.fiscaliaAddress}</p>
                            </div>
                        )}

                        {authored.fiscaliaNotes && (
                            <div className="pt-3 border-t border-white/10 text-slate-200 leading-relaxed whitespace-pre-line">
                                {authored.fiscaliaNotes}
                            </div>
                        )}
                    </div>
                </section>

                {/* POSITION 5: Juzgado de guardia (Detalles adicionales) */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-emerald-400" />
                        Juzgado de Guardia (Detalles Adicionales)
                    </h2>

                    <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4 text-sm text-slate-300">
                        {court.phoneGuardia && (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" /> Teléfono Directo de Guardia
                                </p>
                                <p className="text-base font-mono font-bold text-emerald-300">{court.phoneGuardia}</p>
                            </div>
                        )}

                        {court.protocoloGuardia && (
                            <div className="space-y-1.5 pt-2">
                                <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                    <ShieldAlert className="w-4 h-4" /> Protocolo Oficial de Guardia
                                </p>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-white/5">
                                    {court.protocoloGuardia}
                                </p>
                            </div>
                        )}

                        {authored.guardiaNotes && (
                            <div className="pt-3 border-t border-white/10 text-slate-200 leading-relaxed whitespace-pre-line">
                                {authored.guardiaNotes}
                            </div>
                        )}
                    </div>
                </section>

                {/* POSITION 6: Criterios del fiscal (Authored content ONLY - prosecutor_criteria is NEVER rendered) */}
                {authored.criteriosFiscalNotes && (
                    <section className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            Criterios de la Fiscalía en este Juzgado
                        </h2>
                        <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                            {authored.criteriosFiscalNotes}
                        </div>
                    </section>
                )}

                {/* POSITION 7: Actuación policial en la zona */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        Actuación Policial y Puntos de Control
                    </h2>

                    {authored.actuacionPolicialNotes && (
                        <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-6">
                            {authored.actuacionPolicialNotes}
                        </div>
                    )}

                    {interestPoints.length > 0 && (
                        <div className="space-y-6">
                            {Array.from(pointsByCategory.entries()).map(([catName, pts]) => (
                                <div key={catName} className="p-6 bg-slate-950/60 rounded-2xl border border-white/10 space-y-3">
                                    <h3 className="text-base font-bold text-prestige-gold uppercase tracking-wider border-b border-white/10 pb-2">
                                        {catName}
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                                        {pts.map(pt => (
                                            <div key={pt.id} className="space-y-1">
                                                <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    {pt.name}
                                                </p>
                                                {pt.details && (
                                                    <p className="text-xs text-slate-400 leading-relaxed pl-5">{pt.details}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* POSITION 8: Experiencia del despacho */}
                {authored.experienciaDespachoNotes && (
                    <section className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            Experiencia del Despacho
                        </h2>
                        <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                            {authored.experienciaDespachoNotes}
                        </div>
                    </section>
                )}

                {/* POSITION 9: Por tipo de delito */}
                <section className="space-y-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        Por Tipo de Delito
                    </h2>

                    <div className="space-y-6">
                        {/* 9.1 Alcoholemia */}
                        <div id="alcoholemia" className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Alcoholemia (art. 379.2 CP)</h3>
                                    <p className="text-xs text-slate-400">Juicios rápidos por tasa superior a 0,60 mg/l o sintomatología al volante.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-prestige-gold">980 €</span>
                                    <p className="text-[10px] text-slate-400">IVA y procurador incluidos</p>
                                </div>
                            </div>
                            {authored.delitosNotes?.alcoholemia && (
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                    {authored.delitosNotes.alcoholemia}
                                </p>
                            )}
                            <Link
                                href="/alcoholemia"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Ver servicio de Alcoholemia <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* 9.2 Drogas */}
                        <div id="drogas" className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Drogas y Estupefacientes (art. 379.2 CP)</h3>
                                    <p className="text-xs text-slate-400">Impugnación de drogatest en saliva y pruebas laboratoriales de contraste.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-prestige-gold">980 €</span>
                                    <p className="text-[10px] text-slate-400">IVA y procurador incluidos</p>
                                </div>
                            </div>
                            {authored.delitosNotes?.drogas && (
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                    {authored.delitosNotes.drogas}
                                </p>
                            )}
                            <Link
                                href="/drogas"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Ver servicio de Drogas <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* 9.3 Velocidad */}
                        <div id="velocidad" className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Exceso de Velocidad (art. 379.1 CP)</h3>
                                    <p className="text-xs text-slate-400">Exceso de +60 km/h en vía urbana o +80 km/h en interurbana.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-prestige-gold">980 €</span>
                                    <p className="text-[10px] text-slate-400">IVA y procurador incluidos</p>
                                </div>
                            </div>
                            {authored.delitosNotes?.velocidad && (
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                    {authored.delitosNotes.velocidad}
                                </p>
                            )}
                            <Link
                                href="/velocidad"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Ver servicio de Velocidad <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* 9.4 Sin Carnet */}
                        <div id="sin-carnet" className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Conducción Sin Permitir / Sin Puntos (art. 384 CP)</h3>
                                    <p className="text-xs text-slate-400">Conducción tras pérdida total de puntos o privación judicial.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-prestige-gold">780 €</span>
                                    <p className="text-[10px] text-slate-400">IVA y procurador incluidos</p>
                                </div>
                            </div>
                            {authored.delitosNotes?.sinCarnet && (
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                    {authored.delitosNotes.sinCarnet}
                                </p>
                            )}
                            <Link
                                href="/sin-carnet"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Ver servicio Sin Carnet <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* 9.5 Profesionales */}
                        <div id="profesionales" className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Conductores Profesionales</h3>
                                    <p className="text-xs text-slate-400">Defensa prioritaria para camioneros, taxistas, repartidores y transportistas (1ª instancia).</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-prestige-gold">1.480 €</span>
                                    <p className="text-[10px] text-slate-400">IVA y procurador incluidos (1ª instancia)</p>
                                </div>
                            </div>
                            {authored.delitosNotes?.profesionales && (
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                    {authored.delitosNotes.profesionales}
                                </p>
                            )}
                            <Link
                                href="/profesionales"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Ver servicio de Profesionales <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* POSITION 10: Vídeo y transcripción */}
                {authored.videoUrl && (
                    <section className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            Vídeo y Transcripción
                        </h2>
                        <div className="p-6 bg-slate-950/80 rounded-2xl border border-white/10 space-y-4">
                            <a
                                href={authored.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 font-medium underline"
                            >
                                Ver vídeo explicativo sobre el {court.officialName}
                            </a>
                            {authored.transcriptText && (
                                <div className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-white/5">
                                    {authored.transcriptText}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* STICKY BOTTOM EMERGENCY CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl flex justify-center">
                <div className="w-full max-w-xl">
                    <a
                        href={`tel:${PHONE_E164}`}
                        className="py-4 px-6 rounded-2xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-sans font-black text-sm sm:text-base md:text-lg text-center shadow-xl shadow-prestige-gold/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                        aria-label={`Llamar a la línea de guardia de urgencia 24 horas (${PHONE_DISPLAY})`}
                    >
                        <Phone className="w-5 h-5 shrink-0" />
                        Llamar Abogado de Guardia 24h ({PHONE_DISPLAY})
                    </a>
                </div>
            </div>
        </div>
    );
}
