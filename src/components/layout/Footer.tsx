
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-white font-serif">Autoridad Legal</span>
                        </div>
                        <p className="text-sm">
                            Plataforma tecnológica de gestión de servicios jurídicos de alta especialización.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="col-span-1">
                        <h4 className="text-slate-200 font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/legal/legal-notice" className="hover:text-white transition-colors">Aviso Legal</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Términos de Contratación</Link></li>
                        </ul>
                    </div>

                    {/* Trust Signals */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-start md:items-end">
                        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-medium text-slate-200">Pago Seguro 100% Garantizado</span>
                        </div>
                        <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Visual Stripe "Badge" (Text/Icon Representation) */}
                            <span className="flex items-center gap-1 text-slate-300 font-bold tracking-tight">
                                <span className="text-lg">Powered by</span>
                                <span className="text-2xl text-white">stripe</span>
                            </span>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 text-right">
                            &copy; {new Date().getFullYear()} Autoridad Legal S.L. Todos los derechos reservados.<br />
                            Inscrita en el Registro Mercantil de Barcelona. NIF: B-12345678
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}
