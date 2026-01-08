'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function Step4Pending() {
    const router = useRouter();

    useEffect(() => {
        // Auto redirect after 5 seconds
        const timer = setTimeout(() => {
            router.push('/lawyer/dashboard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Solicitud Recibida!</h2>
            <p className="text-slate-500 max-w-md mb-8">
                Tu suscripción está activa y tus datos han sido enviados para validación colegial.
            </p>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl max-w-sm w-full mb-8">
                <h4 className="font-bold text-blue-900 mb-1">Próximos Pasos</h4>
                <p className="text-sm text-blue-800 opacity-80">
                    Nuestro equipo verificará tu Nº de Colegiado en menos de 24h. Recibirás un SMS cuando tu cuenta esté operativa.
                </p>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirigiendo a tu panel de control...
            </div>

            <button
                onClick={() => router.push('/lawyer/dashboard')}
                className="mt-4 text-blue-600 font-medium hover:underline text-sm"
            >
                Ir al Dashboard ahora
            </button>
        </div>
    );
}
