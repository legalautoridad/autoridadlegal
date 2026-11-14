'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { VideoData } from '@/data/videos';

interface YouTubeFacadeProps {
    video: VideoData;
    partidoName?: string;
    className?: string;
}

function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function YouTubeFacade({
    video,
    partidoName,
    className = '',
}: YouTubeFacadeProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [startSeconds, setStartSeconds] = useState<number>(0);
    const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);

    const handlePlay = (start = 0, chapterIndex: number | null = null) => {
        setStartSeconds(start);
        setActiveChapterIndex(chapterIndex);
        setIsPlaying(true);
    };

    const thumbnailSrc = video.localThumbnail || video.thumbnailUrl;
    const iframeSrc = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0${
        startSeconds > 0 ? `&start=${startSeconds}` : ''
    }`;

    return (
        <section
            aria-labelledby="video-section-heading"
            className={`bg-white border-b border-slate-200 py-12 md:py-16 ${className}`}
        >
            <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
                {/* Section Header */}
                <div className="space-y-3 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 uppercase tracking-wider">
                        <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        Vídeo explicativo
                    </span>
                    <h2
                        id="video-section-heading"
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
                    >
                        Vídeo: qué esperar en tu juicio rápido en {partidoName || "L'Hospitalet"}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {video.description}
                    </p>
                </div>

                {/* Video Facade & Chapters Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Video Player / Facade (7 cols) */}
                    <div className="lg:col-span-7 space-y-3">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950">
                            {isPlaying ? (
                                <iframe
                                    className="w-full h-full border-0"
                                    src={iframeSrc}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handlePlay(0, 0)}
                                    aria-label={`Reproducir vídeo: ${video.title}`}
                                    className="group relative w-full h-full block cursor-pointer text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                                >
                                    <Image
                                        src={thumbnailSrc}
                                        alt={video.title}
                                        width={1280}
                                        height={720}
                                        sizes="(max-width: 1024px) 100vw, 700px"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-12 sm:w-20 sm:h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-500">
                                            <svg
                                                className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current ml-1"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-white flex items-center gap-1 shadow">
                                        <Clock className="w-3 h-3 text-amber-400" />
                                        <span>05:46</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Caption under video */}
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Santiago Giménez Olavarriaga</span>
                            <span>•</span>
                            <span>Director Jurídico (ICAB 31.389)</span>
                            <span>•</span>
                            <span>Grabado en Av. del Carrilet, 2</span>
                        </p>
                    </div>

                    {/* Right: Chapter List with clickable timestamps (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span>Índice por capítulos del vídeo</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Haz clic en un capítulo para saltar directamente a ese momento del vídeo.
                            </p>
                        </div>

                        <ul className="space-y-2" aria-label="Capítulos del vídeo">
                            {video.chapters.map((chapter, idx) => {
                                const isSelected = activeChapterIndex === idx;
                                return (
                                    <li key={chapter.start}>
                                        <button
                                            type="button"
                                            onClick={() => handlePlay(chapter.start, idx)}
                                            aria-label={`Saltar al minuto ${formatTimestamp(chapter.start)}: ${chapter.name}`}
                                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer text-xs sm:text-sm ${
                                                isSelected
                                                    ? 'bg-amber-100/70 border border-amber-300 text-amber-950 font-semibold shadow-xs'
                                                    : 'hover:bg-white hover:shadow-xs border border-transparent text-slate-700'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded-md shrink-0 font-bold ${
                                                    isSelected
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-slate-200 text-slate-700 group-hover:bg-amber-100'
                                                }`}
                                            >
                                                {formatTimestamp(chapter.start)}
                                            </span>
                                            <span className="leading-snug flex-1">
                                                {chapter.name}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Transcripción completa en <details> */}
                <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden shadow-xs">
                    <details className="group p-5 sm:p-6">
                        <summary className="font-bold text-slate-900 text-base sm:text-lg cursor-pointer list-none flex items-center justify-between gap-3 select-none">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                                <span>Ver transcripción completa del vídeo</span>
                            </div>
                            <span
                                aria-hidden="true"
                                className="text-slate-400 text-xs font-bold transition-transform duration-200 group-open:rotate-180 shrink-0"
                            >
                                ▼
                            </span>
                        </summary>

                        <div className="mt-5 pt-5 border-t border-slate-200/80 text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                            {video.transcript.split('\n\n').map((paragraph, pIdx) => (
                                <p key={pIdx} className="leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </details>
                </div>

                {/* Enlace contextual a /honorarios */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Defensa penal especializada sin sorpresas</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">
                            Honorarios cerrados con procurador incluido y posibilidad de financiación flexible hasta doce meses.
                        </p>
                    </div>

                    <Link
                        href="/honorarios"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors shrink-0 shadow-sm"
                    >
                        <span>Ver precios y honorarios</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

