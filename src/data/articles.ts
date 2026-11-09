export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    authorId: string;
    category: 'alcoholemia' | 'herencias' | 'accidentes';
    silo: 'penal-trafico' | 'secundario-civil';
    editorialNote?: string;
    publishedAt: string;
    image: string;
}

export const ARTICLES: Article[] = [];
