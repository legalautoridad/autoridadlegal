import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function runXray() {
    console.log('🩻 INICIANDO RADIOGRAFÍA DE BASE DE DATOS: TABLA CASES\n')

    // 1. INTROSPECCIÓN DE ESQUEMA
    const { data: sampleRows, error } = await supabase.from('cases').select('*').limit(1)

    if (error) {
        console.error('❌ Error accediendo a tabla cases:', error)
        process.exit(1)
    }

    if (!sampleRows || sampleRows.length === 0) {
        console.warn('⚠️ La tabla está vacía. No se puede inferir esquema dinámico.')
    } else {
        const row = sampleRows[0]
        console.log('📸 FOTO DEL ESQUEMA ACTUAL (Detectado dinámicamente):')
        const keys = Object.keys(row).sort()
        keys.forEach(key => {
            const val = row[key]
            let type: string = typeof val
            if (val === null) type = 'null (nullable)' as any
            else if (Array.isArray(val)) type = 'array'
            // Detect dates roughly
            if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) type = 'date/timestamp'

            console.log(`  - ${key.padEnd(20)} [${type}]`)
        })
    }
    console.log('\n----------------------------------------\n')

    // 2. INSPECCIÓN DE DATOS RICOS
    console.log('🧐 ANALIZANDO CASO "ROGELIO":')
    const { data: rogelioCase } = await supabase
        .from('cases')
        .select('*')
        .ilike('client_name', '%Rogelio%')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (rogelioCase) {
        console.log(`🆔 ID: ${rogelioCase.id}`)
        console.log(`👤 Nombre: ${rogelioCase.client_name}`)

        console.log('\n🤖 AI SUMMARY:')
        console.log(rogelioCase.ai_summary ? `"${rogelioCase.ai_summary}"` : '⚠️ NO DATOS')

        console.log('\n📋 CLIENT PROFILE JSON:')
        if (rogelioCase.client_profile) {
            console.log(JSON.stringify(rogelioCase.client_profile, null, 2))
        } else {
            console.log('⚠️ NO DATOS')
        }

        console.log('\n📝 NOTAS:')
        console.log(rogelioCase.notes || '---')

    } else {
        console.log('❌ No se encontró el caso de Rogelio.')
    }

    console.log('\n----------------------------------------\n')

    // 3. GAP ANALYSIS (Análisis de Brechas)
    console.log('⚠️ ANÁLISIS DE BRECHAS (PENAL REPORT):')
    const idealColumns = [
        'hearing_date',      // Citación judicial / Juicio Rápido
        'incident_date',     // Fecha del delito
        'alcohol_rate',      // Tasa alcoholemia (clave en lo penal)
        'police_station',    // Comisaría donde está detenido o declaró
        'court_number',      // Juzgado de Instrucción Nº X
        'vehicle_type',      // Para delitos de tráfico
        'crime_type'         // Enum: Alcoholemia, Violencia, etc.
    ]

    const currentKeys = sampleRows && sampleRows.length ? Object.keys(sampleRows[0]) : []
    const missing = idealColumns.filter(c => !currentKeys.includes(c))

    if (missing.length > 0) {
        console.log('Detectamos ausencia de columnas estructuradas para datos críticos penalistas:')
        missing.forEach(m => console.log(`  ❌ ${m} -> (Probablemente enterrado en Texto/JSON)`))
        console.log('\n💡 RECOMENDACIÓN: Extraer estos datos a columnas dedicadas para permitir filtrado y alertas automáticas (Ej: Alerta 24h antes del juicio).')
    } else {
        console.log('✅ El esquema parece cubrir las columnas críticas ideales.')
    }
}

runXray()
