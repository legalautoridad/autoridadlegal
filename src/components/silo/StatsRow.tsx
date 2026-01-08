import { SiloConfig } from "@/lib/silo-config";
import { cn } from "@/lib/utils";

export function StatsRow({ config }: { config: SiloConfig }) {
    return (
        <section className="bg-slate-900 py-10 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    {config.stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center text-center p-4">
                            <span className={cn("text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r mb-2", config.colors.gradient)}>
                                {stat.value}
                            </span>
                            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
