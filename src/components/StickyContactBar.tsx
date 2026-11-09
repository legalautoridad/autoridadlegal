'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
    STICKY_PHONE_HREF,
    STICKY_PHONE_DISPLAY,
    shouldHideContactBar,
    getWhatsAppHref,
} from '@/lib/sticky-contact-bar';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

interface StickyContactBarProps {
    courtDistrictsBySlug?: Record<string, string>;
}

const CONSENT_KEY = 'al_cookie_consent';

function trackStickyClick(eventName: 'click_call' | 'click_whatsapp', pagePath: string) {
    try {
        if (typeof window === 'undefined') return;
        const consent = window.localStorage.getItem(CONSENT_KEY);
        if (consent !== 'granted') return;
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, {
                page_path: pagePath,
                placement: 'sticky_bar',
            });
        }
    } catch {
        // Navigation must never depend on analytics tracking
    }
}

export default function StickyContactBar({
    courtDistrictsBySlug = {},
}: StickyContactBarProps) {
    const pathname = usePathname();

    if (shouldHideContactBar(pathname)) {
        return null;
    }

    const currentPath = pathname || '/';
    const whatsappHref = getWhatsAppHref(currentPath, courtDistrictsBySlug);

    return (
        <>
            {/* Reserved flow spacer equal to bar height + safe-area-inset-bottom so the footer is never covered */}
            <div
                aria-hidden="true"
                data-testid="sticky-contact-bar-spacer"
                className="h-[74px] bg-trust-navy print:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            />

            <aside
                aria-label="Contacto urgente"
                className="fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-3 pt-3 shadow-2xl font-sans print:hidden"
                style={{
                    paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
                }}
            >
                <div className="mx-auto flex max-w-4xl items-center justify-center gap-2.5 sm:gap-3">
                    {/* 1. Llamar — Dorado */}
                    <a
                        href={STICKY_PHONE_HREF}
                        aria-label={`Llamar al abogado de guardia 24 horas, ${STICKY_PHONE_DISPLAY}`}
                        onClick={() => trackStickyClick('click_call', currentPath)}
                        className="flex flex-1 md:flex-initial min-h-[48px] items-center justify-center gap-2 rounded-lg bg-prestige-gold hover:bg-[#ffe088] active:bg-[#f5d066] text-slate-900 font-bold text-sm md:text-base px-4 md:px-6 py-2.5 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-slate-900"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span className="md:hidden">Llamar</span>
                        <span className="hidden md:inline">
                            Llamar Abogado de Guardia 24h ({STICKY_PHONE_DISPLAY})
                        </span>
                    </a>

                    {/* 2. WhatsApp — Verde #25D366 con texto/icono oscuro #052e16 (contraste 7.51:1 ≥ 4.5:1) */}
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener"
                        aria-label="Escribir a abogado por WhatsApp (asistente automático 24 horas)"
                        onClick={() => trackStickyClick('click_whatsapp', currentPath)}
                        className="flex flex-1 md:flex-initial min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#34e275] active:bg-[#1ebe5d] text-[#052e16] font-bold text-sm md:text-base px-4 md:px-6 py-2.5 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-[#052e16]"
                        >
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        <span className="md:hidden">WhatsApp</span>
                        <span className="hidden md:inline">Escribir a abogado por WhatsApp</span>
                    </a>
                </div>
            </aside>
        </>
    );
}

