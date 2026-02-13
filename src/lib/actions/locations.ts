'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check admin role
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

// --- Court Actions ---

export async function getCourtsAdmin() {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
        .from('courts')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

export async function upsertCourt(data: { id?: string; name: string; address?: string; phone?: string; information?: string }) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    const courtData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        information: data.information
    };

    if (data.id) {
        const { error } = await adminClient
            .from('courts')
            .update(courtData)
            .eq('id', data.id);
        if (error) throw error;
    } else {
        const { error } = await adminClient
            .from('courts')
            .insert(courtData);
        if (error) throw error;
    }

    revalidatePath('/admin/courts');
    revalidatePath('/admin/locations');
    return { success: true };
}

export async function deleteCourt(id: string) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('courts')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/courts');
    revalidatePath('/admin/locations');
    return { success: true };
}

// --- Location Actions ---

export async function getLocationsAdmin() {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
        .from('locations')
        .select(`
            *,
            courts (
                name
            )
        `)
        .order('name');

    if (error) throw error;
    return data;
}

export async function upsertLocation(data: {
    id?: string;
    name: string;
    slug: string;
    zone: string;
    region?: string;
    court_id?: string;
    redirect_slug?: string;
}) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    const locationData = {
        name: data.name,
        slug: data.slug,
        zone: data.zone,
        region: data.region || 'Cataluña',
        court_id: data.court_id,
        redirect_slug: data.redirect_slug
    };

    if (data.id) {
        const { error } = await adminClient
            .from('locations')
            .update(locationData)
            .eq('id', data.id);
        if (error) throw error;
    } else {
        const { error } = await adminClient
            .from('locations')
            .insert(locationData);
        if (error) throw error;
    }

    revalidatePath('/admin/locations');
    return { success: true };
}

export async function deleteLocation(id: string) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('locations')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/locations');
    return { success: true };
}
