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
        // Strip out placeholder text lines if mixed, or return null if purely placeholder
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
        return { authored: {}, isPublished: false };
    }

    try {
        const rawContent = fs.readFileSync(draftPath, 'utf-8');
        // A draft is considered published ONLY if explicit human content has been added and [A RELLENAR ABOGADO] is replaced or verified.
        // For security, if the file still contains any [A RELLENAR ABOGADO] block as its only section content, it remains unpublished.
        
        // Check if there are any non-placeholder authored additions
        const cleanedContent = sanitizeAuthoredText(rawContent);
        
        // For STAGE A/B, published defaults to false unless explicitly set to true in frontmatter or marked published
        const isPublished = rawContent.includes('published: true');

        return {
            authored: {
                entradilla: sanitizeAuthoredText(undefined),
            },
            isPublished,
        };
    } catch {
        return { authored: {}, isPublished: false };
    }
}

/**
 * Fetches data for a given district slug from DB.
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

    // Fetch active published locations for this court
    const { data: locs } = await supabase
        .from('locations')
        .select('id, name, slug, court_id');

    const { data: ls } = await supabase
        .from('location_services')
        .select('location_id')
        .eq('web_published', true);

    const publishedLocIds = new Set((ls || []).map(r => r.location_id));

    const districtMunicipalities: DistrictMunicipality[] = (locs || [])
        .filter(l => l.court_id === court.id && publishedLocIds.has(l.id))
        .map(l => ({ id: l.id, name: l.name, slug: l.slug }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es'));

    const locIds = new Set(districtMunicipalities.map(m => m.id));

    // Fetch interest points for active municipalities
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

    const courtData: DistrictCourtData = {
        id: court.id,
        slug: court.slug,
        name: court.name,
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
 * Returns all 25 district slugs.
 */
export async function getAllDistrictSlugs(): Promise<string[]> {
    const supabase = createStaticClient();
    const { data: courts } = await supabase.from('courts').select('slug').order('slug');
    return (courts || []).map(c => c.slug);
}

/**
 * Returns only published district slugs for SSG generateStaticParams().
 */
export async function getPublishedDistrictSlugs(): Promise<{ slug: string }[]> {
    const slugs = await getAllDistrictSlugs();
    const published: { slug: string }[] = [];

    for (const slug of slugs) {
        const data = await getDistrictData(slug);
        if (data && data.published) {
            published.push({ slug });
        }
    }

    return published;
}

/**
 * Fetches summary list of all 25 districts with their active municipalities for index page.
 */
export async function getAllDistrictsIndexData(): Promise<{
    slug: string;
    officialName: string;
    address: string | null;
    municipalities: DistrictMunicipality[];
    published: boolean;
}[]> {
    const slugs = await getAllDistrictSlugs();
    const indexData = [];

    for (const slug of slugs) {
        const data = await getDistrictData(slug);
        if (data) {
            indexData.push({
                slug: data.slug,
                officialName: data.court.officialName,
                address: data.court.address,
                municipalities: data.municipalities,
                published: data.published,
            });
        }
    }

    return indexData.sort((a, b) => a.officialName.localeCompare(b.officialName, 'es'));
}
