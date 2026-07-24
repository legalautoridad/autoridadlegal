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

    const canonicalUrl = `https://www.autoridad.legal/${cobertura.service.slug}/${cobertura.location.slug}`;
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
${cobertura.courtAddress ? `- **Dirección del Juzgado:** ${cobertura.courtAddress}\n` : ''}
`;

    if (cobertura.interestPoints && cobertura.interestPoints.length > 0) {
        markdown += `## Puntos de Interés y Control Local\n\n`;
        cobertura.interestPoints.forEach(pt => {
            const catInfo = pt.category ? ` (${pt.category})` : '';
            markdown += `- **${pt.name}**${catInfo}: ${pt.description || ''}\n`;
        });
        markdown += `\n`;
    }

    markdown += `## Preguntas frecuentes\n\n`;

    cobertura.faqs.forEach(faq => {
        markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    });
}
