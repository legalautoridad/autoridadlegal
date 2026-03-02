'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useLiveAPI } from '@/lib/live-api/hooks/use-live-api';
import { AudioRecorder } from '@/lib/live-api/audio-recorder';
import { Mic, MicOff, Loader2, PhoneOff, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatState, ChatSlots, getNextState, getPromptInstructionsForState } from '@/lib/ai/state';

interface LiveAudioSessionProps {
    apiKey: string;
    systemPrompt: string;
    onClose: () => void;
    onMessage: (message: { role: 'user' | 'model', content: string }) => void;
    currentSlots?: ChatSlots;
    setChatSlots?: (slots: ChatSlots) => void;
    setChatState?: (state: ChatState) => void;
}

export function LiveAudioSession({
    apiKey,
    systemPrompt,
    onClose,
    onMessage,
    currentSlots,
    setChatSlots,
    setChatState
}: LiveAudioSessionProps) {
    const { client, connected, connect, setConfig, volume } = useLiveAPI({
        apiKey
    });

    const audioRecorder = useRef<AudioRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [userVolume, setUserVolume] = useState(0);
    const hasStartedOnce = useRef(false);

    // Collect text parts during a turn
    const modelTextBuffer = useRef("");
    const userTextBuffer = useRef("");

    // 1. Tool definitions
    const tools = useMemo(() => [
        {
            functionDeclarations: [{
                name: "update_conversation_state",
                description: "Actualiza los datos extraídos (slots) y el estado de la conversación.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        next_state: { type: "STRING" },
                        extracted_slots: {
                            type: "OBJECT",
                            properties: {
                                name: { type: "STRING" },
                                city: { type: "STRING" },
                                rate: { type: "STRING" },
                                incident_type: { type: "STRING" },
                                priors: { type: "STRING" },
                                has_citation: { type: "BOOLEAN" },
                                citation_date: { type: "STRING" },
                                dependents: { type: "BOOLEAN" },
                                work_status: { type: "STRING" },
                                needs_license_for_work: { type: "BOOLEAN" }
                            }
                        }
                    }
                }
            }]
        }
    ], []);

    // 2. Connection sequence
    const handleConnect = useCallback(async () => {
        console.log("[VOICE] handleConnect called. hasStartedOnce:", hasStartedOnce.current);
        if (hasStartedOnce.current) return;
        hasStartedOnce.current = true;

        setIsConnecting(true);
        setMicError(null);

        try {
            console.log("[VOICE] Initializing credentials and config...", {
                hasApiKey: !!apiKey,
                apiKeyPrefix: apiKey?.slice(0, 5),
                hasPrompt: !!systemPrompt
            });

            const liveConfig = {
                systemInstruction: { parts: [{ text: "Eres un asistente legal experto. " + systemPrompt }] },
                responseModalities: ["AUDIO"] as any,
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
                },
                // Desactivado temporalmente a petición del usuario para evitar el bloqueo del bot
                // tools: tools as any
            };

            setConfig(liveConfig);

            if (!audioRecorder.current) {
                audioRecorder.current = new AudioRecorder();
                audioRecorder.current.on('data', (base64) => {
                    if (client && client.status === 'connected') {
                        try {
                            if (Math.random() < 0.01) console.log("[VOICE] Sending audio chunk to Gemini...");
                            client.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: base64 }]);
                        } catch (e) { }
                    }
                });

                // Simple client-side VAD
                let consecutiveLowVol = 0;
                let activelySpeaking = false;

                audioRecorder.current.on('volume', (v) => {
                    setUserVolume(v);

                    if (v > 0.015) { // Lower threshold for speech
                        activelySpeaking = true;
                        consecutiveLowVol = 0;
                    } else if (activelySpeaking && v <= 0.005) { // Silence threshold
                        consecutiveLowVol++;
                        // After ~1.2s of silence (assuming volume fires ~25 times/sec from 25ms interval)
                        if (consecutiveLowVol > 30) {
                            console.log("[VOICE] 🟢 Client VAD: User stopped speaking. Sending turnComplete!");
                            activelySpeaking = false;
                            consecutiveLowVol = 0;
                            if (client && client.status === 'connected' && client.session) {
                                try {
                                    client.session.sendClientContent({ turnComplete: true } as any);
                                } catch (e) { console.warn("Failed to send turnComplete", e); }
                            }
                        }
                    }
                });
            }
            console.log("[VOICE] Starting AudioRecorder...");
            try {
                await audioRecorder.current.start();
                console.log("[VOICE] AudioRecorder started successfully.");
            } catch (micErr) {
                console.error("[VOICE] Detailed Microphone Error:", micErr);
                throw micErr;
            }
            setIsRecording(true);

            console.log("[VOICE] Calling client.connect()...");

            // Remove the inline 10s timeout, moving to a declarative useEffect
            try {
                console.log("[VOICE] Awaiting client.connect(liveConfig)...");
                await connect(liveConfig);
                console.log("[VOICE] client.connect() promise resolved.");
            } catch (connErr) {
                console.error("[VOICE] Detailed Connection Error:", connErr);
                throw connErr;
            }
        } catch (e: any) {
            console.warn("[VOICE] Startup failed:", e);
            setIsConnecting(false);
            let userMessage = "Error al conectar.";
            if (e.name === 'NotFoundError') userMessage = "No se ha encontrado micrófono.";
            setMicError(userMessage);
            setIsConnecting(false);
            hasStartedOnce.current = false;
        }
    }, [systemPrompt, tools, setConfig, connect, client]);

    // Global connection timeout
    useEffect(() => {
        if (isConnecting && !connected) {
            const connectTimeout = setTimeout(() => {
                console.warn("[VOICE] Global connection timeout after 15s");
                setIsConnecting(false);
                setMicError("Tiempo de conexión agotado.");
            }, 15000);
            return () => clearTimeout(connectTimeout);
        }
    }, [isConnecting, connected]);

    // Main lifecycle
    useEffect(() => {
        handleConnect();
        return () => {
            if (audioRecorder.current) {
                audioRecorder.current.stop();
                audioRecorder.current = null;
            }
            if (client) {
                try { client.disconnect(); } catch (e) { }
            }
        };
    }, [handleConnect, client]);

    // Initial Greeting Trigger
    useEffect(() => {
        if (!connected) return;

        let setupHandled = false;
        const onSetupComplete = () => {
            if (setupHandled) return;
            setupHandled = true;
            console.log("[VOICE] setupcomplete received, microphone is ready.");
            setIsConnecting(false);
            // We intentionally do NOT send any text or turnComplete signals here.
            // Sending text to a Native Audio model can permanently break its Voice Activity Detection (VAD).
            // The connection is now open; the user must speak first to trigger the AI.
        };

        client.on("setupcomplete", onSetupComplete);

        // Failsafe: If setupcomplete hasn't arrived in 3s after connected=true, trigger anyway
        const failsafe = setTimeout(() => {
            if (!setupHandled) {
                console.warn("[VOICE] setupcomplete failsafe triggered (3s elapsed)");
                onSetupComplete();
            }
        }, 3000);

        return () => {
            client.off("setupcomplete", onSetupComplete);
            clearTimeout(failsafe);
        };
    }, [connected, client]);

    // Synchronization and Transcription
    useEffect(() => {
        const onContent = (data: any) => {
            // Model transcripts from modelTurn
            if (data.modelTurn?.parts) {
                data.modelTurn.parts.forEach((p: any) => {
                    if (p.text) modelTextBuffer.current += (modelTextBuffer.current ? " " : "") + p.text;
                });
            }
            // User transcripts from userContent (STT)
            if (data.userContent?.parts) {
                console.log("[VOICE] STT Metadata:", data.userContent);
                data.userContent.parts.forEach((p: any) => {
                    if (p.text) {
                        console.log("[VOICE] Partial STT:", p.text);
                        userTextBuffer.current += (userTextBuffer.current ? " " : "") + p.text;
                    }
                });
            }
        };

        const onTurnComplete = () => {
            // Helper to check if text is internal reasoning
            const isReasoning = (t: string) => {
                // We are removing the aggressive reasoning filter because it was causing the audio 
                // pipeline to appear broken when the model started with internal monologue.
                return false;
            };

            const cleanText = (t: string) => {
                if (isReasoning(t)) {
                    console.log("[VOICE] SCRUBBED REASONING PARA:", t);
                    return "";
                }
                const cleaned = t.replace(/\*\*.*?\*\*/g, '').replace(/\[.*?\]/g, '').trim();
                if (cleaned) console.log("[VOICE] Clean Text to Show:", cleaned);
                return cleaned;
            };

            // Push user transcript if any
            if (userTextBuffer.current.trim()) {
                const text = userTextBuffer.current.trim();
                console.log("[VOICE] User Transcript:", text);
                // Filter out our own synthetic intro signal if it echoes back
                const isIntroSignal = text.includes("Hola, soy tu asistente especialista") ||
                    text.includes("orientaré en tu problema") ||
                    text.includes("dime tu nombre");
                if (!isIntroSignal) {
                    onMessage({ role: 'user', content: text });
                }
                userTextBuffer.current = "";
            }
            // Push model transcript if any
            if (modelTextBuffer.current.trim()) {
                let text = modelTextBuffer.current.trim();
                console.log("[VOICE] Raw Model Transcript:", text);

                if (isReasoning(text)) {
                    console.log("[VOICE] Reasoning detected, cleaning...");
                    text = cleanText(text);
                }

                if (text.length > 5) {
                    console.log("[VOICE] Finalized Model Transcript:", text);
                    onMessage({ role: 'model', content: text });
                }
                modelTextBuffer.current = "";
            }
        };

        client.on('content', onContent);
        client.on('turncomplete', onTurnComplete);

        return () => {
            client.off('content', onContent);
            client.off('turncomplete', onTurnComplete);
        };
    }, [client, onMessage]);

    // Tool calls
    useEffect(() => {
        const onToolCall = (toolCall: any) => {
            const fc = toolCall.functionCalls?.find((f: any) => f.name === "update_conversation_state");
            if (fc && fc.args) {
                console.log("[VOICE] Tool Call: update_conversation_state", fc.args);
                const { next_state, extracted_slots } = fc.args;

                let newSlots = { ...(currentSlots || {}) };
                if (extracted_slots && setChatSlots) {
                    Object.entries(extracted_slots).forEach(([key, val]) => {
                        if (val !== null && val !== undefined && val !== "") (newSlots as any)[key] = val;
                    });
                    setChatSlots(newSlots);
                }

                if (next_state && setChatState) setChatState(next_state as ChatState);

                // Compute next instruction
                const computedNextState = getNextState(next_state as ChatState, newSlots, next_state, 'alcoholemia');
                const { instruction } = getPromptInstructionsForState(computedNextState, newSlots, 'alcoholemia', true);

                try {
                    client.sendToolResponse({
                        functionResponses: toolCall.functionCalls.map((f: any) => ({
                            id: f.id,
                            name: f.name,
                            response: {
                                result: "success",
                                mandatory_action: "Habla inmediatamente aplicando la siguiente instrucción.",
                                system_instruction_for_this_turn: instruction
                            }
                        }))
                    });
                } catch (e) {
                    console.error("[VOICE] Tool response error:", e);
                }
            }
        };
        client.on('toolcall', onToolCall);
        return () => { client.off('toolcall', onToolCall); };
    }, [client, currentSlots, setChatSlots, setChatState]);

    return (
        <div className="flex flex-col w-full bg-white border-b border-indigo-100 shadow-sm overflow-hidden animate-in slide-in-from-top duration-300">
            {/* Audio Visualization Bars */}
            <div className="flex flex-col w-full h-1.5 bg-slate-100 overflow-hidden relative">
                {/* Outgoing (AI Response) Volume */}
                <div
                    className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-100 ease-out z-10"
                    style={{ width: `${Math.min(100, volume * 500)}%` }}
                />
                {/* Incoming (User Mic) Volume - overlayed subtle */}
                <div
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-green-400 transition-all duration-75 ease-out opacity-60 z-20"
                    style={{ width: `${Math.min(100, userVolume * 500)}%` }}
                />
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-indigo-50/30">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {connected && !isConnecting && (
                            <div className="absolute -inset-1 bg-indigo-400 rounded-full animate-ping opacity-20" />
                        )}
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            isConnecting ? "bg-white shadow-sm" : connected ? "bg-indigo-600 shadow-md" : "bg-slate-200"
                        )}>
                            {isConnecting ? (
                                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                            ) : (
                                <Mic className={cn("h-5 w-5", connected ? "text-white" : "text-slate-400")} />
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {micError ? "Error de micrófono" : isConnecting ? "Conectando voz..." : connected ? "Llamada en curso" : "Modo Voz"}
                            {connected && (
                                <button
                                    onClick={() => client?.send([{ text: "Por favor, responde a esto en voz alta diciendo que me escuchas." }])}
                                    className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-xs rounded-md shadow-sm transition-colors text-slate-700 font-medium"
                                >
                                    Fuerza
                                </button>
                            )}
                        </h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            {micError ? micError : isConnecting ? "Espera un momento..." : connected ? "La IA te está escuchando" : "Inicializando..."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>
                    <button
                        onClick={() => {
                            if (audioRecorder.current) audioRecorder.current.stop();
                            if (client) client.disconnect();
                            onClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-bold shadow-sm transition-all"
                    >
                        <PhoneOff className="h-3 w-3" />
                        {micError ? "Cerrar" : "Colgar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
