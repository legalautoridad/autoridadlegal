'use client';

import { useEffect } from 'react';
import { RegisterData } from '@/app/lawyer/register/page';
import { ArrowRight, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';

interface Props {
    data: RegisterData;
    onUpdate: (data: Partial<RegisterData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const ZONES = [
    { id: 'BCN_VALLES', label: 'BCN y Vallés', detail: 'Barcelona, Hospitalet, Badalona, Terrassa, Sabadell, Cornellà...' },
    { id: 'MARESME', label: 'Maresme', detail: 'Mataró, Arenys de Mar, Granollers...' },
    { id: 'GARRAF', label: 'Garraf / Penedès', detail: 'Vilanova, Vilafranca, Igualada...' },
    { id: 'MANRESA', label: 'Catalunya Central', detail: 'Manresa, Berga, Vic...' },
];

export default function Step2Zones({ data, onUpdate, onNext, onBack }: Props) {

    // Pricing Logic
    useEffect(() => {
        const basePrice = 150;
        const extraZones = Math.max(0, data.activeZones.length - 1);
        // Extra Matters hardcoded 0 for now as only 1 is active
        const totalPrice = basePrice + (extraZones * 80);

        if (totalPrice !== data.price) {
            onUpdate({ price: totalPrice });
        }
    }, [data.activeZones]);

    const toggleZone = (zoneId: string) => {
        let newZones = [...data.activeZones];
        if (newZones.includes(zoneId)) {
            // Prevent deselecting the only zone? Nah, let them clear but maybe warn
            // Better UX: Allow clear, but disable "Next" if 0.
            newZones = newZones.filter(id => id !== zoneId);
        } else {
            newZones.push(zoneId);
        }
        onUpdate({ activeZones: newZones });
    };

    const isValid = data.activeZones.length > 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Selección de Mercado</h2>
                    <p className="text-slate-500 text-sm">Define tu ámbito de actuación. Precio Base: 150€ (1 Zona incluída).</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Mensual</span>
                    <div className="text-2xl font-black text-slate-900">{data.price}€</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <h3 className="text-xs font-bold text-blue-800 uppercase mb-2">Materia Activa (Incluída)</h3>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-slate-800">Alcoholemias Express</span>
                        <span className="text-[10px] text-slate-400 ml-auto">Próximamente más materias</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase">Zonas Comerciales (+80€ cada extra)</h3>
                    {ZONES.map(zone => {
                        const isSelected = data.activeZones.includes(zone.id);
                        return (
                            <div
                                key={zone.id}
                                onClick={() => toggleZone(zone.id)}
                                className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg transform scale-[1.01]'
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-lg mb-1 flex items-center gap-2">
                                            {zone.label}
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                        </div>
                                        <div className={`text-xs ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                            {zone.detail}
                                        </div>
                                    </div>
                                    <MapPin className={`w-5 h-5 ${isSelected ? 'text-slate-500' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            <div className="pt-4 mt-auto flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${isValid
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Continuar al Pago
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
