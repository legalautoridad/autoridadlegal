'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invalidateLocalCache } from '@/lib/ai/cache-manager';

// Helper to check admin role (reused from admin.ts pattern)
const isAdmin = async (supabase: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: admin } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return !!admin;
};

/**
 * Fetches the system prompt from the database.
 * If not found, it returns null.
 */
export async function getSystemPrompt() {
    const supabase = await createClient();
    
    // We typically allow reading the prompt for authorized users if needed, 
    // but for the admin panel, we ensure it's an admin.
    if (!(await isAdmin(supabase))) throw new Error('Unauthorized');

    const { data, error } = await supabase
        .from('ai_config')
        .select('value')
        .eq('key', 'system_prompt')
        .maybeSingle();

    if (error) {
        console.error('Error fetching system prompt:', error);
        return null;
    }

    return data?.value || null;
}

/**
 * Updates the system prompt in the database.
 */
export async function updateSystemPrompt(value: string) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    const { error } = await adminClient
        .from('ai_config')
        .upsert({
            key: 'system_prompt',
            value: value,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    if (error) {
        console.error('Error updating system prompt:', error);
        throw new Error(error.message);
    }

    // Invalidate the local cache reference so the next chat recreation 
    // will see the new prompt from the DB when building the Google Cache.
    invalidateLocalCache();

    revalidatePath('/admin/ai-config');
    return { success: true };
}
