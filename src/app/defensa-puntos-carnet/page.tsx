import { Metadata } from 'next';
import Link from 'next/link';
import { PHONE_CALL_E164, PHONE_CALL_DISPLAY, WHATSAPP_URL, WHATSAPP_DISPLAY } from '@/lib/contact';
import { DEFENSE_POINTS_PRICING } from '@/lib/config/pricing';
import { WIKIDATA_AREAS, DEFENSE_POINTS_KNOWS_ABOUT } from '@/lib/seo/wikidata';
import { getServiceBySlugFromDb, getServiceFaqs } from '@/lib/db/services';
import { ReviewedBy } from '@/components/legal/ReviewedBy';
import { PUNTOS_CLUSTERS, ALL_PUNTOS_FAQS } from '@/lib/data/defensa-puntos-data';
import {
    ShieldCheck,
    CheckCircle2,
    FileText,
    Phone,
    MessageCircle,
    ArrowRight,
    Scale,
    AlertCircle,
    Clock,
    Building2,
    Award,
    ChevronDown,
} from 'lucide-react';

export const revalidate = 3600;

const CANONICAL_URL = 'https://www.autoridad.legal/defensa-puntos-carnet';

export const metadata: Metadata = {
    title: 'Recurso de multas y puntos del carnet | Autoridad Legal',
    description:
        'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.',
    alternates: {
        canonical: CANONICAL_URL,
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'Recurso de multas y puntos del carnet | Autoridad Legal',
        description:
            'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.',
        url: CANONICAL_URL,
        siteName: 'Autoridad Legal',
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Recurso de multas y puntos del carnet | Autoridad Legal',
        description:
            'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.',
    },
};

