'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons using Lucide as fallback or alongside Material Symbols
import { 
  Phone, 
  FileText, 
  Play, 
  ChevronDown, 
  MapPin, 
  CheckCircle, 
  ShieldAlert, 
  X, 
  Gavel, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export default function JuiciosRapidosBarcelonaPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedInterestPoint, setSelectedInterestPoint] = useState<number | null>(null);

  // Local Interest Points from Supabase data to show location intelligence
  const interestPoints = [
    {
      name: "Guardia Urbana de Barcelona - Sede Central UTAT",
      class: "Polícia",
      details: "Unidad Central de Tráfico en la calle Calàbria. Se encarga de la instrucción y coordinación de la gran mayoría de atestados por delitos de alcoholemia, velocidad y drogas en la trama urbana."
    },
    {
      name: "Mossos d'Esquadra - Comisaría de Les Corts",
      class: "Polícia",
      details: "Área Básica Policial de Les Corts. Sede de referencia para custodias y centralización de detenidos en Barcelona antes del traslado al Servicio de Guardia de la Ciutat de la Justícia."
    },
    {
      name: "Ronda de Dalt - Salida 4 Karl Marx",
      class: "Control Habitual",
      details: "Ubicación crítica y recurrente por macrocontroles preventivos nocturnos de la Guardia Urbana en ambos sentidos de la B-20."
    },
    {
      name: "Diagonal / Entrada Zona Universitaria",
      class: "Control Habitual",
      details: "Filtro estático estratégico ejecutado por la unidad de tráfico de Guardia Urbana, coincidiendo con flujos de ocio universitario y accesos desde la B-23."
    },
    {
      name: "Ronda Litoral - Salida Drassanes",
      class: "Control Habitual",
      details: "Punto de control estático habitual en los carriles laterales de la B-10, interceptando conductores que abandonan el sector portuario o las zonas céntricas de ocio."
    }
  ];

  // FAQs (including general ones from Stitch + local ones from Supabase)
  const faqs = [
    {
      q: "¿Qué es exactamente un juicio rápido?",
      a: "Procedimiento penal para delitos con penas hasta 5 años. Destaca por su rapidez, permitiendo obtener sentencia en pocos días tras el atestado policial y la conformidad ante el juez de guardia en Barcelona."
    },
    {
      q: "¿Cuáles son los plazos en Barcelona?",
      a: "La citación ocurre entre 2 y 5 días tras el atestado. En Barcelona, se celebran diariamente en los Juzgados de Guardia de la Ciutat de la Justícia, garantizando una resolución inmediata del conflicto penal."
    },
    {
      q: "¿Qué es la reducción de un tercio de la pena?",
      a: "Al reconocer los hechos ante el juez de guardia, el acusado obtiene una reducción automática de un tercio de la condena solicitada por el Fiscal. Es la vía más rápida para minimizar consecuencias legales."
    },
    {
      q: "¿Es obligatorio ir con abogado?",
      a: "Sí, la asistencia de abogado es obligatoria desde la detención o citación en comisaría. Un especialista es vital para negociar conformidades favorables o diseñar una estrategia de defensa técnica efectiva en el juicio."
    },
    {
      q: "¿Puedo perder el carnet de conducir?",
      a: "En delitos de tráfico como alcoholemia (>0.60), la retirada del carnet es obligatoria. Nuestra defensa técnica se enfoca en reducir al mínimo legal la duración de la privación del derecho a conducir."
    },
    {
      q: "¿Dónde se sitúa físicamente el Servicio de Guardia en Barcelona y a qué hora operan los juicios por alcoholemia?",
      a: "El Servicio de Guardia para los juicios rápidos de seguridad vial en Barcelona opera ininterrumpidamente las 24 horas del día y se encuentra ubicado en la planta baja y el sótano del Edificio I (Instrucción) dentro del complejo de la Ciutat de la Justícia, en la Gran Via de les Corts Catalanes, 111 (08075). Los 33 Juzgados de Instrucción que conforman las plazas del Tribunal de Instancia de Barcelona se turnan de forma permanente en estas salas de vistas, celebrando la gran mayoría de las comparecencias y conformidades penales durante las mañanas de los días laborables y fines de semana."
    },
    {
      q: "¿Cuántos dispositivos de control de tráfico ejecuta la Guardia Urbana al mes en Barcelona?",
      a: "La Unidad Central de Tráfico (UTAT) de la Guardia Urbana de Barcelona, en coordinación con las unidades de distrito, activa un promedio superior a los 150 controles estáticos y dinámicos de alcoholemia y drogas al mes dentro del área urbana. Estos dispositivos se programan estratégicamente en base a informes de siniestralidad local, intensificándose de forma masiva durante las madrugadas de jueves a domingo en las inmediaciones del Frente Marítimo, las salidas de las Rondas y los accesos desde los Túneles de Vallvidrera."
    },
    {
      q: "Si soy citado a un juicio rápido penal en Barcelona tras dar positivo, ¿qué coste exacto tiene mi defensa privada?",
      a: "Nuestra plataforma jurídica aplica una tarifa completamente cerrada y transparente de 980€, que cubre íntegramente la defensa técnica de nuestro abogado penalista especialista, los honorarios regulados del Procurador de los Tribunales que operará en la Ciutat de la Justícia y el IVA obligatorio. Asimismo, para mitigar el impacto financiero inmediato del investigado, el abono se puede tramitar a plazos de manera instantánea mediante nuestra pasarela en mensualidades de 3, 6 o 12 cuotas."
    }
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUrgentAction = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('urgency', 'true');
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-surface-ice text-on-surface font-sans selection:bg-prestige-gold/30">
      <main>
        {/* Hero Section */}
        <section id="inicio" className="relative min-h-[85vh] flex items-center overflow-hidden hero-gradient">
          <div className="absolute inset-0 opacity-25">
            <img 
              alt="Barcelona Ciutat de la Justícia" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRFVsVFS6Sx29Zajb-J6YOJcxKaY-r3gHshqLiN0AOuyM_H_LYTiGTrZWj38oL4tzEx7jIvGA6Lu6mbbTIZPg3vGsKjHDdpgv3oTPYqv9t_fERJ_iirucEpn8e16RWynPA_cH2pvTqthHMRoKEvL3EBQsny1kRe9EPD1HCdhy3scw0VoHMSuw-QqEsoYC3tNhXOpIZiqFaKm7kunW1ztnWJJFrmRkykhfay5vXQM9d7BzRRLGylQY05Qbv30cFImuG45g2dTQl-J99"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-trust-navy via-trust-navy/85 to-transparent"></div>
          
          <div className="relative z-10 max-w-max-width mx-auto px-4 md:px-margin-desktop grid md:grid-cols-12 gap-gutter items-center py-16 w-full">
            <div className="space-y-8 md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prestige-gold/15 border border-prestige-gold/30">
                <span className="w-2.5 h-2.5 rounded-full bg-prestige-gold animate-pulse"></span>
                <span className="font-label-sm text-xs text-prestige-gold font-bold uppercase tracking-widest">Atención Inmediata 24h</span>
              </div>
              <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-6xl text-white leading-tight font-extrabold tracking-tight">
                Juicios Rápidos en Barcelona: <span className="text-prestige-gold">Defensa Legal 24h Especializada</span>
              </h1>
              <p className="font-body-lg text-lg md:text-xl text-surface-variant/90 max-w-2xl leading-relaxed">
                Bajo la dirección técnica de <span className="text-white font-bold underline decoration-prestige-gold decoration-2">Santiago Giménez Olavarriaga</span>, máxima autoridad en derecho procesal penal de tráfico. Defensa técnica de élite para situaciones de máxima urgencia judicial.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="tel:+34605118871" 
                  className="bg-prestige-gold text-trust-navy px-8 py-4 rounded-lg font-label-md text-sm font-bold hover:bg-secondary-fixed hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-prestige-gold/25"
                >
                  <Phone className="w-4.5 h-4.5 fill-current" />
                  <div className="flex flex-col items-start">
                    <span className="leading-none text-base">LLamar abogado 24h (+34 605 118 871)</span>
                    <span className="text-[10px] opacity-80 font-normal">Respuesta inmediata &lt; 15 min</span>
                  </div>
                </a>
                <button 
                  onClick={() => handleScrollTo('especializacion')} 
                  className="border border-outline-variant/60 text-white bg-white/5 backdrop-blur-sm px-8 py-4 rounded-lg font-label-md text-sm font-semibold hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Ver Protocolo
                </button>
              </div>
            </div>
            
            <div className="hidden md:block md:col-span-5 pl-4">
              <div className="glass-card p-8 rounded-xl space-y-6 border-l-4 border-l-prestige-gold shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                <h3 className="font-headline-md text-xl font-bold text-white tracking-wide">Próximo Turno de Guardia</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-label-md text-sm text-white/90 font-medium">Juzgados de Guardia</span>
                    <span className="font-label-md text-xs bg-emerald-500/25 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold tracking-wide">DISPONIBLE</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-label-md text-sm text-white/90 font-medium">Tiempo de Respuesta</span>
                    <span className="font-label-md text-sm text-prestige-gold font-bold">&lt; 15 min</span>
                  </div>
                </div>
                
                <p className="font-label-sm text-xs text-white/60 leading-relaxed italic border-t border-white/10 pt-4">
                  * Servicio especializado en delitos contra la seguridad vial: Alcoholemia, exceso de velocidad y conducción sin carnet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Differentiated Info Section */}
        <section id="especializacion" className="py-24 bg-surface-ice border-b border-outline-variant/40">
          <div className="max-w-max-width mx-auto px-4 md:px-margin-desktop">
            <div className="text-center mb-16 space-y-4">
              <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Metodología Diferenciada</span>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-extrabold tracking-tight">
                Por Qué Autoridad.Legal es Diferente
              </h2>
              <div className="w-24 h-1 bg-prestige-gold mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-gutter">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant hover:border-prestige-gold/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-14 h-14 bg-trust-navy rounded-lg flex items-center justify-center mb-6 group-hover:bg-prestige-gold transition-colors shadow-md shadow-trust-navy/10">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-legal-ink mb-4">Soporte Humano 24/7</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  No somos un call center. Recibirá atención directa de abogados especializados en Barcelona desde el primer minuto, incluso en horario nocturno y festivos.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant hover:border-prestige-gold/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-14 h-14 bg-trust-navy rounded-lg flex items-center justify-center mb-6 group-hover:bg-prestige-gold transition-colors shadow-md shadow-trust-navy/10">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>minor_crash</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-legal-ink mb-4">Seguridad Vial</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Especialización técnica exclusiva en delitos de tráfico. Conocemos cada matiz de los atestados policiales y los protocolos de la Guardia Urbana.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant hover:border-prestige-gold/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-14 h-14 bg-trust-navy rounded-lg flex items-center justify-center mb-6 group-hover:bg-prestige-gold transition-colors shadow-md shadow-trust-navy/10">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-legal-ink mb-4">Pericia Local</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Presencia física diaria en la Ciutat de la Justícia. Conocimiento profundo de la jurisprudencia de las secciones de la Audiencia Provincial de Barcelona.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video & Credentials Section */}
        <section className="py-24 bg-white">
          <div className="max-w-max-width mx-auto px-4 md:px-margin-desktop grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Video Card with Click to Play */}
            <div 
              onClick={() => setIsVideoOpen(true)}
              className="relative aspect-video rounded-xl bg-trust-navy overflow-hidden group cursor-pointer shadow-2xl border border-outline-variant"
            >
              <img 
                alt="Santiago Giménez Olavarriaga Law Office" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRJiPVlX81zUBMy6zYOOGml6HnZTzzoFHLrMDSRSM7N4YrkrjPmns-MC89onw872cByKHiIeCEoq-Au1Tb32IYlRanGm9e6MFrFhsZPiKWcDuzXLVy-4Xc9gkY22NriLNqqmfoxwDMkGXoLdxbW5ToWvbLJyOdR-nK1jiWLcjg5Ia3sVxMPaCSTtTDo49CNQU18N502KRHa9nlEJxoTOOW1jZ6GzkIAjfJl8Dl0XFWvjEK1TJh4pvLO0FIWruV4BwLBfa5djHlln3Y"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy/90 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-prestige-gold rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20"
                >
                  <Play className="text-white fill-current w-8 h-8 pl-1" />
                </motion.div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-trust-navy/85 backdrop-blur-md rounded border border-white/10 shadow-lg">
                <p className="font-label-md text-white font-bold text-sm leading-snug">"Guía en Situ: Protocolo de actuación ante un Juicio Rápido"</p>
                <p className="font-label-sm text-prestige-gold text-xs mt-1">Santiago Giménez Olavarriaga - Director Técnico</p>
              </div>
            </div>

            {/* Credentials Info */}
            <div className="space-y-8">
              <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Credenciales de Élite</span>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold tracking-tight">
                Autoridad Respaldada por Resultados
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant italic border-l-4 border-prestige-gold pl-4 leading-relaxed">
                "La autoridad no se impone, se demuestra con resultados procesales. Nuestra misión en Barcelona es garantizar que el ciudadano reciba la defensa más técnica y rápida posible."
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                  <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">15+</p>
                  <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Años de Especialización</p>
                </div>
                <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                  <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">2.5k+</p>
                  <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Juicios en Barcelona</p>
                </div>
                <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                  <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">100%</p>
                  <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Transparencia de Costes</p>
                </div>
                <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                  <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">24h</p>
                  <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Disponibilidad Total</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-surface-low border-y border-outline-variant/30">
          <div className="max-w-max-width mx-auto px-4 md:px-margin-desktop">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Información de Defensa</span>
                <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold">
                  Preguntas Frecuentes sobre Juicios Rápidos
                </h2>
                <p className="font-body-md text-slate-600">Información técnica esencial para su defensa en Barcelona.</p>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg border border-outline-variant overflow-hidden shadow-sm transition-all duration-200">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full text-left p-6 cursor-pointer flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-headline-md font-bold text-legal-ink text-base md:text-lg leading-snug">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-legal-ink/65 transition-transform duration-200 shrink-0 ${activeFaq === index ? 'rotate-180 text-prestige-gold' : ''}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-slate-100">
                            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-normal">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Presence & Location Intelligence Section */}
        <section className="py-24 bg-white">
          <div className="max-w-max-width mx-auto px-4 md:px-margin-desktop">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Geographic Information & Interactive Points */}
              <div className="space-y-8 lg:col-span-6">
                <div className="space-y-4">
                  <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Jurisdicción Completa</span>
                  <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold tracking-tight">
                    Presencia en Distritos Judiciales
                  </h2>
                  <p className="font-body-lg text-base text-on-surface-variant leading-relaxed">
                    Centralizamos nuestra operativa en la <span className="font-bold text-legal-ink">Ciutat de la Justícia de Barcelona</span>, cubriendo todos los distritos y municipios del área metropolitana con respuesta inmediata.
                  </p>
                </div>
                
                {/* Micro-districts grid */}
                <div className="grid grid-cols-2 gap-4">
                  {["Barcelona Capital", "Hospitalet de Llobregat", "Badalona", "Santa Coloma"].map((district, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-surface-ice rounded-lg border border-outline-variant/60 shadow-sm hover:border-prestige-gold/45 transition-colors">
                      <MapPin className="w-5 h-5 text-prestige-gold shrink-0" />
                      <span className="font-label-md text-xs font-bold text-legal-ink">{district}</span>
                    </div>
                  ))}
                </div>

                {/* Sede Central card */}
                <div className="p-6 bg-trust-navy text-white rounded-xl shadow-lg border-l-4 border-prestige-gold">
                  <p className="font-label-md text-xs font-bold text-prestige-gold uppercase tracking-wider mb-2">Sede Central y Operativa:</p>
                  <p className="font-body-md text-sm leading-relaxed">
                    Gran Via de les Corts Catalanes, 111, 08014 Barcelona (Sede Ciutat de la Justícia). Punto de referencia judicial clave en el área metropolitana para guardias y juicios.
                  </p>
                </div>

                {/* Location Intelligence (Supabase points) */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-label-md text-sm font-bold text-legal-ink uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-prestige-gold" />
                    Puntos Clave de Control y Atestados
                  </h4>
                  <p className="text-xs text-on-surface-variant italic">Haz clic en un punto para ver detalles de la operativa local:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {interestPoints.map((pt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedInterestPoint(selectedInterestPoint === idx ? null : idx)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          selectedInterestPoint === idx 
                          ? 'bg-prestige-gold text-trust-navy border-prestige-gold font-bold scale-105' 
                          : 'bg-white text-on-surface border-outline-variant hover:border-prestige-gold/50'
                        }`}
                      >
                        {pt.name.split(' - ')[0]}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedInterestPoint !== null && (
                      <motion.div
                        key={selectedInterestPoint}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-4 bg-amber-50/50 border border-prestige-gold/25 rounded-lg text-xs space-y-1 mt-2 shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-trust-navy">{interestPoints[selectedInterestPoint].name}</span>
                          <span className="text-[10px] bg-prestige-gold/25 text-trust-navy px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {interestPoints[selectedInterestPoint].class}
                          </span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed mt-1">
                          {interestPoints[selectedInterestPoint].details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Map Image Panel */}
              <div className="lg:col-span-6 relative h-[420px] rounded-xl overflow-hidden shadow-2xl border border-outline-variant group">
                <img 
                  alt="Barcelona Map Area" 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCZfhnMedqHDPc7iFeJUP7yo0h1xqWzeqT8KYxMGP44-u5JQFtnZWakmXLGWC-d2HIXkrRHI54flk5fEainzsK-DxTD7ISzSakc3vo9AzVH718gZ88GLnqvcMFPTOBIVRGOGy1op9rovqrHWdsj0nI2r9OsQIo5ozBvLGtGlySvYFfM8DDgMdeLWrNqgaoH08qsPkZWAz1AGq_dvuEp67OuGJc1J6qBQKJIFZQnxAd3hKNvUdNhaKFLLEV4_0BnoFMUZ6sD-sc-W4R"
                />
                <div className="absolute inset-0 bg-trust-navy/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded border border-outline-variant shadow-md text-[10px] font-bold text-trust-navy flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                  Cobertura Geográfica Validada
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Urgencia Section */}
        <section id="contacto" className="py-24 bg-trust-navy relative overflow-hidden text-center text-white border-y border-outline-variant/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-prestige-gold/5 skew-x-12 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-white/2 skew-x-12 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-max-width mx-auto px-4 md:px-margin-desktop space-y-8">
            <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Consulta sin Compromiso</span>
            <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              ¿Necesita defensa penal urgente?
            </h2>
            <p className="font-body-lg text-lg text-surface-variant max-w-2xl mx-auto leading-relaxed opacity-90">
              Nuestros abogados penalistas de guardia están listos para asistirle ahora mismo en comisaría o juzgado. No deje su libertad y sus derechos en manos del azar.
            </p>
            
            <div className="flex flex-col items-center gap-6 pt-4">
              <a 
                className="text-4xl md:text-5xl font-headline-xl text-prestige-gold hover:text-secondary-fixed hover:scale-105 active:scale-95 transition-all inline-block font-extrabold tracking-tight border-b-2 border-dashed border-prestige-gold/30 hover:border-secondary-fixed/50 pb-1" 
                href="tel:+34605118871"
              >
                +34 605 118 871
              </a>
              <button 
                onClick={handleUrgentAction}
                className="bg-prestige-gold text-trust-navy px-12 py-5 rounded-lg font-headline-md text-base font-extrabold shadow-2xl hover:bg-secondary-fixed hover:scale-105 transition-all active:scale-95 tracking-wide"
              >
                Solicitar Consulta Ahora
              </button>
            </div>
          </div>
        </section>
      </main>
      {/* REACT VIDEO MODAL POPUP */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoOpen(false)}
              className="absolute inset-0 bg-trust-navy/90 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-outline-variant z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div>
                  <h3 className="font-headline-md text-base font-bold text-trust-navy leading-none">Protocolo de Juicio Rápido</h3>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Santiago Giménez Olavarriaga - Director Técnico</p>
                </div>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Video Simulated screen */}
              <div className="relative aspect-video bg-black flex flex-col justify-between p-6 overflow-hidden">
                {/* Background graphic */}
                <div className="absolute inset-0 bg-cover opacity-40 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRJiPVlX81zUBMy6zYOOGml6HnZTzzoFHLrMDSRSM7N4YrkrjPmns-MC89onw872cByKHiIeCEoq-Au1Tb32IYlRanGm9e6MFrFhsZPiKWcDuzXLVy-4Xc9gkY22NriLNqqmfoxwDMkGXoLdxbW5ToWvbLJyOdR-nK1jiWLcjg5Ia3sVxMPaCSTtTDo49CNQU18N502KRHa9nlEJxoTOOW1jZ6GzkIAjfJl8Dl0XFWvjEK1TJh4pvLO0FIWruV4BwLBfa5djHlln3Y')]" />
                
                {/* Visual Audio Waveform representation */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    {[16, 24, 40, 56, 32, 48, 64, 48, 32, 56, 40, 24, 16].map((height, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [height * 0.4, height, height * 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                        className="w-1.5 bg-prestige-gold rounded-full"
                        style={{ height: height }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 bg-black/45 self-start px-3 py-1 rounded text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 border border-white/10">
                  <Clock className="w-3 h-3 text-prestige-gold" />
                  REPRODUCIENDO GUÍA
                </div>

                <div className="relative z-10 self-center text-center max-w-md bg-trust-navy/95 border border-prestige-gold/20 p-5 rounded-lg shadow-xl backdrop-blur-sm space-y-2">
                  <h4 className="text-prestige-gold font-bold text-sm font-headline-md tracking-wide">Fases del Protocolo de Defensa 24h:</h4>
                  <ul className="text-left text-white/90 text-xs space-y-1.5 list-decimal list-inside font-medium">
                    <li>Atención y asesoramiento en el atestado policial.</li>
                    <li>Preparación y citación ante el Juzgado de Guardia.</li>
                    <li>Conformidad del tercio o defensa técnica procesal.</li>
                  </ul>
                </div>

                {/* Progress bar and controls */}
                <div className="relative z-10 space-y-3">
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="h-full bg-prestige-gold" 
                    />
                  </div>
                  <div className="flex justify-between items-center text-white/80 text-[10px] font-bold">
                    <span>PLAYING • 0:42 / 3:15</span>
                    <span className="text-prestige-gold uppercase tracking-wider">Santiago G.O. - Audio Guía</span>
                  </div>
                </div>
              </div>
              
              {/* Takeaways footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed text-center sm:text-left font-medium">
                  <strong>Recomendación del Director:</strong> "No declare ante la policía en el atestado inicial sin la presencia de su abogado especialista de confianza. Cada palabra del informe es crucial para el posterior juicio rápido."
                </p>
                <a 
                  href="tel:+34605118871" 
                  className="bg-prestige-gold text-trust-navy px-6 py-2.5 rounded-lg font-label-md text-xs font-bold hover:bg-[#ffe088] active:scale-95 transition-all shadow flex items-center gap-2 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  LLamar abogado 24h (+34 605 118 871)
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
