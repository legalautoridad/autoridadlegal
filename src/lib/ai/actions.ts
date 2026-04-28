'use server';
console.log('[ACTIONS] File loaded at ' + new Date().toISOString());

import { streamObject } from 'ai';
import { revalidatePath } from 'next/cache';
import { getModel, getAIProvider } from './providers';
import { getVectorContext } from '@/lib/ai/get-context';
import { AIResponseSchema, getNextState, getPromptInstructionsForState, ChatState, ChatSlots, ChatProfile } from './state';

export type Message = {
    role: 'user' | 'model';
    content: string;
};

export async function* sendMessage(history: Message[], currentState: ChatState = 'ASK_NAME', currentSlots: ChatSlots = {}, profile: ChatProfile = 'alcoholemia') {
    try {
        console.log(`--- SendMessage AI Execution ---`);
        
        // 1. Identify State Instructions
        const { missing, instruction } = getPromptInstructionsForState(currentState, currentSlots, profile);
        
        // 2. Fetch RAG Context if needed
        let legalContext = "";
        const lastMessage = history[history.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
            legalContext = await getVectorContext(lastMessage.content, undefined, profile);
        }

        // 3. Build System Prompt (DYNAMIC FROM DB)
        const { getLiveSystemPrompt } = await import('./config');
        const systemPrompt = await getLiveSystemPrompt();
        
        const dateContext = `FECHA ACTUAL ESPAÑA: ${new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}`;
        const stateContext = `[ESTADO ACTUAL]: ${currentState}\n[DATOS CAPTURADOS]: ${JSON.stringify(currentSlots)}\n[LO QUE FALTA]: ${missing}\n[INSTRUCCIÓN SUGERIDA]: ${instruction}`;
        
        const dynamicSystemPrompt = `${systemPrompt}\n\n${dateContext}\n\n[CONTEXTO LEGAL]:\n${legalContext}\n\n${stateContext}`;

        // 4. Use Vertex AI specifically to avoid 403 error
        const model = getModel();
        const provider = getAIProvider();
        const { GENAI_CONFIG } = await import('./config');
        
        console.log(`[AI_INFO] Sending to ${provider} with model:`, (model as any).modelId || (model as any).modelName || 'unknown', `Temperature:`, GENAI_CONFIG.temperature);

        const result = await streamObject({
            model: model,
            temperature: GENAI_CONFIG.temperature,
            system: dynamicSystemPrompt,
            messages: history.map(msg => ({
                role: (msg.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
                content: msg.content,
            })),
            schema: AIResponseSchema,
        });

        // Yield debug info
        yield JSON.stringify({ type: 'prompt-debug', content: dynamicSystemPrompt });

        let fullAnswer = "";
        let finalResponse: any = null;

        for await (const partialObject of result.partialObjectStream) {
            if (partialObject?.answer && partialObject.answer !== fullAnswer) {
                const delta = partialObject.answer.slice(fullAnswer.length);
                fullAnswer = partialObject.answer;
                yield JSON.stringify({ type: 'text-delta', content: delta });
            }
        }

        finalResponse = await result.object;
        
        // 5. Yield State Update
        const nextState = getNextState(currentState, currentSlots, finalResponse.next_state_suggestion, profile);
        yield JSON.stringify({ 
            type: 'state-update', 
            state: nextState,
            slots: { ...currentSlots, ...finalResponse.extracted_slots }
        });

    } catch (e: any) {
        console.error('[ACTIONS] Error in sendMessage:', e);
        yield JSON.stringify({ type: 'text-delta', content: `Error crítico: ${e.message}` });
    }
}
