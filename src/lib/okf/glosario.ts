import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GlosarioTermFrontmatter {
    type?: string;
    title: string;
    description: string;
    schema?: string;
    schema_url?: string;
    status?: string;
    slug: string;
    resource?: string;
    tags?: string[];
    location?: string;
}

export interface GlosarioTerm {
    frontmatter: GlosarioTermFrontmatter;
    slug: string;
    title: string;
    description: string;
    rawContent: string;
    bodyContent: string;
}

function getGlosarioDir(): string {
    const candidates = [
        path.join(process.cwd(), 'src/content/okf/legal/glosario'),
        path.join(process.cwd(), 'legal/glosario'),
        '/Users/domingoimperatori/Documents/OKF_AL/legal/glosario'
    ];

    for (const dir of candidates) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'index.md');
            if (files.length > 0) {
                return dir;
            }
        }
    }

    return candidates[0];
}

/**
 * Transforms internal OKF markdown link paths into valid site URLs.
 */
export function transformInternalLinks(content: string): string {
    return content
        // Coberturas: /servicios/cobertura/alcoholemia-abrera.md -> /alcoholemia/abrera
        .replace(/\/servicios\/cobertura\/(alcoholemia|drogas|sin-carnet|velocidad|profesionales)-([a-z0-9-]+)\.md/g, '/$1/$2')
        // General coberturas fallback
        .replace(/\/servicios\/cobertura\/([a-z0-9-]+)\.md/g, '/municipios')
        // Abogados
        .replace(/\/empresa\/abogados\/([a-z0-9-]+)\.md/g, '/abogados/$1')
        // Glosario terms
        .replace(/\/legal\/glosario\/([a-z0-9-]+)\.md/g, '/glosario/$1')
        // Servicios
        .replace(/\/servicios\/([a-z0-9-]+)\.md/g, '/$1')
        // Geografia
        .replace(/\/geografia\/([a-z0-9-/]+)\.md/g, '/municipios');
}

/**
 * Retrieves all glossary terms ordered alphabetically by title.
 */
export function getAllGlosarioTerms(): GlosarioTerm[] {
    const dir = getGlosarioDir();
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'index.md');

    const terms: GlosarioTerm[] = [];

    for (const file of files) {
        try {
            const fullPath = path.join(dir, file);
            const rawContent = fs.readFileSync(fullPath, 'utf-8');
            const { data, content } = matter(rawContent);

            const slug = data.slug || file.replace(/\.md$/, '');
            const title = data.title || slug.replace(/-/g, ' ');
            const description = data.description || '';

            terms.push({
                frontmatter: {
                    type: data.type,
                    title,
                    description,
                    schema: data.schema,
                    schema_url: data.schema_url,
                    status: data.status,
                    slug,
                    resource: data.resource,
                    tags: data.tags || [],
                    location: data.location,
                },
                slug,
                title,
                description,
                rawContent,
                bodyContent: content,
            });
        } catch (err) {
            console.error(`Error reading glosario file ${file}:`, err);
        }
    }

    return terms.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
}

/**
 * Gets a single glossary term by slug.
 */
export function getGlosarioTermBySlug(slug: string): GlosarioTerm | null {
    const normSlug = slug.toLowerCase().trim().replace(/\.md$/, '');
    const dir = getGlosarioDir();

    const candidateFiles = [
        path.join(dir, `${normSlug}.md`),
        path.join(dir, `${slug}.md`)
    ];

    let filePath: string | null = null;
    for (const c of candidateFiles) {
        if (fs.existsSync(c)) {
            filePath = c;
            break;
        }
    }

    if (!filePath) {
        const terms = getAllGlosarioTerms();
        const found = terms.find(t => t.slug.toLowerCase() === normSlug);
        return found || null;
    }

    try {
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(rawContent);

        const foundSlug = data.slug || normSlug;
        const title = data.title || foundSlug.replace(/-/g, ' ');
        const description = data.description || '';

        return {
            frontmatter: {
                type: data.type,
                title,
                description,
                schema: data.schema,
                schema_url: data.schema_url,
                status: data.status,
                slug: foundSlug,
                resource: data.resource,
                tags: data.tags || [],
                location: data.location,
            },
            slug: foundSlug,
            title,
            description,
            rawContent,
            bodyContent: content,
        };
    } catch (err) {
        console.error(`Error reading glosario term by slug ${slug}:`, err);
        return null;
    }
}
