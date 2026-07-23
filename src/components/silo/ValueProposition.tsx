import { SiloConfig } from "@/lib/silo-config";
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
            description: config.theme === 'urgency' || config.slug === 'juicios-rapidos'
                ? "Actuación urgente en comisaría o juzgado para proteger tus derechos desde el minuto cero."
                : "Estrategia legal sólida diseñada para maximizar tus resultados y proteger tus intereses."
        }
    ];

    return (
        <section id="como-funciona" className="bg-white py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-headline-lg">
                        ¿Cómo funciona Autoridad Legal?
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 font-body-lg">
                        Simplificamos el acceso a la justicia de alto nivel en 3 pasos claros.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative group">
                                <div className="absolute inset-0 bg-surface rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border border-outline-variant hover:border-prestige-gold/45"></div>
                                <div className="relative p-8 text-center">
                                    <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 border-2 bg-white border-prestige-gold/25 text-trust-navy group-hover:bg-trust-navy group-hover:text-white group-hover:border-trust-navy">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-headline-md">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-body-md">
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
