'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'al_cookie_consent';

interface CookieConsentProps {
    gaId?: string;
}

export function CookieConsent({ gaId }: CookieConsentProps) {
    const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored === 'granted' || stored === 'denied') {
            setConsent(stored as 'granted' | 'denied');
        }

        const handleReset = () => {
            setConsent(null);
            localStorage.removeItem(CONSENT_KEY);
        };

        window.addEventListener('reset_cookie_consent', handleReset);
        return () => window.removeEventListener('reset_cookie_consent', handleReset);
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'granted');
        setConsent('granted');
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'denied');
        setConsent('denied');
    };

    return (
        <>
            {/* Load GA4 ONLY if user explicitly granted consent */}
            {consent === 'granted' && gaId && (
                <GoogleAnalytics gaId={gaId} />
            )}

            {/* GDPR Consent Banner rendered client-side when choice is pending */}
            {mounted && consent === null && (
                <div
                    role="dialog"
                    aria-live="polite"
                    aria-label="Consentimiento de cookies"
                    className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-[100] bg-slate-950/95 backdrop-blur-md text-white border border-prestige-gold/40 p-5 rounded-2xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
                >
                    <div className="flex items-center gap-2 text-prestige-gold font-bold text-sm tracking-wide">
                        <Cookie className="w-5 h-5 text-prestige-gold shrink-0" />
                        <span>Uso de Cookies y Privacidad (GDPR)</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                        Utilizamos cookies necesarias para el funcionamiento de la web y cookies analíticas de terceros (Google Analytics) para medir la audiencia y mejorar nuestro servicio. Puedes aceptar todas las cookies o limitar su uso a las estrictamente necesarias. Consulta nuestra{' '}
                        <Link href="/legal/cookies" className="text-prestige-gold underline hover:text-white transition-colors">
                            Política de Cookies
                        </Link>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
                        <button
                            onClick={handleDecline}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
                        >
                            Solo necesarias
                        </button>
                        <button
                            onClick={handleAccept}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy text-xs font-bold transition-all shadow-md shadow-prestige-gold/20 cursor-pointer"
                        >
                            Aceptar todas
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
