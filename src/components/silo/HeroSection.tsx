'use client';

import { SiloConfig } from "@/lib/silo-config";
import { ShieldCheck, MessageSquare, ArrowRight } from "lucide-react";

export interface HeroSectionProps {
    config: SiloConfig;
    backgroundImage?: string;
}

export function HeroSection({ config, backgroundImage }: HeroSectionProps) {
    const handleUrgentAction = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('urgency', 'true');
        window.location.href = url.toString();
    };

    const isUrgency = config.theme === 'urgency' || config.slug === 'juicios-rapidos' || config.slug === 'alcoholemia';

    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 hero-gradient">
            {backgroundImage ? (
                <>
                    <div className="absolute inset-0 opacity-25">
                        <img 
                            alt={`${config.hero.specialty} background`} 
                            className="w-full h-full object-cover" 
                            src={backgroundImage}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-trust-navy via-trust-navy/85 to-transparent"></div>
                </>
            ) : (
                <>
                    {/* Dynamic Background Mesh */}
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-20 animate-pulse bg-prestige-gold" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-20 bg-trust-navy" />
                </>
            )}

            <div className="container relative z-10 px-4 md:px-16 mx-auto w-full">
                <div className={isUrgency ? "grid md:grid-cols-12 gap-12 items-center py-16" : "max-w-4xl mx-auto text-center space-y-8 py-16"}>
                    <div className={isUrgency ? "space-y-8 md:col-span-7 text-left" : "space-y-8"}>
                        
                        {/* Urgent Badge */}
                        {isUrgency && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/15 border border-prestige-gold/30">
                                <span className="w-2.5 h-2.5 rounded-full bg-prestige-gold animate-pulse"></span>
                                <span className="font-label-sm text-xs text-prestige-gold font-bold uppercase tracking-widest">{config.hero.badge_text || 'Atención Inmediata 24h'}</span>
                            </div>
                        )}

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight font-headline-xl">
                            {config.hero.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-body-lg">
                            {config.hero.subtitle}
                        </p>

                        {/* CTAs */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-2 ${isUrgency ? 'justify-start' : 'justify-center'}`}>
                            <button
                                onClick={handleUrgentAction}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-trust-navy bg-prestige-gold hover:bg-secondary-fixed shadow-lg shadow-prestige-gold/25 hover:scale-105 transition-all flex items-center justify-center gap-3 group font-label-md"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {config.hero.cta}
                            </button>

                            <a
                                href="#como-funciona"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2 font-label-md"
                            >
                                Conocer el Proceso
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Trust Footer */}
                        <div className={`pt-8 flex items-center gap-8 text-slate-400 text-sm font-medium opacity-80 font-label-sm ${isUrgency ? 'justify-start' : 'justify-center'}`}>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Colegiados Expertos
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex text-yellow-500">★★★★★</span>
                                +500 Reseñas
                            </div>
                        </div>
                    </div>

                    {isUrgency && (
                        <div className="hidden md:block md:col-span-5 pl-4">
                            <div className="glass-card p-8 rounded-xl space-y-6 border-l-4 border-l-prestige-gold shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                                <h3 className="font-headline-md text-xl font-bold text-white tracking-wide">Próximo Turno de Guardia</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                                        <span className="font-label-md text-sm text-white/90 font-medium">Juzgados de Guardia</span>
                                        <span className="font-label-md text-xs bg-emerald-500/25 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold tracking-wide">DISPONIBLE</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                                        <span className="font-label-md text-sm text-white/90 font-medium">Tiempo de Respuesta</span>
                                        <span className="font-label-md text-sm text-prestige-gold font-bold">&lt; 15 min</span>
                                    </div>
                                </div>
                                
                                <p className="font-label-sm text-xs text-white/60 leading-relaxed italic border-t border-white/10 pt-4">
                                    * Servicio especializado en urgencias legales y asistencia inmediata 24h ante atestados y detenciones.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
