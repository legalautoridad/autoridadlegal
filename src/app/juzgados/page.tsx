import { Metadata } from 'next';
import Link from 'next/link';
import { getAllDistrictsIndexData } from '@/lib/db/district-content';
import { MunicipalitySearch, MunicipioItem } from '@/components/silo/MunicipalitySearch';
import { MapPin, Building2, ChevronRight, Scale, Clock, PhoneCall } from 'lucide-react';
import { DEFAULT_OG_IMAGE, PHONE_E164, PHONE_DISPLAY } from '@/lib/config';

export const metadata: Metadata = {
    title: "Directorio de Juzgados y Cobertura Legal 24h | Autoridad Legal",
    description: "Busque su juzgado o municipio en Cataluña para acceder a la asistencia penal de guardia 24 horas en comisarías y juzgados de instrucción.",
    alternates: {
        canonical: "https://www.autoridad.legal/juzgados",
    },
    openGraph: {
        title: "Directorio de Juzgados y Cobertura Legal 24h",
        description: "Busque su juzgado o municipio en Cataluña para acceder a la asistencia penal de guardia 24 horas en comisarías y juzgados de instrucción.",
        url: "https://www.autoridad.legal/juzgados",
        siteName: "Autoridad Legal",
        locale: "es_ES",
        type: "website",
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Directorio de Juzgados y Cobertura Legal 24h",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Directorio de Juzgados y Cobertura Legal 24h",
        description: "Busque su juzgado o municipio en Cataluña para acceder a la asistencia penal de guardia 24 horas en comisarías y juzgados de instrucción.",
        images: [DEFAULT_OG_IMAGE],
    },
};

export default async function JuzgadosIndexPage() {
    const districts = await getAllDistrictsIndexData();
    const totalActiveMunicipalities = districts.reduce((acc, d) => acc + d.municipalities.length, 0);

    // Prepare MunicipioItems for search component with targetMode="juzgado"
    const searchMunicipios: MunicipioItem[] = [];
    districts.forEach(d => {
        d.municipalities.forEach(m => {
            searchMunicipios.push({
                slug: m.slug,
                name: m.name,
                courtSlug: d.slug,
                hasCourt: true,
            });
        });
    });
    searchMunicipios.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-24">
            <main className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-prestige-gold/15 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                        <Scale className="w-3.5 h-3.5" /> 25 Juzgados • {totalActiveMunicipalities} Municipios Atendidos
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Busca Tu Juzgado en Cataluña
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Seleccione o busque su municipio para ser redirigido directamente al juzgado competente y acceder a la información de guardia 24h.
                    </p>
                </div>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">Juzgados de Instrucción</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Acceso directo a la información judicial oficial de las 25 sedes en la provincia de Barcelona.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">Asistencia 24 Horas</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Turno de urgencia para detenciones, atestados policiales y citaciones para juicios rápidos.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">129 Municipios Atendidos</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Búsqueda inmediata que vincula cada municipio con su juzgado adscrito.
                        </p>
                    </div>
                </div>

                {/* Interactive Search Tool targeting /juzgados/[court-slug] */}
                <MunicipalitySearch
                    initialService="alcoholemia"
                    initialMunicipios={searchMunicipios}
                    showServiceSelector={false}
                    targetMode="juzgado"
                    title="Buscador por Municipio o Localidad"
                    subtitle="Escriba el municipio donde se produjo la actuación policial para ir a su juzgado correspondiente."
                />

                {/* Server-Rendered Indexable Grouping of 129 Municipalities by Court (No JS required) */}
                <section className="space-y-8 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            Directorio Completo de Juzgados y Municipios ({districts.length} Juzgados)
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm">
                            Consulta la adscripción judicial directa de los {totalActiveMunicipalities} municipios activos organizados por su sede judicial correspondiente:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {districts.map(dist => (
                            <div
                                key={dist.slug}
                                className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-prestige-gold/50 transition-all flex flex-col justify-between space-y-4 group"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-prestige-gold transition-colors">
                                            <Link href={`/juzgados/${dist.slug}`}>
                                                {dist.officialName}
                                            </Link>
                                        </h3>
                                    </div>

                                    {dist.address && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">{dist.address}</span>
                                        </p>
                                    )}

                                    {/* Server-Rendered Municipality Names Grouped by Court */}
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-prestige-gold uppercase tracking-wider mb-2">
                                            Atiende {dist.municipalities.length} municipios:
                                        </p>
                                        <ul className="flex flex-wrap gap-1.5">
                                            {dist.municipalities.map(m => (
                                                <li key={m.id}>
                                                    <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-200 text-xs border border-white/10 font-medium inline-block">
                                                        {m.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <Link
                                        href={`/juzgados/${dist.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        Ver Juzgado <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
