/**
 * Pure function to extract a person's name from WhatsApp messages.
 */

const PARTICLES = new Set(['de', 'del', 'la', 'las', 'los', 'd', 'i']);

const STOPLIST = new Set([
    'alcoholemia', 'alcohol',
    'droga', 'drogas',
    'multa', 'multas',
    'policia', 'policía',
    'mossos', 'mosso',
    'guardia',
    'juicio', 'juzgado', 'juzgados',
    'abogado', 'abogados',
    'necesito', 'necesitamos',
    'ayuda', 'ayudar',
    'pararon', 'parado', 'parada', 'paro', 'parar',
    'han', 'ha', 'he', 'hemos',
    'me', 'te', 'se', 'nos', 'os', 'le', 'les',
    'carnet', 'carné', 'permiso',
    'accidente', 'accidentes',
    'positivo', 'positiva',
    'control', 'controles',
    'test', 'prueba', 'soplar',
    'radar', 'velocidad',
    'citacion', 'citación',
    'urgente', 'urgencia',
    'detenido', 'detenida', 'comisaria', 'comisaría',
    'hola', 'buenas', 'buenos', 'hey', 'gracias', 'por'
]);

function capitalizeWord(word: string, isFirstWord: boolean): string {
    const lower = word.toLowerCase();
    // If it's a particle and not the first word, leave lowercase
    if (!isFirstWord && PARTICLES.has(lower)) {
        return lower;
    }
    // Handle apostrophes like d'Ángeles or D'Angelo
    if (lower.includes("'")) {
        return lower.split("'").map((part, idx) => {
            if (idx === 0 && PARTICLES.has(part)) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
        }).join("'");
    }
    // Handle hyphens like Jean-Luc or Pérez-Reverte
    if (lower.includes("-")) {
        return lower.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("-");
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function extractName(text: string | null | undefined): string | null {
    if (!text || typeof text !== 'string') return null;

    // 1. Remove emojis and normalize spaces
    let cleaned = text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // If empty or has digits -> null
    if (!cleaned || /\d/.test(cleaned)) return null;

    // 2. Remove punctuation from the end
    cleaned = cleaned.replace(/[.,;:!?]+$/, '').trim();

    // 3. Remove greetings at the beginning
    cleaned = cleaned.replace(/^(hola|buenas(\s+(d[ií]as|tardes|noches))?|buenos\s+(d[ií]as|dias)|hey)[,.:;!\s-]*/i, '').trim();

    // 4. Remove prefixes at the beginning
    cleaned = cleaned.replace(/^(me\s+llamo|mi\s+nombre\s+es|soy|me\s+dicen|aqu[ií]|de\s+parte\s+de)[:,\s-]*/i, '').trim();

    if (!cleaned) return null;

    // 5. Cut off at first punctuation: , . ; : ! ?
    const punctIndex = cleaned.search(/[,.;:!?]/);
    if (punctIndex !== -1) {
        cleaned = cleaned.slice(0, punctIndex).trim();
    }

    // 6. Cut off at connectors: \b(y|que|te|porque)\b
    const connectorMatch = /\b(y|que|te|porque)\b/i.exec(cleaned);
    if (connectorMatch && connectorMatch.index !== undefined) {
        cleaned = cleaned.slice(0, connectorMatch.index).trim();
    }

    if (!cleaned) return null;

    // 7. Check total length (max 40 characters)
    if (cleaned.length > 40) return null;

    // 8. Split words
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;

    // Count substantive (non-particle) words; take at most 3 substantive words
    const nonParticleWords = words.filter(w => !PARTICLES.has(w.toLowerCase()));
    if (nonParticleWords.length === 0 || nonParticleWords.length > 3) {
        return null;
    }

    // Maximum 5 words in total (including particles)
    if (words.length > 5) return null;

    // 9. Check each word: must be alphabetic (+ hyphens/apostrophes) and NOT in stoplist
    const validWordRegex = /^[a-záéíóúüñÁÉÍÓÚÜÑ'-]+$/i;

    for (const word of words) {
        if (!validWordRegex.test(word)) {
            return null;
        }
        if (STOPLIST.has(word.toLowerCase())) {
            return null;
        }
    }

    // 10. Format: capitalize first letter of each word, preserving lowercase particles in the middle
    const formattedWords = words.map((w, idx) => capitalizeWord(w, idx === 0));
    const result = formattedWords.join(' ');

    if (!result || result.length > 40) return null;

    return result;
}
