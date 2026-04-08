
export const GENAI_CONFIG = {
    apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENAI_API || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
};

export const DEEPSEEK_CONFIG = {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
};

export const DEFAULT_SYSTEM_PROMPT = ``;