'use server';
console.log('[ACTIONS] File loaded at ' + new Date().toISOString());

import { streamText } from 'ai';
import { getModel, getAIProvider } from './providers';
import { getVectorContext } from '@/lib/ai/get-context';
import { headers } from 'next/headers';

export type Message = {
    role: 'user' | 'model';
    content: string;
};

export type ChatProfile = 'alcoholemia' | 'general';

export async function* sendMessage(history: Message[], profile: ChatProfile = 'alcoholemia', debug: boolean = false, currentSlots?: Record<string, any>) {
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
        
        const isWhatsapp = currentSlots?.systemin === 'whatsapp';

        if (!isWhatsapp && currentSlots) {
            try {
                const headersList = await headers();
                const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
                currentSlots.ipaddress = ip.split(',')[0].trim();
            } catch (e) {
                console.error('Failed to get IP address:', e);
            }
        }

        const debugContext = debug ? `[DEBUG: true]` : "";
        const slotsContext = currentSlots ? `[ESTADO ACTUAL SLOTS]:\n${JSON.stringify(currentSlots, null, 2)}` : "";
        
        let dynamicSystemPrompt = `${systemPrompt}\n\n${dateContext}\n\n${debugContext}\n\n${slotsContext}\n\n[CONTEXTO LEGAL]:\n${legalContext}`;

        // 2.1 Filter prompt by platform [WHATSAPP] or [WEBCHAT]
        
        if (isWhatsapp) {
            // Keep [WHATSAPP] blocks, remove [WEBCHAT] blocks
            dynamicSystemPrompt = dynamicSystemPrompt
                .replace(/\[WEBCHAT\][\s\S]*?\[\/WEBCHAT\]/gi, "")
                .replace(/\[WHATSAPP\]/gi, "")
                .replace(/\[\/WHATSAPP\]/gi, "");
        } else {
            // Keep [WEBCHAT] blocks, remove [WHATSAPP] blocks
            dynamicSystemPrompt = dynamicSystemPrompt
                .replace(/\[WHATSAPP\][\s\S]*?\[\/WHATSAPP\]/gi, "")
                .replace(/\[WEBCHAT\]/gi, "")
                .replace(/\[\/WEBCHAT\]/gi, "");
        }

        // 3. Send to LLM
        const model = getModel();
        const provider = getAIProvider();
        const { GENAI_CONFIG } = await import('./config');
        
        console.log(`[AI_INFO] Sending to ${provider} with model:`, (model as any).modelId || (model as any).modelName || 'unknown', `Temperature:`, GENAI_CONFIG.temperature);

        const result = await streamText({
            model: model,
            temperature: GENAI_CONFIG.temperature,
            system: dynamicSystemPrompt,
            messages: history
                .filter(msg => msg.content && msg.content.trim() !== '')
                .map(msg => ({
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
