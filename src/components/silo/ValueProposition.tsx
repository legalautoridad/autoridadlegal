
import { SiloConfig } from "@/lib/silo-config";
import { cn } from "@/lib/utils";
import { BrainCircuit, UserCheck, Gavel } from "lucide-react";

export function ValueProposition({ config }: { config: SiloConfig }) {
    const steps = [
        {
            icon: BrainCircuit,
            title: "1. Análisis IA Gratuito",
            description: "Nuestra IA analiza tu caso en tiempo real y determina la viabilidad legal inmediatamente."
        },
        {
            icon: UserCheck,
            title: "2. Asignación de Experto",
            description: "Te conectamos con uno de los 3 mejores abogados especializados en tu problema específico."
        },
        {
            icon: Gavel,
            title: "3. Defensa Inmediata",
            description: config.theme === 'urgency'
                ? "Actuación urgente en comisaría o juzgado para proteger tus derechos desde el minuto cero."
                : "Estrategia legal sólida diseñada para maximizar tus resultados y proteger tus intereses."
        }
    ];

    return (
        <section id="como-funciona" className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-serif">
                        ¿Cómo funciona Autoridad Legal?
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Simplificamos el acceso a la justicia de alto nivel en 3 pasos claros.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative group">
                                <div className="absolute inset-0 bg-surface rounded-2xl transform transition-transform group-hover:-translate-y-2 group-hover:shadow-xl border border-transparent group-hover:border-slate-100 duration-300"></div>
                                <div className="relative p-8 text-center">
                                    <div className={cn(
                                        "mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300",
                                        "bg-surface group-hover:bg-white border-2",
                                        config.theme === 'urgency' ? "border-orange-100 group-hover:border-orange-500 text-orange-600" :
                                            config.theme === 'trust' ? "border-slate-100 group-hover:border-slate-500 text-slate-600" :
                                                "border-blue-100 group-hover:border-blue-500 text-blue-600"
                                    )}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
