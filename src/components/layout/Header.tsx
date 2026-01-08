import Link from "next/link";
import { ShieldAlert, Menu, Phone } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
            {/* Urgency Protocol Strip */}
            <div className="bg-black text-white px-4 py-2 text-center text-xs md:text-sm font-bold tracking-widest uppercase">
                <span className="animate-pulse text-red-500 mr-2">🚨 Protocolo de Urgencia Activado 24h</span>
                <span className="hidden md:inline text-slate-400">|</span>
                <span className="hidden md:inline ml-2 text-slate-300">Respuesta Garantizada en &lt; 30 min</span>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-slate-900 text-white p-2 rounded-lg group-hover:bg-blue-900 transition-colors">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-serif text-slate-900 tracking-tight">
                        AUTORIDAD <span className="font-bold">LEGAL</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/alcoholemia" className="hover:text-blue-600 transition-colors">Alcoholemia</Link>
                    <Link href="/accidentes" className="hover:text-blue-600 transition-colors">Accidentes</Link>
                    <Link href="/herencias" className="hover:text-blue-600 transition-colors">Herencias</Link>
                    <Link href="/recursos" className="hover:text-blue-600 transition-colors">Recursos</Link>
                </nav>

                {/* CTA Button */}
                <div className="flex items-center gap-4">
                    <a
                        href="tel:900000000"
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-full font-bold text-sm shadow-red-200 shadow-lg hover:bg-red-700 transition-all hover:scale-105"
                    >
                        <Phone className="h-4 w-4" />
                        <span>URGENCIAS</span>
                    </a>
                    <button className="md:hidden p-2 text-slate-600">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
