import { tool } from 'ai';
import { z } from 'zod';

// 1. LÓGICA DEL ALGORITMO (Backend)
export function calculateLegalQuoteLogic(args: {
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

export function recordLeadDataLogic(args: {
    name: string;
    phone: string;
    email?: string;
    case_summary: string;
    urgency_level: string;
}) {
    console.log('[LEAD] Recording data:', args);
    // En el futuro esto podría persistir en DB
    return {
        status: "success",
        message: "Datos registrados correctamente en el sistema de gestión de Leads.",
        follow_up_instruction: "Agradece los datos y procede con la siguiente fase del diagnóstico legal."
    };
}

export function generateAgreementLogic(args: { city: string, finalPrice: number }) {
    console.log('[AGREEMENT] Generating Link for:', args);

    const lawyerName = "Don Santiago Giménez Olavarriaga";
    const lawyerCollegeId = "Col. ICAB 31.389";

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

// 2. DEFINICIÓN DE HERRAMIENTAS (Para Vercel AI SDK)
export const tools = {
    calculate_legal_quote: tool({
        description: 'Calcula el presupuesto exacto y genera los argumentos de justificación basándose en la complejidad del caso.',
        parameters: z.object({
            has_accident: z.boolean().describe('Si hubo accidente o daños a terceros.'),
            is_recidivist: z.boolean().describe('Si tiene antecedentes penales.'),
            is_professional_driver: z.boolean().describe('Si es transportista o necesita el coche para trabajar/horario laboral.'),
            user_hesitation_level: z.enum(['none', 'medium', 'high']).optional().describe('Nivel de resistencia del usuario al precio (para activar descuentos).'),
        }),
        execute: async (args) => calculateLegalQuoteLogic(args),
    }),

    record_lead_data: tool({
        description: 'Registra los datos de contacto y detalles del caso del usuario una vez obtenidos. Úsala tan pronto como tengas el nombre y teléfono.',
        parameters: z.object({
            name: z.string().describe('Nombre completo del usuario.'),
            phone: z.string().describe('Teléfono de contacto.'),
            email: z.string().optional().describe('Correo electrónico (opcional).'),
            case_summary: z.string().describe('Resumen breve de lo ocurrido.'),
            urgency_level: z.enum(['low', 'medium', 'high']).describe('Nivel de urgencia detectado.'),
        }),
        execute: async (args) => recordLeadDataLogic(args),
    }),

    generate_agreement: tool({
        description: 'Generates the secure Checkout Link for the user to enter their details and pay the reservation.',
        parameters: z.object({
            city: z.string().describe('City where the legal service is needed.'),
            finalPrice: z.number().describe('The final negotiated price (e.g., 1000 or 990).'),
        }),
        execute: async (args) => generateAgreementLogic(args),
    }),
};
