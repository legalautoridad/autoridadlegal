// OpenChat import removed as it was unused and caused build error.
// ChatWidget state should be handled by client components.

import { Metadata } from 'next';
import { SeoActionWrapper } from '@/components/seo/SeoActionWrapper'; // We will create this

interface PageProps {
    params: Promise<{
        city: string;
        rate: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city, rate } = await params;
    const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);

    return {
        title: `Juicio Rápido Alcoholemia ${cityCapitalized} tasa ${rate} | Abogado Urgente`,
        description: `¿Has dado ${rate}mg/l en ${cityCapitalized}? Te defendemos en Juicio Rápido por Alcoholemia. Abogados especialistas locales. Llama ahora o chatea con nuestra IA.`,
    };
}

export default async function AlcoholemiaPage({ params }: PageProps) {
    const { city, rate } = await params;
    const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-300 text-sm font-bold mb-4 border border-red-500/30">
                        URGENCIA 24H: JUICIO RÁPIDO
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Defensa por Alcoholemia en <span className="text-indigo-400">{cityCapitalized}</span> con tasa <span className="text-red-400">{rate}</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Una tasa de {rate}mg/l es delito penal. Necesitas un abogado especialista en {cityCapitalized} para minimizar la pena y proteger tu carnet.
                    </p>
                    <SeoActionWrapper />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto py-16 px-6">
                <div className="prose prose-lg prose-slate bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3>¿Qué implica dar {rate} en {cityCapitalized}?</h3>
                    <p>
                        En {cityCapitalized}, los juzgados de instrucción suelen procesar estos casos como Juicios Rápidos.
                        Con una tasa de <strong>{rate} mg/l</strong>, te enfrentas a una posible retirada de carnet de 1 a 4 años y antecedentes penales.
                    </p>
                    <p>
                        Nuestro sistema de abogados en {cityCapitalized} ya ha gestionado casos similares en los juzgados locales.
                        Podemos negociar una conformidad para reducir la pena un tercio si es la mejor opción.
                    </p>
                </div>
            </div>
        </div>
    );
}
