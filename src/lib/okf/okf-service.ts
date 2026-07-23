import fs from 'fs';
import path from 'path';
import { OKFCobertura, OKFFaq, PuntoDeInteres } from './parser';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/okf');

let cachedCoberturas: OKFCobertura[] | null = null;
let cachedFaqs: Record<string, OKFFaq[]> | null = null;
let cachedMunicipios: Record<string, { title: string; puntos_de_interes: PuntoDeInteres[] }> | null = null;

function loadCoberturas(): OKFCobertura[] {
    if (cachedCoberturas) return cachedCoberturas;

    const file = path.join(CONTENT_DIR, 'coberturas.json');
    if (!fs.existsSync(file)) {
        return [];
    }

    try {
        const data = fs.readFileSync(file, 'utf-8');
        cachedCoberturas = JSON.parse(data);
        return cachedCoberturas || [];
    } catch (e) {
        console.error('Failed to load OKF coberturas cache:', e);
        return [];
    }
}

function loadFaqs(): Record<string, OKFFaq[]> {
    if (cachedFaqs) return cachedFaqs;

    const file = path.join(CONTENT_DIR, 'faqs.json');
    if (!fs.existsSync(file)) {
        return {};
    }

    try {
        const data = fs.readFileSync(file, 'utf-8');
        cachedFaqs = JSON.parse(data);
        return cachedFaqs || {};
    } catch (e) {
        console.error('Failed to load OKF FAQs cache:', e);
        return {};
    }
}

function loadMunicipios(): Record<string, { title: string; puntos_de_interes: PuntoDeInteres[] }> {
    if (cachedMunicipios) return cachedMunicipios;

    const file = path.join(CONTENT_DIR, 'municipios.json');
    if (!fs.existsSync(file)) {
        return {};
    }

    try {
        const data = fs.readFileSync(file, 'utf-8');
        cachedMunicipios = JSON.parse(data);
        return cachedMunicipios || {};
    } catch (e) {
        console.error('Failed to load OKF municipios cache:', e);
        return {};
    }
}

export class OKFService {
    /**
     * Gets Cobertura details by service and municipio slug.
     */
    public static getCobertura(service: string, municipio: string): OKFCobertura | null {
        const coberturas = loadCoberturas();
        const normService = service.toLowerCase().trim();
        const normMunicipio = municipio.toLowerCase().trim();
        const combinedSlug = `${normService}-${normMunicipio}`;

        return coberturas.find(c => {
            const s = (c.frontmatter.service || '').toLowerCase().trim();
            const m = (c.frontmatter.municipio || '').toLowerCase().trim();
            const slug = (c.frontmatter.slug || '').toLowerCase().trim();

            return (s === normService && m === normMunicipio) || slug === combinedSlug || slug === normMunicipio;
        }) || null;
    }

    /**
     * Gets FAQs for a given service and municipio slug.
     */
    public static getFaqs(service: string, municipio: string): OKFFaq[] {
        const faqsMap = loadFaqs();
        const normService = service.toLowerCase().trim();
        const normMunicipio = municipio.toLowerCase().trim();
        const key = `${normService}:${normMunicipio}`;
        
        if (faqsMap[key]) return faqsMap[key];

        // Direct lookup from Cobertura if key missing
        const cobertura = OKFService.getCobertura(service, municipio);
        return cobertura?.faqs || [];
    }

    /**
     * Gets Puntos de Interés for a given municipio slug.
     */
    public static getPuntosDeInteres(municipio: string): PuntoDeInteres[] {
        const municipiosMap = loadMunicipios();
        const normMunicipio = municipio.toLowerCase().trim();
        const mun = municipiosMap[normMunicipio];
        return mun?.puntos_de_interes || [];
    }

    /**
     * Gets all synced coberturas.
     */
    public static getAllCoberturas(): OKFCobertura[] {
        return loadCoberturas();
    }

    /**
     * Gets all covered municipios for a given service (or all services if omitted).
     */
    public static getCoveredMunicipios(service?: string): { slug: string; name: string; service: string; h1Title?: string }[] {
        const coberturas = loadCoberturas();
        const municipiosMap = loadMunicipios();
        const normService = service ? service.toLowerCase().trim() : null;

        const filtered = normService
            ? coberturas.filter(c => (c.frontmatter.service || '').toLowerCase().trim() === normService)
            : coberturas;

        const map = new Map<string, { slug: string; name: string; service: string; h1Title?: string }>();

        filtered.forEach(c => {
            const slug = c.frontmatter.municipio;
            const key = normService ? slug : `${c.frontmatter.service}:${slug}`;
            
            if (!map.has(key)) {
                let name = slug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                if (c.frontmatter.title) {
                    const match = c.frontmatter.title.match(/\sen\s+([A-ZÁÉÍÓÚÀÈÒL·LÑa-záéíóúàèòl·lñ\s'-]+)$/i);
                    if (match && match[1]) {
                        name = match[1].trim();
                    }
                }

                map.set(key, {
                    slug,
                    name,
                    service: c.frontmatter.service,
                    h1Title: c.h1Title || c.frontmatter.title
                });
            }
        });

        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }

    /**
     * Returns static route parameters for dynamic Next.js pages.
     */
    public static getStaticParams(): { service: string; city: string }[] {
        const coberturas = loadCoberturas();
        return coberturas.map(c => ({
            service: c.frontmatter.service,
            city: c.frontmatter.municipio,
        }));
    }
}
