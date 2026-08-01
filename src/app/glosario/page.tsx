import { Metadata } from 'next';
import Link from 'next/link';
import { getAllGlosarioTerms } from '@/lib/db/glosario';
import { BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Glosario de Derecho Penal y Seguridad Vial | Autoridad Legal',
    description: 'Diccionario jurídico especializado en delitos de alcoholemia, drogas al volante, conducción sin carnet, juicios rápidos y metrología legal.',
    alternates: {
        canonical: 'https://www.autoridad.legal/glosario',
    },
    openGraph: {
        title: 'Glosario de Derecho Penal y Seguridad Vial',
        description: 'Diccionario jurídico especializado en delitos de alcoholemia, drogas al volante, conducción sin carnet, juicios rápidos y metrología legal.',
        url: 'https://www.autoridad.legal/glosario',
        siteName: 'Autoridad Legal',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Glosario de Derecho Penal y Seguridad Vial',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Glosario de Derecho Penal y Seguridad Vial',
        description: 'Diccionario jurídico especializado en delitos de alcoholemia, drogas al volante, conducción sin carnet, juicios rápidos y metrología legal.',
        images: ['/og-image.jpg'],
    },
};

export default async function GlosarioIndexPage() {
    const terms = await getAllGlosarioTerms();

    // Group terms by first letter
    const groupedTerms: Record<string, typeof terms> = {};
    terms.forEach(term => {
        const firstChar = (term.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0] || 'A').toUpperCase();
        if (!groupedTerms[firstChar]) {
            groupedTerms[firstChar] = [];
        }
        groupedTerms[firstChar].push(term);
    });

    const letters = Object.keys(groupedTerms).sort();

    // Schema.org DefinedTermSet
    const definedTermSetSchema = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        '@id': 'https://www.autoridad.legal/glosario#termset',
        'name': 'Glosario de Derecho Penal y Seguridad Vial',
        'description': 'Diccionario de términos legales en delitos contra la seguridad vial, atestados metrológicos y juicios rápidos.',
        'url': 'https://www.autoridad.legal/glosario',
        'author': {
            '@type': 'Person',
            'name': 'Santiago Giménez Olavarriaga',
            'jobTitle': 'Director Jurídico y Abogado Penalista',
            'identifier': 'ICAB 31.389',
            'sameAs': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga'
        },
        'hasDefinedTerm': terms.map(t => ({
            '@type': 'DefinedTerm',
            '@id': `https://www.autoridad.legal/glosario/${t.slug}#term`,
            'name': t.name,
            'description': t.description,
            'url': `https://www.autoridad.legal/glosario/${t.slug}`
        }))
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
            />

            <main className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12 flex-1">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" /> Glosario Jurídico Especializado
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Diccionario de Derecho Penal &amp; Tráfico
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Consulte los términos, doctrinas legales, conceptos metrológicos y procedimientos penalísticos aplicados por nuestro despacho en la defensa por juicios rápidos.
                    </p>
                </div>

                {/* Quick Alphabet Jumper */}
                <div className="flex flex-wrap justify-center gap-1.5 max-w-4xl mx-auto p-4 rounded-2xl bg-slate-950/60 border border-white/10">
                    {letters.map(letter => (
                        <a
                            key={letter}
                            href={`#letter-${letter}`}
                            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-prestige-gold hover:text-trust-navy border border-white/10 flex items-center justify-center text-xs font-bold transition-all"
                        >
                            {letter}
                        </a>
                    ))}
                </div>

                {/* Terms Listing by Letter */}
                <div className="space-y-12">
                    {letters.map(letter => (
                        <section id={`letter-${letter}`} key={letter} className="space-y-4 scroll-mt-24">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                                <span className="w-8 h-8 rounded-xl bg-prestige-gold text-trust-navy font-black text-sm flex items-center justify-center shadow">
                                    {letter}
                                </span>
                                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                                    {groupedTerms[letter].length} {groupedTerms[letter].length === 1 ? 'término' : 'términos'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedTerms[letter].map(term => (
                                    <Link
                                        key={term.slug}
                                        href={`/glosario/${term.slug}`}
                                        className="group p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-white/10 hover:border-prestige-gold/50 transition-all flex flex-col justify-between space-y-3 shadow-md hover:shadow-xl hover:shadow-prestige-gold/5"
                                    >
                                        <div className="space-y-2">
                                            <h2 className="text-base font-bold text-white group-hover:text-prestige-gold transition-colors flex items-center justify-between">
                                                <span>{term.name}</span>
                                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-prestige-gold group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                            </h2>
                                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                                                {term.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-500">
                                            <span className="font-mono text-slate-400">/glosario/{term.slug}</span>
                                            <span className="text-prestige-gold/80 font-medium">Ver definición &rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}
