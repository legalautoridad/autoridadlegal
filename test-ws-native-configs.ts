import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function run() {
    const model = "models/gemini-2.5-flash-native-audio-latest";

    const testConfigs: any = [
        {
            name: "Full App Config", config: {
                systemInstruction: { parts: [{ text: "Hello" }] },
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
            }
        }
    ];

    for (const t of testConfigs) {
        console.log(`\nTesting ${t.name}...`);
        try {
            let closed = false;
            const session = await ai.live.connect({
                model,
                config: t.config,
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
}
run();
