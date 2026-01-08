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
    { id: 'BCN_VALLES', label: 'BCN y Vallés', detail: 'Barcelona, Badalona, L\'Hospitalet, Terrassa, Sabadell, Cerdanyola, Rubí, Sant Cugat, Gavà, Cornellà, Sant Boi, El Prat, Santa Coloma.' },
    { id: 'MARESME', label: 'Maresme', detail: 'Mataró, Arenys de Mar, Granollers, Mollet del Vallès.' },
    { id: 'GARRAF', label: 'Garraf / Sur', detail: 'Vilanova i la Geltrú, Vilafranca del Penedès, Igualada, Sant Feliu de Llobregat, Martorell.' },
    { id: 'MANRESA', label: 'Manresa / Norte', detail: 'Manresa, Berga, Vic.' },
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

            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Selecciona tus Zonas (+80€ cada extra)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ZONES.map(zone => {
                            const isSelected = data.activeZones.includes(zone.id);
                            return (
                                <div
                                    key={zone.id}
                                    onClick={() => toggleZone(zone.id)}
                                    className={`group cursor-pointer rounded-xl border-2 transition-all p-4 relative overflow-hidden ${isSelected
                                        ? 'border-slate-900 bg-slate-50'
                                        : 'border-slate-100 hover:border-slate-300 hover:bg-white bg-white'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                                            ? 'bg-slate-900 border-slate-900'
                                            : 'border-slate-300 bg-white'
                                            }`}>
                                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-bold text-lg ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {zone.label}
                                                </span>
                                                {isSelected && (
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full uppercase">
                                                        Seleccionado
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                <strong className="text-xs uppercase tracking-wide text-slate-400 block mb-1">Partidos Judiciales:</strong>
                                                {zone.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MAP MOVED TO BACKLOG FOR MVP
                    <div className="hidden">
                        <InteractiveZoneMap
                            activeZones={data.activeZones}
                            onToggle={toggleZone}
                        />
                    </div>
                */}
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
        </div >
    );
}
