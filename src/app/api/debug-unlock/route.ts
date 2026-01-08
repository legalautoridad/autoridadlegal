import { unlockLead } from '@/lib/actions/unlock-lead';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const leadId = searchParams.get('id');
    const price = searchParams.get('price');

    if (!leadId) {
        // List leads to help user choose
        const supabase = await createClient();
        const { data: leads } = await supabase.from('leads').select('id, customer_name, status, unlock_price').limit(5);

        return NextResponse.json({
            info: 'Provide ?id=LEAD_UUID&price=AMOUNT to unlock.',
            available_leads_hint: leads
        });
    }

    try {
        const result = await unlockLead(leadId, Number(price || 50));
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
