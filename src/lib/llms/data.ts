import { createStaticClient } from '@/lib/supabase/server';
import { SERVICES_PRICING, PRICING_ADDONS, ServicePricing, PricingAddOn } from '@/lib/config/pricing';
import { getServiceFaqs, ServiceFaq } from '@/lib/db/services';
import { getHomepageFaqs, HomepageFaq } from '@/lib/db/homepage-faqs';
import { getAllGlosarioTerms, DbGlosarioTerm } from '@/lib/db/glosario';
import { LLMS_SERVICES } from './constants';

export interface LlmsCourtDistrict {
    id: string;
    slug: string;
    judicialDistrict: string;
    address: string;
    municipalities: string[];
}

export interface LlmsFullDataset {
    courts: LlmsCourtDistrict[];
    serviceFaqsBySlug: Record<string, ServiceFaq[]>;
    homepageFaqs: HomepageFaq[];
    glossaryTerms: DbGlosarioTerm[];
    pricing: {
        services: ServicePricing[];
        addOns: Record<string, PricingAddOn>;
    };
}

/**
 * Fetches courts + municipalities (location_type = 'municipio', excluding 'bellaterra-uab')
 * grouped by court_id, with municipalities sorted by localeCompare(b, 'ca', { sensitivity: 'base' }).
 */
export async function getLlmsCourtsData(): Promise<LlmsCourtDistrict[]> {
    const supabase = createStaticClient();

    const [{ data: courtsData, error: courtsError }, { data: locsData, error: locsError }] = await Promise.all([
        supabase.from('courts').select('id, slug, judicial_district, address'),
        supabase
            .from('locations')
            .select('id, slug, name, court_id, location_type')
            .eq('location_type', 'municipio')
            .neq('slug', 'bellaterra-uab'),
    ]);

    if (courtsError || !courtsData) {
        console.error('Error fetching courts for llms:', courtsError);
        return [];
    }
    if (locsError) {
        console.error('Error fetching locations for llms:', locsError);
    }

    const munsByCourtId = new Map<string, string[]>();
    for (const loc of locsData || []) {
        if (!loc.court_id || !loc.name) continue;
        if (!munsByCourtId.has(loc.court_id)) {
            munsByCourtId.set(loc.court_id, []);
        }
        munsByCourtId.get(loc.court_id)!.push(loc.name.trim());
    }

    const result: LlmsCourtDistrict[] = courtsData.map(court => {
        const municipalities = (munsByCourtId.get(court.id) || []).sort((a, b) =>
            a.localeCompare(b, 'ca', { sensitivity: 'base' })
        );
        return {
            id: court.id,
            slug: court.slug,
            judicialDistrict: (court.judicial_district || '').trim(),
            address: (court.address || '').trim(),
            municipalities,
        };
    });

    // Order courts matching the reference file order (by judicialDistrict in 'ca' locale, with Igualada before L'Hospitalet)
    result.sort((a, b) => a.judicialDistrict.localeCompare(b.judicialDistrict, 'ca', { sensitivity: 'base' }));

    return result;
}

/**
 * Fetches all data required to render /llms-full.txt in server context.
 */
export async function getLlmsFullDataset(): Promise<LlmsFullDataset> {
    const [courts, homepageFaqs, glossaryTerms, ...serviceFaqsArrays] = await Promise.all([
        getLlmsCourtsData(),
        getHomepageFaqs(),
        getAllGlosarioTerms(),
        ...LLMS_SERVICES.map(s => getServiceFaqs(s.slug)),
    ]);

    const serviceFaqsBySlug: Record<string, ServiceFaq[]> = {};
    LLMS_SERVICES.forEach((s, idx) => {
        serviceFaqsBySlug[s.slug] = serviceFaqsArrays[idx] || [];
    });

    return {
        courts,
        serviceFaqsBySlug,
        homepageFaqs,
        glossaryTerms,
        pricing: {
            services: SERVICES_PRICING,
            addOns: PRICING_ADDONS,
        },
    };
}

