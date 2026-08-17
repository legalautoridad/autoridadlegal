import { Metadata } from 'next';
import Link from 'next/link';
import { PHONE_E164, DEFAULT_OG_IMAGE } from '@/lib/config';
import { Award, ShieldCheck, GraduationCap, Linkedin, Phone, Mail, Globe, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Santiago Giménez Olavarriaga | Director Jurídico ICAB 31.389 - Autoridad Legal',
    description: 'Perfil oficial del letrado Santiago Giménez Olavarriaga, colegiado ICAB nº 31.389. Director jurídico de Autoridad Legal y especialista en defensa penal por delitos contra la seguridad vial en Barcelona.',
    alternates: {
        canonical: 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
    },
    openGraph: {
        title: 'Santiago Giménez Olavarriaga | Director Jurídico ICAB 31.389',
        description: 'Perfil profesional verificado de Santiago Giménez Olavarriaga, abogado penalista colegiado ICAB 31.389 y especialista en derecho penal de tráfico en Barcelona.',
        url: 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
        type: 'profile',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Santiago Giménez Olavarriaga — Director Jurídico Autoridad Legal',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Santiago Giménez Olavarriaga | Director Jurídico ICAB 31.389',
        description: 'Perfil profesional verificado de Santiago Giménez Olavarriaga, abogado penalista colegiado ICAB 31.389.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function SantiagoGimenezPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person',
                'name': 'Santiago Giménez Olavarriaga',
                'givenName': 'Santiago',
                'familyName': 'Giménez Olavarriaga',
                'jobTitle': 'Director Jurídico y Abogado Penalista Ejerciente',
                'description': 'Abogado penalista colegiado en el Ilustre Colegio de la Abogacía de Barcelona (ICAB nº 31.389). Ejerce la dirección jurídica de Autoridad Legal y es especialista en la defensa de delitos contra la seguridad vial en Barcelona.',
                'url': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                'telephone': PHONE_E164,
                'email': 'contacto@autoridad.legal',
                'image': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg',
                'worksFor': {
                    '@type': 'Organization',
                    '@id': 'https://www.autoridad.legal/#organization',
                },
                'memberOf': {
                    '@type': 'Organization',
                    'name': 'Ilustre Colegio de la Abogacía de Barcelona',
                    'alternateName': 'ICAB',
                    'url': 'https://www.icab.es',
                },
                'hasCredential': {
                    '@type': 'EducationalOccupationalCredential',
                    'credentialCategory': 'Colegiación profesional',
                    'recognizedBy': {
                        '@type': 'Organization',
                        'name': 'Ilustre Colegio de la Abogacía de Barcelona',
                        'alternateName': 'ICAB',
                    },
                    'identifier': '31389',
                    'url': 'https://www.icab.es/es/colegio/miembros/index.html?id=31389',
                },
                'knowsAbout': [
                    'Delitos contra la seguridad vial',
                    'Alcoholemia al volante',
                    'Negativa a someterse a las pruebas de alcohol o drogas',
                    'Conducción bajo la influencia de drogas',
                    'Exceso de velocidad como delito',
                    'Conducción sin permiso o licencia',
                    'Defensa penal de conductores profesionales',
                    'Juicio rápido (diligencias urgentes)',
                    'Derecho penal',
                ],
                'sameAs': [
                    'https://www.linkedin.com/in/santiagogimenezolavarriaga/',
                    'https://www.gimenezolavarriaga.abogado',
                    'https://www.icab.es/es/colegio/miembros/index.html?id=31389',
                ],
            },
            {
                '@type': 'WebPage',
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#webpage',
                'url': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                'name': 'Santiago Giménez Olavarriaga | Director Jurídico ICAB 31.389',
                'description': 'Perfil oficial y verificado del letrado Santiago Giménez Olavarriaga.',
                'mainEntity': {
                    '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#breadcrumb',
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
                        'name': 'Abogados',
                        'item': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': 'Santiago Giménez Olavarriaga',
                        'item': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                {/* HERO HEADER */}
                <header className="relative bg-gradient-to-b from-trust-navy via-slate-900 to-slate-950 border-b border-white/10 pt-16 pb-20 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-prestige-gold transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-prestige-gold">Santiago Giménez Olavarriaga</span>
                        </nav>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-semibold uppercase tracking-wider mb-6">
                            <Award className="w-4 h-4" />
                            Dirección Jurídica Verificada · ICAB 31.389
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-8 space-y-4">
                                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                    Santiago Giménez Olavarriaga
                                </h1>
                                <p className="text-lg sm:text-xl text-prestige-gold font-bold">
                                    Director Jurídico y Abogado Penalista Ejerciente
                                </p>
                                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                                    Especialista en la defensa técnica de delitos contra la seguridad vial y juicios rápidos en la provincia de Barcelona y Cataluña.
                                </p>

                                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                                    <span className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-200 font-medium">
                                        ⚖️ Ilustre Colegio de la Abogacía de Barcelona (ICAB nº 31.389)
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-200 font-medium">
                                        📍 Barcelona, España
                                    </span>
                                </div>
                            </div>

                            {/* Trust Badge Card */}
                            <div className="md:col-span-4 bg-slate-900/90 p-6 rounded-2xl border border-prestige-gold/30 shadow-2xl space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                                    Verificación Deontológica
                                </h3>
                                <ul className="space-y-3 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Abogado Colegiado Ejerciente</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Colegio de la Abogacía de Barcelona</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Especialista Penalista en Seguridad Vial</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>Atención de Guardia 24h</span>
                                    </li>
                                </ul>

                                <div className="pt-2 border-t border-white/10 space-y-2">
                                    <a
                                        href={`tel:${PHONE_E164}`}
                                        className="w-full py-2.5 px-4 rounded-xl bg-prestige-gold hover:bg-amber-400 text-trust-navy font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Contactar Guardia 24h
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-16">
                    {/* BIOGRAPHY & E-E-A-T */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
                            <div className="border-l-4 border-prestige-gold pl-4 space-y-1">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                    Trayectoria y Especialización Jurídica
                                </h2>
                                <p className="text-xs text-prestige-gold uppercase tracking-wider font-bold">
                                    Dirección de Estrategia Penal y Defensa en Juicios Rápidos
                                </p>
                            </div>

                            <p>
                                Santiago Giménez Olavarriaga es letrado ejerciente del Ilustre Colegio de la Abogacía de Barcelona (ICAB 31.389) y director jurídico de Autoridad Legal. Cuenta con una dilatada experiencia profesional volcada en el derecho penal técnico y la litigación en juzgados de instrucción y de lo penal.
                            </p>

                            <p>
                                Como especialista en delitos contra la seguridad vial, su ejercicio profesional abarca el análisis crítico de atestados policiales, la verificación metrológica de etilómetros y la impugnación técnica de pruebas de alcoholemia, drogas al volante, excesos de velocidad y conducción sin permiso.
                            </p>

                            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-3 my-6">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-prestige-gold" />
                                    Áreas de Actuación y Defensa Especializada
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Delitos de alcoholemia (art. 379.2 CP)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Conducción bajo efectos de drogas (art. 379.2 CP)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Exceso de velocidad penal (art. 379.1 CP)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Conducir sin permiso o puntos (art. 384 CP)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Defensa de Conductores Profesionales (C, D, E)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-prestige-gold"></span>
                                        Negativa a someterse a pruebas (art. 383 CP)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* VERIFICATION & OFFICIAL LINKS COLUMN */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-slate-900/90 p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
                                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-prestige-gold" />
                                    Enlaces de Verificación Oficial
                                </h3>

                                <div className="space-y-3 text-xs">
                                    <a
                                        href="https://www.icab.es/es/colegio/miembros/index.html?id=31389"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-prestige-gold/40 flex items-center justify-between transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <GraduationCap className="w-5 h-5 text-prestige-gold shrink-0" />
                                            <div>
                                                <p className="font-bold text-white group-hover:text-prestige-gold transition-colors">Censo Oficial ICAB</p>
                                                <p className="text-[11px] text-slate-400">Colegiado nº 31.389</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-prestige-gold transition-colors" />
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/in/santiagogimenezolavarriaga/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-prestige-gold/40 flex items-center justify-between transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Linkedin className="w-5 h-5 text-blue-400 shrink-0" />
                                            <div>
                                                <p className="font-bold text-white group-hover:text-prestige-gold transition-colors">Perfil LinkedIn</p>
                                                <p className="text-[11px] text-slate-400">Linkedin Verificado</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-prestige-gold transition-colors" />
                                    </a>

                                    <a
                                        href="https://www.gimenezolavarriaga.abogado"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-prestige-gold/40 flex items-center justify-between transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <div>
                                                <p className="font-bold text-white group-hover:text-prestige-gold transition-colors">Sitio Profesional</p>
                                                <p className="text-[11px] text-slate-400">gimenezolavarriaga.abogado</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-prestige-gold transition-colors" />
                                    </a>
                                </div>
                            </div>

                            <div className="bg-slate-900/90 p-6 rounded-2xl border border-white/10 shadow-xl space-y-3 text-xs text-slate-300">
                                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Contacto Directo</h3>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-prestige-gold shrink-0" />
                                    <span>contacto@autoridad.legal</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-prestige-gold shrink-0" />
                                    <span>+34 605 118 871</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* LINK TO SERVICES & HONORARIOS */}
                    <section className="bg-gradient-to-r from-slate-900 via-trust-navy to-slate-900 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Transparencia en Honorarios y Hoja de Encargo</h3>
                            <p className="text-sm text-slate-300">
                                Consulta nuestro modelo de precios cerrados por escrito (980 € base y 1.480 € profesionales) con pago en custodia y opciones de financiación.
                            </p>
                        </div>
                        <Link
                            href="/honorarios"
                            className="px-6 py-3 rounded-xl bg-prestige-gold hover:bg-amber-400 text-trust-navy font-extrabold text-sm whitespace-nowrap transition-all shadow-lg"
                        >
                            Ver Honorarios →
                        </Link>
                    </section>
                </div>
            </main>
        </>
    );
}
