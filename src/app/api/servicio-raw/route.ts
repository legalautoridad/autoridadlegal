import { NextResponse, NextRequest } from 'next/server';
import { getServiceBySlugFromDb, getCanonicalFaqsForService } from '@/lib/db/services';

export async function GET(request: NextRequest) {
    const slug = request.headers.get('x-servicio-slug') || request.nextUrl.searchParams.get('slug') || '';
    const service = await getServiceBySlugFromDb(slug);

    if (!service) {
        return new NextResponse(`Service "${slug}" not found in Supabase`, { status: 404 });
    }

    const canonicalFaqs = await getCanonicalFaqsForService(slug);
    const canonicalUrl = `https://autoridadlegal.com/servicios/${service.slug}`;

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

    if (canonicalFaqs.length > 0) {
        markdown += `## Preguntas frecuentes\n\n`;
        canonicalFaqs.forEach(faq => {
            markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
        });
    }

    markdown += `## Enlaces de Interés\n\n`;
    markdown += `- Director Jurídico: [Santiago Giménez Olavarriaga](/abogados/santiago-gimenez-olavarriaga)\n`;
    markdown += `- Directorio de Cobertura Local: [Ver Municipios](/municipios)\n`;
    markdown += `- Términos Doctrinarios: [Glosario Jurídico](/glosario)\n`;

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
