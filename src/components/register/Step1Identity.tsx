'use client';

import { RegisterData } from '@/app/lawyer/register/page';
import { ArrowRight, Info } from 'lucide-react';

interface Props {
    data: RegisterData;
    onUpdate: (data: Partial<RegisterData>) => void;
    onNext: () => void;
}

export default function Step1Identity({ data, onUpdate, onNext }: Props) {

    const isValid =
        data.fullName.length > 3 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && // Basic regex allowing numbers, dots etc
        data.password.length >= 6 &&
        data.documentNumber.length > 4 &&
        data.barNumber.length > 1 &&
        data.notificationPhone.length > 6 &&
        data.declarationAccepted;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Identidad Profesional</h2>
            <p className="text-slate-500 text-sm mb-6">Crea tu cuenta segura y valida tu colegiación.</p>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">

                {/* Cuenta */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
                        <input
                            value={data.fullName}
                            onChange={(e) => onUpdate({ fullName: e.target.value })}
                            placeholder="Ej. Juan Pérez García"
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Login)</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => onUpdate({ email: e.target.value })}
                                placeholder="abogado@firma.com"
                                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => onUpdate({ password: e.target.value })}
                                placeholder="Min. 6 caracteres"
                                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* Profesional */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo Doc.</label>
                        <select
                            value={data.documentType}
                            onChange={(e) => onUpdate({ documentType: e.target.value as any })}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm"
                        >
                            <option value="DNI">DNI</option>
                            <option value="NIF">NIF</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Núm. Documento</label>
                        <input
                            value={data.documentNumber}
                            onChange={(e) => onUpdate({ documentNumber: e.target.value })}
                            placeholder="12345678X"
                            className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Colegio</label>
                        <select
                            value={data.barAssociation}
                            onChange={(e) => onUpdate({ barAssociation: e.target.value })}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm"
                        >
                            <option value="ICAB">Barcelona (ICAB)</option>
                            <option value="ICASBD">Sabadell (ICASBD)</option>
                            <option value="ICATER">Terrassa (ICATER)</option>
                            <option value="ICAVOR">Granollers (ICAVOR)</option>
                            <option value="ICAMAT">Mataró (ICAMAT)</option>
                            <option value="ICASF">Sant Feliu (ICASF)</option>
                            <option value="ICAM">Manresa (ICAM)</option>
                            <option value="ICAVIC">Vic (ICAVIC)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nº Colegiado</label>
                        <input
                            value={data.barNumber}
                            onChange={(e) => onUpdate({ barNumber: e.target.value })}
                            className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono Notificaciones</label>
                    <input
                        value={data.notificationPhone}
                        onChange={(e) => onUpdate({ notificationPhone: e.target.value })}
                        placeholder="+34 600 000 000"
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="declaration"
                        checked={data.declarationAccepted}
                        onChange={(e) => onUpdate({ declarationAccepted: e.target.checked })}
                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="declaration" className="text-xs text-blue-900 cursor-pointer select-none">
                        Declaro bajo responsabilidad que soy abogado ejerciente, estoy al corriente de mis obligaciones colegiales y dispongo de seguro de Responsabilidad Civil. Acepto recibir notificaciones legales urgentes en este teléfono/email.
                    </label>
                </div>

            </div>

            <div className="pt-4 mt-auto">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform ${isValid
                        ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] shadow-lg'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
