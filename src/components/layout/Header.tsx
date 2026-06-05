import Link from "next/link";
import { ShieldAlert, Menu, User, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
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

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href="/lawyer/dashboard"
                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-all border border-indigo-100 shadow-sm"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            MI PANEL
                            <span className="hidden lg:inline text-[10px] text-indigo-400 font-medium ml-2 border-l border-indigo-200 pl-2">
                                {user.email}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            ACCESO ABOGADOS
                        </Link>
                    )}
                    
                    <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
