import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { TARGET_MUNICIPIOS, VALID_SERVICES } from '../src/lib/db/cobertura';
import sitemap from '../src/app/sitemap';
import { generateMetadata } from '../src/app/(legal-silos)/[service]/[city]/page';

async function main() {
    console.log('--- Verifying Phase 1B.3 Noindex & Sitemap Rules ---');

    let noindexCount = 0;
    let indexableCount = 0;
    const errors: string[] = [];

    // 1. Fetch all published cities from Supabase (129 locations)
    const { createStaticClient } = await import('../src/lib/supabase/server');
    const supabase = createStaticClient();
    const { data: rows } = await supabase
        .from('location_services')
        .select('service, locations(slug), web_published')
        .eq('web_published', true);

    const citySlugSet = new Set<string>();
    (rows || []).forEach(r => {
        const slug = (r.locations as any)?.slug;
        if (slug) citySlugSet.add(slug);
    });

    const allCities = Array.from(citySlugSet).sort();
    console.log(`Found ${allCities.length} published cities in database.`);

    // 2. Direct metadata unit test for all 645 service/city routes
    console.log('\nChecking generateMetadata() for all service/city combinations...');
    for (const service of VALID_SERVICES) {
        for (const city of allCities) {
            const meta = await generateMetadata({ params: Promise.resolve({ service, city }) });
            const isAlcoholemia = service === 'alcoholemia';

            const hasNoindex = meta.robots && typeof meta.robots === 'object' && meta.robots.index === false;

            if (!isAlcoholemia) {
                if (hasNoindex) {
                    noindexCount++;
                } else {
                    errors.push(`Expected noindex on /${service}/${city}, but found indexable.`);
                }
            } else {
                if (!hasNoindex) {
                    indexableCount++;
                } else {
                    errors.push(`Expected indexable on /${service}/${city}, but found noindex.`);
                }
            }

            // Check canonical URL is self-referential and NOT cross-canonical
            const expectedCanonical = `https://www.autoridad.legal/${service}/${city}`;
            const actualCanonical = meta.alternates?.canonical;
            if (actualCanonical !== expectedCanonical) {
                errors.push(`Canonical mismatch on /${service}/${city}: expected ${expectedCanonical}, got ${actualCanonical}`);
            }
        }
    }

    console.log(`\nMetadata Analysis Results:`);
    console.log(`- Non-alcoholemia (noindexed): ${noindexCount} / 516 expected`);
    console.log(`- Alcoholemia (indexable): ${indexableCount} / 129 expected`);

    // 2. Sitemap XML verification
    console.log('\nChecking sitemap.xml entries...');
    const sitemapEntries = await sitemap();
    const urlsInSitemap = new Set(sitemapEntries.map(e => e.url));

    let alcoholemiaInSitemap = 0;
    let noindexedInSitemap = 0;

    for (const service of VALID_SERVICES) {
        for (const city of allCities) {
            const url = `https://www.autoridad.legal/${service}/${city}`;
            const present = urlsInSitemap.has(url);

            if (service === 'alcoholemia') {
                if (present) {
                    alcoholemiaInSitemap++;
                } else {
                    errors.push(`Missing /alcoholemia/${city} from sitemap.xml`);
                }
            } else {
                if (present) {
                    noindexedInSitemap++;
                    errors.push(`Found noindexed URL /${service}/${city} in sitemap.xml!`);
                }
            }
        }
    }

    console.log(`Sitemap Analysis Results:`);
    console.log(`- /alcoholemia/[city] in sitemap: ${alcoholemiaInSitemap} / 129 expected`);
    console.log(`- Noindexed [service]/[city] in sitemap: ${noindexedInSitemap} / 0 expected`);

    if (errors.length > 0) {
        console.error('\nFAILURES ENCOUNTERED:');
        errors.forEach(err => console.error(`  - ${err}`));
        process.exit(1);
    } else {
        console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    }
}

main().catch(err => {
    console.error('Error during verification:', err);
    process.exit(1);
});
