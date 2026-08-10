import { Metadata } from 'next';
import Link from 'next/link';
import { PHONE_E164, DEFAULT_OG_IMAGE } from '@/lib/config';
import { getHonorariosPageJsonLd } from '@/lib/seo/home-jsonld';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, CreditCard, FileText, Phone, Award, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Precio, honorarios y financiación | Autoridad Legal',
    description: 'Información sobre honorarios cerrados de 980 € y 1.480 € (IVA y procurador incluidos), suplementos aplicables, desglose fiscal y modalidades de financiación para la defensa en juicios rápidos de tráfico en Barcelona.',
    alternates: {
        canonical: 'https://www.autoridad.legal/honorarios',
    },
    openGraph: {
        title: 'Precio, honorarios y financiación | Autoridad Legal',
        description: 'Transparencia absoluta en honorarios para juicios rápidos por alcoholemia, drogas, velocidad, sin carné y conductores profesionales en la provincia de Barcelona.',
        url: 'https://www.autoridad.legal/honorarios',
        type: 'website',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Autoridad Legal — Precio y honorarios',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Precio, honorarios y financiación | Autoridad Legal',
        description: 'Transparencia absoluta en honorarios para juicios rápidos por alcoholemia, drogas, velocidad, sin carné y conductores profesionales en la provincia de Barcelona.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function HonorariosPage() {
    const jsonLd = getHonorariosPageJsonLd();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                {/* HERO & TITLE SECTION */}
                <header className="relative bg-gradient-to-b from-trust-navy via-slate-900 to-slate-950 border-b border-white/10 pt-16 pb-20 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-prestige-gold transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-prestige-gold">Honorarios</span>
                        </nav>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-semibold uppercase tracking-wider mb-6">
                            <Award className="w-4 h-4" />
                            Transparencia y Deontología ICAB 31.389
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                            Precio, honorarios y financiación
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed font-medium">
                            Autoridad Legal es una plataforma tecnológica de gestión de servicios jurídicos de alta especialización y defensa penal de tráfico en la provincia de Barcelona. La dirección jurídica es ejercida por el abogado penalista <strong className="text-white font-bold">Santiago Giménez Olavarriaga</strong> (colegiado ICAB nº 31.389).
                        </p>

                        {/* AVISO DE ALCANCE (DESTACADO ARRIBA) */}
                        <div className="mt-8 bg-slate-900/90 border-l-4 border-prestige-gold p-6 rounded-r-2xl shadow-2xl backdrop-blur-sm max-w-4xl">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-prestige-gold shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="text-base font-bold text-white uppercase tracking-wider mb-1">
                                        Aviso Importante de Alcance Contractual
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                        Esta página informa del modelo de honorarios. El alcance definitivo del servicio, el precio aplicable y cualquier suplemento se determinan antes de la contratación y quedan recogidos en la hoja de encargo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-20">

                    {/* 1. TABLA DE PRECIOS BASE POR SERVICIO */}
                    <section className="space-y-8">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Precios base por servicio
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base">
                                Tarifas cerradas por escrito para el supuesto base en juicios rápidos de seguridad vial.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-slate-900/60">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 border-b border-white/10 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <th className="py-4 px-6">Servicio</th>
                                        <th className="py-4 px-6">Precio Base (IVA e Inclusiones)</th>
                                        <th className="py-4 px-6">Supuesto Incluido</th>
                                        <th className="py-4 px-6 text-right">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            Alcoholemia
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-prestige-gold text-lg">
                                            980 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Link href="/alcoholemia" className="text-prestige-gold hover:underline font-semibold text-xs">
                                                Ver servicio →
                                            </Link>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            Drogas al volante
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-prestige-gold text-lg">
                                            980 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Link href="/drogas" className="text-prestige-gold hover:underline font-semibold text-xs">
                                                Ver servicio →
                                            </Link>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            Exceso de velocidad
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-prestige-gold text-lg">
                                            980 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Link href="/velocidad" className="text-prestige-gold hover:underline font-semibold text-xs">
                                                Ver servicio →
                                            </Link>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            Conducir sin carné
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-prestige-gold text-lg">
                                            980 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300">
                                            precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Link href="/sin-carnet" className="text-prestige-gold hover:underline font-semibold text-xs">
                                                Ver servicio →
                                            </Link>
                                        </td>
                                    </tr>

                                    <tr className="bg-prestige-gold/5 hover:bg-prestige-gold/10 transition-colors border-l-4 border-l-prestige-gold">
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-prestige-gold animate-pulse"></span>
                                            Conductores profesionales (C, D, E)
                                        </td>
                                        <td className="py-5 px-6 font-black text-prestige-gold text-xl">
                                            1.480 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-200">
                                            precio cerrado de 1.480 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad. Incluye la protección del CAP y la tarjeta de tacógrafo digital.
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Link href="/profesionales" className="text-prestige-gold hover:underline font-bold text-xs">
                                                Ver servicio →
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Desglose Fiscal e Información Adicional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-prestige-gold" />
                                    Desglose Fiscal Exacto — Servicio Base (980 €)
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Base imponible <strong className="text-white">809,92 €</strong> + IVA (21 %) <strong className="text-white">170,08 €</strong> = <strong className="text-prestige-gold">980,00 €</strong>. Total derechos de procurador incluidos.
                                </p>
                            </div>

                            <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-prestige-gold" />
                                    Desglose Fiscal Exacto — Profesionales (1.480 €)
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Base imponible <strong className="text-white">1.223,14 €</strong> + IVA (21 %) <strong className="text-white">256,86 €</strong> = <strong className="text-prestige-gold">1.480,00 €</strong>. Incluye tutela específica del CAP y tacógrafo.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. QUÉ INCLUYE / QUÉ NO INCLUYE EL PRECIO BASE */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* QUÉ INCLUYE */}
                        <div className="bg-slate-900/80 p-8 rounded-2xl border border-emerald-500/20 shadow-xl space-y-6">
                            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
                                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                                <h3 className="text-2xl font-bold text-white">
                                    Qué incluye el precio base
                                </h3>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Análisis inicial del supuesto y fiscalización del atestado policial.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Preparación de la estrategia del procedimiento contratado.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Asistencia letrada presencial al juicio rápido con conformidad en Juzgado de Guardia.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Coordinación procesal de las actuaciones incluidas en la hoja de encargo.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Representación del procurador de los tribunales cuando corresponda al servicio contratado.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Información puntual e ininterrumpida al cliente sobre el desarrollo de la actuación.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>Entrega de la resolución formal y documentación judicial que corresponda.</span>
                                </li>
                            </ul>
                        </div>

                        {/* QUÉ NO INCLUYE */}
                        <div className="bg-slate-900/80 p-8 rounded-2xl border border-red-500/20 shadow-xl space-y-6">
                            <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
                                <XCircle className="w-7 h-7 text-red-400 shrink-0" />
                                <h3 className="text-2xl font-bold text-white">
                                    Qué NO incluye el precio base
                                </h3>
                            </div>
                            <ul className="space-y-2.5 text-sm text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Asistencia al detenido en comisaría salvo contratación expresa de suplemento.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Juicios rápidos sin conformidad (defensa en juicio oral posterior) salvo suplemento.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Recursos de apelación, queja o nulidad de actuaciones.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Procedimientos penales posteriores o independientes del juicio rápido.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Accidentes de tráfico con daños materiales o corporales.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Accidentes con lesiones o reclamaciones civiles derivadas.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Pluralidad de perjudicados o acusados que exija actuaciones procesales adicionales.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Informes periciales de terceros (metrológicos, médicos, reconstrucción de accidentes).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>Actuaciones no previstas explícitamente en la hoja de encargo o desplazamientos extraordinarios.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. TABLA DE SUPLEMENTOS TASADOS */}
                    <section className="space-y-8">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Suplementos tasados
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
                                Los suplementos solo se aplican cuando la circunstancia correspondiente concurre y exige un alcance distinto del servicio base. Cuando concurran varias circunstancias, el presupuesto final se comunica antes de la firma. No se aplican suplementos no identificados previamente en la hoja de encargo.
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-slate-900/60">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 border-b border-white/10 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <th className="py-4 px-6">Suplemento</th>
                                        <th className="py-4 px-6">Importe (IVA inc.)</th>
                                        <th className="py-4 px-6">Aplica a</th>
                                        <th className="py-4 px-6">Descripción y Causa Procesal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white">
                                            Reincidencia penal o antecedentes
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-amber-400 text-base">
                                            +200 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 font-medium">
                                            Los 5 servicios
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 text-xs leading-relaxed">
                                            Antecedentes penales de seguridad vial inscritos y no cancelados en el Registro Central de Penados.
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white">
                                            Procedimiento sin conformidad
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-amber-400 text-base">
                                            +300 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 font-medium">
                                            Los 4 servicios base (<strong className="text-slate-400 font-semibold">N/A en profesionales</strong>)
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 text-xs leading-relaxed">
                                            Estrategia defensiva orientada a la absolución judicial o impugnación metrológica en juicio oral posterior.
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white">
                                            Antecedentes con riesgo de prisión efectiva
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-amber-400 text-base">
                                            +300 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 font-medium">
                                            Los 5 servicios
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 text-xs leading-relaxed">
                                            Multirreincidencia o riesgo de revocación de la suspensión ordinaria de la pena privativa de libertad.
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 font-bold text-white">
                                            Asistencia letrada al detenido (urgencia in situ)
                                        </td>
                                        <td className="py-5 px-6 font-extrabold text-amber-400 text-base">
                                            +500 €
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 font-medium">
                                            Los 5 servicios
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 text-xs leading-relaxed">
                                            Desplazamiento urgente de letrado a comisaría o centro de custodia policial fuera de horas de despacho.
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors bg-white/5">
                                        <td className="py-5 px-6 font-bold text-white">
                                            Accidentes, daños, lesiones o reclamaciones
                                        </td>
                                        <td className="py-5 px-6 font-bold text-slate-300 text-sm">
                                            Presupuesto específico
                                        </td>
                                        <td className="py-5 px-6 text-slate-400 text-xs">
                                            Según supuesto
                                        </td>
                                        <td className="py-5 px-6 text-slate-300 text-xs leading-relaxed">
                                            Siniestros con atestados complejos, daños materiales a terceros o responsabilidad civil por lesiones.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 4. FORMAS DE PAGO Y MODALIDAD 60/40 */}
                    <section className="space-y-8">
                        <div className="border-l-4 border-prestige-gold pl-4 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Formas de pago y facilidades
                            </h2>
                            <p className="text-slate-300 text-sm md:text-base">
                                Opciones flexibles y transparentes para adaptar el coste a cada situación financiera.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Pago íntegro */}
                            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
                                <div className="p-3 rounded-xl bg-prestige-gold/10 text-prestige-gold w-fit">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Pago Íntegro Directo</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Abono completo al formalizar la hoja de encargo mediante tarjeta de crédito/débito o transferencia bancaria en la plataforma de pago en custodia.
                                </p>
                            </div>

                            {/* Financiación externa */}
                            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
                                <div className="p-3 rounded-xl bg-prestige-gold/10 text-prestige-gold w-fit">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Financiación hasta 12 meses</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Financiación bancaria externa en cuotas mensuales (Klarna/Stripe), sujeta a aprobación de la entidad financiera colaboradora.
                                </p>
                            </div>

                            {/* Modalidad 60/40 */}
                            <div className="bg-slate-900/80 p-6 rounded-2xl border border-prestige-gold/30 shadow-xl space-y-4">
                                <div className="p-3 rounded-xl bg-prestige-gold/20 text-prestige-gold w-fit">
                                    <Scale className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Modalidad Híbrida 60/40</h3>
                                <div className="space-y-2 text-xs text-slate-300">
                                    <p className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                                        <strong className="text-white block">Servicio Base (980 €):</strong>
                                        Primer pago <span className="text-prestige-gold font-bold">588 €</span> · Pendiente a 30 días <span className="text-white font-bold">392 €</span>
                                    </p>
                                    <p className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                                        <strong className="text-white block">Profesionales (1.480 €):</strong>
                                        Primer pago <span className="text-prestige-gold font-bold">888 €</span> · Pendiente a 30 días <span className="text-white font-bold">592 €</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Texto Neutro de Impago */}
                        <div className="bg-slate-900/90 border border-amber-500/20 p-5 rounded-xl text-slate-300 text-xs leading-relaxed">
                            <strong className="text-amber-400 font-bold block mb-1">Condición de Impago en Modalidad Fraccionada:</strong>
                            En caso de devolución o falta de pago del importe pendiente, la hoja de encargo puede prever una cantidad en concepto de gestión de impago y recobro, que se comunica al cliente antes de la firma.
                        </div>
                    </section>

                    {/* 5. HOJA DE ENCARGO Y GARANTÍAS DE SEGURIDAD */}
                    <section className="bg-gradient-to-r from-slate-900 via-trust-navy to-slate-900 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl space-y-8">
                        <div className="max-w-3xl space-y-4">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">
                                Transparencia mediante Hoja de Encargo
                            </h2>
                            <p className="text-slate-300 text-base leading-relaxed">
                                Antes de formalizar la contratación, el cliente recibe por escrito su hoja de encargo (acuerdo de honorarios) donde figuran de forma transparente el servicio contratado, el alcance exacto de la intervención, el precio cerrado con desglose de IVA, los conceptos incluidos, los suplementos aplicables, la forma de pago elegida y las condiciones contractuales. Firma electrónica disponible para agilizar la asistencia inmediata de guardia.
                            </p>
                        </div>

                        {/* TRANSPARENCIA SOBRE EL RESULTADO (DEONTOLOGÍA ICAB) */}
                        <div className="bg-slate-950/80 p-6 rounded-2xl border border-prestige-gold/40 space-y-2 max-w-4xl">
                            <h3 className="text-sm font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Deontología Profesional y Transparencia sobre el Resultado
                            </h3>
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed italic font-medium">
                                "No se garantiza un resultado judicial concreto. La decisión final corresponde a los órganos judiciales y depende de las circunstancias y pruebas de cada caso."
                            </p>
                        </div>
                    </section>

                    {/* 6. VIGENCIA Y NATURALEZA INFORMATIVA */}
                    <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-slate-400 text-xs leading-relaxed space-y-2">
                        <h3 className="font-bold text-slate-300 uppercase tracking-wider">Vigencia y naturaleza de la información</h3>
                        <p>
                            Tarifas vigentes a partir del 10 de agosto de 2026, sujetas a actualización; la versión aplicable será la vigente en la fecha de la hoja de encargo. Esta información tiene carácter informativo y no constituye una oferta contractual vinculante.
                        </p>
                    </section>

                    {/* 7. CTA DIRECTO DE ATENCIÓN DE GUARDIA */}
                    <section className="text-center bg-gradient-to-b from-slate-900 to-slate-950 p-10 rounded-3xl border border-prestige-gold/30 shadow-2xl space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            ¿Has recibido una citación para Juicio Rápido?
                        </h2>
                        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                            Contacta de inmediato con la dirección jurídica de Autoridad Legal para fiscalizar tu atestado y concertar tu hoja de encargo con honorarios cerrados.
                        </p>
                        <div className="flex justify-center items-center">
                            <a
                                href={`tel:${PHONE_E164}`}
                                className="inline-flex items-center gap-3 bg-prestige-gold hover:bg-amber-400 text-trust-navy font-black py-4 px-8 rounded-xl shadow-lg shadow-prestige-gold/20 transition-all text-base"
                            >
                                <Phone className="w-5 h-5 fill-current" />
                                Llamar a Guardia 24h (+34 605 118 871)
                            </a>
                        </div>
                    </section>

                </div>
            </main>
        </>
    );
}
