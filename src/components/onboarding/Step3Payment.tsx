'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/lawyer/onboarding/page';
import { ChevronLeft, Lock, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { submitOnboarding } from '@/lib/actions/onboarding';

interface Step3Props {
    data: OnboardingData;
    onNext: () => void;
    onBack: () => void;
}

export default function Step3Payment({ data, onNext, onBack }: Step3Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            // Simulate Stripe Delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const result = await submitOnboarding(data);
            if (result.success) {
                onNext();
            }
        } catch (err: any) {
            setError(err.message || "Error processing subscription");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Resumen y Suscripción</h2>
            <p className="text-slate-500 mb-6">Revisa tu plan y activa tu cuenta profesional.</p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 flex-1">

                {/* Summary Card */}
                <div className="md:col-span-3 space-y-4">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Tu Plan Seleccionado
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <div className="text-slate-600">Zonas Activas</div>
                                <div className="font-medium text-slate-900 text-right">{data.activeZones.join(', ')}</div>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <div className="text-slate-600">Materias</div>
                                <div className="font-medium text-slate-900 text-right">{data.activeMatters.join(', ')}</div>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <div className="text-slate-600">Datos Fiscales</div>
                                <div className="font-medium text-slate-900 text-right">
                                    {data.documentType} {data.documentNumber}<br />
                                    {data.notificationEmail}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-sm text-blue-800 font-medium opacity-80">TOTAL MENSUAL</div>
                                <div className="text-4xl font-black text-slate-900 mt-1">{data.price}€</div>
                            </div>
                            <div className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                IVA no incluido
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form (Visual) */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-2">
                            <CreditCard className="w-6 h-6" /> Datos de Pago
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Titular Tarjeta</label>
                            <input type="text" placeholder="Como aparece en la tarjeta" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Número de Tarjeta</label>
                            <div className="relative">
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                                <div className="absolute left-3 top-3 text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Caducidad</label>
                                <input type="text" placeholder="MM/YY" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">CVC</label>
                                <input type="text" placeholder="123" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mt-4">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubscribe}
                        disabled={isProcessing}
                        className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Suscribirse y Pagar"}
                    </button>
                </div>

            </div>

            <div className="mt-8 pt-4 flex">
                <button
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex items-center gap-2 text-slate-500 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Atrás
                </button>
            </div>
        </div>
    );
}
