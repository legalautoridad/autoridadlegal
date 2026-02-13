'use client';

import { memberLogin } from '@/lib/actions/auth';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await memberLogin(formData);

        // If we get here, it means no redirect happened or we have an error object
        if (result && result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Redundant safeguard: if 'login' action redirects, code below might not run, 
            // but if it returns success without redirect, we force it.
            window.location.href = '/lawyer/dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-700 to-slate-900"></div>

                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-100 p-3 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-slate-900" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Autoridad Legal</h2>
                    <p className="text-center text-slate-500 text-sm mb-8">Acceso Panel de Especialistas</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Corporativo</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="abogado@firma.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                                <Lock className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2",
                                loading && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                "Verificando..."
                            ) : (
                                <>
                                    Acceder al Panel
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600 mb-2">
                        ¿Eres abogado y quieres unirte? <a href="/lawyer/register" className="font-bold text-slate-900 hover:text-blue-600 transition-colors">Regístrate aquí</a>
                    </p>
                    <p className="text-xs text-slate-400">
                        Sistema seguro protegido por SSL y 2FA.
                    </p>
                </div>
            </div>
        </div>
    );
}
