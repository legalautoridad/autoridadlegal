import { Metadata } from 'next';
import { PHONE_DISPLAY } from '@/lib/config';
import { ShieldCheck, Scale, PhoneCall, Bot, AlertTriangle, UserCheck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: "Aviso Legal y Condiciones de Uso | Autoridad Legal",
    description: "Información registral LSSICE, datos del letrado director Santiago Giménez Olavarriaga (ICAB 31389) y condiciones de exención de responsabilidad sobre el asesoramiento automatizado.",
    alternates: {
        canonical: "https://www.autoridad.legal/legal/legal-notice",
    },
    openGraph: {
        title: "Aviso Legal y Condiciones de Uso",
        description: "Información registral LSSICE y datos del letrado director Santiago Giménez Olavarriaga (ICAB 31389).",
        url: "https://www.autoridad.legal/legal/legal-notice",
        siteName: "Autoridad Legal",
        locale: "es_ES",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Aviso Legal y Condiciones de Uso",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Aviso Legal y Condiciones de Uso",
        description: "Información registral LSSICE y datos del letrado director Santiago Giménez Olavarriaga (ICAB 31389).",
        images: ["/og-image.jpg"],
    },
};

export default function LegalNoticePage() {
    const updatedDate = "22 de julio de 2026";

    return (
        <main className="min-h-screen bg-slate-900 text-white py-16 md:py-24 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Title */}
                <div className="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" /> LSSICE &amp; Cumplimiento Normativo
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        AVISO LEGAL Y CONDICIONES DE USO
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm">
                        Última actualización: <span className="text-slate-200 font-semibold">{updatedDate}</span>
                    </p>
                </div>

                {/* Section 1: Información Registral y Datos de Contacto */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            1. Información Registral y Datos de Contacto (LSSICE)
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        En cumplimiento de lo dispuesto en la normativa vigente de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE), se expone a continuación la información identificativa de la titularidad de esta plataforma web:
                    </p>

                    {/* Identificative Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <UserCheck className="w-4 h-4" /> Titularidad y Dirección Letrada
                            </div>
                            <p className="text-white font-semibold text-base">Santiago Giménez Olavarriaga</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <Scale className="w-4 h-4" /> Cualificación Profesional
                            </div>
                            <p className="text-white font-semibold text-base">Abogado penalista especializado en seguridad vial</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" /> Colegiación Oficial
                            </div>
                            <p className="text-white font-semibold text-base">Ilustre Colegio de la Abogacía de Barcelona (ICAB 31389)</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <UserCheck className="w-4 h-4" /> Cargo Operativo
                            </div>
                            <p className="text-white font-semibold text-base">Letrado Director de Autoridad Legal</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1.5 md:col-span-2">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <MapPin className="w-4 h-4" /> Sede de Actuación
                            </div>
                            <p className="text-white font-semibold text-base">Provincia de Barcelona, Comunidad Autónoma de Cataluña, España</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950/50 border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-prestige-gold text-sm font-bold uppercase tracking-wider">
                            <PhoneCall className="w-4 h-4" /> Vías de Contacto
                        </div>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            En la versión inicial (MVP), la comunicación y atención de urgencia al usuario se realiza de forma directa mediante la línea telefónica de guardia (<strong className="text-white">{PHONE_DISPLAY}</strong>). Las funcionalidades de WhatsApp IA y chatbot conversacional se incorporarán en fases posteriores.
                        </p>
                    </div>
                </section>

                {/* Section 2: Exención de Responsabilidad sobre el Asesoramiento Legal Automatizado */}
                <section className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            2. Exención de Responsabilidad sobre el Asesoramiento Legal Automatizado
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Autoridad Legal es una plataforma con optimización tecnológica que emplea sistemas avanzados, visibilidad para modelos de lenguaje (LLMs) y asistentes conversacionales para agilizar el contacto con el cliente. Respecto al uso de estas herramientas, el Usuario acepta expresamente las siguientes condiciones:
                    </p>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-4">
                            <span className="w-6 h-6 rounded-full bg-prestige-gold/20 text-prestige-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                                Las interacciones gestionadas a través del chatbot incrustado o mediante el chat de WhatsApp tienen una finalidad estrictamente organizativa y de triaje preliminar.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-4">
                            <span className="w-6 h-6 rounded-full bg-prestige-gold/20 text-prestige-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                                La función de los sistemas automatizados es recabar los datos iniciales para que el abogado complete la ficha en la aplicación y pueda solicitar al usuario la documentación pertinente para preparar la defensa.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-amber-200 text-sm md:text-base font-medium leading-relaxed">
                                Ninguna información, respuesta, orientación o pedagogía estratégica proporcionada de forma automatizada por la plataforma o sus asistentes conversacionales constituye asesoramiento jurídico ni legal vinculante.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start gap-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                                La relación formal abogado-cliente y el asesoramiento vinculante únicamente se perfeccionan cuando el cliente y el letrado se citan, el usuario firma el contrato de prestación de servicios y el abogado asume la dirección técnica del caso ante los tribunales.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
