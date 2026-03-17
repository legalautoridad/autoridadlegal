'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ChevronRight, X, Briefcase, CreditCard, User, CalendarDays, MapPin } from 'lucide-react';
import { saveLead } from '@/lib/actions/leads';
import { ChatSlots } from '@/lib/ai/state';
import { createPaymentIntent } from '@/lib/actions/stripe';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of component to avoid recreating the object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    slots: ChatSlots;
}

// Inner component that handles the actual Stripe payment
function StripePaymentForm({ price, clientSecret, formData, city, incidentType, onClose }: { price: number, clientSecret: string, formData: any, city: string, incidentType: string, onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        // Confirm the payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid full page redirect if possible
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        name: `\${formData.firstName} \${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone,
                    }
                }
            }
        });

        if (error) {
            setErrorMessage(error.message || 'Error processing payment.');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Success! 
            try {
                // Update lead to "reserved"
                await saveLead({
                    name: `\${formData.firstName} \${formData.lastName}`,
                    phone: formData.phone,
                    email: formData.email,
                    city: city,
                    service: incidentType,
                    status: 'reserved',
                    agreed_price: price,
                });

                alert(`¡Reserva confirmada con éxito!\n\nTu abogado se pondrá en contacto contigo en el teléfono \${formData.phone} de forma inminente.`);
                onClose();
            } catch (err) {
                console.error("Error updating lead status:", err);
                // Even if DB fails, payment succeeded, so we shouldn't block the user but we might want to log it
                alert("Pago recibido. Hubo un retraso actualizando su expediente, pero su abogado le contactará pronto.");
                onClose();
            }
        } else {
            setErrorMessage('Estado de pago inesperado.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <PaymentElement 
                    options={{ 
                        layout: 'tabs',
                    }} 
                />
            </div>
            
            {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                    {errorMessage}
                </div>
            )}

            <button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
            >
                <Lock className="h-4 w-4 text-indigo-200" />
                {isProcessing ? 'Procesando Tarjeta...' : `Pagar ${price.toFixed(2)} €`}
            </button>

            <div className="flex justify-center mt-4 opacity-70">
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Transacción encriptada de extremo a extremo
                </p>
            </div>
        </form>
    );
}


export function CheckoutModal({ isOpen, onClose, slots }: CheckoutModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    
    // Step 1 Form Data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: ''
    });

    const price = slots.calculated_price || 990;
    const city = slots.city ? (slots.city.charAt(0).toUpperCase() + slots.city.slice(1).toLowerCase()) : 'tu zona';
    const incidentType = slots.incident_type || 'Defensa Legal';

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setClientSecret(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Create PaymentIntent on the Server
            const { clientSecret: secret } = await createPaymentIntent(price, {
                leadName: `${formData.firstName} ${formData.lastName}`,
                leadEmail: formData.email,
                leadCity: city
            }, formData.email);
            
            setClientSecret(secret);

            // 2. Pre-save the lead as "new" before payment
            await saveLead({
                name: `\${formData.firstName} \${formData.lastName}`,
                phone: formData.phone,
                email: formData.email,
                city: city,
                service: incidentType,
                status: 'new',
                agreed_price: price,
            });
            
            // Advance to Payment Step
            setStep(2);
        } catch (error) {
            console.error("Error in Step 1:", error);
            alert("Error de conexión con la pasarela. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative">
                
                {/* Close Button Mobile/Desktop */}
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors z-50 bg-white/50 backdrop-blur-md"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Left Column - Summary */}
                <div className="bg-slate-50 border-r border-slate-200 p-6 md:p-8 w-full md:w-[40%] flex-col justify-between hidden md:flex">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-slate-800 tracking-tight">AutoridadLegal</span>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Activación de Defensa</h2>
                        <p className="text-sm text-slate-500 mb-8">Completando el pago activarás tu protocolo legal inmediatamente.</p>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Briefcase className="h-5 w-5 text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Servicio Penal</p>
                                    <p className="text-xs text-slate-500 capitalize">{incidentType}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Localidad</p>
                                    <p className="text-xs text-slate-500">{city}</p>
                                </div>
                            </div>

                            {slots.citation_date && (
                                <div className="flex gap-3">
                                    <CalendarDays className="h-5 w-5 text-red-500 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Fecha Citación</p>
                                        <p className="text-xs text-red-600 font-medium">{slots.citation_date}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-medium text-slate-500">Total a pagar hoy</span>
                            <span className="text-3xl font-black text-slate-900">{price.toFixed(2)} €</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">IVA Incluido. Pago procesado de forma segura.</p>
                    </div>
                </div>

                {/* Right Column - Forms */}
                <div className="relative p-6 md:p-8 w-full md:w-[60%] flex flex-col overflow-y-auto">
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-8 pr-12">
                        <div className={`h-1.5 flex-1 rounded-full \${step === 1 ? 'bg-indigo-600' : 'bg-green-500'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full \${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    </div>

                    {step === 1 ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-500" />
                                1. Datos del Solicitante
                            </h3>
                            <form onSubmit={handleStep1Submit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Nombre</label>
                                        <input 
                                            type="text" required 
                                            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="Nico" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Apellidos</label>
                                        <input 
                                            type="text" required 
                                            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="García" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">DNI / NIE</label>
                                    <input 
                                        type="text" required 
                                        value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono uppercase" 
                                        placeholder="12345678X" 
                                    />
                                    <p className="text-[10px] text-slate-400">Requerido para el contrato de encargo.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Teléfono</label>
                                        <input 
                                            type="tel" required 
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="600 000 000" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Email</label>
                                        <input 
                                            type="email" required 
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="nico@email.com" 
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isLoading ? 'Conectando Pasarela...' : 'Continuar al Pago Seguro'}
                                    {!isLoading && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setStep(1)} className="text-xs font-medium text-indigo-600 mb-6 hover:underline flex items-center">
                                ← Volver a los datos
                            </button>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-500" />
                                2. Pago Seguro
                            </h3>
                            
                            {clientSecret && stripePromise ? (
                                <Elements stripe={stripePromise} options={{ 
                                clientSecret, 
                                appearance: { 
                                    theme: 'stripe',
                                    rules: {
                                        // Hide Stripe Link "Optional / Save my info" section
                                        '.p-LinkDefaultOption': { display: 'none' },
                                        '.p-LinkAutofillSystem': { display: 'none' },
                                        '.p-FormSecureNotice': { display: 'none' },
                                        '.p-LinkSeparator': { display: 'none' },
                                        '.p-LinkHeader': { display: 'none' },
                                    }
                                } 
                            }}>
                                    <StripePaymentForm 
                                        price={price} 
                                        clientSecret={clientSecret} 
                                        formData={formData} 
                                        city={city} 
                                        incidentType={incidentType}
                                        onClose={onClose}
                                    />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <span className="animate-spin mb-4 inline-block w-8 h-8 focus:outline-none">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                    Cargando pasarela bancaria...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
