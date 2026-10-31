import { createStaticClient } from '@/lib/supabase/server';
import { SERVICES_PRICING, ServicePricing } from '@/lib/config/pricing';
import { parseGpsCoords } from '@/lib/db/cobertura';
import fs from 'fs';
import path from 'path';

export interface DistrictMunicipality {
    id: string;
    name: string;
    slug: string;
}

export interface DistrictInterestPoint {
    id: string;
    name: string;
    category: string;
    details: string;
    lat: number | null;
    lng: number | null;
}

export interface DistrictCourtData {
    id: string;
    slug: string;
    name: string;
    judicialDistrict: string;
    officialName: string;
    address: string | null;
    phone: string | null;
    phoneGuardia: string | null;
    fiscaliaAddress: string | null;
    protocoloGuardia: string | null;
    gpsCoords: { lat: number; lng: number } | null;
    buildingOrganization: string | null;
}

export interface AuthoredDistrictContent {
    entradilla?: string | null;
    queHacerAhoraNotes?: string | null;
    juzgadoNotes?: string | null;
    fiscaliaNotes?: string | null;
    guardiaNotes?: string | null;
    criteriosFiscalNotes?: string | null;
    actuacionPolicialNotes?: string | null;
    experienciaDespachoNotes?: string | null;
    delitosNotes?: Record<string, string>;
    videoUrl?: string | null;
    transcriptText?: string | null;
}

export interface DistrictFullData {
    slug: string;
    court: DistrictCourtData;
    municipalities: DistrictMunicipality[];
    interestPoints: DistrictInterestPoint[];
    pricing: ServicePricing[];
    authored: AuthoredDistrictContent;
    published: boolean;
}

/**
 * Sanitizes authored text to ensure placeholders like [A RELLENAR ABOGADO] are never rendered in public HTML.
 */
function sanitizeAuthoredText(text: string | null | undefined): string | null {
    if (!text) return null;
    const trimmed = text.trim();
    if (trimmed.includes('[A RELLENAR ABOGADO]')) {
        const lines = trimmed.split('\n').filter(line => !line.includes('[A RELLENAR ABOGADO]'));
        const cleaned = lines.join('\n').trim();
        return cleaned.length > 0 ? cleaned : null;
    }
    return trimmed;
}

/**
 * Helper to check if markdown draft file contains real human authored content beyond placeholders.
 */
function parseDraftFileAuthoredContent(slug: string): { authored: AuthoredDistrictContent; isPublished: boolean } {
    const draftPath = path.join(process.cwd(), 'content/borradores/partidos-judiciales', `${slug}.md`);
    if (!fs.existsSync(draftPath)) {
        return { authored: {}, isPublished: true };
    }

    try {
        const rawContent = fs.readFileSync(draftPath, 'utf-8');
        const isPublished = rawContent.includes('published: true');

        return {
            authored: {
                entradilla: sanitizeAuthoredText(undefined),
            },
            isPublished,
        };
    } catch {
        return { authored: {}, isPublished: true };
    }
}

/**
 * Fetches data for a given district slug from DB.
 * Uses `locations` joined with `courts` where `location_type = 'municipio'` (all 310 municipalities across 25 districts).
 */
