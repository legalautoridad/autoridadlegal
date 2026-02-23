import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export type AIProvider = 'google' | 'deepseek';

export function getAIProvider() {
    const provider = (process.env.AI_PROVIDER || 'google') as AIProvider;
    return provider;
}

export function getModel() {
    const provider = getAIProvider();

    if (provider === 'deepseek') {
        const deepseek = createOpenAI({
            apiKey: process.env.DEEPSEEK_API_KEY || 'no-key',
            baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        });
        return deepseek(process.env.DEEPSEEK_MODEL || 'deepseek-chat');
    }

    // Default to Google
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });
    return google(process.env.GEMINI_MODEL || 'gemini-2.0-flash');
}
