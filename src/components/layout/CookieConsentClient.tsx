'use client';

import dynamic from 'next/dynamic';

export const CookieConsent = dynamic(
    () => import('./CookieConsent').then((mod) => mod.CookieConsent),
    { ssr: false }
);
