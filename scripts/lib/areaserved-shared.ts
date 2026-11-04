/**
 * Shared helpers for the areaServed pipeline:
 *   scripts/build-areaserved-data.ts  → src/data/areaserved.json
 *   scripts/verify-wikidata.ts        → scripts/output/areaserved-report.md (+ status in the JSON)
 *   scripts/seed-areaserved.ts        → Supabase (courts / locations)
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local', quiet: true } as any);

export const ROOT = process.cwd();
export const SOURCE_MD = path.join(ROOT, 'docs/areaserved-fuente.md');
export const DATA_JSON = path.join(ROOT, 'src/data/areaserved.json');
export const OUTPUT_DIR = path.join(ROOT, 'scripts/output');
export const REPORT_MD = path.join(OUTPUT_DIR, 'areaserved-report.md');
export const CACHE_JSON = path.join(OUTPUT_DIR, '.wikidata-cache.json');

export const USER_AGENT = 'AutoridadLegal-areaServed/1.0 (https://www.autoridad.legal; contacto@autoridad.legal)';

export const QID_PROVINCIA_BARCELONA = 'Q81949';
export const QID_MUNICIPIO_ESPANA = 'Q2074737';
export const QID_MUNICIPIO_CATALUNA = 'Q33146843';
export const QID_PARTIDO_JUDICIAL = 'Q6018869';

// ---------------------------------------------------------------------------
// Types of src/data/areaserved.json
// ---------------------------------------------------------------------------

export type RowStatus = 'OK' | 'CORREGIDO-PROPUESTO' | 'FALTA' | 'PENDIENTE';
export type DataSource = 'fuente' | 'wikidata-search' | 'wikidata-sitelink' | 'db';

export interface PartidoEntry {
    nameSource: string | null;
    qid: string | null;
    wikipedia: string | null;
    mapsUrl: string | null;
    plusCode: string | null;
    address: string | null;
    source: DataSource;
    status: RowStatus;
    /** Filled by verify-wikidata.ts when the source value is wrong or missing */
    proposedQid?: string | null;
    proposedWikipedia?: string | null;
    /** Set to true by a human to accept proposed* values in the seed */
    approved?: boolean;
    notes: string[];
}

export interface MunicipioEntry {
    locationSlug: string | null;
    locationName: string | null;
    nameSource: string | null;
    qid: string | null;
    wikipedia: string | null;
    matchMethod: 'nombre' | 'wikidata-label' | 'wikidata-search' | null;
    /** All raw QIDs found in the source for this municipality (when more than one) */
    qidCandidates?: string[];
    source: DataSource;
    status: RowStatus;
    proposedQid?: string | null;
    proposedWikipedia?: string | null;
    approved?: boolean;
    notes: string[];
}

export interface CourtAreaServed {
    judicialDistrict: string;
    partido: PartidoEntry;
    municipios: MunicipioEntry[];
    /** Source entries that could not be matched to a DB location (never auto-assigned) */
    unmatchedSource: { nameSource: string; qids: string[]; wikipedia: string | null; reason: string }[];
    /** QIDs found in the municipality block with no municipality to attach to */
    orphanQids: string[];
}

export type AreaServedData = Record<string, CourtAreaServed>;

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------

export function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
    return createClient(url, key);
}

export interface DbCourt {
    id: string;
    slug: string;
    judicial_district: string | null;
    name: string;
    address: string | null;
    gps_coords: string | null;
}
export interface DbLocation {
    id: string;
    name: string;
    slug: string;
    court_id: string | null;
}

export async function loadDb(): Promise<{ courts: DbCourt[]; locations: DbLocation[] }> {
    const supabase = getSupabase();
    const [{ data: courts, error: e1 }, { data: locations, error: e2 }] = await Promise.all([
        supabase.from('courts').select('id, slug, judicial_district, name, address, gps_coords').order('slug'),
        supabase
            .from('locations')
            .select('id, name, slug, court_id')
            .eq('location_type', 'municipio')
            .neq('slug', 'bellaterra-uab'),
    ]);
    if (e1 || e2 || !courts || !locations) throw e1 || e2 || new Error('Empty DB response');
    return { courts: courts as DbCourt[], locations: locations as DbLocation[] };
}

