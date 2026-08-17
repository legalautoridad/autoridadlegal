import { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Recursos Jurídicos y Centro de Conocimiento Penal | Autoridad Legal',
    description: 'Centro de conocimiento especializado en derecho penal de tráfico en Barcelona. Guías legales, artículos e información sobre juicios rápidos por alcoholemia, drogas, exceso de velocidad y conducción sin permiso.',
    alternates: {
        canonical: 'https://www.autoridad.legal/recursos',
    },
    openGraph: {
        title: 'Recursos Jurídicos y Centro de Conocimiento Penal | Autoridad Legal',
        description: 'Centro de conocimiento especializado en derecho penal de tráfico en Barcelona. Guías legales, artículos e información sobre juicios rápidos por alcoholemia, drogas, exceso de velocidad y conducción sin permiso.',
        url: 'https://www.autoridad.legal/recursos',
        siteName: 'Autoridad Legal',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Recursos Jurídicos — Autoridad Legal',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Recursos Jurídicos y Centro de Conocimiento Penal | Autoridad Legal',
        description: 'Centro de conocimiento especializado en derecho penal de tráfico en Barcelona. Guías legales, artículos e información sobre juicios rápidos por alcoholemia, drogas, exceso de velocidad y conducción sin permiso.',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function RecursosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
