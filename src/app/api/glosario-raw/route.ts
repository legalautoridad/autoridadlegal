import { NextResponse, NextRequest } from 'next/server';
import { getGlosarioTermBySlug, getPublicRelatedLinks } from '@/lib/db/glosario';

export async function GET(request: NextRequest) {
    const slug = request.headers.get('x-glosario-slug') || request.nextUrl.searchParams.get('slug') || '';
    const term = await getGlosarioTermBySlug(slug);

    if (!term) {
        return new NextResponse(`Term "${slug}" not found in Supabase glossary`, { status: 404 });
    }

    const canonicalUrl = `https://autoridadlegal.com/glosario/${term.slug}`;
    const relatedLinks = await getPublicRelatedLinks(term.id);

    // Escape quotes for YAML frontmatter
    const escapedTitle = term.name.replace(/"/g, '\\"');
    const escapedDescription = term.description.replace(/"/g, '\\"');

    let markdown = `---
title: "${escapedTitle}"
description: "${escapedDescription}"
slug: "${term.slug}"
canonical_url: "${canonicalUrl}"
---

# ${term.name}

${term.description}
`;

    if (relatedLinks.length > 0) {
        markdown += `\n## Páginas Relacionadas\n\n`;
        relatedLinks.forEach(link => {
            markdown += `- [${link.title}](${link.url})\n`;
        });
    }

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
