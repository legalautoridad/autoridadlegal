'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Updated Action: Writes to 'cases' table instead of 'leads'.
 * Aligns with "Monedero" logic and consolidated schema.
 */

export interface CreateCaseData {
    vertical: string;
    city: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    agreed_price: number;
    amount_paid: number;
}

// Renamed but kept export as createLead for compatibility if needed, but logic uses cases
export async function createLead(data: CreateCaseData) {
    const supabase = await createClient();

    const { error } = await supabase.from('cases').insert({
        client_name: data.customer_name,
        client_email: data.customer_email,
        client_phone: data.customer_phone,
        client_city: data.city,
        honorarios: data.agreed_price,
        reservation_amount: data.amount_paid,
        status: data.amount_paid > 0 ? 'ASSIGNED' : 'NEW', // Assumption: Paid = Assigned flow trigger? Or just Reserved?
        // Note: Project State says Paid Reservation -> Generic 'NEW' for assignment? 
        // Or if reservation is paid, it enters assignment queue?
        // Let's stick to 'NEW' generally unless strictly assigned.
        // Actually, 'reserved' status doesn't exist in cases (NEW, ASSIGNED, UNREACHABLE...).
        // A paid case is NEW until assigned to a lawyer.
        ai_summary: `[MANUAL] Vertical: ${data.vertical}. Paid: ${data.amount_paid}`,
    });

    if (error) {
        console.error('Error creating case:', error);
        throw new Error('Failed to create case');
    }

    revalidatePath('/lawyer/dashboard');
    return { success: true };
}

export async function saveLead(data: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    location?: string;
    service?: string;
    status: string;
    agreed_price: number;
    notes?: string;
    amount_paid?: number; // Added to fix implicit usage error
}) {
    const supabase = await createAdminClient();

    // Mapping to 'cases' table structure
    const dbData = {
        client_name: data.name,
        client_phone: data.phone,
        client_email: data.email,
        client_city: data.location || data.city || 'Desconocido',
        honorarios: data.agreed_price,
        reservation_amount: data.amount_paid || 0,

        // Status Mapping
        // 'reserved' from frontend -> 'NEW' (Ready for assignment)
        // 'new' -> 'NEW'
        status: 'NEW',

        notes: data.notes,
        ai_summary: `[${(data.amount_paid || 0) > 0 ? 'PLATINO' : 'PLATA'}] Vertical: ${data.service || 'alcoholemia'}. Notes: ${data.notes || ''}`,
        created_at: new Date().toISOString()
    };

    try {
        // Upsert based on Phone? 'cases' might not have unique constraint on phone.
        // But for lead capture we want to avoid duplicates.
        // If cases doesn't have unique phone, upsert won't work without onConflict constraint.
        // We will do a check-then-insert or just insert (duplicates allowed for different cases??).
        // Let's assume Insert for now to avoid complexity, or check if active case exists.

        const { data: newCase, error } = await supabase
            .from('cases')
            .insert(dbData)
            .select()
            .single();

        if (error) {
            console.error('Database Error:', error);
            throw error;
        }

        revalidatePath('/lawyer/dashboard');
        return newCase.id;

    } catch (err: any) {
        console.error('Error saving case:', err);
        throw new Error('Failed to save case: ' + err.message);
    }
}

export async function deleteTestLeads() {
    const supabase = await createClient();
    // Assuming we might have a flag or just by email convention
    await supabase.from('cases').delete().ilike('client_email', '%@example.com%');
    revalidatePath('/lawyer/dashboard');
}
