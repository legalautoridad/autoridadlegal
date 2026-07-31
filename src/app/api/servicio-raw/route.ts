import { NextResponse, NextRequest } from 'next/server';
import { getServiceBySlugFromDb, getServiceFaqs } from '@/lib/db/services';

export async function GET(request: NextRequest) {
    const slug = request.headers.get('x-servicio-slug') || request.nextUrl.searchParams.get('slug') || '';
    const service = await getServiceBySlugFromDb(slug);

    if (!service) {
        return new NextResponse(`Service "${slug}" not found in Supabase`, { status: 404 });
    }

    const faqs = await getServiceFaqs(slug);
    const canonicalUrl = `https://www.autoridad.legal/${service.slug}`;

    const title = service.seo?.title || service.hero?.title || service.name;
    const description = service.seo?.description || service.hero?.subtitle || '';

    // Clean YAML frontmatter escaping quotes
    const escapedTitle = title.replace(/"/g, '\\"');
    const escapedDescription = description.replace(/"/g, '\\"');

    let markdown = `---
title: "${escapedTitle}"
description: "${escapedDescription}"
slug: "${service.slug}"
canonical_url: "${canonicalUrl}"
service: "${service.name}"
---

# ${title}

${description}

`;

    if (faqs.length > 0) {
        markdown += `## Preguntas frecuentes\n\n`;
        faqs.forEach(faq => {
            markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
        });
    }

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
