import { SiloConfig } from "@/lib/silo-config";

const DEFAULT_STATS = [
    { label: "Precio Claro", value: "Cerrado" },
    { label: "Financiación Disponible", value: "Flexible" },
    { label: "Atención", value: "Inmediata" },
];

export function StatsRow({ config }: { config?: SiloConfig }) {
    const stats = (config && config.stats && config.stats.length > 0) ? config.stats : DEFAULT_STATS;

    return (
        <section className="bg-trust-navy border-t border-white/10 py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center text-center p-4">
                            <span className="text-4xl md:text-5xl font-bold mb-2 font-headline-xl text-prestige-gold">
                                {stat.value}
                            </span>
                            <span className="text-sm font-medium uppercase tracking-widest font-label-sm text-white/60">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
