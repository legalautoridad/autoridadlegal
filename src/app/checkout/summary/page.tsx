'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Check, ArrowRight, Gavel, User, CreditCard } from 'lucide-react';
import { saveLead } from '@/lib/actions/leads';

function SummaryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const vertical = searchParams.get('vertical') || 'Defensa Penal';
    const city = searchParams.get('city') || 'Barcelona';
    const price = searchParams.get('price') || '950';
    const reservation = 50;

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        dni: '',
        phone: '',
        email: '',
        schedule: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!formData.name || !formData.phone || !formData.dni) {
            alert("Por favor, rellena los datos obligatorios (Nombre, DNI y Teléfono)");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save Lead to Supabase
            await saveLead({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                city: city,
                service: vertical,
                status: 'reserved',
                agreed_price: parseInt(price),
                notes: `DNI: ${formData.dni}. Horario: ${formData.schedule}`
            });

            // Simulate Stripe Payment / Redirect
            router.push(`/checkout/success?vertical=${vertical}&city=${city}&name=${encodeURIComponent(formData.name)}&dni=${formData.dni}`);
        } catch (error) {
            console.error("Error saving lead:", error);
            alert("Hubo un error al procesar tus datos. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">

                {/* LEFT: Data Entry Form */}
                <div className="flex-1 p-8 order-2 md:order-1">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Datos del Contratante
                        </h2>
                        <p className="text-sm text-slate-500">Necesarios para formalizar el Acuerdo de Garantía.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo *</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleInputChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ej: Manuel Martínez"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DNI / NIE *</label>
                                <input
                                    type="text" name="dni" value={formData.dni} onChange={handleInputChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="00000000X"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono *</label>
                                <input
                                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="666 55 44 33"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Opcional)</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleInputChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="para recibir el contrato..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Horario Preferente Llamada</label>
                            <input
                                type="text" name="schedule" value={formData.schedule} onChange={handleInputChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="Ej: Mañanas de 10 a 14h"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Summary & Payment */}
                <div className="w-full md:w-[400px] bg-slate-900 text-white p-8 flex flex-col justify-between order-1 md:order-2">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-indigo-300 text-xs uppercase font-bold tracking-wider">
                            <Shield className="w-4 h-4" />
                            Garantía Autoridad Legal
                        </div>

                        <div className="mb-8">
                            <p className="text-slate-400 text-sm">Concepto</p>
                            <h1 className="text-2xl font-serif font-bold">Defensa Penal {vertical}</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                                <Gavel className="w-4 h-4" />
                                <span>Jurisdicción: {city}</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-700">
                            <div className="flex justify-between items-center opacity-60">
                                <span className="text-sm">Honorarios Totales</span>
                                <span className="text-sm font-bold line-through">{price}€</span>
                            </div>
                            <div className="flex justify-between items-center text-green-400">
                                <span className="text-sm font-bold">Descuento aplicado</span>
                                <span className="text-sm font-bold text-xs bg-green-900/50 px-2 py-1 rounded">-10% Reserva</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                                <span className="text-lg font-bold">A PAGAR HOY (RESERVA)</span>
                                <span className="text-3xl font-bold">{reservation}€</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-right">
                                El resto ({parseInt(price) - reservation}€) se abona tras hablar con el abogado.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handlePayment}
                            disabled={isSubmitting}
                            className={`w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            {isSubmitting ? 'Procesando...' : (
                                <>
                                    <span>CONFIRMAR Y PAGAR</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <div className="mt-4 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <CreditCard className="w-5 h-5 text-white" />
                            <span className="text-xs">Pago Seguro SSL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSummaryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        }>
            <SummaryContent />
        </Suspense>
    );
}
