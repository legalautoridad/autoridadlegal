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

        return coberturas.find(c =>
            c.frontmatter.service.toLowerCase().trim() === normService &&
            c.frontmatter.municipio.toLowerCase().trim() === normMunicipio
        ) || null;
    }

    /**
     * Gets FAQs for a given service and municipio slug.
     */
    public static getFaqs(service: string, municipio: string): OKFFaq[] {
        const faqsMap = loadFaqs();
        const key = `${service.toLowerCase().trim()}:${municipio.toLowerCase().trim()}`;
        return faqsMap[key] || [];
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
