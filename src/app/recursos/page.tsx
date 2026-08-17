"use client";

import { useState } from "react";
import { ARTICLES } from "@/data/articles";
import Link from "next/link";
import { Search, Scale, ShieldAlert, HeartHandshake, ArrowRight, Tag, AlertCircle } from "lucide-react";

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: "alcoholemia", label: "Alcoholemia y Tráfico", silo: "Silo Principal (Penal)", icon: ShieldAlert, color: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
        { id: "herencias", label: "Herencias (Silo Secundario)", silo: "Silo Secundario (Civil)", icon: HeartHandshake, color: "bg-slate-800 text-slate-400 border-slate-700" },
        { id: "accidentes", label: "Accidentes (Silo Secundario)", silo: "Silo Secundario (Civil)", icon: Scale, color: "bg-slate-800 text-slate-400 border-slate-700" },
    ];

    const filteredArticles = ARTICLES.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header */}
            <header className="bg-gradient-to-b from-trust-navy via-slate-900 to-slate-950 pt-28 pb-20 px-6 text-center relative overflow-hidden border-b border-white/10">
                <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-widest">
                        Centro de Conocimiento Jurídico · Especialización Penal
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        Recursos y Biblioteca Penal de Tráfico
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                        Doctrina, jurisprudencia y guías prácticas supervisadas por la Dirección Jurídica para la defensa de delitos contra la seguridad vial.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative pt-4">
                        <input
                            type="text"
                            placeholder="Buscar guías (ej. Juicio Rápido, Alcoholemia...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-900/90 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-prestige-gold transition-all shadow-2xl text-sm"
                        />
                        <Search className="absolute left-4 top-1/2 translate-y-1 text-slate-400 w-5 h-5" />
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {/* Silo Notice */}
                <div className="mb-8 p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
                    <AlertCircle className="w-5 h-5 text-prestige-gold shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-white mb-0.5">Estructura de Silos Temáticos y Coherencia GEO:</p>
                        <p>
                            El núcleo dominante de Autoridad Legal es la <strong className="text-prestige-gold">Defensa Penal en Delitos de Tráfico y Seguridad Vial</strong>. Los contenidos de otras disciplinas civiles se clasifican explícitamente en <span className="underline decoration-slate-600">Silo Secundario con marca de revisión editorial (TODO Editorial)</span>.
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left shadow-lg
                                ${selectedCategory === cat.id
                                    ? 'bg-prestige-gold/20 border-prestige-gold text-white ring-2 ring-prestige-gold/50'
                                    : 'bg-slate-900/80 border-white/10 hover:border-prestige-gold/30 text-slate-300'
                                }`}
                        >
                            <div className={`p-3 rounded-xl border ${cat.color}`}>
                                <cat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-white">{cat.label}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{cat.silo}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Articles List */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-prestige-gold" />
                            Artículos y Guías Disponibles ({filteredArticles.length})
                        </h2>
                        {selectedCategory && (
                            <button
                                onClick={() => { setSelectedCategory(null); setSearchTerm(""); }}
                                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                            >
                                Ver Todos los Silos
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article) => {
                            const isCore = article.silo === 'penal-trafico';
                            return (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-white/10 hover:border-prestige-gold/40 shadow-xl transition-all duration-300 flex flex-col"
                                >
                                    <div className="h-44 overflow-hidden relative">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                        />
                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            isCore 
                                                ? 'bg-prestige-gold text-trust-navy font-black' 
                                                : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                                        }`}>
                                            {isCore ? 'Silo Principal · Penal' : 'Silo Secundario · TODO Editorial'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col space-y-3">
                                        {/* Breadcrumb */}
                                        <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                                            Inicio &gt; {isCore ? 'Defensa Penal de Tráfico' : 'Silo Secundario (Consultas Civiles)'} &gt; <span className="capitalize">{article.category}</span>
                                        </p>

                                        <h3 className="text-lg font-bold text-white group-hover:text-prestige-gold transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h3>
                                        
                                        <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        {article.editorialNote && (
                                            <p className="text-[10px] text-amber-400/90 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 italic">
                                                ⚠️ {article.editorialNote}
                                            </p>
                                        )}

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                                            <span className="text-slate-400 font-medium group-hover:text-white transition-colors">Leer guía completa</span>
                                            <ArrowRight className="w-4 h-4 text-prestige-gold group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-dashed border-slate-800 space-y-3">
                            <p className="text-base text-slate-400">No hemos encontrado artículos que coincidan con tu búsqueda.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                                className="text-xs text-prestige-gold font-bold hover:underline"
                            >
                                Restablecer filtros de búsqueda
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
