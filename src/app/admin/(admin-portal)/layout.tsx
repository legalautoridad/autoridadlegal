import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Must be logged in
    if (!user) {
        return redirect('/admin/login');
    }

    // 2. Must exist in 'users' table (Admins)
    const { data: admin, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!admin || error) {
        // If they are not an admin, we sign them out or just redirect
        // For security, if they are logged in but not an admin, send them away
        return redirect('/');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}
