'use server';

import { getVectorContext } from '@/lib/ai/get-context';
import { getPromptInstructionsForState, ChatState, ChatSlots, ChatProfile } from '@/lib/ai/state';
import { SYSTEM_PROMPT } from '@/lib/ai/config';

export async function getLiveChatCredentials(currentState: ChatState, currentSlots: ChatSlots, profile: ChatProfile) {
    // We get the same context that the text model uses
    const legalContext = await getVectorContext("", undefined, profile);
    // CRITICAL: Request voice-optimized instructions (no JSON jargon)
    const { missing, instruction } = getPromptInstructionsForState(currentState, currentSlots, profile, true);

    // 1. CLEAR PERSONALITY (Extracted from SYSTEM_PROMPT but cleaned for voice)
    const VOICE_IDENTITY = `
Eres "Autoridad Legal", un Abogado Penalista Senior interactuando por teléfono.
Reglas Absolutas de tu Salida (Output):
1. ERES UN MOTOR DE VOZ: TUS PALABRAS SE REPRODUCIRÁN EN UN ALTAVOZ AL USUARIO.
2. NUNCA PIENSES EN INGLÉS NI ESCRIBAS PENSAMIENTOS INTERNOS.
3. ESTÁ ESTRICTAMENTE PROHIBIDO usar frases como "Acknowledging", "Prioritizing", "Thinking", etc.
4. ESTÁ ESTRICTAMENTE PROHIBIDO poner texto entre asteriscos ** o corchetes [].
5. Tu respuesta debe consistir ÚNICA Y EXCLUSIVAMENTE en el diálogo exacto en español que quieres que escuche el usuario.
`;

    const stateContext = `
[ESTADO DE LA CONVERSACIÓN]:
- Cliente: ${currentSlots.name || 'Desconocido'}
- Faltan estos datos por recabar: ${missing}

[DIRECTIVA INICIAL OBLIGATORIA]:
En tu primera respuesta de esta sesión, di literalmente: "Hola, soy tu asistente especialista. Por favor, cuéntame qué te ha ocurrido y te orientaré en tu problema o consulta. Para empezar dime tu nombre para dirigirme a ti y cuéntame qué te ha ocurrido."
No digas absolutamente nada más antes ni después de esa frase en tu primer encendido. Para los turnos siguientes, responde de manera cortés y natural en español, solicitando los datos faltantes uno por uno.

RECUERDA: NO escribas ningún meta-texto, directiva, o pensamiento interno en tu respuesta. Empieza a hablar directamente el diálogo en español.`;

    const fullSystemPrompt = `${VOICE_IDENTITY}\n\n[CONTEXTO LEGAL]:\n${legalContext}\n\n${stateContext}`;

    return {
        apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
        systemPrompt: fullSystemPrompt
    };
}
