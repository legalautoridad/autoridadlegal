import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/glosario',
                    '/glosario/*',
                    '/municipios',
                    '/llms.txt',
                    '/entitymap.json',
                    '/entitymap.html',
                    '/sitemap.xml',
                ],
                disallow: ['/admin/', '/lawyer/', '/api/', '/checkout/', '/login'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
            },
        ],
        sitemap: 'https://www.autoridad.legal/sitemap.xml',
    };
}
