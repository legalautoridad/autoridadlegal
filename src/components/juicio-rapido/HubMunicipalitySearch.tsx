'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SearchableMunicipality } from '@/lib/db/district-content';
import { findBestMunicipalityMatch } from './DistrictMunicipalitySection';

interface HubMunicipalitySearchProps {
    allMunicipalities: SearchableMunicipality[];
    initialQuery?: string;
}

export function HubMunicipalitySearch({
    allMunicipalities,
    initialQuery = '',
}: HubMunicipalitySearchProps) {
    const [query, setQuery] = useState(initialQuery);
    const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

    const activeQuery = query.trim() || submittedQuery.trim();

    const matchedMunicipality = useMemo(() => {
        if (!activeQuery) return null;
        return findBestMunicipalityMatch(activeQuery, allMunicipalities);
    }, [activeQuery, allMunicipalities]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittedQuery(query);
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4 max-w-2xl">
            <form action="/juzgados" method="get" onSubmit={handleSubmit} className="space-y-3">
                <label
                    htmlFor="buscar-municipio-hub"
                    className="block text-base sm:text-lg font-extrabold text-slate-900"
                >
                    ¿Dónde te pararon?
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        id="buscar-municipio-hub"
                        name="q"
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Escribe tu municipio, p. ej. Piera, Lliçà de Vall, Sant Adrià..."
                        autoComplete="off"
                        className="flex-1 min-h-[48px] px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    />
                    <button
                        type="submit"
                        className="min-h-[48px] py-3 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors shrink-0 cursor-pointer"
                    >
                        Buscar mi juzgado
                    </button>
                </div>
            </form>

            {matchedMunicipality ? (
                <div
                    role="status"
                    aria-live="polite"
                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm"
                >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tu juzgado de guardia ({matchedMunicipality.name})
                    </p>
                    <p className="text-lg font-extrabold text-slate-900">
                        {matchedMunicipality.oficial}
                    </p>
                    {matchedMunicipality.address && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {matchedMunicipality.address}
                        </p>
                    )}
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                            href="tel:+34605118871"
                            className="min-h-[48px] py-2.5 px-5 rounded-lg bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm text-center flex items-center justify-center transition-colors"
                        >
                            Llamar al abogado de guardia
                        </a>
                        <Link
                            href={`/juzgados/${matchedMunicipality.courtSlug}`}
                            className="min-h-[44px] py-2 px-4 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-xs sm:text-sm text-center flex items-center justify-center transition-colors"
                        >
                            Ver ficha de {matchedMunicipality.partido} →
                        </Link>
                    </div>
                </div>
            ) : activeQuery ? (
                <p className="text-xs sm:text-sm text-slate-600 bg-white border border-slate-200 rounded-xl p-4">
                    No hemos encontrado ese municipio en la provincia de Barcelona. Consulta los 25 partidos judiciales o la tabla completa más abajo.
                </p>
            ) : null}
        </div>
    );
}

