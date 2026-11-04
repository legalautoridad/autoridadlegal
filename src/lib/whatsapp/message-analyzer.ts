import { generateText } from 'ai';
import { getModel } from '@/lib/ai/providers';

export type InquiryCategory =
    | 'alcoholemia'
    | 'drogas'
    | 'velocidad'
    | 'sin-carnet'
    | 'profesionales'
    | 'juicio-rapido'
    | 'general';

export interface AnalyzedWhatsAppMessage {
    category: InquiryCategory;
    judicialDistrict: string | null;
    topicDescription: string;
    confirmationReply: string;
}

const KNOWN_DISTRICTS = [
    'Arenys de Mar',
    'Badalona',
    'Barcelona',
    'Berga',
    'Cerdanyola del Vallès',
    'Cornellà de Llobregat',
    'El Prat de Llobregat',
    'Esplugues de Llobregat',
    'Gavà',
    'Granollers',
    "L'Hospitalet de Llobregat",
    'Hospitalet de Llobregat',
    'Igualada',
    'Manresa',
    'Martorell',
    'Mataró',
    'Mollet del Vallès',
    'Rubí',
    'Sabadell',
    'Sant Boi de Llobregat',
    'Sant Feliu de Llobregat',
    'Santa Coloma de Gramenet',
    'Terrassa',
    'Vic',
    'Vilafranca del Penedès',
    'Vilanova i la Geltrú',
];

