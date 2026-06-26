'use client';

import { useLead } from '../providers/LeadProvider';
import { Scale, MapPin } from 'lucide-react';

export function BacInputForm() {
    const { bacLevel, setBacLevel, locationName, setLocationName } = useLead();

    const handleBacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBacLevel(parseFloat(e.target.value));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocationName(e.target.value);
    };

    // Helper to determine severity color
    const getSeverityDetails = (level: number) => {
        if (level === 0) return { text: 'Sin alcohol', color: 'text-slate-400', barBg: 'bg-slate-200' };
        if (level < 0.25) return { text: 'Bajo el límite legal (General)', color: 'text-emerald-500', barBg: 'bg-emerald-500' };
        if (level < 0.60) return { text: 'Infracción Administrativa (Retirada de carné y multa)', color: 'text-amber-500', barBg: 'bg-amber-500' };
        return { text: '🚨 DELITO PENAL (Juicio Rápido y Antecedentes)', color: 'text-red-500', barBg: 'bg-red-500' };
    };

    const severity = getSeverityDetails(bacLevel);

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-md text-white max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-prestige-gold/20 rounded-xl text-prestige-gold">
                    <Scale className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-wide font-headline-md">Calculadora de Gravedad de Tasa</h3>
                    <p className="text-xs text-slate-400">Verifique de inmediato a qué tipo de sanción se expone.</p>
                </div>
            </div>

            {/* BAC Slider */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-300">Tasa en aire espirado (mg/l):</label>
                    <span className="text-3xl font-extrabold text-prestige-gold tracking-tight">
                        {bacLevel.toFixed(2)} <span className="text-xs text-slate-400">mg/l</span>
                    </span>
                </div>

                <div className="relative pt-2">
                    <input
                        type="range"
                        min="0.00"
                        max="2.00"
                        step="0.05"
                        value={bacLevel}
                        onChange={handleBacChange}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-prestige-gold focus:outline-none"
                    />
                    
                    {/* Markers */}
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-medium">
                        <span>0.00</span>
                        <span className="text-emerald-500 font-bold">0.25 (Límite adm.)</span>
                        <span className="text-red-500 font-bold">0.60 (Límite penal)</span>
                        <span>2.00</span>
                    </div>
                </div>
            </div>

            {/* Severity Status Meter */}
            <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Clasificación de Infracción</span>
                    <p className={`text-sm md:text-base font-extrabold ${severity.color} mt-0.5`}>
                        {severity.text}
                    </p>
                </div>
                <div className="w-full sm:w-32 h-2.5 bg-slate-850 rounded-full overflow-hidden">
                    <div className={`h-full ${severity.barBg} transition-all duration-300`} style={{ width: `${Math.min(100, (bacLevel / 1.5) * 100)}%` }}></div>
                </div>
            </div>

            {/* Location input */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-prestige-gold" />
                    Localización del control o juzgado:
                </label>
                <input
                    type="text"
                    value={locationName}
                    onChange={handleLocationChange}
                    placeholder="Ej. Barcelona, Rubí, Badalona..."
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-prestige-gold text-white placeholder-slate-600 transition-all font-medium"
                />
            </div>
        </div>
    );
}
