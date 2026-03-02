import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
const aiAlpha = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY, httpOptions: { apiVersion: "v1alpha" } });

async function run() {
    const models = [
        "models/gemini-2.0-flash",
        "models/gemini-2.0-flash-exp",
        "models/gemini-2.5-flash-native-audio-latest"
    ];

    for (const m of models) {
        console.log(`\nTesting ${m} on v1beta...`);
        try {
            let closed = false;
            const session = await ai.live.connect({
                model: m,
                callbacks: {
                    onclose: (e: any) => {
                        console.error(` -> SERVER CLOSED (Code: ${e.code}): ${e.reason}`);
                        closed = true;
                    }
                }
            });
            await new Promise(r => setTimeout(r, 1000));
            if (!closed) {
                console.log(` -> SUCCESS!`);
                session.close();
            }
        } catch (e: any) {
            console.error(` -> FAILED: ${e.message}`);
        }

        console.log(`Testing ${m} on v1alpha...`);
        try {
            let closed = false;
            const session = await aiAlpha.live.connect({
                model: m,
                callbacks: {
                    onclose: (e: any) => {
                        console.error(` -> SERVER CLOSED (Code: ${e.code}): ${e.reason}`);
                        closed = true;
                    }
                }
            });
            await new Promise(r => setTimeout(r, 1000));
            if (!closed) {
                console.log(` -> SUCCESS!`);
                session.close();
            }
        } catch (e: any) {
            console.error(` -> FAILED: ${e.message}`);
        }
    }
}
run();
