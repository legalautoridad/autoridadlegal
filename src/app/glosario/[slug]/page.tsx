import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllGlosarioTerms, getGlosarioTermBySlug, getPublicRelatedLinks } from '@/lib/db/glosario';
import { BookOpen, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

interface GlosarioPageProps {
    params: Promise<{ slug: string }>;
}

// 1. Static Params Generation (SSG/ISR from Supabase)
export async function generateStaticParams() {
    const terms = await getAllGlosarioTerms();
    return terms.map(term => ({
        slug: term.slug,
    }));
}

// 2. SEO & GEO Metadata Generation
export async function generateMetadata({ params }: GlosarioPageProps): Promise<Metadata> {
    const { slug } = await params;
    const term = await getGlosarioTermBySlug(slug);

    if (!term) {
        return {};
    }

    const title = `${term.name} - Definición Jurídica y Doctrina | Glosario Autoridad Legal`;
    const description = term.description || `Definición de ${term.name} en el ámbito de la seguridad vial y juicios rápidos por Santiago Giménez Olavarriaga (ICAB 31.389).`;
    const canonicalUrl = `https://autoridadlegal.com/glosario/${term.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Autoridad Legal',
            locale: 'es_ES',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

// 3. Glossary Term Page Component
export default async function GlosarioTermPage({ params }: GlosarioPageProps) {
    const { slug } = await params;
    const term = await getGlosarioTermBySlug(slug);

    if (!term) {
        return notFound();
    }

    const canonicalUrl = `https://autoridadlegal.com/glosario/${term.slug}`;
    const rawMarkdownUrl = `/glosario/${term.slug}.md`;
    const relatedLinks = await getPublicRelatedLinks(term.id);

    // Filter sameAs: ONLY specific valid URLs, NEVER generic "https://wikidata.org"
    const hasSpecificSameAs = term.schema_url && 
        term.schema_url.trim() !== '' && 
        term.schema_url.trim() !== 'https://wikidata.org' && 
        term.schema_url.trim() !== 'https://wikidata.org/';
    const sameAs = hasSpecificSameAs ? term.schema_url : undefined;

    // Schema.org DefinedTerm + E-E-A-T Author Person
    const definedTermSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'DefinedTerm',
                '@id': `${canonicalUrl}#term`,
                'name': term.name,
                'description': term.description,
                'url': canonicalUrl,
                ...(sameAs ? { 'sameAs': sameAs } : {}),
                'inDefinedTermSet': {
                    '@type': 'DefinedTermSet',
                    '@id': 'https://autoridadlegal.com/glosario#termset',
                    'name': 'Glosario de Derecho Penal y Seguridad Vial',
                    'url': 'https://autoridadlegal.com/glosario'
                },
                'author': {
                    '@type': 'Person',
                    'name': 'Santiago Giménez Olavarriaga',
                    'jobTitle': 'Director Jurídico y Abogado Penalista',
                    'identifier': 'ICAB 31.389',
                    'sameAs': 'https://autoridadlegal.com/abogados/santiago-gimenez-olavarriaga'
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
            />

            <main className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto w-full space-y-10 flex-1">
                {/* Back navigation & LLM raw file link */}
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <Link
                        href="/glosario"
                        className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-400 hover:text-prestige-gold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Glosario
                    </Link>

                    <a
                        href={rawMarkdownUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-950 border border-white/10 text-xs font-mono text-amber-400 transition-colors"
                        title="Ver versión en Markdown crudo para LLMs y parseadores"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{term.slug}.md (Raw)</span>
                    </a>
                </div>

                {/* Term Header Card */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4 shadow-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-widest">
                        <BookOpen className="w-3.5 h-3.5" /> Término Jurídico Definido
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        {term.name}
                    </h1>

                    {term.description && (
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                            {term.description}
                        </p>
                    )}

                    {/* Author E-E-A-T Signal */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-prestige-gold/20 flex items-center justify-center text-prestige-gold font-bold text-xs">
                                SG
                            </div>
                            <div>
                                <p className="font-bold text-white">Santiago Giménez Olavarriaga</p>
                                <p className="text-[11px] text-prestige-gold/90">Abogado Director (ICAB 31.389)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Public Links Section (Only rendered if non-empty) */}
                {relatedLinks.length > 0 && (
                    <div className="p-6 rounded-3xl bg-slate-950/60 border border-white/10 space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                            Páginas Relacionadas
                        </h3>
                        <ul className="space-y-2">
                            {relatedLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.url} className="text-prestige-gold hover:text-white underline font-medium">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* CTA Emergency Panel */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-950 border border-red-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                        <ShieldCheck className="w-5 h-5" />
                        Asistencia Legal Inmediata 24 Horas
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">
                        ¿Tiene una citación o atestado relacionado con {term.name}?
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Nuestros abogados penalistas intervienen desde la primera asistencia en comisaría o juzgado de guardia en toda Cataluña por un precio cerrado de 980 €.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4">
                        <a
                            href="tel:+34605118871"
                            className="px-6 py-3 rounded-xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-bold text-sm shadow-lg shadow-prestige-gold/20 transition-all"
                        >
                            Llamar al Abogado de Guardia (+34 605 118 871)
                        </a>
                        <Link
                            href="/glosario"
                            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-white/10 transition-all"
                        >
                            Explorar otros términos del glosario
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
