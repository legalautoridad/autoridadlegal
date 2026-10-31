import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyDataFixes() {
    console.log('🔄 Executing confirmed database fixes in Supabase...');

    // 1. Fix typos in semantic_entities
    const typoUpdates = [
        {
            id: '2a41ded6-12d1-4754-851e-6d51ae5bcfe3',
            name: 'Procurador de los Tribunales',
            description: 'Profesional del derecho que ostenta la representación técnica de los ciudadanos ante los juzgados, obligatorio en procedimientos de juicio rápido.',
        },
        {
            id: '905c5562-061a-4342-a6d5-8e6368cdf645',
            name: 'Conducción bajo los efectos de Estupefacientes',
            description: 'Delito consistente en pilotar un vehículo a motor teniendo las capacidades psicofísicas alteradas por el consumo de sustancias psicoactivas.',
        },
        {
            id: '15e95229-64ef-4cb7-ac99-1a475b08486c',
            name: 'Cancelación de Antecedentes Penales',
            description: 'Tramitación administrativa que elimina los registros de una condena firme en el Registro Central de Penados tras cumplir la pena y transcurrir el plazo legal.',
        },
    ];

    for (const item of typoUpdates) {
        const { data, error } = await supabase
            .from('semantic_entities')
            .update({ description: item.description })
            .eq('id', item.id)
            .select('id, name, description');

        if (error) {
            console.error(`❌ Failed to update semantic_entities (${item.name}):`, error);
        } else {
            console.log(`✅ Updated semantic_entity [${item.name}]:`, data?.[0]?.description);
        }
    }

    // 2. Clean trailing whitespaces/newlines in locations
    const locationsToTrim = [
        { id: 'f4472dda-c005-404a-9433-7b8f61e67b94', name: "Cabrera d'Anoia" },
        { id: '906f30e8-18e4-4fdd-9850-ccff8e887bd6', name: 'Caldes de Montbui' },
        { id: 'fd61aaea-bb19-44c8-b9c3-eacee31a3896', name: 'Puig-reig' },
        { id: '162f6ca7-d6ea-4662-a519-86997b916ddc', name: 'Sant Jaume Frontanyà' },
    ];

    for (const loc of locationsToTrim) {
        const { data, error } = await supabase
            .from('locations')
            .update({ name: loc.name })
            .eq('id', loc.id)
            .select('id, slug, name');

        if (error) {
            console.error(`❌ Failed to trim location (${loc.name}):`, error);
        } else {
            console.log(`✅ Cleaned location name [${loc.name}]:`, data?.[0]);
        }
    }

    // 3. Link Bellaterra to Cerdanyola del Vallès court
    const bellaterraCourtId = '6295b540-748e-4804-b6b1-3e773f50aaf2'; // Juzgados de Cerdanyola del Vallès
    const { data: bellaData, error: bellaError } = await supabase
        .from('locations')
        .update({ court_id: bellaterraCourtId })
        .eq('slug', 'bellaterra-uab')
        .select('id, slug, name, court_id, courts(name, address)');

    if (bellaError) {
        console.error('❌ Failed to link Bellaterra to court:', bellaError);
    } else {
        console.log('✅ Linked Bellaterra to Cerdanyola del Vallès court:', bellaData?.[0]);
    }

    console.log('🏁 All database fixes executed successfully.');
}

applyDataFixes().catch(err => {
    console.error('Unhandled error applying data fixes:', err);
    process.exit(1);
});
