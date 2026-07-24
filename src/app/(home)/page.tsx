import Link from "next/link";
import { getLocations } from "@/lib/db/locations";
import { OKFService } from "@/lib/okf/okf-service";
import { MunicipalitySearch } from "@/components/silo/MunicipalitySearch";
import { getHomepageFaqs } from "@/lib/db/homepage-faqs";
import {
    Gavel,
    ShieldCheck,
    Clock,
    Linkedin,
    GraduationCap,
    ChevronDown,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

export const revalidate = 3600; // ISR revalidation for homepage FAQs

export default async function MarketingPage() {
    // Fetch locations and brand FAQs from DB dynamically (strict SSR)
    const locations = await getLocations();
    const municipiosAlcoholemia = OKFService.getCoveredMunicipios('alcoholemia');
    const homepageFaqs = await getHomepageFaqs();

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34657420999";
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola Autoridad Legal, necesito un abogado de urgencia por un delito de alcoholemia en Barcelona.")}`;

    return (
        <main className="min-h-screen bg-surface-ice text-legal-ink font-sans flex flex-col items-center">
            {/* Single Consolidated JSON-LD Schema Graph: LegalService + FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "LegalService",
                                "@id": "https://www.autoridad.legal/#organization",
                                "name": "Autoridad Legal",
                                "legalName": "Autoridad Legal",
                                "url": "https://www.autoridad.legal",
                                "telephone": "+34 605 118 871",
                                "email": "redes@autoridad.legal",
                                "image": "https://www.autoridad.legal/logo.png",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Barcelona",
                                    "addressRegion": "Cataluña",
                                    "addressCountry": "ES"
                                },
                                "priceRange": "€€",
                                "openingHoursSpecification": [
                                    {
                                        "@type": "OpeningHoursSpecification",
                                        "dayOfWeek": [
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                            "Sunday"
                                        ],
                                        "opens": "00:00",
                                        "closes": "23:59"
                                    }
                                ],
                                "sameAs": [
                                    "https://www.linkedin.com/company/autoridad-legal/",
                                    "https://www.facebook.com/AutoridadLegal/",
                                    "https://www.instagram.com/autoridad.legal/",
                                    "https://x.com/AutoridadLegal_",
                                    "https://www.youtube.com/@Autoridad_Legal"
                                ],
                                "founder": {
                                    "@type": "Person",
                                    "name": "Santiago Giménez Olavarriaga",
                                    "jobTitle": "Director Jurídico y Abogado Penalista",
                                    "sameAs": [
                                        "https://www.linkedin.com/in/santiagogimenezolavarriaga/"
                                    ]
                                }
                            },
                            {
                                "@type": "FAQPage",
                                "@id": "https://www.autoridad.legal/#faq",
                                "mainEntity": homepageFaqs.map(faq => ({
                                    "@type": "Question",
                                    "name": faq.question,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": faq.answer
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
                    </div>

                    {/* Hero Right Column: Video Facade & Pricing Text */}
                    <div className="md:col-span-5 flex flex-col items-center">
                        {/* 9:16 Vertical Portrait Photo Container */}
                        <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-prestige-gold/30 bg-legal-ink group">
                            <img
                                src="https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg"
                                alt="Santiago Giménez Olavarriaga - Abogado Director Autoridad Legal"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay Gradient for readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-5 pointer-events-none">
                                {/* Badge */}
                                <div className="self-start px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-sm border border-red-500/30 text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">
                                    Defensa Penal 24h
                                </div>

                                {/* Info Overlay */}
                                <div className="space-y-1">
                                    <p className="text-white font-extrabold text-sm tracking-wide drop-shadow-md">
                                        Santiago Giménez Olavarriaga
                                    </p>
                                    <p className="text-prestige-gold text-xs font-bold drop-shadow">
                                        Letrado Director ICAB 31389
                                    </p>
                                </div>
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
                    Garantizamos su defensa penal integral por un precio cerrado desde 980€, que incluye honorarios de abogado, IVA y procurador. Utilizamos un sistema de depósito seguro donde el pago se custodia y solo se libera al finalizar el procedimiento judicial, ofreciendo máxima transparencia y financiación flexible hasta doce meses.
                </p>
            </article>

            {/* NUESTRA ZONA DE COBERTURA SECTION */}
            <section className="w-full bg-slate-900 border-y border-white/10 py-16 md:py-24 flex justify-center">
                <div className="max-w-7xl w-full px-6 lg:px-8">
                    <MunicipalitySearch
                        initialService="alcoholemia"
                        initialMunicipios={municipiosAlcoholemia}
                        showServiceSelector={true}
                        title="Buscador de Cobertura Jurídica por Servicio y Municipio"
                        subtitle="Ofrecemos asistencia legal urgente 24h en toda el área metropolitana y municipios de Cataluña. Seleccione la especialidad y busque su localidad para acceder a la página de su juzgado competente."
                    />
                </div>
            </section>

            {/* E-E-A-T SECTION */}
            <section className="w-full bg-white py-16 md:py-20 flex justify-center">
                <article className="max-w-4xl w-full px-6 space-y-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                        Dirección Jurídica Verificada
                    </h2>
                    <p className="font-body-lg text-lg text-slate-700 leading-relaxed">
                        La dirección jurídica de la plataforma está a cargo del letrado Santiago Giménez Olavarriaga, especialista en seguridad vial y alcoholemias. Ejerce la defensa directa ante tribunales penales, coordinando la estrategia procesal y garantizando una asistencia inmediata y presencial de urgencia las veinticuatro horas del día en comisarías.
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
                                href="https://www.linkedin.com/in/santiagogimenezolavarriaga/"
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
            <section id="faq" className="w-full max-w-4xl px-6 py-16 md:py-20 border-t border-outline-variant/30 space-y-8 scroll-mt-20">
                <h2 className="text-3xl md:text-4xl font-extrabold text-trust-navy border-l-4 border-prestige-gold pl-4 tracking-tight">
                    Preguntas Frecuentes sobre Delitos Contra la Seguridad Vial
                </h2>
                <p className="font-body-lg text-lg text-slate-700 leading-relaxed">
                    Resolvemos de forma transparente sus dudas sobre la defensa penal en delitos contra la seguridad vial, costes, honorarios, cobertura geográfica y procedimiento legal ante los Juzgados de Instrucción.
                </p>

                {/* SSR FAQ Accordion */}
                <div className="space-y-4 pt-4">
                    {homepageFaqs.map((faq) => (
                        <details
                            key={faq.id}
                            className="group border border-outline-variant/40 rounded-xl bg-white p-5 shadow-sm hover:border-prestige-gold/50 transition-colors"
                        >
                            <summary className="flex justify-between items-center cursor-pointer font-bold font-headline-md text-trust-navy hover:text-prestige-gold transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="pr-4 flex items-center gap-2">
                                    <span>{faq.question}</span>
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                            </summary>
                            <div className="mt-4 font-body-md text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3 space-y-3">
                                <p>{faq.answer}</p>
                                
                                {faq.category === 'servicio' && faq.service_slug && (
                                    <div className="pt-2 flex items-center justify-between text-xs">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-prestige-gold/10 text-trust-navy font-bold uppercase tracking-wider text-[10px] border border-prestige-gold/30">
                                            Especialidad: {faq.service_slug}
                                        </span>
                                        <Link
                                            href={`/${faq.service_slug}`}
                                            className="inline-flex items-center gap-1 text-prestige-gold font-bold hover:underline"
                                        >
                                            <span>Más información</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* STICKY MOBILE CTA BUTTON (MVP TELEPHONE) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-white/10 p-3 shadow-2xl flex justify-center">
                <div className="w-full max-w-xl">
                    <a
                        href="tel:+34605118871"
                        className="py-4 px-6 rounded-2xl bg-prestige-gold hover:bg-[#ffe088] text-trust-navy font-sans font-black text-sm sm:text-base md:text-lg text-center shadow-xl shadow-prestige-gold/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                        aria-label="Llamar a la línea de guardia de urgencia 24 horas"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Llamar Abogado de Guardia 24h (+34 605 118 871)
                    </a>
                </div>
            </div>
        </main>
    );
}
