'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, Phone } from 'lucide-react';

export interface InteractiveVideoModalProps {
    specialty: string;
    cityName: string;
    directorName?: string;
    yearsExperience?: string;
    totalCases?: string;
}

export function InteractiveVideoModal({
    specialty,
    cityName,
    directorName = "Santiago Giménez Olavarriaga",
    yearsExperience = "15+",
    totalCases = "2.5k+"
}: InteractiveVideoModalProps) {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <>
            <section className="py-24 bg-white border-b border-outline-variant/30">
                <div className="max-w-7xl mx-auto px-4 md:px-16 grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Video Card with Click to Play */}
                    <div 
                        onClick={() => setIsVideoOpen(true)}
                        className="relative aspect-video rounded-xl bg-trust-navy overflow-hidden group cursor-pointer shadow-2xl border border-outline-variant"
                    >
                        <img 
                            alt={`${directorName} Law Office`} 
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
                            <p className="font-label-md text-white font-bold text-sm leading-snug">&quot;Guía en Situ: Protocolo de actuación ante un {specialty} en {cityName}&quot;</p>
                            <p className="font-label-sm text-prestige-gold text-xs mt-1">{directorName} - Director Técnico</p>
                        </div>
                    </div>

                    {/* Credentials Info */}
                    <div className="space-y-8">
                        <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Credenciales de Élite</span>
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold tracking-tight">
                            Autoridad Respaldada por Resultados en {cityName}
                        </h2>
                        <p className="font-body-lg text-lg text-on-surface-variant italic border-l-4 border-prestige-gold pl-4 leading-relaxed">
                            &quot;La autoridad no se impone, se demuestra con resultados procesales. Nuestra misión en {cityName} es garantizar que el ciudadano reciba la defensa más técnica y rápida posible.&quot;
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                                <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">{yearsExperience}</p>
                                <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Años de Especialización</p>
                            </div>
                            <div className="p-5 border border-outline-variant/60 bg-surface-ice rounded-lg shadow-sm">
                                <p className="font-headline-md text-3xl font-extrabold text-prestige-gold">{totalCases}</p>
                                <p className="font-label-sm text-xs font-medium text-legal-ink/80 mt-1">Casos en la Zona</p>
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
                                    <h3 className="font-headline-md text-base font-bold text-trust-navy leading-none">Protocolo de {specialty}</h3>
                                    <p className="text-[10px] text-on-surface-variant font-medium mt-1">{directorName} - Director Técnico</p>
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
                                    <h4 className="text-prestige-gold font-bold text-sm font-headline-md tracking-wide">Fases del Protocolo de Defensa:</h4>
                                    <ul className="text-left text-white/90 text-xs space-y-1.5 list-decimal list-inside font-medium">
                                        <li>Asesoramiento y atención inmediata desde la primera citación o control.</li>
                                        <li>Análisis completo de la tasa de alcohol, alcoholímetro o atestado policial.</li>
                                        <li>Defensa técnica, preparación de pruebas y conformidad óptima si procede.</li>
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
                                        <span className="text-prestige-gold uppercase tracking-wider">{directorName} - Audio Guía</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Takeaways footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed text-center sm:text-left font-medium">
                                    <strong>Recomendación del Director:</strong> &quot;No realice declaraciones ante la policía en el atestado inicial sin la asistencia de su abogado penalista especialista. Cada detalle del informe puede condicionar el resultado.&quot;
                                </p>
                                <a 
                                    href="tel:+34900000000" 
                                    className="bg-prestige-gold text-trust-navy px-6 py-2.5 rounded-lg font-label-md text-xs font-bold hover:bg-[#ffe088] active:scale-95 transition-all shadow flex items-center gap-2 shrink-0"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-current" />
                                    LLamar abogado 24h (900 000 000)
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
