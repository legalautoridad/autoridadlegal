import Link from "next/link";
import { Gavel, Phone } from "lucide-react";

export async function Header() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34657420999";
    const whatsappMessage = encodeURIComponent("Hola, necesito un abogado de urgencia.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Call Button */}
                        <a 
                            href="tel:+34900000000"
                            className="flex items-center gap-1.5 sm:gap-2 bg-prestige-gold hover:bg-[#ffe088] text-trust-navy text-[10px] sm:text-xs md:text-sm font-extrabold py-2 px-2.5 sm:py-2.5 sm:px-4 rounded-xl transition-all shadow-md shadow-prestige-gold/15 hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Llamar a la línea de guardia 24 horas"
                        >
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0 animate-pulse" />
                            <span className="hidden lg:inline">LLamar abogado 24h (900 000 000)</span>
                            <span className="hidden sm:inline lg:hidden">LLamar abogado 24h</span>
                            <span className="sm:hidden">LLamar 24h</span>
                        </a>

                        {/* WhatsApp Button */}
                        <a 
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs md:text-sm font-extrabold py-2 px-2.5 sm:py-2.5 sm:px-4 rounded-xl transition-all shadow-md shadow-emerald-600/15 hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Iniciar chat de urgencia por WhatsApp"
                        >
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping shrink-0" />
                            <span className="hidden sm:inline">Whatsapp Asistente IA</span>
                            <span className="sm:hidden">Whatsapp IA</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
