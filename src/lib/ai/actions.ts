'use server';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleAICacheManager } from '@google/generative-ai/server';
import { createStreamableValue } from 'ai/rsc';
import { GENAI_CONFIG, SYSTEM_PROMPT } from './config';
import { getContextForService } from '@/lib/ai/get-context';
import { pricingToolDefinition, calculateLegalQuote, agreementToolDefinition, generateAgreement } from './tools';

export interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function sendMessage(history: Message[]) {
    const stream = createStreamableValue('');

    (async () => {
        try {
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

            // 1. Get Content
            const legalContext = getContextForService('alcoholemia');
            // Use the new SYSTEM_PROMPT imported from config
            const personaPrompt = SYSTEM_PROMPT;

            let model;
            let finalSystemInstruction = personaPrompt;

            const toolConfig = {
                functionDeclarations: [pricingToolDefinition, agreementToolDefinition],
            };

            // PROGRESSIVE TOOL AVAILABILITY
            // To prevent the model from jumping to "Pricing" immediately, we disable tools
            // for the first few turns. The model should only "sell" after diagnosing.
            // History: [User] -> Length 1 (Start)
            // History: [User, Model, User] -> Length 3 (Turn 2)
            // History: [User, Model, User, Model, User] -> Length 5 (Turn 3/4)
            // Let's enable tools only after history length is >= 4 (At least 2 exchanges).
            const shouldEnableTools = history.length >= 4; // Turn 3 onwards
            const activeTools = shouldEnableTools ? [toolConfig] : [];

            // 2. BYPASS CACHING FOR DEBUGGING
            // We are disabling caching to ensure the new SYSTEM_PROMPT is strictly applied on every request.
            // This eliminates stale cache issues.
            /*
            try {
                // Determine if we are in a production-like env compatible with caching or just try
                // Note: gemini-2.5-flash might support caching but depends on tier.

                // Construct cache content
                // Currently only supported in Paid Tier for some models, but let's try.
                console.log('Attempting to create Context Cache with model:', GENAI_CONFIG.model);
                const cache = await cacheManager.create({
                    model: GENAI_CONFIG.model,
                    displayName: 'legal_context_cache',
                    systemInstruction: personaPrompt,
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: legalContext }],
                        },
                    ],
                    ttlSeconds: 3600,
                });

                console.log('Context Cache created successfully:', cache.name);

                model = genAI.getGenerativeModel({
                    model: GENAI_CONFIG.model,
                    cachedContent: cache.name,
                    tools: activeTools,
                    safetySettings,
                });

                // If cached, system instruction is already in cache, no need to send again?
                // Actually, creating model with cachedContent usually implies the context is there.
                // But we must check if systemInstruction override is allowed or if it's baked in.
                // According to SDK, it's baked in.
                finalSystemInstruction = ''; // Clear it to avoid duplication if baked in

            } catch (cacheError: any) {
                console.warn('Cache creation failed (likely Free Tier quota or Model mismatch). Falling back to standard prompt.');
                console.error('Cache Error Details:', cacheError.message);

                // Fallback: Standard Model with concatenated prompt
                // IMPORTANT: We inject the Context + Prompt into the systemInstruction.
                // We DO NOT modify the history array to avoid the "role filter" error.
                model = genAI.getGenerativeModel({
                    model: GENAI_CONFIG.model,
                    tools: activeTools,
                    safetySettings,
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: `${personaPrompt}\n\n${legalContext}` }]
                    }
                });
            }
            */

            console.log('Using Standard Model (No Cache) to enforce System Prompt.');

            // Explicitly define systemInstruction with parts/text structure
            const systemInstructionContent = {
                role: 'system',
                parts: [{ text: `${personaPrompt}\n\n${legalContext}` }]
            };

            model = genAI.getGenerativeModel({
                model: GENAI_CONFIG.model,
                tools: activeTools,
                safetySettings,
                systemInstruction: systemInstructionContent
            });

            // 3. Validate and Clean History
            // Gemini API requires the history to start with 'user'.
            // If the first message is 'model', we must remove it or ensure the first is user.
            // Also, we need to separate the "history" from the "current message" for sendMessageStream(current)
            // The history passed to startChat should be everything OLDER than the last message.

            const lastMessage = history[history.length - 1];
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
            if (error.message?.includes('API key')) {
                console.error('Check your GOOGLE_GENAI_API key in .env.local');
            }
            stream.error('Lo siento, ha ocurrido un error al conectar con el asistente. (Ver logs servidor)');
        }
    })();

    return { output: stream.value };
}
