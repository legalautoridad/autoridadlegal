import { ShieldCheck, Users, ClipboardCheck, BarChart3, Settings, Gavel, LogOut, Map, Landmark } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { logoutAdmin } from '@/lib/actions/auth';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch real member count
    const { count: lawyerCount } = await supabase
        .from('lawyer_members')
        .select('*', { count: 'exact', head: true });

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">WebAdmin</h1>
                        <p className="text-slate-500">Gestión central de Autoridad Legal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                            <span className="text-sm font-medium text-slate-700">Administrador</span>
                        </div>
                        <form action={logoutAdmin}>
                            <button className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-200 shadow-sm hover:border-red-100 hover:bg-red-50 transition-all group" title="Cerrar Sesión">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Stat Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Realtime</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Abogados Miembros</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{lawyerCount || 0}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <ClipboardCheck className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Pendientes</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Verificaciones</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Este mes</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">Leads Generados</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">1,208</p>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Accesos Directos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/admin/lawyers"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                <Gavel className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Gestionar Miembros</h4>
                                <p className="text-sm text-slate-500">Añadir, eliminar y actualizar abogados del portal.</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/locations"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                <Map className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Gestionar Sedes</h4>
                                <p className="text-sm text-slate-500">Configurar silos por ciudad, zonas y juzgados.</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/courts"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                <Landmark className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Gestionar Juzgados</h4>
                                <p className="text-sm text-slate-500">Administrar direcciones y contacto de los juzgados.</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/verifications"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group opacity-60"
                        >
                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                <ShieldCheck className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Aprobar Perfiles</h4>
                                <p className="text-sm text-slate-500">Gestionar la verificación de perfiles profesionales.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
