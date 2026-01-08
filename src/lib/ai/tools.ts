import { SchemaType, FunctionDeclaration } from "@google/generative-ai";

// 1. DEFINICIÓN DE LA HERRAMIENTA (Para la API de Gemini)
export const pricingToolDefinition: FunctionDeclaration = {
    name: "calculate_legal_quote",
    description: "Calcula el presupuesto exacto y genera los argumentos de justificación basándose en la complejidad del caso.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            has_accident: { type: SchemaType.BOOLEAN, description: "Si hubo accidente o daños a terceros." },
            is_recidivist: { type: SchemaType.BOOLEAN, description: "Si tiene antecedentes penales." },
            is_professional_driver: { type: SchemaType.BOOLEAN, description: "Si es transportista o necesita el coche para trabajar/horario laboral." },
            user_hesitation_level: { type: SchemaType.STRING, format: 'enum', enum: ["none", "medium", "high"], description: "Nivel de resistencia del usuario al precio (para activar descuentos)." }
        },
        required: ["has_accident", "is_recidivist", "is_professional_driver"]
    }
};

// 2. LÓGICA DEL ALGORITMO (Backend)
export function calculateLegalQuote(args: {
    has_accident: boolean;
    is_recidivist: boolean;
    is_professional_driver: boolean;
    user_hesitation_level?: string;
}) {
    let basePrice = 1000;
    let reasons: string[] = [];

    // Lógica de Incremento por Complejidad
    if (args.has_accident) {
        basePrice += 200;
        reasons.push("accidente (responsabilidad civil)");
    }
    if (args.is_recidivist) {
        basePrice += 200;
        reasons.push("reincidencia (riesgo de prisión efectiva)");
    }
    if (args.is_professional_driver) {
        basePrice += 100;
        reasons.push("riesgo laboral (defensa del puesto de trabajo)");
    }

    // Lógica de Negociación (Floor Price)
    let finalPrice = basePrice;
    let discountApplied = false;

    // Si el usuario duda mucho (High Hesitation), bajamos al suelo
    if (args.user_hesitation_level === "high" || args.user_hesitation_level === "medium") {
        // El suelo mínimo absoluto es 850€, o 1000€ si hay accidente (muy complejo)
        const floorPrice = args.has_accident ? 1000 : 850;

        if (finalPrice > floorPrice) {
            finalPrice = Math.max(floorPrice, finalPrice - 150); // Bajamos hasta 150€ o el suelo
            discountApplied = true;
        }
    }

    return {
        market_price_range: "1.100€ - 1.800€",
        calculated_price: finalPrice,
        reservation_price: 50,
        discounted_price_with_reservation: finalPrice - 100, // 10% aprox o 100€ directo
        complexity_reasons: reasons,
        is_negotiated_offer: discountApplied
    };
}

// 3. HERRAMIENTA DE GENERACIÓN DE ENLACE DE PAGO (Checkout Redirect)
export const agreementToolDefinition: FunctionDeclaration = {
    name: 'generate_agreement',
    description: 'Generates the secure Checkout Link for the user to enter their details and pay the reservation.',
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            city: {
                type: SchemaType.STRING,
                description: 'City where the legal service is needed.',
            },
            finalPrice: {
                type: SchemaType.NUMBER,
                description: 'The final negotiated price (e.g., 1000 or 990).',
            }
        },
        required: ['city', 'finalPrice'],
    },
};

export function generateAgreement(args: { city: string, finalPrice: number }) {
    console.log('[AGREEMENT] Generating Link for:', args);

    const lawyerName = "Don Santiago Giménez Olavarriaga";
    const lawyerCollegeId = "Col. ICAB 31.389";

    // Construct local URL for the checkout page we just built
    // We add a timestamp or ID to make it unique if needed, but query params are enough.
    const paymentLink = `/checkout/summary?vertical=Alcoholemia&city=${encodeURIComponent(args.city)}&price=${args.finalPrice}`;

    return {
        status: "success",
        message: "Enlace generado.",
        lawyer: {
            name: lawyerName,
            id: lawyerCollegeId
        },
        paymentLink: paymentLink,
        instructions: "Muestra este enlace al usuario para que rellene sus datos en la plataforma segura.",
        details: {
            priceTotal: 1100,
            priceDiscounted: args.finalPrice,
            reservation: 50
        }
    };
}
