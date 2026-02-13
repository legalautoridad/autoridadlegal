import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debugJoin() {
    console.log('--- Join Debug Diagnostic ---')

    // Test simple join
    const { data, error } = await supabase
        .from('lawyer_members')
        .select(`
            id,
            lawyer_profiles (
                id
            )
        `)
        .limit(1)

    if (error) {
        console.error('Join Error Detected:', error)
    } else {
        console.log('Join Success Sample:', JSON.stringify(data, null, 2))
    }

    // Check relationship column in lawyer_profiles
    const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'lawyer_profiles' });
    // If rpc doesn't exist, try query
    if (colError) {
        const { data: profiles, error: pError } = await supabase.from('lawyer_profiles').select('*').limit(1);
        if (pError) console.error('Error fetching profiles:', pError);
        else console.log('Sample profile record:', profiles[0]);
    }
}

debugJoin()
