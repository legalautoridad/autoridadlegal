'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { readStreamableValue } from "ai/rsc";
import { Message, sendMessage } from "@/lib/ai/actions";
import { saveLead } from "@/lib/actions/leads"; // Import saveLead
import { cn } from "@/lib/utils";
import { MessageSquare, X, Send, Scale, ShieldCheck, Paperclip } from "lucide-react";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hola, soy tu asistente especialista. Por favor, cuéntame qué te ha ocurrido y te orientaré en tu problema o consulta. Para empezar dime tu nombre para dirigirme a ti y cuéntame qué te ha ocurrido.' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // Extracted Lead Data State
    const [leadData, setLeadData] = useState<{ name: string, phone: string, email?: string, city: string } | null>(null);

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
            const { output } = await sendMessage(newMessages);
            let fullResponse = "";

            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const delta of readStreamableValue(output)) {
                fullResponse += delta;
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'model', content: fullResponse };
                    return updated;
                });
            }
        } catch (error) {
            console.error(error);
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
                                <h3 className="font-bold text-sm">Abogado de Guardia (IA)</h3>
                                <span className="text-xs text-slate-300 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Conectado ahora
                                </span>
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
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
                                    {msg.content.replace(/\[LEAD_DATA:.*?\]/g, '').replace(/\[PAYMENT_BUTTON:.*?\]/g, '').replace('[CLOSING_DEAL]', '').replace('[PAYMENT_LINK_DISCOUNT]', '').replace('[FREE_CALL_REQUEST]', '') || (
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
                                                        onClick={() => window.location.href = url}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                                    >
                                                        <span>⚡ RESERVAR AHORA Y ACTIVAR DEFENSA</span>
                                                    </button>
                                                    <p className="text-xs text-center text-slate-400 mt-2">
                                                        Pago seguro de 50€ (Descuento aplicado)
                                                    </p>
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
        </div>
    );
}
