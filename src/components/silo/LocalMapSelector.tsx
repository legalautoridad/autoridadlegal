'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

export interface InterestPoint {
    name: string;
    class: string;
    details: string;
}

export interface LocalMapSelectorProps {
    cityName: string;
    zone: string | null;
    courtName: string | null;
    courtAddress: string | null;
    interestPoints: InterestPoint[] | null;
}

export function LocalMapSelector({
    cityName,
    zone,
    courtName,
    courtAddress,
    interestPoints
}: LocalMapSelectorProps) {
    const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

    if (!interestPoints || interestPoints.length === 0) {
        return null;
    }

    // Prepare default districts grid based on city
    const districts = [
        cityName,
        zone || 'Zona Metropolitana',
        courtName || 'Juzgado Local',
        'Jurisdicción Validada'
    ];

    return (
        <section className="py-24 bg-white border-b border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Geographic Information & Interactive Points */}
                    <div className="space-y-8 lg:col-span-6">
                        <div className="space-y-4">
                            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Jurisdicción Completa</span>
                            <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold tracking-tight">
                                Presencia en {cityName} y Área de Influencia
                            </h2>
                            <p className="font-body-lg text-base text-on-surface-variant leading-relaxed">
                                Centralizamos nuestra operativa en los juzgados competentes de la zona de <span className="font-bold text-legal-ink">{cityName}</span>, cubriendo todos los distritos colindantes con respuesta inmediata ante citaciones o controles policiales.
                            </p>
                        </div>
                        
                        {/* Micro-districts grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {districts.map((district, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-surface-ice rounded-lg border border-outline-variant/60 shadow-sm hover:border-prestige-gold/45 transition-colors">
                                    <MapPin className="w-5 h-5 text-prestige-gold shrink-0" />
                                    <span className="font-label-md text-xs font-bold text-legal-ink">{district}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sede Central card */}
                        {courtName && (
                            <div className="p-6 bg-trust-navy text-white rounded-xl shadow-lg border-l-4 border-prestige-gold">
                                <p className="font-label-md text-xs font-bold text-prestige-gold uppercase tracking-wider mb-2">Juzgado de Guardia de Referencia:</p>
                                <p className="font-body-md text-sm leading-relaxed">
                                    {courtName} {courtAddress ? ` ubicado en ${courtAddress}` : ''}. Punto de referencia judicial clave en {cityName} para guardias, vistas y juicios rápidos.
                                </p>
                            </div>
                        )}

                        {/* Location Intelligence (Supabase points) */}
                        <div className="space-y-3 pt-2">
                            <h4 className="font-label-md text-sm font-bold text-legal-ink uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="w-4.5 h-4.5 text-prestige-gold" />
                                Puntos Clave de Control y Atestados en {cityName}
                            </h4>
                            <p className="text-xs text-on-surface-variant italic">Haz clic en un punto para ver detalles de la operativa local:</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {interestPoints.map((pt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedPoint(selectedPoint === idx ? null : idx)}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                            selectedPoint === idx 
                                                ? 'bg-prestige-gold text-trust-navy border-prestige-gold font-bold scale-105 shadow-sm' 
                                                : 'bg-white text-on-surface border-outline-variant hover:border-prestige-gold/50'
                                        }`}
                                    >
                                        {pt.name.split(' - ').slice(-1)[0] || pt.name}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedPoint !== null && (
                                    <motion.div
                                        key={selectedPoint}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="p-4 bg-amber-50/50 border border-prestige-gold/25 rounded-lg text-xs space-y-1 mt-2 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-trust-navy">{interestPoints[selectedPoint].name}</span>
                                            <span className="text-[10px] bg-prestige-gold/25 text-trust-navy px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                {interestPoints[selectedPoint].class}
                                            </span>
                                        </div>
                                        <p className="text-on-surface-variant leading-relaxed mt-1">
                                            {interestPoints[selectedPoint].details}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    {/* Map Image Panel */}
                    <div className="lg:col-span-6 relative h-[420px] rounded-xl overflow-hidden shadow-2xl border border-outline-variant group">
                        <img 
                            alt={`${cityName} Map Area`} 
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCZfhnMedqHDPc7iFeJUP7yo0h1xqWzeqT8KYxMGP44-u5JQFtnZWakmXLGWC-d2HIXkrRHI54flk5fEainzsK-DxTD7ISzSakc3vo9AzVH718gZ88GLnqvcMFPTOBIVRGOGy1op9rovqrHWdsj0nI2r9OsQIo5ozBvLGtGlySvYFfM8DDgMdeLWrNqgaoH08qsPkZWAz1AGq_dvuEp67OuGJc1J6qBQKJIFZQnxAd3hKNvUdNhaKFLLEV4_0BnoFMUZ6sD-sc-W4R"
                        />
                        <div className="absolute inset-0 bg-trust-navy/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded border border-outline-variant shadow-md text-[10px] font-bold text-trust-navy flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                            Cobertura Geográfica en {cityName} Validada
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
