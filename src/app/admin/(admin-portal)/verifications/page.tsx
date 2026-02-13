import { createClient } from '@/lib/supabase/server';
import { VerificationCard } from '@/components/admin/VerificationCard';

export const dynamic = 'force-dynamic';

export default async function AdminVerificationsPage() {
    const supabase = await createClient();

    // Fetch Pending Profiles
    const { data: profiles } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('verification_status', 'PENDING')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Panel de Verificación</h1>
                        <p className="text-slate-500">Validación de identidades profesionales.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium">
                        Pendientes: {profiles?.length || 0}
                    </div>
                </header>

                {(!profiles || profiles.length === 0) ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-400">No hay solicitudes pendientes.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile) => (
                            <VerificationCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
