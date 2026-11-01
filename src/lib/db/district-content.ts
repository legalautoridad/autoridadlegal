import { createStaticClient } from '@/lib/supabase/server';
import { SERVICES_PRICING, ServicePricing } from '@/lib/config/pricing';
import { parseGpsCoords } from '@/lib/db/cobertura';

export interface DistrictMunicipality {
    id: string;
    name: string;
    slug: string;
    population: number | null;
}

export interface SearchableMunicipality {
    id: string;
    slug: string;
    name: string;
    courtSlug: string;
    partido: string;
    oficial: string;
    address: string | null;
}

export interface CourtFaqRow {
    id: string;
    position: number;
    question: string;
    answer: string;
}

export interface DistrictCourtData {
    id: string;
    slug: string;
    name: string;
    judicialDistrict: string;
    officialName: string;
    address: string | null;
    phone: string | null;
    fiscaliaAddress: string | null;
    gpsCoords: { lat: number; lng: number } | null;
    atestadoInfo: string | null;
    hospitalContraste: string | null;
    depositoVehiculos: string | null;
    practicalReviewed: boolean;
}

export interface DistrictFullData {
    slug: string;
    court: DistrictCourtData;
    municipalities: DistrictMunicipality[];
    topMunicipalities: DistrictMunicipality[];
    allMunicipalities: SearchableMunicipality[];
    policeBodies: string[];
    publicTransport: string[];
    reviewedCourtFaqs: CourtFaqRow[];
    pricing: ServicePricing[];
    published: boolean;
}

function cleanJudicialDistrict(raw: string | null | undefined): string {
    return (raw || '')
        .replace(
            /^(Partido Judicial de|Juzgados de Primera Instancia e Instrucción de|Juzgados de Instrucción de|Juzgados de)\s+/i,
            ''
        )
        .trim();
}

function extractPoliceBodyName(rawName: string): string {
    return rawName
        .split(/\s+-\s+/)[0]
        .replace(/\s*\(Referencia[^)]*\)/gi, '')
        .trim();
}

function isPublicTransportName(rawName: string): boolean {
    const trimmed = rawName.trim();
    if (/^(Eje\s|Autopista\b|Autovía\b|Carretera\b|Ronda\b|Vía\b|Camino\b)/i.test(trimmed)) {
        return false;
    }
    return /(Estación|Intercambiador|Parada|Metro|Rodalies|FGC|Autobuses|TRAM|Tram|Renfe|Funicular)/i.test(
        trimmed
    );
}

/**
 * Fetches full data for a given judicial district slug (/juzgados/[slug]).
 * Excludes 'bellaterra-uab' so only the 309 official municipalities are included.
 */
