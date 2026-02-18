'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleAICacheManager } from '@google/generative-ai/server';
import { createStreamableValue } from 'ai/rsc';
import { GENAI_CONFIG, SYSTEM_PROMPT } from './config';
import { getVectorContext } from '@/lib/ai/get-context';
import { pricingToolDefinition, calculateLegalQuote, agreementToolDefinition, generateAgreement } from './tools';

export interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function sendMessage(history: Message[]) {
    const stream = createStreamableValue('');

    (async () => {
        try {
            console.log('--- SendMessage AI Execution ---');
            console.log('Model:', GENAI_CONFIG.model);
            const genAI = new GoogleGenerativeAI(GENAI_CONFIG.apiKey);
            const cacheManager = new GoogleAICacheManager(GENAI_CONFIG.apiKey);

            // Safety Settings: Allow legal advice discussion (prevent "Dangerous Content" blocks)
            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ];

            // 1. Get Dynamic Context (Vector RAG)
            const lastMessage = history[history.length - 1];
            const legalContext = await getVectorContext(lastMessage.content);

            // Use the new SYSTEM_PROMPT imported from config
            const personaPrompt = SYSTEM_PROMPT;

            const toolConfig = {
                functionDeclarations: [pricingToolDefinition, agreementToolDefinition],
            };

            // PROGRESSIVE TOOL AVAILABILITY
            // Enable tools only after history length is >= 4 (At least 2 exchanges).
            const shouldEnableTools = history.length >= 4;
            const activeTools = shouldEnableTools ? [toolConfig] : [];

            console.log('Using Standard Model (No Cache) with Vector Context.');

            // Explicitly define systemInstruction with parts/text structure
            const systemInstructionContent = {
                role: 'system',
                parts: [{ text: `${personaPrompt}\n\n${legalContext}` }]
            };

            const model = genAI.getGenerativeModel({
                model: GENAI_CONFIG.model,
                tools: activeTools,
                safetySettings,
                systemInstruction: systemInstructionContent
            });

            // 3. Validate and Clean History
            let previousHistory = history.slice(0, -1); // All except last

            // Filter: Ensure strict user/model alternation starting with user
            // Simple heuristic: If first message is model, drop it.
            if (previousHistory.length > 0 && previousHistory[0].role === 'model') {
                console.warn('History validation: Dropping first message because it is from "model".');
                previousHistory = previousHistory.slice(1);
            }

            // 4. Chat
            console.log('Starting chat with model...');
            const chat = model.startChat({
                history: previousHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }],
                })),
            });

            console.log('Sending message to model...');
            // lastMessage is already defined above
            const result = await chat.sendMessageStream(lastMessage.content);

            // 5. Handle Tool Execution (Function Calling)
            // If the model decides to call a function, we must execute it and then
            // feed the result back to the model so it can generate the FINAL text response.
            let functionCallDetected = false;
            let functionCallData: any = null;

            for await (const chunk of result.stream) {
                const calls = chunk.functionCalls();
                if (calls && calls.length > 0) {
                    console.log('Function Call Detected:', calls[0].name);
                    functionCallDetected = true;
                    functionCallData = calls[0];
                    // Do not stream the function call request to the user interface if possible, 
                    // or maybe we should to show "Thinking...".
                    // But for the user experience, we want the text response.
                    break;
                }
                const text = chunk.text();
                if (text) {
                    stream.update(text);
                }
            }

            if (functionCallDetected && functionCallData) {
                if (functionCallData.name === 'calculate_legal_quote') {
                    console.log('Executing calculateLegalQuote with args:', functionCallData.args);
                    const toolResult = calculateLegalQuote(functionCallData.args as any);

                    console.log('Tool Result:', toolResult);

                    // Send result back to model to get the natural language response
                    // This is the critical step: The model needs to see the tool output 
                    // and then generate the "Justification" + "Offer" text defined in the Service Prompt.
                    console.log('Sending tool response back to model for final generation...');

                    const finalResponse = await chat.sendMessageStream([
                        {
                            functionResponse: {
                                name: 'calculate_legal_quote',
                                response: toolResult
                            }
                        }
                    ]);

                    for await (const chunk of finalResponse.stream) {
                        const text = chunk.text();
                        if (text) {
                            stream.update(text);
                        }
                    }
                } else if (functionCallData.name === 'generate_agreement') {
                    console.log('Executing generateAgreement with args:', functionCallData.args);
                    const toolResult = generateAgreement(functionCallData.args as any);

                    console.log('Tool Result:', toolResult);

                    const finalResponse = await chat.sendMessageStream([
                        {
                            functionResponse: {
                                name: 'generate_agreement',
                                response: toolResult
                            }
                        }
                    ]);

                    for await (const chunk of finalResponse.stream) {
                        const text = chunk.text();
                        if (text) {
                            stream.update(text);
                        }
                    }
                }
            }

            stream.done();
        } catch (error: any) {
            console.error('CRITICAL ERROR in sendMessage:', error);
            console.error('Error Code:', error.code);
            console.error('Error Status:', error.status);
            console.error('Error Details:', JSON.stringify(error, null, 2));

            if (error.message?.includes('API key')) {
                console.error('Check your GOOGLE_GENAI_API key in .env.local');
            }
            stream.error(`Error: ${error.message || 'Error al conectar con el asistente'}`);
        }
    })();

    return { output: stream.value };
}
