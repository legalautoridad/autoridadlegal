'use client';

import { useEffect, useState, useTransition } from 'react';
import { getSystemPrompt, updateSystemPrompt } from '@/lib/actions/ai-config';
import {
    Settings,
    ArrowLeft,
    Save,
    Loader2,
    Info,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    MessageSquare,
    Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AIConfigPage() {
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        loadPrompt();
    }, []);

    const loadPrompt = async () => {
        try {
            const data = await getSystemPrompt();
            setPrompt(data || '');
        } catch (error) {
            console.error('Error loading prompt:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setStatus('idle');
        startTransition(async () => {
            try {
                await updateSystemPrompt(prompt);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } catch (error) {
                console.error('Error saving prompt:', error);
                setStatus('error');
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-rose-600 animate-spin" />
                    <p className="font-medium text-slate-500">Cargando instrucciones de IA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex justify-between items-end">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <Settings className="h-8 w-8 text-rose-600" />
                                Configuración del Chatbot
                            </h1>
                            <p className="text-slate-500 mt-1 max-w-2xl">
                                Define la personalidad, el tono y las reglas de comportamiento del asistente legal. 
                                Estos cambios se aplican en tiempo real a todas las nuevas conversaciones.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {status === 'success' && (
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 animate-in fade-in slide-in-from-right-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm font-bold">Guardado</span>
                                </div>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                {isPending ? 'Guardando...' : 'Guardar y Sincronizar'}
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wider">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    System Prompt
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">Model: Gemini + DeepSeek</span>
                            </div>
                            <div className="relative flex-1">
                                <textarea
                                    className="w-full h-full p-6 text-sm font-mono text-slate-700 bg-transparent focus:ring-0 border-none resize-none leading-relaxed placeholder:text-slate-300"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Introduce aquí el System Prompt principal..."
                                />
                                {status === 'error' && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2 text-red-600 text-xs animate-bounce">
                                        <AlertTriangle className="h-4 w-4" />
                                        Error al guardar. Revisa la consola o los permisos.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Instructions / Tips */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Info className="h-5 w-5" />
                                Guía de Comportamiento
                            </h3>
                            <ul className="space-y-4 text-sm opacity-90">
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">1</div>
                                    <p>El chatbot opera bajo un <b>Estado de Conversación</b> enviado dinámicamente por el servidor.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">2</div>
                                    <p><b>Regla Anti-Bucles:</b> Es vital que el sistema no repita preguntas que el usuario ya respondió.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">3</div>
                                    <p><b>Formato JSON:</b> El prompt debe obligar a la IA a responder con un esquema JSON específico.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-amber-800 font-bold">
                                <Calendar className="h-5 w-5" />
                                Manejo de Fechas
                            </div>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                El sistema inyecta automáticamente la <b>Fecha Referencia (España)</b>. Asegúrate de que el prompt instruya a la IA a usarla para calcular "mañana", "hoy" o días de la semana con precisión.
                            </p>
                            <div className="bg-white/50 p-2 rounded border border-amber-100 font-mono text-[10px] text-amber-600">
                                📅 Formato sugerido: DD/MM/YYYY
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-300">
                            <div className="flex items-center gap-2 text-slate-100 font-bold">
                                <MessageSquare className="h-5 w-5" />
                                Tokens Especiales
                            </div>
                            <p className="text-xs leading-relaxed opacity-70">
                                Puedes usar tokens en tus respuestas para que el frontend renderice elementos dinámicos:
                            </p>
                            <div className="space-y-2">
                                <div className="p-2 bg-slate-800 rounded border border-slate-700 font-mono text-[9px] text-indigo-400">
                                    [PAYMENT_BUTTON: /url]
                                </div>
                                <div className="p-2 bg-slate-800 rounded border border-slate-700 font-mono text-[9px] text-emerald-400">
                                    [LEAD_FORM: data=...]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
