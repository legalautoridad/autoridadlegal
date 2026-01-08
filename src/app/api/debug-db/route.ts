import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    const logs = [];

    try {
        // 1. Init Client (Prefer Service Role for server-side actions to bypass RLS issues)
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        logs.push(`URL Check: ${url ? 'OK' : 'MISSING'}`);
        logs.push(`Key Check: ${key ? 'OK (' + key.substring(0, 5) + '...)' : 'MISSING'}`);

        if (!url || !key) throw new Error('Credenciales faltantes');

        const supabase = createClient(url, key);

        // 2. Insert Test Data
        const testLead = {
            customer_name: 'TEST_DEBUG_USER',
            customer_phone: '600000000', // Teléfono único falso
            customer_email: 'debug@test.com',
            location: 'Debug City',
            vertical: 'alcoholemia',
            agreed_price: 999,
            status: 'new',
            ai_summary: 'Test de diagnóstico directo con amount_paid',
            unlock_price: 150,
            quality_score: 50,
            amount_paid: 50, // Explicitly testing this column
            is_test_data: true
        };

        logs.push('Intentando insert...', JSON.stringify(testLead));

        const { data, error } = await supabase
            .from('leads')
            .upsert(testLead, { onConflict: 'customer_phone' }) // Asumiendo que customer_phone es unique, si no, usa insert
            .select()
            .single();

        if (error) {
            logs.push('❌ ERROR SUPABASE:', JSON.stringify(error, null, 2));
            return NextResponse.json({ success: false, logs, error }, { status: 500 });
        }

        logs.push('✅ ÉXITO: Lead guardado', data);
        return NextResponse.json({ success: true, logs, data });

    } catch (e: any) {
        return NextResponse.json({ success: false, logs, internal_error: e.message }, { status: 500 });
    }
}