export default async function DefensaPuntosCarnetPage() {
    const dbService = await getServiceBySlugFromDb('defensa-puntos-carnet');
    const dbFaqs = await getServiceFaqs('defensa-puntos-carnet');

    // Use DB FAQs if available, otherwise fallback to canonical data
    const faqsSource = dbFaqs && dbFaqs.length > 0 ? dbFaqs : ALL_PUNTOS_FAQS;

    // Structured JSON-LD Graph (Module 5)
    const graphNodes: any[] = [
        {
            '@type': 'LegalService',
            '@id': `${CANONICAL_URL}#service`,
            'name': 'Defensa técnica de multas de tráfico y protección del carnet por puntos',
            'serviceType': 'Defensa administrativa de multas de tráfico y puntos del carnet',
            'description':
                'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.',
            'url': CANONICAL_URL,
            'provider': {
                '@id': 'https://www.autoridad.legal/#organization',
            },
            'areaServed': [
                WIKIDATA_AREAS.espana,
                WIKIDATA_AREAS.cataluna,
                WIKIDATA_AREAS.paisVasco,
                WIKIDATA_AREAS.navarra,
            ],
            'knowsAbout': DEFENSE_POINTS_KNOWS_ABOUT,
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                '@id': `${CANONICAL_URL}#offers`,
                'name': 'Tarifas del servicio de defensa de multas y puntos',
                'itemListElement': [
                    {
                        '@type': 'Offer',
                        '@id': `${CANONICAL_URL}#tarifa-base`,
                        'name': DEFENSE_POINTS_PRICING.baseConcept,
                        'url': CANONICAL_URL,
                        'price': DEFENSE_POINTS_PRICING.basePriceNumber,
                        'priceCurrency': 'EUR',
                        'availability': 'https://schema.org/InStock',
                        'priceSpecification': {
                            '@type': 'PriceSpecification',
                            'price': DEFENSE_POINTS_PRICING.basePriceFormatted,
                            'priceCurrency': 'EUR',
                            'valueAddedTaxIncluded': false,
                        },
                        'description': DEFENSE_POINTS_PRICING.baseDescription,
                    },
                    {
                        '@type': 'Offer',
                        '@id': `${CANONICAL_URL}#bono-exito`,
                        'name': DEFENSE_POINTS_PRICING.successBonusConcept,
                        'url': CANONICAL_URL,
                        'price': DEFENSE_POINTS_PRICING.successBonusNumber,
                        'priceCurrency': 'EUR',
                        'availability': 'https://schema.org/InStock',
                        'priceSpecification': {
                            '@type': 'PriceSpecification',
                            'price': DEFENSE_POINTS_PRICING.successBonusFormatted,
                            'priceCurrency': 'EUR',
                            'valueAddedTaxIncluded': false,
                        },
                        'description': DEFENSE_POINTS_PRICING.successBonusDescription,
                    },
                ],
            },
        },
        {
            '@type': 'BreadcrumbList',
            '@id': `${CANONICAL_URL}#breadcrumb`,
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': 1,
                    'name': 'Inicio',
                    'item': 'https://www.autoridad.legal/',
                },
                {
                    '@type': 'ListItem',
                    'position': 2,
                    'name': 'Recurso de multas y puntos del carnet',
                    'item': CANONICAL_URL,
                },
            ],
        },
        {
            '@type': 'FAQPage',
            '@id': `${CANONICAL_URL}#faqs`,
            'mainEntity': faqsSource.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer,
                },
            })),
        },
    ];

    if (dbService?.last_reviewed) {
        graphNodes.push({
            '@type': 'WebPage',
            '@id': `${CANONICAL_URL}#webpage`,
            'url': CANONICAL_URL,
            'name': 'Recurso de multas y puntos del carnet | Autoridad Legal',
            'description':
                'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.',
            'dateModified': dbService.last_reviewed,
            'lastReviewed': dbService.last_reviewed,
            'reviewedBy': {
                '@id': 'https://www.gimenezolavarriaga.abogado/#person',
            },
            'isPartOf': {
                '@id': 'https://www.autoridad.legal/#website',
            },
            'publisher': {
                '@id': 'https://www.autoridad.legal/#organization',
            },
        });
    }

    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                {/* 1. HERO SECTION */}
                <header className="relative bg-gradient-to-b from-trust-navy via-slate-900 to-slate-950 border-b border-white/10 pt-16 pb-20 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 space-y-6">
                        {/* Breadcrumbs */}
                        <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-prestige-gold transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-prestige-gold">Recurso de multas y puntos del carnet</span>
                        </nav>

                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/15 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-prestige-gold" />
                            Defensa Técnica Administrativa • Ámbito Nacional Telemático
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
                            Defensa Técnica de Multas de Tráfico y Protección del Carnet por Puntos
                        </h1>

                        <p className="text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed font-medium">
                            Dirección letrada telemática ante la Dirección General de Tráfico (DGT), Servei Català de Trànsit, Trafikoa y Ayuntamientos de toda España. Oposición técnica formal frente a sanciones graves y muy graves para suspender la ejecutividad registral de los puntos y salvaguardar la vigencia legal del permiso de conducir sin desplazarte.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                            <a
                                href={`tel:${PHONE_CALL_E164}`}
                                className="min-h-[48px] px-6 py-3.5 rounded-xl bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg transition-colors"
                            >
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>Llamar al abogado de guardia</span>
                            </a>

                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[48px] px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#34e275] active:bg-[#1ebe5d] text-[#052e16] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0 text-[#052e16]" />
                                <span>Escribir a abogado por WhatsApp</span>
                            </a>
                        </div>

                        {dbService?.last_reviewed && (
                            <div className="pt-2">
                                <ReviewedBy date={dbService.last_reviewed} />
                            </div>
                        )}
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-20">
                    {/* RESUMEN ATÓMICO / BLUF */}
                    <section className="bg-slate-900/80 rounded-2xl border border-prestige-gold/30 p-8 shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-prestige-gold shrink-0" />
                            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                Claves de la Defensa Técnica en Vía Administrativa
                            </h2>
                        </div>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            La interposición en plazo de pliegos de alegaciones, solicitudes de prueba metrológica y recursos ordinarios suspende la ejecutividad registral de la detracción de puntos al impedir la firmeza del acto sancionador. Esta oposición formal permite agotar de forma reglada los tiempos del procedimiento para consolidar el plazo de dos años de restablecimiento automático a 12 puntos previsto en el <strong>artículo 65.1 de la Ley de Tráfico</strong> o provocar la caducidad del expediente sancionador, preservando la vigencia jurídica de la autorización para conducir.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs md:text-sm text-slate-300">
                            <li className="flex items-start gap-2 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-prestige-gold shrink-0 mt-0.5" />
                                <span><strong>Representación telemática en toda España:</strong> comparecencia oficial ante DGT, SCT, Trafikoa, Navarra y Ayuntamientos.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-prestige-gold shrink-0 mt-0.5" />
                                <span><strong>Suspensión registral preventiva:</strong> retención cautelar de los puntos mientras el expediente se encuentre en trámite.</span>
                            </li>
                            <li className="flex items-start gap-2 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-prestige-gold shrink-0 mt-0.5" />
                                <span><strong>Transparencia en hoja de encargo:</strong> honorarios técnicos tasados por escrito antes de iniciar actuaciones.</span>
                            </li>
                        </ul>
                    </section>

                    {/* SECCIÓN 2: TABLA 1 — EL DILEMA DEL PRONTO PAGO */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Incompatibilidad con la Vigencia</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                El Dilema del Conductor sin Puntos: Pronto Pago vs. Oposición Técnica
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                El abono voluntario con reducción del 50% produce la terminación inmediata del procedimiento sancionador y la firmeza del acto desde el mismo día del pago (artículo 94 de la Ley sobre Tráfico). Si los puntos detraídos superan el saldo disponible, pagar la multa precipita la apertura del expediente de pérdida de vigencia.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">Comparativa entre pronto pago y oposición técnica letrada</caption>
                                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="py-4 px-6 font-semibold">Criterio Evaluado</th>
                                        <th scope="col" className="py-4 px-6 font-semibold text-rose-300">Opción A: Pago con Reducción (50%)</th>
                                        <th scope="col" className="py-4 px-6 font-semibold text-prestige-gold">Opción B: Oposición Técnica con Autoridad Legal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Naturaleza del Trámite</th>
                                        <td className="py-4 px-6 text-slate-300">Abono bonificado voluntario.</td>
                                        <td className="py-4 px-6 text-slate-200 font-semibold">Pliego de alegaciones y proposición de prueba formal.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Derecho de Defensa</th>
                                        <td className="py-4 px-6 text-rose-300">Renuncia expresa e irrevocable a alegar (art. 94 LTSV).</td>
                                        <td className="py-4 px-6 text-emerald-400">Ejercicio pleno del derecho constitucional de contradicción.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Firmeza Administrativa</th>
                                        <td className="py-4 px-6 text-rose-300">Automática e inmediata el día del cobro.</td>
                                        <td className="py-4 px-6 text-slate-200">Suspendida cautelarmente durante toda la instrucción.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Ejecución Registral de Puntos</th>
                                        <td className="py-4 px-6 text-rose-300">Detracción instantánea en el censo central de la DGT.</td>
                                        <td className="py-4 px-6 text-slate-200">Puntos retenidos preventivamente en el saldo del titular.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Eficacia del Carnet de Conducir</th>
                                        <td className="py-4 px-6 text-rose-300">Saldo liquidado a 0; apertura de pérdida de vigencia.</td>
                                        <td className="py-4 px-6 text-emerald-400 font-bold">Carnet plenamente operativo y legal para circular.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold">Impacto Temporal Inmediato</th>
                                        <td className="py-4 px-6 text-rose-300">No podrá obtener un nuevo permiso durante 6 meses (3 meses para conductores profesionales).</td>
                                        <td className="py-4 px-6 text-prestige-gold font-bold">Ganancia legítima de 4 a 8 meses de tiempo procedimental.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-300 space-y-2">
                            <h3 className="font-bold text-white text-sm">Consecuencias procesales del artículo 94 de la Ley sobre Tráfico</h3>
                            <p>1. <strong>Renuncia a la fase contradictoria:</strong> imposibilidad legal de proponer pruebas periciales sobre cinemómetros o etilómetros.</p>
                            <p>2. <strong>Cierre de la vía ordinaria:</strong> el expediente deviene firme sin resolución sancionadora expresa ulterior.</p>
                            <p>3. <strong>Comunicación registral:</strong> la firmeza se traslada al Registro de Conductores e Infractores, restando los puntos de inmediato.</p>
                        </div>
                    </section>

                    {/* SECCIÓN 3: TABLA 2 — CALENDARIO DE LOS 24 MESES (ART. 65.1) */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Artículo 65.1 LTSV</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Consolidación del Crédito Legal de 12 Puntos a los 24 Meses
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                El artículo 65.1 de la Ley sobre Tráfico unifica el plazo de rehabilitación: transcurridos dos años continuados sin que adquieran firmeza sanciones con pérdida de puntos, el titular recupera de oficio el saldo íntegro de 12 puntos. La defensa letrada agota de manera reglada los plazos que resten al conductor para alcanzar este hito temporal.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">Calendario procesal de consolidación del saldo de 12 puntos</caption>
                                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="py-4 px-6 font-semibold">Hito Temporal</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Trámite Administrativo Reglamentario</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Estado Registral en la Base de la DGT</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold whitespace-nowrap">Mes 0</th>
                                        <td className="py-4 px-6 text-slate-300">Firmeza de la última sanción con detracción de puntos.</td>
                                        <td className="py-4 px-6 text-rose-300">Saldo residual crítico (ej. 2 o 4 puntos).</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold whitespace-nowrap">Mes 20 a 22</th>
                                        <td className="py-4 px-6 text-slate-300">Notificación de nueva denuncia (propuesta de 4 a 6 puntos).</td>
                                        <td className="py-4 px-6 text-slate-300">Apertura de plazo de 20 días naturales. Se desaconseja el pronto pago.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold whitespace-nowrap">Día 1 a 20</th>
                                        <td className="py-4 px-6 text-slate-200">Personación de Autoridad Legal y presentación de alegaciones técnicas.</td>
                                        <td className="py-4 px-6 text-prestige-gold">Se interrumpe la firmeza; los puntos continúan inalterados.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold whitespace-nowrap">Mes 22 a 24</th>
                                        <td className="py-4 px-6 text-slate-300">Auditoría metrológica, solicitud de pruebas e informes ampliatorios.</td>
                                        <td className="py-4 px-6 text-slate-300">Expediente en instrucción activa; carece de ejecutividad registral.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors bg-emerald-950/20">
                                        <th scope="row" className="py-4 px-6 text-emerald-400 font-bold whitespace-nowrap">Mes 24 + 1 día</th>
                                        <td className="py-4 px-6 text-emerald-300 font-bold">Cumplimiento del artículo 65.1 de la Ley sobre Tráfico.</td>
                                        <td className="py-4 px-6 text-emerald-400 font-black">La DGT restablece de oficio el crédito a 12 PUNTOS.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-4 px-6 text-slate-200 font-semibold whitespace-nowrap">Mes 25 a 28</th>
                                        <td className="py-4 px-6 text-slate-300">Resolución sancionadora definitiva desestimatoria (si recae).</td>
                                        <td className="py-4 px-6 text-slate-200 font-semibold">La detracción se liquida sobre los 12 puntos: <strong>permiso vigente</strong>.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-300 space-y-2">
                            <h3 className="font-bold text-white text-sm">Garantías procesales del procedimiento sancionador (Ley 39/2015)</h3>
                            <p>• <strong>Auditoría Metrológica (Orden ICT/155/2020):</strong> verificación de certificados y márgenes de error reglamentarios en cinemómetros y etilómetros.</p>
                            <p>• <strong>Informes Ampliatorios y Trámite de Audiencia:</strong> exigencia de motivación fáctica a los agentes denunciantes y contradicción efectiva.</p>
                            <p>• <strong>Control de Caducidad (Art. 112.3 LTSV):</strong> si el procedimiento sancionador permanece un año desde su iniciación sin resolución sancionadora expresa, opera la caducidad reglada y el archivo definitivo de las actuaciones sin pérdida de puntos.</p>
                        </div>
                    </section>

                    {/* SECCIÓN 4: TABLA 3 — INCAPACIDADES MÉDICAS TGSS / INSS */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Aptitudes Psicofísicas (Anexo IV RGCond)</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Defensa del Permiso de Conducir ante Incapacidades de la Seguridad Social
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Tras la concesión de una Incapacidad Permanente por el INSS, la DGT inicia de oficio procedimientos de declaración de pérdida de vigencia por presunta desaparición de aptitudes psicofísicas (art. 36 RGCond). Autoridad Legal interviene para preservar el permiso de turismo (B).
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">Baremos médicos y estrategia de defensa del carnet ante el INSS</caption>
                                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="py-4 px-6 font-semibold">Categoría Reglamentaria</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Alcance de Permisos</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Criterio Médico Legal</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Estrategia Letrada de Defensa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-5 px-6 font-bold text-white whitespace-nowrap">Grupo 2 (Profesional)</th>
                                        <td className="py-5 px-6 text-slate-300">C1, C, D1, D, C1E, CE, D1E, DE</td>
                                        <td className="py-5 px-6 text-slate-300">Criterios de aptitud sumamente estrictos e inflexibles.</td>
                                        <td className="py-5 px-6 text-slate-400">Allanamiento táctico a la revocación profesional si la lesión es incompatible con vehículos pesados.</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors bg-emerald-950/20">
                                        <th scope="row" className="py-5 px-6 font-bold text-emerald-400 whitespace-nowrap">Grupo 1 (Particular)</th>
                                        <td className="py-5 px-6 text-emerald-300 font-semibold">AM, A1, A2, A, B, B+E</td>
                                        <td className="py-5 px-6 text-slate-200">Compatibilidad con patologías estabilizadas mediante adaptaciones o revisiones.</td>
                                        <td className="py-5 px-6 text-emerald-400 font-bold">Oposición probatoria fundamentada: acreditación clínica para conservar el permiso de turismo (B).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-900/60 p-6 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-300 space-y-2">
                            <h3 className="font-bold text-white text-sm">Salvaguarda efectiva de la movilidad privada</h3>
                            <p>• <strong>Separación de baremos:</strong> una incapacidad laboral para la profesión habitual no determina la incapacidad funcional para conducir un turismo particular.</p>
                            <p>• <strong>Dictámenes clínicos:</strong> aportación de informes de especialistas que acreditan la estabilidad cardiológica o funcional.</p>
                            <p>• <strong>Vigencia durante la tramitación:</strong> el acuerdo de inicio no extingue cautelarmente el carnet; conserva su validez legal hasta resolución definitiva.</p>
                        </div>
                    </section>

                    {/* SECCIÓN 5: ÁMBITO TERRITORIAL MULTIORGÁNICO */}
                    <section className="space-y-6">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Cobertura Estatal</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Ámbito de Actuación y Competencia Territorial Multiorgánica
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Autoridad Legal formaliza actuaciones letradas telemáticas con firma electrónica oficial ante la totalidad de sedes electrónicas con potestad sancionadora en materia de tráfico:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Dirección General de Tráfico (DGT)
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Centro de Tratamiento de Denuncias Automatizadas (CTDA) de León y las 50 Jefaturas Provinciales de Tráfico.
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Servei Català de Trànsit (SCT)
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Servicios Territoriales de Tráfico de Barcelona, Girona, Lleida y Tarragona de la Generalitat de Catalunya.
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Gobierno Vasco (Trafikoa)
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Dirección de Tráfico y expedientes incoados por la Ertzaintza en Araba, Bizkaia y Gipuzkoa.
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Comunidad Foral de Navarra
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Servicio de Tráfico y Seguridad Vial ante sanciones de Policía Foral y Agrupación de Tráfico de la Guardia Civil.
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Organismos Supramunicipales
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Organismos delegados de recaudación y gestión tributaria de sanciones (SUMA, BASE, REGTSA y Diputaciones).
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-prestige-gold" />
                                    Ayuntamientos de toda España
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Recursos frente a denuncias de Policías Locales de los más de 8.100 municipios de España (Madrid, Barcelona, Sevilla, Valencia, Bilbao, etc.).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN 6: PRECIOS Y NOTA TRIBUTARIA LITERAL */}
                    <section id="honorarios" className="space-y-6">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Honorarios Profesionales</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Estructura de Honorarios y Transparencia Contractual
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Retribución técnica transparente formalizada mediante hoja de encargo profesional con carácter previo al inicio de actuaciones.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">Estructura de precios del servicio de defensa de multas y puntos</caption>
                                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="py-4 px-6 font-semibold">Concepto de Honorarios</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Cuantía</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Momento y Criterio de Devengo</th>
                                        <th scope="col" className="py-4 px-6 font-semibold">Cobertura Jurídica Incluida</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-5 px-6 font-bold text-white whitespace-nowrap">
                                            {DEFENSE_POINTS_PRICING.baseConcept}
                                        </th>
                                        <td className="py-5 px-6 text-xl font-black text-prestige-gold whitespace-nowrap">
                                            {DEFENSE_POINTS_PRICING.basePriceDisplay}
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            Abono inicial a la formalización del encargo.
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            {DEFENSE_POINTS_PRICING.baseDescription}.
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <th scope="row" className="py-5 px-6 font-bold text-white whitespace-nowrap">
                                            {DEFENSE_POINTS_PRICING.successBonusConcept}
                                        </th>
                                        <td className="py-5 px-6 text-xl font-black text-emerald-400 whitespace-nowrap">
                                            {DEFENSE_POINTS_PRICING.successBonusDisplay}
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 font-semibold text-emerald-300">
                                            Exclusivamente si se conserva el permiso de conducir.
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            {DEFENSE_POINTS_PRICING.successBonusDescription}.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* NOTA LITERAL SOBRE HONORARIOS Y RÉGIMEN FISCAL (JUSTO DEBAJO DE LA TABLA) */}
                        <div className="bg-slate-900/90 border-l-4 border-prestige-gold p-6 rounded-r-2xl shadow-xl space-y-2">
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {DEFENSE_POINTS_PRICING.taxNote}
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/acuerdo-honorarios"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-prestige-gold/40 text-xs font-bold text-prestige-gold transition-colors shadow-md"
                            >
                                <FileText className="w-4 h-4 text-prestige-gold" />
                                <span>Consultar Modelo Oficial de Hoja de Encargo →</span>
                            </Link>
                        </div>
                    </section>

                    {/* SECCIÓN 7: PREGUNTAS FRECUENTES AGRUPADAS POR CLÚSTER (SSR 100%, DETAILS/SUMMARY) */}
                    <section id="faqs" className="space-y-12">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Consultas Jurídicas</span>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Preguntas Frecuentes sobre Multas y Puntos del Carnet
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Respuestas técnicas sobre procedimiento administrativo sancionador, plazos, pruebas y conservación de la autorización para conducir.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {PUNTOS_CLUSTERS.map((cluster, cIdx) => (
                                <div key={cIdx} className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                                            {cluster.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-400">
                                            {cluster.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {cluster.faqs.map((faq, fIdx) => (
                                            <details
                                                key={fIdx}
                                                className="group border border-white/10 rounded-xl bg-slate-900/80 p-5 shadow-sm hover:border-prestige-gold/50 transition-colors"
                                            >
                                                <summary className="flex justify-between items-center cursor-pointer font-bold text-white hover:text-prestige-gold transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                                                    <span className="pr-4">{faq.question}</span>
                                                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                                                </summary>
                                                <div className="mt-4 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN 8: CTA FINAL CON TELÉFONO Y WHATSAPP */}
                    <section className="bg-gradient-to-br from-trust-navy via-slate-900 to-slate-950 border border-prestige-gold/40 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/15 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                            <Scale className="w-4 h-4" />
                            Atención Inmediata en Vía Administrativa
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
                            ¿Has recibido una multa de tráfico que compromete tus puntos?
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Envíanos la fotografía de la notificación o boletín de denuncia. Revisamos los plazos legales, la viabilidad técnica y te informamos del procedimiento antes de que venza el plazo de pronto pago.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                            <a
                                href={`tel:${PHONE_CALL_E164}`}
                                className="min-h-[48px] px-6 py-3.5 rounded-xl bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg transition-colors"
                            >
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>Llamar al abogado de guardia</span>
                            </a>

                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[48px] px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#34e275] active:bg-[#1ebe5d] text-[#052e16] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0 text-[#052e16]" />
                                <span>Escribir a abogado por WhatsApp</span>
                            </a>
                        </div>
                        <p className="text-xs text-slate-400">
                            Atención directa: {PHONE_CALL_DISPLAY} · WhatsApp: {WHATSAPP_DISPLAY}
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}

