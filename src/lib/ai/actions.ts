'use server';
console.log('[ACTIONS] File loaded at ' + new Date().toISOString());

import { streamText } from 'ai';
import { getModel, getAIProvider } from './providers';
import { getVectorContext } from '@/lib/ai/get-context';

export type Message = {
    role: 'user' | 'model';
    content: string;
};

export type ChatProfile = 'alcoholemia' | 'general';

export async function* sendMessage(history: Message[], profile: ChatProfile = 'alcoholemia', debug: boolean = false) {
    try {
        console.log(`--- SendMessage AI Execution ---`);
        
        // 1. Fetch RAG Context if needed
        let legalContext = "";
        const lastMessage = history[history.length - 1];
        if (lastMessage && lastMessage.role === 'user') {
            legalContext = await getVectorContext(lastMessage.content, undefined, profile);
        }

        // 2. Build System Prompt (DYNAMIC FROM DB)
        const { getLiveSystemPrompt } = await import('./config');
        const systemPrompt = await getLiveSystemPrompt();
        
        const dateContext = `FECHA ACTUAL ESPAÑA: ${new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}`;
        
        const debugContext = debug ? `[DEBUG: true]` : "";
        const dynamicSystemPrompt = `${systemPrompt}\n\n${dateContext}\n\n${debugContext}\n\n[CONTEXTO LEGAL]:\n${legalContext}`;

        // 3. Send to LLM
        const model = getModel();
        const provider = getAIProvider();
        const { GENAI_CONFIG } = await import('./config');
        
        console.log(`[AI_INFO] Sending to ${provider} with model:`, (model as any).modelId || (model as any).modelName || 'unknown', `Temperature:`, GENAI_CONFIG.temperature);

        const result = await streamText({
            model: model,
            temperature: GENAI_CONFIG.temperature,
            system: dynamicSystemPrompt,
            messages: history.map(msg => ({
                role: (msg.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
                content: msg.content,
            })),
        });

        // Yield debug info
        yield JSON.stringify({ type: 'prompt-debug', content: dynamicSystemPrompt });

        for await (const chunk of result.textStream) {
            yield JSON.stringify({ type: 'text-delta', content: chunk });
        }

    } catch (e: any) {
        console.error('[ACTIONS] Error in sendMessage:', e);
        yield JSON.stringify({ type: 'text-delta', content: `Error crítico: ${e.message}` });
    }
}
