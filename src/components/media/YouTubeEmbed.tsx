'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface YouTubeEmbedProps {
    videoId: string;
    title: string;
    thumbnailUrl?: string;
    className?: string;
}

export function YouTubeEmbed({
    videoId,
    title,
    thumbnailUrl = '/images/video-citacion-thumbnail.webp',
    className = '',
}: YouTubeEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <div className={`relative w-full h-full ${className}`}>
                <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div
            className={`relative w-full h-full cursor-pointer group bg-slate-950 flex items-center justify-center ${className}`}
            onClick={() => setIsPlaying(true)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsPlaying(true);
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Reproducir vídeo: ${title}`}
        >
            <Image
                src={thumbnailUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
            />

            {/* Dark overlay with hover effect */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                {/* Custom YouTube Play Button */}
                <div className="w-16 h-12 sm:w-20 sm:h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-500">
                    <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current ml-1"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Title banner at top */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none">
                <p className="text-white text-xs sm:text-sm font-semibold truncate drop-shadow">
                    {title}
                </p>
            </div>
        </div>
    );
}

