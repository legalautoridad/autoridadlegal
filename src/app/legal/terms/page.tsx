import { Metadata } from 'next';
import { FileText, ShieldCheck, CreditCard, Lock, Clock, Scale, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Términos y Condiciones de Contratación | Autoridad Legal',
    description: 'Condiciones de contratación del servicio de defensa penal en delitos de tráfico. Precio cerrado blindado, garantía Escrow y respuesta prioritaria.',
    alternates: {
        canonical: 'https://www.autoridad.legal/legal/terms',
    },
    openGraph: {
        title: 'Términos y Condiciones de Contratación',
        description: 'Condiciones de contratación del servicio de defensa penal en delitos de tráfico.',
        url: 'https://www.autoridad.legal/legal/terms',
        siteName: 'Autoridad Legal',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Términos y Condiciones de Contratación',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Términos y Condiciones de Contratación',
        description: 'Condiciones de contratación del servicio de defensa penal en delitos de tráfico.',
        images: ['/og-image.jpg'],
    },
};

export default function TermsPage() {
    const updatedDate = "22 de julio de 2026";

    return (
        <main className="min-h-screen bg-slate-900 text-white py-16 md:py-24 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Banner */}
                <div className="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                        <FileText className="w-4 h-4" /> Contratación Legal &amp; Transparencia
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        CONDICIONES DE CONTRATACIÓN
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm">
                        Última actualización: <span className="text-slate-200 font-semibold">{updatedDate}</span>
                    </p>
                </div>

                {/* Section 1: Objeto y Partes del Contrato */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold shrink-0">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            1. Objeto y Partes del Contrato
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Las presentes Condiciones de Contratación regulan la relación jurídica y operativa entre el usuario (en adelante, el &quot;Cliente&quot;) y la plataforma web <strong className="text-white">Autoridad Legal</strong>.
                    </p>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-prestige-gold font-bold text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Plataforma Tecnológica LegalTech
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Autoridad Legal actúa como una infraestructura de control de calidad jurídica y una plataforma tecnológica (LegalTech) especializada exclusivamente en delitos contra la seguridad vial.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-prestige-gold font-bold text-base flex items-center gap-2">
                                <Scale className="w-4 h-4" /> Dirección Letrada Exclusiva
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                La prestación material y técnica del servicio de defensa legal es ejecutada de forma exclusiva por <strong className="text-white">Santiago Giménez Olavarriaga</strong> (Abogado colegiado ICAB 31389), quien actúa como Letrado Director.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-prestige-gold font-bold text-base flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Rol Operativo de Intermediación
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                El rol de la plataforma consiste en operar como intermediario tecnológico para facilitar el contacto automatizado, la recolección inicial de datos, el cobro y la gestión del expediente mediante una aplicación web de control.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/50 border border-white/10 text-slate-300 text-sm md:text-base leading-relaxed">
                        Los servicios ofrecidos abarcan la asistencia letrada y defensa en casos de <strong className="text-white">alcoholemia</strong>, <strong className="text-white">conducción sin carnet</strong>, <strong className="text-white">exceso de velocidad</strong> y <strong className="text-white">defensa jurídica específica para profesionales del sector del transporte</strong>.
                    </div>
                </section>

                {/* Section 2: Condiciones Económicas y "Precio Cerrado Blindado" */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            2. Condiciones Económicas y &quot;Precio Cerrado Blindado&quot;
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        El modelo económico está diseñado para dotar de total transparencia al proceso de contratación en situaciones de urgencia penal:
                    </p>

                    {/* Price Card */}
                    <div className="p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/30 space-y-4 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Tarifa Única Estandarizada</span>
                                <h3 className="text-3xl font-extrabold text-white">1.149,50 € <span className="text-sm font-normal text-slate-400">(IVA Incluido)</span></h3>
                            </div>
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                                950,00 € Base Imponible
                            </span>
                        </div>

                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            Esta tarifa es única e incluye de forma íntegra los honorarios del abogado, los honorarios del Procurador de los Tribunales, el IVA correspondiente y toda la gestión administrativa requerida por la plataforma.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                                <p className="text-amber-400 font-bold text-sm">⚡ Suplemento Hiperurgencia (+50 €)</p>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Se aplicará en aquellos casos en los que el juicio se celebre en un plazo inferior a 24 horas desde el momento de la contratación.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                                <p className="text-emerald-400 font-bold text-sm">💳 Financiación a Medida</p>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Opción de financiar el importe en cuotas de 3, 6 o 12 meses a través de entidades financieras colaboradoras como SeQura o Klarna.
                                </p>
                            </div>
                        </div>

                        {/* Protocolo 60/40 */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-2 mt-2">
                            <p className="text-blue-400 font-bold text-sm">🛡️ Protocolo de Emergencia 60/40</p>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                Si la pasarela de pago inicial rechaza el perfil de riesgo del usuario, el sistema activará automáticamente el denominado &quot;Protocolo 60/40&quot;. Este protocolo de emergencia permite realizar un cobro inicial del 60 % (588 €) para bloquear la prestación del servicio. El 40 % restante del importe total se cobrará de manera diferida a los 30 días.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Sistema de Custodia y Garantía Transaccional ("Escrow") */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            3. Sistema de Custodia y Garantía Transaccional (&quot;Escrow&quot;)
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Para asegurar la viabilidad de la operación y proteger al Cliente, Autoridad Legal emplea un sistema de garantía financiera:
                    </p>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-4">
                            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                                Los fondos abonados por el Cliente quedan bloqueados en una cuenta de custodia segura administrada directamente por la plataforma.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                                El dinero depositado solo se libera una vez que se acredita documentalmente el cumplimiento del servicio mediante la subida de la sentencia judicial o el acta de conformidad.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
                            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-emerald-200 text-sm md:text-base font-semibold leading-relaxed">
                                En el supuesto de que el abogado no asista al juicio correspondiente, la plataforma garantiza el reembolso íntegro del dinero al Cliente.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Acuerdos de Nivel de Servicio (SLA) y Operativa */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            4. Acuerdos de Nivel de Servicio (SLA) y Operativa
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-blue-400 font-bold text-base flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Horario Diurno (09:00 AM – 20:00 PM)
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Para aquellas contrataciones que se formalicen en horario diurno, comprendido entre las 09:00 AM y las 20:00 PM, se garantiza que el contacto profesional se realizará en un plazo máximo de 2 horas.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-purple-400 font-bold text-base flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Protocolo Nocturno (Madrugada)
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                En el caso de contrataciones realizadas de madrugada, el expediente se procesa de forma inmediata y el abogado contactará con el Cliente antes de las 09:00 AM de ese mismo día.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-prestige-gold font-bold text-base flex items-center gap-2">
                                <Scale className="w-4 h-4" /> Revisión y Citación Judicial
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                El abogado revisa el expediente completo recabado previamente por el sistema automatizado para poder contactar al Cliente proponiendo una estrategia directa y solicitando la documentación pertinente. El Cliente y el abogado se citan físicamente el día del juicio, momento en el que el Cliente firma formalmente el contrato de prestación de servicios.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <h3 className="text-emerald-400 font-bold text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Negociación e Intervención Procesal
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                En sede judicial, el abogado negocia con la Fiscalía con el objetivo de reducir al máximo tanto la pena monetaria como el tiempo de retirada del carnet de conducir. Finalizada la intervención, el abogado cierra el expediente en el sistema aportando la sentencia y el resultado obtenido.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 5: Pedagogía Estratégica y Defensa */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            5. Pedagogía Estratégica y Defensa
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Autoridad Legal recopila información y expone escenarios procesales mediante sus sistemas para preparar la mejor defensa posible:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <p className="text-prestige-gold font-bold text-sm">🧪 Tasas de Alcoholemia 0.60 – 0.65 mg/l</p>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                En casos donde las tasas de alcoholemia oscilan entre 0.60 y 0.65 mg/l, se evalúa el margen de error técnico del etilómetro para intentar transformar el delito penal en una infracción administrativa.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <p className="text-prestige-gold font-bold text-sm">📉 Reducción de Cuota Multa (2 € – 4 €/día)</p>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                Se solicitan datos socioeconómicos del Cliente, como información sobre hijos a cargo o hipotecas, para negociar ante el fiscal la imposición de una cuota de multa diaria mínima situada entre 2 € y 4 €.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 md:col-span-2">
                            <p className="text-amber-400 font-bold text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Defensa Especializada para Profesionales del Transporte
                            </p>
                            <div className="space-y-2 text-slate-300 text-xs md:text-sm leading-relaxed">
                                <p>
                                    A los profesionales del sector del transporte se les informa que la aceptación de una conformidad implica una reducción de un tercio de la pena, pero conlleva de forma obligatoria la retirada inmediata del carnet de conducir.
                                </p>
                                <p className="text-slate-200">
                                    Como alternativa para estos profesionales, se les expone que acudir a un juicio ordinario permite ganar un periodo temporal de 6 a 18 meses de actividad laboral antes de la ejecución de una sentencia firme.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
