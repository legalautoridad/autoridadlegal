'use client';

import { useEffect, useState } from 'react';
import { getLawyerMembers, updateLawyerMember, deleteLawyerMember, createLawyerMember } from '@/lib/actions/admin';
import { Users, Trash2, Edit2, ShieldCheck, ShieldAlert, Phone, Mail, Search, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function LawyerManagementPage() {
    const [lawyers, setLawyers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLawyer, setEditingLawyer] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadLawyers();
    }, []);

    const loadLawyers = async () => {
        try {
            const data = await getLawyerMembers();
            setLawyers(data);
        } catch (error) {
            console.error('Error loading lawyers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!confirm('¿Cambiar estado de activación?')) return;
        try {
            await updateLawyerMember(id, { is_active: !currentStatus });
            loadLawyers();
        } catch (error: any) {
            alert('Error updating status: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este miembro? Esta acción no se puede deshacer.')) return;
        await deleteLawyerMember(id);
        loadLawyers();
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createLawyerMember({
                email: formData.get('email') as string,
                full_name: formData.get('full_name') as string,
                password: formData.get('password') as string || undefined
            });
            setShowAddModal(false);
            loadLawyers();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingLawyer) return;
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const isVerified = formData.get('is_verified') === 'true';
            await updateLawyerMember(editingLawyer.id, {
                full_name: formData.get('full_name') as string,
                is_active: formData.get('is_active') === 'true',
                verification_status: formData.get('verification_status') as string,
                is_verified: isVerified,
                email: editingLawyer.email
            });
            setEditingLawyer(null);
            loadLawyers();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredLawyers = lawyers.filter(l =>
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Abogados Miembros</h1>
                            <p className="text-slate-500">Administra los accesos y perfiles de los especialistas.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4 h-11">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o email..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 h-11"
                            >
                                <Plus className="h-4 w-4" />
                                Añadir Miembro
                            </button>
                        </div>
                    </div>
                </header>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">Añadir Nuevo Abogado</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Nombre Completo</label>
                                    <input name="full_name" required placeholder="Nombre del abogado" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Email de Acceso</label>
                                    <input name="email" type="email" required placeholder="email@ejemplo.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Contraseña (Opcional)</label>
                                    <input name="password" type="password" placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50" />
                                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">* Si se deja vacío, se generará una aleatoria.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 disabled:opacity-50"
                                >
                                    {formLoading ? 'Guardando...' : 'Crear Acceso de Abogado'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingLawyer && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">Editar Abogado</h3>
                                <button onClick={() => setEditingLawyer(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Nombre Completo</label>
                                    <input
                                        name="full_name"
                                        required
                                        defaultValue={editingLawyer.full_name}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Estado Acceso</label>
                                        <select
                                            name="is_active"
                                            defaultValue={editingLawyer.is_active ? 'true' : 'false'}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">¿Verificado?</label>
                                        <select
                                            name="is_verified"
                                            defaultValue={editingLawyer.lawyer_profiles?.[0]?.is_verified ? 'true' : 'false'}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        >
                                            <option value="true">Sí (Badge azul)</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Estado Verificación</label>
                                    <select
                                        name="verification_status"
                                        defaultValue={editingLawyer.lawyer_profiles?.[0]?.verification_status || 'PENDING'}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    >
                                        <option value="PENDING">Pendiente</option>
                                        <option value="VERIFIED">Verificado</option>
                                        <option value="REJECTED">Rechazado</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 disabled:opacity-50"
                                >
                                    {formLoading ? 'Actualizando...' : 'Guardar Cambios'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Abogado</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Verificación</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Cargando miembros...</td>
                                </tr>
                            ) : filteredLawyers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No se encontraron abogados.</td>
                                </tr>
                            ) : (
                                filteredLawyers.map((lawyer) => (
                                    <tr key={lawyer.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{lawyer.full_name || 'Sin nombre'}</div>
                                            <div className="text-xs text-slate-400 font-mono">{lawyer.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                                <Mail className="h-3 w-3" /> {lawyer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="h-3 w-3" /> {lawyer.lawyer_profiles?.[0]?.notification_phone || 'Sin teléfono'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(lawyer.id, lawyer.is_active)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lawyer.is_active
                                                    ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                                                    }`}
                                            >
                                                {lawyer.is_active ? 'ACTIVO' : 'INACTIVO'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {lawyer.lawyer_profiles?.[0]?.is_verified ? (
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                                        <ShieldCheck className="h-3 w-3" /> VERIFICADO
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                        <ShieldAlert className="h-3 w-3" /> PENDIENTE
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingLawyer(lawyer)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Editar Miembro"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lawyer.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar Miembro"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
