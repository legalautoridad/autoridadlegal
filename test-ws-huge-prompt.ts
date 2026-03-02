import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function run() {
    const model = "models/gemini-2.5-flash-native-audio-latest";

    // Try passing a 50k character system prompt to simulate the RAG context
    const hugeText = "CONTEXT ".repeat(10000);

    console.log(`Testing huge text...`);
    try {
        let closed = false;
        const session = await ai.live.connect({
            model,
            config: {
                systemInstruction: { parts: [{ text: hugeText }] },
                responseModalities: ["AUDIO"],
            },
            callbacks: {
                onclose: (e: any) => {
                    console.error(` -> SERVER CLOSED (Code: ${e.code}): ${e.reason}`);
                    closed = true;
                },
                onmessage: () => { }
            }
        });

        await new Promise(r => setTimeout(r, 1000));
        if (!closed) {
            console.log(` -> SUCCESS! Socket stayed open.`);
            session.close();
        }
    } catch (e: any) {
        console.error(` -> FAILED: ${e.message}`);
    }
}
run();
