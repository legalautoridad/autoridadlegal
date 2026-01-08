'use client';

import { RegisterData } from '@/app/lawyer/register/page';
import { ArrowLeft, CreditCard, Lock, Loader2 } from 'lucide-react';

interface Props {
    data: RegisterData;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export default function Step3PaymentAction({ data, onSubmit, onBack, isSubmitting }: Props) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Resumen y Pago</h2>
            <p className="text-slate-500 text-sm mb-6">Confirma tu suscripción para empezar.</p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <span className="font-medium text-slate-600">Suscripción Mensual</span>
                    <span className="text-3xl font-black text-slate-900">{data.price}€</span>
                </div>
                <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex justify-between">
                        <span>Materia: Alcoholemias</span>
                        <span className="font-medium text-slate-700">Incluido</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Zonas Activas ({data.activeZones.length})</span>
                        <span className="font-medium text-slate-700">{data.activeZones.map(z => z.replace('_', ' ')).join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Mock Payment Form */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-60 pointer-events-none select-none relative">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold ring-2 ring-white">SIMULACIÓN DE PAGO</span>
                    </div>
                    <div className="mb-3">
                        <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
                        <div className="h-10 w-full bg-slate-50 rounded border border-slate-100"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="h-4 w-16 bg-slate-100 rounded mb-2"></div>
                            <div className="h-10 w-full bg-slate-50 rounded border border-slate-100"></div>
                        </div>
                        <div className="w-1/3">
                            <div className="h-4 w-12 bg-slate-100 rounded mb-2"></div>
                            <div className="h-10 w-full bg-slate-50 rounded border border-slate-100"></div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1 mb-4">
                    <Lock className="w-3 h-3" /> Pagos procesados seguramente por Stripe
                </p>
            </div>

            <div className="pt-4 mt-auto flex gap-3">
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Procesando Alta...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pagar y Crear Cuenta
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
