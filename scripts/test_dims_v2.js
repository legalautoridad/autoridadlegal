const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-2-preview" });
        const result = await model.embedContent("Hello world");
        console.log('Model: gemini-embedding-2-preview');
        console.log('Dimension:', result.embedding.values.length);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
