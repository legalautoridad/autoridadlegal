'use client';

import { adminLogin } from '@/lib/actions/auth';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Settings, ArrowRight, Lock, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await adminLogin(formData);

        if (result && result.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-indigo-50 p-4 rounded-2xl">
                            <Settings className="h-8 w-8 text-indigo-600 animate-spin-slow" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-1">WebAdmin</h2>
                    <p className="text-center text-slate-500 text-sm mb-8">Panel de Control de Autoridad Legal</p>

                    <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
                        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>Área Restringida:</strong> Solo personal autorizado. Todas las sesiones son monitoreadas.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Email de Administrador</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="admin@autoridadlegal.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-slate-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-slate-50/50"
                                />
                                <Lock className="absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 mt-4",
                                loading && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Autenticando...
                                </span>
                            ) : (
                                <>
                                    Ingresar al Sistema
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                    <a href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"> Volver a la web principal</a>
                </div>
            </div>
        </div>
    );
}
