'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Checks if the currently authenticated user has the 'ADMIN' role.
 */
export async function isAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return false;
    }

    const { data: admin, error: dbError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (dbError || !admin) {
        return false;
    }

    return admin.role === 'ADMIN' || admin.role === 'SUPERADMIN';
}
