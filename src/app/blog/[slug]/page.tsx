import { ARTICLES } from "@/data/articles";
import { AUTHORS } from "@/data/authors";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Linkedin } from "lucide-react";
import { SchemaOrg } from "@/components/seo/SchemaOrg";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. Data Fetching
async function getArticle(slug: string) {
    const article = ARTICLES.find((a) => a.slug === slug);
    if (!article) return null;
    const author = AUTHORS.find((a) => a.id === article.authorId);
    return { article, author };
}

// 2. Metadata
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const data = await getArticle(slug);
    if (!data) return {};

    return {
        title: `${data.article.title} | Autoridad Legal`,
        description: data.article.excerpt,
    };
}

// 3. Static Paths
export async function generateStaticParams() {
    return ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

// 4. Page Content
export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const data = await getArticle(slug);

    if (!data) return notFound();

    const { article, author } = data;

    return (
        <main className="min-h-screen bg-white">
            {/* Schema Injection for Article */}
            <SchemaOrg
                type="Article"
                data={{
                    headline: article.title,
                    image: article.image,
                    datePublished: article.publishedAt,
                    author: {
                        "@type": "Person",
                        "name": author?.name,
                        "url": author?.linkedinUrl
                    },
                    publisher: {
                        "@type": "Organization",
                        "name": "Autoridad Legal",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://autoridadlegal.com/logo.png"
                        }
                    }
                }}
            />

            {/* Back to Blog */}
            <div className="absolute top-24 left-6 md:left-12 lg:left-20">
                <Link href="/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>
            </div>

            <article className="max-w-3xl mx-auto pt-32 pb-20 px-6">
                {/* Header */}
                <header className="mb-12 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest">
                        {article.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif leading-tight">
                        {article.title}
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed font-light">
                        {article.excerpt}
                    </p>

                    {/* Author Byline (Top) */}
                    <div className="flex items-center justify-center gap-3 pt-4">
                        {author && (
                            <>
                                <img src={author.image} alt={author.name} className="w-10 h-10 rounded-full bg-slate-100" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-900">{author.name}</p>
                                    <p className="text-xs text-slate-500">{author.role}</p>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg mb-12 aspect-video relative">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Body */}
                <div
                    className="prose prose-lg prose-slate mx-auto prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 hover:prose-a:text-blue-800 transition-colors"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Bottom Author Box (Trust Signal) */}
                {author && (
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <img src={author.image} alt={author.name} className="w-20 h-20 rounded-full bg-white shadow-md" />
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col md:flex-row items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900">{author.name}</h3>
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wider">
                                    Verificado
                                </span>
                            </div>
                            <p className="text-blue-900 font-medium text-sm">{author.role}</p>
                            <p className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                {author.barNumber}
                            </p>
                        </div>
                        <a
                            href={author.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all font-medium text-sm"
                        >
                            <Linkedin className="w-4 h-4" />
                            Ver Perfil
                        </a>
                    </div>
                )}
            </article>
        </main>
    );
}
