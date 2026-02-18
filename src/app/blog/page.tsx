import Link from "next/link";
import { getArticles } from "@/lib/actions/articles";
import { ArrowRight, Scale } from "lucide-react";

export const metadata = {
    title: "Blog Legal | Autoridad & Actualidad Jurídica",
    description: "Análisis experto sobre derecho penal, civil y accidentes. Artículos redactados por abogados colegiados.",
};

export default async function BlogIndexPage() {
    const articles = await getArticles();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Minimalist Header */}
            <header className="bg-slate-900 pt-24 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest border border-slate-700">
                        <Scale className="w-3 h-3" />
                        Actualidad Jurídica
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">
                        Expertise Legal
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Análisis profundos y guías prácticas redactadas por nuestros socios directores.
                        Información verificada para decisiones críticas.
                    </p>
                </div>
            </header>

            {/* Articles Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => {
                        return (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                {/* Image */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={article.image_url || 'https://placehold.co/600x400/1e293b/ffffff?text=Cargando...'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-900 capitalize">
                                        {article.service_category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1 space-y-3">
                                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h2>
                                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                            {article.subtitle}
                                        </p>
                                    </div>

                                    {/* Footer / Author */}
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {article.author && (
                                                <>
                                                    <img
                                                        src={article.author.image}
                                                        alt={article.author.name}
                                                        className="w-8 h-8 rounded-full bg-slate-200"
                                                    />
                                                    <div className="text-xs">
                                                        <p className="font-bold text-slate-900">{article.author.name}</p>
                                                        <p className="text-slate-500">{new Date(article.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
