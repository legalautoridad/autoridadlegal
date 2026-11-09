'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { DistrictMunicipality, SearchableMunicipality } from '@/lib/db/district-content';

export function normalizeMunicipioSearch(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ç/g, 'c')
        .replace(/['’`·\-.,]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function findBestMunicipalityMatch(
    query: string,
    allMunicipalities: SearchableMunicipality[]
): SearchableMunicipality | null {
    const normQuery = normalizeMunicipioSearch(query);
    if (!normQuery) return null;

    // 1. Exact match on normalized name or slug
    const exact = allMunicipalities.find(
        m => normalizeMunicipioSearch(m.name) === normQuery || normalizeMunicipioSearch(m.slug) === normQuery
    );
    if (exact) return exact;

    // 2. Starts-with match on normalized name
    const startsWith = allMunicipalities.find(m =>
        normalizeMunicipioSearch(m.name).startsWith(normQuery)
    );
    if (startsWith) return startsWith;

    // 3. Word-boundary / includes match on normalized name
    const includes = allMunicipalities.find(m =>
        normalizeMunicipioSearch(m.name).includes(normQuery)
    );
    if (includes) return includes;

    // 4. Token match (all query tokens appear in municipality name)
    const tokens = normQuery.split(' ').filter(Boolean);
    if (tokens.length > 1) {
        const tokenMatch = allMunicipalities.find(m => {
            const target = normalizeMunicipioSearch(m.name);
            return tokens.every(t => target.includes(t));
        });
        if (tokenMatch) return tokenMatch;
    }

    return null;
}

interface DistrictMunicipalitySectionProps {
    partido: string;
    oficial: string;
    currentCourtSlug: string;
    municipalities: DistrictMunicipality[];
    topMunicipalities: DistrictMunicipality[];
    allMunicipalities: SearchableMunicipality[];
}

export function DistrictMunicipalitySection({
    partido,
    oficial,
    currentCourtSlug,
    municipalities,
    topMunicipalities,
    allMunicipalities,
}: DistrictMunicipalitySectionProps) {
    const [query, setQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');

    const activeQuery = query.trim() || submittedQuery.trim();

    const matchedMunicipality = useMemo(() => {
        if (!activeQuery) return null;
        return findBestMunicipalityMatch(activeQuery, allMunicipalities);
    }, [activeQuery, allMunicipalities]);

    const highlightedSlug =
        matchedMunicipality && matchedMunicipality.courtSlug === currentCourtSlug
            ? matchedMunicipality.slug
            : null;

    const n = municipalities.length;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittedQuery(query);
    };

    const renderIntroSentence = () => {
        if (n === 1) {
            return (
                <>
                    Si te han parado en <strong className="font-bold text-slate-900">{municipalities[0]?.name || partido}</strong>, tu juzgado de guardia es el{' '}
                    <strong className="font-bold text-slate-900">{oficial}</strong>.
                </>
            );
        }

        if (n <= 4) {
            return (
                <>
                    Si te han parado en{' '}
                    {municipalities.map((m, idx) => {
                        const isLast = idx === municipalities.length - 1;
                        const isSecondToLast = idx === municipalities.length - 2;
                        return (
                            <React.Fragment key={m.id}>
                                <strong className="font-bold text-slate-900">{m.name}</strong>
                                {!isLast && (isSecondToLast ? ' o ' : ', ')}
                            </React.Fragment>
                        );
                    })}
                    , tu juzgado de guardia es el <strong className="font-bold text-slate-900">{oficial}</strong>.
                </>
            );
        }

        return (
            <>
                Si te han parado en{' '}
                {topMunicipalities.map((m, idx) => {
                    const isLast = idx === topMunicipalities.length - 1;
                    return (
                        <React.Fragment key={m.id}>
                            <strong className="font-bold text-slate-900">{m.name}</strong>
                            {!isLast && ', '}
                        </React.Fragment>
                    );
                })}{' '}
                o en cualquiera de estos {n} municipios, tu juzgado de guardia es el{' '}
                <strong className="font-bold text-slate-900">{oficial}</strong>.
            </>
        );
    };

    return (
        <section className="bg-white text-slate-900 border-b border-slate-200 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: H2, generated sentence, and SSR list of municipality chips */}
                <div className="lg:col-span-7 space-y-5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        ¿Es este tu juzgado de guardia?
                    </h2>

                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                        {renderIntroSentence()}
                    </p>

                    <ul
                        aria-label={`Municipios del partido judicial de ${partido}`}
                        className="flex flex-wrap gap-2 pt-1"
                    >
                        {municipalities.map(m => {
                            const isHighlighted = highlightedSlug === m.slug;
                            return (
                                <li
                                    key={m.id}
                                    data-municipio-slug={m.slug}
                                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                                        isHighlighted
                                            ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
                                            : 'bg-slate-100 text-slate-800'
                                    }`}
                                >
                                    {m.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Right Column: Client/SSR Search Box */}
                <div className="lg:col-span-5 w-full">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                        <form action="/juzgados" method="get" onSubmit={handleSubmit} className="space-y-3">
                            <label
                                htmlFor="buscar-municipio-ficha"
                                className="block text-sm font-bold text-slate-900"
                            >
                                ¿Te pararon en otro municipio?
                            </label>
                            <input
                                id="buscar-municipio-ficha"
                                name="q"
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Escribe tu municipio, p. ej. Piera"
                                autoComplete="off"
                                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                            />
                            <button
                                type="submit"
                                className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
                            >
                                Buscar mi juzgado
                            </button>
                        </form>

                        {matchedMunicipality ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-sm"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Tu juzgado de guardia ({matchedMunicipality.name})
                                </p>
                                <p className="text-base font-extrabold text-slate-900">
                                    {matchedMunicipality.oficial}
                                </p>
                                {matchedMunicipality.address && (
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {matchedMunicipality.address}
                                    </p>
                                )}
                                <div className="pt-1 space-y-2">
                                    <a
                                        href="tel:+34605118871"
                                        className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm text-center flex items-center justify-center transition-colors"
                                    >
                                        Llamar al abogado de guardia
                                    </a>
                                    <div className="text-center">
                                        <Link
                                            href={`/juzgados/${matchedMunicipality.courtSlug}`}
                                            className="inline-block text-xs font-bold text-slate-900 underline hover:text-slate-700 py-1"
                                        >
                                            Ver ficha de {matchedMunicipality.partido} →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : activeQuery ? (
                            <p className="text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-3">
                                No hemos encontrado ese municipio en la provincia de Barcelona. Revisa el listado completo en{' '}
                                <Link href="/juzgados" className="underline font-semibold text-slate-900">
                                    Juicio rápido
                                </Link>
                                .
                            </p>
                        ) : null}

                        <p className="text-xs text-slate-500 leading-relaxed">
                            Los {allMunicipalities.length} municipios de la provincia y su juzgado, en{' '}
                            <Link href="/juzgados" className="underline font-medium text-slate-700 hover:text-slate-900">
                                Juicio rápido
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

