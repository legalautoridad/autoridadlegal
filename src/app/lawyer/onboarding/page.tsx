'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1ProfessionalData from '@/components/onboarding/Step1ProfessionalData';
import Step2MarketSelection from '@/components/onboarding/Step2MarketSelection';
import Step3Payment from '@/components/onboarding/Step3Payment';
import Step4Pending from '@/components/onboarding/Step4Pending';

export type OnboardingData = {
    // Step 1
    documentType: 'DNI' | 'NIF';
    documentNumber: string;
    barAssociation: string;
    barNumber: string;
    officeAddress: string;
    notificationEmail: string;
    notificationPhone: string;
    websiteUrl: string;
    declarationAccepted: boolean;

    // Step 2
    activeZones: string[];
    activeMatters: string[];

    // Computed
    price: number;
};

const initialData: OnboardingData = {
    documentType: 'DNI',
    documentNumber: '',
    barAssociation: '',
    barNumber: '',
    officeAddress: '',
    notificationEmail: '',
    notificationPhone: '',
    websiteUrl: '',
    declarationAccepted: false,
    activeZones: ['Barcelona'], // Default to capital
    activeMatters: ['ALCOHOLEMIA'], // Default
    price: 150,
};

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<OnboardingData>(initialData);

    const updateData = (data: Partial<OnboardingData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Header / Progress */}
                <div className="bg-slate-900 text-white p-6 justify-between items-center hidden md:flex">
                    <h1 className="text-xl font-bold">Alta Profesional</h1>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 relative">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {step === 1 && (
                                <Step1ProfessionalData
                                    data={formData}
                                    onUpdate={updateData}
                                    onNext={nextStep}
                                />
                            )}
                            {step === 2 && (
                                <Step2MarketSelection
                                    data={formData}
                                    onUpdate={updateData}
                                    onNext={nextStep}
                                    onBack={prevStep}
                                />
                            )}
                            {step === 3 && (
                                <Step3Payment
                                    data={formData}
                                    onNext={nextStep}
                                    onBack={prevStep}
                                />
                            )}
                            {step === 4 && (
                                <Step4Pending />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-sm">
                Necesitas ayuda? Soporte letrado: <a href="#" className="underline">soporte@autoridadlegal.com</a>
            </p>
        </div>
    );
}
