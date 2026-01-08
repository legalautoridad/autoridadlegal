import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('🌱 Seeding Rich Dummy Case...')

    let lawyerId: string | null = null

    // 1. Get Wallet/User
    const { data: wallet } = await supabase.from('lawyer_wallets').select('lawyer_id').limit(1).single()

    if (wallet) {
        lawyerId = wallet.lawyer_id
        console.log(`✅ Found existing lawyer wallet: ${lawyerId}`)
    } else {
        const { data: users, error } = await supabase.auth.admin.listUsers()
        if (error || !users.users.length) {
            console.error('❌ No users found.')
            process.exit(1)
        }
        lawyerId = users.users[0].id
        console.log(`⚠️ Picking first user: ${lawyerId}`)

        // Ensure wallet exists
        await supabase.from('lawyer_wallets').upsert({
            lawyer_id: lawyerId,
            balance: 100
        })
    }

    // 2. Cleanup Old Rogelios
    const { error: deleteError } = await supabase
        .from('cases')
        .delete()
        .ilike('client_name', '%Rogelio Prueba%')

    if (!deleteError) {
        console.log('🧹 Cleaned up old test cases.')
    }

    // Check Schema Capabilities
    const { error: cityCheck } = await supabase.from('cases').select('client_city').limit(1)
    const hasCity = !cityCheck

    console.log(`ℹ️ Schema Capability: client_city=${hasCity}`)

    // 3. Insert Rich Case
    const richCase: any = {
        client_name: hasCity ? "Rogelio Prueba Test" : "Rogelio Prueba Test (Barcelona)",
        client_phone: "600123456",
        honorarios: 1000,
        reservation_amount: 50,
        status: 'ASSIGNED',
        assigned_lawyer_id: lawyerId,

        // New Fields
        notes: "Notas iniciales: Llamar antes de las 14h.",
        ai_summary: "Cliente detenido en control preventivo. Tasa 0.65. Muestra ansiedad alta por pérdida de licencia (Taxista). Reincidente de hace 3 años.",
        client_profile: {
            job: "Taxista",
            salary: 1200,
            children: 2,
            mortgage: true,
            antecedents_description: "Alcoholemia 2023",
            family_situation: "Casado"
        },
        created_at: new Date().toISOString()
    }

    if (hasCity) {
        richCase.client_city = "Barcelona"
    }

    const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert(richCase)
        .select()
        .single()

    if (caseError) {
        console.error('❌ Failed to insert case:', caseError)
        console.error('👉 ACTION REQUIRED: Run the migration "supabase/migrations/20260105_enrich_cases.sql" in your Supabase Dashboard.')
        process.exit(1)
    }

    console.log(`✅ Rich Case Created Successfully! ID: ${newCase.id}`)
}

seed()
