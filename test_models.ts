import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
  const models = await ai.models.list();
  for await (const m of models) {
      if (m.supportedGenerationMethods?.includes('bidiGenerateContent')) {
          console.log(m.name);
      }
  }
}
main();
