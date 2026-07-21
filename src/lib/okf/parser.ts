export interface OKFCoberturaFrontmatter {
    type?: string;
    title?: string;
    description?: string;
    bd_id?: string;
    resource?: string;
    tags?: string[];
    timestamp?: string;
    slug: string;
    service: string;
    municipio: string;
    author?: string;
    is_published?: boolean | string;
    target_domain?: string;
    region?: string;
    province?: string;
}

export interface OKFFaq {
    question: string;
    answer: string;
}

export interface PuntoDeInteres {
    category: string;
    name: string;
    description: string;
    gps: string;
}

export interface OKFCobertura {
    frontmatter: OKFCoberturaFrontmatter;
    h1Title: string;
    bluf: string;
    faqs: OKFFaq[];
    content: string;
    rawContent: string;
}

/**
 * Parses simple YAML frontmatter from markdown string.
 */
export function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
    const match = raw.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content: raw };
    }

    const yamlStr = match[1];
    const content = match[2];
    const data: Record<string, any> = {};

    yamlStr.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) return;

        const key = trimmed.slice(0, colonIdx).trim();
        let val = trimmed.slice(colonIdx + 1).trim();

        // Handle string quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        } else if (val.startsWith('[') && val.endsWith(']')) {
            // Simple array parser
            const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
            data[key] = items;
            return;
        } else if (val === 'true') {
            data[key] = true;
            return;
        } else if (val === 'false') {
            data[key] = false;
            return;
        }

        data[key] = val;
    });

    return { data, content };
}

/**
 * Parses an OKF Cobertura markdown file.
 */
export function parseOKFCobertura(rawContent: string): OKFCobertura {
    const { data, content } = parseFrontmatter(rawContent);

    const frontmatter: OKFCoberturaFrontmatter = {
        slug: data.slug || '',
        service: data.service || '',
        municipio: data.municipio || '',
        title: data.title,
        description: data.description,
        bd_id: data.bd_id,
        resource: data.resource,
        tags: data.tags,
        timestamp: data.timestamp,
        author: data.author,
        is_published: data.is_published,
        target_domain: data.target_domain,
        region: data.region,
        province: data.province,
    };

    // Extract H1 title
    const h1Match = content.match(/^#\s+(.+)$/m);
    const h1Title = h1Match ? h1Match[1].trim() : frontmatter.title || '';

    // Extract BLUF section
    let bluf = '';
    const blufMatch = content.match(/##\s+Resumen\s+\(BLUF\)\r?\n([\s\S]*?)(?=\r?\n##\s+|$)/i);
    if (blufMatch) {
        bluf = blufMatch[1].trim().replace(/^["']|["']$/g, '');
    }

    // Extract FAQs
    const faqs: OKFFaq[] = [];
    const faqsSectionMatch = content.match(/##\s+Preguntas\s+frecuentes\r?\n([\s\S]*?)(?=\r?\n##\s+|$)/i);
    if (faqsSectionMatch) {
        const faqsText = faqsSectionMatch[1];
        const qMatches = faqsText.split(/(?=\r?\n###\s+)/);
        
        qMatches.forEach(block => {
            const trimmed = block.trim();
            if (!trimmed.startsWith('###')) return;

            const lines = trimmed.split(/\r?\n/);
            const question = lines[0].replace(/^###\s+/, '').trim();
            const answer = lines.slice(1).join('\n').trim();

            if (question && answer) {
                faqs.push({ question, answer });
            }
        });
    }

    return {
        frontmatter,
        h1Title,
        bluf,
        faqs,
        content,
        rawContent,
    };
}

/**
 * Parses Puntos de Interés from OKF Municipio markdown content.
 */
export function parsePuntosDeInteres(rawContent: string): PuntoDeInteres[] {
    const points: PuntoDeInteres[] = [];
    const sectionMatch = rawContent.match(/##\s+Puntos\s+de\s+interés\r?\n([\s\S]*?)(?=\r?\n<!--|\r?\n##\s+|$)/i);
    if (!sectionMatch) return points;

    const sectionText = sectionMatch[1];
    const subSections = sectionText.split(/(?=\r?\n###\s+)/);

    subSections.forEach(sub => {
        const trimmed = sub.trim();
        if (!trimmed.startsWith('###')) return;

        const lines = trimmed.split(/\r?\n/);
        const category = lines[0].replace(/^###\s+/, '').trim();

        lines.slice(1).forEach(line => {
            const row = line.trim();
            if (!row.startsWith('|')) return;

            // Skip table header and separator lines
            if (row.includes('---') || row.toLowerCase().includes('nombre')) {
                return;
            }

            const cells = row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            if (cells.length >= 2) {
                const name = cells[0] || '';
                const description = cells[1] || '';
                const gps = cells[2] || '';

                if (name && name !== 'Nombre') {
                    points.push({ category, name, description, gps });
                }
            }
        });
    });

    return points;
}
