import { LucideIcon, Scale, ShieldAlert, HeartHandshake, Ambulance, Gavel, Scroll } from "lucide-react";

export type SiloTheme = "urgency" | "trust" | "compensation";

export interface SiloConfig {
    slug: string;
    theme: SiloTheme;
    colors: {
        primary: string; // Tailwind bg class
        accent: string;  // Tailwind text class
        gradient: string; // Tailwind gradient classes
    };
    seo: {
        title: string;
        description: string;
    };
    hero: {
        title: string;
        subtitle: string;
        badge_text: string;
        cta: string;
    };
    stats: {
        label: string;
        value: string;
    }[];
    pain_points: {
        title: string;
        items: string[];
    };
    features: string[];
}

export const SILO_CONFIGS: Record<string, SiloConfig> = {
    alcoholemia: {
        slug: "alcoholemia",
        theme: "urgency",
        colors: {
            primary: "bg-orange-600",
            accent: "text-orange-600",
            gradient: "from-orange-50 to-orange-100",
        },
        seo: {
            title: "Abogados Alcoholemia 24h | Juicio Rápido y Defensa Urgente",
            description: "Especialistas en juicios rápidos por alcoholemia. Minimizamos retirada de carné y multas. Atención inmediata en comisaría y juzgado.",
        },
        hero: {
            title: "Defensa Especializada en Alcoholemia y Seguridad Vial",
            subtitle: "¿Positivo en control? No dejes que un error arruine tu vida laboral. Minimizamos la retirada de carné y la multa.",
            badge_text: "Abogado de Guardia Disponible",
            cta: "Hablar con Abogado de Urgencia",
        },
        stats: [
            { label: "Casos Gestionados", value: "+1.200" },
            { label: "Sentencias Favorables", value: "94%" },
            { label: "Atención", value: "24/7" },
        ],
        pain_points: {
            title: "¿Qué pasa si no actúas rápido?",
            items: [
                "Retirada del permiso de conducir hasta 4 años",
                "Antecedentes penales (problemas laborales)",
                "Multas económicas elevadas",
                "Posible pena de prisión en casos graves",
            ],
        },
        features: [
            "Asistencia en Comisaría 24/7",
            "Defensa en Juicio Rápido",
            "Recurso de Multas Tráfico",
        ],
    },
    herencias: {
        slug: "herencias",
        theme: "trust",
        colors: {
            primary: "bg-slate-800",
            accent: "text-slate-800",
            gradient: "from-slate-50 to-slate-200",
        },
        seo: {
            title: "Abogados Herencias y Sucesiones | Planificación Patrimonial",
            description: "Expertos en desbloqueo de herencias, testamentos y fiscalidad sucesoria. Protege tu patrimonio familiar con autoridad legal.",
        },
        hero: {
            title: "Desbloqueo de Herencias y Planificación Sucesoria",
            subtitle: "Evita conflictos familiares y optimiza la carga fiscal de tu legado con expertos en derecho sucesorio.",
            badge_text: "Expertos en Planificación Patrimonial",
            cta: "Consulta de Planificación",
        },
        stats: [
            { label: "Patrimonio Gestionado", value: "+50M€" },
            { label: "Herencias Desbloqueadas", value: "100%" },
            { label: "Experiencia", value: "20 Años" },
        ],
        pain_points: {
            title: "Riesgos de una mala gestión sucesoria",
            items: [
                "Bloqueo de cuentas bancarias y bienes inmuebles",
                "Pago excesivo de Impuesto de Sucesiones",
                "Conflictos y roturas familiares irreversibles",
                "Pérdida de bonificaciones fiscales por plazos",
            ],
        },
        features: [
            "Testamentos y Últimas Voluntades",
            "Liquidación de Impuesto Sucesiones",
            "Mediación Familiar",
        ],
    },
    accidentes: {
        slug: "accidentes",
        theme: "compensation",
        colors: {
            primary: "bg-blue-600",
            accent: "text-blue-600",
            gradient: "from-blue-50 to-blue-100",
        },
        seo: {
            title: "Abogados Accidentes Tráfico | Indemnización Máxima",
            description: "Reclamamos tu indemnización por accidente de tráfico. No aceptes la primera oferta del seguro. Consulta gratuita.",
        },
        hero: {
            title: "Indemnización Máxima por Accidente",
            subtitle: "No aceptes la primera oferta del seguro. Reclamamos lo que realmente te corresponde con peritos médicos independientes.",
            badge_text: "Peritos Médicos Independientes",
            cta: "Valorar mi Indemnización Gratis",
        },
        stats: [
            { label: "Indemnizaciones", value: "+3M€" },
            { label: "Éxito en Reclamación", value: "98%" },
            { label: "Coste Inicial", value: "0€" },
        ],
        pain_points: {
            title: "¿Por qué no confiar solo en tu seguro?",
            items: [
                "Ofertas hasta un 60% inferiores a lo legal",
                "Alta médica prematura sin curación total",
                "Secuelas no valoradas correctamente",
                "Conflicto de intereses entre aseguradoras",
            ],
        },
        features: [
            "Cálculo de Indemnización Real",
            "Negociación con Aseguradoras",
            "Sin Coste si No Ganamos",
        ],
    },
};

export const getSiloConfig = (slug: string): SiloConfig | null => {
    return SILO_CONFIGS[slug] || null;
};
