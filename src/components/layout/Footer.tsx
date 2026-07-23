import Link from 'next/link';
import { Shield, ShieldCheck, Scale } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="bg-trust-navy text-white/80 py-16 border-t border-white/10 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
                
                {/* Brand Column */}
                <div className="space-y-6 md:col-span-5">
                    <Link href="/" className="inline-block group">
                        <Logo size="lg" theme="dark" />
                    </Link>
                    <p className="font-body-md text-sm text-white/70 leading-relaxed max-w-sm">
                        Plataforma tecnológica de gestión de servicios jurídicos de alta especialización y defensa penal de tráfico en el área metropolitana de Barcelona.
                    </p>
                    <div className="flex gap-4 items-center">
                        <ShieldCheck className="text-prestige-gold w-6 h-6 hover:opacity-85 cursor-pointer shrink-0" />
                        <Shield className="text-prestige-gold w-6 h-6 hover:opacity-85 cursor-pointer shrink-0" />
                        <Scale className="text-prestige-gold w-6 h-6 hover:opacity-85 cursor-pointer shrink-0" />
                    </div>
                </div>

                {/* Links Columns */}
                <div className="grid grid-cols-2 gap-8 md:col-span-7">
                    <div className="space-y-4">
                        <h4 className="font-label-md text-xs font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest">Navegación</h4>
                        <ul className="space-y-3 text-xs">
                            <li><Link href="/alcoholemia" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Abogado Alcoholemia</Link></li>
                            <li><Link href="/drogas" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Abogado Drogas</Link></li>
                            <li><Link href="/sin-carnet" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Conducir Sin Carnet</Link></li>
                            <li><Link href="/velocidad" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Delito de Velocidad</Link></li>
                            <li><Link href="/profesionales" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors font-bold text-prestige-gold">Conductores Profesionales</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-label-md text-xs font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-3 text-xs">
                            <li><Link href="/legal/legal-notice" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Aviso Legal</Link></li>
                            <li><Link href="/legal/privacy" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="font-body-md text-white/70 hover:text-prestige-gold transition-colors">Términos de Contratación</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 border-t border-white/5 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="font-body-md text-xs text-center md:text-left text-white/50">
                    &copy; {new Date().getFullYear()} Autoridad.Legal - Especialistas en Defensa Penal. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-300">
                    <span className="text-[10px] text-white font-bold tracking-tight">
                        Powered by <span className="text-sm">stripe</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