export async function getDistrictData(slug: string): Promise<DistrictFullData | null> {
    const supabase = createStaticClient();

    const { data: court, error } = await supabase
        .from('courts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !court) {
        return null;
    }

    // Fetch all municipalities belonging to this judicial district (location_type = 'municipio')
    const { data: locs } = await supabase
        .from('locations')
        .select('id, name, slug, court_id, location_type')
        .eq('court_id', court.id)
        .eq('location_type', 'municipio');

    const districtMunicipalities: DistrictMunicipality[] = (locs || [])
        .map(l => ({ id: l.id, name: l.name, slug: l.slug }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es'));

    const locIds = new Set(districtMunicipalities.map(m => m.id));

    // Fetch interest points for municipalities in this district
    const { data: pointsData } = await supabase
        .from('interest_points')
        .select('*');

    const districtInterestPoints: DistrictInterestPoint[] = (pointsData || [])
        .filter(p => locIds.has(p.location_id))
        .map(p => ({
            id: p.id,
            name: p.name,
            category: p.class || p.category || 'Puntos de Control y Comisarías',
            details: p.details || p.description || '',
            lat: p.lat ?? null,
            lng: p.lng ?? null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es'));

    // Building organization string from efficiency_data
    let buildingOrganization: string | null = null;
    if (court.efficiency_data) {
        const eff = court.efficiency_data;
        const parts: string[] = [];
        if (eff.reforma) parts.push(eff.reforma);
        if (eff.secciones) {
            if (typeof eff.secciones === 'object') {
                Object.entries(eff.secciones).forEach(([key, val]) => {
                    parts.push(`${key.replace(/_/g, ' ')}: ${val}`);
                });
            } else {
                parts.push(String(eff.secciones));
            }
        }
        if (parts.length > 0) buildingOrganization = parts.join(' • ');
    }

    const judicialDistrict = (court.judicial_district || court.name || '')
        .replace(/^(Partido Judicial de|Juzgados de Primera Instancia e Instrucción de|Juzgados de Instrucción de|Juzgados de)\s+/i, '')
        .trim();

    const courtData: DistrictCourtData = {
        id: court.id,
        slug: court.slug,
        name: court.name,
        judicialDistrict,
        officialName: court.official_name || court.name,
        address: court.address || null,
        phone: court.phone || null,
        phoneGuardia: court.phone_guardia || court.phone || null,
        fiscaliaAddress: court.fiscalia_address || null,
        protocoloGuardia: court.protocolo_guardia || null,
        gpsCoords: parseGpsCoords(court.gps_coords),
        buildingOrganization,
    };

    const draftInfo = parseDraftFileAuthoredContent(slug);

    return {
        slug: court.slug,
        court: courtData,
        municipalities: districtMunicipalities,
        interestPoints: districtInterestPoints,
        pricing: SERVICES_PRICING,
        authored: draftInfo.authored,
        published: draftInfo.isPublished,
    };
}

/**
 * Returns all 25 district slugs ordered alphabetically by slug.
 */
export async function getAllDistrictSlugs(): Promise<string[]> {
    const supabase = createStaticClient();
    const { data: courts } = await supabase.from('courts').select('slug').order('slug');
    return (courts || []).map(c => c.slug);
}

/**
 * Returns all 25 published district slugs for SSG generateStaticParams().
 */
export async function getPublishedDistrictSlugs(): Promise<{ slug: string }[]> {
    const slugs = await getAllDistrictSlugs();
    return slugs.map(slug => ({ slug }));
}

/**
 * Fetches summary list of all 25 districts with all 310 municipalities (locations join courts, location_type = 'municipio').
 */
export async function getAllDistrictsIndexData(): Promise<{
    slug: string;
    name: string;
    judicialDistrict: string;
    officialName: string;
    address: string | null;
    municipalities: DistrictMunicipality[];
    published: boolean;
}[]> {
    const supabase = createStaticClient();

    const [{ data: courts }, { data: locs }] = await Promise.all([
        supabase.from('courts').select('*').order('slug'),
        supabase
            .from('locations')
            .select('id, name, slug, court_id, location_type')
            .eq('location_type', 'municipio'),
    ]);

    const locsByCourt = new Map<string, DistrictMunicipality[]>();
    (locs || []).forEach(l => {
        if (!l.court_id) return;
        if (!locsByCourt.has(l.court_id)) {
            locsByCourt.set(l.court_id, []);
        }
        locsByCourt.get(l.court_id)!.push({
            id: l.id,
            name: l.name,
            slug: l.slug,
        });
    });

    const indexData = (courts || []).map(court => {
        const municipalities = (locsByCourt.get(court.id) || []).sort((a, b) =>
            a.name.localeCompare(b.name, 'es')
        );
        const judicialDistrict = (court.judicial_district || court.name || '')
        .replace(/^(Partido Judicial de|Juzgados de Primera Instancia e Instrucción de|Juzgados de Instrucción de|Juzgados de)\s+/i, '')
        .trim();
        return {
            slug: court.slug,
            name: court.name,
            judicialDistrict,
            officialName: court.official_name || court.name,
            address: court.address || null,
            municipalities,
            published: true,
        };
    });

    return indexData.sort((a, b) => a.officialName.localeCompare(b.officialName, 'es'));
}
