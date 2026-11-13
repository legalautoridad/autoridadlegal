'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface AnalyticsProps {
    gaId?: string;
}

export function Analytics({ gaId }: AnalyticsProps) {
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        const checkConsent = () => {
            const consent = localStorage.getItem('cookie-consent') || localStorage.getItem('al_cookie_consent');
            setHasConsent(consent === 'all' || consent === 'granted');
        };

        checkConsent();

        const handleConsentUpdated = () => {
            checkConsent();
        };

        window.addEventListener('consent-updated', handleConsentUpdated);
        return () => window.removeEventListener('consent-updated', handleConsentUpdated);
    }, []);

    const id = gaId || process.env.NEXT_PUBLIC_GA_ID || 'G-3NLK4X21QL';

    if (!hasConsent || !id) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
                strategy="lazyOnload"
            />
            <Script
                id="google-analytics"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${id}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}