// ---------------------------------------------------------------------------
// Text normalization
// ---------------------------------------------------------------------------

/** lowercase, no accents, no punctuation, no leading articles, no "(barcelona)" */
export function normalizeName(raw: string | null | undefined): string {
    let s = (raw || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\(.*?\)/g, ' ')
        .replace(/[’'`´]/g, ' ')
        .replace(/ç/g, 'c')
        .replace(/ss/g, 's')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/[-·]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    s = s.replace(/^(el|la|les|l|els|los|las|lo)\s+/, '');
    // normalize prepositions like " d ", " de ", " del ", " dels ", " de la "
    s = s.replace(/\b(de\s+la|dels|del|de|d)\b/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

export function cleanJudicialDistrict(raw: string | null | undefined): string {
    return (raw || '')
        .replace(/^(Partido Judicial de|Juzgados de Primera Instancia e Instrucción de|Juzgados de Instrucción de|Juzgados de)\s+/i, '')
        .trim();
}

// ---------------------------------------------------------------------------
// HTTP with cache + soft rate limit
// ---------------------------------------------------------------------------

type Cache = Record<string, any>;
let cache: Cache | null = null;

function loadCache(): Cache {
    if (cache) return cache;
    try {
        cache = JSON.parse(fs.readFileSync(CACHE_JSON, 'utf8'));
    } catch {
        cache = {};
    }
    return cache!;
}

export function saveCache() {
    if (!cache) return;
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(CACHE_JSON, JSON.stringify(cache));
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
let lastRequest = 0;
const MIN_INTERVAL_MS = 200;

async function politeFetch(url: string, init: RequestInit = {}): Promise<Response> {
    const wait = lastRequest + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    for (let attempt = 0; attempt < 4; attempt++) {
        const res = await fetch(url, {
            ...init,
            headers: { 'User-Agent': USER_AGENT, Accept: 'application/json', ...(init.headers || {}) },
        });
        if (res.status !== 429 && res.status < 500) return res;
        await sleep(1500 * (attempt + 1));
    }
    return fetch(url, { ...init, headers: { 'User-Agent': USER_AGENT, ...(init.headers || {}) } });
}

export async function cachedJson(key: string, url: string): Promise<any | null> {
    const c = loadCache();
    if (key in c) return c[key];
    const res = await politeFetch(url);
    const value = res.ok ? await res.json() : null;
    c[key] = value;
    return value;
}

// ---------------------------------------------------------------------------
// Wikidata
// ---------------------------------------------------------------------------

export interface WdEntity {
    id: string;
    labels: { ca?: string; es?: string; en?: string };
    aliases: string[];
    p31: string[];
    p131: string[];
    eswiki: string | null;
    cawiki: string | null;
    missing: boolean;
    redirectedTo?: string;
}

export async function getEntity(qid: string): Promise<WdEntity | null> {
    if (!/^Q\d+$/.test(qid)) return null;
    const json = await cachedJson(`entity:${qid}`, `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    if (!json || !json.entities) return { id: qid, labels: {}, aliases: [], p31: [], p131: [], eswiki: null, cawiki: null, missing: true };
    const key = Object.keys(json.entities)[0];
    const e = json.entities[key];
    if (!e || 'missing' in e) return { id: qid, labels: {}, aliases: [], p31: [], p131: [], eswiki: null, cawiki: null, missing: true };
    const claimIds = (p: string): string[] =>
        (e.claims?.[p] || [])
            .filter((c: any) => c.rank !== 'deprecated')
            .map((c: any) => c.mainsnak?.datavalue?.value?.id)
            .filter(Boolean);
    const aliases: string[] = [];
    for (const lang of ['ca', 'es']) for (const a of e.aliases?.[lang] || []) aliases.push(a.value);
    return {
        id: e.id,
        labels: { ca: e.labels?.ca?.value, es: e.labels?.es?.value, en: e.labels?.en?.value },
        aliases,
        p31: claimIds('P31'),
        p131: claimIds('P131'),
        eswiki: e.sitelinks?.eswiki?.title ?? null,
        cawiki: e.sitelinks?.cawiki?.title ?? null,
        missing: false,
        redirectedTo: e.id !== qid ? e.id : undefined,
    };
}

/** BFS over P131 (located in the administrative territorial entity) */
export async function isInsideProvince(qid: string, target = QID_PROVINCIA_BARCELONA, maxDepth = 5): Promise<boolean> {
    let frontier = [qid];
    const seen = new Set<string>(frontier);
    for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
        const next: string[] = [];
        for (const q of frontier) {
            const ent = await getEntity(q);
            for (const parent of ent?.p131 || []) {
                if (parent === target) return true;
                if (!seen.has(parent)) {
                    seen.add(parent);
                    next.push(parent);
                }
            }
        }
        frontier = next;
    }
    return false;
}

export async function searchEntities(term: string, language: 'ca' | 'es'): Promise<{ id: string; label: string; description?: string }[]> {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&type=item&limit=10&language=${language}&uselang=${language}&search=${encodeURIComponent(term)}`;
    const json = await cachedJson(`search:${language}:${term}`, url);
    return (json?.search || []).map((s: any) => ({ id: s.id, label: s.label, description: s.description }));
}

export function wikidataUrl(qid: string) {
    return `https://www.wikidata.org/wiki/${qid}`;
}

export function eswikiUrl(title: string) {
    return `https://es.wikipedia.org/wiki/${encodeURI(title.replace(/ /g, '_'))}`;
}

// ---------------------------------------------------------------------------
// Wikipedia
// ---------------------------------------------------------------------------

export function wikipediaTitleFromUrl(url: string): { lang: string; title: string } | null {
    const m = url.match(/^https?:\/\/([a-z-]+)\.wikipedia\.org\/wiki\/(.+)$/);
    if (!m) return null;
    let title = m[2];
    try {
        title = decodeURIComponent(title);
    } catch {
        /* keep raw */
    }
    return { lang: m[1], title: title.replace(/_/g, ' ') };
}

export interface WikiPageInfo {
    httpStatus: number;
    exists: boolean;
    resolvedTitle: string | null;
    redirected: boolean;
    disambiguation: boolean;
    wikibaseItem: string | null;
}

export async function getWikipediaInfo(url: string): Promise<WikiPageInfo | null> {
    const t = wikipediaTitleFromUrl(url);
    if (!t) return null;
    const c = loadCache();
    const key = `wiki:${url}`;
    if (key in c) return c[key];

    // 1) literal HTTP status of the published URL (following redirects)
    const head = await politeFetch(url, { method: 'GET', redirect: 'follow', headers: { Accept: 'text/html' } });
    const httpStatus = head.status;

    // 2) page props via API: redirects, disambiguation, linked Wikidata item
    const api = `https://${t.lang}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=disambiguation|wikibase_item&titles=${encodeURIComponent(t.title)}`;
    const res = await politeFetch(api);
    const json = res.ok ? await res.json() : null;
    const pages = json?.query?.pages || {};
    const page: any = Object.values(pages)[0] || {};
    const info: WikiPageInfo = {
        httpStatus,
        exists: !('missing' in page) && !('invalid' in page),
        resolvedTitle: page.title ?? null,
        redirected: Boolean(json?.query?.redirects?.length || json?.query?.normalized?.length) && page.title !== t.title,
        disambiguation: Boolean(page.pageprops && 'disambiguation' in page.pageprops),
        wikibaseItem: page.pageprops?.wikibase_item ?? null,
    };
    c[key] = info;
    return info;
}

// ---------------------------------------------------------------------------
// Geo helpers: EWKB point (PostGIS) and Open Location Code (Plus Codes)
// ---------------------------------------------------------------------------

export function parseEwkbPoint(hex: string | null | undefined): { lat: number; lng: number } | null {
    if (!hex || !/^[0-9A-Fa-f]+$/.test(hex)) return null;
    const buf = Buffer.from(hex, 'hex');
    const le = buf[0] === 1;
    const type = le ? buf.readUInt32LE(1) : buf.readUInt32BE(1);
    let offset = 5;
    if (type & 0x20000000) offset += 4; // SRID present
    const x = le ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
    const y = le ? buf.readDoubleLE(offset + 8) : buf.readDoubleBE(offset + 8);
    return { lat: y, lng: x };
}

const OLC_ALPHABET = '23456789CFGHJMPQRVWX';
const PAIR_RES = [20, 1, 0.05, 0.0025, 0.000125];

function olcEncodePrefix(lat: number, lng: number, length: number): string {
    let la = Math.min(Math.max(lat, -90), 90) + 90;
    let lo = ((((lng + 180) % 360) + 360) % 360);
    let out = '';
    for (let i = 0; i < length / 2; i++) {
        const r = PAIR_RES[i];
        const dLa = Math.floor(la / r);
        const dLo = Math.floor(lo / r);
        la -= dLa * r;
        lo -= dLo * r;
        out += OLC_ALPHABET[dLa] + OLC_ALPHABET[dLo];
    }
    return out;
}

function olcDecodeCenter(full: string): { lat: number; lng: number } | null {
    const code = full.replace('+', '').toUpperCase();
    if (code.length < 8) return null;
    let lat = -90;
    let lng = -180;
    let latRes = 20;
    let lngRes = 20;
    for (let i = 0; i < Math.min(code.length, 10); i += 2) {
        const r = PAIR_RES[i / 2];
        const a = OLC_ALPHABET.indexOf(code[i]);
        const b = OLC_ALPHABET.indexOf(code[i + 1]);
        if (a < 0 || b < 0) return null;
        lat += a * r;
        lng += b * r;
        latRes = r;
        lngRes = r;
    }
    if (code.length > 10) {
        const g = OLC_ALPHABET.indexOf(code[10]);
        if (g < 0) return null;
        latRes = 0.000125 / 5;
        lngRes = 0.000125 / 4;
        lat += Math.floor(g / 4) * latRes;
        lng += (g % 4) * lngRes;
    }
    return { lat: lat + latRes / 2, lng: lng + lngRes / 2 };
}

/** Recover a short Plus Code (e.g. "FWHC+2W") using a reference point and return its center. */
export function decodePlusCode(shortOrFull: string, ref: { lat: number; lng: number }): { lat: number; lng: number } | null {
    const code = shortOrFull.trim().toUpperCase();
    const plus = code.indexOf('+');
    if (plus < 0) return null;
    if (plus >= 8) return olcDecodeCenter(code);
    const padding = 8 - plus;
    const resolution = Math.pow(20, 2 - padding / 2);
    const half = resolution / 2;
    const full = olcEncodePrefix(ref.lat, ref.lng, padding) + code;
    const c = olcDecodeCenter(full);
    if (!c) return null;
    if (ref.lat + half < c.lat && c.lat - resolution >= -90) c.lat -= resolution;
    else if (ref.lat - half > c.lat && c.lat + resolution <= 90) c.lat += resolution;
    if (ref.lng + half < c.lng) c.lng -= resolution;
    else if (ref.lng - half > c.lng) c.lng += resolution;
    return c;
}

export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// ---------------------------------------------------------------------------
// Google Maps URL cleaning
// ---------------------------------------------------------------------------

export interface CleanMaps {
    cleanUrl: string | null;
    cid: string | null;
    placeCoords: { lat: number; lng: number } | null;
    method: 'cid' | 'stripped' | null;
}

/**
 * Builds a stable Maps URL from the CID embedded in a "place" URL
 * (data=...!1s0x<feature>:0x<cid>...). Falls back to the URL without tracking params.
 */
export function cleanGoogleMapsUrl(raw: string | null | undefined): CleanMaps {
    if (!raw) return { cleanUrl: null, cid: null, placeCoords: null, method: null };
    const fid = raw.match(/!1s0x[0-9a-f]+:0x([0-9a-f]+)/i);
    const lat = raw.match(/!3d(-?\d+\.\d+)/);
    const lng = raw.match(/!4d(-?\d+\.\d+)/);
    const placeCoords = lat && lng ? { lat: parseFloat(lat[1]), lng: parseFloat(lng[1]) } : null;
    if (fid) {
        const cid = BigInt('0x' + fid[1]).toString(10);
        return { cleanUrl: `https://maps.google.com/?cid=${cid}`, cid, placeCoords, method: 'cid' };
    }
    try {
        const u = new URL(raw);
        for (const p of ['g_ep', 'entry', 'authuser']) u.searchParams.delete(p);
        return { cleanUrl: u.toString(), cid: null, placeCoords, method: 'stripped' };
    } catch {
        return { cleanUrl: null, cid: null, placeCoords, method: null };
    }
}