function normalizeForMatch(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function detectDistrict(text: string): string | null {
    // 1. Check explicit pattern: "juicio rápido en <Lugar> y necesito"
    const regexMatch = text.match(/juicio\s+r[aá]pido\s+en\s+(.+?)(?:\s+y\s+necesito|[.,;!?]|$)/i);
    if (regexMatch && regexMatch[1]) {
        const candidate = regexMatch[1].trim();
        if (candidate.length > 1 && candidate.length <= 45) {
            return candidate;
        }
    }

    // 2. Match against the 25 judicial districts of Barcelona province
    const normText = normalizeForMatch(text);
    for (const district of KNOWN_DISTRICTS) {
        if (normText.includes(normalizeForMatch(district))) {
            return district;
        }
    }

    return null;
}

function classifyByRules(text: string): {
    category: InquiryCategory;
    judicialDistrict: string | null;
    topicDescription: string;
    isExactTemplateOrClearMatch: boolean;
} {
    const norm = normalizeForMatch(text);
    const judicialDistrict = detectDistrict(text);

    const hasAlcohol = /\b(alcoholemia|alcohol|etilometro|tasa|soplar|0[.,]\d+|bebid[oa]|ebri[oa])\b/.test(norm);
    const hasDrugs = /\b(drogas?|estupefacientes?|thc|cocaina|cannabis|porro|salival|drogotest)\b/.test(norm);
    const hasSpeed = /\b(velocidad|radar|cinemometro|km\/h|exceso de velocidad)\b/.test(norm);
    const hasNoLicense = /\b(sin carnet|sin carne|sin permiso|puntos|perdida de vigencia|retirada del? carne)\b/.test(norm);
    const hasProfessional = /\b(conductor profesional|profesional|camionero|taxista|autobus|repartidor|cap)\b/.test(norm);
    const hasQuickTrial = /\b(juicio rapido|citacion|juzgado|guardia|atestado)\b/.test(norm);

    if (hasAlcohol) {
        const topic = judicialDistrict
            ? `un delito de alcoholemia en ${judicialDistrict}`
            : 'un delito de alcoholemia';
        return {
            category: 'alcoholemia',
            judicialDistrict,
            topicDescription: topic,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (hasDrugs) {
        const topic = judicialDistrict
            ? `conducción bajo los efectos de drogas en ${judicialDistrict}`
            : 'conducción bajo los efectos de drogas';
        return {
            category: 'drogas',
            judicialDistrict,
            topicDescription: topic,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (hasSpeed) {
        const topic = judicialDistrict
            ? `un delito de exceso de velocidad en ${judicialDistrict}`
            : 'un delito de exceso de velocidad';
        return {
            category: 'velocidad',
            judicialDistrict,
            topicDescription: topic,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (hasNoLicense) {
        const topic = judicialDistrict
            ? `conducir sin carnet en ${judicialDistrict}`
            : 'conducir sin carnet';
        return {
            category: 'sin-carnet',
            judicialDistrict,
            topicDescription: topic,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (hasProfessional) {
        const topic = judicialDistrict
            ? `defensa para conductor profesional en ${judicialDistrict}`
            : 'defensa para conductor profesional';
        return {
            category: 'profesionales',
            judicialDistrict,
            topicDescription: topic,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (judicialDistrict) {
        return {
            category: 'juicio-rapido',
            judicialDistrict,
            topicDescription: `tu juicio rápido en ${judicialDistrict}`,
            isExactTemplateOrClearMatch: true,
        };
    }

    if (hasQuickTrial) {
        const isGenericGuardia = /^hola[,.]?\s*necesito un abogado de guardia\.?$/i.test(text.trim());
        return {
            category: isGenericGuardia ? 'general' : 'juicio-rapido',
            judicialDistrict: null,
            topicDescription: isGenericGuardia
                ? 'asistencia con un abogado de guardia'
                : 'tu citación a juicio rápido',
            isExactTemplateOrClearMatch: isGenericGuardia,
        };
    }

    return {
        category: 'general',
        judicialDistrict: null,
        topicDescription: 'asistencia legal penal',
        isExactTemplateOrClearMatch: false,
    };
}

/**
 * Understands what an incoming WhatsApp message is about (combining fast rule-based
 * extraction for known templates + AI understanding for free-form messages) and builds
 * the confirmation reply ending with "Pronto seras contactado por un abogado".
 */
export async function analyzeIncomingWhatsAppMessage(
    messageText: string
): Promise<AnalyzedWhatsAppMessage> {
    const cleanInput = messageText.trim();
    const ruleResult = classifyByRules(cleanInput);

    let topicDescription = ruleResult.topicDescription;
    let category = ruleResult.category;
    let judicialDistrict = ruleResult.judicialDistrict;

    // If the user wrote a free-form message that isn't a standard template, try AI to summarize the topic naturally
    if (!ruleResult.isExactTemplateOrClearMatch && cleanInput.length > 12) {
        try {
            const model = getModel();
            const aiPromise = generateText({
                model,
                temperature: 0.2,
                system: `Eres el receptor de triaje de Autoridad Legal (despacho penalista de seguridad vial y juicios rápidos en Barcelona).
Analiza el mensaje entrante de WhatsApp del cliente y devuelve SOLO un objeto JSON válido (sin bloques markdown) con:
- "category": una de ["alcoholemia", "drogas", "velocidad", "sin-carnet", "profesionales", "juicio-rapido", "general"]
- "judicialDistrict": nombre del municipio o partido judicial si se menciona, o null
- "topicDescription": frase breve en español (máximo 10 palabras, en minúsculas salvo nombres propios) que describa el motivo del mensaje para completar la frase "Hemos recibido tu mensaje sobre <topicDescription>." (por ejemplo: "un control de alcoholemia en Sabadell", "una citación a juicio rápido", "asistencia legal urgente").`,
                prompt: cleanInput,
            });

            const timeoutPromise = new Promise<null>(resolve => setTimeout(() => resolve(null), 4000));
            const aiResult = await Promise.race([aiPromise, timeoutPromise]);

            if (aiResult && aiResult.text) {
                const rawJson = aiResult.text.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(rawJson);
                if (parsed.topicDescription && typeof parsed.topicDescription === 'string') {
                    topicDescription = parsed.topicDescription.replace(/\.$/, '').trim();
                }
                if (parsed.category) {
                    category = parsed.category as InquiryCategory;
                }
                if (parsed.judicialDistrict && !judicialDistrict) {
                    judicialDistrict = String(parsed.judicialDistrict);
                }
            }
        } catch (err) {
            console.warn('[WHATSAPP_ANALYZER] AI fallback to rules:', err);
        }
    }

    const confirmationReply = `Hemos recibido tu mensaje sobre ${topicDescription}. Pronto serás contactado por un abogado.`;

    return {
        category,
        judicialDistrict,
        topicDescription,
        confirmationReply,
    };
}

