'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, ChevronRight, X, Briefcase, CreditCard, User, CalendarDays, MapPin } from 'lucide-react';
import { saveLead } from '@/lib/actions/leads';
import { ChatSlots } from '@/lib/ai/state';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    slots: ChatSlots;
}

export function CheckoutModal({ isOpen, onClose, slots }: CheckoutModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Step 1 Form Data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: ''
    });

    // Step 2 Form Data (Simulated CC)
    const [ccData, setCcData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const price = slots.calculated_price || 990;
    const city = slots.city ? (slots.city.charAt(0).toUpperCase() + slots.city.slice(1).toLowerCase()) : 'tu zona';
    const incidentType = slots.incident_type || 'Defensa Legal';

    if (!isOpen) return null;

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Pre-save the lead as "new" before payment
            await saveLead({
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                email: formData.email,
                city: city,
                service: incidentType,
                status: 'new',
                agreed_price: price,
            });
            setStep(2);
        } catch (error) {
            console.error("Error saving partial lead:", error);
            alert("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // In a real app, integrate Stripe here.
            // Simulate payment processing...
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update lead to "reserved"
            await saveLead({
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                email: formData.email,
                city: city,
                service: incidentType,
                status: 'reserved',
                agreed_price: price,
            });

            alert(`¡Reserva confirmada con éxito!\n\nTu abogado se pondrá en contacto contigo en el teléfono ${formData.phone} de forma inminente.`);
            onClose();
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Error en el pago. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                
                {/* Left Column - Summary */}
                <div className="bg-slate-50 border-r border-slate-200 p-6 md:p-8 w-full md:w-[40%] flex flex-col justify-between hidden md:flex">
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
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
                    >
                        <X className="h-5 w-5" />
                    </button>

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
                            <form onSubmit={handleStep1Submit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Nombre</label>
                                        <input 
                                            type="text" required 
                                            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="Nico" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Apellidos</label>
                                        <input 
                                            type="text" required 
                                            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="García" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
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
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Teléfono</label>
                                        <input 
                                            type="tel" required 
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                            placeholder="600 000 000" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
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
                                    {isLoading ? 'Guardando...' : 'Continuar al Pago Seguro'}
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
                                2. Método de Pago
                            </h3>
                            
                            <form onSubmit={handlePaymentSubmit} className="space-y-5">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Número de Tarjeta</label>
                                        <div className="relative">
                                            <input 
                                                type="text" required maxLength={19}
                                                value={ccData.number} onChange={e => setCcData({...ccData, number: e.target.value})}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono tracking-widest placeholder:tracking-normal" 
                                                placeholder="0000 0000 0000 0000" 
                                            />
                                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700">Caducidad</label>
                                            <input 
                                                type="text" required maxLength={5}
                                                value={ccData.expiry} onChange={e => setCcData({...ccData, expiry: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" 
                                                placeholder="MM/YY" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700">CVC</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" required maxLength={4}
                                                    value={ccData.cvc} onChange={e => setCcData({...ccData, cvc: e.target.value})}
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" 
                                                    placeholder="123" 
                                                />
                                                <Lock className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700">Titular de la tarjeta</label>
                                        <input 
                                            type="text" required 
                                            value={ccData.name} onChange={e => setCcData({...ccData, name: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm uppercase" 
                                            placeholder="NOMBRE APELLIDOS" 
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                                >
                                    <Lock className="h-4 w-4 text-indigo-200" />
                                    {isLoading ? 'Procesando...' : `Pagar ${price.toFixed(2)} €`}
                                </button>

                                <div className="flex items-center justify-center gap-4 mt-4 grayscale opacity-40">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-3 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
