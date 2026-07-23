'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, X, ArrowRight, ShieldCheck, Building2, PhoneCall, Filter } from 'lucide-react';

export interface MunicipioItem {
    slug: string;
    name: string;
    service?: string;
    hasCourt?: boolean;
}

interface MunicipalitySearchProps {
    initialService?: string;
    initialMunicipios: MunicipioItem[];
    showServiceSelector?: boolean;
    title?: string;
    subtitle?: string;
}

const SERVICES = [
    { id: 'alcoholemia', label: 'Alcoholemia', icon: '🛡️' },
    { id: 'drogas', label: 'Drogas', icon: '⚖️' },
    { id: 'sin-carnet', label: 'Sin Carnet', icon: '🚗' },
    { id: 'velocidad', label: 'Velocidad', icon: '⚡' },
    { id: 'profesionales', label: 'Profesionales', icon: '👨‍⚖️' },
];

const POPULAR_CITIES = [
    'Barcelona', 'Badalona', "L'Hospitalet de Llobregat", 'Sabadell',
    'Terrassa', 'Mataró', 'Santa Coloma de Gramenet', 'Granollers',
    'Manresa', 'Cornellà de Llobregat', 'Sant Cugat del Vallès'
];

// Helper to normalize strings for accent-insensitive search
function normalizeStr(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’·]/g, ' ')
        .trim();
}

export function MunicipalitySearch({
    initialService = 'alcoholemia',
    initialMunicipios = [],
    showServiceSelector = true,
    title = "Cobertura Jurídica por Municipios en Cataluña",
    subtitle = "Busque su municipio para acceder a la asistencia legal de urgencia 24h y defensa especializada adaptada a los juzgados locales."
}: MunicipalitySearchProps) {
    const [selectedService, setSelectedService] = useState<string>(initialService);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedLetter, setSelectedLetter] = useState<string>('TODOS');

    // Available letters from data
    const availableLetters = useMemo(() => {
        const letters = new Set<string>();
        initialMunicipios.forEach(m => {
            const first = normalizeStr(m.name).charAt(0).toUpperCase();
            if (first >= 'A' && first <= 'Z') {
                letters.add(first);
            }
        });
        return ['TODOS', ...Array.from(letters).sort()];
    }, [initialMunicipios]);

    // Filtered municipios
    const filteredMunicipios = useMemo(() => {
        let list = [...initialMunicipios];

        if (searchQuery.trim()) {
            const normQuery = normalizeStr(searchQuery);
            list = list.filter(m => normalizeStr(m.name).includes(normQuery));
        } else if (selectedLetter !== 'TODOS') {
            list = list.filter(m => {
                const first = normalizeStr(m.name).charAt(0).toUpperCase();
                return first === selectedLetter;
            });
        }

        return list;
    }, [initialMunicipios, searchQuery, selectedLetter]);

    const activeServiceLabel = SERVICES.find(s => s.id === selectedService)?.label || selectedService;

    return (
        <div className="w-full space-y-8 bg-slate-950/80 p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
            {/* Header / Title */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-semibold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Asistencia 24 Horas en 129+ Municipios
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    {title}
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    {subtitle}
                </p>
            </div>

            {/* Service Selector Tabs */}
            {showServiceSelector && (
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold text-center">
                        Seleccione la especialidad penal:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                        {SERVICES.map(s => {
                            const isSelected = selectedService === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedService(s.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 border ${
                                        isSelected
                                            ? 'bg-prestige-gold text-trust-navy border-prestige-gold shadow-lg shadow-prestige-gold/20 scale-[1.02]'
                                            : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                                >
                                    <span>{s.icon}</span>
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (selectedLetter !== 'TODOS') setSelectedLetter('TODOS');
                        }}
                        placeholder={`Buscar municipio para ${activeServiceLabel} (ej: Badalona, Sabadell, Hospitalet...)`}
                        className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none focus:border-prestige-gold focus:ring-2 focus:ring-prestige-gold/20 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Popular City Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Principales:
                    </span>
                    {POPULAR_CITIES.map(city => (
                        <button
                            key={city}
                            onClick={() => {
                                setSearchQuery(city);
                                setSelectedLetter('TODOS');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                                normalizeStr(searchQuery) === normalizeStr(city)
                                    ? 'bg-slate-800 text-prestige-gold border-prestige-gold/50'
                                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            {/* A-Z Alphabet Quick Jump */}
            {!searchQuery && (
                <div className="flex flex-wrap justify-center items-center gap-1.5 pt-2 max-w-4xl mx-auto border-t border-white/5">
                    {availableLetters.map(letter => {
                        const isSelected = selectedLetter === letter;
                        return (
                            <button
                                key={letter}
                                onClick={() => setSelectedLetter(letter)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                                    isSelected
                                        ? 'bg-slate-800 text-prestige-gold border-prestige-gold shadow'
                                        : 'bg-slate-900/50 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-3">
                <span>
                    Mostrando <strong className="text-prestige-gold font-bold">{filteredMunicipios.length}</strong> municipios para <span className="text-white font-medium">{activeServiceLabel}</span>
                </span>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-prestige-gold underline underline-offset-4 transition-colors"
                    >
                        Ver todos los municipios
                    </button>
                )}
            </div>

            {/* Municipios Grid */}
            {filteredMunicipios.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {filteredMunicipios.map(m => {
                        const href = `/${selectedService}/${m.slug}`;
                        return (
                            <Link
                                key={`${selectedService}-${m.slug}`}
                                href={href}
                                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-prestige-gold/60 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-xl hover:shadow-prestige-gold/5"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-prestige-gold/20 flex items-center justify-center text-slate-400 group-hover:text-prestige-gold transition-colors shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-slate-200 group-hover:text-white truncate transition-colors">
                                            {m.name}
                                        </p>
                                        <p className="text-[11px] text-slate-400 group-hover:text-prestige-gold/80 transition-colors">
                                            Guardia 24h &bull; Juzgados
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-prestige-gold group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* No Results Empty State */
                <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-white/10 space-y-4">
                    <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                    <div className="space-y-1">
                        <p className="text-white font-bold text-lg">
                            No se encontró el municipio &ldquo;{searchQuery}&rdquo;
                        </p>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                            Prestamos asistencia legal en toda la provincia de Barcelona y Cataluña. Contacte directamente con nuestro turno de guardia.
                        </p>
                    </div>
                    <a
                        href="tel:+34605118871"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-bold text-sm transition-all shadow-lg shadow-prestige-gold/20"
                    >
                        <PhoneCall className="w-4 h-4" />
                        Llamar al Turno de Guardia 24h (+34 605 118 871)
                    </a>
                </div>
            )}
        </div>
    );
}
