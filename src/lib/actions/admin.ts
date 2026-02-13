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

export async function approveLawyer(lawyerId: string) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    const { error } = await adminClient
        .from('lawyer_profiles')
        .update({
            is_verified: true,
            verification_status: 'VERIFIED'
        })
        .eq('id', lawyerId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/verifications');
    revalidatePath('/admin/lawyers');
    return { success: true };
}

export async function rejectLawyer(lawyerId: string) {
    const supabase = await createClient();
    if (!await isAdmin(supabase)) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    const { error } = await adminClient
        .from('lawyer_profiles')
        .update({
            is_verified: false,
            verification_status: 'REJECTED'
        })
        .eq('id', lawyerId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/verifications');
    revalidatePath('/admin/lawyers');
    return { success: true };
}
export async function getLawyerMembers() {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    // Join lawyer_members with lawyer_profiles using Admin Client to bypass RLS
    const { data, error } = await adminClient
        .from('lawyer_members')
        .select(`
            id,
            email,
            full_name,
            is_active,
            created_at,
            lawyer_profiles (
                is_verified,
                verification_status,
                notification_phone
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function updateLawyerMember(id: string, updates: any) {
    console.log('UpdateLawyerMember called:', { id, updates });
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        console.error('Unauthorized attempt to update lawyer');
        throw new Error('Unauthorized');
    }

    const adminClient = await createAdminClient();

    // 1. Prepare updates for lawyer_members
    const memberUpdates: any = {};
    if (updates.full_name !== undefined) memberUpdates.full_name = updates.full_name;
    if (updates.is_active !== undefined) memberUpdates.is_active = updates.is_active;

    if (Object.keys(memberUpdates).length > 0) {
        console.log('Updating lawyer_members:', memberUpdates);
        const { error: memberError } = await adminClient
            .from('lawyer_members')
            .update(memberUpdates)
            .eq('id', id);
        if (memberError) {
            console.error('Error updating lawyer_members:', memberError);
            throw memberError;
        }
    }

    // 2. Prepare updates for lawyer_profiles
    const profileUpdates: any = {};
    if (updates.verification_status !== undefined) profileUpdates.verification_status = updates.verification_status;
    if (updates.is_verified !== undefined) profileUpdates.is_verified = updates.is_verified;

    if (Object.keys(profileUpdates).length > 0) {
        console.log('Updating/Initializing lawyer_profiles:', profileUpdates);

        // 1. Check if profile exists
        const { data: existingProfile } = await adminClient
            .from('lawyer_profiles')
            .select('id')
            .eq('id', id)
            .maybeSingle();

        if (existingProfile) {
            // 2. Perform simple update if it exists
            const { error: profileError } = await adminClient
                .from('lawyer_profiles')
                .update(profileUpdates)
                .eq('id', id);

            if (profileError) {
                console.error('Error updating existing lawyer_profiles:', profileError);
                throw profileError;
            }
        } else {
            // 3. Create profile with defaults if it doesn't exist
            console.log('Profile missing, creating new one with defaults');
            const { error: insertError } = await adminClient
                .from('lawyer_profiles')
                .insert({
                    id,
                    ...profileUpdates,
                    notification_email: updates.email || '', // We might not have email here unless passed
                    document_number: '',
                    bar_association: '',
                    bar_number: '',
                    office_address: '',
                    notification_phone: '',
                    is_verified: profileUpdates.is_verified ?? false,
                    verification_status: profileUpdates.verification_status ?? 'PENDING'
                });

            if (insertError) {
                console.error('Error creating missing lawyer_profiles:', insertError);
                throw insertError;
            }
        }
    }

    console.log('UpdateLawyerMember successful');
    revalidatePath('/admin/lawyers');
    return { success: true };
}

export async function deleteLawyerMember(id: string) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    // Deleting from auth.users will cascade delete everything in lawyer_members, lawyer_profiles, etc.
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
        console.error('Error deleting auth user:', error);
        throw error;
    }

    revalidatePath('/admin/lawyers');
    return { success: true };
}

export async function createLawyerMember(data: { email: string; full_name: string; password?: string }) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();

    // 1. Create the Auth User
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email: data.email,
        password: data.password || Math.random().toString(36).slice(-10), // Random password if not provided
        email_confirm: true,
        user_metadata: {
            full_name: data.full_name
        }
    });

    if (authError) {
        console.error('Auth Admin Error:', authError);
        throw new Error(authError.message || 'Error al crear el usuario en Auth.');
    }

    const userId = authUser.user.id;

    // 2. Initialize Lawyer Profile (trigger handles lawyer_members)
    // Using upsert in case the trigger or something else created a partial record
    const { error: profileError } = await adminClient
        .from('lawyer_profiles')
        .upsert({
            id: userId,
            notification_email: data.email,
            verification_status: 'PENDING',
            is_verified: false,
            // Provide empty strings for required fields if they are still NOT NULL
            document_number: '',
            bar_association: '',
            bar_number: '',
            office_address: '',
            notification_phone: ''
        }, { onConflict: 'id' });

    if (profileError) {
        console.error('Profile Initialization Error:', profileError);
        // We don't throw here to avoid failing the whole process if Auth succeeded
    }

    revalidatePath('/admin/lawyers');
    return { success: true, user: authUser.user };
}
