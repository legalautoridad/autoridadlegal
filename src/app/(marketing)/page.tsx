import Link from "next/link";
import { Lock } from "lucide-react";

import { SchemaOrg } from "@/components/seo/SchemaOrg";

export default function MarketingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-surface text-primary p-6">
            <SchemaOrg
                type="LegalService"
                data={{
                    name: "Autoridad Legal",
                    url: "https://autoridadlegal.com",
                    description: "Plataforma de servicios jurídicos integrales impulsada por IA. Especialistas en derecho penal, civil y laboral.",
                    areaServed: "España",
                    address: {
                        "@type": "PostalAddress",
                        "addressCountry": "ES"
                    }
                }}
            />
            <div className="max-w-4xl text-center space-y-8">
                <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-7xl">
                    Autoridad Legal
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Plataforma Jurídica de Alto Rendimiento.
                    <br />
                    Genesis Project 2025.
                </p>

                <div className="absolute top-6 right-6">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
                    >
                        <Lock className="w-4 h-4" />
                        Acceso Abogados
                    </Link>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/lawyer/dashboard"
                        className="rounded-full bg-primary px-8 py-3 text-white font-medium hover:bg-slate-800 transition-colors"
                    >
                        Access Dashboard
                    </Link>
                    <Link
                        href="/alcoholemia"
                        className="rounded-full bg-accent px-8 py-3 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                        Vertical Example
                    </Link>
                </div>
            </div>
        </main>
    );
}
