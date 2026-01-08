'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateGuaranteeCertificate, CertificateData } from '@/lib/services/pdf-generator';
import { FileDown, CheckCircle, Shield, Mail } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [emailSent, setEmailSent] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Data (In production, this comes from DB based on Session ID)
    const [mockData, setMockData] = useState<CertificateData | null>(null);

    useEffect(() => {
        setMockData({
            referenceId: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            city: searchParams.get('city') || 'Barcelona',
            court: searchParams.get('court') || 'Juzgado Penal Nº 1',
            vertical: searchParams.get('vertical') || 'Alcoholemia',
            totalPrice: 950,
            reservationAmount: 50,
            date: new Date().toISOString()
        });
    }, [searchParams]);

    if (!mockData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    const handleDownload = () => {
        setIsGenerating(true);
        try {
            const blob = generateGuaranteeCertificate(mockData);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado_Honorarios_${mockData.referenceId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEmail = () => {
        setEmailSent(true);
        // Simulate API call
        setTimeout(() => alert("El contrato ha sido enviado a tu correo."), 100);
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">¡Reserva Confirmada!</h1>
                <p className="text-slate-600 mb-6 text-sm">
                    Tu defensa legal está activa y el precio bloqueado.
                </p>

                {/* Lawyer Assignment Card */}
                <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 text-left relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Abogado Asignado</p>
                        <h3 className="text-lg font-bold text-white mb-1">Don Santiago Giménez Olavarriaga</h3>
                        <p className="text-indigo-300 text-sm mb-3">Colegiado ICAB 31.389</p>
                        <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium">Disponible - Notificado</span>
                        </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Shield className="w-32 h-32" />
                    </div>
                </div>

                {/* Reassurance */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg h-fit">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-blue-900 font-bold mb-1">Siguiente paso:</p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Santiago te llamará <strong>en el horario que has indicado</strong> (o en menos de 24h) para preparar tu estrategia. Estate atento al teléfono.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
                    >
                        <FileDown className="w-4 h-4" />
                        {isGenerating ? 'Generando...' : 'Descargar Contrato (PDF)'}
                    </button>

                    <button
                        onClick={handleEmail}
                        disabled={emailSent}
                        className={`w-full border-2 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${emailSent ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        {emailSent ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Enviado al correo
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4" />
                                Enviar a mi correo
                            </>
                        )}
                    </button>
                </div>

                <p className="mt-6 text-[10px] text-slate-400 font-mono">
                    ID Reserva: {mockData.referenceId}
                </p>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
