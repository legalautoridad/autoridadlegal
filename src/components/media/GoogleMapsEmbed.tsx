'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface GoogleMapsEmbedProps {
    embedUrl: string;
    title: string;
    address?: string | null;
    className?: string;
    dark?: boolean;
}

export function GoogleMapsEmbed({
    embedUrl,
    title,
    address,
    className = '',
    dark = false,
}: GoogleMapsEmbedProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Auto-load if user has previously accepted all cookies
        const consent = localStorage.getItem('cookie-consent') || localStorage.getItem('al_cookie_consent');
        if (consent === 'all' || consent === 'granted') {
            setIsLoaded(true);
        }

        const handleConsentUpdated = () => {
            const updated = localStorage.getItem('cookie-consent') || localStorage.getItem('al_cookie_consent');
            if (updated === 'all' || updated === 'granted') {
                setIsLoaded(true);
            }
        };

        window.addEventListener('consent-updated', handleConsentUpdated);
        return () => window.removeEventListener('consent-updated', handleConsentUpdated);
    }, []);

    const externalUrl = address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${address}`)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;

    if (isLoaded) {
        return (
            <div className={`w-full h-full ${className}`}>
                <iframe
                    title={title}
                    src={embedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                />
            </div>
        );
    }

    if (dark) {
        return (
            <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white space-y-4 ${className}`}>
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-prestige-gold">
                    <MapPin className="w-6 h-6 text-prestige-gold" />
                </div>

                <div className="space-y-1 max-w-sm">
                    <p className="font-bold text-sm text-white">{title}</p>
                    {address && <p className="text-xs text-slate-400 leading-relaxed">{address}</p>}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    <button
                        onClick={() => setIsLoaded(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-prestige-gold hover:bg-yellow-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Cargar mapa interactivo</span>
                    </button>

                    <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                        <span>Abrir en Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                </div>

                <p className="text-[11px] text-slate-400">
                    Para proteger tu privacidad, el mapa de Google solo se carga bajo tu consentimiento.
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100 text-slate-800 space-y-4 ${className}`}>
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <MapPin className="w-6 h-6 text-slate-700" />
            </div>

            <div className="space-y-1 max-w-sm">
                <p className="font-bold text-sm text-slate-900">{title}</p>
                {address && <p className="text-xs text-slate-600 leading-relaxed">{address}</p>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                    onClick={() => setIsLoaded(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Cargar mapa interactivo</span>
                </button>

                <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
            </div>

            <p className="text-[11px] text-slate-500">
                Para proteger tu privacidad, el mapa de Google solo se carga bajo tu consentimiento.
            </p>
        </div>
    );
}
