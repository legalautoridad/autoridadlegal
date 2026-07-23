import Link from 'next/link';
import { Scale, ShieldAlert, Award, Zap, Truck } from 'lucide-react';

interface ZeroLeakageMenuProps {
    currentService: string;
    municipalitySlug: string;
    municipalityName: string;
}

export function ZeroLeakageMenu({
    currentService,
    municipalitySlug,
    municipalityName
}: ZeroLeakageMenuProps) {
    const services = [
        {
            id: "alcoholemia",
            label: "Alcoholemia",
            icon: Scale,
            color: "border-orange-500/30 hover:border-orange-500 bg-orange-50/5 hover:bg-orange-500/10 text-orange-400",
            activeColor: "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/25"
        },
        {
            id: "drogas",
            label: "Drogas",
            icon: ShieldAlert,
            color: "border-red-500/30 hover:border-red-500 bg-red-50/5 hover:bg-red-500/10 text-red-400",
            activeColor: "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/25"
        },
        {
            id: "sin-carnet",
            label: "Sin Carnet",
            icon: Award,
            color: "border-amber-500/30 hover:border-amber-500 bg-amber-50/5 hover:bg-amber-500/10 text-amber-450",
            activeColor: "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/25"
        },
        {
            id: "velocidad",
            label: "Velocidad",
            icon: Zap,
            color: "border-rose-500/30 hover:border-rose-500 bg-rose-50/5 hover:bg-rose-500/10 text-rose-400",
            activeColor: "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/25"
        },
        {
            id: "profesionales",
            label: "Profesionales",
            icon: Truck,
            color: "border-blue-500/30 hover:border-blue-500 bg-blue-50/5 hover:bg-blue-500/10 text-blue-400",
            activeColor: "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25"
        }
    ];

    return (
        <section className="py-12 bg-slate-900 border-y border-white/5">
            <div className="container px-4 md:px-16 mx-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center space-y-1">
                        <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Servicios Disponibles</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">
                            Defensa de Tránsito de Guardia en {municipalityName}
                        </h3>
                        <p className="text-xs text-slate-400">
                            Cambie de materia manteniendo la jurisdicción de {municipalityName} para una asistencia inmediata.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
                        {services.map((srv) => {
                            const isActive = currentService === srv.id;
                            const IconComponent = srv.icon;
                            const destinationUrl = `/${srv.id}/${municipalitySlug}`;

                            return (
                                <Link
                                    key={srv.id}
                                    href={destinationUrl}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 gap-2 font-medium ${
                                        isActive ? srv.activeColor : srv.color
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5 shrink-0" />
                                    <span className="text-xs md:text-sm tracking-tight">{srv.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
