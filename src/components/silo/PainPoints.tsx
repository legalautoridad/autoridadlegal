import { SiloConfig } from "@/lib/silo-config";
import { XCircle, AlertTriangle } from "lucide-react";

export function PainPoints({ config }: { config: SiloConfig }) {
    return (
        <section className="bg-surface-ice py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-full bg-prestige-gold/15 text-prestige-gold">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-headline-lg">
                                {config.pain_points.title}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {config.pain_points.items.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 bg-surface-ice/50 border-outline-variant hover:border-prestige-gold/50"
                                >
                                    <XCircle className="h-6 w-6 shrink-0 mt-0.5 text-prestige-gold" />
                                    <span className="text-slate-700 font-medium leading-relaxed font-body-md">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-trust-navy text-white p-6 text-center font-label-md text-sm">
                        <p>
                            No arriesgues tu futuro. La primera consulta de valoración es gratuita.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
