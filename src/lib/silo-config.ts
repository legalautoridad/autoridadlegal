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
        specialty: string;
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

const STANDARD_STATS = [
    { label: "Precio Claro", value: "Cerrado" },
    { label: "Financiación Disponible", value: "Flexible" },
    { label: "Atención", value: "Inmediata" },
];

export const SILO_CONFIGS: Record<string, SiloConfig> = {
    "juicios-rapidos": {
        slug: "juicios-rapidos",
        theme: "urgency",
        colors: {
            primary: "bg-trust-navy",
            accent: "text-prestige-gold",
            gradient: "from-trust-navy to-legal-ink",
        },
        seo: {
            title: "Abogado Juicios Rápidos | Defensa Penal 24h Especializada",
            description: "Especialistas en juicios rápidos. Defensa técnica de élite para situaciones de máxima urgencia judicial. Asistencia inmediata 24h en comisarías y juzgados.",
        },
        hero: {
            title: "Juicios Rápidos: Defensa Legal 24h Especializada",
            subtitle: "Defensa técnica de élite para situaciones de máxima urgencia judicial. Asistencia en menos de 15 minutos.",
            badge_text: "Atención Inmediata 24h",
            specialty: "Juicios Rápidos",
            cta: "Consulta Urgente",
        },
        stats: STANDARD_STATS,
        pain_points: {
            title: "¿Qué pasa si no actúas rápido?",
            items: [
                "Retirada del permiso de conducir de forma inmediata",
                "Antecedentes penales graves que afecten a tu vida laboral",
                "Multas económicas muy elevadas y penas de prisión",
                "Pérdida de la oportunidad de reducción de un tercio de la pena",
            ],
        },
        features: [
            "Asistencia en Comisaría y Juzgado de Guardia",
            "Defensa Técnica de Élite en Tráfico y Seguridad Vial",
            "Reducción de Condena y Negociación de Conformidades",
        ],
    },
    alcoholemia: {
        slug: "alcoholemia",
        theme: "urgency",
        colors: {
            primary: "bg-orange-600",
            accent: "text-orange-600",
            gradient: "from-orange-50 to-orange-100",
        },
        seo: {
            title: "Abogado Penalista para Juicio Rápido por Alcoholemia | Asistencia de Guardia",
            description: "Especialistas en juicios rápidos por alcoholemia. Minimizamos retirada de carné y multas. Atención inmediata en comisaría y juzgado.",
        },
        hero: {
            title: "Abogado Penalista para Juicio Rápido por Alcoholemia | Asistencia de Guardia",
            subtitle: "¿Positivo en control? No dejes que un error arruine tu vida laboral. Minimizamos la retirada de carné y la multa.",
            badge_text: "Asistencia Inmediata",
            specialty: "Alcoholemia",
            cta: "Hablar con Abogado de Urgencia",
        },
        stats: STANDARD_STATS,
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
            "Asistencia en Comisaría",
            "Defensa en Juicio Rápido",
            "Recurso de Multas Tráfico",
        ],
    },
    drogas: {
        slug: "drogas",
        theme: "urgency",
        colors: {
            primary: "bg-red-600",
            accent: "text-red-600",
            gradient: "from-red-50 to-red-100",
        },
        seo: {
            title: "Abogados Delitos por Drogas | Defensa Penal 24h",
            description: "Especialistas en defensa penal por conducir bajo la influencia de drogas. Evita penas de prisión y antecedentes penales. Asistencia en comisarías y juzgados.",
        },
        hero: {
            title: "Defensa Especializada en Delitos por Drogas y Seguridad Vial",
            subtitle: "¿Positivo en test de drogas? Protegemos tus derechos y defendemos tu libertad. Asistencia inmediata de guardia.",
            badge_text: "Urgencia 24h",
            specialty: "Drogas",
            cta: "Abogado de Guardia por Drogas",
        },
        stats: STANDARD_STATS,
        pain_points: {
            title: "¿Qué consecuencias afrontas?",
            items: [
                "Retirada del permiso de conducir hasta 4 años",
                "Penas de prisión de 3 a 6 meses",
                "Multas de hasta 1.000€ y pérdida de 6 puntos",
                "Antecedentes penales de larga duración",
            ],
        },
        features: [
            "Impugnación de Test de Saliva y Analítica de Sangre",
            "Defensa en Juicio Rápido por Delito 379.2 CP",
            "Asistencia Inmediata en Comisaría y Juzgado",
        ],
    },
    "sin-carnet": {
        slug: "sin-carnet",
        theme: "urgency",
        colors: {
            primary: "bg-amber-600",
            accent: "text-amber-600",
            gradient: "from-amber-50 to-amber-100",
        },
        seo: {
            title: "Abogados Conducir Sin Carnet | Defensa de Urgencia 24h",
            description: "Abogados especialistas en delitos por conducir sin carné, pérdida de puntos o privación judicial. Evita la cárcel. Defensa penal inmediata.",
        },
        hero: {
            title: "Defensa Penal por Conducir Sin Carnet o Sin Puntos",
            subtitle: "¿Te han interceptado sin licencia de conducir? Actuamos de urgencia para evitar antecedentes penales y penas de prisión.",
            badge_text: "Guardia 24h",
            specialty: "Sin Carnet",
            cta: "Abogado Sin Carnet Urgente",
        },
        stats: STANDARD_STATS,
        pain_points: {
            title: "Gravedad de conducir sin permiso (Art. 384 CP)",
            items: [
                "Penas de prisión de 3 a 6 meses",
                "Multas diarias severas durante meses",
                "Trabajos en beneficio de la comunidad",
                "Antecedentes penales que bloquean tu futuro",
            ],
        },
        features: [
            "Defensa en Juicios Rápidos en Toda Cataluña",
            "Recurso por Notificaciones de Pérdida de Puntos",
            "Negociación de Conformidades Mínimas",
        ],
    },
    velocidad: {
        slug: "velocidad",
        theme: "urgency",
        colors: {
            primary: "bg-rose-600",
            accent: "text-rose-600",
            gradient: "from-rose-50 to-rose-100",
        },
        seo: {
            title: "Abogados Exceso de Velocidad | Delito contra la Seguridad Vial",
            description: "Especialistas en juicios rápidos por delitos de velocidad. Evita retirada de carné y antecedentes penales. Asistencia legal penal 24h.",
        },
        hero: {
            title: "Abogados Especialistas en Delitos por Exceso de Velocidad",
            subtitle: "¿Detectado por radar superando el límite penal? Defendemos tus derechos y evitamos la privación del permiso de conducir.",
            badge_text: "Defensa de Radar",
            specialty: "Velocidad",
            cta: "Asistencia Penal por Radar",
        },
        stats: STANDARD_STATS,
        pain_points: {
            title: "Riesgos del delito de velocidad (Art. 379.1 CP)",
            items: [
                "Retirada forzosa del carné de 1 a 4 años",
                "Pena de prisión de 3 a 6 meses",
                "Multa económica muy elevada",
                "Inscripción de antecedentes penales",
            ],
        },
        features: [
            "Impugnación de Homologación y Márgenes de Error de Radar",
            "Defensa y Representación en Juicios Rápidos",
            "Recurso de Multas en Vía Administrativa y Penal",
        ],
    },
    profesionales: {
        slug: "profesionales",
        theme: "urgency",
        colors: {
            primary: "bg-blue-600",
            accent: "text-blue-600",
            gradient: "from-blue-50 to-blue-100",
        },
        seo: {
            title: "Abogados Conductores Profesionales | Defensa de Guardia",
            description: "Especialistas en defensa de transportistas, taxistas, comerciales y conductores profesionales. Protegemos tu medio de vida y tu carné.",
        },
        hero: {
            title: "Defensa Legal Exclusiva para Conductores Profesionales",
            subtitle: "Tu permiso de conducir es tu trabajo. Defendemos a transportistas y taxistas ante alcoholemias, drogas y pérdida de puntos.",
            badge_text: "Protección Laboral",
            specialty: "Profesionales",
            cta: "Defender Mi Medio de Vida",
        },
        stats: STANDARD_STATS,
        pain_points: {
            title: "¿Qué está en juego para ti?",
            items: [
                "Pérdida inmediata de tu puesto de trabajo y licencia",
                "Límites de alcohol más estrictos (0.15 mg/l)",
                "Responsabilidad civil y multas de la empresa",
                "Inhabilitación profesional para conducir",
            ],
        },
        features: [
            "Defensa en Juicios Rápidos de Guardia",
            "Gestión de Pérdida de Puntos y Suspensión",
            "Sustitución de Penas para Mantener la Actividad",
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
            badge_text: "Expertos en Herencias",
            specialty: "Herencias",
            cta: "Consulta de Planificación",
        },
        stats: STANDARD_STATS,
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
            badge_text: "Indemnización Máxima",
            specialty: "Accidentes de Tráfico",
            cta: "Valorar mi Indemnización Gratis",
        },
        stats: STANDARD_STATS,
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
