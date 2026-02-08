import { getSiloConfig, SILO_CONFIGS } from "@/lib/silo-config";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/silo/HeroSection";
import { TrustSignals } from "@/components/silo/TrustSignals";
import { ValueProposition } from "@/components/silo/ValueProposition";
import { StatsRow } from "@/components/silo/StatsRow"; // New
import { PainPoints } from "@/components/silo/PainPoints"; // New
import { Metadata } from "next";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { FAQAccordion } from "@/components/seo/FAQAccordion"; // Keep for now if needed, or remove?
import { FAQSection } from "@/components/seo/FAQSection";

type Props = {
    params: Promise<{ service: string }>;
};

// SEO: Generate Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { service } = await params;
    const config = getSiloConfig(service);

    if (!config) {
        return {
            title: "Autoridad Legal | Especialistas",
        };
    }

    return {
        title: config.seo.title,
        description: config.seo.description,
    };
}



// Page Implementation
// ...

export default async function VerticalPage({ params }: Props) {
    const { service } = await params;
    const config = getSiloConfig(service);

    if (!config) {
        return notFound();
    }

    // Default FAQs based on config
    const faqs = [
        {
            question: `¿Cuánto cuesta un abogado especialista en ${config.hero.badge_text}?`,
            answer: "Nuestra plataforma analiza tu caso gratuitamente y te ofrece un presupuesto cerrado sin compromiso. Sin sorpresas ni letra pequeña."
        },
        {
            question: "¿Cuánto tardan en contactarme?",
            answer: "Nuestro sistema de IA procesa tu solicitud en tiempo real. Un abogado especializado te contactará en menos de 15 minutos."
        },
        {
            question: "¿Es confidencial mi consulta?",
            answer: "Absolutamente. Toda la información está encriptada y protegida bajo secreto profesional desde el primer clic."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            <SchemaOrg
                type="Service"
                data={{
                    name: `Servicio de ${config.hero.title}`,
                    provider: {
                        "@type": "LegalService",
                        "name": "Autoridad Legal"
                    },
                    areaServed: "España",
                    description: config.seo.description
                }}
            />
            <SchemaOrg
                type="FAQPage"
                data={{
                    mainEntity: faqs.map(faq => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                        }
                    }))
                }}
            />

            {/* 1. Hero (Gradient & Urgency) */}
            <HeroSection config={config} />

            {/* 2. Stats (Authority Data) */}
            <StatsRow config={config} />

            {/* 3. Social Proof (Logos) */}
            <TrustSignals />

            {/* 4. Pain Points (Fear of Missing Out) */}
            <PainPoints config={config} />

            {/* 5. Process (How it works) */}
            <ValueProposition config={config} />

            {/* --- FAQ SECTION (National) --- */}
            <FAQSection category={service} city="Cataluña" />

            {/* --- CTA FINAL --- */}

            {/* Footer (Simple for now) */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
                <p>© 2024 Autoridad Legal. Todos los derechos reservados.</p>
                <p className="mt-2 text-slate-600">Especialistas en {config.hero.badge_text}</p>
            </footer>
        </main>
    );
}

// Static Generation (Optional, but good for performance)
export function generateStaticParams() {
    return Object.keys(SILO_CONFIGS).map((slug) => ({
        service: slug,
    }));
}
