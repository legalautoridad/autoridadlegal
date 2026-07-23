'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface InteractiveFaqAccordionProps {
    faqs: FAQItem[];
    title: string;
    subtitle: string;
}

export function InteractiveFaqAccordion({
    faqs,
    title,
    subtitle
}: InteractiveFaqAccordionProps) {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section id="faq" className="py-24 bg-surface-low border-y border-outline-variant/30">
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-prestige-gold text-xs font-bold uppercase tracking-widest">Información de Defensa</span>
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-trust-navy font-bold">
                            {title}
                        </h2>
                        <p className="font-body-md text-slate-600">{subtitle}</p>
                    </div>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-lg border border-outline-variant overflow-hidden shadow-sm transition-all duration-200"
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                    className="w-full text-left p-6 cursor-pointer flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-headline-md font-bold text-legal-ink text-base md:text-lg leading-snug">
                                        {faq.question}
                                    </span>
                                    <ChevronDown 
                                        className={`w-5 h-5 text-legal-ink/65 transition-transform duration-200 shrink-0 ${
                                            activeFaq === index ? 'rotate-180 text-prestige-gold' : ''
                                        }`} 
                                    />
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
                                                <div 
                                                    className="font-body-md text-sm text-on-surface-variant leading-relaxed font-normal prose max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                />
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
    );
}
