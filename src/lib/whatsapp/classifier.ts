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

export function hasCaseWords(text: string): boolean {
    if (!text) return false;
    const lower = text.toLowerCase();
    return /alcohol|alcoholemia|droga|drogas|velocidad|radar|sin[\s_-]?(carnet|permiso)|accidente|choque|juicio|citaci[oó]n|multa|control|mossos|polic[ií]a|positivo|pararon/i.test(lower);
}

export function isOutsideZone(text: string): boolean {
    if (!text) return false;
    const outsidePatterns = [
        /\b(girona|gerona)\b/i,
        /\b(tarragona)\b/i,
        /\b(lleida|l[eé]rida)\b/i,
        /\b(madrid)\b/i,
        /\b(valencia)\b/i,
        /\b(zaragoza)\b/i,
        /\b(andaluc[ií]a|sevilla|m[aá]laga|c[aá]diz|granada|c[oó]rdoba)\b/i,
        /\b(bilbao|vizcaya|bizkaia|guip[uú]zcoa|gipuzkoa|[aá]lava|araba)\b/i,
        /\b(baleares|mallorca|menorca|ibiza|formentera)\b/i,
        /\b(canarias|tenerife|las palmas)\b/i,
        /\b(castell[oó]n|alicante|alacant|murcia)\b/i,
        /\b(huesca|teruel|navarra|pamplona|la rioja|logro[ñn]o)\b/i,
        /\b(asturias|oviedo|gij[oó]n|galicia|coru[ñn]a|vigo|ourense|lugo|pontevedra)\b/i,
        /\b(cantabria|santander|castilla|valladolid|le[oó]n|burgos|salamanca)\b/i,
        /\b(extremadura|badajoz|c[aá]ceres|toledo|cuenca|albacete|ciudad real|guadalajara)\b/i,
        /\b(andorra)\b/i,
    ];
    return outsidePatterns.some(p => p.test(text));
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
