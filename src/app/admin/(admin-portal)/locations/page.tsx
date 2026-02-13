'use client';

import { useEffect, useState } from 'react';
import { getLocationsAdmin, getCourtsAdmin, upsertLocation, deleteLocation } from '@/lib/actions/locations';
import { Map, Trash2, Edit2, Globe, Building2, Search, ArrowLeft, Plus, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function LocationManagementPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [courts, setCourts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [locs, crts] = await Promise.all([
                getLocationsAdmin(),
                getCourtsAdmin()
            ]);
            setLocations(locs);
            setCourts(crts);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta sede?')) return;
        try {
            await deleteLocation(id);
            loadData();
        } catch (error: any) {
            alert('Error deleting location: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await upsertLocation({
                id: editingLocation?.id,
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                zone: formData.get('zone') as string,
                region: formData.get('region') as string,
                court_id: formData.get('court_id') as string || undefined,
                redirect_slug: formData.get('redirect_slug') as string || undefined
            });
            setShowModal(false);
            setEditingLocation(null);
            loadData();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredLocations = locations.filter(l =>
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.zone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEdit = (loc: any) => {
        setEditingLocation(loc);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingLocation(null);
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
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Sedes (Silos)</h1>
                            <p className="text-slate-500">Administra las ubicaciones y sus juzgados asociados.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4 h-11">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar sede..."
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
                                Añadir Sede
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
                                    {editingLocation ? 'Editar Sede' : 'Nueva Sede'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Nombre</label>
                                        <input
                                            name="name"
                                            required
                                            defaultValue={editingLocation?.name}
                                            placeholder="Ej: Sabadell"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Slug (URL)</label>
                                        <input
                                            name="slug"
                                            required
                                            defaultValue={editingLocation?.slug}
                                            placeholder="ej: sabadell"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Zona</label>
                                        <input
                                            name="zone"
                                            required
                                            defaultValue={editingLocation?.zone}
                                            placeholder="Ej: Vallès Occidental"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Región</label>
                                        <input
                                            name="region"
                                            defaultValue={editingLocation?.region || 'Cataluña'}
                                            placeholder="Ej: Cataluña"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Juzgado Asociado</label>
                                    <select
                                        name="court_id"
                                        defaultValue={editingLocation?.court_id || ''}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    >
                                        <option value="">Sin juzgado</option>
                                        {courts.map(court => (
                                            <option key={court.id} value={court.id}>{court.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Redirigir a (Slug)</label>
                                    <input
                                        name="redirect_slug"
                                        defaultValue={editingLocation?.redirect_slug}
                                        placeholder="Opcional: slug de otra sede"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Para estrategias de satélite (ej: Sant Cugat {'->'} Rubí)</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 disabled:opacity-50"
                                >
                                    {formLoading ? 'Guardando...' : editingLocation ? 'Actualizar Sede' : 'Crear Sede'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Nombre / URL</th>
                                <th className="px-6 py-4">Zona / Región</th>
                                <th className="px-6 py-4">Juzgado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Cargando sedes...</td>
                                </tr>
                            ) : filteredLocations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No se encontraron sedes.</td>
                                </tr>
                            ) : (
                                filteredLocations.map((loc) => (
                                    <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{loc.name}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <ExternalLink className="h-3 w-3" /> /{loc.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 font-medium">{loc.zone}</div>
                                            <div className="text-xs text-slate-400">{loc.region}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <Building2 className="h-3 w-3 text-slate-400" />
                                                {loc.courts?.name || <span className="text-slate-300 italic">No asignado</span>}
                                            </div>
                                            {loc.redirect_slug && (
                                                <div className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-block mt-1">
                                                    Redirige a: {loc.redirect_slug}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(loc)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(loc.id)}
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
