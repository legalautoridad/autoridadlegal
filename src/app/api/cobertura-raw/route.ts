import { NextResponse, NextRequest } from 'next/server';
import { getCoberturaData } from '@/lib/db/cobertura';

export const revalidate = 3600; // ISR revalidation for raw markdown

export async function GET(request: NextRequest) {
    const serviceSlug = request.headers.get('x-cobertura-service') || request.nextUrl.searchParams.get('service') || '';
    const citySlug = request.headers.get('x-cobertura-city') || request.nextUrl.searchParams.get('city') || '';

    // Single source of truth gate check (web_published = true & faq_json non-empty)
    const cobertura = await getCoberturaData(serviceSlug, citySlug);

    if (!cobertura) {
        return new NextResponse(`Coverage page for "${serviceSlug}/${citySlug}" is not published or does not exist`, { status: 404 });
    }

    const canonicalUrl = `https://autoridadlegal.com/${cobertura.service.slug}/${cobertura.location.slug}`;
    const escapedTitle = cobertura.h1Title.replace(/"/g, '\\"');
    const escapedDescription = cobertura.description.replace(/"/g, '\\"');

    let markdown = `---
title: "${escapedTitle}"
description: "${escapedDescription}"
slug: "${cobertura.service.slug}-${cobertura.location.slug}"
canonical_url: "${canonicalUrl}"
service: "${cobertura.service.name}"
municipio: "${cobertura.location.name}"
---

# ${cobertura.h1Title}

${cobertura.summary}

${cobertura.content ? `${cobertura.content}\n\n` : ''}## Información Judicial Local

- **Municipio:** ${cobertura.location.name}
- **Órgano Judicial Competente:** ${cobertura.courtName || 'Juzgados de la Jurisdicción'}
${cobertura.courtAddress ? `- **Dirección del Juzgado:** ${cobertura.courtAddress}\n` : ''}${cobertura.courtSlug ? `- **Partido Judicial:** [Ver ${cobertura.courtName}](/geografia/juzgados/${cobertura.courtSlug})\n` : ''}
## Preguntas frecuentes

`;

    cobertura.faqs.forEach(faq => {
        markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });

    markdown += `## Enlaces de Interés\n\n`;
    markdown += `- Servicio Principal: [Abogados de ${cobertura.service.name}](/servicios/${cobertura.service.slug})\n`;
    if (cobertura.courtSlug) {
        markdown += `- Juzgado Competente: [${cobertura.courtName}](/geografia/juzgados/${cobertura.courtSlug})\n`;
    }
    markdown += `- Directorio de Municipios: [Ver Cobertura](/municipios)\n`;
    markdown += `- Doctrina y Términos: [Glosario Jurídico](/glosario)\n`;

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
