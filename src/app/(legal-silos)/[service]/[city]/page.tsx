import { permanentRedirect } from 'next/navigation';
import MAPA from '@/data/municipio-a-partido.json';

const PARTIDOS = MAPA as Record<string, string>;
const SERVICIOS: Record<string, string> = {
    alcoholemia: 'alcoholemia',
    drogas: 'drogas',
    velocidad: 'velocidad',
    'sin-carnet': 'sin-carnet',
    sin_carnet: 'sin-carnet',
    profesionales: 'profesionales',
};

interface LeafPageProps {
    params: Promise<{ service: string; city: string }>;
}

/**
 * Legacy coverage route fallback (`/[service]/[city]`).
 * Primary 301 redirect is handled by `src/middleware.ts`.
 * No `generateStaticParams` is exported so zero coverage pages are compiled.
 */
export default async function LocalizedServiceLeafPage({ params }: LeafPageProps) {
    const { service, city } = await params;
    const servicio = SERVICIOS[(service ?? '').toLowerCase()] || 'alcoholemia';
    let municipio = city ?? '';
    try {
        municipio = decodeURIComponent(municipio);
    } catch {}
    const partido = PARTIDOS[municipio.toLowerCase()];
    const destino = partido ? `/juzgados/${partido}` : `/${servicio}`;
    permanentRedirect(destino);
}
