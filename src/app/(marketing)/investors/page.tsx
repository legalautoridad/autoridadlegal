'use client';

import { motion } from 'framer-motion';
import {
    Search, Server, BrainCircuit, LayoutDashboard, DollarSign,
    TrendingUp, ShieldCheck, MapPin, Globe, CheckCircle2,
    XCircle, Clock, Smartphone, Users, ChevronRight, Zap
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- DATA ---
const revenueData = [
    { month: 'Mes 1', revenue: 0, profit: -3000 },
    { month: 'Mes 3', revenue: 2500, profit: -2000 },
    { month: 'Mes 6', revenue: 6000, profit: 0 }, // Break Even
    { month: 'Mes 9', revenue: 12000, profit: 4000 },
    { month: 'Mes 12', revenue: 18000, profit: 8000 }, // High Profit
];

const allocationData = [
    { name: 'Marketing (Gasolina)', value: 45, color: '#3b82f6', desc: 'Google Ads / Meta Ads' },
    { name: 'Equipo (Motor)', value: 42, color: '#a855f7', desc: 'Dirección Técnica Full-time' },
    { name: 'Ops (Chasis)', value: 13, color: '#64748b', desc: 'Servidores / Legal' },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50 }
    }
};

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={containerVariants}
        className={cn("min-h-screen py-24 px-6 relative overflow-hidden flex flex-col justify-center", className)}
    >
        {children}
    </motion.section>
);

