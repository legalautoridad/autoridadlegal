import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function applyMigration() {
    console.log('🚀 Applying migration: 20260211_create_user_profiles.sql')

    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260211_create_user_profiles.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Since Supabase JS client doesn't have a direct "run raw sql" without a proxy 
    // we use a trick or the REST API if available for RPC.
    // However, for migrations, raw SQL via REST is usually restricted to specific functions.
    // In this environment, we can try to use a basic query if the table target is simple, 
    // but migration SQL often contains multiple statements.

    // Alternative: Use a direct postgres connection if possible, or just inform the user.
    // BUT! Most Supabase projects have a 'postgres' schema and we can try to use 
    // the internal 'exec_sql' if we have it, but usually we don't.

    console.log('Sending SQL to Supabase...')

    // Using simple query to check if we can at least create the type or table
    // For complex migrations, we might need the user to paste this into the SQL Editor.

    try {
        // We will try to execute the SQL block by block if possible, or as one big block
        // Supabase REST API doesn't support raw multi-statement SQL easily via the JS client.

        console.warn('⚠️  Note: Supabase JS library is limited for multi-statement migrations.')
        console.warn('Attempting execution...')

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

        if (error) {
            console.error('❌ Error executing SQL via RPC:', error.message)
            console.info('Tip: If "exec_sql" function is missing, please paste the migration SQL into the Supabase Dashboard SQL Editor.')
        } else {
            console.log('✅ Migration applied successfully!')
        }
    } catch (err: any) {
        console.error('❌ Unexpected error:', err.message)
    }
}

applyMigration()
