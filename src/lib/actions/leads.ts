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
    // Temporarily using public client since admin key is throwing JWT invalid errors
    const supabase = await createClient();

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
export async function saveAutomatedLead(data: any) {
    const supabase = await createClient();
    
    // Ensure lastUpdate is set if not provided
    const payload = {
        ...data,
        lastUpdate: data.lastUpdate || new Date().toISOString()
    };

    const { data: insertedData, error } = await supabase
        .from('leads')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error('[LEADS_ACTION] Error saving automated lead:', error);
        throw error;
    }

    revalidatePath('/lawyer/dashboard');
    return insertedData;
}
import fs from 'fs/promises';
import path from 'path';

const LEADS_JSON_PATH = path.join(process.cwd(), 'leads.json');

export async function updateLeadJson(session_id: string, data: any) {
    try {
        let currentData: Record<string, any> = {};
        try {
            const content = await fs.readFile(LEADS_JSON_PATH, 'utf-8');
            currentData = JSON.parse(content);
        } catch (e) {
            // File might not exist or be empty
        }

        currentData[session_id] = {
            ...currentData[session_id],
            ...data,
            systemin: currentData[session_id]?.systemin || 'webchat',
            lastUpdate: new Date().toISOString()
        };

        await fs.writeFile(LEADS_JSON_PATH, JSON.stringify(currentData, null, 2));
        return { success: true };
    } catch (err) {
        console.error('[LEADS_JSON] Error updating JSON:', err);
        throw err;
    }
}

export async function transferJsonToDb(session_id: string) {
    try {
        const content = await fs.readFile(LEADS_JSON_PATH, 'utf-8');
        const currentData = JSON.parse(content);
        const rawLeadData = currentData[session_id];

        if (!rawLeadData) {
            throw new Error('No lead data found for session: ' + session_id);
        }

        const VALID_COLUMNS = [
            "name", "phone", "email", "work_status", "incident_date_time", 
            "incident_type", "city", "needs_license_for_work", "rate", 
            "judicial_district", "citation_date_time", "priors", 
            "priors_details", "jail", "concerns", "calculated_price", 
            "chosen_quota", "dependents", "income_data", 
            "has_citation", "contact_date_time", "lastUpdate", "systemin"
        ];

        // Filter data to only include valid columns
        const filteredData = Object.fromEntries(
            Object.entries(rawLeadData).filter(([key]) => VALID_COLUMNS.includes(key))
        );

        // Normalize dates and nulls for PostgreSQL compatibility
        const fieldsToFix = ['incident_date_time', 'citation_date_time', 'contact_date_time', 'lastUpdate'];
        const BOOLEAN_FIELDS = ['needs_license_for_work', 'priors', 'has_citation', 'jail'];
        const NUMERIC_FIELDS = ['calculated_price'];

        fieldsToFix.forEach(field => {
            let val = filteredData[field];
            if (val && typeof val === 'string' && val !== 'null') {
                // Auto-complete truncated ISO strings from AI
                if (val.length === 10) val += "T09:00:00+02:00"; // YYYY-MM-DD
                if (val.length === 13) val += ":00:00+02:00";    // YYYY-MM-DDTHH
                if (val.length === 16) val += ":00+02:00";       // YYYY-MM-DDTHH:mm
                
                // Ensure it has the Spanish offset if no offset is present
                if (!val.includes('+') && !val.includes('Z')) {
                    val += "+02:00";
                }

                // We send it as a string to Postgres so it respects the explicit offset
                filteredData[field] = val;
            } else if (val === 'null' || val === '') {
                filteredData[field] = null;
            }
        });

        // Ensure Booleans are real booleans
        BOOLEAN_FIELDS.forEach(field => {
            const val = filteredData[field];
            if (val === 'true' || val === true) filteredData[field] = true;
            else if (val === 'false' || val === false) filteredData[field] = false;
            else filteredData[field] = false; // Default
        });

        // Ensure Numerics are real numbers
        NUMERIC_FIELDS.forEach(field => {
            const val = filteredData[field];
            if (val !== null && val !== undefined && val !== 'null') {
                const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
                filteredData[field] = isNaN(num) ? null : num;
            } else {
                filteredData[field] = null;
            }
        });

        // Ensure everything else is a string or null
        Object.keys(filteredData).forEach(key => {
            if (!fieldsToFix.includes(key) && !BOOLEAN_FIELDS.includes(key) && !NUMERIC_FIELDS.includes(key)) {
                const val = filteredData[key];
                if (val === 'null' || val === null || val === undefined) {
                    filteredData[key] = null;
                } else {
                    filteredData[key] = String(val);
                }
            }
        });

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('leads')
            .insert(filteredData)
            .select()
            .single();

        if (error) {
            console.error('[LEADS_TRANSFER] Supabase Error:', error);
            throw error;
        }

        // Clean up the JSON
        delete currentData[session_id];
        await fs.writeFile(LEADS_JSON_PATH, JSON.stringify(currentData, null, 2));

        revalidatePath('/lawyer/dashboard');
        return data;
    } catch (err) {
        console.error('[LEADS_TRANSFER] Error transferring lead to DB:', err);
        throw err;
    }
}

