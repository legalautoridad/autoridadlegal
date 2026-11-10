'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { getNavItems, isRouteActive, NavItem } from "@/lib/navigation";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname() || "";
    const navItems = getNavItems();

    // Determine if penal grouping should apply in mobile (> 8 items)
    const shouldGroupPenalInMobile = navItems.length > 8;
    const courtItems = navItems.filter((item) => item.category === 'court');
    const penalItems = navItems.filter((item) => item.category === 'penal');
    const adminItems = navItems.filter((item) => item.category === 'admin');
    const infoItems = navItems.filter((item) => item.category === 'info');

    const isAnyPenalActive = penalItems.some((item) => isRouteActive(item.href, pathname));

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-outline-variant w-full">
            <div className="container mx-auto px-4 md:px-margin-desktop flex items-center justify-between w-full h-20 md:h-24">
                {/* Logo */}
                <Link href="/" className="group" onClick={() => setIsOpen(false)}>
                    <Logo size="lg" theme="light" />
                </Link>

                <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                    {/* Desktop Nav - Fits cleanly on 1 line at 1280px */}
                    <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-label-md text-on-surface-variant whitespace-nowrap">
                        {navItems.map((item) => {
                            const isActive = isRouteActive(item.href, pathname);
                            return (
                                <div key={item.href} className="inline-flex items-center">
                                    {item.hasDivider && (
                                        <span
                                            className="h-4 w-px bg-outline-variant/60 mr-3 xl:mr-5 shrink-0"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <Link
                                        href={item.href}
                                        aria-label={item.ariaLabel}
                                        aria-current={isActive ? "page" : undefined}
                                        className={
                                            isActive
                                                ? "px-3 py-1.5 rounded-lg bg-[#ffe088] text-slate-900 font-bold transition-colors inline-flex items-center gap-1.5 shrink-0"
                                                : item.highlight
                                                    ? "hover:text-prestige-gold transition-colors font-semibold text-trust-navy inline-flex items-center gap-1.5 shrink-0"
                                                    : "hover:text-prestige-gold transition-colors font-medium text-slate-700 inline-flex items-center gap-1.5 shrink-0"
                                        }
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-prestige-gold/15 text-slate-900 border border-prestige-gold/40 shrink-0 font-sans leading-none"
                                                aria-hidden="true"
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 flex items-center justify-center text-legal-ink hover:text-prestige-gold transition-colors rounded-xl hover:bg-slate-50 focus:outline-none"
                        aria-label="Abrir menú de navegación"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-outline-variant px-4 py-4 shadow-lg animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <nav className="flex flex-col gap-1.5 text-sm font-label-md text-on-surface-variant">
                        {shouldGroupPenalInMobile ? (
                            <>
                                {/* 1. Busca tu juzgado */}
                                {courtItems.map((item) => {
                                    const isActive = isRouteActive(item.href, pathname);
                                    return (
                                        <Link 
                                            key={item.href}
                                            href={item.href} 
                                            aria-label={item.ariaLabel}
                                            aria-current={isActive ? "page" : undefined}
                                            className={
                                                isActive
                                                    ? "bg-[#ffe088] text-slate-900 font-bold py-3 px-4 rounded-xl block min-h-[44px]"
                                                    : "hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block min-h-[44px]"
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}

                                {/* 2. Desplegable Defensa Penal */}
                                <details 
                                    className="group rounded-xl border border-slate-200/90 bg-slate-50/60 overflow-hidden"
                                    open={isAnyPenalActive}
                                >
                                    <summary className="flex items-center justify-between py-3 px-4 font-semibold text-slate-800 hover:text-prestige-gold cursor-pointer select-none min-h-[44px]">
                                        <span>Defensa penal</span>
                                        <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
                                    </summary>
                                    <div className="flex flex-col gap-1 pb-2 px-2 pt-1 border-t border-slate-200/60 bg-white">
                                        {penalItems.map((item) => {
                                            const isActive = isRouteActive(item.href, pathname);
                                            return (
                                                <Link 
                                                    key={item.href}
                                                    href={item.href} 
                                                    aria-label={item.ariaLabel}
                                                    aria-current={isActive ? "page" : undefined}
                                                    className={
                                                        isActive
                                                            ? "bg-[#ffe088] text-slate-900 font-bold py-2.5 px-3 rounded-lg block min-h-[40px]"
                                                            : item.highlight
                                                                ? "hover:text-prestige-gold transition-colors font-bold text-trust-navy py-2.5 px-3 rounded-lg bg-prestige-gold/15 hover:bg-prestige-gold/20 block min-h-[40px]"
                                                                : "hover:text-prestige-gold transition-colors font-medium text-slate-700 py-2.5 px-3 rounded-lg hover:bg-slate-50 block min-h-[40px]"
                                                    }
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </details>

                                {/* Separador visual antes de servicios administrativos */}
                                <div className="my-1 border-t border-slate-200/80" aria-hidden="true" />

                                {/* 3. Multas y puntos */}
                                {adminItems.map((item) => {
                                    const isActive = isRouteActive(item.href, pathname);
                                    return (
                                        <Link 
                                            key={item.href}
                                            href={item.href} 
                                            aria-label={item.ariaLabel}
                                            aria-current={isActive ? "page" : undefined}
                                            className={
                                                isActive
                                                    ? "bg-[#ffe088] text-slate-900 font-bold py-3 px-4 rounded-xl block min-h-[44px]"
                                                    : "hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block min-h-[44px]"
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <span 
                                                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-prestige-gold/15 text-slate-900 border border-prestige-gold/40"
                                                        aria-hidden="true"
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}

                                {/* 4. Honorarios y Glosario */}
                                {infoItems.map((item) => {
                                    const isActive = isRouteActive(item.href, pathname);
                                    return (
                                        <Link 
                                            key={item.href}
                                            href={item.href} 
                                            aria-label={item.ariaLabel}
                                            aria-current={isActive ? "page" : undefined}
                                            className={
                                                isActive
                                                    ? "bg-[#ffe088] text-slate-900 font-bold py-3 px-4 rounded-xl block min-h-[44px]"
                                                    : "hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block min-h-[44px]"
                                            }
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </>
                        ) : (
                            /* Comportamiento idéntico actual si flag desactivado (<= 8 items) */
                            navItems.map((item) => {
                                const isActive = isRouteActive(item.href, pathname);
                                return (
                                    <Link 
                                        key={item.href}
                                        href={item.href} 
                                        aria-label={item.ariaLabel}
                                        aria-current={isActive ? "page" : undefined}
                                        className={
                                            isActive
                                                ? "bg-[#ffe088] text-slate-900 font-bold py-3 px-4 rounded-xl block min-h-[44px]"
                                                : item.highlight
                                                    ? "hover:text-prestige-gold transition-colors font-bold text-trust-navy py-3 px-4 rounded-xl bg-prestige-gold/15 hover:bg-prestige-gold/20 block min-h-[44px]"
                                                    : "hover:text-prestige-gold transition-colors font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 block min-h-[44px]"
                                        }
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
