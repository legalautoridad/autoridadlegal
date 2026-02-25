'use server';

import { streamObject } from 'ai';
import { SYSTEM_PROMPT } from './config';
import { getVectorContext } from '@/lib/ai/get-context';
import { getModel, getAIProvider } from './providers';
import { ChatState, ChatSlots, AIResponseSchema, getPromptInstructionsForState, getNextState, ChatProfile } from './state';

export interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function* sendMessage(history: Message[], currentState: ChatState = 'ASK_NAME', currentSlots: ChatSlots = {}, profile: ChatProfile = 'alcoholemia') {
    try {
        const provider = getAIProvider();
        console.log(`--- SendMessage AI Execution (${provider}) ---`);
        const model = getModel();

        // 1. Get Dynamic Context (Vector RAG)
        const lastMessage = history[history.length - 1];
        const legalContext = await getVectorContext(lastMessage.content, undefined, profile);

        // 2. Identify State Instructions
        const { missing, instruction } = getPromptInstructionsForState(currentState, currentSlots, profile);

        const stateContext = `
[ESTADO ACTUAL DEL BOT]: ${currentState}
[FALTAN DATOS ANTES DE ESTE MENSAJE]: ${missing}
[DATOS CONOCIDOS ANTES DE ESTE MENSAJE]: ${JSON.stringify(currentSlots)}

[INSTRUCCIÓN SUGERIDA PARA ESTE ESTADO]:
${instruction}

REGLA DE ORO ANTI-BUCLES (¡CRÍTICO!):
Si en el mensaje del usuario ya encuentras la respuesta al dato que falta (ej. te dice la ciudad "Barcelona", la tasa "0.7", que "no tiene" antecedentes, etc.), **ESTÁ ESTRICTAMENTE PROHIBIDO volver a hacerle esa misma pregunta**.
Si ves la respuesta:
1. Extrae el dato en 'extracted_slots'.
2. IGNORA por completo la "[INSTRUCCIÓN SUGERIDA PARA ESTE ESTADO]".
3. En 'answer', simplemente confirma que has entendido (ej. "Tomo nota de que fue en Barcelona").
4. En 'question', avanza lógicamente al SIGUIENTE punto (citación, cargas familiares, trabajo...) o déjalo vacío si ya tienes los datos para la oferta.

RECUERDA TUS LÍMITES:
- "answer": Menos de 100 palabras. NUNCA pongas preguntas aquí.
- "question": Formular UNA ÚNICA pregunta o dejar vacío.
- "extracted_slots": OBLIGATORIO extraer el dato si aparece en el mensaje del usuario.
        `;

        const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n[CONTEXTO LEGAL]:\n${legalContext}\n\n${stateContext}`;

        const result = await streamObject({
            // @ts-expect-error - Google Vertex provider type mismatch
            model: model,
            system: fullSystemPrompt,
            messages: history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content,
            })),
            schema: AIResponseSchema,
        });

        // Yield the full system prompt for debugging purposes on the frontend
        yield JSON.stringify({ type: 'prompt-debug', content: fullSystemPrompt });

        // Yield partial object structures so the frontend can display them typing like a normal message stream
        let previousLength = 0;
        let finalObject: unknown = null;

        for await (const partialObject of result.partialObjectStream) {
            // Reconstruct a text-like stream for the UI
            const currentAnswer = partialObject?.answer || "";
            const currentQuestion = partialObject?.question || "";

            // Render it sequentially
            const combinedText = [currentAnswer, currentQuestion].filter(Boolean).join("\n\n");

            if (combinedText.length > previousLength) {
                const delta = combinedText.substring(previousLength);
                yield JSON.stringify({ type: 'text-delta', content: delta });
                previousLength = combinedText.length;
            }
            finalObject = partialObject;
        }

        // --- Post-Generation Validation & State Update ---
        if (finalObject && typeof finalObject === 'object') {
            const parsedFinal = finalObject as Record<string, unknown>;
            console.log("[DEBUG] LLM Extracted Slots Raw:", JSON.stringify(parsedFinal.extracted_slots, null, 2));
            // Merge slots
            const newSlots = { ...currentSlots };
            if (parsedFinal.extracted_slots && typeof parsedFinal.extracted_slots === 'object') {
                for (const [key, val] of Object.entries(parsedFinal.extracted_slots)) {
                    // Allow false specifically, reject null/undefined/empty string
                    if (val !== null && val !== undefined && val !== "") {
                        // @ts-expect-error - Dynamic assignment to typed interface
                        newSlots[key] = val;
                    }
                }
            }

            // Word count validation (Backend safeguard)
            const wordCount = (typeof parsedFinal.answer === 'string' ? parsedFinal.answer : "").split(/\s+/).length;
            if (wordCount > 120) {
                console.warn("[VALIDATION] Model exceeded word count limit:", wordCount);
            }

            // State Transition
            const nextState = getNextState(currentState, newSlots, typeof parsedFinal.next_state_suggestion === 'string' ? parsedFinal.next_state_suggestion : undefined, profile);

            // SPECIAL LOGIC: Trigger Agreement / Tools
            if (nextState === 'AGREEMENT') {
                yield JSON.stringify({
                    type: 'text-delta',
                    content: `\n\nPor seguridad y cumplimiento de la LOPD, la recogida de tus datos personales (Nombre, DNI...) y la formalización de la reserva se hace en nuestro **Servidor Seguro**.\nPulsa el botón de abajo para activar tu defensa ahora mismo:\n\n[PAYMENT_BUTTON: /checkout?city=${newSlots.city || ''}&rate=${newSlots.rate || ''}&incident=${newSlots.incident_type || ''}]\n\n*Una vez completado ese formulario, recibirás el contrato y tu abogado te llamará de inmediato.*`
                });
            }

            // Yield state update for the client to store
            yield JSON.stringify({ type: 'state-update', state: nextState, slots: newSlots });
        }

    } catch (error: unknown) {
        // Detailed logging for debugging
        const err = error as Record<string, unknown>;
        console.error('[AI_ACTION] Critical Error:', {
            message: err?.message,
            stack: err?.stack,
            cause: err?.cause,
            digest: err?.digest,
            raw: error
        });
        yield `[ERROR]: ${typeof err?.message === 'string' ? err?.message : 'Error al conectar con el asistente legal'}`;
    }
}
