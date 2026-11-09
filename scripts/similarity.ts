/**
 * scripts/similarity.ts
 * Computes 5-gram word Jaccard similarity between all 25 judicial district pages (/juzgados/[slug]).
 * Extracts main content (excluding nav, header, footer, scripts, styles).
 */

const DISTRICT_SLUGS = [
    'arenys-de-mar',
    'badalona',
    'barcelona',
    'berga',
    'cerdanyola-del-valles',
    'cornella-de-llobregat',
    'el-prat-de-llobregat',
    'esplugues-de-llobregat',
    'gava',
    'granollers',
    'hospitalet-de-llobregat',
    'igualada',
    'manresa',
    'martorell',
    'mataro',
    'mollet-del-valles',
    'rubi',
    'sabadell',
    'sant-boi-de-llobregat',
    'sant-feliu-de-llobregat',
    'santa-coloma-de-gramenet',
    'terrassa',
    'vic',
    'vilafranca-del-penedes',
    'vilanova-i-la-geltru',
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function extractMainText(html: string): string {
    // 1. Remove script, style, svg tags
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    cleaned = cleaned.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

    // 2. Remove header, nav, footer tags and their content
    cleaned = cleaned.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ');
    cleaned = cleaned.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
    cleaned = cleaned.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');

    // 3. Strip remaining HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, ' ');

    // 4. Decode common HTML entities
    cleaned = cleaned
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');

    return cleaned;
}

function tokenizeWords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 0);
}

function get5Grams(tokens: string[]): Set<string> {
    const ngrams = new Set<string>();
    for (let i = 0; i <= tokens.length - 5; i++) {
        ngrams.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]} ${tokens[i + 3]} ${tokens[i + 4]}`);
    }
    return ngrams;
}

function computeJaccard(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 && setB.size === 0) return 1;
    if (setA.size === 0 || setB.size === 0) return 0;

    let intersectionCount = 0;
    const [smaller, larger] = setA.size < setB.size ? [setA, setB] : [setB, setA];

    for (const item of smaller) {
        if (larger.has(item)) {
            intersectionCount++;
        }
    }

    const unionCount = setA.size + setB.size - intersectionCount;
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

async function run() {
    console.log(`Fetching ${DISTRICT_SLUGS.length} district pages from ${BASE_URL}...`);

    const pageNgrams = new Map<string, { tokenCount: number; ngrams: Set<string> }>();

    for (const slug of DISTRICT_SLUGS) {
        const url = `${BASE_URL}/juzgados/${slug}`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Failed to fetch ${url}: HTTP ${res.status}`);
                continue;
            }
            const html = await res.text();
            const mainText = extractMainText(html);
            const tokens = tokenizeWords(mainText);
            const ngrams = get5Grams(tokens);
            pageNgrams.set(slug, { tokenCount: tokens.length, ngrams });
        } catch (err: any) {
            console.error(`Error fetching ${url}: ${err.message}`);
        }
    }

    console.log(`Successfully fetched and parsed ${pageNgrams.size} pages.\n`);

    // Calculate pairwise similarities
    interface PairResult {
        pair: string;
        sim: number;
        wordsA: number;
        wordsB: number;
    }
    const results: PairResult[] = [];

    const slugs = Array.from(pageNgrams.keys());
    for (let i = 0; i < slugs.length; i++) {
        for (let j = i + 1; j < slugs.length; j++) {
            const slugA = slugs[i];
            const slugB = slugs[j];
            const dataA = pageNgrams.get(slugA)!;
            const dataB = pageNgrams.get(slugB)!;

            const sim = computeJaccard(dataA.ngrams, dataB.ngrams);
            results.push({
                pair: `${slugA} <-> ${slugB}`,
                sim,
                wordsA: dataA.tokenCount,
                wordsB: dataB.tokenCount,
            });
        }
    }

    // Sort descending by similarity
    results.sort((a, b) => b.sim - a.sim);

    // Summary statistics
    const similarities = results.map(r => r.sim);
    const avg = similarities.reduce((acc, v) => acc + v, 0) / similarities.length;
    const max = Math.max(...similarities);
    const min = Math.min(...similarities);

    console.log(`=== ESTADÍSTICAS DE SIMILITUD (Jaccard 5-gramas) ===`);
    console.log(`Total de pares comparados: ${results.length}`);
    console.log(`Máxima similitud: ${(max * 100).toFixed(2)}%`);
    console.log(`Mínima similitud: ${(min * 100).toFixed(2)}%`);
    console.log(`Similitud media:  ${(avg * 100).toFixed(2)}%`);
    console.log(`Pares con similitud > 25%: ${results.filter(r => r.sim > 0.25).length} / ${results.length}\n`);

    console.log(`| Par de partidos judiciales | Similitud Jaccard (5-gramas) | Palabras A | Palabras B |`);
    console.log(`|---|---|---|---|`);
    // Print all or top 40 pairs
    for (const r of results) {
        console.log(`| ${r.pair} | ${(r.sim * 100).toFixed(2)}% | ${r.wordsA} | ${r.wordsB} |`);
    }
}

run().catch(console.error);
