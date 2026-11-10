import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Scale, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Página no encontrada | Autoridad Legal',
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main className="min-h-[70vh] bg-slate-900 text-white flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl w-full text-center space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 text-[#ffe088] text-4xl font-extrabold shadow-xl">
                    404
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                        Página no encontrada
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                        El enlace que has seguido no existe, ha caducado o la página ha sido retirado. Puedes continuar navegando a través de las siguientes secciones:
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#ffe088] hover:bg-amber-300 text-slate-900 font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span>Inicio</span>
                    </Link>

                    <Link
                        href="/juzgados"
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                        <Scale className="w-4 h-4 text-[#ffe088]" />
                        <span>Juzgados de guardia</span>
                    </Link>

                    <Link
                        href="/honorarios"
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                        <FileText className="w-4 h-4 text-[#ffe088]" />
                        <span>Honorarios cerrados</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}

