import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function PuntosCrosslink() {
    return (
        <aside className="my-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-prestige-gold/30 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                <div className="w-12 h-12 rounded-xl bg-prestige-gold/15 border border-prestige-gold/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-prestige-gold" />
                </div>
                <div className="space-y-3 flex-1 text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        ¿No llegaste al límite penal, pero te pueden quitar puntos?
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Si el etilómetro marcó entre 0,25 y 0,60 mg/l (entre 0,15 y 0,60 mg/l si eres conductor novel o profesional), o el radar no llegó al exceso que es delito, no hay juicio penal, pero sí una sanción administrativa de hasta 1.000 € y la retirada de 4 a 6 puntos. Pagar con el 50% de descuento cierra el procedimiento y resta los puntos al momento: si te quedan pocos, puedes perder el permiso. Presentar alegaciones a tiempo evita que la sanción sea firme mientras se tramita.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/defensa-puntos-carnet"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-prestige-gold text-slate-950 font-bold text-sm hover:bg-yellow-400 transition-colors shadow-md"
                        >
                            <span>Recurso de multas y puntos del carnet</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

