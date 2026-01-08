import { Scale, ShieldCheck, FileCheck, Gavel } from "lucide-react";

export function TrustSignals() {
    return (
        <section className="bg-slate-50 border-y border-slate-200 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">

                    <div className="flex items-center space-x-2">
                        <Scale className="h-8 w-8 text-slate-800" />
                        <span className="font-serif font-bold text-slate-800">Colegio de Abogados</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-slate-800" />
                        <span className="font-serif font-bold text-slate-800">GDPR Compliant</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Gavel className="h-8 w-8 text-slate-800" />
                        <span className="font-serif font-bold text-slate-800">Garantía Jurídica</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FileCheck className="h-8 w-8 text-slate-800" />
                        <span className="font-serif font-bold text-slate-800">Sentencias 98%</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
