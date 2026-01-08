import { AUTHORS } from "@/data/authors";
import { ARTICLES } from "@/data/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Calendar, Linkedin, ArrowRight, Award, Scale } from "lucide-react";
import { SchemaOrg } from "@/components/seo/SchemaOrg";

type Props = {
    params: Promise<{ id: string }>;
};

async function getLawyer(id: string) {
    const lawyer = AUTHORS.find((a) => a.id === id);
    if (!lawyer) return null;
    const articles = ARTICLES.filter((a) => a.authorId === id);
    return { lawyer, articles };
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const data = await getLawyer(id);
    if (!data) return {};

    return {
        title: `${data.lawyer.name} | Abogado Colegiado ${data.lawyer.barNumber}`,
        description: `Perfil profesional de ${data.lawyer.name}, ${data.lawyer.role} en Autoridad Legal. Experto en litigación y estrategia procesal.`,
    };
}

export async function generateStaticParams() {
    return AUTHORS.map((author) => ({
        id: author.id,
    }));
}

export default async function LawyerProfilePage({ params }: Props) {
    const { id } = await params;
    const data = await getLawyer(id);

    if (!data) return notFound();

    const { lawyer, articles } = data;

    return (
        <main className="min-h-screen bg-white">
            <SchemaOrg
                type="Person"
                data={{
                    name: lawyer.name,
                    jobTitle: lawyer.role,
                    identifier: lawyer.barNumber,
                    url: `https://autoridadlegal.com/abogados/${lawyer.id}`,
                    image: lawyer.image,
                    sameAs: [lawyer.linkedinUrl]
                }}
            />

            {/* Profile Header */}
            <div className="bg-slate-900 pt-32 pb-20 px-6 text-center lg:text-left">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10">
                            <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-full p-3 border-4 border-slate-900 z-20" title="Colegiado Activo">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest border border-slate-700">
                            <Scale className="w-3 h-3" />
                            Socio Director
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">
                            {lawyer.name}
                        </h1>
                        <p className="text-xl text-slate-400 font-light flex flex-col sm:flex-row gap-2 sm:items-center">
                            <span>{lawyer.role}</span>
                            <span className="hidden sm:inline text-slate-600">•</span>
                            <span className="text-slate-300 font-medium">{lawyer.barNumber}</span>
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
                                <Calendar className="w-4 h-4" />
                                Agendar Consulta
                            </button>
                            <a
                                href={lawyer.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
                {/* Left Sidebar: Stats & Bio */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            Credenciales
                        </h3>
                        <ul className="space-y-4 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                                <span>Licenciado en Derecho por la Universidad de Barcelona (UB).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                                <span>Máster en Abogacía Penal Económica.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                                <span>Miembro del Ilustre Colegio de la Abogacía de Barcelona.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content: Bio & Articles */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Biografía Profesional</h2>
                        <div className="prose prose-slate text-slate-600 leading-relaxed">
                            <p>
                                Con más de 15 años de experiencia en litigación compleja, {lawyer.name} lidera el departamento
                                especializado asegurando una defensa técnica de primer nivel. Su enfoque combina un profundo
                                conocimiento de la jurisprudencia reciente con una estrategia procesal agresiva cuando el caso lo requiere.
                            </p>
                            <p>
                                Ha sido reconocido por su capacidad para resolver situaciones de bloqueo legal y por su
                                tasa de éxito en negociaciones extrajudiciales.
                            </p>
                        </div>
                    </section>

                    <section className="border-t border-slate-100 pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 font-serif">
                                Artículos Publicados
                            </h2>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                                {articles.length} Publicaciones
                            </span>
                        </div>

                        <div className="grid gap-6">
                            {articles.map(article => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group block bg-white border border-slate-100 rounded-xl p-6 hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                                                {article.category}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex self-center">
                                            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
