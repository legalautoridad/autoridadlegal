import { Metadata } from 'next';
import { Lock, ShieldCheck, Trash2, EyeOff, Database, UserCheck, FileText, PhoneCall, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Política de Privacidad ("GDPR Búnker") | Autoridad Legal',
    description: 'Política de privacidad y protección de datos conforme al RGPD. Protocolos de OCR Efímero (destrucción en 24h), Data Sanitization y seguridad avanzada.',
    alternates: {
        canonical: 'https://autoridadlegal.com/legal/privacy',
    }
};

export default function PrivacyPage() {
    const updatedDate = "22 de julio de 2026";

    return (
        <main className="min-h-screen bg-slate-900 text-white py-16 md:py-24 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Banner */}
                <div className="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Lock className="w-4 h-4" /> Protocolo de Seguridad &quot;GDPR Búnker&quot;
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                        POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm">
                        Última actualización: <span className="text-slate-200 font-semibold">{updatedDate}</span>
                    </p>
                </div>

                {/* Section 1: Responsable del Tratamiento */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-prestige-gold/20 flex items-center justify-center text-prestige-gold shrink-0">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            1. Identidad del Responsable del Tratamiento
                        </h2>
                    </div>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/70 p-6 rounded-2xl border border-white/10">
                        El responsable del tratamiento de los datos personales recabados a través de esta plataforma web es <strong className="text-white font-bold">Santiago Giménez Olavarriaga</strong>, abogado penalista colegiado (<strong className="text-prestige-gold font-bold">ICAB 31389</strong>) y Letrado Director de Autoridad Legal.
                    </p>
                </section>

                {/* Section 2: Finalidad del Tratamiento y Generación de Leads */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            2. Finalidad del Tratamiento y Generación de Leads Cualificados
                        </h2>
                    </div>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Los datos que el usuario proporciona a través del chatbot incrustado en la web, chat de WhatsApp o mediante atención telefónica, serán tratados con las siguientes finalidades principales:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                                <Scale className="w-4 h-4" /> Triaje y Asistencia Letrada
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Realizar el triaje preliminar y gestionar la asistencia letrada en procedimientos de delitos contra la seguridad vial.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                <PhoneCall className="w-4 h-4" /> Gestión Exclusiva de Leads
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Si el usuario facilita información suficiente durante el proceso automatizado pero no finaliza la contratación, sus datos se procesarán para asignarle el lead de forma exclusiva al abogado, permitiendo que este realice una asistencia telefónica de seguimiento y orientación técnica.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: El "GDPR Búnker" */}
                <section className="space-y-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            3. Nuestro Compromiso Tecnológico: El &quot;GDPR Búnker&quot;
                        </h2>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Autoridad Legal no es un portal de subastas de datos. Nos regimos por un estricto protocolo de seguridad de la información diseñado para proteger la intimidad del usuario y su situación procesal ante el uso de herramientas tecnológicas avanzadas:
                    </p>

                    {/* Búnker Pillars Grid */}
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3 relative overflow-hidden">
                            <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
                                <Trash2 className="w-5 h-5 shrink-0" />
                                <h3>OCR Efímero (Autodestrucción en 24h)</h3>
                            </div>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Las imágenes correspondientes a documentación legal, citaciones judiciales o documentos de identidad que sean procesadas por nuestros sistemas para la extracción de datos, se autodestruyen de nuestros servidores de captura en un plazo máximo de 24 horas.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-3 relative overflow-hidden">
                            <div className="flex items-center gap-3 text-blue-400 font-bold text-lg">
                                <EyeOff className="w-5 h-5 shrink-0" />
                                <h3>Data Sanitization (Ofuscación Reversible)</h3>
                            </div>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Antes de que cualquier información del expediente sea procesada o evaluada por nuestros Modelos de Inteligencia Artificial (IA), los datos personales y procesales se ofuscan y ocultan de manera irreversible para garantizar una confidencialidad absoluta.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-950/90 border border-prestige-gold/30 space-y-3 relative overflow-hidden">
                            <div className="flex items-center gap-3 text-prestige-gold font-bold text-lg">
                                <Database className="w-5 h-5 shrink-0" />
                                <h3>Minería de Datos (Data Mining) y Observatorio</h3>
                            </div>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Los documentos judiciales finales, tales como atestados y sentencias, se anonimizan completamente desvinculando cualquier identificador personal del usuario. Las variables extraídas (tasas, modelos de etilómetro, juzgados competentes) se utilizan de manera estadística para alimentar nuestro Observatorio de Seguridad Vial y mejorar de forma continua nuestros algoritmos predictivos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Legitimación y Conservación */}
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            4. Legitimación y Conservación de los Datos
                        </h2>
                    </div>
                    <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/70 p-6 rounded-2xl border border-white/10">
                        <p>
                            La base legal para el tratamiento de los datos es el consentimiento del usuario al iniciar la interacción con nuestros canales, así como la ejecución de medidas precontractuales o del contrato de prestación de servicios jurídicos.
                        </p>
                        <p>
                            Los datos vinculados a expedientes vivos se conservarán conforme a los plazos exigidos por la legislación aplicable a la abogacía, exceptuando la documentación sometida al protocolo de &quot;OCR Efímero&quot;, que será destruida en un máximo de 24 horas.
                        </p>
                    </div>
                </section>

                {/* Section 5: Ejercicio de Derechos */}
                <section className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            5. Ejercicio de Derechos
                        </h2>
                    </div>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/70 p-6 rounded-2xl border border-white/10">
                        El usuario puede ejercer sus derechos de acceso, rectificación, supresión (derecho al olvido), limitación del tratamiento, portabilidad y oposición al tratamiento de sus datos personales. Para ello, podrá contactar directamente a través del número de teléfono habilitado o nuestro canal de WhatsApp, aportando copia de un documento que acredite su identidad.
                    </p>
                </section>
            </div>
        </main>
    );
}
