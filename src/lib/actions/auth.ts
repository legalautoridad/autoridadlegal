'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function memberLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: 'Credenciales inválidas.' };
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { data: member } = await supabase
        .from('lawyer_members')
        .select('id')
        .eq('id', authUser?.id)
        .maybeSingle();

    if (!member) {
        await supabase.auth.signOut();
        return { error: 'No tienes permisos de acceso al panel de especialistas.' };
    }

    return redirect('/lawyer/dashboard');
}

export async function adminLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: 'Credenciales inválidas.' };
    }

    // Verify they are an admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const { data: admin } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser?.id)
        .maybeSingle();

    if (!admin) {
        await supabase.auth.signOut();
        return { error: 'Acceso denegado. Este panel es solo para administradores.' };
    }

    return redirect('/admin/dashboard');
}

export async function login(formData: FormData) {
    // Keep for backwards compatibility or generic use
    return memberLogin(formData);
}

export async function logoutAdmin() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/admin/login');
}

export async function logoutLawyer() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/login');
}
