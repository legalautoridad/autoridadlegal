import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    const { data, error } = await supabase.rpc('get_tables_info', {}).catch(async () => {
        // Fallback if RPC doesn't exist: query information_schema
        return await supabase.from('users').select('*').limit(1).then(() => {
            return supabase.rpc('get_tables_info', {}); // Try again if it was a permission thing
        }).catch(() => {
            // Let's use a raw SQL query if possible via a known action or just guess common tables
            return { data: null, error: 'RPC not found' };
        });
    });

    // Alternatively, let's just query a known list of tables we've worked with
    const tables = ['users', 'lawyer_members', 'lawyer_profiles', 'locations', 'courts', 'articles'];
    console.log('Tables to backup:', tables.join(', '));
    return tables;
}

listTables();
