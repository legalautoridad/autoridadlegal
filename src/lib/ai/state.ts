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
    | "ASK_QUESTIONS"
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
    questions_resolved?: boolean | null; // True when user confirms no more questions before offer
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
        citation_date: z.string().nullable().optional().describe("Si tiene citación y proporciona tanto el DÍA como la HORA, extrae aquí la fecha convirtiéndola ESTRICTAMENTE al formato 'DD/MM/YYYY HH:mm AM/PM' (ej. 14/03/2026 10:30 AM). USA LA FECHA ACTUAL DE ESPAÑA PROPORCIONADA PARA CALCULAR DÍAS RELATIVOS (ej. si hoy es 07/04 y dice 'mañana', es 08/04). Si falta la hora o el día, NO extraigas nada."),
        dependents: z.boolean().nullable().optional().describe("'true' si tiene personas a cargo, 'false' si no"),
        work_status: z.string().nullable().optional().describe("CRÍTICO: Extrae aquí la situación laboral literal que indique el usuario (ej. 'trabajando', 'en paro', 'estudiante'). Si menciona a qué se dedica, ponlo aquí."),
        needs_license_for_work: z.boolean().nullable().optional().describe("'true' si necesita carnet para trabajar, 'false' si no"),
        questions_resolved: z.boolean().nullable().optional().describe("CRÍTICO: Extrae 'true' SOLO cuando el usuario confirma que no tiene más dudas o preguntas y está listo para seguir. Si el usuario hace UNA PREGUNTA, respóndela y deja este campo vacío. Cuando finalmente diga 'no tengo más preguntas' o similar, extrae 'true'."),
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
                instruction: "MISIÓN: Identificación. En 'answer': Saluda con la autoridad de AL (Módulo 1). En 'question': Pregunta exclusivamente cómo se llama para abrir su expediente."
            };

        case "ASK_WHAT_HAPPENED":
            return {
                missing: "incident_type",
                instruction: `MISIÓN: Detección de incidente. En 'answer': Agradece a ${slots.name || 'el usuario'} y aplica empatía táctica (DOC B). En 'question': Pregunta qué ha pasado exactamente (¿fue un control rutinario o un accidente?) para determinar la gravedad del atestado.`
            };

        case "ASK_RATE":
            return {
                missing: "rate",
                instruction: "MISIÓN: Obtener Tasa. En 'answer': Explica que la tasa es el núcleo de la estrategia de defensa (DOC A). En 'question': Pregunta qué tasa exacta dio en el etilómetro. Si dio entre 0.61 y 0.65, prepárate para mencionar el Margen de Error."
            };

        case "ASK_PRIORS":
            return {
                missing: "priors",
                instruction: "MISIÓN: Antecedentes. En 'answer': Acusa recibo de la tasa. En 'question': Explica que para garantizar la reducción de 1/3 de la condena (DOC A) necesitas saber si tiene antecedentes penales previos de cualquier tipo."
            };

        case "ASK_CITY":
            return {
                missing: "city",
                instruction: "MISIÓN: Localización. En 'answer': Valida la información anterior. En 'question': Pregunta en qué ciudad o localidad ocurrió el incidente para asignar al abogado especialista con autoridad local en esos juzgados."
            };

        case "ASK_CITATION":
            if (slots.has_citation === true && !slots.citation_date) {
                return {
                    missing: "citation_date",
                    instruction: "MISIÓN: Fecha de Juicio. En 'answer': Indica que la urgencia es máxima. En 'question': Pregunta qué DÍA y qué HORA exacta tiene la citación para el Juicio Rápido."
                };
            }
            return {
                missing: "has_citation",
                instruction: "MISIÓN: Verificar Citación. En 'question': Pregunta si la policía ya le ha entregado la citación judicial para el Juicio Rápido."
            };

        case "ASK_DEPENDENTS":
            return {
                missing: "dependents",
                instruction: "MISIÓN: Carga Familiar. En 'answer': Explica que esto ayuda a reducir la multa diaria (DOC A). En 'question': Pregunta si tiene hijos menores o familiares a su cargo."
            };

        case "ASK_WORK":
            if (!slots.work_status) {
                return {
                    missing: "work_status",
                    instruction: "MISIÓN: Perfil Laboral. En 'question': Pregunta cuál es su situación laboral actual (trabajador, autónomo, paro)."
                };
            }
            return {
                missing: "needs_license_for_work",
                instruction: "MISIÓN: Riesgo de Empleo. En 'question': Pregunta si necesita el carné de conducir obligatoriamente para realizar su trabajo (importante para la estrategia de evitar la retirada)."
            };

        case "ASK_QUESTIONS":
            return {
                missing: "questions_resolved",
                instruction: "MISIÓN: Limpiar dudas. En 'answer': Confirma que ya tienes el perfil técnico completo. En 'question': Pregunta si tiene alguna duda legal específica (consulta DOC F) antes de enviarle el presupuesto de defensa."
            };

        case "OFFER":
            const computedPrice = calculatePrice(slots);
            return {
                missing: "none",
                instruction: `MISIÓN: Cierre de Venta. ESTADO: OFERTA. Presenta el precio cerrado de ${computedPrice}€ (IVA inc.) usando el contraste de valor del DOC B. En 'question': Pregunta si quiere activar su defensa ahora mismo para que el abogado le llame hoy.`
            };

        case "AGREEMENT":
            return {
                missing: "none",
                instruction: `MISIÓN: Finalización. El usuario acepta. USA EL TEXTO LITERAL DEL DOC C/STATE.TS sobre el servidor seguro y el abogado especialista. PROHIBIDO hacer más preguntas.`
            };

        case "NO_CITATION":
            return {
                missing: "none",
                instruction: "MISIÓN: Captura de Lead. El usuario no tiene citación. Explica que le llamaremos en cuanto la reciba. En 'answer' da tranquilidad. 'question' DEBE estar vacío."
            };

        default:
            return { missing: "unknown", instruction: "Misión: Triaje. Mantén el flujo profesional y pide el dato que falte según el DOC E." };
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
        ? ["ASK_NAME", "ASK_WHAT_HAPPENED", "ASK_CITY", "ASK_QUESTIONS", "OFFER"]
        : ["ASK_NAME", "ASK_WHAT_HAPPENED", "ASK_RATE", "ASK_PRIORS", "ASK_CITY", "ASK_CITATION", "ASK_DEPENDENTS", "ASK_WORK", "ASK_QUESTIONS", "OFFER"];

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
