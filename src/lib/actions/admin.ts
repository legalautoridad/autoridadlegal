'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check admin role (Mock for MVP)
const isAdmin = async (supabase: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // TODO: Add real email check here: return user.email === 'admin@...';
    return true;
};

export async function approveLawyer(lawyerId: string) {
    const supabase = await createClient();

    if (!await isAdmin(supabase)) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('lawyer_profiles')
        .update({
            is_verified: true,
            verification_status: 'VERIFIED'
        })
        .eq('id', lawyerId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/verifications');
    return { success: true };
}

export async function rejectLawyer(lawyerId: string) {
    const supabase = await createClient();

    if (!await isAdmin(supabase)) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('lawyer_profiles')
        .update({
            is_verified: false,
            verification_status: 'REJECTED'
        })
        .eq('id', lawyerId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/verifications');
    return { success: true };
}
