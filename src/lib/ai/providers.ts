import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createVertex } from '@ai-sdk/google-vertex';

export type AIProvider = 'google' | 'vertex' | 'deepseek' | 'ollama';

export function getAIProvider() {
    const provider = (process.env.AI_PROVIDER || 'google') as AIProvider;
    return provider;
}

export function getModel() {
    const provider = getAIProvider();

    if (provider === 'vertex') {
        const project = process.env.GOOGLE_NUMERO_PROYECTO || 'autoridadlegal';
        const location = process.env.GOOGLE_VERTEX_LOCATION || 'europe-southwest1'; // default vertex location

        const vertex = createVertex({ project, location });

        // If a specific LLaMA endpoint is provided, use its fully qualified endpoint resource name
        if (process.env.VERTEX_MODEL_ENDPOINT) {
            return vertex(`projects/${project}/locations/${location}/endpoints/${process.env.VERTEX_MODEL_ENDPOINT}`);
        }

        return vertex(process.env.GEMINI_MODEL || 'gemini-2.5-flash');
    }

    if (provider === 'deepseek') {
        const deepseek = createOpenAI({
            apiKey: process.env.DEEPSEEK_API_KEY || 'no-key',
            baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
        });
        return deepseek(process.env.DEEPSEEK_MODEL || 'deepseek-chat');
    }

    if (provider === 'ollama') {
        const ollama = createOpenAI({
            apiKey: 'ollama', // Ollama doesn't need a key, but createOpenAI might require one
            baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
        });
        return ollama(process.env.OLLAMA_MODEL || 'deepseek-r1:latest');
    }

    // Default to Google
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });
    return google(process.env.GEMINI_MODEL || 'gemini-2.5-flash');
}
