/**
 * scripts/build-areaserved-data.ts
 *
 * Parses docs/areaserved-fuente.md (raw, irregular markdown) and generates
 * src/data/areaserved.json, matching every municipality of the source against
 * the `locations` table (by court_id of the partido).
 *
 * Matching order (never invents a match):
 *   a) normalized name (no accents, lowercase, no articles) — source name or Wikipedia title
 *   b) ca / es label (and aliases) of the source QID(s) in Wikidata
 *   c) otherwise → reported as unmatched
 *
 * DB municipalities with no source entry are emitted with status FALTA so that
 * scripts/verify-wikidata.ts can propose a QID via wbsearchentities.
 *
 * Usage: npx tsx scripts/build-areaserved-data.ts
 */
import fs from 'fs';
import path from 'path';
import {
    AreaServedData,
    CourtAreaServed,
    DATA_JSON,
    DbLocation,
    MunicipioEntry,
    PartidoEntry,
    SOURCE_MD,
    cleanGoogleMapsUrl,
    cleanJudicialDistrict,
    getEntity,
    getWikipediaInfo,
    loadDb,
    normalizeName,
    saveCache,
    wikipediaTitleFromUrl,
} from './lib/areaserved-shared';

// ---------------------------------------------------------------------------
// 1. Unescape + tokenize
// ---------------------------------------------------------------------------

