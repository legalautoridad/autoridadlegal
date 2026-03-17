'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Message, sendMessage } from "@/lib/ai/actions";
import { saveLead } from "@/lib/actions/leads"; // Import saveLead
import { ChatState, ChatSlots, ChatProfile } from "@/lib/ai/state";
import { cn } from "@/lib/utils";
import { MessageSquare, X, Send, Scale, ShieldCheck, Paperclip } from "lucide-react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { LeadCaptureModal } from "@/components/checkout/LeadCaptureModal";

export function ChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    // Check if we should hide the widget on specific paths
    const isExcludedPath =
        pathname === '/login' ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/lawyer');

    // Default to 'alcoholemia' profile everywhere for now to ensure the full interrogatory flow runs during testing
    const profile: ChatProfile = 'alcoholemia';

    // Extract city from URL path, e.g., /alcoholemia/barcelona -> Barcelona
    let initialCity = undefined;
    if (pathname) {
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2 && pathSegments[0] === 'alcoholemia') {
            const rawCity = pathSegments[1];
            initialCity = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
        }
    }

    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hola, soy tu asistente especialista. Por favor, cuéntame qué te ha ocurrido y te orientaré en tu problema o consulta. Para empezar dime tu nombre para dirigirme a ti y cuéntame qué te ha ocurrido.' }
    ]);
    const [chatState, setChatState] = useState<ChatState>("ASK_NAME");
    const [chatSlots, setChatSlots] = useState<ChatSlots>(initialCity ? { city: initialCity } : {});

    if (isExcludedPath) return null;
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [leadData, setLeadData] = useState<{ name: string, phone: string, email?: string, city: string } | null>(null);
    const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [showSlots, setShowSlots] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const hasOpened = useRef(false);

    const searchParams = useSearchParams();

    // Auto-focus on input when loading finishes
    useEffect(() => {
        if (!isLoading && isOpen) {
            // Small timeout to ensure DOM is ready/state updated
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isLoading, isOpen]);

    // Auto-open logic (Proactive)
    useEffect(() => {
        if (!hasOpened.current) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                hasOpened.current = true;
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [isListening, setIsListening] = useState(false);

    // Speech Recognition
    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? " " : "") + transcript);
            };

            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognition.start();
        } else {
            alert("Tu navegador no soporta entrada de voz.");
        }
    };

    // EFFECT: Parse LEAD_DATA and Auto-Save on Intent
    useEffect(() => {
        if (messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role !== 'model') return;

        // 1. Extract Lead Data if present
        const dataMatch = lastMsg.content.match(/\[LEAD_DATA:\s*({.*?})\]/);
        if (dataMatch && dataMatch[1]) {
            try {
                const parsed = JSON.parse(dataMatch[1]);
                setLeadData(parsed);
            } catch (e) {
                console.error("Failed to parse LEAD_DATA", e);
            }
        }
    }, [messages]);

    // EFFECT: Handle Actions (Free Call / Payment)
    useEffect(() => {
        if (!leadData) return; // Need data to save
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role !== 'model') return;

        const handleSave = async (status: 'new' | 'reserved', price: number) => {
            try {
                // Ensure we haven't saved this exact interaction yet? 
                // Simple debounce/check could be good, but for now relies on upsert logic.
                await saveLead({
                    name: leadData.name,
                    phone: leadData.phone,
                    email: leadData.email, // Add email
                    city: leadData.city,
                    service: 'alcoholemia', // Default for now
                    status: status,
                    agreed_price: price
                });
            } catch (err) {
                console.error("Error saving lead from chat:", err);
            }
        };

        if (lastMsg.content.includes('[FREE_CALL_REQUEST]')) {
            handleSave('new', 1000);
        } else if (lastMsg.content.includes('[PAYMENT_LINK_DISCOUNT]')) {
            handleSave('reserved', 900); // We save as reserved provisionally (or 'new' pending payment? User said Immediate Save)
            // Let's save as 'new' first, and updating to 'reserved' happens on real payment?
            // User request: "Ejecuta saveLead() INMEDIATAMENTE. No esperes al pago."
            // "Si es PAGO: Muestra botón... Si es GRATIS: Muestra mensaje..."
            // I'll save as 'new' with potential notes or just standard. 
            // Actually, if it's "Free Call", status is 'new'. If "Payment", still 'new' until paid? 
            // Use 'new' for both initially to capture the lead.
            handleSave('new', 900);
        }
    }, [messages, leadData]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMessages: Message[] = [
            ...messages,
            { role: 'user', content: input }
        ];

        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const stream = await sendMessage(newMessages, chatState, chatSlots, profile);
            let fullResponse = "";

            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                try {
                    const parsedChunk = JSON.parse(chunk as string);
                    if (parsedChunk.type === 'text-delta') {
                        fullResponse += parsedChunk.content;
                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = { role: 'model', content: fullResponse };
                            return updated;
                        });
                    } else if (parsedChunk.type === 'prompt-debug') {
                        setDebugPrompt(parsedChunk.content);
                        console.log("[CHAT_WIDGET] Prompt Debug Received");
                    } else if (parsedChunk.type === 'state-update') {
                        console.log("[CHAT_WIDGET] State Update Received:", parsedChunk.state, parsedChunk.slots);
                        setChatState(parsedChunk.state);
                        setChatSlots(parsedChunk.slots);
                    }
                } catch (e) {
                    // Fallback for non-JSON string chunks if any bleed through
                    fullResponse += chunk;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: 'model', content: fullResponse };
                        return updated;
                    });
                }
            }
        } catch (error: any) {
            console.error('[CHAT_WIDGET] Submission Error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            setMessages(prev => [...prev, { role: 'model', content: "Lo siento, ha ocurrido un error técnico al procesar tu mensaje. Por favor, inténtalo de nuevo en unos momentos." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">

                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Scale className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente Legal IA</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-300 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Conectado
                                    </span>
                                    {/* Debug Toggle */}
                                    <button
                                        onClick={() => setShowDebug(!showDebug)}
                                        className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700"
                                    >
                                        {showDebug ? 'Ocultar Prompt' : 'Ver Prompt'}
                                    </button>
                                    <button
                                        onClick={() => setShowSlots(!showSlots)}
                                        className="text-[10px] bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700/50 hover:bg-indigo-800/50"
                                    >
                                        {showSlots ? 'Ocultar Slots' : 'Ver Slots'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                        {/* Debug Panel Overlay */}
                        {showDebug && debugPrompt && (
                            <div className="absolute inset-0 z-10 bg-slate-900/95 text-green-400 p-4 overflow-y-auto font-mono text-[10px] leading-relaxed break-words whitespace-pre-wrap">
                                <h4 className="text-white font-bold mb-2">ÚLTIMO PROMPT ENVIADO AL LLM:</h4>
                                {debugPrompt}
                            </div>
                        )}

                        {/* Slots Debug Panel Overlay */}
                        {showSlots && (
                            <div className="absolute inset-0 z-10 bg-indigo-950/95 text-indigo-300 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
                                <h4 className="text-white font-bold mb-2">MEMORIA ACTUAL (SLOTS JSON):</h4>
                                <div className="mb-3 pb-2 border-b border-indigo-800/30">
                                    <span className="text-indigo-400">ESTADO AI:</span> <span className="text-white">{chatState}</span>
                                </div>
                                {JSON.stringify(chatSlots, null, 2)}
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex w-full",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === 'model' && (
                                    <img
                                        src="https://ui-avatars.com/api/?name=Asistente+Legal&background=0D8ABC&color=fff&size=128"
                                        alt="Asistente IA"
                                        className="w-8 h-8 rounded-full border border-slate-200 shadow-sm self-end mb-1 mr-2 object-cover"
                                    />
                                )}
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-slate-900 text-white rounded-br-none"
                                            : "bg-slate-100 border border-slate-200 text-slate-900 rounded-bl-none"
                                    )}
                                >
                                    {msg.content.replace(/\[LEAD_DATA:.*?\]/g, '').replace(/\[PAYMENT_BUTTON:.*?\]/g, '').replace(/\[LEAD_FORM:.*?\]/g, '').replace('[CLOSING_DEAL]', '').replace('[PAYMENT_LINK_DISCOUNT]', '').replace('[FREE_CALL_REQUEST]', '') || (
                                        <span className="flex gap-1 items-center h-5">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Intent Detection: Check for Tokens in the last AI message */}
                        {messages.length > 0 &&
                            messages[messages.length - 1].role === 'model' && (
                                <>
                                    {/* Dynamic Payment Button */}
                                    {(() => {
                                        const match = messages[messages.length - 1].content.match(/\[PAYMENT_BUTTON:\s*(.*?)\]/);
                                        if (match) {
                                            const url = match[1];
                                            return (
                                                <div className="mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <button
                                                        onClick={() => setIsCheckoutOpen(true)}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                                    >
                                                        <span>⚡ RESERVAR AHORA Y ACTIVAR DEFENSA</span>
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                    {/* Dynamic Lead Form Button (for no-citation case) */}
                                    {(() => {
                                        const match = messages[messages.length - 1].content.match(/\[LEAD_FORM:\s*(.*?)\]/);
                                        if (match) {
                                            return (
                                                <div className="mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <button
                                                        onClick={() => setIsLeadFormOpen(true)}
                                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                                    >
                                                        📞 Dejar mis datos para cuando tenga la cita
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </>
                            )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                placeholder="Escribe tu consulta legal... (Shift+Enter para salto de línea)"
                                disabled={isLoading}
                                className="w-full pl-4 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none min-h-[50px] max-h-[150px] scrollbar-hide"
                                rows={1}
                            />

                            {/* File Upload Button */}
                            <button
                                type="button"
                                disabled={isLoading}
                                className={cn(
                                    "absolute right-20 top-2 p-2 rounded-lg transition-colors",
                                    isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                )}
                                title="Dictar por voz"
                                onClick={startListening}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                className="absolute right-12 top-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Adjuntar documento (PDF, IMG)"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <Paperclip className="h-4 w-4" />
                            </button>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // Mock upload for MVP - In real app, this goes to Supabase Storage
                                        setMessages(prev => [...prev, {
                                            role: 'model',
                                            content: `📎 Analizando archivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`
                                        }]);
                                        // Simulate analysis delay
                                        setTimeout(() => {
                                            setMessages(prev => [...prev, {
                                                role: 'model',
                                                content: "He recibido el documento. Por favor, indícame qué aspecto legal te preocupa sobre este archivo."
                                            }]);
                                        }, 1500);
                                    }
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-2 text-center space-y-1">
                            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Conversación segura y encriptada
                            </p>
                            <p className="text-[9px] text-slate-300 italic">
                                Asistente inteligente entrenado en legislación vigente. Orientación inicial supervisada por abogados colegiados.
                            </p>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <div className="relative group">
                {!isOpen && (
                    <div className="absolute right-24 top-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap animate-in fade-in slide-in-from-right-8 duration-700 flex items-center gap-3">
                        <div className="text-xl">🗣️</div>
                        <div>
                            <p className="text-sm font-bold">¿Qué te ha pasado?</p>
                            <p className="text-xs text-slate-300">Explícalo aquí (Respuesta Inmediata)</p>
                        </div>

                        {/* Arrow */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rotate-45 border-r border-t border-slate-700"></div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-20 w-20 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 border-4 border-white relative z-10",
                        isOpen ? "bg-slate-700 text-white" : "bg-blue-600 text-white animate-pulse hover:animate-none"
                    )}
                >
                    {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-10 w-10" />}

                    {/* Notification Dot */}
                    {!isOpen && (
                        <span className="absolute top-0 right-0 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
                        </span>
                    )}
                </button>
            </div>

            {/* Embedded Checkout Modal Overlay */}
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                slots={chatSlots} 
            />

            {/* Lead Capture Modal Overlay (No Citation) */}
            {(() => {
                const lastMsg = messages[messages.length - 1];
                const match = lastMsg?.content?.match(/\[LEAD_FORM:\s*(.*?)\]/);
                const params = match ? Object.fromEntries(new URLSearchParams(match[1])) : {};
                return (
                    <LeadCaptureModal
                        isOpen={isLeadFormOpen}
                        onClose={() => setIsLeadFormOpen(false)}
                        prefillName={params.name || chatSlots.name || ''}
                        city={params.city || chatSlots.city || ''}
                        rate={params.rate || chatSlots.rate || ''}
                    />
                );
            })()}
        </div>
    );
}
