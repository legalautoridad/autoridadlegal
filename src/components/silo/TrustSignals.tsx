import { Scale, ShieldCheck, FileCheck, Gavel } from "lucide-react";

export function TrustSignals() {
    return (
        <section className="bg-surface-ice border-y border-outline-variant/40 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80 transition-all duration-500">

                    <div className="flex items-center space-x-2">
                        <Scale className="h-8 w-8 text-trust-navy" />
                        <span className="font-label-md font-bold text-trust-navy">Colegio de Abogados</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-trust-navy" />
                        <span className="font-label-md font-bold text-trust-navy">GDPR Compliant</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Gavel className="h-8 w-8 text-trust-navy" />
                        <span className="font-label-md font-bold text-trust-navy">Garantía Jurídica</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FileCheck className="h-8 w-8 text-trust-navy" />
                        <span className="font-label-md font-bold text-trust-navy">Sentencias 98%</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
