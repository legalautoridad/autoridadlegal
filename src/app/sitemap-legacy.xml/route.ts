import fs from 'fs';
import path from 'path';

export const revalidate = 3600;

/**
 * Temporary legacy sitemap (4-6 weeks) containing the 645 old /{servicio}/{municipio} URLs
 * so Google Search Console discovers the 301 redirects faster.
 */
export async function GET() {
    const tsvPath = path.join(process.cwd(), 'src/data/redirects-esperados.tsv');
    const raw = fs.readFileSync(tsvPath, 'utf-8');
    const urls = raw
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.split('\t')[0])
        .filter(Boolean);

    const urlItems = urls
        .map(url => `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-10-31T00:00:00.000Z</lastmod>\n  </url>`)
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlItems}\n</urlset>\n`;

    return new Response(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}

