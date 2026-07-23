import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('Querying locations...');
    const { data: locations, error } = await supabase
        .from('locations')
        .select('*, courts(*)')
        .eq('slug', 'barcelona');

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    console.log('Barcelona location details:', JSON.stringify(locations[0], null, 2));
}

main();
