'use client';

import { useEffect, useState, useTransition } from 'react';
import { 
    getKnowledgeRecords, 
    upsertKnowledgeRecord, 
    deleteKnowledgeRecord 
} from '@/lib/actions/knowledge';
import { getLocationsAdmin } from '@/lib/actions/locations';
import {
    BookOpen,
    Plus,
    Search,
    Trash2,
    Edit2,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Globe,
    MapPin,
    Zap,
    Filter,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function KnowledgePage() {
    const [records, setRecords] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'alcoholemia' | 'general'>('all');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [formData, setFormData] = useState({
        content: '',
        service_type: 'alcoholemia',
        is_general: true,
        location_id: ''
    });

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [recordsData, locationsData] = await Promise.all([
                getKnowledgeRecords(),
                getLocationsAdmin()
            ]);
            setRecords(recordsData);
            setLocations(locationsData);
        } catch (error) {
            console.error('Error loading knowledge data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record: any = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                content: record.content,
                service_type: record.service_type || 'alcoholemia',
                is_general: record.is_general,
                location_id: record.location_id || ''
            });
        } else {
            setEditingRecord(null);
            setFormData({
                content: '',
                service_type: 'alcoholemia',
                is_general: true,
                location_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        
        startTransition(async () => {
            try {
                const recordToSave = {
                    ...formData,
                    id: editingRecord?.id,
                    location_id: formData.is_general ? null : formData.location_id || null
                };
                
                await upsertKnowledgeRecord(recordToSave);
                setStatus('success');
                setIsModalOpen(false);
                loadData();
                setTimeout(() => setStatus('idle'), 3000);
            } catch (error) {
                console.error('Error saving record:', error);
                setStatus('error');
            }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro de conocimiento?')) return;
        
        try {
            await deleteKnowledgeRecord(id);
            loadData();
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Error al eliminar el registro');
        }
    };

    const filteredRecords = records.filter(r => {
        const matchesSearch = r.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || r.service_type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-rose-600 animate-spin" />
                    <p className="font-medium text-slate-500">Cargando base de conocimiento RAG...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <BookOpen className="h-8 w-8 text-rose-600" />
                                Base de Conocimiento (RAG)
                            </h1>
                            <p className="text-slate-500 mt-1 max-w-2xl">
                                Gestiona la información técnica y legal que el chatbot utiliza para responder. 
                                Cada entrada se vectoriza automáticamente para búsqueda semántica.
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                        >
                            <Plus className="h-5 w-5" />
                            Nuevo Registro
                        </button>
                    </div>
                </header>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar en el contenido..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none appearance-none transition-all"
                        >
                            <option value="all">Todos los Perfiles</option>
                            <option value="alcoholemia">Alcoholemia</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                </div>

                {/* Knowledge List */}
                <div className="space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                record.service_type === 'alcoholemia' ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {record.service_type}
                                            </span>
                                            {record.is_general ? (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                                                    <Globe className="h-3 w-3" />
                                                    GLOBAL
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md">
                                                    <MapPin className="h-3 w-3" />
                                                    {locations.find(l => l.id === record.location_id)?.name || 'Localidad Específica'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                            {record.content}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(record)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No se encontraron registros</h3>
                            <p className="text-slate-500">Prueba con otra búsqueda o crea un nuevo registro de conocimiento.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleSave}>
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingRecord ? 'Editar Registro' : 'Nuevo Registro de Conocimiento'}
                                    </h2>
                                    <p className="text-xs text-slate-500">Define información técnica para el RAG</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Service Type & Scope */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil de Servicio</label>
                                        <select
                                            value={formData.service_type}
                                            onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                                        >
                                            <option value="alcoholemia">Alcoholemia</option>
                                            <option value="general">General / Otros</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alcance Geográfico</label>
                                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, is_general: true})}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                                    formData.is_general ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                )}
                                            >
                                                Global
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, is_general: false})}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                                    !formData.is_general ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                )}
                                            >
                                                Específico
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Location (Conditional) */}
                                {!formData.is_general && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localidad Asociada</label>
                                        <select
                                            value={formData.location_id}
                                            onChange={(e) => setFormData({...formData, location_id: e.target.value})}
                                            required
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                                        >
                                            <option value="">Selecciona una localidad...</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name} ({loc.region})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contenido Técnico</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        required
                                        rows={6}
                                        placeholder="Introduce aquí la información legal, plazos, leyes o datos específicos..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 resize-none text-sm leading-relaxed"
                                    />
                                    <p className="text-[10px] text-slate-400">
                                        * Este texto será procesado por el modelo de IA para generar su representación vectorial (Embedding).
                                    </p>
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                                {status === 'error' && (
                                    <div className="text-rose-600 text-xs font-bold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Error al guardar
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-500 font-bold text-sm hover:text-slate-700 px-4"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {isPending ? 'Procesando...' : 'Guardar y Vectorizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
