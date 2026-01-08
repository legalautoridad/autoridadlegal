'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1Identity from '@/components/register/Step1Identity';
import Step2Zones from '@/components/register/Step2Zones';
import Step3PaymentAction from '@/components/register/Step3PaymentAction';
import { registerLawyer } from '@/lib/actions/register';

export type RegisterData = {
    // Step 1: Identity & Auth
    fullName: string;
    email: string;
    password: string;
    documentType: 'DNI' | 'NIF';
    documentNumber: string;
    barAssociation: string;
    barNumber: string;
    notificationPhone: string;
    officeAddress: string;
    declarationAccepted: boolean;

    // Step 2: Market
    activeZones: string[]; // ['BCN_VALLES', 'MARESME', etc]
    price: number;
};

const INITIAL_DATA: RegisterData = {
    fullName: '',
    email: '',
    password: '',
    documentType: 'nif', // Lowercase to match value/enum if needed, but safer UPPER
    documentNumber: '',
    barAssociation: 'ICAB',
    barNumber: '',
    notificationPhone: '',
    officeAddress: '',
    declarationAccepted: false,
    activeZones: ['BCN_VALLES'],
    price: 150
} as any; // Type casting for convenience with empty strings vs specific enums

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegisterData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateData = (partial: Partial<RegisterData>) => {
        setFormData(prev => ({ ...prev, ...partial }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await registerLawyer(formData);
            if (res.error) {
                setError(res.error);
                setIsSubmitting(false);
            } else {
                setIsSuccess(true);
                // Redirect after short delay to show success state
                setTimeout(() => {
                    router.push('/lawyer/dashboard');
                }, 2000);
            }
        } catch (err: any) {
            console.error('Registration Error:', err);
            let msg = err.message || 'Error desconocido';

            // Mask technical errors
            if (msg.includes('Row Level Security') || msg.includes('violates') || msg.includes('syntax')) {
                msg = 'Hubo un error técnico al procesar tu solicitud. Por favor, intenta de nuevo o contacta con soporte.';
            } else if (msg.includes('limit')) {
                msg = 'Has excedido el límite de intentos.';
            }

            setError(msg);
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Bienvenido a Autoridad Legal!</h2>
                    <p className="text-slate-500 mb-6">
                        Tu cuenta ha sido creada correctamente. Estamos redirigiéndote a tu panel de control...
                    </p>
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Sidebar / Progress */}
                <div className="bg-slate-900 text-white p-8 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <span className="font-bold text-xl tracking-tight">AL</span>
                            </div>
                            <span className="font-semibold text-lg">Autoridad Legal</span>
                        </div>

                        <div className="space-y-6">
                            <StepIndicator label="Identidad Profesional" current={step} stepNumber={1} />
                            <StepIndicator label="Selección de Mercado" current={step} stepNumber={2} />
                            <StepIndicator label="Resumen y Alta" current={step} stepNumber={3} />
                        </div>
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

                    <div className="relative z-10 text-xs text-slate-400">
                        &copy; 2026 Autoridad Legal. <br /> Alta Segura SSL.
                        <div className="mt-4 pt-4 border-t border-white/10">
                            ¿Ya tienes cuenta? <a href="/login" className="text-white font-bold hover:underline">Inicia sesión</a>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:w-2/3 flex flex-col">
                    <div className="flex-1">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        {step === 1 && <Step1Identity data={formData} onUpdate={updateData} onNext={handleNext} />}
                        {step === 2 && <Step2Zones data={formData} onUpdate={updateData} onNext={handleNext} onBack={handleBack} />}
                        {step === 3 && <Step3PaymentAction data={formData} onSubmit={handleSubmit} onBack={handleBack} isSubmitting={isSubmitting} />}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StepIndicator({ label, current, stepNumber }: { label: string, current: number, stepNumber: number }) {
    const isActive = current === stepNumber;
    const isCompleted = current > stepNumber;

    return (
        <div className={`flex items-center gap-3 transition-opacity ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex justify-center items-center w-8 h-8 rounded-full border-2 text-sm font-bold transition-all
                ${isActive ? 'border-white bg-white text-slate-900' : ''}
                ${isCompleted ? 'border-blue-400 bg-blue-400 text-white border-none' : ''}
                ${!isActive && !isCompleted ? 'border-white/30 text-white' : ''}
            `}>
                {isCompleted ? '✓' : stepNumber}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </div>
    )
}
