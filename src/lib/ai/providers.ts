import { createVertex } from '@ai-sdk/google-vertex';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
console.log('[PROVIDERS] File loaded at ' + new Date().toISOString());

export type AIProvider = 'google' | 'vertex' | 'deepseek' | 'ollama';

/**
 * Gets the AI provider from environment variables.
 * Defaults to 'vertex' for safety against 403 errors with the direct Google SDK.
 */
export function getAIProvider(): AIProvider {
    const provider = (process.env.AI_PROVIDER || 'vertex') as AIProvider;
    console.log(`[AI_PROVIDER_CHECK] Using provider: ${provider}`);
    return provider;
}

/**
 * Returns a configured model instance based on environment variables.
 * Centralizes configuration to .env.local
 */
export function getModel() {
    const provider = getAIProvider();
    
    // Default to gemini-2.0-flash if not specified
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    
    const project = process.env.GOOGLE_NUMERO_PROYECTO || '842430822950';
    const location = process.env.GOOGLE_VERTEX_LOCATION || 'europe-southwest1';

    console.log(`[AI_MODEL_CHECK] Provider: ${provider}, Model: ${modelName}, Project: ${project}`);

    if (provider === 'vertex') {
        const vertex = createVertex({
            project: project,
            location: location,
        });
        return vertex(modelName);
    }

    if (provider === 'google') {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
        });
        return google(modelName);
    }

    // Fallback/Legacy: If someone really wants the direct Google SDK, we can add it back here,
    // but we prioritize Vertex to avoid the 403 authorization issues recently encountered.
    throw new Error(`Provider ${provider} is not fully configured or supported in this simplified routing.`);
}

/**
 * Returns the embedding model for RAG operations.
 */
export function getEmbeddingModel() {
    const provider = getAIProvider();
    const project = process.env.GOOGLE_NUMERO_PROYECTO || '842430822950';
    const location = process.env.GOOGLE_VERTEX_LOCATION || 'europe-southwest1';
    const modelName = 'text-embedding-005';

    if (provider === 'google') {
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
        });
        return google.textEmbeddingModel('gemini-embedding-001', {
            outputDimensionality: 768,
        });
    }

    // Default to Vertex (Production)
    const vertex = createVertex({
        project: project,
        location: location,
    });

    return vertex.textEmbeddingModel('text-embedding-005', {
        outputDimensionality: 768,
    });
}
