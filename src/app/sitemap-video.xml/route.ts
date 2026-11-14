import { getAllVideos } from '@/data/videos';

export const revalidate = 3600;

/**
 * Google Video XML Sitemap.
 * Exposes pages containing rich VideoObject embeds with the Google Video Sitemap extension.
 */
export async function GET() {
    const videos = getAllVideos();
    const BASE_URL = 'https://www.autoridad.legal';

    const urlEntries = videos
        .filter(v => Boolean(v.partidoJudicial))
        .map(v => {
            const pageUrl = `${BASE_URL}/juzgados/${v.partidoJudicial}`;
            const inLang = v.inLanguage.split('-')[0];
            return `  <url>
    <loc>${pageUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumbnailUrl}</video:thumbnail_loc>
      <video:title><![CDATA[${v.title}]]></video:title>
      <video:description><![CDATA[${v.description}]]></video:description>
      <video:content_loc>${v.contentUrl}</video:content_loc>
      <video:player_loc allow_embed="yes">${v.embedUrl}</video:player_loc>
      <video:duration>${v.durationSeconds}</video:duration>
      <video:publication_date>${v.uploadDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:in_language>${inLang}</video:in_language>
    </video:video>
  </url>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>
`;

    return new Response(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        },
    });
}

