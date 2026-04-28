'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Message, sendMessage } from "@/lib/ai/actions";
import { saveLead } from "@/lib/actions/leads";
import { ChatState, ChatSlots, ChatProfile } from "@/lib/ai/state";
import { cn, cleanMessageContent } from "@/lib/utils";
import { MessageSquare, X, Send, Scale, ShieldCheck, Paperclip } from "lucide-react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { LeadCaptureModal } from "@/components/checkout/LeadCaptureModal";
import ReactMarkdown from "react-markdown";

export function ChatWidget() {
    return (
        <Suspense fallback={null}>
            <ChatWidgetContent />
        </Suspense>
    );
}

function ChatWidgetContent() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    // Check if we should hide the widget on specific paths
    const isExcludedPath =
        pathname === '/login' ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/lawyer') ||
        pathname?.startsWith('/checkout/success');

    // Default to 'alcoholemia' profile for now
    const profile: ChatProfile = 'alcoholemia';

    // Extract city from URL path
    let initialCity = undefined;
    if (pathname) {
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2 && pathSegments[0] === 'alcoholemia') {
            const rawCity = pathSegments[1];
            initialCity = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
        }
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: `**Bienvenido a Autoridad Legal**
            \n
Estás en un entorno especializado y diseñado para asistirte en este momento crítico.\n
Aquí podrás resolver de inmediato tus dudas sobre:\n
✅ Tu Juicio Rápido: Cómo funciona la Conformidad con el Fiscal y qué esperar en el juzgado.\n
✅ Sanciones: Cálculo real de tu multa, cómo fraccionarla o sustituirla por Trabajos en Beneficio de la Comunidad (TBC).\n
✅ Tu Carnet: Estrategias legales para retrasar la entrega si lo necesitas para trabajar.
También te informaremos sobre nuestra red de abogados especialistas con honorarios cerrados (sin sorpresas) y nuestras opciones de financiación en cuotas mensuales.
Cuéntanos tu caso: Por favor, facilítame un nombre para dirigirme a ti y dime, ¿Qué es lo que más te preocupa en este momento?`
        }
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
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isLoading, isOpen]);

    // Auto-open logic
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

    // Parse LEAD_DATA and Auto-Save
    useEffect(() => {
        if (messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role !== 'model') return;

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

    // Handle Actions
    useEffect(() => {
        if (!leadData) return;
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role !== 'model') return;

        const handleSave = async (status: 'new' | 'reserved', price: number) => {
            try {
                await saveLead({
                    name: leadData.name,
                    phone: leadData.phone,
                    email: leadData.email,
                    city: leadData.city,
                    service: 'alcoholemia',
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
                    } else if (parsedChunk.type === 'state-update') {
                        setChatState(parsedChunk.state);
                        setChatSlots(parsedChunk.slots);
                    }
                } catch (e) {
                    fullResponse += chunk;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: 'model', content: fullResponse };
                        return updated;
                    });
                }
            }
        } catch (error: any) {
            console.error('[CHAT_WIDGET] Error:', error);
            setMessages(prev => [...prev, { role: 'model', content: "Lo siento, ha ocurrido un error técnico. Por favor, inténtalo de nuevo." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] md:w-[450px] h-[700px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
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
                                    {process.env.NEXT_PUBLIC_APP_VERSION === 'dev' && (
                                        <>
                                            <button onClick={() => setShowDebug(!showDebug)} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700">
                                                {showDebug ? 'Ocultar Prompt' : 'Ver Prompt'}
                                            </button>
                                            <button onClick={() => setShowSlots(!showSlots)} className="text-[10px] bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700/50 hover:bg-indigo-800/50">
                                                {showSlots ? 'Ocultar Slots' : 'Ver Slots'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                        {showDebug && debugPrompt && (
                            <div className="absolute inset-0 z-10 bg-slate-900/95 text-green-400 p-4 overflow-y-auto font-mono text-[10px] leading-relaxed break-words whitespace-pre-wrap">
                                <h4 className="text-white font-bold mb-2">ÚLTIMO PROMPT ENVIADO AL LLM:</h4>
                                {debugPrompt}
                            </div>
                        )}

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
                            <div key={i} className={cn("flex w-full mb-4", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                {msg.role === 'model' && (
                                    <img
                                        src="https://ui-avatars.com/api/?name=Asistente+Legal&background=0D8ABC&color=fff&size=128"
                                        alt="Asistente IA"
                                        className="w-8 h-8 rounded-full border border-slate-200 shadow-sm self-end mb-1 mr-2 object-cover"
                                    />
                                )}
                                <div className={cn("rounded-2xl p-3 text-sm shadow-sm break-words max-w-[85%]", msg.role === 'user' ? "bg-slate-900 text-white rounded-br-none" : "bg-slate-100 border border-slate-200 text-slate-900 rounded-bl-none")}>
                                    {cleanMessageContent(msg.content) ? (
                                        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-strong:font-bold">
                                            <ReactMarkdown components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{children}</a>
                                            }}>
                                                {cleanMessageContent(msg.content)}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <span className="flex gap-1 items-center h-5">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </span>
                                    )}
                                </div>

                                {msg.role === 'model' && (
                                    <div className="flex flex-col gap-2 mt-1">
                                        {(() => {
                                            const match = msg.content.match(/\[PAYMENT_BUTTON:\s*(.*?)\]/);
                                            if (match) return (
                                                <button onClick={() => setIsCheckoutOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all text-xs">
                                                    ⚡ ACTIVAR MI DEFENSA AHORA
                                                </button>
                                            );
                                            return null;
                                        })()}
                                        {(() => {
                                            const match = msg.content.match(/\[LEAD_FORM:\s*(.*?)\]/);
                                            if (match) return (
                                                <button onClick={() => setIsLeadFormOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all text-xs">
                                                    📞 Dejar mis datos de contacto
                                                </button>
                                            );
                                            return null;
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                                placeholder="Escribe tu consulta..."
                                disabled={isLoading}
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none min-h-[50px] max-h-[150px]"
                                rows={1}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
                                <Send className="h-4 w-4" />
                            </button>
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
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rotate-45 border-r border-t border-slate-700"></div>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-20 w-20 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 border-4 border-white relative z-10",
                        isOpen ? "bg-slate-700 text-white" : "bg-blue-600 text-white"
                    )}
                >
                    {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-10 w-10" />}
                </button>
            </div>

            {/* Modals */}
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} slots={chatSlots} />
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