export function unescapeMarkdown(raw: string): string {
    return raw
        .replace(/\r/g, '')
        .replace(/\\([\\_:!.\-\[\]()*&#+])/g, '$1')
        .replace(/[“”]/g, '"')
        .replace(/\u00a0/g, ' ');
}

type Token =
    | { kind: 'partidoWiki'; url: string }
    | { kind: 'wiki'; url: string; text: string | null }
    | { kind: 'qid'; raw: string }
    | { kind: 'maps'; url: string }
    | { kind: 'name'; text: string };

const MD_LINK = /\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
const RAW_URL = /https?:\/\/[^\s<>"\]]+/g;

function trimUrl(url: string): string {
    let u = url.replace(/[*,.;]+$/, '');
    // drop an unbalanced trailing ')'
    while (u.endsWith(')') && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length) u = u.slice(0, -1);
    return u;
}

function cleanNameText(text: string): string {
    return text
        .replace(/\*+/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\[[^\]]*\]?/g, '')
        .replace(/^[\s\-•·]+/, '')
        .replace(/[\s:,.;]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function isNameCandidate(text: string): boolean {
    if (!text || text.length > 60 || /\d/.test(text)) return false;
    if (/poblaciones|maps|adress|globalLocationNumber|direcci[oó]n|servicio|sede|partido/i.test(text)) return false;
    return /[A-Za-zÀ-ÿ]/.test(text);
}

function classifyUrl(url: string, linkText: string | null): Token | null {
    if (/#cite_note/.test(url)) return null;
    const qid = url.match(/wikidata\.org\/wiki\/(Q[^\s)\]/?#]*)/);
    if (qid) return { kind: 'qid', raw: qid[1] };
    if (/google\.[a-z.]+\/maps/.test(url)) return { kind: 'maps', url };
    if (/^https?:\/\/es\.wikipedia\.org\/wiki\//.test(url)) {
        if (/\/wiki\/(Partido_judicial|Anexo:)/.test(url)) return { kind: 'partidoWiki', url };
        return { kind: 'wiki', url, text: linkText };
    }
    return null;
}

function tokenizeLine(line: string, allowNames: boolean): Token[] {
    const found: { index: number; end: number; token: Token | null; isMd: boolean }[] = [];
    for (const m of line.matchAll(MD_LINK)) {
        const url = trimUrl(m[2]);
        const text = cleanNameText(m[1]);
        let token = classifyUrl(url, text || null);
        // "[Q12083](https://www.wikidata.org/wiki/Q12083)" → just a QID
        found.push({ index: m.index!, end: m.index! + m[0].length, token, isMd: true });
    }
    for (const m of line.matchAll(RAW_URL)) {
        const inside = found.some(f => m.index! >= f.index && m.index! < f.end);
        if (inside) continue;
        found.push({ index: m.index!, end: m.index! + m[0].length, token: classifyUrl(trimUrl(m[0]), null), isMd: false });
    }
    found.sort((a, b) => a.index - b.index);

    const tokens: Token[] = [];
    const hasMdWiki = found.some(f => f.isMd && f.token?.kind === 'wiki');
    if (allowNames && !hasMdWiki) {
        const firstIdx = found.length ? found[0].index : line.length;
        const text = cleanNameText(line.slice(0, firstIdx));
        if (isNameCandidate(text)) tokens.push({ kind: 'name', text });
    }
    for (const f of found) if (f.token) tokens.push(f.token);
    return tokens;
}

// ---------------------------------------------------------------------------
// 2. Sections
// ---------------------------------------------------------------------------

interface RawEntry {
    name: string;
    wikipedia: string | null;
    qids: string[];
}

interface RawSection {
    heading: string;
    name: string;
    partidoWiki: string | null;
    partidoQid: string | null;
    mapsUrl: string | null;
    plusCodes: { code: string; locality: string }[];
    address: string | null;
    entries: RawEntry[];
    orphanQids: string[];
}

const HEADING = /^\s*(\d{1,2})\.\s*(.+?)\s*$/;

function headingName(line: string): string | null {
    const m = line.match(HEADING);
    if (!m) return null;
    const rest = m[2].replace(/^PARTIDO JUDICIAL( DE)?\s+/i, '').trim();
    if (rest.includes('*') || /[a-zà-ÿ]/.test(rest)) return null;
    return rest;
}

function extractAddress(lines: string[]): string | null {
    for (const l of lines) {
        if (/poblaciones/i.test(l)) break;
        const withText = l.replace(MD_LINK, '$1');
        if (/\b08\d{3}\b/.test(withText) || /Direcci[oó]n:/.test(withText)) {
            return withText
                .replace(/\*+/g, '')
                .replace(/^\s*(?:Adress|ADRESS|ADRESSES|Direcci[oó]n|SERVICIO DE GUARDIA|SEDE PRINCIPAL Y SERVICIO DE GUARDIA)\s*:\s*/i, '')
                .replace(/^\s*Direcci[oó]n:\s*/i, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
    }
    return null;
}

export function parseSource(md: string): { sections: RawSection[]; preamble: string } {
    const lines = unescapeMarkdown(md).split('\n');
    const starts: number[] = [];
    lines.forEach((l, i) => {
        if (headingName(l)) starts.push(i);
    });
    const preamble = lines.slice(0, starts[0] ?? lines.length).join('\n');

    const sections: RawSection[] = [];
    starts.forEach((start, si) => {
        const end = starts[si + 1] ?? lines.length;
        const body = lines.slice(start + 1, end);
        const sec: RawSection = {
            heading: lines[start].trim(),
            name: headingName(lines[start])!,
            partidoWiki: null,
            partidoQid: null,
            mapsUrl: null,
            plusCodes: [],
            address: extractAddress(body),
            entries: [],
            orphanQids: [],
        };

        let inMunicipios = false;
        for (const line of body) {
            if (/poblaciones/i.test(line)) {
                inMunicipios = true;
                continue;
            }
            if (/globalLocationNumber/i.test(line)) {
                for (const m of line.matchAll(/([23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3})\s+([^,"\n]+?)(?=,|\s+España|"|$)/gi)) {
                    sec.plusCodes.push({ code: m[1].toUpperCase(), locality: m[2].trim() });
                }
                continue;
            }
            const current = () => sec.entries[sec.entries.length - 1];
            for (const t of tokenizeLine(line, inMunicipios)) {
                switch (t.kind) {
                    case 'partidoWiki':
                        if (!sec.partidoWiki) sec.partidoWiki = t.url;
                        break;
                    case 'maps':
                        if (!sec.mapsUrl) sec.mapsUrl = t.url;
                        break;
                    case 'name':
                        sec.entries.push({ name: t.text, wikipedia: null, qids: [] });
                        break;
                    case 'wiki': {
                        const cur = current();
                        if (cur && cur.wikipedia === t.url) break; // duplicated raw URL after a md link
                        if (!t.text && cur && !cur.wikipedia && cur.qids.length === 0) {
                            cur.wikipedia = t.url;
                            break;
                        }
                        const title = wikipediaTitleFromUrl(t.url)?.title || t.url;
                        sec.entries.push({ name: t.text || title, wikipedia: t.url, qids: [] });
                        break;
                    }
                    case 'qid': {
                        const cur = current();
                        if (!cur && !inMunicipios && !sec.partidoQid) sec.partidoQid = t.raw;
                        else if (cur) cur.qids.push(t.raw);
                        else sec.orphanQids.push(t.raw);
                        break;
                    }
                }
            }
        }
        sections.push(sec);
    });
    return { sections, preamble };
}

// ---------------------------------------------------------------------------
// 3. Build JSON
// ---------------------------------------------------------------------------

async function entityNames(qids: string[]): Promise<string[]> {
    const out: string[] = [];
    for (const raw of qids) {
        const q = raw.match(/^Q\d+/)?.[0];
        if (!q) continue;
        const e = await getEntity(q);
        if (!e || e.missing) continue;
        for (const n of [e.labels.ca, e.labels.es, ...e.aliases]) if (n) out.push(n);
    }
    return out;
}

async function main() {
    const md = fs.readFileSync(SOURCE_MD, 'utf8');
    const { sections } = parseSource(md);
    const { courts, locations } = await loadDb();

    let previous: AreaServedData = {};
    try {
        previous = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'));
    } catch {
        /* first run */
    }

    const sectionByCourt = new Map<string, RawSection>();
    const unknownSections: string[] = [];
    for (const sec of sections) {
        const n = normalizeName(sec.name);
        const court = courts.find(c => {
            const d = normalizeName(cleanJudicialDistrict(c.judicial_district || c.name));
            return d === n || d.startsWith(n + ' ') || n.startsWith(d + ' ');
        });
        if (!court) unknownSections.push(sec.heading);
        else if (sectionByCourt.has(court.slug)) unknownSections.push(`${sec.heading} (duplicado de ${court.slug})`);
        else sectionByCourt.set(court.slug, sec);
    }

    const result: AreaServedData = {};
    const log: string[] = [];

    for (const court of courts) {
        const district = cleanJudicialDistrict(court.judicial_district || court.name);
        const sec = sectionByCourt.get(court.slug);
        const dbLocs: DbLocation[] = locations
            .filter(l => l.court_id === court.id)
            .sort((a, b) => a.name.localeCompare(b.name, 'ca'));

        // --- partido -------------------------------------------------------
        const partidoNotes: string[] = [];
        let plusCode: string | null = null;
        if (sec?.plusCodes.length) {
            const nd = normalizeName(district);
            const matching = sec.plusCodes.filter(p => normalizeName(p.locality) === nd);
            const chosen = matching[0] || sec.plusCodes[0];
            if (sec.plusCodes.length > 1) {
                partidoNotes.push(
                    `La fuente trae ${sec.plusCodes.length} Plus Codes (${sec.plusCodes.map(p => `${p.code} ${p.locality}`).join(' / ')}); se elige ${chosen.code} por localidad.`
                );
            }
            if (normalizeName(chosen.locality) !== nd) {
                partidoNotes.push(`Localidad del Plus Code en la fuente = "${chosen.locality}"; se corrige a "${district}".`);
            }
            plusCode = `${chosen.code} ${district}`;
        }
        const maps = cleanGoogleMapsUrl(sec?.mapsUrl);
        if (sec?.mapsUrl && maps.method === 'cid') partidoNotes.push(`Maps: URL reconstruida desde el CID ${maps.cid} (sin tracking).`);
        if (sec?.address && /\b08\d{3}\s+Barcelona\b/.test(sec.address) && court.slug !== 'barcelona') {
            partidoNotes.push(`Dirección de la fuente con localidad errónea ("${sec.address}"). No se publica: manda courts.address.`);
        }
        if (!sec) partidoNotes.push('Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.');
        if (sec && !sec.partidoQid) partidoNotes.push('La fuente no trae el QID del partido judicial.');
        if (sec && !sec.partidoWiki) partidoNotes.push('La fuente no trae la Wikipedia del partido judicial.');

        const prevPartido = previous[court.slug]?.partido;
        const partido: PartidoEntry = {
            nameSource: sec?.name ?? null,
            qid: sec?.partidoQid ?? null,
            wikipedia: sec?.partidoWiki ?? null,
            mapsUrl: maps.cleanUrl,
            plusCode,
            address: sec?.address ?? null,
            source: sec ? 'fuente' : 'db',
            status: sec?.partidoQid ? 'PENDIENTE' : 'FALTA',
            notes: partidoNotes,
            ...(prevPartido?.approved ? { approved: true } : {}),
        };

        // --- municipios ----------------------------------------------------
        const matched = new Map<string, MunicipioEntry>();
        const unmatchedSource: { nameSource: string; qids: string[]; wikipedia: string | null; reason: string }[] = [];

        // Single-municipality court special case: if source has 0 entries (e.g. Barcelona),
        // synthesize an entry from the court section if available.
        const sourceEntries = [...(sec?.entries || [])];
        if (dbLocs.length === 1 && sourceEntries.length === 0 && sec) {
            sourceEntries.push({
                name: sec.name,
                wikipedia: sec.partidoWiki,
                qids: sec.partidoQid ? [sec.partidoQid] : [],
            });
        }

        for (const e of sourceEntries) {
            // If entry has Wikipedia URL but no QID, resolve wikibaseItem from Wikipedia
            if (e.wikipedia && e.qids.length === 0) {
                const wInfo = await getWikipediaInfo(e.wikipedia);
                if (wInfo?.wikibaseItem) {
                    e.qids.push(wInfo.wikibaseItem);
                }
            }

            const candidatesA = [
                e.name,
                e.wikipedia ? wikipediaTitleFromUrl(e.wikipedia)?.title : null,
            ].map(normalizeName).filter(Boolean);

            let loc = dbLocs.find(l => {
                const nNorm = normalizeName(l.name);
                const sNorm = normalizeName(l.slug);
                return candidatesA.some(c => c === nNorm || c === sNorm);
            });
            let method: MunicipioEntry['matchMethod'] = loc ? 'nombre' : null;

            if (!loc) {
                const names = (await entityNames(e.qids)).map(normalizeName);
                loc = dbLocs.find(l => {
                    const nNorm = normalizeName(l.name);
                    const sNorm = normalizeName(l.slug);
                    return names.some(n => n === nNorm || n === sNorm);
                });
                if (loc) method = 'wikidata-label';
            }

            // Fallback for special historical transliterations:
            // e.g. "Lliçà d'Amunt" (eswiki Llissá de Munt) <-> "Lliçà de Munt" (llissa-de-munt)
            if (!loc && e.name.toLowerCase().includes('lliçà') && e.name.toLowerCase().includes('amunt')) {
                loc = dbLocs.find(l => l.slug === 'llissa-de-munt');
                if (loc) method = 'nombre';
            }

            if (!loc) {
                unmatchedSource.push({ nameSource: e.name, qids: e.qids, wikipedia: e.wikipedia, reason: 'Sin coincidencia por nombre ni por etiqueta Wikidata' });
                continue;
            }
            if (matched.has(loc.slug)) {
                unmatchedSource.push({ nameSource: e.name, qids: e.qids, wikipedia: e.wikipedia, reason: `Duplicado: ${loc.slug} ya emparejado con "${matched.get(loc.slug)!.nameSource}"` });
                continue;
            }
            const notes: string[] = [];
            if (e.qids.length > 1) notes.push(`La fuente trae ${e.qids.length} QIDs: ${e.qids.join(', ')}.`);
            if (e.qids.length === 0) notes.push('La fuente no trae QID.');
            if (!e.wikipedia) notes.push('La fuente no trae Wikipedia.');
            for (const q of e.qids) if (!/^Q\d+$/.test(q)) notes.push(`QID con caracteres no válidos en la fuente: "${q}".`);
            const prev = previous[court.slug]?.municipios.find(m => m.locationSlug === loc!.slug);
            matched.set(loc.slug, {
                locationSlug: loc.slug,
                locationName: loc.name,
                nameSource: e.name,
                qid: e.qids[0] ?? null,
                wikipedia: e.wikipedia,
                matchMethod: method,
                source: 'fuente',
                status: e.qids.length ? 'PENDIENTE' : 'FALTA',
                notes,
                ...(e.qids.length > 1 ? { qidCandidates: e.qids } : {}),
                ...(prev?.approved ? { approved: true } : {}),
            } as MunicipioEntry);
        }

        const municipios: MunicipioEntry[] = dbLocs.map(l => {
            const m = matched.get(l.slug);
            if (m) return m;
            const prev = previous[court.slug]?.municipios.find(x => x.locationSlug === l.slug);
            return {
                locationSlug: l.slug,
                locationName: l.name,
                nameSource: null,
                qid: null,
                wikipedia: null,
                matchMethod: null,
                source: 'db',
                status: 'FALTA',
                notes: [sec ? 'Municipio de la BD sin entrada en la fuente.' : 'Partido ausente en la fuente.'],
                ...(prev?.approved ? { approved: true } : {}),
            };
        });

        const entry: CourtAreaServed = {
            judicialDistrict: district,
            partido,
            municipios,
            unmatchedSource,
            orphanQids: sec?.orphanQids || [],
        };
        result[court.slug] = entry;

        log.push(
            `${court.slug.padEnd(26)} fuente=${sec ? 'sí' : 'NO'}  municipios BD=${dbLocs.length}  fuente=${sec?.entries.length ?? 0}  emparejados=${matched.size}  sin emparejar=${unmatchedSource.length}`
        );
    }

    saveCache();
    fs.mkdirSync(path.dirname(DATA_JSON), { recursive: true });
    fs.writeFileSync(DATA_JSON, JSON.stringify(result, null, 2) + '\n');

    console.log(log.join('\n'));
    if (unknownSections.length) console.log('\nSecciones de la fuente sin partido en BD:', unknownSections);
    console.log(`\n→ ${path.relative(process.cwd(), DATA_JSON)}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
