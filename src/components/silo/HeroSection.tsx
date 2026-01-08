'use client';

import { SiloConfig } from "@/lib/silo-config";
import { cn } from "@/lib/utils";
// import { Link as ScrollLink } from "react-scroll"; // Removed to avoid dependency
import { ShieldCheck, MessageSquare, ArrowRight } from "lucide-react";

export function HeroSection({ config }: { config: SiloConfig }) {
    // Function to trigger chat (simulated by URL param or just visual focus)
    const handleUrgentAction = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('urgency', 'true');
        window.location.href = url.toString();
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
            {/* Dynamic Background Mesh */}
            <div className={cn(
                "absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-20 animate-pulse",
                config.colors.primary.replace('text-', 'bg-') // Hacky mapping, better to rely on config.colors.gradient if provided
            )} />

            <div className={cn(
                "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-20",
                "bg-blue-600"
            )} />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.colors.primary.replace('bg-', 'bg-'))}></span>
                            <span className={cn("relative inline-flex rounded-full h-2 w-2", config.colors.primary.replace('bg-', 'bg-'))}></span>
                        </span>
                        <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">
                            {config.hero.badge_text || "Servicio Jurídico Integral"}
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-serif leading-tight">
                        {config.hero.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {config.hero.subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={handleUrgentAction}
                            className={cn(
                                "w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-900/20 hover:scale-105 transition-all flex items-center justify-center gap-3 group",
                                config.theme === 'urgency' ? "bg-orange-600 hover:bg-orange-700" : "bg-white text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <MessageSquare className="w-5 h-5" />
                            {config.hero.cta}
                        </button>

                        <a
                            href="#como-funciona"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
                        >
                            Conocer el Proceso
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Trust Footer */}
                    <div className="pt-12 flex items-center justify-center gap-8 text-slate-500 text-sm font-medium opacity-80">
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
            </div>
        </section>
    );
}
