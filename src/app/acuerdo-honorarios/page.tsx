import { Metadata } from 'next';
import Link from 'next/link';
import { ACUERDO_HONORARIOS_CONFIG } from '@/lib/config/acuerdo-honorarios-source';
import { DEFAULT_OG_IMAGE, PHONE_E164, PHONE_DISPLAY } from '@/lib/config';
import { FileText, Download, ShieldCheck, Scale, Award, AlertCircle, Phone, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Modelo Estándar de Hoja de Encargo y Acuerdo de Honorarios | Autoridad Legal',
    description: 'Modelo transparente de hoja de encargo profesional para juicios rápidos por alcoholemia, drogas, velocidad, sin carné y conductores profesionales. Tarifas cerradas por escrito (IVA y procurador incluidos) e información deontológica ICAB 31.389.',
    alternates: {
        canonical: ACUERDO_HONORARIOS_CONFIG.canonicalUrl,
    },
    openGraph: {
        title: 'Modelo Estándar de Hoja de Encargo y Acuerdo de Honorarios | Autoridad Legal',
        description: 'Modelo oficial de hoja de encargo para la defensa en juicios rápidos de tráfico en Barcelona. Honorarios cerrados de 780 €, 980 € y 1.480 € con desglose de IVA y procurador.',
        url: ACUERDO_HONORARIOS_CONFIG.canonicalUrl,
        type: 'article',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Autoridad Legal — Modelo de Hoja de Encargo Profesional',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Modelo Estándar de Hoja de Encargo y Acuerdo de Honorarios | Autoridad Legal',
        description: 'Modelo oficial de hoja de encargo para la defensa en juicios rápidos de tráfico en Barcelona. Honorarios cerrados de 780 €, 980 € y 1.480 € con desglose de IVA y procurador.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function AcuerdoHonorariosPage() {
    const { professional, sections, title, subtitle, version, effectiveDate, pdfUrl, canonicalUrl } = ACUERDO_HONORARIOS_CONFIG;

    // Schema.org Article JSON-LD
    const articleJsonLd = {
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
                        'name': 'Honorarios',
                        'item': 'https://www.autoridad.legal/honorarios',
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': 'Acuerdo de Honorarios',
                        'item': canonicalUrl,
                    },
                ],
            },
            {
                '@type': 'Article',
                '@id': `${canonicalUrl}#article`,
                'isPartOf': {
                    '@type': 'WebPage',
                    '@id': `${canonicalUrl}#webpage`,
                    'url': canonicalUrl,
                    'name': 'Modelo Estándar de Hoja de Encargo y Acuerdo de Honorarios | Autoridad Legal',
                },
                'headline': `${title} — ${subtitle}`,
                'description': 'Modelo oficial y transparente de hoja de encargo profesional para la asistencia letrada en juicios rápidos por delitos contra la seguridad vial en la provincia de Barcelona.',
                'inLanguage': 'es',
                'mainEntityOfPage': canonicalUrl,
                'datePublished': '2026-08-10T09:00:00+02:00',
                'dateModified': '2026-09-14T09:00:00+02:00',
                'author': {
                    '@type': 'Person',
                    '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person',
                    'name': professional.name,
                    'jobTitle': professional.condition,
                    'identifier': professional.barNumber,
                },
                'publisher': {
                    '@type': 'Organization',
                    '@id': 'https://www.autoridad.legal/#organization',
                    'name': professional.brand,
                    'url': professional.website,
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32">
                {/* Header Section */}
                <header className="relative bg-gradient-to-b from-trust-navy via-slate-900 to-slate-950 border-b border-white/10 pt-12 pb-16 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Link href="/" className="hover:text-prestige-gold transition-colors">Inicio</Link>
                            <span>/</span>
                            <Link href="/honorarios" className="hover:text-prestige-gold transition-colors">Honorarios</Link>
                            <span>/</span>
                            <span className="text-prestige-gold">Acuerdo de Honorarios</span>
                        </nav>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-semibold uppercase tracking-wider">
                            <Award className="w-4 h-4" />
                            Deontología Profesional ICAB 31.389
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {title}
                        </h1>

                        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-white/10 pt-4">
                            <span><strong>Versión:</strong> {version}</span>
                            <span>&bull;</span>
                            <span><strong>Vigencia:</strong> {effectiveDate}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-400 font-semibold">Documento Público Transparente</span>
                        </div>

                        {/* PDF Download Banner */}
                        <div className="pt-2">
                            <a
                                href={pdfUrl}
                                download="acuerdo-honorarios.pdf"
                                className="inline-flex items-center gap-3 bg-prestige-gold hover:bg-amber-400 text-trust-navy font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-prestige-gold/20 transition-all text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Descargar Modelo Oficial en PDF (32 KB)
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Semantic Document Body */}
                <article className="max-w-4xl mx-auto px-6 py-12 space-y-12 text-slate-200">
                    
                    {/* Section 1 */}
                    <section id="identificacion" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            1. Identificación del profesional y del cliente
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-prestige-gold uppercase tracking-wider">
                                    1.1 Profesional Responsable
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                    <div><strong className="text-white">Profesional responsable:</strong> {professional.name}</div>
                                    <div><strong className="text-white">Condición:</strong> {professional.condition}</div>
                                    <div><strong className="text-white">Colegio Profesional:</strong> {professional.barAssociation}</div>
                                    <div><strong className="text-white">Colegiado Nº:</strong> {professional.barNumber}</div>
                                    <div><strong className="text-white">Marca comercial:</strong> {professional.brand}</div>
                                    <div><strong className="text-white">Domicilio profesional:</strong> {professional.address}</div>
                                    <div><strong className="text-white">Teléfono:</strong> {professional.phone}</div>
                                    <div><strong className="text-white">Correo electrónico:</strong> {professional.email}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-base font-bold text-prestige-gold uppercase tracking-wider">
                                    1.2 Datos del Cliente
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                    En las hojas de encargo individualizadas se incorporan los datos identificativos y de contacto facilitados por el cliente (nombre completo, DNI/NIE/pasaporte, domicilio, teléfono y correo electrónico) para la gestión del encargo y la defensa jurídica contratada.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section id="objeto" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            2. Objeto del encargo
                        </h2>
                        <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
                            <p>
                                El cliente encarga al profesional la prestación de asistencia jurídica en relación con un procedimiento de juicio rápido o actuación penal por delito contra la seguridad vial (alcoholemia, drogas al volante, exceso de velocidad, conducción sin carné o situación específica de conductor profesional) ante el juzgado o partido judicial competente.
                            </p>
                            <p>
                                El servicio contratado corresponde a la defensa técnica en el procedimiento con conformidad o procedimiento de primera instancia dentro del alcance descrito en esta hoja.
                            </p>
                            <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/20 text-xs text-amber-300 leading-relaxed font-medium">
                                <strong>Aviso Deontológico de Garantía de Resultado:</strong> La aceptación de este encargo no supone garantía de un resultado judicial concreto. Las decisiones corresponden en exclusiva a los órganos judiciales y dependen de las circunstancias, hechos y pruebas de cada procedimiento.
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section id="actuaciones-incluidas" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                            3. Actuaciones incluidas
                        </h2>
                        <p className="text-sm text-slate-300">Dentro del alcance contratado se incluyen las siguientes actuaciones:</p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            {sections.find(s => s.id === 'actuaciones-incluidas')?.items?.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section id="actuaciones-no-incluidas" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-red-500 pl-4">
                            4. Actuaciones no incluidas
                        </h2>
                        <p className="text-sm text-slate-300">Salvo contratación o pacto escrito posterior, no están incluidas:</p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            {sections.find(s => s.id === 'actuaciones-no-incluidas')?.items?.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section id="precio-base" className="space-y-6 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            5. Precio del servicio base
                        </h2>
                        <p className="text-sm text-slate-300">
                            Tarifas cerradas por escrito para el supuesto base en juicios rápidos de seguridad vial (derechos de procurador e IVA 21 % incluidos):
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10">
                                        <th className="py-3 px-4">Servicio</th>
                                        <th className="py-3 px-4">Base Imponible</th>
                                        <th className="py-3 px-4">IVA (21 %)</th>
                                        <th className="py-3 px-4 text-right">Total (Procurador inc.)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-200">
                                    {sections.find(s => s.id === 'precio-base')?.basePricesTable?.map((r, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-white">{r.servicio}</td>
                                            <td className="py-3 px-4">{r.base}</td>
                                            <td className="py-3 px-4">{r.iva}</td>
                                            <td className="py-3 px-4 text-right font-extrabold text-prestige-gold">{r.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section id="suplementos" className="space-y-6 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            6. Suplementos tasados
                        </h2>
                        <p className="text-sm text-slate-300">
                            Los suplementos solo se aplican cuando la circunstancia correspondiente concurre y exige un alcance distinto del servicio base, comunicándose siempre por escrito antes de la contratación. Todos los importes incluyen IVA:
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10">
                                        <th className="py-3 px-4">Circunstancia</th>
                                        <th className="py-3 px-4">Suplemento</th>
                                        <th className="py-3 px-4">Aplica a</th>
                                        <th className="py-3 px-4">Descripción y Causa Procesal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-200">
                                    {sections.find(s => s.id === 'suplementos')?.supplementsTable?.map((r, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-white">{r.circunstancia}</td>
                                            <td className="py-3 px-4 font-bold text-amber-400">{r.suplemento}</td>
                                            <td className="py-3 px-4">{r.aplica}</td>
                                            <td className="py-3 px-4 text-xs leading-relaxed text-slate-300">{r.descripcion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Accumulation Note Callout */}
                        <div className="p-4 bg-slate-950/90 rounded-xl border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-medium flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-amber-400 block mb-1">Nota Informativa sobre la Cláusula de Acumulación:</strong>
                                La Hoja de Encargo individualizada concretará, en función del supuesto específico del cliente, si los suplementos concurrentes se estructuran mediante acumulación justificada por actuaciones independientes o mediante presupuesto cerrado final único.
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section id="formas-pago" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            7. Formas de pago y facilidades
                        </h2>
                        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
                            <p>El cliente puede elegir entre las modalidades de pago disponibles:</p>
                            <ul className="space-y-2 pl-4 list-disc">
                                <li><strong>Pago Íntegro Directo:</strong> Abono completo al formalizar la hoja de encargo mediante tarjeta o transferencia bancaria en la plataforma de pago en custodia.</li>
                                <li><strong>Modalidad Híbrida 60/40:</strong> 60 % inicial al contratar y 40 % restante a los 30 días.</li>
                                <li><strong>Financiación Externa:</strong> Hasta 12 meses (Klarna/Stripe), sujeta a aprobación de la entidad bancaria colaboradora.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section id="modalidad-6040" className="space-y-6 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            8. Modalidad de pago 60/40
                        </h2>
                        <p className="text-sm text-slate-300">
                            La modalidad híbrida 60/40 permite abonar el 60 % inicial al contratar y el 40 % restante a los 30 días:
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/10">
                                        <th className="py-3 px-4">Servicio</th>
                                        <th className="py-3 px-4">Precio Total</th>
                                        <th className="py-3 px-4">Primer Pago (60 %)</th>
                                        <th className="py-3 px-4 text-right">Segundo Pago (40 % a 30 días)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-200">
                                    {sections.find(s => s.id === 'modalidad-6040')?.payment6040Table?.map((r, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-white">{r.servicio}</td>
                                            <td className="py-3 px-4 font-bold text-prestige-gold">{r.precioTotal}</td>
                                            <td className="py-3 px-4 font-semibold text-emerald-400">{r.pago60}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-white">{r.pago40}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section id="impago" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            9. Impago del importe pendiente
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            En caso de rechazo, devolución o falta de pago del segundo cargo pendiente en la modalidad fraccionada, la hoja de encargo prevé una cantidad de <strong>300 € en concepto de gestión de impago y recobro</strong>, además de los importes pendientes y acciones de reclamación correspondientes.
                        </p>
                    </section>

                    {/* Section 10-12 */}
                    <section id="condiciones-generales" className="space-y-8 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-white">10. Documentación y colaboración del cliente</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                El cliente se compromete a facilitar información veraz y completa, entregar la documentación disponible, comunicar citaciones judiciales de inmediato y seguir las indicaciones técnicas del letrado.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white">11. Información sobre el procedimiento</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                El profesional informará puntualmente sobre las actuaciones esenciales, opciones procesales y consecuencias previsibles de la conformidad o del juicio ordinario.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white">12. Comunicación con el cliente</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Las comunicaciones se realizarán por teléfono, correo electrónico, mensajería profesional y plataformas electrónicas seguras.
                            </p>
                        </div>
                    </section>

                    {/* Section 13 */}
                    <section id="proteccion-datos" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            13. Protección de datos personales
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            El responsable del tratamiento es Santiago Giménez Olavarriaga (Av. Diagonal 437, Principal 3ª, 08036 Barcelona, <a href={`mailto:${professional.email}`} className="text-prestige-gold hover:underline">{professional.email}</a>). Los datos se tratarán para prestar la asistencia jurídica contratada, gestionar la facturación y cumplir obligaciones deontológicas y legales.
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Puede consultar la información completa sobre privacidad y ejercicio de derechos en la{' '}
                            <Link href="/legal/privacy" className="text-prestige-gold hover:underline font-semibold">
                                Política de Privacidad oficial
                            </Link>.
                        </p>
                    </section>

                    {/* Section 14-17 */}
                    <section id="marco-deontologico" className="space-y-8 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-white">14. Facturación</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                El profesional emitirá la factura oficial correspondiente con desglose de base imponible, 21 % de IVA, derechos de procurador y suplementos acordados.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white">15. Desistimiento y terminación</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Se recabará autorización expresa para el inicio inmediato de las actuaciones de urgencia. La terminación anticipada no elimina los honorarios devengados por actuaciones ya realizadas.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white">16. Sustitución o colaboración profesional</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Cuando la asistencia urgente en guardia lo requiera, el profesional podrá coordinarse con otros letrados o procuradores garantizando la máxima calidad defensiva.
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white">17. Reclamaciones y solución de controversias</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Las consultas o reclamaciones profesionales podrán dirigirse ante el letrado y, en su caso, ante los servicios de información y arbitraje del Ilustre Colegio de la Abogacía de Barcelona (<a href="https://www.icab.cat" target="_blank" rel="noopener noreferrer" className="text-prestige-gold hover:underline">www.icab.cat</a>).
                            </p>
                        </div>
                    </section>

                    {/* Section 18 */}
                    <section id="aceptacion" className="space-y-4 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            18. Modelización de Aceptación
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            La Hoja de Encargo individualizada formalizada con cada cliente recoge expresamente la modalidad de pago elegida, el desglose final de suplementos aprobados y el precio total con IVA.
                        </p>
                    </section>

                    {/* Section 19 */}
                    <section id="firma" className="space-y-6 bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-prestige-gold/40 shadow-xl">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            19. Firma
                        </h2>
                        <p className="text-sm text-slate-300 font-medium">
                            En [lugar], a [fecha].
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {/* El profesional */}
                            <div className="bg-slate-950/80 p-6 rounded-xl border border-white/10 space-y-3 text-sm">
                                <h3 className="font-bold text-white text-base border-b border-white/10 pb-2">El profesional</h3>
                                <p className="text-slate-300"><strong>Nombre:</strong> Santiago Giménez Olavarriaga</p>
                                <p className="text-slate-300"><strong>ICAB:</strong> 31.389</p>
                                <div className="pt-6 border-t border-white/10">
                                    <span className="text-slate-400 text-xs font-mono">Firma: ___________________________</span>
                                </div>
                            </div>

                            {/* El cliente */}
                            <div className="bg-slate-950/80 p-6 rounded-xl border border-white/10 space-y-3 text-sm">
                                <h3 className="font-bold text-white text-base border-b border-white/10 pb-2">El cliente</h3>
                                <p className="text-slate-300"><strong>Nombre:</strong> [nombre completo]</p>
                                <p className="text-slate-300"><strong>Documento:</strong> [DNI/NIE/Pasaporte]</p>
                                <div className="pt-6 border-t border-white/10">
                                    <span className="text-slate-400 text-xs font-mono">Firma: ___________________________</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                        <Link
                            href="/honorarios"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-prestige-gold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a Honorarios y Precios Base
                        </Link>

                        <a
                            href={pdfUrl}
                            download="acuerdo-honorarios.pdf"
                            className="inline-flex items-center gap-2 text-sm font-bold bg-prestige-gold hover:bg-amber-400 text-trust-navy py-3 px-6 rounded-xl transition-all shadow-lg shadow-prestige-gold/20"
                        >
                            <Download className="w-4 h-4" />
                            Descargar Modelo PDF
                        </a>
                    </div>
                </article>
            </main>
        </>
    );
}
