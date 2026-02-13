'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function unlockLead(leadId: string, leadPrice: number) {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error('[Unlock] User not found or auth error');
        throw new Error('Unauthorized');
    }

    // 2. Get Profile & Check Balance
    const { data: profile, error: profileError } = await supabase
        .from('lawyer_members')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error('[Unlock] Profile not found');
        throw new Error('Profile not found');
    }


    // Strict Balance Check
    if (profile.credit_balance < leadPrice) { // Using leadPrice as requested, generally 50
        console.warn('[Unlock] Insufficient balance');
        return { error: 'Saldo insuficiente. Recarga créditos.' };
    }

    // 3. Check Lead Ownership (Must be unowned)
    const { data: lead, error: leadCheckError } = await supabase
        .from('leads')
        .select('exclusive_winner_id')
        .eq('id', leadId)
        .single();

    if (leadCheckError || !lead) {
        return { error: 'Lead no encontrado.' };
    }

    if (lead.exclusive_winner_id) {
        console.warn('[Unlock] Lead already owned by', lead.exclusive_winner_id);
        return { error: 'Este lead ya no está disponible.' };
    }

    // 4. STEP A: Deduct Money (Linear)
    const newBalance = profile.credit_balance - leadPrice;
    const { error: deductError } = await supabase
        .from('lawyer_members')
        .update({ credit_balance: newBalance })
        .eq('id', user.id);

    if (deductError) {
        console.error('[Unlock] Failed to deduct credits:', deductError);
        throw new Error('Error en la transacción (Deduct). Inténtalo de nuevo.');
    }

    // 5. STEP B: Assign Lead (Linear)
    const { error: assignError } = await supabase
        .from('leads')
        .update({
            exclusive_winner_id: user.id,
            status: 'sold' // Mark as sold/claimed
        })
        .eq('id', leadId);

    if (assignError) {
        console.error('[Unlock] CRITICAL: Failed to assign lead after deduction:', assignError);
        // NOTE: In a real app, we would attempt refund here. For now, we log strictly.
        throw new Error('Error al asignar el lead. Contacta soporte (Ref: Code 500).');
    }

    // 6. Record Transaction (Optional/Logging, non-blocking for flow success if step B passed)
    await supabase.from('transactions').insert({
        profile_id: user.id,
        amount: -leadPrice,
        type: 'lead_purchase',
        description: `Unlock Lead ${leadId}`
    });

    revalidatePath('/lawyer/dashboard');
    return { success: true };
}
