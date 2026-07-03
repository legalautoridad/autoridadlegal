'use client';

import { useLead } from '../providers/LeadProvider';
import { Phone, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export function DynamicCtaObserver() {
    const { bacLevel, locationName } = useLead();

    const getCtaContent = (level: number, loc: string) => {
        const targetLocation = loc || 'tu localidad';
        
        if (level === 0) {
            return {
                badge: "CONSULTA INMEDIATA",
                title: "¿Necesita asistencia penal de guardia?",
                description: `Hable con nuestros abogados de alcoholemia y juicios rápidos en ${targetLocation}. Asistencia en menos de 15 minutos en comisarías y juzgados.`,
                buttonText: "Llamar Abogado de Guardia",
                buttonHref: "tel:+34605118871",
                alertText: null,
                severityStyle: "from-slate-900 to-slate-950 border-slate-800",
                badgeStyle: "bg-slate-500/20 text-slate-400 border-slate-500/30",
                btnStyle: "bg-prestige-gold text-trust-navy hover:bg-white shadow-prestige-gold/25"
            };
        }

        if (level < 0.25) {
            return {
                badge: "ANÁLISIS DE SINTOMATOLOGÍA",
                title: "Tasa por debajo del límite de alcohol reglamentario",
                description: `Aunque diste ${level.toFixed(2)} mg/l, si eres conductor profesional (límite 0.15 mg/l), novel (límite 0.15 mg/l), o si los agentes reportan síntomas de embriaguez en el atestado, te expones a consecuencias penales en ${targetLocation}.`,
                buttonText: "Consultar Sintomatología Gratis",
                buttonHref: "tel:+34605118871",
                alertText: "Aviso: El acta de signos sintomatológicos puede contradecir la tasa objetiva del etilómetro.",
                severityStyle: "from-emerald-950/80 to-slate-950 border-emerald-900/50",
                badgeStyle: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                btnStyle: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25"
            };
        }

        if (level < 0.60) {
            return {
                badge: "INFRACCIÓN ADMINISTRATIVA",
                title: `Expediente Sancionador en ${targetLocation}`,
                description: `Con ${level.toFixed(2)} mg/l te expones a una multa de hasta 1.000€ y una suspensión del carné de conducir de 3 a 6 meses con pérdida de 4 a 6 puntos. Analizamos posibles defectos de calibración de los alcoholímetros para anular la sanción.`,
                buttonText: "Recurrir Multa de Tráfico",
                buttonHref: "tel:+34605118871",
                alertText: "Importante: Evita la pérdida inmediata de puntos del carné. Solicita asistencia de urgencia.",
                severityStyle: "from-amber-950/80 to-slate-950 border-amber-900/50",
                badgeStyle: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                btnStyle: "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/25"
            };
        }

        // Criminal Level (Delito Penal)
        return {
            badge: "URGENCIA PENAL DELITO 379.2 CP",
            title: `Citación para Juicio Rápido por Alcoholemia en ${targetLocation}`,
            description: `Superar 0.60 mg/l es delito penal en España. Afrontas penas de prisión de 3 a 6 meses, trabajos comunitarios y retirada obligatoria del carné de 1 a 4 años. Te citarán en breve en el Juzgado de Guardia de ${targetLocation}.`,
            buttonText: "⚡ CONTRATAR DEFENSA PENAL - 980€",
            buttonHref: "#contacto",
            alertText: "⚠️ RECOMENDACIÓN CRÍTICA: La ley exige comparecer con abogado. Si conformas con nuestro abogado penalista, reducimos la condena y la retirada de carné en un 33% automáticamente (Art. 801 LECrim).",
            severityStyle: "from-red-950/80 to-slate-950 border-red-900/50 shadow-red-900/5",
            badgeStyle: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
            btnStyle: "bg-red-600 text-white hover:bg-red-700 shadow-red-600/30"
        };
    };

    const cta = getCtaContent(bacLevel, locationName);

    return (
        <div className={`p-8 rounded-3xl border bg-gradient-to-br ${cta.severityStyle} shadow-2xl transition-all duration-500 max-w-2xl mx-auto flex flex-col justify-between text-white relative overflow-hidden`}>
            {/* Visual background accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
                {/* Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase ${cta.badgeStyle}`}>
                    {cta.badge}
                </div>

                {/* Title */}
                <h4 className="text-2xl md:text-3xl font-bold tracking-tight font-headline-md leading-tight text-white">
                    {cta.title}
                </h4>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-350 leading-relaxed font-body-md font-medium">
                    {cta.description}
                </p>

                {/* Compliance Alert Box */}
                {cta.alertText && (
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 text-xs md:text-sm text-slate-300 leading-relaxed">
                        <ShieldAlert className="w-5 h-5 text-prestige-gold shrink-0 mt-0.5" />
                        <span className="font-semibold">{cta.alertText}</span>
                    </div>
                )}
            </div>

            {/* CTAs */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center relative z-10 w-full">
                <a 
                    href={cta.buttonHref}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg font-label-md ${cta.btnStyle}`}
                >
                    <Phone className="w-5 h-5 shrink-0" />
                    {cta.buttonText}
                </a>

                <a 
                    href="#contacto"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl text-slate-350 hover:text-white border border-slate-800 hover:border-slate-600 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-label-md"
                >
                    <FileText className="w-4 h-4 shrink-0" />
                    Solicitar Presupuesto
                    <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
            </div>
        </div>
    );
}
