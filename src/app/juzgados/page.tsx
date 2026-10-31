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

    // Prepare MunicipioItems for search component with targetMode="juzgado" and full SSR table
    const searchMunicipios: (MunicipioItem & { judicialDistrict: string; officialCourtName: string })[] = [];
    districts.forEach(d => {
        d.municipalities.forEach(m => {
            searchMunicipios.push({
                slug: m.slug,
                name: m.name,
                courtSlug: d.slug,
                judicialDistrict: d.judicialDistrict,
                officialCourtName: d.officialName,
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
                        <Scale className="w-3.5 h-3.5" /> 25 Partidos Judiciales • {totalActiveMunicipalities} Municipios Atendidos
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Busca Tu Juzgado en Cataluña
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Seleccione o busque su municipio para acceder directamente al partido judicial competente y a la información de guardia 24h.
                    </p>
                </div>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-white font-bold text-base">25 Partidos Judiciales</h3>
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
                        <h3 className="text-white font-bold text-base">{totalActiveMunicipalities} Municipios de Barcelona</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Adscripción oficial de los {totalActiveMunicipalities} municipios con su juzgado de guardia correspondiente.
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

                {/* Server-Rendered Indexable Grouping of 25 Judicial Districts (No JS required) */}
                <section className="space-y-8 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-prestige-gold pl-4">
                            Los {districts.length} Partidos Judiciales de la Provincia de Barcelona
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm">
                            Consulta las 25 sedes judiciales y los {totalActiveMunicipalities} municipios adscritos a cada partido judicial:
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
                                        Ver Juzgado de {dist.judicialDistrict} <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Server-Rendered Table of all 310 Municipalities -> Judicial District */}
                <section className="space-y-6 pt-8 border-t border-white/10">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                            Tabla Completa de los {searchMunicipios.length} Municipios y su Partido Judicial
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm">
                            Listado alfabético completo de todos los municipios de la provincia de Barcelona con enlace directo a su partido judicial competente:
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 shadow-xl">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-900/90 text-xs uppercase tracking-wider text-prestige-gold">
                                    <th className="py-3.5 px-4 font-bold">Municipio</th>
                                    <th className="py-3.5 px-4 font-bold">Partido Judicial Competente</th>
                                    <th className="py-3.5 px-4 font-bold text-right">Ficha del Juzgado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {searchMunicipios.map(item => (
                                    <tr key={item.slug} className="hover:bg-slate-900/60 transition-colors">
                                        <td className="py-2.5 px-4 font-medium text-white">
                                            <Link
                                                href={`/juzgados/${item.courtSlug}`}
                                                className="hover:text-prestige-gold transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="py-2.5 px-4 text-slate-300">
                                            <Link
                                                href={`/juzgados/${item.courtSlug}`}
                                                className="hover:text-white transition-colors"
                                            >
                                                Partido Judicial de {item.judicialDistrict} ({item.officialCourtName})
                                            </Link>
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <Link
                                                href={`/juzgados/${item.courtSlug}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                            >
                                                Ir al juzgado <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
