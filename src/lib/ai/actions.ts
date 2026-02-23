'use server';

import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './config';
import { getVectorContext } from '@/lib/ai/get-context';
import { tools } from './tools';
import { getModel, getAIProvider } from './providers';

export interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function* sendMessage(history: Message[]) {
    try {
        const provider = getAIProvider();
        console.log(`--- SendMessage AI Execution (${provider}) ---`);
        const model = getModel();

        // 1. Get Dynamic Context (Vector RAG)
        const lastMessage = history[history.length - 1];
        const legalContext = await getVectorContext(lastMessage.content);
        const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${legalContext}`;

        const shouldEnableTools = history.length >= 4;
        const activeTools = shouldEnableTools ? tools : {};

        const result = await streamText({
            // @ts-ignore
            model: model,
            system: fullSystemPrompt,
            messages: history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content,
            })),
            tools: activeTools,
            maxSteps: 5,
        });

        for await (const delta of result.textStream) {
            yield delta;
        }
    } catch (error: any) {
        console.error('[AI_ACTION] Critical Error:', error);
        yield `[ERROR]: ${error?.message || 'Error al conectar con el asistente legal'}`;
    }
}
