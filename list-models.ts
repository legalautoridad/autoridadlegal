import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
async function run() {
    try {
        const modelsResponse = await ai.models.list();
        for await (const m of modelsResponse) {
            if (m.name.includes("gemini-2.0") || m.name.includes("-exp")) {
                console.log(`Model: ${m.name}`);
                console.log(` - bidi supported:`, m.supportedActions);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
