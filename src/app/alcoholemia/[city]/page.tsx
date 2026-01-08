import { judicialDistricts } from '@/lib/data/judicial-districts';
import { SeoActionWrapper } from '@/components/seo/SeoActionWrapper';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    const district = judicialDistricts.find(d => d.slug === city.toLowerCase());

    if (!district) return { title: 'Abogado Alcoholemia | Autoridad Legal' };

    return {
        title: `Abogado Juicio Rápido Alcoholemia en ${district.name} | Urgencias 24h`,
        description: `Defensa urgente en los ${district.court}. Si has dado positivo en ${district.name}, nuestro especialista local acude en 30 minutos. Primera consulta gratuita.`,
    };
}

export default async function CityPage({ params }: PageProps) {
    const { city } = await params;

    // Normalize city from URL to slug matching
    const normalizedCity = city.toLowerCase();
    const district = judicialDistricts.find(d => d.slug === normalizedCity);

    if (!district) {
        // Fallback for cities not in our "Top Districts" list but still valid URLs?
        // Or 404? User requested specific mock data. Let's do a soft fallback or 404.
        // Given this is programmatic SEO, usually we want to catch all, but let's stick to the list for high quality.
        // If not found, show generic or 404. Let's show generic structure based on city param for now to be safe, 
        // effectively treating it as a dynamic catch-all if we wanted, 
        // BUT user specifically asked to use the array.
        // Let's return 404 for strict adherence to "Partidos Judiciales" strategy, 
        // OR render generic. User said "Buscar los datos en el array".
        // I'll assume valid SEO URLs only match the array for now.
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-4 border border-indigo-500/30">
                        JUZGADOS DE {district.name.toUpperCase()}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Abogado Juicio Rápido Alcoholemia en <span className="text-indigo-400">{district.name}</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Defensa urgente en los <strong>{district.court}</strong>. Si has dado positivo en {district.name} o alrededores, nuestro especialista local acude en 30 minutos.
                    </p>
                    <div className="mb-4">
                        <SeoActionWrapper />
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        Atención inmediata en {district.name}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto py-16 px-6">
                <div className="prose prose-lg prose-slate bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3>¿Te han citado en los {district.court}?</h3>
                    <p>
                        Si has recibido una citación para un juicio rápido en <strong>{district.name}</strong>, es crucial que cuentes con un abogado que conozca el funcionamiento específico de estos juzgados.
                    </p>
                    <p>
                        En <strong>Autoridad Legal</strong>, trabajamos diariamente en los juzgados de {district.name}. Conocemos a los fiscales y jueces, lo que nos permite negociar las mejores condiciones posibles para tu conformidad.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                        <p className="font-bold text-yellow-800 m-0">
                            IMPORTANTE: No declares sin tu abogado.
                        </p>
                        <p className="text-yellow-700 m-0 mt-2">
                            Llámanos antes de entrar a la sala. Podemos reducir tu retirada de carnet hasta un tercio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
