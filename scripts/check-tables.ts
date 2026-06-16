import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    let data = null;
    let error: any = null;
    try {
        const res = await supabase.rpc('get_tables_info', {});
        data = res.data;
        error = res.error;
    } catch (e) {
        // Fallback if RPC doesn't exist
        try {
            await supabase.from('users').select('*').limit(1);
            const res = await supabase.rpc('get_tables_info', {});
            data = res.data;
            error = res.error;
        } catch (err) {
            error = 'RPC not found';
        }
    }

    // Alternatively, let's just query a known list of tables we've worked with
    const tables = ['users', 'lawyer_members', 'lawyer_profiles', 'locations', 'courts', 'articles'];
    console.log('Tables to backup:', tables.join(', '));
    return tables;
}

listTables();
