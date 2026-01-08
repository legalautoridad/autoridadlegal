"use client";

import { useState } from "react";
import { ARTICLES } from "@/data/articles";
import Link from "next/link";
import { Search, Scale, ShieldAlert, HeartHandshake, ArrowRight } from "lucide-react";

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: "alcoholemia", label: "Alcoholemia", icon: ShieldAlert, color: "bg-orange-100 text-orange-600" },
        { id: "herencias", label: "Herencias", icon: HeartHandshake, color: "bg-slate-100 text-slate-900" },
        { id: "accidentes", label: "Accidentes", icon: Scale, color: "bg-blue-100 text-blue-600" },
    ];

    const filteredArticles = ARTICLES.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Unique Header */}
            <header className="bg-slate-900 pt-32 pb-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tight">
                        Centro de Conocimiento
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                        La biblioteca legal más completa. Respuestas verificadas por abogados colegiados.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando? (ej. Juicio Rápido, Herencia...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition-all shadow-xl"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <section className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-20">
                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={`p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left shadow-sm hover:shadow-md
                                ${selectedCategory === cat.id
                                    ? 'bg-slate-900 border-slate-900 text-white transform scale-105 ring-4 ring-slate-200'
                                    : 'bg-white border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            <div className={`p-3 rounded-xl ${cat.color}`}>
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${selectedCategory === cat.id ? 'text-white' : 'text-slate-900'}`}>
                                    {cat.label}
                                </h3>
                                <p className={`text-sm ${selectedCategory === cat.id ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Ver artículos
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Articles List */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {filteredArticles.length} Artículos Encontrados
                        </h2>
                        {selectedCategory && (
                            <button
                                onClick={() => { setSelectedCategory(null); setSearchTerm(""); }}
                                className="text-sm text-red-500 hover:text-red-700 font-medium"
                            >
                                Borrar Filtros
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs text-slate-400 font-medium">Leer análisis completo</span>
                                        <ArrowRight className="w-4 h-4 text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                            <p className="text-xl text-slate-400 font-medium">No hemos encontrado artículos que coincidan con tu búsqueda.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                                className="mt-4 text-blue-600 font-bold hover:underline"
                            >
                                Ver todos los artículos
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
