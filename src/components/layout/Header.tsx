import Link from "next/link";
import { Gavel } from "lucide-react";

export async function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-outline-variant h-20 flex items-center">
            {/* Main Navigation */}
            <div className="container mx-auto px-4 md:px-margin-desktop flex items-center justify-between w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
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
                </div>
            </div>
        </header>
    );
}
