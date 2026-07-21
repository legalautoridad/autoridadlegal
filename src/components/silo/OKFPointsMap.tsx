'use client';

import React, { useState } from 'react';
import { PuntoDeInteres } from '@/lib/okf/parser';
import { MapPin, Navigation, Shield, AlertTriangle, Compass, CheckCircle } from 'lucide-react';

interface OKFPointsMapProps {
    cityName: string;
    points: PuntoDeInteres[];
}

export function OKFPointsMap({ cityName, points }: OKFPointsMapProps) {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [activeCategory, setActiveCategory] = useState<string>('Todas');

    if (!points || points.length === 0) {
        return null;
    }

    // Extract categories
    const categories = ['Todas', ...Array.from(new Set(points.map(p => p.category)))];

    // Filter points by category
    const filteredPoints = activeCategory === 'Todas' 
        ? points 
        : points.filter(p => p.category === activeCategory);

    const activePoint = filteredPoints[selectedIdx] || filteredPoints[0] || points[0];

    // Construct Google Maps embed URL for the active point or city
    const getEmbedUrl = (point: PuntoDeInteres) => {
        const query = (point.gps && point.gps !== '—')
            ? point.gps
            : `${point.name}, ${cityName}`;
        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    };

    const getCategoryIcon = (category: string) => {
        if (category.toLowerCase().includes('polic') || category.toLowerCase().includes('juzgad')) {
            return <Shield className="w-3.5 h-3.5 text-prestige-gold" />;
        }
        if (category.toLowerCase().includes('zona') || category.toLowerCase().includes('control')) {
            return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
        }
        return <Navigation className="w-3.5 h-3.5 text-emerald-400" />;
    };

    return (
        <div className="space-y-6 pt-6 border-t border-white/10">
            {/* Section Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-prestige-gold/15 border border-prestige-gold/30 text-xs font-bold text-prestige-gold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        Mapa Interactivo de Puntos de Control
                    </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                    Puntos de Interés y Control en {cityName}
                </h2>
                <p className="text-slate-400 text-xs md:text-sm pl-5">
                    Selecciona un punto clave para visualizar la ubicación exacta en Google Maps con descripción detallada.
                </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setActiveCategory(cat);
                            setSelectedIdx(0);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-semibold flex items-center gap-1.5 ${
                            activeCategory === cat
                                ? 'bg-prestige-gold text-slate-950 border-prestige-gold font-bold shadow-md shadow-prestige-gold/10'
                                : 'bg-slate-900 text-slate-300 border-white/10 hover:border-prestige-gold/40'
                        }`}
                    >
                        {cat !== 'Todas' && getCategoryIcon(cat)}
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Interactive Map & List Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Points List Selector (Left Column) */}
                <div className="lg:col-span-5 space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredPoints.map((pt, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedIdx(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                                    isSelected
                                        ? 'bg-slate-900 border-prestige-gold shadow-lg shadow-prestige-gold/5 ring-1 ring-prestige-gold/30'
                                        : 'bg-slate-950/60 border-white/5 hover:border-white/20 hover:bg-slate-900/40'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 w-full">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-prestige-gold uppercase tracking-wider">
                                        {getCategoryIcon(pt.category)}
                                        {pt.category}
                                    </span>
                                    {pt.gps && pt.gps !== '—' && (
                                        <span className="text-[10px] text-emerald-400 font-mono">
                                            {pt.gps}
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-prestige-gold' : 'text-white'}`}>
                                    {pt.name}
                                </h3>
                                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                                    {pt.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Google Maps Viewport & Detail (Right Column) */}
                <div className="lg:col-span-7 flex flex-col space-y-4">
                    {/* Google Maps Frame */}
                    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                        <iframe
                            title={`Mapa de ${activePoint.name}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={getEmbedUrl(activePoint)}
                            className="w-full h-full filter contrast-105 brightness-95"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                            <Compass className="w-3.5 h-3.5 text-prestige-gold animate-spin" style={{ animationDuration: '10s' }} />
                            Google Maps: {cityName}
                        </div>
                    </div>

                    {/* Active Point Detail Panel */}
                    {activePoint && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-prestige-gold/30 shadow-md space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-prestige-gold uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    Punto Seleccionado
                                </span>
                                {activePoint.gps && activePoint.gps !== '—' && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePoint.gps)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Abrir en Google Maps: ${activePoint.name}`}
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
                                    >
                                        Abrir en App Google Maps ↗
                                    </a>
                                )}
                            </div>
                            <h4 className="text-base font-bold text-white">
                                {activePoint.name}
                            </h4>
                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                                {activePoint.description}
                            </p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
