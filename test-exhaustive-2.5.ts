import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const aiV1Alpha = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY, httpOptions: { apiVersion: "v1alpha" } });
const aiV1Beta = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY, httpOptions: { apiVersion: "v1beta" } });
const aiV1 = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY, httpOptions: { apiVersion: "v1" } });

async function test(name: string, client: any, model: string) {
    console.log(`Testing ${model} on ${name}...`);
    try {
        let closed = false;
        const session = await client.live.connect({
            model,
            config: { responseModalities: ["AUDIO"] },
            callbacks: {
                onclose: (e: any) => {
                    console.error(` -> CLOSED: ${e.code} - ${e.reason}`);
                    closed = true;
                },
                onmessage: (msg: any) => {
                    if (msg.setupComplete) console.log(" -> SETUP COMPLETE!");
                }
            }
        });
        await new Promise(r => setTimeout(r, 1500));
        if (!closed) {
            console.log(" -> STILL OPEN (SUCCESS)");
            session.close();
        }
    } catch (e: any) {
        console.error(` -> ERROR: ${e.message}`);
    }
}

async function run() {
    const model = "models/gemini-2.5-flash-native-audio-latest";
    const clients = [
        { name: "v1alpha", client: aiV1Alpha },
        { name: "v1beta", client: aiV1Beta },
        { name: "v1", client: aiV1 }
    ];

    for (const c of clients) {
        await test(c.name, c.client, model);
    }
}
run();
