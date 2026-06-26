'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Message, sendMessage, ChatProfile } from "@/lib/ai/actions";
import { saveLead, updateLeadJson, transferJsonToDb } from "@/lib/actions/leads";
import { cn, cleanMessageContent } from "@/lib/utils";
import { X, Send, Scale, ShieldCheck, Paperclip } from "lucide-react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { LeadCaptureModal } from "@/components/checkout/LeadCaptureModal";
import ReactMarkdown from "react-markdown";

export function ChatWidget() {
    const pathname = usePathname();
    
    // Check if we should hide the widget on specific paths
    const isExcludedPath =
        pathname === '/login' ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/lawyer') ||
        pathname?.startsWith('/checkout/success');

    if (isExcludedPath) return null;

    return (
        <Suspense fallback={null}>
            <ChatWidgetContent />
        </Suspense>
    );
}

function ChatWidgetContent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
        if (typeof window !== 'undefined' && window.location.hash === '#chat-widget') {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    };

    // Default to 'alcoholemia' profile for now
    const profile: ChatProfile = 'alcoholemia';

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: `Hola. Si has llegado hasta aquí es porque probablemente te enfrentas a un juicio rápido por alcoholemia. Es una situación estresante, pero si trazamos una buena estrategia desde el principio, podemos minimizar los daños. Estoy aquí para orientarte.

[BLOQUE]

Para poder decirte a qué te enfrentas exactamente y cómo podemos defenderte, necesito que me respondas a estas 5 preguntas breves:

1. ¿Qué tasa diste en el etilómetro?
2. ¿En qué localidad fue?
3. ¿Qué día y hora tienes el juicio?
4. ¿Tienes antecedentes penales?
5. ¿Tu trabajo depende del carnet (eres transportista, comercial, taxista...)?


[BLOQUE]
Y lo más importante para enfocar tu caso: ¿Qué es lo que más te preocupa ahora mismo? (Puedes escoger varios números):

1. El tiempo que me pueden retirar el carnet.
2. La cuantía de la multa.
3. Cómo sustituir la multa por Trabajos a la Comunidad.
4. No sé si ir con el abogado de oficio o contratar a un especialista.



Respóndeme con tus datos y el número, y analizamos tu situación.`
        }
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [leadData, setLeadData] = useState<{ name: string, phone: string, email?: string, city: string } | null>(null);
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const ALL_SLOTS = [
        "name", "phone", "email", "work_status", "incident_date_time", 
        "incident_type", "city", "needs_license_for_work", "rate", 
        "judicial_district", "citation_date_time", "priors", 
        "priors_details", "jail", "concerns", "calculated_price", 
        "chosen_quota", "dependents", "income_data", 
        "has_citation", "contact_date_time"
    ];

    const [currentSlots, setCurrentSlots] = useState<Record<string, string>>(
        Object.fromEntries(ALL_SLOTS.map(s => [s, 'null']))
    );
    const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [debugTab, setDebugTab] = useState<'prompt' | 'slots'>('prompt');
    const [lastSavePayload, setLastSavePayload] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const hasOpened = useRef(false);

    const searchParams = useSearchParams();

    // Prevent body scroll when chat is open on mobile
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Auto-focus on input when loading finishes
    useEffect(() => {
        if (!isLoading && isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isLoading, isOpen]);

    // Auto-open logic removed - Chat stays closed on page load
    // Auto-open logic based on hash in URL
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#chat-widget') {
                setIsOpen(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 300);
            }
        };

        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        hasOpened.current = true; // Mark as opened so it doesn't try to auto-open later if logic changes
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

    // Handle [SAVE_LEAD: ...]
    useEffect(() => {
        if (Object.keys(currentSlots).length > 0 && sessionId) {
            updateLeadJson(sessionId, currentSlots);
        }
    }, [currentSlots, sessionId]);

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

        // Handle [SLOTS: ...]
        const slotsMatch = lastMsg.content.match(/\[SLOTS:\s*(.*?)\]/);
        if (slotsMatch && slotsMatch[1]) {
            const pairs = slotsMatch[1].split(',').map(p => p.trim());
            setCurrentSlots(prev => {
                const updated = { ...prev };
                pairs.forEach(pair => {
                    // Handle both key=value and key:value
                    let [key, val] = pair.split(/[=:]/).map(s => s.trim());
                    
                    // Strip quotes, braces, and other non-identifier chars from key
                    if (key) key = key.replace(/['"{} [\]]+/g, '').trim();
                    if (val) val = val.replace(/['"{} [\]]+/g, '').trim();

                    if (key && (val !== 'null' || !updated[key])) {
                        updated[key] = val || 'null';
                    }
                });
                return updated;
            });
        }

        // Handle [SAVE_LEAD: ...] - Flexible regex for multiline JSON
        const saveMatch = lastMsg.content.match(/\[SAVE_LEAD:\s*({[\s\S]*?})\]/);
        if (saveMatch && saveMatch[1]) {
            try {
                const payload = JSON.parse(saveMatch[1]);
                setLastSavePayload(payload); // For debug visibility
                console.log("[AUTO_SAVE] Finalizing lead. Transferring from JSON to DB...");
                transferJsonToDb(sessionId).then(() => {
                    console.log("[AUTO_SAVE] Lead transferred successfully");
                }).catch(err => {
                    console.error("[AUTO_SAVE] Error transferring lead:", err);
                });
            } catch (e) {
                console.error("Failed to trigger SAVE_LEAD transfer", e);
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
            const stream = await sendMessage(newMessages, profile, showDebug, currentSlots);
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
        <>
            {/* Chat Window Container */}
            {isOpen && (
                <div 
                    className={cn(
                        "z-[60] bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-300",
                        "fixed inset-0 rounded-none", // Mobile
                        "md:fixed md:inset-auto md:bottom-24 md:right-6 md:w-[400px] lg:md:w-[600px] md:h-[700px] lg:md:h-[800px] md:max-h-[85vh] md:rounded-3xl" // Desktop
                    )}
                    style={{ height: '100dvh', maxHeight: '100dvh' }} // Lock mobile height
                >
                    {/* Responsive Desktop Height Adjustment */}
                    <style jsx>{`
                        @media (min-width: 768px) {
                            div {
                                height: auto !important;
                                max-height: 85vh !important;
                            }
                        }
                    `}</style>

                    {/* Header */}
                    <div className="bg-slate-900 p-4 md:p-5 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Scale className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base">Asistente Legal IA</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] md:text-xs text-slate-300 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Conectado
                                    </span>
                                    {process.env.NEXT_PUBLIC_APP_VERSION === 'dev' && (
                                        <div className="flex gap-1 ml-2">
                                            <button 
                                                onClick={() => { setShowDebug(!showDebug); setDebugTab('prompt'); }} 
                                                className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded border transition-colors",
                                                    showDebug && debugTab === 'prompt' ? "bg-white text-slate-900 border-white" : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                                                )}
                                            >
                                                {showDebug && debugTab === 'prompt' ? 'Cerrar' : 'Prompt'}
                                            </button>
                                            <button 
                                                onClick={() => { setShowDebug(true); setDebugTab('slots'); }} 
                                                className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded border transition-colors",
                                                    showDebug && debugTab === 'slots' ? "bg-white text-slate-900 border-white" : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                                                )}
                                            >
                                                Slots
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 relative">
                        {showDebug && (
                            <div className="absolute inset-0 z-10 bg-slate-900/95 text-green-400 p-4 overflow-y-auto">
                                {debugTab === 'prompt' ? (
                                    <div className="font-mono text-[10px] leading-relaxed break-words whitespace-pre-wrap">
                                        <h4 className="text-white font-bold mb-2 uppercase tracking-widest border-b border-slate-700 pb-1">ÚLTIMO PROMPT:</h4>
                                        {debugPrompt}
                                    </div>
                                ) : debugTab === 'slots' ? (
                                    <div className="animate-in fade-in slide-in-from-right-4">
                                        <h4 className="text-white font-bold mb-4 uppercase tracking-widest border-b border-slate-700 pb-1">MAPA DE SLOTS:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(currentSlots).map(([key, val]) => (
                                                <div key={key} className="bg-slate-800/50 p-2 rounded border border-slate-700 flex flex-col">
                                                    <span className="text-[8px] text-slate-400 uppercase font-bold">{key}</span>
                                                    <span className={cn(
                                                        "text-[10px] truncate",
                                                        val === 'null' || !val ? "text-slate-600 italic" : "text-amber-400 font-medium"
                                                    )}>
                                                        {val === 'null' || !val ? 'Pendiente' : val}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-right-4">
                                        <h4 className="text-white font-bold mb-4 uppercase tracking-widest border-b border-amber-700 pb-1 text-amber-500">ÚLTIMO COMMIT:</h4>
                                        <pre className="bg-slate-800/80 p-3 rounded border border-slate-700 text-[10px] text-amber-200 overflow-x-auto">
                                            {JSON.stringify(lastSavePayload, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {messages.map((msg, i) => {
                            const parts = msg.content.split(/\[BLOQUE\]/i).map(p => p.trim());
                            const isLastMessage = i === messages.length - 1;

                            return (
                                <div key={i} className={cn("flex flex-col w-full gap-4 mb-4", msg.role === 'user' ? "items-end" : "items-start")}>
                                    {parts.map((part, partIndex) => {
                                        const cleanPart = cleanMessageContent(part);
                                        const isEmpty = !cleanPart;
                                        const isLastPart = partIndex === parts.length - 1;
                                        
                                        // Do not render empty parts unless it's the last part of the last message and we are loading
                                        if (isEmpty && !(isLastMessage && isLastPart && isLoading && msg.role === 'model')) {
                                            return null;
                                        }

                                        return (
                                            <div key={partIndex} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                                {msg.role === 'model' && (
                                                    partIndex === 0 ? (
                                                        <img
                                                            src="https://ui-avatars.com/api/?name=Asistente+Legal&background=0D8ABC&color=fff&size=128"
                                                            alt="Asistente IA"
                                                            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-200 shadow-sm self-end mb-1 mr-2 object-cover shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-7 md:w-8 mr-2 shrink-0" />
                                                    )
                                                )}
                                                
                                                <div className={cn(
                                                    "rounded-2xl p-3 md:p-4 text-sm shadow-sm break-words max-w-[90%] md:max-w-[85%]", 
                                                    msg.role === 'user' ? "bg-slate-900 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                                                )}>
                                                    {!isEmpty ? (
                                                        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-strong:font-bold prose-headings:font-bold prose-headings:text-slate-900">
                                                            <ReactMarkdown components={{
                                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">{children}</a>
                                                            }}>
                                                                {cleanPart}
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
                                            </div>
                                        );
                                    })}

                                    {/* Action buttons */}
                                    {msg.role === 'model' && (
                                        <div className={cn("flex w-full justify-start", "pl-9 md:pl-10")}>
                                            <div className="flex flex-col gap-2 mt-1 w-full max-w-[90%] md:max-w-[85%]">
                                                {(() => {
                                                    const match = msg.content.match(/\[PAYMENT_BUTTON:\s*(.*?)\]/);
                                                    if (match) return (
                                                        <button onClick={() => setIsCheckoutOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs text-center">
                                                            ⚡ ACTIVAR MI DEFENSA AHORA
                                                        </button>
                                                    );
                                                    return null;
                                                })()}
                                                {(() => {
                                                    const match = msg.content.match(/\[LEAD_FORM:\s*(.*?)\]/);
                                                    if (match) return (
                                                        <button onClick={() => setIsLeadFormOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs text-center">
                                                            📞 Dejar mis datos de contacto
                                                        </button>
                                                    );
                                                    return null;
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 shrink-0">
                        <div className="relative max-w-5xl mx-auto">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                                placeholder="Escribe tu consulta..."
                                disabled={isLoading}
                                className="w-full pl-4 pr-12 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none min-h-[52px] max-h-[150px] text-base" // Fixed to text-base for mobile
                                rows={1}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-2 bottom-2 md:top-3 md:bottom-3 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
                                <Send className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Modals */}
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
            {(() => {
                const lastMsg = messages[messages.length - 1];
                const match = lastMsg?.content?.match(/\[LEAD_FORM:\s*(.*?)\]/);
                const params = match ? Object.fromEntries(new URLSearchParams(match[1])) : {};
                return (
                    <LeadCaptureModal
                        isOpen={isLeadFormOpen}
                        onClose={() => setIsLeadFormOpen(false)}
                        prefillName={params.name || leadData?.name || ''}
                        city={params.city || leadData?.city || ''}
                        rate={params.rate || ''}
                    />
                );
            })()}
        </>
    );
}
