import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

async function listModels() {
    try {
        // There is no direct listModels in the standard SDK easily accessible?
        // Actually, let's try a direct fetch to the endpoint to see what's available
        const apiKey = process.env.GOOGLE_GENAI_API_KEY!;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('Available Models:');
        if (data.models) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods.includes('embedContent')) {
                    console.log(`- ${m.name} (Supports embedding)`);
                } else {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('No models found or error:', data);
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
