import { SiloConfig } from "@/lib/silo-config";
import { cn } from "@/lib/utils";
import { XCircle, AlertTriangle } from "lucide-react";

export function PainPoints({ config }: { config: SiloConfig }) {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-serif">
                                {config.pain_points.title}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {config.pain_points.items.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-50 transition-colors hover:bg-red-50">
                                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 font-medium leading-relaxed">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 text-center">
                        <p className="text-slate-300 text-sm">
                            No arriesgues tu futuro. La primera consulta de valoración es gratuita.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