export default function UltimateInvestorsPage() {
    return (
        <main className="bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30">

            {/* 1. HERO SECTION: THE VISION */}
            <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

                <div className="relative z-10 max-w-6xl mx-auto text-center px-4 space-y-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-md mx-auto"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Ronda Seed Abierta</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
                    >
                        La Abogacía ha cambiado. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Tu captación, también.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Presentando la primera plataforma de <strong>Captación Jurídica de Alta Precisión</strong> impulsada por IA Generativa.
                        <br className="hidden md:block" /> Dejamos obsoletos los formularios estáticos.
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8"
                    >
                        {[
                            { label: "Objetivo Ronda", value: "50.000 €" },
                            { label: "Equity Ofrecido", value: "20%" },
                            { label: "Runway Est.", value: "9-12 Meses" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">{stat.label}</div>
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 2. THE PROBLEM VS SOLUTION */}
            <Section className="bg-slate-900/30">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Por qué el modelo actual está roto</h2>
                        <p className="text-slate-400 text-lg">El mercado se divide en dos dinosaurios y un depredador ágil (Nosotros).</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 1. Tradicional */}
                        <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-950 border border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="mb-6"><Users className="w-10 h-10 text-slate-500" /></div>
                            <h3 className="text-2xl font-bold text-slate-300 mb-2">Despacho Tradicional</h3>
                            <p className="text-sm text-slate-500 mb-6 font-mono">EL MODELO ARTESANAL</p>
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Captación boca-a-boca (Lenta)</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> web estática "Contacto"</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Horario de Oficina</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Coste por Click muy alto</li>
                            </ul>
                        </motion.div>

                        {/* 2. Big Law */}
                        <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-950 border border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="mb-6"><Globe className="w-10 h-10 text-blue-500" /></div>
                            <h3 className="text-2xl font-bold text-slate-300 mb-2">"Marketplaces"</h3>
                            <p className="text-sm text-slate-500 mb-6 font-mono">EL MODELO CALL CENTER</p>
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" /> Tráfico masivo (TV/Radio)</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Filtrado humano (Lento/Caro)</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Venta de "Listados" irrelevantes</li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 shrink-0" /> Estructura pesada</li>
                            </ul>
                        </motion.div>

                        {/* 3. Autoridad Legal */}
                        <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-900 border-2 border-purple-500 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full" />
                            <div className="mb-6"><Zap className="w-10 h-10 text-purple-400" /></div>
                            <h3 className="text-2xl font-bold text-white mb-2">Autoridad Legal</h3>
                            <p className="text-sm text-purple-400 mb-6 font-mono">IA NATIVA & AUTÓNOMA</p>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> SEO Programático (Miles de URLs)</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> IA Generativa (Vertex AI)</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Atención Inmediata 24/7</li>
                                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Coste Marginal Cero</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 3. THE ENGINE */}
            <Section>
                <div className="max-w-7xl mx-auto w-full">
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Arquitectura de Captación</h2>
                        <p className="text-slate-400 text-lg">Un sistema autónomo "Set & Forget". Escalar a una nueva ciudad cuesta 0€.</p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-900 to-transparent" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Step 1 */}
                            <motion.div variants={itemVariants} className="relative bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center z-10 hover:border-blue-500/50 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-400 border border-blue-800">
                                    <Server className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">1. Silos SEO Programáticos</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Generamos automáticamente miles de landings hiper-locales:
                                    <span className="block mt-2 font-mono text-xs text-blue-300 bg-blue-900/20 py-1 rounded">/alcoholemia-barcelona</span>
                                    <span className="block mt-1 font-mono text-xs text-blue-300 bg-blue-900/20 py-1 rounded">/divorcio-hospitalet</span>
                                </p>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div variants={itemVariants} className="relative bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center z-10 hover:border-purple-500/50 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-400 border border-purple-800">
                                    <BrainCircuit className="w-8 h-8" />
                                </div>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">CORE TECH</div>
                                <h3 className="text-xl font-bold text-white mb-3">2. Triaje Vertex AI</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Nuestro Agente "Entrevista" al lead en tiempo real.
                                    Cualifica urgencia, viabilidad jurídica y solvencia económica antes de molestar al abogado.
                                </p>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div variants={itemVariants} className="relative bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center z-10 hover:border-emerald-500/50 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-400 border border-emerald-800">
                                    <LayoutDashboard className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">3. Marketplace Dashboard</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Entrega instantánea al abogado socio.
                                    El lead aparece en tu panel con un resumen completo y listo para firmar.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 4. FINANCIAL PROJECTIONS */}
            <Section className="bg-slate-900/20">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div variants={itemVariants} className="h-[450px] w-full bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl">
                        <h4 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-6 ml-2">Crecimiento de Ingresos (Año 1)</h4>
                        <div className="w-full h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#1e293b' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                                        formatter={(value: number | string | Array<number | string> | undefined) => [`€${value}`, '']}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Facturación" />
                                    {/* Line for profit could be added here or visualized distinctively */}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Escenario Realista</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Proyección basada en captar solo <strong>300 leads/mes</strong> al final del primer año, con un ticket medio de 60€.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-slate-900 rounded-xl border-l-4 border-blue-500">
                                <h4 className="font-bold text-white mb-1">Break Even: Mes 6</h4>
                                <p className="text-sm text-slate-400">Alcanzamos la sostenibilidad operativa en medio año.</p>
                            </div>
                            <div className="p-6 bg-slate-900 rounded-xl border-l-4 border-emerald-500">
                                <h4 className="font-bold text-white mb-1">EBITDA Positivo: Mes 12</h4>
                                <p className="text-sm text-slate-400">18.000€ facturación mensual con costes de ~10k.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <TrendingUp className="text-emerald-400" />
                                El "Doble ROI" para el Socio
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Como abogado, no solo ganas valor de equity. Consiguiendo solo
                                <strong className="text-emerald-400"> 2-3 casos extra al mes </strong>
                                por nuestra plataforma, amortizas tu inversión de 50k€ en menos de un año vía facturación propia.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 5. USE OF FUNDS */}
            <Section>
                <div className="max-w-6xl mx-auto w-full">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">¿A dónde van los 50.000€?</h2>
                        <p className="text-slate-400">Transparencia total. Estructura "Lean" optimizada para el crecimiento.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Chart */}
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-4xl font-bold text-white">50k</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Total</div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-6">
                            {allocationData.map((item, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-white font-bold text-lg">{item.name}</span>
                                        </div>
                                        <span className="text-slate-400 font-mono">{item.value}%</span>
                                    </div>
                                    <p className="text-sm text-slate-500 pl-6 border-l border-slate-800 ml-1.5">{item.desc}</p>
                                </div>
                            ))}

                            <div className="mt-8 p-4 bg-slate-900/50 rounded-lg text-sm text-slate-400 border border-slate-800">
                                <strong>Nota:</strong> Incluye salario CEO de supervivencia (2.000€ + Autónomos) para garantizar dedicación exclusiva al proyecto.
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 6. EXPANSION MAP */}
            <Section className="bg-slate-900/30">
                <div className="max-w-5xl mx-auto w-full text-center space-y-12">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Hoja de Ruta 2025</h2>
                        <p className="text-slate-400 text-lg">De experimento local a dominación nacional.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Phase 1 */}
                        <motion.div variants={itemVariants} className="p-8 bg-slate-950 rounded-2xl border border-slate-800 relative z-10">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin className="w-24 h-24" /></div>
                            <div className="text-emerald-400 font-bold mb-2">FASE 1 (AHORA)</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Barcelona Pilot</h3>
                            <p className="text-slate-400 text-sm">
                                Validación de algoritmo en Área Metropolitana: BCN, Hospitalet, Badalona, Sabadell.
                            </p>
                        </motion.div>

                        {/* Phase 2 */}
                        <motion.div variants={itemVariants} className="p-8 bg-slate-950 rounded-2xl border border-slate-800 relative z-10 opacity-75">
                            <div className="text-blue-400 font-bold mb-2">FASE 2 (MES 6)</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Madrid & Valencia</h3>
                            <p className="text-slate-400 text-sm">
                                Apertura de nuevos nodos en capitales clave. Inicio de captación vertical "Herencias".
                            </p>
                        </motion.div>

                        {/* Phase 3 */}
                        <motion.div variants={itemVariants} className="p-8 bg-slate-950 rounded-2xl border border-slate-800 relative z-10 opacity-50">
                            <div className="text-purple-400 font-bold mb-2">FASE 3 (MES 12)</div>
                            <h3 className="text-2xl font-bold text-white mb-4">Nacional</h3>
                            <p className="text-slate-400 text-sm">
                                Cobertura total en España. Lanzamiento de API para grandes despachos.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 7. CTA */}
            <section className="py-32 px-6 bg-slate-950 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto space-y-10"
                >
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        Únete al Futuro.
                    </h2>
                    <p className="text-2xl text-slate-400">
                        Quedan 2 plazas de socio estratégico disponibles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link
                            href="mailto:ceo@autoridadlegal.com"
                            className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3"
                        >
                            Solicitar Reunión CEO <ChevronRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/"
                            className="px-10 py-5 bg-transparent border border-slate-700 text-white rounded-full font-bold text-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                        >
                            Ver la Plataforma
                        </Link>
                    </div>
                    <p className="text-sm text-slate-600 pt-8">
                        Ronda limitada. Cierre de libros previsto: 31 Enero 2025.
                    </p>
                </motion.div>
            </section>

        </main>
    );
}
