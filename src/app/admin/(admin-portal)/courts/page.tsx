'use client';

import { useEffect, useState } from 'react';
import { getCourtsAdmin, upsertCourt, deleteCourt } from '@/lib/actions/locations';
import { Landmark, Trash2, Edit2, MapPin, Phone, Info, Search, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function CourtManagementPage() {
    const [courts, setCourts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCourt, setEditingCourt] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadCourts();
    }, []);

    const loadCourts = async () => {
        try {
            const data = await getCourtsAdmin();
            setCourts(data);
        } catch (error) {
            console.error('Error loading courts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este juzgado? Esta acción puede afectar a las sedes vinculadas.')) return;
        try {
            await deleteCourt(id);
            loadCourts();
        } catch (error: any) {
            alert('Error deleting court: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await upsertCourt({
                id: editingCourt?.id,
                name: formData.get('name') as string,
                address: formData.get('address') as string,
                phone: formData.get('phone') as string,
                information: formData.get('information') as string
            });
            setShowModal(false);
            setEditingCourt(null);
            loadCourts();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredCourts = courts.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEdit = (court: any) => {
        setEditingCourt(court);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingCourt(null);
        setShowModal(true);
    };

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
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Juzgados</h1>
                            <p className="text-slate-500">Administra la información de los palacios de justicia.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4 h-11">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar juzgado..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={openAdd}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 h-11"
                            >
                                <Plus className="h-4 w-4" />
                                Añadir Juzgado
                            </button>
                        </div>
                    </div>
                </header>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">
                                    {editingCourt ? 'Editar Juzgado' : 'Nuevo Juzgado'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Nombre</label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={editingCourt?.name}
                                        placeholder="Ej: Juzgados de Sabadell"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Dirección</label>
                                    <input
                                        name="address"
                                        defaultValue={editingCourt?.address}
                                        placeholder="Calle, Número, CP"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Teléfono</label>
                                    <input
                                        name="phone"
                                        defaultValue={editingCourt?.phone}
                                        placeholder="Formato: 93X XXX XXX"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Información Extra</label>
                                    <textarea
                                        name="information"
                                        defaultValue={editingCourt?.information}
                                        placeholder="Horarios, accesos, etc..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50 min-h-[100px]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 disabled:opacity-50"
                                >
                                    {formLoading ? 'Guardando...' : editingCourt ? 'Actualizar Juzgado' : 'Crear Juzgado'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Juzgado</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4">Información</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Cargando juzgados...</td>
                                </tr>
                            ) : filteredCourts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No se encontraron juzgados.</td>
                                </tr>
                            ) : (
                                filteredCourts.map((court) => (
                                    <tr key={court.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{court.name}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <MapPin className="h-3 w-3" /> {court.address || 'Sin dirección'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="h-3 w-3" /> {court.phone || 'Sin teléfono'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-sm text-slate-500">
                                                {court.information || 'Sin detalles'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(court)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(court.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
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
