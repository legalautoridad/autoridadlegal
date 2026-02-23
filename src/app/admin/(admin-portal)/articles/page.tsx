'use client';

import { useEffect, useState } from 'react';
import { getArticlesAdmin, upsertArticle, deleteArticle, getAuthorsAdmin, uploadArticleImage } from '@/lib/actions/articles';
import { getLocationsAdmin } from '@/lib/actions/locations';
import { FileText, Trash2, Edit2, Plus, ArrowLeft, Search, X, CheckCircle2, Circle, Globe, User, Tag, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ArticleManagementPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [artList, authList, locList] = await Promise.all([
                getArticlesAdmin(),
                getAuthorsAdmin(),
                getLocationsAdmin()
            ]);
            setArticles(artList);
            setAuthors(authList);
            setLocations(locList);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
        try {
            await deleteArticle(id);
            loadData();
        } catch (error: any) {
            alert('Error deleting article: ' + error.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            let finalImageUrl = formData.get('image_url') as string;

            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);
                const uploadedUrl = await uploadArticleImage(uploadFormData);
                finalImageUrl = uploadedUrl;
            }

            await upsertArticle({
                id: editingArticle?.id,
                title: formData.get('title') as string,
                subtitle: formData.get('subtitle') as string,
                slug: formData.get('slug') as string,
                image_url: finalImageUrl,
                author_name: formData.get('author_name') as string,
                content: formData.get('content') as string,
                service_category: formData.get('service_category') as string,
                lawyer_id: formData.get('lawyer_id') as string || null,
                location_id: formData.get('location_id') as string || null,
                region: formData.get('region') as string,
                is_published: formData.get('is_published') === 'true'
            });
            setShowModal(false);
            setEditingArticle(null);
            setSelectedFile(null);
            setImagePreview(null);
            loadData();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEdit = (art: any) => {
        setEditingArticle(art);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingArticle(null);
        setSelectedFile(null);
        setImagePreview(null);
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Artículos</h1>
                            <p className="text-slate-500">Publica y administra el contenido del blog.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4 h-11">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar artículo..."
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
                                Nuevo Artículo
                            </button>
                        </div>
                    </div>
                </header>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-slate-900">
                                    {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column: Core Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Título</label>
                                            <input
                                                name="title"
                                                required
                                                defaultValue={editingArticle?.title}
                                                placeholder="Ej: Juicio rápido por alcoholemia"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Subtítulo (Extracto)</label>
                                            <input
                                                name="subtitle"
                                                defaultValue={editingArticle?.subtitle}
                                                placeholder="Breve resumen para el listado"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Slug (URL)</label>
                                                <input
                                                    name="slug"
                                                    required
                                                    defaultValue={editingArticle?.slug}
                                                    placeholder="ej: juicio-rapido-alcoholemia"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Estado</label>
                                                <select
                                                    name="is_published"
                                                    defaultValue={editingArticle?.is_published ? 'true' : 'false'}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                                >
                                                    <option value="false">Borrador</option>
                                                    <option value="true">Publicado</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Imagen del Artículo</label>
                                            <div className="space-y-3">
                                                {/* Preview */}
                                                {(imagePreview || editingArticle?.image_url) && (
                                                    <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200">
                                                        <img
                                                            src={imagePreview || editingArticle?.image_url}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {imagePreview && (
                                                            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                                Nueva Imagen
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">O URL externa:</span>
                                                        <input
                                                            name="image_url"
                                                            defaultValue={editingArticle?.image_url}
                                                            placeholder="https://images.unsplash.com/..."
                                                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-xs bg-slate-50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Metadata & Links */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Área Legal / Servicio</label>
                                                <select
                                                    name="service_category"
                                                    defaultValue={editingArticle?.service_category || 'general'}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50 font-bold"
                                                >
                                                    <option value="general">General / Informativo</option>
                                                    <option value="alcoholemia">Alcoholemia</option>
                                                    <option value="accidentes">Accidentes de Tráfico</option>
                                                    <option value="herencias">Herencias y Sucesiones</option>
                                                    <option value="familia">Derecho de Familia</option>
                                                    <option value="penal">Derecho Penal</option>
                                                    <option value="civil">Derecho Civil</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Región</label>
                                                <input
                                                    name="region"
                                                    defaultValue={editingArticle?.region || 'Cataluña'}
                                                    placeholder="Ej: Cataluña"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Autor (Nombre Visible)</label>
                                            <input
                                                name="author_name"
                                                defaultValue={editingArticle?.author_name}
                                                placeholder="Ej: Dr. Marc Valls"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Autor Vinculado (E-E-A-T)</label>
                                            <select
                                                name="lawyer_id"
                                                defaultValue={editingArticle?.lawyer_id || ''}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                            >
                                                <option value="">Sin autor vinculado</option>
                                                {authors.map(author => (
                                                    <option key={author.id} value={author.id}>{author.full_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Sede/Ubicación (Silos)</label>
                                            <select
                                                name="location_id"
                                                defaultValue={editingArticle?.location_id || ''}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50"
                                            >
                                                <option value="">Sin sede vinculada</option>
                                                {locations.map(loc => (
                                                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.zone})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Editor (Simple Textarea for now) */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Contenido (HTML)</label>
                                    <textarea
                                        name="content"
                                        rows={10}
                                        required
                                        defaultValue={editingArticle?.content}
                                        placeholder="Escribe el contenido en formato HTML..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all bg-slate-50/50 font-mono text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4 disabled:opacity-50"
                                >
                                    {formLoading ? 'Guardando...' : editingArticle ? 'Actualizar Artículo' : 'Crear Artículo'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Artículo</th>
                                <th className="px-6 py-4">Categoría / Región</th>
                                <th className="px-6 py-4">Autor</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Cargando artículos...</td>
                                </tr>
                            ) : filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No se encontraron artículos.</td>
                                </tr>
                            ) : (
                                filteredArticles.map((art) => (
                                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {art.image_url ? (
                                                        <img src={art.image_url} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5 select-all">/{art.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium capitalize">
                                                <Tag className="h-3.5 w-3.5 text-slate-400" />
                                                {art.service_category || 'General'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {art.locations?.name || art.region || 'España'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                {art.author_name || art.lawyer_members?.full_name || 'Desconocido'}
                                            </div>
                                            {art.lawyer_members && (
                                                <div className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-1 font-bold">
                                                    Verificado
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {art.is_published ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Publicado
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full w-fit">
                                                    <Circle className="h-3.5 w-3.5" />
                                                    Borrador
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={`/blog/${art.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Ver en el sitio"
                                                >
                                                    <Globe className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => openEdit(art)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(art.id)}
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
