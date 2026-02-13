import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENAI_API || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

async function testAI() {
    console.log('🧪 TESTING AI CONNECTIVITY');
    console.log('Model:', modelName);
    console.log('API Key present:', !!apiKey);

    if (!apiKey) {
        console.error('❌ ERROR: API Key is missing!');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log('Sending test message: "Hola"...');
        const result = await model.generateContent('Hola');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS!');
        console.log('AI Response:', text);
    } catch (error: any) {
        console.error('❌ CRITICAL ERROR DURING AI TEST:');
        console.error('Message:', error.message);
        if (error.stack) {
            console.error('Stack Trace:', error.stack);
        }
    }
}

testAI();
