'use client';

import { useEffect } from 'react';
import { RegisterData } from '@/app/lawyer/register/page';
import { ArrowRight, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import InteractiveZoneMap from './InteractiveZoneMap';

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

                {/* MATTERS GRID */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Especialidad Principal</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Active Matter */}
                        <div className="bg-white p-3 rounded-lg border-2 border-green-500 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-bl font-bold">ACTIVA</div>
                            <span className="font-bold text-slate-900 text-sm">Alcoholemia</span>
                        </div>

                        {/* Future Matters */}
                        {['Violencia Género', 'Divorcios', 'Estafas', 'Extranjería', 'Laboral', 'Herencias', 'Accidentes', 'Mercantil', 'Penal General', 'Inmobiliario'].map(m => (
                            <div key={m} className="bg-slate-50 p-3 rounded-lg border border-slate-100 opacity-60 grayscale cursor-not-allowed">
                                <div className="text-[10px] text-slate-400 bg-slate-200 w-fit px-1 rounded mb-1">Próximamente</div>
                                <span className="font-medium text-slate-500 text-sm">{m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
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

                    {/* MAP VISUAL */}
                    <div className="md:w-1/3 flex flex-col items-center justify-start min-h-[300px]">
                        <InteractiveZoneMap
                            activeZones={data.activeZones}
                            onToggle={toggleZone}
                        />
                        <p className="text-[10px] text-slate-400 mt-3 text-center px-4">
                            Selecciona las zonas en el mapa o en la lista para ver los partidos judiciales incluidos.
                        </p>
                    </div>
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
