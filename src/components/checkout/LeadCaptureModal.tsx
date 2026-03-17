'use client';

import { useState } from 'react';
import { X, PhoneCall, ShieldCheck, User, CalendarClock } from 'lucide-react';
import { saveLead } from '@/lib/actions/leads';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    prefillName?: string;
    city?: string;
    rate?: string;
}

export function LeadCaptureModal({ isOpen, onClose, prefillName = '', city = '', rate = '' }: LeadCaptureModalProps) {
    const [formData, setFormData] = useState({
        firstName: prefillName.split(' ')[0] || '',
        lastName: prefillName.split(' ').slice(1).join(' ') || '',
        phone: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await saveLead({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                phone: formData.phone,
                email: formData.email,
                city: city,
                service: 'alcoholemia',
                status: 'no_citation',
                agreed_price: 0,
                notes: `Tasa: ${rate || 'no indicada'}. Pendiente de recibir citación.`,
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Error saving lead:', err);
            alert('Ha habido un error al guardar tus datos. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/60 hover:text-white p-1 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <CalendarClock className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Reserva tu Abogado</h2>
                            <p className="text-indigo-200 text-xs">Te avisamos en cuanto tengas fecha</p>
                        </div>
                    </div>
                    <p className="text-sm text-indigo-100 leading-relaxed">
                        Para asignarte el abogado más adecuado necesitamos la fecha del Juicio Rápido. Déjanos tus datos y te llamaremos en cuanto la recibas.
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {submitted ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PhoneCall className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">¡Datos recibidos!</h3>
                            <p className="text-slate-500 text-sm">
                                Un abogado especialista te llamará en cuanto tengamos tu fecha de citación. ¡Estamos aquí para ayudarte!
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Nombre</label>
                                    <input
                                        type="text" required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        placeholder="Nico"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Apellidos</label>
                                    <input
                                        type="text" required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        placeholder="García"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Teléfono</label>
                                <input
                                    type="tel" required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    placeholder="600 000 000"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Email</label>
                                <input
                                    type="email" required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    placeholder="nico@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                <PhoneCall className="h-4 w-4" />
                                {isLoading ? 'Guardando...' : 'Que me llamen cuando tenga fecha'}
                            </button>

                            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 mt-2">
                                <ShieldCheck className="h-3 w-3" />
                                Tus datos están protegidos según la LOPD
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
