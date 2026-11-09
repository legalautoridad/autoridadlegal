/**
 * Helper to classify incident_type and city from WhatsApp user messages.
 * Only exact keyword and database matches are used; if no match, returns null.
 */

export function detectIncidentType(text: string): string | null {
    if (!text) return null;
    const lower = text.toLowerCase();

    if (/alcohol|alcoholemia|etil[oó]metro|soplar|tasa/i.test(lower)) {
        return 'alcoholemia';
    }
    if (/droga|drogas|estupefaciente|coca[ií]na|thc|cannabis|porro/i.test(lower)) {
        return 'drogas';
    }
    if (/velocidad|radar|cinem[oó]metro/i.test(lower)) {
        return 'velocidad';
    }
    if (/sin[\s_-]?(carnet|permiso)|retirada\s+de\s+carnet|p[eé]rdida\s+de\s+puntos|sin\s+puntos/i.test(lower)) {
        return 'sin-carnet';
    }
    if (/accidente|choque|colisi[oó]n|atropello/i.test(lower)) {
        return 'accidente';
    }

    return null;
}

export function detectCity(text: string, locationNames: string[]): string | null {
    if (!text || !locationNames || locationNames.length === 0) return null;
    const lower = text.toLowerCase();

    // Sort locations by length descending so multi-word locations match first (e.g. "Hospitalet de Llobregat" before "Hospitalet")
    const sorted = [...locationNames].sort((a, b) => b.length - a.length);

    for (const loc of sorted) {
        if (!loc || loc.length < 3) continue;
        const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-záéíóúüñ])${escaped.toLowerCase()}([^a-záéíóúüñ]|$)`, 'i');
        if (regex.test(lower)) {
            return loc;
        }
    }

    return null;
}
