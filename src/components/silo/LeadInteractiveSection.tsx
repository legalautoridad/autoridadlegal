'use client';

import { LeadProvider } from '../providers/LeadProvider';
import { BacInputForm } from './BacInputForm';
import { DynamicCtaObserver } from './DynamicCtaObserver';

interface LeadInteractiveSectionProps {
    initialLocation: string;
}

export function LeadInteractiveSection({ initialLocation }: LeadInteractiveSectionProps) {
    return (
        <LeadProvider initialLocation={initialLocation}>
            <section className="py-20 bg-slate-100 border-y border-slate-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <span className="text-orange-600 text-xs font-bold uppercase tracking-widest">Simulación y Diagnóstico</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-950 font-serif">Consola de Evaluación Legal en Vivo</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            Mueva el deslizador según el resultado de su prueba de alcoholemia para observar en tiempo real cómo cambia la estrategia de defensa y el nivel de gravedad del expediente.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
                        <BacInputForm />
                        <DynamicCtaObserver />
                    </div>
                </div>
            </section>
        </LeadProvider>
    );
}
