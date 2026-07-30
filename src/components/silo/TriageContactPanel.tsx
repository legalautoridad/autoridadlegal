import React, { ReactNode } from 'react';
import { PHONE_E164, PHONE_DISPLAY } from '@/lib/config';

export interface ContactMethodProps {
    title: string;
    description: string;
    href: string;
    icon: ReactNode;
    isPrimary: boolean;
    ariaLabel: string;
}

export function ContactMethod({ title, description, href, icon, isPrimary, ariaLabel }: ContactMethodProps) {
    const baseStyles = "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 w-full text-left";
    const primaryStyles = "bg-red-600 border-red-500 hover:bg-red-700 text-white shadow-lg shadow-red-600/20";
    const secondaryStyles = "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-900 shadow-sm";

    return (
        <a 
            href={href} 
            className={`${baseStyles} ${isPrimary ? primaryStyles : secondaryStyles}`}
            aria-label={ariaLabel}
        >
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${
                isPrimary ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="font-bold text-base md:text-lg tracking-tight leading-none">
                    {title}
                </h4>
                <p className={`text-xs md:text-sm ${
                    isPrimary ? 'text-white/80' : 'text-slate-500'
                }`}>
                    {description}
                </p>
            </div>
        </a>
    );
}

export function TriageContactPanel() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PHONE_E164.replace('+', '');
    return (
        <section className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-2 text-center">
                <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Triaje de Urgencia</span>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Canal de Asistencia Inmediata
                </h3>
                <p className="text-xs text-slate-400">
                    Seleccione la vía de contacto que mejor se adapte a la urgencia de su situación jurídica.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {/* 1. Línea de Guardia Judicial 24h (Primary) */}
                <ContactMethod
                    title="Línea de Guardia Judicial 24h"
                    description={`Hable con un abogado penalista ahora (${PHONE_DISPLAY}).`}
                    href={`tel:${PHONE_E164}`}
                    isPrimary={true}
                    ariaLabel="Llamar a la Línea de Guardia Judicial 24 horas"
                    icon={
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-6 h-6"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    }
                />

                {/* 2. Evaluación de Caso Express (WhatsApp) */}
                <ContactMethod
                    title="Evaluación de Caso Express (WhatsApp)"
                    description="Responda 5 preguntas y reciba viabilidad."
                    href={`https://wa.me/${whatsappNumber}?text=Hola,%20necesito%20asistencia%20legal%20urgente%20por%20alcoholemia.`}
                    isPrimary={false}
                    ariaLabel="Iniciar evaluación de caso express por WhatsApp"
                    icon={
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6 text-emerald-600"
                        >
                            <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.475 1.332 4.988l-1.356 4.989 5.097-1.341c1.458.799 3.097 1.22 4.773 1.22 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm.006 17.962c-1.579 0-3.129-.424-4.486-1.225l-.321-.191-3.33.876.888-3.262-.21-.335c-.879-1.401-1.343-3.024-1.343-4.698 0-4.444 3.616-8.061 8.06-8.061 4.444 0 8.061 3.617 8.061 8.061s-3.617 8.061-8.061 8.061h-.008zm4.417-6.04c-.242-.12-1.434-.707-1.656-.788-.222-.081-.384-.121-.546.121-.162.242-.627.788-.769.949-.142.162-.283.182-.525.061-.242-.12-1.02-.375-1.943-1.198-.718-.641-1.203-1.433-1.344-1.675-.142-.242-.015-.373.106-.493.109-.108.242-.283.364-.424.122-.142.162-.242.243-.404.081-.162.04-.303-.02-.424-.06-.12-.546-1.316-.749-1.802-.197-.474-.397-.409-.546-.417-.142-.008-.303-.008-.465-.008-.162 0-.424.061-.646.303-.222.242-.848.828-.848 2.02s.869 2.343.99 2.505c.121.162 1.708 2.607 4.138 3.655.578.249 1.029.398 1.381.51.58.184 1.109.158 1.526.096.465-.07 1.434-.586 1.636-1.152.202-.566.202-1.05.141-1.151-.06-.101-.222-.162-.464-.282z"/>
                        </svg>
                    }
                />

                {/* 3. Triaje Legal IA (Web) */}
                <ContactMethod
                    title="Triaje Legal IA (Web)"
                    description="Suba su atestado de forma segura y anónima."
                    href="#chat-widget"
                    isPrimary={false}
                    ariaLabel="Iniciar triaje legal mediante inteligencia artificial en la web"
                    icon={
                        <svg 
                            xmlns="http://www.w3.org/2500/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-6 h-6 text-blue-600"
                        >
                            <path d="M12 8V4H8" />
                            <rect width="16" height="12" x="4" y="8" rx="2" />
                            <path d="M2 14h2" />
                            <path d="M20 14h2" />
                            <path d="M15 13v2" />
                            <path d="M9 13v2" />
                        </svg>
                    }
                />
            </div>
        </section>
    );
}
