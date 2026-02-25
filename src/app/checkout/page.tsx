'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scale, ShieldCheck, Lock, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

function CheckoutContent() {
    const searchParams = useSearchParams();

    // Extracted URL parameters
    const rawCity = searchParams.get('city') || 'tu zona';
    const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();

    const rate = searchParams.get('rate');
    const incidentType = searchParams.get('incident') || 'Alcoholemia';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Minimal Header */}
            <header className="bg-slate-900 text-white p-4 lg:px-8 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-inner">
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Autoridad<span className="font-light text-slate-300">Legal</span></h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-400 font-medium bg-green-900/40 px-3 py-1.5 rounded-full border border-green-800/50">
                        <Lock className="h-4 w-4" />
                        <span className="hidden sm:inline">Checkout Seguro</span>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Left Column: Summary & Value Prop */}
                <div className="lg:col-span-5 space-y-6 lg:space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Activación de Defensa</h2>
                        <p className="text-slate-600 text-lg">Completa tu reserva para que un abogado especialista comience a trabajar en tu caso inmediatamente.</p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                        {/* Decorative Top Accent */}
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                                    <Briefcase className="h-6 w-6 text-slate-700" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">Servicio de Defensa Penal</h3>
                                    <p className="text-slate-500 text-sm mt-1">{incidentType.charAt(0).toUpperCase() + incidentType.slice(1)} en {city}</p>
                                    {rate && <p className="text-slate-400 text-xs mt-1">Tasa registrada: {rate}</p>}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Presupuesto Cerrado</span>
                                    <span className="font-medium text-slate-900">1.100,00 €</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Descuento Especial (10%)</span>
                                    <span>-110,00 €</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Honorarios Totales</p>
                                        <p className="text-xs text-slate-400">Impuestos excluidos</p>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">990,00 €</span>
                                </div>

                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center text-indigo-900">
                                    <div>
                                        <p className="font-bold">A pagar hoy (Reserva)</p>
                                        <p className="text-xs text-indigo-700/80">El resto se abonará según acuerdo</p>
                                    </div>
                                    <span className="text-xl font-black">50,00 €</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="space-y-4">
                        <div className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                            <p><strong>Precio Cerrado sin Sorpresas.</strong> Los honorarios totales son definitivos. Mínimas costas procurador no incluidas.</p>
                        </div>
                        <div className="flex gap-3 text-sm text-slate-600">
                            <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                            <p><strong>Contacto Inmediato.</strong> El abogado especialista contactará contigo tras abonar la reserva.</p>
                        </div>
                        <div className="flex gap-3 text-sm text-slate-600">
                            <ShieldCheck className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                            <p><strong>Garantía de Especialidad.</strong> Sólo abogados colegiados con experiencia en juicios rápidos de tráfico.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            Datos del Solicitante
                        </h3>

                        <form className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700">Nombre</label>
                                    <input type="text" id="firstName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="Ej. Nicolás" />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700">Apellidos</label>
                                    <input type="text" id="lastName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="Ej. Pérez Gómez" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="dni" className="block text-sm font-semibold text-slate-700">DNI / NIE</label>
                                    <input type="text" id="dni" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="12345678X" />
                                    <p className="text-[11px] text-slate-400 mt-1">Imprescindible para el contrato de encargo profesional.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Teléfono Móvil</label>
                                    <input type="tel" id="phone" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="600 000 000" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Correo Electrónico</label>
                                <input type="email" id="email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="correo@ejemplo.com" />
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100">
                                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group ring-offset-2 focus:ring-2 focus:ring-slate-900 outline-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                                    Abonar 50€ (Reserva Segura)
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex items-center justify-center gap-4 mt-6 grayscale opacity-60">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-5 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-4 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    Al continuar, aceptas nuestros <strong>Términos de Servicio</strong> y la <strong>Política de Privacidad</strong>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 animate-pulse">Cargando pasarela de pago...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
