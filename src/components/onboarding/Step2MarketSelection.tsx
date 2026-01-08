'use client';

import { useState, useEffect } from 'react';
import { OnboardingData } from '@/app/lawyer/onboarding/page';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Step2Props {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const PARTIDOS_JUDICIALES = [
    'Arenys de Mar', 'Badalona', 'Barcelona', 'Berga', 'Cerdanyola del Vallès',
    'Cornellà de Llobregat', 'El Prat de Llobregat', 'Esplugues de Llobregat',
    'Gavà', 'Granollers', 'Hospitalet de Llobregat', 'Igualada', 'Manresa',
    'Martorell', 'Mataró', 'Mollet del Vallès', 'Rubí', 'Sabadell',
    'Sant Boi de Llobregat', 'Sant Feliu de Llobregat', 'Santa Coloma de Gramenet',
    'Terrassa', 'Vic', 'Vilafranca del Penedès', 'Vilanova i la Geltrú'
];

const MATTERS = [
    { id: 'ALCOHOLEMIA', label: 'Alcoholemias Express', active: true },
    { id: 'VIOLENCIA', label: 'Violencia de Género', active: false },
    { id: 'DIVORCIOS', label: 'Divorcios', active: false },
    { id: 'ESTAFAS', label: 'Estafas Online', active: false },
];

export default function Step2MarketSelection({ data, onUpdate, onNext, onBack }: Step2Props) {

    // Pricing Logic
    useEffect(() => {
        const basePrice = 150;
        const extraZones = Math.max(0, data.activeZones.length - 1);
        const extraMatters = Math.max(0, data.activeMatters.length - 1);
        // Pricing Model: Base 150 includes 1 District. Extra District +80.
        const totalPrice = basePrice + (extraZones * 80) + (extraMatters * 50);

        if (totalPrice !== data.price) {
            onUpdate({ price: totalPrice });
        }
    }, [data.activeZones, data.activeMatters]);

    const toggleZone = (zoneId: string) => {
        let newZones = [...data.activeZones];
        if (newZones.includes(zoneId)) {
            if (newZones.length > 1) { // Prevent empty selection
                newZones = newZones.filter(id => id !== zoneId);
            }
        } else {
            newZones.push(zoneId);
        }
        onUpdate({ activeZones: newZones });
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Selecciona tu Mercado</h2>
            <p className="text-slate-500 mb-6">Elige tus Partidos Judiciales y Materias de actuación.</p>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden min-h-0">

                {/* Left Column: MATTERS (4 Cols width) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                            Materias Activas
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {MATTERS.map(matter => (
                                <div
                                    key={matter.id}
                                    className={`p-4 rounded-xl border flex justify-between items-center transition-all ${matter.active
                                            ? 'border-blue-200 bg-white shadow-sm cursor-pointer hover:border-blue-400'
                                            : 'border-slate-100 bg-slate-100 opacity-60 cursor-not-allowed'
                                        }`}
                                >
                                    <span className={`font-medium ${matter.active ? 'text-blue-900' : 'text-slate-500'}`}>
                                        {matter.label}
                                    </span>
                                    {matter.active ? (
                                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Próximamente</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-100 p-5 rounded-2xl border border-blue-200">
                        <div className="text-xs font-bold text-blue-800 uppercase mb-1">Tu Suscripción</div>
                        <div className="text-3xl font-black text-slate-900">{data.price}€<span className="text-base font-normal text-slate-500">/mes</span></div>
                        <ul className="text-xs text-blue-800 mt-2 space-y-1 font-medium">
                            <li>• Incluye 1 Partido Judicial + 1 Materia</li>
                            <li>• Partido adicional: +80€</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: JUDICIAL DISTRICTS (8 Cols width) */}
                <div className="lg:col-span-8 flex flex-col h-full min-h-0 bg-white md:bg-slate-50 md:border border-slate-200 md:p-6 rounded-2xl">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
                        Partidos Judiciales (Barcelona)
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-4">
                            {PARTIDOS_JUDICIALES.map(partido => {
                                const isSelected = data.activeZones.includes(partido);
                                return (
                                    <div
                                        key={partido}
                                        onClick={() => toggleZone(partido)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all cursor-pointer flex items-center gap-2 select-none ${isSelected
                                                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm ring-1 ring-blue-600'
                                                : 'border-slate-200 text-slate-600 bg-white hover:border-blue-300 hover:text-blue-600'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-slate-50'
                                            }`}>
                                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="truncate" title={partido}>{partido}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right hidden md:block">
                        *Basado en el Mapa Judicial Oficial de Barcelona
                    </p>
                </div>

            </div>

            <div className="mt-8 pt-4 flex justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Atrás
                </button>

                <button
                    onClick={onNext}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
                >
                    Resumen y Pago
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
