import { Metadata } from 'next';
import { OKFService } from '@/lib/okf/okf-service';
import { MunicipalitySearch } from '@/components/silo/MunicipalitySearch';
import { Shield, Clock, MapPin, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: "Directorio de Municipios y Cobertura Legal 24h | Autoridad Legal",
    description: "Consulte el directorio completo de municipios en Cataluña con asistencia penal de guardia 24 horas para juicio rápido por alcoholemia, drogas, delitos de tráfico y defensa penal.",
    alternates: {
        canonical: "https://autoridadlegal.com/municipios",
    }
};

export default function MunicipiosHubPage() {
    // Get all covered municipios for alcoholemia as default initial dataset
    const municipiosAlcoholemia = OKFService.getCoveredMunicipios('alcoholemia');

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
            <main className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-16 flex-1">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" /> Cobertura en toda Cataluña
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Buscador de Cobertura Jurídica por Municipio
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Seleccione o busque su municipio para acceder de inmediato a la defensa legal de guardia en comisarías y juzgados locales de su localidad.
                    </p>
                </div>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">Guardia 24 Horas Inmediata</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Turno permanente de letrados penalistas listos para desplazarse a comisarías de Mossos d&apos;Esquadra o Policía Local.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Building2Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">Conocimiento Judicial Local</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Especialización técnica según la praxis concreta de los Juzgados de Instrucción de cada partido judicial.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Scale className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">Especialización Penal en Tráfico</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Impugnación de etilómetros, análisis de atestados y defensa en conformidades para evitar la pena de prisión.
                        </p>
                    </div>
                </div>

                {/* Interactive Search Tool */}
                <MunicipalitySearch
                    initialService="alcoholemia"
                    initialMunicipios={municipiosAlcoholemia}
                    showServiceSelector={true}
                    title="Directorio Interactivo de Municipios"
                    subtitle="Filtre por especialidad legal y escriba el nombre de su localidad para acceder a la página de asistencia jurídica personalizada."
                />
            </main>
        </div>
    );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    );
}
