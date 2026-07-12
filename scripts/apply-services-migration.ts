import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
    console.log('🚀 Applying migration: 20260712_create_services_table.sql')

    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260712_create_services_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('Sending SQL to Supabase...')

    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

        if (error) {
            console.error('❌ Error executing SQL via RPC:', error.message)
            console.info('SQL migration is saved at supabase/migrations/20260712_create_services_table.sql')
        } else {
            console.log('✅ Migration applied successfully!')
        }
    } catch (err: any) {
        console.error('❌ Unexpected error:', err.message)
    }
}

applyMigration()
