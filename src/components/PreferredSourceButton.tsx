'use client';

import React from 'react';

export interface PreferredSourceApi {
    init: (options: { theme?: 'light' | 'dark' | 'auto'; lang?: string }) => void;
    addPreferredSource: () => void;
}

export type PreferredSourceCallback = (api: PreferredSourceApi) => void;

export interface PreferredSourceObject {
    push: (...callbacks: PreferredSourceCallback[]) => void;
    ready?: () => Promise<PreferredSourceApi>;
    api?: PreferredSourceApi;
}

declare global {
    interface Window {
        PREFERRED_SOURCE?: PreferredSourceObject | PreferredSourceCallback[];
        __PREFERRED_SOURCE_LOADED__?: boolean;
        gtag?: (...args: unknown[]) => void;
    }
}

interface PreferredSourceButtonProps {
    theme?: 'light' | 'dark';
    withLeadIn?: boolean;
    className?: string;
}

function GoogleGIcon({ className = 'w-4 h-4 shrink-0' }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
        </svg>
    );
}

export function PreferredSourceButton({
    theme = 'light',
    withLeadIn = false,
    className = '',
}: PreferredSourceButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Analytics tracking if gtag is available
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'preferred_source_click', {
                event_category: 'engagement',
                event_label: 'Google Preferred Source',
                method: window.__PREFERRED_SOURCE_LOADED__ ? 'modal' : 'deeplink',
            });
        }

        // If Google library is loaded and ready, intercept and open native modal
        if (typeof window !== 'undefined' && window.__PREFERRED_SOURCE_LOADED__) {
            e.preventDefault();
            (window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []).push((preferredSource) => {
                if (typeof preferredSource.addPreferredSource === 'function') {
                    preferredSource.addPreferredSource();
                }
            });
        }
        // If library is not loaded or blocked, let the normal anchor navigation open the fallback deeplink
    };

    const buttonStyles =
        theme === 'dark'
            ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-prestige-gold/50 shadow-xs focus-visible:ring-prestige-gold'
            : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-slate-400 shadow-xs focus-visible:ring-amber-500';

    const button = (
        <a
            href="https://www.google.com/preferences/source?q=autoridad.legal"
            target="_blank"
            rel="noopener"
            onClick={handleClick}
            aria-label="Añadir Autoridad Legal como fuente preferida en Google"
            className={`inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0 ${buttonStyles}`}
        >
            <GoogleGIcon />
            <span>Añadir Autoridad Legal como fuente preferida en Google</span>
        </a>
    );

    if (withLeadIn) {
        return (
            <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${className}`}
            >
                <p
                    className={`text-xs sm:text-sm font-medium leading-relaxed max-w-xl ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                >
                    ¿Sigues temas de tráfico y derecho penal? Marca Autoridad Legal como fuente preferida en Google.
                </p>
                {button}
            </div>
        );
    }

    return button;
}

