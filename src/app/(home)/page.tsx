import Link from "next/link";
import { getLocations } from "@/lib/db/locations";
import {
    Gavel,
    ShieldCheck,
    Clock,
    MessageCircle,
    Play,
    Linkedin,
    GraduationCap,
    ChevronDown,
    CheckCircle2
} from "lucide-react";

export default async function MarketingPage() {
    // Fetch locations from DB dynamically (strict SSR)
    const locations = await getLocations();

    // Exact text for FAQs (responses under 40 words)
    const faqData = [
        {
            q: "¿Qué pasa si me niego a soplar?",
            a: "Negarse a soplar constituye un delito autónomo castigado con penas de prisión de seis meses a un año y retirada del carnet de uno a cuatro años. Siempre aconsejamos someterse a la prueba de alcoholemia."
        },
        {
            q: "¿Puedo fraccionar la retirada del carnet?",
            a: "No. La retirada del carnet impuesta en sentencia judicial es de cumplimiento obligatorio y continuo. La ley prohíbe fraccionar la condena por periodos, meses o fines de semana."
        },
        {
            q: "¿Me avisarán del juzgado a mi empresa?",
            a: "No. Los juzgados no comunican las condenas por alcoholemia a las empresas empleadoras, salvo que usted sea conductor profesional en ejercicio o funcionario público y afecte directamente a sus funciones."
        }
    ];

    const waLink = "https://wa.me/34600000000?text=Hola%20Autoridad%20Legal,%20necesito%20un%20abogado%20de%20urgencia%20por%20un%20delito%20de%20alcoholemia%20en%20Barcelona.";

    return (
        <main className="min-h-screen bg-surface-ice text-legal-ink font-sans flex flex-col items-center">
            {/* JSON-LD Schema: Combined LegalService & FAQPage with Founder sameAs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "LegalService",
                                "@id": "https://autoridadlegal.com/#organization",
                                "name": "Autoridad Legal",
                                "legalName": "Autoridad Legal",
                                "url": "https://autoridadlegal.com",
                                "telephone": "+34 900 000 000",
                                "email": "urgencias@autoridadlegal.com",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Barcelona",
                                    "addressRegion": "Cataluña",
                                    "addressCountry": "ES"
                                },
                                "priceRange": "980€",
                                "image": "https://autoridadlegal.com/images/lawyer_video_thumbnail.png",
                                "founder": {
                                    "@type": "Person",
                                    "name": "Santiago Giménez Olavarriaga",
                                    "jobTitle": "Director Jurídico y Abogado Penalista",
                                    "sameAs": [
                                        "https://www.linkedin.com/in/santiago-gimenez-olavarriaga",
                                        "https://www.abogacia.es"
                                    ]
                                }
                            },
                            {
                                "@type": "FAQPage",
                                "@id": "https://autoridadlegal.com/#faq",
                                "mainEntity": faqData.map(faq => ({
                                    "@type": "Question",
                                    "name": faq.q,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": faq.a
                                    }
                                }))
                            }
                        ]
                    })
                }}
            />

            {/* HERO SECTION */}
            <section className="w-full bg-trust-navy text-white py-16 md:py-24 border-b border-prestige-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-prestige-gold/5 skew-x-12 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-full bg-white/2 skew-x-12 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Hero Left Content */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prestige-gold/10 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-prestige-gold shrink-0" />
                            Defensa Penal de Tráfico 24 Horas
                        </div>
                        <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Abogado de Urgencia para Delitos Contra la Seguridad Vial
                        </h1>
                        <p className="font-body-lg text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
                            Especialistas en la defensa técnica de delitos de tráfico. Actuamos con urgencia para proteger tus derechos y minimizar consecuencias penales.
                        </p>

                        {/* Desktop CTA Button */}
                        <div className="pt-4">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-lg py-5 px-10 rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all w-fit border border-white/10"
                            >
                                <MessageCircle className="w-5 h-5 text-white shrink-0" />
                                Whatsapp Asistente IA
                            </a>
                        </div>
                    </div>

                    {/* Hero Right Column: Video Facade & Pricing Text */}
                    <div className="md:col-span-5 flex flex-col items-center">
                        {/* 9:16 Vertical Video Container Facade */}
                        <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-prestige-gold/30 bg-legal-ink group">
                            <img
                                src="/images/lawyer_video_thumbnail.png"
                                alt="Abogado penalista Santiago Giménez Olavarriaga"
                                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                <Play
                                    className="w-16 h-16 text-white fill-white drop-shadow-2xl p-4 bg-prestige-gold/90 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                                />
                                <span className="text-white text-xs font-bold mt-3 uppercase tracking-wider drop-shadow-md">
                                    Ver vídeo explicativo
                                </span>
                            </div>
                        </div>

                        {/* Anchor Text - Closer */}
                        <p className="mt-4 bg-white/5 border border-prestige-gold/20 p-4 rounded-xl text-center text-sm text-white/95 max-w-[280px] leading-relaxed shadow-lg">
                            Defensa Premium desde <strong className="text-prestige-gold text-lg">980€</strong> (IVA y Procurador incluidos). Sistema de pago seguro tipo Booking: el dinero se retiene y solo se libera tras el juicio. Financiación a 12 meses.
                        </p>
                    </div>
                </div>
            </section>

            {/* TRUST SIGNALS ROW */}
            <section className="w-full bg-surface-low border-b border-outline-variant/30 py-8 text-trust-navy">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-around items-center gap-6 text-center">
                    <div className="flex items-center gap-3 justify-center">
                        <Gavel className="w-6 h-6 text-prestige-gold shrink-0" />
                        <span className="font-headline-md text-sm font-bold tracking-tight">Juicios Rápidos Inmediatos</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <ShieldCheck className="w-6 h-6 text-prestige-gold shrink-0" />
                        <span className="font-headline-md text-sm font-bold tracking-tight">Pago en Custodia Seguro</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <Clock className="w-6 h-6 text-prestige-gold shrink-0" />
                        <span className="font-headline-md text-sm font-bold tracking-tight">Abogado de Guardia 24/7</span>
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION ARTICLE */}
            <article className="w-full max-w-4xl px-6 py-16 md:py-20 space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                    Defensa Premium frente a Juicios Rápidos
                </h2>
                <p className="font-body-lg text-lg text-slate-700 leading-relaxed">
                    Garantizamos su defense penal integral por un precio cerrado desde 980€, que incluye honorarios de abogado, IVA y procurador. Utilizamos un sistema de depósito seguro donde el pago se custodia y solo se libera al finalizar el procedimiento judicial, ofreciendo máxima transparencia y financiación flexible hasta doce meses.
                </p>
            </article>

            {/* NUESTRA ZONA DE COBERTURA SECTION */}
            <section className="w-full bg-white border-y border-outline-variant/30 py-16 md:py-20 flex justify-center">
                <article className="max-w-4xl w-full px-6 space-y-8 flex flex-col items-center">
                    <div className="w-full text-left">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                            Nuestra Zona de Cobertura
                        </h2>
                        <p className="font-body-lg text-lg text-slate-700 leading-relaxed mt-6">
                            Ofrecemos cobertura de defensa legal urgente en toda el área metropolitana y municipios limítrofes de la provincia de Barcelona. Nuestra red de abogados penalistas se desplaza inmediatamente a comisarías y juzgados de instrucción competentes, asegurando una representación eficaz en todos los partidos judiciales catalanes de nuestra jurisdicción territorial.
                        </p>
                    </div>

                    {/* Two-column layout: Map on the left, locations list on the right */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full mt-8">
                        {/* Left Column: Smaller Map with Pulse */}
                        <div className="md:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-[360px] rounded-2xl overflow-hidden shadow-lg border border-outline-variant/40 bg-surface-ice group">
                                <img
                                    src="/images/cobertura_mapa.png"
                                    alt="Barcelona province coverage map"
                                    className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                                />
                                {/* Soft Pulse Effect Overlay */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <span className="flex h-10 w-10 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-prestige-gold/20 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-10 w-10 bg-prestige-gold/10"></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: List of Populations */}
                        <div className="md:col-span-7 w-full">
                            <div className="bg-surface-ice border border-outline-variant/30 rounded-2xl p-6 shadow-inner w-full">
                                <h3 className="font-headline-md text-base font-bold text-trust-navy mb-3">
                                    Municipios cubiertos en la Provincia de Barcelona
                                </h3>
                                <p className="font-body-md text-xs text-slate-500 mb-4">
                                    Prestamos asistencia legal inmediata en <strong className="text-trust-navy font-extrabold">{locations.length} poblaciones</strong> de la provincia. Seleccione su localidad para acceder a la información de su juzgado competente:
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                    {locations.map((loc) => (
                                        <Link
                                            key={loc.id}
                                            href={`/alcoholemia/${loc.slug}`}
                                            className="text-slate-700 hover:text-prestige-gold transition-colors font-medium text-[11px] flex items-center gap-1.5"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-prestige-gold/60 shrink-0"></span>
                                            <span className="truncate">{loc.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            {/* E-E-A-T SECTION */}
            <section className="w-full bg-white py-16 md:py-20 flex justify-center">
                <article className="max-w-4xl w-full px-6 space-y-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                        Dirección Jurídica Verificada
                    </h2>
                    <p className="font-body-lg text-lg text-slate-700 leading-relaxed">
                        La dirección jurídica de la plataforma está a cargo del letrado Santiago Giménez Olavarriaga, especialista en seguridad vial y alcoholemias. Ejerce la defensa directa ante tribunals penales, coordinando la estrategia procesal y garantizando una asistencia inmediata y presencial de urgencia las veinticuatro horas del día en comisarías.
                    </p>

                    {/* Verified Address & Trust Links */}
                    <address className="not-italic bg-surface-ice border border-outline-variant/30 p-6 rounded-xl space-y-4 max-w-xl shadow-sm">
                        <div className="flex items-start gap-3">
                            <Gavel className="w-6 h-6 text-prestige-gold mt-1 shrink-0" />
                            <div>
                                <h3 className="font-headline-md text-base font-bold text-trust-navy">
                                    Santiago Giménez Olavarriaga
                                </h3>
                                <p className="font-label-sm text-xs text-slate-500 uppercase tracking-widest mt-0.5">
                                    Abogado Colegiado ICAB 31.389
                                </p>
                                <p className="font-body-md text-sm text-slate-600 mt-2">
                                    Plataforma autorizada y colegiada para el ejercicio del derecho penal y de seguridad vial en toda la provincia de Barcelona.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 text-xs font-label-md">
                            <a
                                href="https://www.linkedin.com/in/santiago-gimenez-olavarriaga"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-trust-navy hover:text-prestige-gold transition-colors font-bold"
                            >
                                <Linkedin className="w-4 h-4 text-trust-navy shrink-0" />
                                Perfil LinkedIn Verificado
                            </a>
                            <span className="hidden sm:inline text-slate-300">|</span>
                            <a
                                href="https://www.abogacia.es/servicios-abogacia/censo-de-letrados/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-trust-navy hover:text-prestige-gold transition-colors font-bold"
                            >
                                <GraduationCap className="w-4 h-4 text-trust-navy shrink-0" />
                                Censo Oficial de Letrados
                            </a>
                        </div>
                    </address>
                </article>
            </section>

            {/* FAQ SEMANTIC SECTION */}
            <section className="w-full max-w-4xl px-6 py-16 md:py-20 border-t border-outline-variant/30 space-y-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                    Preguntas Frecuentes sobre Juicios por Alcoholemia
                </h2>
                <p className="font-body-lg text-lg text-slate-700 leading-relaxed">
                    Resolvemos de forma inmediata sus dudas sobre juicios rápidos por alcoholemia, retirada de carnet, multas y consecuencias penales en Barcelona. Nuestro equipo de letrados proporciona respuestas claras y directas basadas en la reforma del Código Penal y la jurisprudencia de seguridad vial que rige actualmente.
                </p>

                {/* SSR FAQ Accordion */}
                <div className="space-y-4 pt-4">
                    {faqData.map((faq, idx) => (
                        <details
                            key={idx}
                            className="group border border-outline-variant/40 rounded-xl bg-white p-5 shadow-sm hover:border-prestige-gold/50 transition-colors"
                        >
                            <summary className="flex justify-between items-center cursor-pointer font-bold font-headline-md text-trust-navy hover:text-prestige-gold transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="pr-4">{faq.q}</span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <p className="mt-4 font-body-md text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* STICKY MOBILE CTA BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl flex justify-center">
                <div className="w-full grid grid-cols-2 gap-3">
                    <a 
                        href="tel:+34900000000"
                        className="py-3.5 rounded-xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-extrabold text-[10px] min-[375px]:text-xs sm:text-sm text-center shadow-lg shadow-prestige-gold/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                        aria-label="Llamar a la línea de guardia de urgencia 24 horas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        LLamar abogado 24h (900 000 000)
                    </a>
                    <a 
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] min-[375px]:text-xs sm:text-sm text-center shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                        aria-label="Iniciar chat de urgencia por WhatsApp"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0"></span>
                        Whatsapp Asistente IA
                    </a>
                </div>
            </div>
        </main>
    );
}
