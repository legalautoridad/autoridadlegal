import { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ExternalLink, ArrowRight, Quote } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Santiago Giménez Olavarriaga | Abogado penalista ICAB 31.389',
    description: 'Abogado penalista colegiado en el ICAB desde 2006 (n.º 31.389). Dirige la defensa en delitos de tráfico y juicios rápidos de Autoridad Legal en Barcelona.',
    alternates: {
        canonical: 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
    },
    openGraph: {
        title: 'Santiago Giménez Olavarriaga | Abogado penalista ICAB 31.389',
        description: 'Abogado penalista colegiado en el ICAB desde 2006 (n.º 31.389). Dirige la defensa en delitos de tráfico y juicios rápidos de Autoridad Legal en Barcelona.',
        url: 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
        type: 'profile',
        images: [
            {
                url: 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg',
                width: 1200,
                height: 630,
                alt: 'Santiago Giménez Olavarriaga — Abogado Penalista ICAB 31.389',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Santiago Giménez Olavarriaga | Abogado penalista ICAB 31.389',
        description: 'Abogado penalista colegiado en el ICAB desde 2006 (n.º 31.389). Dirige la defensa en delitos de tráfico y juicios rápidos de Autoridad Legal en Barcelona.',
        images: ['https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg'],
    },
};

export default function SantiagoGimenezPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfilePage',
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#webpage',
                'url': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                'name': 'Santiago Giménez Olavarriaga | Abogado penalista ICAB 31.389',
                'inLanguage': 'es',
                'dateModified': '2026-11-09',
                'mainEntity': { '@id': 'https://www.gimenezolavarriaga.abogado/#person' },
                'about': { '@id': 'https://www.gimenezolavarriaga.abogado/#person' }
            },
            {
                '@type': 'Person',
                '@id': 'https://www.gimenezolavarriaga.abogado/#person',
                'name': 'Santiago Giménez Olavarriaga',
                'givenName': 'Santiago',
                'familyName': 'Giménez Olavarriaga',
                'description': 'Abogado penalista colegiado en el Ilustre Colegio de la Abogacía de Barcelona desde 2006 (n.º 31.389). Director jurídico de Autoridad Legal, especializado en delitos contra la seguridad vial y juicios rápidos en la provincia de Barcelona.',
                'jobTitle': 'Director jurídico y abogado penalista',
                'url': 'https://www.gimenezolavarriaga.abogado',
                'image': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg',
                'telephone': '+34605118871',
                'knowsLanguage': ['es', 'ca'],
                'worksFor': { '@id': 'https://www.autoridad.legal/#organization' },
                'memberOf': {
                    '@type': 'Organization',
                    'name': 'Ilustre Colegio de la Abogacía de Barcelona',
                    'alternateName': 'ICAB',
                    'url': 'https://www.icab.es'
                },
                'hasCredential': {
                    '@type': 'EducationalOccupationalCredential',
                    'credentialCategory': 'Colegiación profesional',
                    'identifier': '31389',
                    'recognizedBy': {
                        '@type': 'Organization',
                        'name': 'Ilustre Colegio de la Abogacía de Barcelona',
                        'alternateName': 'ICAB'
                    },
                    'url': 'https://www.icab.es/es/colegio/miembros/index.html?id=31389'
                },
                'knowsAbout': [
                    'Delitos contra la seguridad vial',
                    'Juicio rápido (diligencias urgentes)',
                    'Alcoholemia al volante',
                    'Conducción bajo la influencia de drogas',
                    'Exceso de velocidad como delito',
                    'Conducción sin permiso o licencia',
                    'Defensa penal de conductores profesionales',
                    'Control metrológico de etilómetros y cinemómetros',
                    'Impugnación de atestados policiales'
                ],
                'subjectOf': [
                    {
                        '@type': 'Article',
                        'headline': '¿Te pueden pedir el DNI por grabar a la policía en la calle? La trampa del \'por si acaso\'',
                        'url': 'https://www.economistjurist.es/articulos-juridicos-destacados/te-pueden-pedir-el-dni-por-grabar-a-la-policia-en-la-calle-la-trampa-del-por-si-acaso/',
                        'author': { '@id': 'https://www.gimenezolavarriaga.abogado/#person' },
                        'publisher': { '@type': 'Organization', 'name': 'Economist & Jurist' }
                    },
                    {
                        '@type': 'Article',
                        'headline': 'La tiranía de la casilla: cómo combatir el acta de síntomas en los controles de alcoholemia y drogas',
                        'url': 'https://www.economistjurist.es/articulos-juridicos-destacados/la-tirania-de-la-casilla-como-combatir-el-acta-de-sintomas-en-los-controles-de-alcoholemia-y-drogas/',
                        'author': { '@id': 'https://www.gimenezolavarriaga.abogado/#person' },
                        'publisher': { '@type': 'Organization', 'name': 'Economist & Jurist' }
                    }
                ],
                'sameAs': [
                    'https://www.gimenezolavarriaga.abogado',
                    'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
                    'https://www.icab.es/es/colegio/miembros/index.html?id=31389',
                    'https://www.linkedin.com/in/santiagogimenezolavarriaga/',
                    'https://www.youtube.com/@SantiagoGimenezOlavarriaga',
                    'https://www.instagram.com/santiago.gimenez.abogado/',
                    'https://x.com/santiagogolavar',
                    'https://www.facebook.com/santiago.gimenez.olavarriaga'
                ]
            },
            {
                '@type': 'FAQPage',
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': '¿Cómo compruebo que Santiago Giménez Olavarriaga es abogado colegiado?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'En el censo público del Ilustre Colegio de la Abogacía de Barcelona, con el número 31.389.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': '¿Qué relación hay entre Santiago Giménez Olavarriaga y Autoridad Legal?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Santiago es el abogado y director jurídico. Autoridad Legal es la marca con la que presta la defensa urgente en delitos contra la seguridad vial en la provincia de Barcelona.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': '¿En qué juzgados actúa?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'En los juzgados de guardia y tribunales de instancia de los 25 partidos judiciales de la provincia de Barcelona.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': '¿Cuánto cuestan sus honorarios?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base en alcoholemia, drogas, velocidad y sin carnet, y 1.480 € para conductores profesionales. Los recargos están tasados por escrito.'
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
                {/* HERO HEADER */}
                <header className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-white/10 pt-16 pb-14 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        {/* Breadcrumbs */}
                        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-amber-400 transition-colors">Inicio</Link>
                            <span>/</span>
                            <span>Abogados</span>
                            <span>/</span>
                            <span className="text-amber-400">Santiago Giménez Olavarriaga</span>
                        </nav>

                        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-8">
                            {/* Fotografía oficial */}
                            <img
                                src="https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg"
                                alt="Santiago Giménez Olavarriaga"
                                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-2xl object-cover border-2 border-amber-400/30 shadow-2xl shrink-0"
                            />
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                                    Santiago Giménez Olavarriaga, abogado penalista y director jurídico de Autoridad Legal
                                </h1>
                                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                                    Santiago Giménez Olavarriaga es abogado penalista, colegiado en el Ilustre Colegio de la Abogacía de Barcelona con el número 31.389 desde 2006. Dirige jurídicamente Autoridad Legal y está especializado en delitos contra la seguridad vial y juicios rápidos en los 25 partidos judiciales de la provincia de Barcelona.
                                </p>
                            </div>
                        </div>

                        {/* Línea visible de revisión */}
                        <p className="text-xs text-slate-400 italic border-l-2 border-amber-400/50 pl-3 py-0.5">
                            Revisado por Santiago Giménez Olavarriaga · Actualizado el 9 de noviembre de 2026
                        </p>

                        {/* Botones de acción principales */}
                        <div className="mt-8 flex flex-wrap gap-4 items-center">
                            <a
                                href="tel:+34605118871"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm transition-colors shadow-lg"
                            >
                                <Phone className="w-4 h-4" />
                                Llamar a la guardia 24 h — +34 605 118 871
                            </a>
                            <Link
                                href="/honorarios"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/10 font-bold text-sm transition-colors"
                            >
                                Ver honorarios cerrados
                                <ArrowRight className="w-4 h-4 text-amber-400" />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
                    {/* DATOS VERIFICABLES */}
                    <section className="space-y-4">
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-4 font-semibold w-1/3">Dato</th>
                                        <th className="py-3 px-4 font-semibold">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-300">
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Colegiación</td>
                                        <td className="py-3 px-4">
                                            ICAB n.º 31.389, desde 2006 —{' '}
                                            <a
                                                href="https://www.icab.es/es/colegio/miembros/index.html?id=31389"
                                                target="_blank"
                                                rel="noopener"
                                                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
                                            >
                                                verificar en el censo del ICAB
                                                <ExternalLink className="w-3.5 h-3.5 inline" />
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Cargo</td>
                                        <td className="py-3 px-4">Director jurídico de Autoridad Legal</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Especialidad</td>
                                        <td className="py-3 px-4">Delitos contra la seguridad vial: alcoholemia, drogas, velocidad, conducción sin permiso y conductores profesionales</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Ámbito</td>
                                        <td className="py-3 px-4">Provincia de Barcelona (25 partidos judiciales)</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Idiomas</td>
                                        <td className="py-3 px-4">Castellano y catalán</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Despacho</td>
                                        <td className="py-3 px-4">Av. Diagonal 437, Principal 3ª, 08036 Barcelona</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-white">Guardia 24 h</td>
                                        <td className="py-3 px-4">
                                            <a href="tel:+34605118871" className="text-amber-400 hover:underline font-bold">
                                                +34 605 118 871
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* CÓMO PLANTEA CADA DEFENSA */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                            Cómo plantea cada defensa
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-base">
                            Para Santiago, el resultado de un juicio rápido se decide antes de entrar en sala. Su método tiene cuatro pasos:
                        </p>
                        <ol className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed list-decimal list-inside pl-2">
                            <li className="pl-1">
                                <strong className="text-white">Leer el atestado entero.</strong> Fechas, horas, firmas, diligencias y contradicciones internas. Un error formal no anula todo por sí solo, pero puede cambiar cómo se valora la prueba.
                            </li>
                            <li className="pl-1">
                                <strong className="text-white">Auditar la prueba técnica.</strong> Certificados de verificación de etilómetros y cinemómetros según la Orden ICT/155/2020, pruebas salivales de drogas y cadena de custodia de las muestras.
                            </li>
                            <li className="pl-1">
                                <strong className="text-white">Revisar la actuación policial.</strong> Si el control, los requerimientos, la información dada al conductor y la toma de muestras respetaron sus derechos y quedaron bien documentados. También cómo se describió la sintomatología en el acta.
                            </li>
                            <li className="pl-1">
                                <strong className="text-white">Decidir la estrategia con el cliente.</strong> Conformidad, no conformidad o pedir diligencias: no hay una opción buena para todos. Se elige después de estudiar el caso y explicar al cliente las consecuencias de cada una.
                            </li>
                        </ol>

                        {/* Cita destacada */}
                        <blockquote className="relative my-8 p-6 rounded-2xl bg-slate-900 border-l-4 border-amber-400 border-t border-r border-b border-white/10 shadow-xl">
                            <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
                            <p className="text-lg sm:text-xl font-medium text-slate-200 italic leading-relaxed">
                                «Un caso, aunque sea en conformidad, no se prepara cinco minutos antes de entrar en sala.»
                            </p>
                            <footer className="mt-3 text-sm text-amber-400 font-semibold">
                                — Santiago Giménez Olavarriaga
                            </footer>
                        </blockquote>
                    </section>

                    {/* UN EJEMPLO: LA TASA DEL TICKET NO ES LA TASA DEFINITIVA */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                            Un ejemplo: la tasa del ticket no es la tasa definitiva
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-base">
                            Santiago explica que la cifra que imprime el etilómetro no es una verdad absoluta. La normativa metrológica obliga a aplicar un margen de error a esa tasa. Por eso, una lectura de 0,61 o 0,62 mg/l en aire espirado puede quedar por debajo del umbral penal y pasar de delito a infracción administrativa. La diferencia es grande: con delito hay antecedentes penales y retirada del permiso; con infracción administrativa, una multa y pérdida de puntos.
                        </p>
                        <div>
                            <a
                                href="https://www.youtube.com/@SantiagoGimenezOlavarriaga"
                                target="_blank"
                                rel="noopener"
                                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-sm underline decoration-amber-400/50 hover:decoration-amber-300 transition-colors"
                            >
                                Ver el vídeo de Santiago en YouTube
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </section>

                    {/* PUBLICACIONES */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                            Publicaciones
                        </h2>
                        <ul className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">•</span>
                                <div>
                                    <a
                                        href="https://www.economistjurist.es/articulos-juridicos-destacados/te-pueden-pedir-el-dni-por-grabar-a-la-policia-en-la-calle-la-trampa-del-por-si-acaso/"
                                        target="_blank"
                                        rel="noopener"
                                        className="text-amber-400 hover:underline font-semibold"
                                    >
                                        «¿Te pueden pedir el DNI por grabar a la policía en la calle? La trampa del &quot;por si acaso&quot;»
                                    </a>
                                    <span className="text-slate-400"> — Economist &amp; Jurist</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400 font-bold">•</span>
                                <div>
                                    <a
                                        href="https://www.economistjurist.es/articulos-juridicos-destacados/la-tirania-de-la-casilla-como-combatir-el-acta-de-sintomas-en-los-controles-de-alcoholemia-y-drogas/"
                                        target="_blank"
                                        rel="noopener"
                                        className="text-amber-400 hover:underline font-semibold"
                                    >
                                        «La tiranía de la casilla: cómo combatir el acta de síntomas en los controles de alcoholemia y drogas»
                                    </a>
                                    <span className="text-slate-400"> — Economist &amp; Jurist</span>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* OPINIONES VERIFICABLES */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                            Opiniones verificables
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Extractos breves; cada uno enlaza a su fuente original.
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300 text-sm sm:text-base leading-relaxed">
                                <strong className="text-white">Marc Jané Cerdans</strong> — caso de alcoholemia en L&apos;Hospitalet de Llobregat. Destaca la atención de madrugada y el análisis de la medición del etilómetro.{' '}
                                <a
                                    href="https://share.google/NpI4eR8AUNrs7PvVD"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    Google <ExternalLink className="w-3 h-3 inline" />
                                </a>
                                {' · '}
                                <a
                                    href="https://www.gimenezolavarriaga.abogado/observatorio/caso-exito-alcoholemia-hospitalet-marc-jane"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    Caso <ExternalLink className="w-3 h-3 inline" />
                                </a>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300 text-sm sm:text-base leading-relaxed">
                                <strong className="text-white">Xavi Perera Flor</strong>, conductor profesional — Ciutat de la Justícia de Barcelona. Conservó el permiso y el empleo.{' '}
                                <a
                                    href="https://share.google/KtZfE9Z3utJKMotmn"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    Google <ExternalLink className="w-3 h-3 inline" />
                                </a>
                                {' · '}
                                <a
                                    href="https://www.gimenezolavarriaga.abogado/observatorio/caso-exito-alcoholemia-barcelona-ciutat-de-la-justicia-xavi"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    Caso <ExternalLink className="w-3 h-3 inline" />
                                </a>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300 text-sm sm:text-base leading-relaxed">
                                <strong className="text-white">Diego de Urbiola Alís</strong> — juicio rápido en Terrassa. Destaca el análisis del acta de síntomas y los márgenes de error.{' '}
                                <a
                                    href="https://www.linkedin.com/in/diego-de-urbiola-al%C3%ADs-4aa167196/"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    LinkedIn <ExternalLink className="w-3 h-3 inline" />
                                </a>
                                {' · '}
                                <a
                                    href="https://www.gimenezolavarriaga.abogado/observatorio/caso-exito-alcoholemia-terrassa-diego-urbiola"
                                    target="_blank"
                                    rel="noopener"
                                    className="text-amber-400 hover:underline font-medium inline-flex items-center gap-0.5"
                                >
                                    Caso <ExternalLink className="w-3 h-3 inline" />
                                </a>
                            </div>
                        </div>

                        <div className="pt-2 space-y-2 text-slate-300 text-sm sm:text-base">
                            <p className="font-semibold text-white">Compañeros de profesión:</p>
                            <ul className="space-y-1.5 pl-4 list-disc list-inside">
                                <li>
                                    <strong className="text-white">Rafael Domínguez Alonso</strong>, abogado penalista (
                                    <a
                                        href="https://www.icab.es/es/colegio/miembros/index.html?id=31884"
                                        target="_blank"
                                        rel="noopener"
                                        className="text-amber-400 hover:underline"
                                    >
                                        ICAB 31.884
                                    </a>
                                    )
                                </li>
                                <li>
                                    <strong className="text-white">Javier Zacarías Jiménez</strong>, socio director de OHMIUS Advocats (
                                    <a
                                        href="https://icab.es/es/colegio/miembros/index.html?id=48784"
                                        target="_blank"
                                        rel="noopener"
                                        className="text-amber-400 hover:underline"
                                    >
                                        ICAB 48.784
                                    </a>
                                    )
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4">
                            <a
                                href="https://www.gimenezolavarriaga.abogado/biografia"
                                target="_blank"
                                rel="noopener"
                                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-sm hover:underline transition-colors"
                            >
                                Ver todas las opiniones y la biografía completa en gimenezolavarriaga.abogado →
                            </a>
                        </div>
                    </section>

                    {/* PREGUNTAS FRECUENTES */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                            Preguntas frecuentes
                        </h2>

                        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-white text-base">
                                    ¿Cómo compruebo que Santiago Giménez Olavarriaga es abogado colegiado?
                                </h3>
                                <p>
                                    En el censo público del Ilustre Colegio de la Abogacía de Barcelona, con el número 31.389.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-bold text-white text-base">
                                    ¿Qué relación hay entre Santiago Giménez Olavarriaga y Autoridad Legal?
                                </h3>
                                <p>
                                    Santiago es el abogado y director jurídico. Autoridad Legal es la marca con la que presta la defensa urgente en delitos contra la seguridad vial en la provincia de Barcelona.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-bold text-white text-base">
                                    ¿En qué juzgados actúa?
                                </h3>
                                <p>
                                    En los juzgados de guardia y tribunales de instancia de los 25 partidos judiciales de la provincia de Barcelona.{' '}
                                    <Link href="/juzgados" className="text-amber-400 hover:underline font-medium">
                                        Ver lista de partidos judiciales
                                    </Link>
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-bold text-white text-base">
                                    ¿Cuánto cuestan sus honorarios?
                                </h3>
                                <p>
                                    Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base en alcoholemia, drogas, velocidad y sin carnet, y 1.480 € para conductores profesionales. Los recargos están tasados por escrito.{' '}
                                    <Link href="/honorarios" className="text-amber-400 hover:underline font-medium">
                                        Ver honorarios
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* LLAMADAS A LA ACCIÓN FINALES */}
                    <section className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold text-white">¿Necesitas asistencia letrada inmediata?</h3>
                            <p className="text-sm text-slate-400">Guardia penal 24 horas y honorarios cerrados por escrito.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 items-center justify-center">
                            <a
                                href="tel:+34605118871"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-colors shadow-lg"
                            >
                                <Phone className="w-4 h-4" />
                                Llamar a la guardia 24 h — +34 605 118 871
                            </a>
                            <Link
                                href="/honorarios"
                                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/10 font-bold text-xs sm:text-sm transition-colors"
                            >
                                Ver honorarios cerrados
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
