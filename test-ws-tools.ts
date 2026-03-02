import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    httpOptions: { apiVersion: "v1alpha" }
});

async function run() {
    const model = "models/gemini-2.5-flash-native-audio-latest";

    console.log(`Testing Tools on Native Audio model...`);
    try {
        let closed = false;
        const session = await ai.live.connect({
            model,
            config: {
                responseModalities: ["AUDIO"],
                tools: [{
                    functionDeclarations: [{
                        name: "update_conversation_state",
                        description: "Update slots",
                        parameters: {
                            type: "OBJECT",
                            properties: { next_state: { type: "STRING" } }
                        }
                    }]
                }]
            },
            callbacks: {
                onclose: (e: any) => {
                    console.error(` -> SERVER CLOSED (Code: ${e.code}): ${e.reason || "No reason"}`);
                    closed = true;
                },
                onmessage: (msg: any) => {
                    if (msg.setupComplete) console.log(" -> SETUP COMPLETE!");
                }
            }
        });

        await new Promise(r => setTimeout(r, 2000));
        if (!closed) {
            console.log(` -> SUCCESS! Socket stayed open with tools.`);
            session.close();
        }
    } catch (e: any) {
        console.error(` -> FAILED: ${e.message}`);
    }
}
run();
