import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
    console.log('--- DB Check for Canet de Mar ---');
    const { data: loc, error: locErr } = await supabase.from('locations').select('*, courts(*)').eq('slug', 'canet-de-mar').single();
    console.log('Location error:', locErr);
    console.log('Location:', loc ? { id: loc.id, slug: loc.slug, name: loc.name, court: loc.courts } : null);
    
    if (loc) {
        const { data: ls, error: lsErr } = await supabase.from('location_services').select('*').eq('location_id', loc.id);
        console.log('Location Services error:', lsErr);
        console.log('Location Services:', ls);
    }

    const { data: allLocs } = await supabase.from('locations').select('slug, name, web_published:location_services(service, web_published)');
    console.log('Total locations in DB:', allLocs?.length);
    console.log('Sample locations:', allLocs?.slice(0, 10));
}

check();