export async function getDistrictData(slug: string): Promise<DistrictFullData | null> {
    const supabase = createStaticClient();

    const [
        { data: allCourts, error: courtsError },
        { data: allLocs, error: locsError },
        { data: pointsData },
    ] = await Promise.all([
        supabase.from('courts').select('*').order('slug'),
        supabase
            .from('locations')
            .select('id, name, slug, court_id, location_type, population')
            .eq('location_type', 'municipio')
            .neq('slug', 'bellaterra-uab'),
        supabase.from('interest_points').select('*'),
    ]);

    if (courtsError || locsError || !allCourts) {
        return null;
    }

    const court = allCourts.find(c => c.slug === slug);
    if (!court) {
        return null;
    }

    const courtsById = new Map<string, any>();
    allCourts.forEach(c => courtsById.set(c.id, c));

    // All 309 searchable municipalities across all 25 districts
    const allMunicipalities: SearchableMunicipality[] = (allLocs || [])
        .filter(l => l.court_id && courtsById.has(l.court_id))
        .map(l => {
            const c = courtsById.get(l.court_id)!;
            return {
                id: l.id,
                slug: l.slug,
                name: l.name,
                courtSlug: c.slug,
                partido: cleanJudicialDistrict(c.judicial_district || c.name),
                oficial: c.official_name || c.name,
                address: c.address || null,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'ca'));

    // Municipalities belonging to this district (ordered alphabetically in 'ca')
    const districtMunicipalities: DistrictMunicipality[] = (allLocs || [])
        .filter(l => l.court_id === court.id)
        .map(l => ({
            id: l.id,
            name: l.name,
            slug: l.slug,
            population: typeof l.population === 'number' ? l.population : null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ca'));

    // Top municipalities by population desc, max 4
    const topMunicipalities: DistrictMunicipality[] = [...districtMunicipalities]
        .sort((a, b) => {
            const popDiff = (b.population || 0) - (a.population || 0);
            if (popDiff !== 0) return popDiff;
            return a.name.localeCompare(b.name, 'ca');
        })
        .slice(0, 4);

    const locById = new Map<string, DistrictMunicipality>();
    districtMunicipalities.forEach(m => locById.set(m.id, m));

    // Sort district interest points so those in the seat municipality (slug === court.slug) come first
    const districtPoints = (pointsData || [])
        .filter(p => locById.has(p.location_id))
        .sort((a, b) => {
            const aIsSeat = locById.get(a.location_id)?.slug === court.slug ? 0 : 1;
            const bIsSeat = locById.get(b.location_id)?.slug === court.slug ? 0 : 1;
            if (aIsSeat !== bIsSeat) return aIsSeat - bIsSeat;
            return (a.position || 99) - (b.position || 99);
        });

    // 1.5 Police bodies (class = 'policias'), deduplicated corps names only
    const policeBodiesSet = new Set<string>();
    districtPoints
        .filter(p => (p.class || p.category) === 'policias' && p.name)
        .forEach(p => {
            const bodyName = extractPoliceBodyName(p.name);
            if (bodyName) {
                policeBodiesSet.add(bodyName);
            }
        });
    const policeBodies = Array.from(policeBodiesSet);

    // 1.6 Public transport (class = 'comunicaciones'), max 3, excluding highways/roads
    const publicTransportSet = new Set<string>();
    districtPoints
        .filter(p => (p.class || p.category) === 'comunicaciones' && p.name && isPublicTransportName(p.name))
        .forEach(p => {
            if (publicTransportSet.size < 3) {
                publicTransportSet.add(p.name.trim());
            }
        });
    const publicTransport = Array.from(publicTransportSet);

    // 1.7 Reviewed court FAQs from court_faqs table
    let reviewedCourtFaqs: CourtFaqRow[] = [];
    try {
        const { data: faqsData } = await supabase
            .from('court_faqs')
            .select('id, position, question, answer')
            .eq('court_id', court.id)
            .eq('reviewed', true)
            .order('position', { ascending: true });
        if (faqsData) {
            reviewedCourtFaqs = faqsData;
        }
    } catch {
        reviewedCourtFaqs = [];
    }

    const judicialDistrict = cleanJudicialDistrict(court.judicial_district || court.name);
    const practicalReviewed = Boolean(court.practical_reviewed);

    const courtData: DistrictCourtData = {
        id: court.id,
        slug: court.slug,
        name: court.name,
        judicialDistrict,
        officialName: court.official_name || court.name,
        address: court.address || null,
        phone: court.phone || null,
        fiscaliaAddress: court.fiscalia_address || null,
        gpsCoords: parseGpsCoords(court.gps_coords),
        atestadoInfo: practicalReviewed && court.atestado_info ? String(court.atestado_info).trim() : null,
        hospitalContraste:
            practicalReviewed && court.hospital_contraste ? String(court.hospital_contraste).trim() : null,
        depositoVehiculos:
            practicalReviewed && court.deposito_vehiculos ? String(court.deposito_vehiculos).trim() : null,
        practicalReviewed,
    };

    return {
        slug: court.slug,
        court: courtData,
        municipalities: districtMunicipalities,
        topMunicipalities,
        allMunicipalities,
        policeBodies,
        publicTransport,
        reviewedCourtFaqs,
        pricing: SERVICES_PRICING,
        published: true,
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
 * Fetches summary list of all 25 districts with all 309 municipalities (excluding bellaterra-uab).
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
            .select('id, name, slug, court_id, location_type, population')
            .eq('location_type', 'municipio')
            .neq('slug', 'bellaterra-uab'),
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
            population: typeof l.population === 'number' ? l.population : null,
        });
    });

    const indexData = (courts || []).map(court => {
        const municipalities = (locsByCourt.get(court.id) || []).sort((a, b) =>
            a.name.localeCompare(b.name, 'ca')
        );
        const judicialDistrict = cleanJudicialDistrict(court.judicial_district || court.name);
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

    return indexData.sort((a, b) => a.judicialDistrict.localeCompare(b.judicialDistrict, 'ca'));
}
