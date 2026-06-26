'use client';

import { useState } from "react";
import Link from "next/link";
import { Gavel, Menu, X } from "lucide-react";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-outline-variant w-full">
            <div className="container mx-auto px-4 md:px-margin-desktop flex items-center justify-between w-full h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                    <Gavel className="text-legal-ink w-7 h-7 group-hover:text-prestige-gold transition-colors shrink-0" />
                    <span className="font-headline-md text-xl md:text-2xl font-bold text-legal-ink tracking-tight">
                        Autoridad<span className="text-prestige-gold">.Legal</span>
                    </span>
                </Link>
 
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-label-md text-on-surface-variant">
                        <Link href="/alcoholemia" className="hover:text-prestige-gold transition-colors font-medium">Alcoholemia</Link>
                        <Link href="/drogas" className="hover:text-prestige-gold transition-colors font-medium">Drogas</Link>
                        <Link href="/sin-carnet" className="hover:text-prestige-gold transition-colors font-medium">Sin Carnet</Link>
                        <Link href="/velocidad" className="hover:text-prestige-gold transition-colors font-medium">Velocidad</Link>
                        <Link href="/profesionales" className="hover:text-prestige-gold transition-colors font-semibold text-trust-navy">Profesionales</Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-legal-ink hover:text-prestige-gold transition-colors rounded-xl hover:bg-slate-50 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-outline-variant px-4 py-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
                    <nav className="flex flex-col gap-1.5 text-sm font-label-md text-on-surface-variant">
                        <Link 
                            href="/alcoholemia" 
                            className="hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block"
                            onClick={() => setIsOpen(false)}
                        >
                            Alcoholemia
                        </Link>
                        <Link 
                            href="/drogas" 
                            className="hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block"
                            onClick={() => setIsOpen(false)}
                        >
                            Drogas
                        </Link>
                        <Link 
                            href="/sin-carnet" 
                            className="hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block"
                            onClick={() => setIsOpen(false)}
                        >
                            Sin Carnet
                        </Link>
                        <Link 
                            href="/velocidad" 
                            className="hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block"
                            onClick={() => setIsOpen(false)}
                        >
                            Velocidad
                        </Link>
                        <Link 
                            href="/profesionales" 
                            className="hover:text-prestige-gold transition-colors font-bold text-trust-navy py-3 px-4 rounded-xl bg-prestige-gold/15 hover:bg-prestige-gold/20 block"
                            onClick={() => setIsOpen(false)}
                        >
                            Profesionales
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
