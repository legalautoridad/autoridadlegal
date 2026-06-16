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
 
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-label-md text-on-surface-variant">
                    <Link href="/alcoholemia" className="hover:text-prestige-gold transition-colors font-medium">Alcoholemia</Link>
                    <Link href="/juicios-rapidos/barcelona" className="hover:text-prestige-gold transition-colors font-semibold text-trust-navy">Juicios Rápidos</Link>
                    <Link href="/recursos" className="hover:text-prestige-gold transition-colors font-medium">Recursos</Link>
                </nav>
            </div>
        </header>
    );
}
