'use client';

import { useState } from 'react';
import { OnboardingData } from '@/app/lawyer/onboarding/page';
import { ShieldCheck, ChevronRight } from 'lucide-react';

interface Step1Props {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export default function Step1ProfessionalData({ data, onUpdate, onNext }: Step1Props) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!data.documentNumber) newErrors.documentNumber = 'Campo requerido';
        if (!data.barAssociation) newErrors.barAssociation = 'Campo requerido';
        if (!data.barNumber) newErrors.barNumber = 'Campo requerido';
        if (!data.officeAddress) newErrors.officeAddress = 'Campo requerido';
        if (!data.notificationEmail) newErrors.notificationEmail = 'Campo requerido';
        if (!data.notificationPhone) newErrors.notificationPhone = 'Campo requerido';
        if (!data.declarationAccepted) newErrors.declarationAccepted = 'Debes aceptar la declaración responsable';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Datos Profesionales</h2>
            <p className="text-slate-500 mb-6">Verificaremos tu colegiación antes de activar tu perfil.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Document Selection */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Documento ID</label>
                    <div className="flex gap-2">
                        <select
                            value={data.documentType}
                            onChange={(e) => onUpdate({ documentType: e.target.value as 'DNI' | 'NIF' })}
                            className="p-2 border rounded-lg bg-slate-50 border-gray-300 w-24"
                        >
                            <option value="DNI">DNI</option>
                            <option value="NIF">NIF</option>
                        </select>
                        <input
                            type="text"
                            value={data.documentNumber}
                            onChange={(e) => onUpdate({ documentNumber: e.target.value })}
                            className="flex-1 p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="12345678X"
                        />
                    </div>
                    {errors.documentNumber && <p className="text-red-500 text-xs">{errors.documentNumber}</p>}
                </div>

                {/* Bar Association */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Colegio de Abogados</label>
                    <input
                        type="text"
                        value={data.barAssociation}
                        onChange={(e) => onUpdate({ barAssociation: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: ICAB, ICAM..."
                    />
                    {errors.barAssociation && <p className="text-red-500 text-xs">{errors.barAssociation}</p>}
                </div>

                {/* Bar Number */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Nº Colegiado</label>
                    <input
                        type="text"
                        value={data.barNumber}
                        onChange={(e) => onUpdate({ barNumber: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: 45210"
                    />
                    {errors.barNumber && <p className="text-red-500 text-xs">{errors.barNumber}</p>}
                </div>

                {/* Website (Optional) */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Web Despacho (Opcional)</label>
                    <input
                        type="text"
                        value={data.websiteUrl}
                        onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                    />
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700">Dirección Fiscal / Despacho</label>
                    <input
                        type="text"
                        value={data.officeAddress}
                        onChange={(e) => onUpdate({ officeAddress: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Calle, Número, Piso, CP, Ciudad"
                    />
                    {errors.officeAddress && <p className="text-red-500 text-xs">{errors.officeAddress}</p>}
                </div>

                {/* Notification Email */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email Notificaciones</label>
                    <input
                        type="email"
                        value={data.notificationEmail}
                        onChange={(e) => onUpdate({ notificationEmail: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="alertas@tudominio.com"
                    />
                    <p className="text-xs text-slate-400">Recibirás aquí los avisos de nuevas asignaciones.</p>
                    {errors.notificationEmail && <p className="text-red-500 text-xs">{errors.notificationEmail}</p>}
                </div>

                {/* Notification Phone */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Teléfono Móvil (SMS)</label>
                    <input
                        type="tel"
                        value={data.notificationPhone}
                        onChange={(e) => onUpdate({ notificationPhone: e.target.value })}
                        className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+34 600..."
                    />
                    {errors.notificationPhone && <p className="text-red-500 text-xs">{errors.notificationPhone}</p>}
                </div>
            </div>

            {/* Footer / Declaration */}
            <div className="mt-8 pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="pt-0.5">
                        <input
                            type="checkbox"
                            checked={data.declarationAccepted}
                            onChange={(e) => onUpdate({ declarationAccepted: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-sm text-slate-700">
                        <span className="font-semibold block mb-1 text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" /> Declaración Responsable
                        </span>
                        Declaro bajo responsabilidad penal que estoy colegiado como ejerciente, dispongo de seguro de RC vigente y acepto que el email/teléfono facilitados son válidos para notificaciones legales vinculantes.
                    </div>
                </label>
                {errors.declarationAccepted && <p className="text-red-500 text-xs mt-1 ml-4">{errors.declarationAccepted}</p>}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
                    >
                        Siguiente Paso
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
