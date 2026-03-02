import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
async function run() {
    const models = [
        "models/gemini-2.0-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-2.5-flash-native-audio-latest"
    ];
    for (const model of models) {
        try {
            console.log(`\nTesting ${model} ...`);
            const session = await ai.live.connect({ model });
            console.log(`SUCCESS! model ${model} connected.`);
            session.close();
            return;
        } catch (e: any) {
            console.error(`FAILED: ${e.message}`);
        }
    }
}
run();
