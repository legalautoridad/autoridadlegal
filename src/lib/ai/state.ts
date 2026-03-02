import { z } from 'zod';

// Define slots for the alcoholemia flow
export const ChatSlotsSchema = z.object({
    name: z.string().optional(),
    incident_type: z.string().optional(),
    rate: z.string().optional(),
    priors: z.string().optional(),
    city: z.string().optional(),
    has_citation: z.boolean().optional(),
    citation_date: z.string().optional(),
    dependents: z.string().optional(),
    work_status: z.string().optional(),
});

export type ChatSlots = z.infer<typeof ChatSlotsSchema>;

// Define available states
export type ChatState =
    | "ASK_NAME"
    | "ASK_WHAT_HAPPENED"
    | "ASK_RATE"
    | "ASK_PRIORS"
    | "ASK_CITY"
    | "ASK_CITATION"
    | "ASK_DEPENDENTS"
    | "ASK_WORK"
    | "OFFER"
    | "AGREEMENT"
    | "CLOSE";

// AI Response structure
export const AIResponseSchema = z.object({
    answer: z.string().describe("La respuesta narrativa para el usuario."),
    question: z.string().describe("La pregunta directa para el usuario."),
    extracted_slots: ChatSlotsSchema.describe("Slots extraídos del mensaje del usuario."),
    next_state_suggestion: z.string().optional().describe("Sugerencia del siguiente estado basada en la conversación."),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export type ChatProfile = 'alcoholemia' | 'general';

// Helper: Determine missing slots and current policy based on state
export function getPromptInstructionsForState(state: ChatState, slots: ChatSlots, profile: ChatProfile = 'alcoholemia', isVoice: boolean = false): { missing: string, instruction: string } {
    let missing = "unknown";
    let instruction = "";

    switch (state) {
        case "ASK_NAME":
            missing = "name";
            instruction = isVoice
                ? "Saluda cálidamente y pregunta amablemente cómo se llama el cliente."
                : "En 'answer': Saluda brevemente. En 'question': Pregunta cómo se llama para poder dirigirte a él/ella.";
            break;
        case "ASK_WHAT_HAPPENED":
            missing = "incident_type";
            if (profile === 'general') {
                instruction = isVoice
                    ? `Agradece a ${slots.name || 'el cliente'} y pregunta qué ha pasado exactamente y en qué le podemos ayudar.`
                    : `En 'answer': Agradece a ${slots.name || 'él/ella'}. En 'question': Pregunta qué ha pasado exactamente y en qué le podemos ayudar.`;
            } else {
                instruction = isVoice
                    ? `Agradece a ${slots.name || 'el cliente'} y pregunta qué ha pasado exactamente: ¿fue un control rutinario o un accidente?`
                    : `En 'answer': Agradece a ${slots.name || 'él/ella'}. En 'question': Pregunta qué ha pasado exactamente (si fue un control rutinario o un accidente).`;
            }
            break;
        case "ASK_RATE":
            missing = "rate";
            instruction = isVoice
                ? "Muestra comprensión y explica que la cifra del etilómetro es fundamental. Pregunta qué tasa dio exactamente en la prueba."
                : "En 'answer': Muestra comprensión. En 'question': Explica que la cifra del etilómetro es fundamental y pregunta QUÉ TASA DIO exactamente en la prueba. Si el usuario te responde con un número, EXTRAE obligatoriamente rate='número' en el JSON.";
            break;
        case "ASK_PRIORS":
            missing = "priors";
            instruction = isVoice
                ? "Acusa recibo de la tasa. Explica muy brevemente que necesitamos saber su historial para evaluar la pena y pregunta directamente si tiene antecedentes penales previos."
                : "En 'answer': Acusa recibo de la tasa. En 'question': Explica muy brevemente que necesitamos saber su historial para evaluar la pena y pregunta DIRECTAMENTE si tiene antecedentes penales previos. Si el usuario ya te ha respondido que NO tiene, no se lo vuelvas a preguntar y EXTRAE obligatoriamente priors='no'.";
            break;
        case "ASK_CITY":
            missing = "city";
            instruction = isVoice
                ? "Confirma que has tomado nota. Explica que cada Juzgado tiene sus propios criterios y pregunta en qué ciudad o pueblo ocurrió."
                : "En 'answer': Confirma que has tomado nota. En 'question': Explica que cada Juzgado tiene sus propios criterios, y por eso necesitas saber en qué ciudad o pueblo ocurrió.";
            break;
        case "ASK_CITATION":
            if (slots.has_citation === true && !slots.citation_date) {
                missing = "citation_date";
                instruction = isVoice
                    ? "Acusa recibo de que sí tiene citación y pregunta directamente qué fecha exacta le han dado para el Juicio Rápido."
                    : "En 'answer': Acusa recibo de que sí tiene citación. En 'question': Pregunta DIRECTAMENTE qué FECHA exacta le han dado para el Juicio Rápido.";
            } else {
                missing = "has_citation";
                instruction = isVoice
                    ? "Pregunta si la policía ya le ha dado fecha para el Juicio Rápido y, en caso afirmativo, qué fecha exacta es."
                    : "En 'question': Pregunta si la policía ya le ha dado fecha para el Juicio Rápido y, en caso afirmativo, qué FECHA exacta es.";
            }
            break;
        case "ASK_DEPENDENTS":
            missing = "dependents";
            instruction = isVoice
                ? "Muestra empatía y explica que para conseguir una rebaja necesitas saber si tiene hijos menores o familiares a su cargo."
                : "En 'answer': Muestra empatía. En 'question': Explica que para conseguir una rebaja o atenuante necesitas cierta información personal, y pregunta si tiene hijos menores o familiares a su cargo.";
            break;
        case "ASK_WORK":
            missing = "work_status";
            instruction = isVoice
                ? "Confirma que has anotado lo anterior y pregunta directamente si actualmente está trabajando o no."
                : "En 'answer': Confirma que has anotado lo anterior. En 'question': Pregunta DIRECTAMENTE si actualmente está trabajando o no. No añadas ninguna otra pregunta.";
            break;
        case "OFFER":
            missing = "none";
            if (profile === 'general') {
                instruction = isVoice
                    ? "Indica que somos especialistas y podemos llevar su caso. Presenta nuestros servicios (estudio gratuito y presupuesto cerrado) y pregunta si quiere que un abogado especialista analice su caso."
                    : `Tienes toda la información. Ahora no hagas preguntas de diagnóstico.
        1. Indica que en Autoridad Legal somos especialistas y podemos llevar su caso en ${slots.city || 'su zona'}.
        2. Presenta nuestros servicios: Estudio de viabilidad gratuito y presupuesto cerrado sin compromiso.
        3. Termina preguntando: "¿Quieres que un abogado especialista analice tu caso sin coste?"
        IMPORTANTE: Si en el último mensaje el usuario ya ha dicho que "sí" acepta, quiere contratar o avanzar, DEBES OBLIGATORIAMENTE poner "next_state_suggestion": "AGREEMENT" en tu respuesta JSON.`;
            } else {
                instruction = isVoice
                    ? `Ancla el precio en ${slots.city || 'la zona'} entre 1100€ y 1500€. Presenta a Autoridad Legal con precio cerrado de 1100€ (descuento a 990€ hoy). Pregunta si le parece una opción justa para proteger su trabajo.`
                    : `Tienes toda la información. Ahora no hagas preguntas de diagnóstico.
        1. Ancla el precio del mercado local (${slots.city || 'la zona'}) entre 1100€ y 1500€.
        2. Presenta a Autoridad Legal: Precio cerrado de 1100€ con descuento del 10% (990€) si reserva hoy con 50€.
        3. Termina preguntando: "¿Te parece justa esta opción para proteger tu trabajo y tu futuro?"
        IMPORTANTE: Si en el último mensaje el usuario ya ha dicho que "sí" acepta, le parece bien, o quiere avanzar, DEBES OBLIGATORIAMENTE poner "next_state_suggestion": "AGREEMENT" en tu respuesta JSON.`;
            }
            break;
        case "AGREEMENT":
            missing = "none";
            instruction = isVoice
                ? "Celebra su decisión de confiar en nosotros. Indícale que haga clic en el botón de pago seguro que aparecerá en pantalla para formalizar el encargo."
                : "El usuario ha aceptado. Celebra su decisión. NO pidas datos por aquí. Indícale que haga clic en el botón de pago seguro que aparecerá en pantalla para formalizar el encargo y que se le asigne su abogado especialista.";
            break;
        default:
            missing = "unknown";
            instruction = "Responde de forma profesional manteniendo el contexto del caso penal.";
    }

    return { missing, instruction };
}

// Central logic to advance state based on extracted slots
export function getNextState(currentState: ChatState, slots: ChatSlots, aiSuggestedState?: string, profile: ChatProfile = 'alcoholemia'): ChatState {

    // Core requirements to present an offer
    const canMakeOffer = profile === 'general'
        ? (!!slots.city && !!slots.incident_type)
        : (!!slots.city && !!slots.rate && !!slots.priors);

    if (currentState === "AGREEMENT" || currentState === "OFFER") {
        if (aiSuggestedState === "AGREEMENT") return "AGREEMENT";
        return currentState;
    }

    if (canMakeOffer && aiSuggestedState === "OFFER") {
        return "OFFER";
    }

    // Default Linear progression fallback
    const flow: ChatState[] = profile === 'general'
        ? ["ASK_NAME", "ASK_WHAT_HAPPENED", "ASK_CITY", "OFFER"]
        : ["ASK_NAME", "ASK_WHAT_HAPPENED", "ASK_RATE", "ASK_PRIORS", "ASK_CITY", "ASK_CITATION", "ASK_DEPENDENTS", "ASK_WORK", "OFFER"];

    // Force forward-only progression past fulfilled slots
    for (const state of flow) {
        const req = getPromptInstructionsForState(state, slots).missing;
        // If this state requires a slot that is missing, we must go to this state
        if (req !== "none" && req !== "unknown" && (slots[req as keyof ChatSlots] === undefined || slots[req as keyof ChatSlots] === null)) {
            return state;
        }
    }

    // If all required slots are magically filled (or we hit a wall), drop into offer if we can
    if (canMakeOffer) {
        return "OFFER";
    }

    // Fallback
    return currentState;
}
