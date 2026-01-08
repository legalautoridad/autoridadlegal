import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function inspect() {
    console.log('🔍 Inspecting cases table schema...')

    // Method 1: Try to select * limit 1 and see the returned keys (if rows exist)
    // Method 2: Use an RPC if available? No.
    // Method 3: Just try to select specific columns and catch error.

    const columnsToCheck = ['client_city', 'ai_summary', 'client_profile', 'notes']
    const results: Record<string, string> = {}

    for (const col of columnsToCheck) {
        const { error } = await supabase.from('cases').select(col).limit(1)
        if (error) {
            results[col] = `MISSING (${error.message})`
        } else {
            results[col] = 'EXISTS'
        }
    }

    console.table(results)
}

inspect()
