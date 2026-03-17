import { z } from "zod";

// 1. Definition of Chat States
export type ChatState =
    | "ASK_NAME"
    | "ASK_RATE"
    | "ASK_PRIORS"
    | "ASK_WHAT_HAPPENED"
    | "ASK_CITY"
    | "ASK_CITATION"
    | "ASK_DEPENDENTS"
    | "ASK_WORK"
    | "OFFER"
    | "AGREEMENT"
    | "NO_CITATION"
    | "END";

// 2. Definition of known slots (Context)
export interface ChatSlots {
    name?: string | null;
    rate?: string | null;
    priors?: string | null; // Changed to string ('si' | 'no') to prevent LLM drop-out
    incident_type?: string | null; // e.g., 'control', 'accidente'
    city?: string | null;
    has_citation?: boolean | null;
    citation_date?: string | null;
    dependents?: boolean | null;
    work_status?: string | null;
    needs_license_for_work?: boolean | null;
    calculated_price?: number | null;
}

// 3. Schema expected from the AI (Redactor Obediente)
export const AIResponseSchema = z.object({
    answer: z.string().describe("Texto de respuesta al usuario (máximo 100 palabras). IMPORTANTE: NUNCA incluyas preguntas aquí. Las preguntas van en el campo 'question'."),
    question: z.string().describe("UNA única pregunta clara para avanzar de estado. DEBE ir aquí y NO en 'answer'. Si no hay que preguntar, envíalo vacío."),
    next_state_suggestion: z.string().describe("El estado al que crees que deberíamos pasar (e.g. ASK_RATE)."),
    extracted_slots: z.object({
        name: z.string().nullable().optional().describe("Nombre del usuario"),
        rate: z.coerce.string().nullable().optional().describe("CRÍTICO: Extrae aquí la tasa de alcoholemia exacta. Si el usuario te da una cifra como '0.7' o '0.60' en su respuesta, cópiala aquí obligatoriamente."),
        priors: z.string().nullable().optional().describe("CRÍTICO: Si dice que NO tiene antecedentes, escribe 'no'. Si dice que SÍ tiene, escribe 'si'."),
        incident_type: z.string().nullable().optional().describe("Tipo de incidente ('control', 'accidente', etc.)"),
        city: z.string().nullable().optional().describe("Ciudad donde ocurrió"),
        has_citation: z.boolean().nullable().optional().describe("'true' si tiene citación, 'false' si no"),
        citation_date: z.string().nullable().optional().describe("Si tiene citación y proporciona tanto el DÍA como la HORA, extrae aquí la fecha convirtiéndola ESTRICTAMENTE al formato 'mm/dd/yyyy hh:mm AM/PM' (ej. 03/14/2026 10:30 AM). Si falta la hora o el día, NO extraigas nada para poder preguntarle."),
        dependents: z.boolean().nullable().optional().describe("'true' si tiene personas a cargo, 'false' si no"),
        work_status: z.string().nullable().optional().describe("CRÍTICO: Extrae aquí la situación laboral literal que indique el usuario (ej. 'trabajando', 'en paro', 'estudiante'). Si menciona a qué se dedica, ponlo aquí."),
        needs_license_for_work: z.boolean().nullable().optional().describe("'true' si necesita carnet para trabajar, 'false' si no"),
    }).describe("OBLIGATORIO: Extrae aquí los datos que el usuario menciona en su respuesta. Para los booleanos, si el usuario dice 'no', extrae 'false' (¡no lo dejes vacío!)."),
    confidence: z.number().describe("Nivel de confianza (0-1) en que has extraído los datos correctamente."),
    is_off_topic: z.boolean().describe("True si el usuario intenta desviarse del caso legal.")
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export type ChatProfile = 'alcoholemia' | 'general';

// Helper: Calculate dynamic price based on slots
export function calculatePrice(slots: ChatSlots): number {
    let price = 990;

    // Urgencia: < 24 horas Juicio
    if (slots.citation_date) {
        try {
            const citationDate = new Date(slots.citation_date);
            const now = new Date();
            const diffHours = (citationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            if (diffHours >= 0 && diffHours < 24) {
                price += 50;
            }
        } catch (e) {
            // Silent catch for invalid dates
        }
    }

    // Tiene Antecedentes
    if (slots.priors?.toLowerCase() === 'si') {
        price += 50;
    }

    // Es profesional (necesita carnet para trabajar)
    if (slots.needs_license_for_work === true) {
        price += 100;
    }

    // Tasa entre 0.60 y 0.65
    if (slots.rate) {
        const rateNum = parseFloat(slots.rate.replace(',', '.'));
        if (!isNaN(rateNum) && rateNum >= 0.60 && rateNum <= 0.65) {
            price += 100;
        }
    }

    // Añadir 21% de IVA y redondear a 2 decimales
    const priceWithIva = price * 1.21;
    return parseFloat(priceWithIva.toFixed(2));
}

// Helper: Determine missing slots and current policy based on state
export function getPromptInstructionsForState(state: ChatState, slots: ChatSlots, profile: ChatProfile = 'alcoholemia'): { missing: string, instruction: string } {
    switch (state) {
        case "ASK_NAME":
            return {
                missing: "name",
                instruction: "En 'answer': Saluda brevemente. En 'question': Pregunta cómo se llama para poder dirigirte a él/ella."
            };
        case "ASK_WHAT_HAPPENED":
            if (profile === 'general') {
                return {
                    missing: "incident_type",
                    instruction: `En 'answer': Agradece a ${slots.name || 'él/ella'}. En 'question': Pregunta qué ha pasado exactamente y en qué le podemos ayudar.`
                };
            }
            return {
                missing: "incident_type",
                instruction: `En 'answer': Agradece a ${slots.name || 'él/ella'}. En 'question': Pregunta qué ha pasado exactamente (si fue un control rutinario o un accidente).`
            };
        case "ASK_RATE":
            return {
                missing: "rate",
                instruction: "En 'answer': Muestra comprensión. En 'question': Explica que la cifra del etilómetro es fundamental y pregunta QUÉ TASA DIO exactamente en la prueba. Si el usuario te responde con un número, EXTRAE obligatoriamente rate='número' en el JSON."
            };
        case "ASK_PRIORS":
            return {
                missing: "priors",
                instruction: "En 'answer': Acusa recibo de la tasa. En 'question': Explica muy brevemente que necesitamos saber su historial para evaluar la pena y pregunta DIRECTAMENTE si tiene antecedentes penales previos. Si el usuario ya te ha respondido que NO tiene, no se lo vuelvas a preguntar y EXTRAE obligatoriamente priors='no'."
            };
        case "ASK_CITY":
            return {
                missing: "city",
                instruction: "En 'answer': Confirma que has tomado nota. En 'question': Explica que cada Juzgado tiene sus propios criterios, y por eso necesitas saber en qué ciudad o pueblo ocurrió."
            };
        case "ASK_CITATION":
            // Case 1: has citation AND date are both set → fully complete
            if (slots.has_citation === true && !!slots.citation_date) {
                return { missing: "none", instruction: "La citación ya está registrada." };
            }
            // Case 2: has citation but missing the date/time
            if (slots.has_citation === true && !slots.citation_date) {
                return {
                    missing: "citation_date",
                    instruction: "En 'answer': Acusa recibo de que sí tiene citación. En 'question': Pregunta DIRECTAMENTE qué DÍA y a qué HORA exacta le han dado para el Juicio Rápido. IMPORTANTE: Si el usuario dio una fecha incompleta (por ejemplo, solo dice 'mañana' o un día sin la hora), pídele que especifique la hora exacta para poder anotarlo."
                };
            }
            // Case 3: has_citation not yet answered (null/undefined) → ask
            return {
                missing: "has_citation",
                instruction: "En 'question': Pregunta si la policía ya le ha dado fecha para el Juicio Rápido y, en caso afirmativo, qué DÍA y HORA exacta es. ATENCIÓN ESPECIAL: Si el usuario dice que NO tiene citación todavía, extrae has_citation=false OBLIGATORIAMENTE, deja el campo 'question' absolutamente VACÍO y en 'answer' solo di brevemente que entiendes que aún no tiene la citación y que le indicarás cómo proceder. NO preguntes nada más."
            };
        case "ASK_DEPENDENTS":
            return {
                missing: "dependents",
                instruction: "En 'answer': Muestra empatía. En 'question': Explica que para conseguir una rebaja o atenuante necesitas cierta información personal, y pregunta si tiene hijos menores o familiares a su cargo."
            };
        case "ASK_WORK":
            // Sub-step 1: get work_status
            if (!slots.work_status) {
                return {
                    missing: "work_status",
                    instruction: "En 'answer': Confirma que has anotado lo anterior. En 'question': Pregunta DIRECTAMENTE si actualmente está trabajando o no. No añadas ninguna otra pregunta."
                };
            }
            // Sub-step 2: get needs_license_for_work (required for correct price calculation)
            if (slots.needs_license_for_work === null || slots.needs_license_for_work === undefined) {
                return {
                    missing: "needs_license_for_work",
                    instruction: "En 'answer': Confirma su situación laboral. En 'question': Pregunta DIRECTAMENTE si para realizar su trabajo habitual necesita el carné de conducir. OBLIGATORIO: extrae needs_license_for_work=true si dice que sí, needs_license_for_work=false si dice que no."
                };
            }
            return { missing: "none", instruction: "Tienes toda la información laboral. Avanza al siguiente estado." };
        case "OFFER":
            const computedPrice = calculatePrice(slots);
            if (profile === 'general') {
                return {
                    missing: "none",
                    instruction: `Tienes toda la información. Tienes PROHIBIDO ofrecer estudios gratuitos.
        PON TODO EN EL CAMPO 'answer'. El campo 'question' DEBE ESTAR VACÍO.
        En 'answer' escribe en un solo párrafo fluido:
        1. Indica que somos especialistas en ${slots.city || 'su zona'}
        2. Informa que el Precio Cerrado y definitivo es de ${computedPrice}€ (IVA incluido)
        3. Incluye directamente al final del párrafo: "¿Quieres que activemos tu defensa ahora mismo para protegerte a este precio?"
        IMPORTANTE: Si el usuario ya ha dicho que sí acepta, pon "next_state_suggestion": "AGREEMENT" en el JSON.`
                };
            }
            return {
                missing: "none",
                instruction: `Tienes toda la información. Tienes PROHIBIDO hacer resúmenes largos.
        PON TODO EN EL CAMPO 'answer'. El campo 'question' DEBE ESTAR VACÍO.
        En 'answer' escribe en un solo párrafo fluido:
        1. Ancla el precio: la defensa penal por alcoholemia en ${slots.city || 'la zona'} suele rondar entre ${computedPrice + 100}€ y ${computedPrice + 400}€.
        2. Informa del precio en Autoridad Legal: exactamente ${computedPrice}€ (IVA incluido).
        3. Incluye directamente al final del mismo párrafo: "¿Quieres que activemos tu defensa ahora mismo para protegerte a este precio?"
        IMPORTANTE: Si el usuario ya ha dicho que sí acepta, pon "next_state_suggestion": "AGREEMENT" en el JSON.`
            };
        case "AGREEMENT":
            return {
                missing: "none",
                instruction: `El usuario ha aceptado pagar. Tienes PROHIBIDO pedir datos por aquí. TU ÚNICA RESPUESTA DEBE SER EXACTAMENTE ESTE TEXTO LETRA POR LETRA: "Excelente. Me alegra que quieras avanzar. Un abogado especialista de nuestro equipo analizará tu caso para ofrecerte la mejor estrategia y un presupuesto cerrado. Estamos aquí para ayudarte en este proceso. Por seguridad y cumplimiento de la LOPD, la recogida de tus datos personales (Nombre, DNI...) y la formalización de la reserva se hace en nuestro Servidor Seguro. Pulsa el botón de abajo para activar tu defensa ahora mismo: Una vez completado ese formulario, recibirás el contrato y tu abogado te llamará para la cita."`
            };
        case "NO_CITATION":
            return {
                missing: "none",
                instruction: `El usuario no tiene aún la fecha y hora del Juicio Rápido. Explícale que para asignarle el abogado más adecuado necesitamos esos datos en cuanto los tenga. Indícale que puede dejarnos sus datos de contacto pulsando el botón que aparecerá en pantalla y que le llamaremos en cuanto reciba la citación. PON TODO EN 'answer'. El campo 'question' DEBE ESTAR VACÍO.`
            };
        default:
            return { missing: "unknown", instruction: "Responde de forma profesional manteniendo el contexto del caso penal." };
    }
}

// Central logic to advance state based on extracted slots
export function getNextState(currentState: ChatState, slots: ChatSlots, aiSuggestedState?: string, profile: ChatProfile = 'alcoholemia'): ChatState {

    // Core requirements to present an offer — ALL critical slots must be captured
    const canMakeOffer = profile === 'general'
        ? (!!slots.city && !!slots.incident_type)
        : (
            !!slots.city &&
            !!slots.rate &&
            !!slots.priors &&
            slots.needs_license_for_work !== null &&
            slots.needs_license_for_work !== undefined &&
            slots.has_citation !== null &&
            slots.has_citation !== undefined // citation answer is required — can be true or false
          );

    // Lock terminal states
    if (currentState === "AGREEMENT" || currentState === "OFFER" || currentState === "NO_CITATION") {
        if (aiSuggestedState === "AGREEMENT") return "AGREEMENT";
        return currentState;
    }

    // EARLY EXIT: If client has no citation, branch to lead capture flow immediately
    if (slots.has_citation === false) {
        return "NO_CITATION";
    }

    // NOTE: The AI's OFFER suggestion is intentionally IGNORED here to prevent skipping questions.
    // The linear flow below always determines state — OFFER is only reached when ALL slots are filled.

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
