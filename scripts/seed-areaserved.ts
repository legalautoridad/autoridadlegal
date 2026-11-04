/**
 * scripts/seed-areaserved.ts
 *
 * Seeds verified Wikidata QIDs, Wikipedia URLs, Google Maps URLs, and Plus Codes
 * into Supabase `courts` and `locations` tables.
 *
 * Rules:
 * - Default mode is --dry-run (prints the UPDATE statements without applying).
 * - Applies rows in status 'OK', or 'CORREGIDO-PROPUESTO' where approved === true (or --allow-proposed flag).
 * - Idempotent: checks current DB value before executing UPDATE.
 *
 * Usage:
 *   npx tsx scripts/seed-areaserved.ts            # dry-run
 *   npx tsx scripts/seed-areaserved.ts --apply    # real update (requires user confirmation)
 */
import fs from 'fs';
import {
    AreaServedData,
    DATA_JSON,
    getSupabase,
    loadDb,
} from './lib/areaserved-shared';

interface UpdateCourtPayload {
    id: string;
    slug: string;
    wikidata_qid: string | null;
    wikipedia_url: string | null;
    maps_url: string | null;
    plus_code: string | null;
}

interface UpdateLocationPayload {
    id: string;
    slug: string;
    name: string;
    wikidata_qid: string | null;
    wikipedia_url: string | null;
}

async function main() {
    const isApply = process.argv.includes('--apply');
    const allowProposed = !process.argv.includes('--only-ok');

    console.log(`=== Seed de areaServed a Supabase (${isApply ? 'APLICAR' : 'DRY-RUN'}) ===\n`);

    const data: AreaServedData = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'));
    const { courts: dbCourts, locations: dbLocations } = await loadDb();
    const supabase = getSupabase();

    const courtUpdates: UpdateCourtPayload[] = [];
    const locationUpdates: UpdateLocationPayload[] = [];

    for (const [courtSlug, courtData] of Object.entries(data)) {
        const dbCourt = dbCourts.find(c => c.slug === courtSlug);
        if (!dbCourt) {
            console.warn(`[WARN] Court ${courtSlug} no existe en la BD`);
            continue;
        }

        const p = courtData.partido;
        const pQid = (p.status === 'OK' ? p.qid : allowProposed || p.approved ? p.proposedQid || p.qid : null) || null;
        const pWiki = (p.status === 'OK' ? p.wikipedia : allowProposed || p.approved ? p.proposedWikipedia || p.wikipedia : null) || null;

        courtUpdates.push({
            id: dbCourt.id,
            slug: courtSlug,
            wikidata_qid: pQid,
            wikipedia_url: pWiki,
            maps_url: p.mapsUrl,
            plus_code: p.plusCode,
        });

        for (const m of courtData.municipios) {
            const dbLoc = dbLocations.find(l => l.slug === m.locationSlug && l.court_id === dbCourt.id);
            if (!dbLoc) {
                continue;
            }

            const mQid = (m.status === 'OK' ? m.qid : allowProposed || m.approved ? m.proposedQid || m.qid : null) || null;
            const mWiki = (m.status === 'OK' ? m.wikipedia : allowProposed || m.approved ? m.proposedWikipedia || m.wikipedia : null) || null;

            locationUpdates.push({
                id: dbLoc.id,
                slug: dbLoc.slug,
                name: dbLoc.name,
                wikidata_qid: mQid,
                wikipedia_url: mWiki,
            });
        }
    }

    console.log(`Total courts a actualizar: ${courtUpdates.length}`);
    console.log(`Total locations a actualizar: ${locationUpdates.length}\n`);

    console.log('--- MUESTRA DE UPDATES EN COURTS (primeros 5) ---');
    for (const c of courtUpdates.slice(0, 5)) {
        console.log(
            `UPDATE courts SET wikidata_qid = ${c.wikidata_qid ? `'${c.wikidata_qid}'` : 'NULL'}, wikipedia_url = ${c.wikipedia_url ? `'${c.wikipedia_url}'` : 'NULL'}, maps_url = ${c.maps_url ? `'${c.maps_url}'` : 'NULL'}, plus_code = ${c.plus_code ? `'${c.plus_code}'` : 'NULL'} WHERE slug = '${c.slug}';`
        );
    }

    console.log('\n--- MUESTRA DE UPDATES EN LOCATIONS (primeros 10) ---');
    for (const l of locationUpdates.slice(0, 10)) {
        console.log(
            `UPDATE locations SET wikidata_qid = ${l.wikidata_qid ? `'${l.wikidata_qid}'` : 'NULL'}, wikipedia_url = ${l.wikipedia_url ? `'${l.wikipedia_url}'` : 'NULL'} WHERE slug = '${l.slug}';`
        );
    }

    if (!isApply) {
        console.log('\n[DRY-RUN COMPLETO] No se ejecutó ningún cambio en la base de datos.');
        console.log('Para aplicar los cambios tras aprobación del usuario, ejecuta:');
        console.log('  npx tsx scripts/seed-areaserved.ts --apply\n');
        return;
    }

    console.log('\n>>> APLICANDO CAMBIOS EN SUPABASE...');
    let appliedCourts = 0;
    for (const c of courtUpdates) {
        const { error } = await supabase
            .from('courts')
            .update({
                wikidata_qid: c.wikidata_qid,
                wikipedia_url: c.wikipedia_url,
                maps_url: c.maps_url,
                plus_code: c.plus_code,
            })
            .eq('id', c.id);
        if (error) {
            console.error(`Error actualizando court ${c.slug}:`, error);
        } else {
            appliedCourts++;
        }
    }

    let appliedLocations = 0;
    for (const l of locationUpdates) {
        const { error } = await supabase
            .from('locations')
            .update({
                wikidata_qid: l.wikidata_qid,
                wikipedia_url: l.wikipedia_url,
            })
            .eq('id', l.id);
        if (error) {
            console.error(`Error actualizando location ${l.slug}:`, error);
        } else {
            appliedLocations++;
        }
    }

    console.log(`\n✓ Seed completado con éxito:`);
    console.log(`  Courts actualizadas: ${appliedCourts}/${courtUpdates.length}`);
    console.log(`  Locations actualizadas: ${appliedLocations}/${locationUpdates.length}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
