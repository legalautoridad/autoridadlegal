'use client';

import { useEffect, useState } from 'react';
import { getKnowledgeEntries, upsertKnowledgeEntry, deleteKnowledgeEntry, ingestDocumentAction, KnowledgeEntry } from '@/lib/actions/knowledge';
import { getLocationsAdmin, getCourtsAdmin } from '@/lib/actions/locations';
import {
    BookOpen,
    Trash2,
    Edit2,
    Plus,
    X,
    Search,
    ArrowLeft,
    Info,
    Globe,
    MapPin,
    Building2,
    Database,
    FileUp,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function KnowledgeManagementPage() {
    const [entries, setEntries] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [courts, setCourts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [knEntries, locs, crts] = await Promise.all([
                getKnowledgeEntries(),
                getLocationsAdmin(),
                getCourtsAdmin()
            ]);
            setEntries(knEntries);
            setLocations(locs);
            setCourts(crts);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este contenido? El chatbot ya no podrá usarlo como referencia.')) return;
        try {
            await deleteKnowledgeEntry(id);
            loadData();
        } catch (error: any) {
            alert('Error deleting entry: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        const isGeneral = formData.get('is_general') === 'on';

        try {
            await upsertKnowledgeEntry({
                id: editingEntry?.id,
                content: formData.get('content') as string,
                service_type: formData.get('service_type') as string || null,
                region: formData.get('region') as string || null,
                is_general: isGeneral,
                location_id: isGeneral ? null : (formData.get('location_id') as string || null),
                court_id: isGeneral ? null : (formData.get('court_id') as string || null),
                metadata: { updated_by: 'admin' }
            });
            setShowModal(false);
            setEditingEntry(null);
            loadData();
        } catch (error: any) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredEntries = entries.filter(e =>
        e.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEdit = (entry: any) => {
        setEditingEntry(entry);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingEntry(null);
        setShowModal(true);
    };

    const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await ingestDocumentAction(formData);
            alert(result.message);
            setShowUploadModal(false);
            loadData();
        } catch (error: any) {
            alert('Error en la ingesta: ' + error.message);
        } finally {
            setUploadLoading(false);
        }
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
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <BookOpen className="h-8 w-8 text-indigo-600" />
                                Base de Conocimiento RAG
                            </h1>
                            <p className="text-slate-500 mt-1">Gestiona el cerebro legal del chatbot. Los cambios tardan pocos segundos en aplicarse.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4 h-11">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar conocimiento..."
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
                                Añadir Info
                            </button>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 h-11"
                            >
                                <FileUp className="h-4 w-4" />
                                Subir Documento
                            </button>
                        </div>
                    </div>
                </header>

                {/* Info Card */}
                <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex gap-4">
                    <div className="bg-indigo-600 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900">¿Cómo funciona el RAG Vectorial?</h4>
                        <p className="text-sm text-indigo-700/80 leading-relaxed max-w-4xl">
                            Cuando guardas un fragmento, el sistema genera coordenadas matemáticas (*embeddings*) mediante IA.
                            El chatbot busca semánticamente los fragmentos más parecidos a la pregunta del usuario para construir su respuesta.
                        </p>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">
                                    {editingEntry ? 'Editar Conocimiento' : 'Nuevo Conocimiento Legal'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">Contenido Legal (Contexto)</label>
                                    <textarea
                                        name="content"
                                        required
                                        rows={8}
                                        defaultValue={editingEntry?.content}
                                        placeholder="Ej: En un juicio rápido por alcoholemia, la reducción de la pena por conformidad es de un tercio..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50 text-sm leading-relaxed"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 ml-1 flex items-center gap-1">
                                        <Database className="h-3 w-3" />
                                        Se generarán 3072 dimensiones vectoriales automáticamente al guardar.
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-slate-700">¿Es general?</label>
                                            <input
                                                type="checkbox"
                                                name="is_general"
                                                defaultChecked={editingEntry ? editingEntry.is_general : true}
                                                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Región (Opcional)</label>
                                            <select
                                                name="region"
                                                defaultValue={editingEntry?.region || ''}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white font-bold"
                                            >
                                                <option value="">Ninguna / Nacional</option>
                                                <option value="Cataluña">Cataluña</option>
                                                <option value="Madrid">Madrid</option>
                                                <option value="Valencia">Valencia</option>
                                                <option value="Andalucía">Andalucía</option>
                                                <option value="Galicia">Galicia</option>
                                                <option value="País Vasco">País Vasco</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Área Legal / Servicio</label>
                                            <select
                                                name="service_type"
                                                defaultValue={editingEntry?.service_type || 'alcoholemia'}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white font-bold"
                                            >
                                                <option value="alcoholemia">Alcoholemia</option>
                                                <option value="accidentes">Accidentes</option>
                                                <option value="herencias">Herencias</option>
                                                <option value="familia">Familia</option>
                                                <option value="penal">Penal General</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Sede (Opcional)</label>
                                            <select
                                                name="location_id"
                                                defaultValue={editingEntry?.location_id || ''}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white"
                                            >
                                                <option value="">Aplica a todas</option>
                                                {locations.map(loc => (
                                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Juzgado (Opcional)</label>
                                            <select
                                                name="court_id"
                                                defaultValue={editingEntry?.court_id || ''}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white"
                                            >
                                                <option value="">Cualquier juzgado</option>
                                                {courts.map(court => (
                                                    <option key={court.id} value={court.id}>{court.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {formLoading ? 'Procesando Vectores...' : editingEntry ? 'Actualizar Conocimiento' : 'Crear y Vectorizar'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                                    <FileUp className="h-5 w-5 text-emerald-600" />
                                    Subir e Ingerir Documento
                                </h3>
                                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
                                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".pdf,.txt"
                                        required
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const label = document.getElementById('file-label');
                                                if (label) label.innerText = file.name;
                                            }
                                        }}
                                    />
                                    <FileUp className="h-10 w-10 text-slate-300 group-hover:text-emerald-500 mx-auto mb-3 transition-colors" />
                                    <p id="file-label" className="text-sm font-medium text-slate-600">Selecciona un PDF o TXT para procesar</p>
                                    <p className="text-xs text-slate-400 mt-1">Máximo 10MB. El texto será dividido en bloques automáticamente.</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-slate-700">¿Es general?</label>
                                            <input
                                                type="checkbox"
                                                name="is_general"
                                                defaultChecked={true}
                                                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Región (Opcional)</label>
                                            <select
                                                name="region"
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                                            >
                                                <option value="">Ninguna / Nacional</option>
                                                <option value="Cataluña">Cataluña</option>
                                                <option value="Madrid">Madrid</option>
                                                <option value="Valencia">Valencia</option>
                                                <option value="Andalucía">Andalucía</option>
                                                <option value="Galicia">Galicia</option>
                                                <option value="País Vasco">País Vasco</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Área Legal / Servicio</label>
                                            <select
                                                name="service_type"
                                                defaultValue="alcoholemia"
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-white font-bold"
                                            >
                                                <option value="alcoholemia">Alcoholemia</option>
                                                <option value="accidentes">Accidentes</option>
                                                <option value="herencias">Herencias</option>
                                                <option value="familia">Familia</option>
                                                <option value="penal">Penal General</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Sede (Opcional)</label>
                                            <select name="location_id" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white">
                                                <option value="">Aplica a todas</option>
                                                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Juzgado (Opcional)</label>
                                            <select name="court_id" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white">
                                                <option value="">Cualquier juzgado</option>
                                                {courts.map(court => <option key={court.id} value={court.id}>{court.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploadLoading}
                                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploadLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Procesando y Vectorizando...
                                        </>
                                    ) : (
                                        'Iniciar Ingesta de Documento'
                                    )}
                                </button>
                                {uploadLoading && (
                                    <p className="text-[10px] text-center text-slate-500 animate-pulse">
                                        Detectando texto, dividiendo en fragmentos y generando embeddings vectoriales de 3072 dimensiones...
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Servicio / Región</th>
                                    <th className="px-6 py-4">Alcance</th>
                                    <th className="px-6 py-4">Contenido / Fragmento</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 animate-pulse">Cargando base de conocimiento...</td>
                                    </tr>
                                ) : filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No hay datos en la base de vectorial. Añade el primer fragmento.</td>
                                    </tr>
                                ) : (
                                    filteredEntries.map((entry: any) => (
                                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                                                        {entry.service_type || 'unassigned'}
                                                    </span>
                                                    {entry.region && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase border border-indigo-100">
                                                            {entry.region}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top whitespace-nowrap">
                                                {entry.is_general ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-sky-100">
                                                        <Globe className="h-3 w-3" /> General
                                                    </span>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {entry.location_id && (
                                                            <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-medium">
                                                                <MapPin className="h-2.5 w-2.5" />
                                                                {locations.find(l => l.id === entry.location_id)?.name || 'Sede'}
                                                            </span>
                                                        )}
                                                        {entry.court_id && (
                                                            <span className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-medium">
                                                                <Building2 className="h-2.5 w-2.5" />
                                                                {courts.find(c => c.id === entry.court_id)?.name || 'Juzgado'}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-xl">
                                                <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                                                    {entry.content}
                                                </p>
                                                {entry.embedding && (
                                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-mono">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Vector Activo (3072 dims)
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(entry)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
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
        </div>
    );
}
