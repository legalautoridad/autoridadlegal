/**
 * CANONICAL PRICING SOURCE OF TRUTH — AUTORIDAD LEGAL
 *
 * Todos los precios, honorarios, suplementos, notas fiscales y opciones de pago
 * del despacho se definen exclusivamente en este módulo.
 * Ningún componente, plantilla o script debe contener importes 'hardcoded'.
 */

export interface CanonicalPricingSupplement {
    id: 'profesional' | 'reincidencia' | 'riesgoPrision' | 'asistenciaDetenido' | 'noConformidad';
    name: string;
    shortLabel: string;
    amount: number; // e.g. 500
    priceNumber: number; // alias for amount (500)
    formattedAmount: string; // e.g. "500,00"
    price: string; // alias for formattedAmount ("500.00")
    displayPrice: string; // e.g. "+500 €"
    displayWithTaxLabel: string; // e.g. "+500 €"
    appliesToLabel: string;
    appliesToProfesionales: boolean;
    description: string;
}

export interface CanonicalServicePricing {
    slug: 'alcoholemia' | 'drogas' | 'velocidad' | 'sin-carnet' | 'profesionales';
    name: string;
    shortName: string;
    offerName: string;
    url: string;
    basePriceNumber: number; // e.g. 680 (or 1180 for pro)
    priceNumber: number; // alias for basePriceNumber
    basePriceFormatted: string; // e.g. "680,00"
    basePrice: string; // alias for basePriceNumber as string ("680.00" or "1180.00")
    basePriceDisplay: string; // e.g. "680 €"
    displayPrice: string; // alias for basePriceDisplay
    displayWithTaxLabel: string; // e.g. "680 €, procurador incluido"
    serviceName: string;
    serviceType: string;
    scopeSummary: string;
    description: string;
    applicableAddOns: string[];
}

export interface Payment6040Plan {
    id: 'base' | 'profesionales';
    label: string;
    totalAmount: number;
    totalDisplay: string;
    totalWithDecimals: string;
    pago60Amount: number;
    pago60Display: string;
    pago60WithDecimals: string;
    pago40Amount: number;
    pago40Display: string;
    pago40WithDecimals: string;
}

// ---------------------------------------------------------------------------
// 1. CONSTANTES NUMÉRICAS CANÓNICAS
// ---------------------------------------------------------------------------

export const PENAL_BASE_PRICE = 680;
export const SUPPLEMENT_PROFESIONAL = 500;
export const SUPPLEMENT_REINCIDENCIA = 200;
export const SUPPLEMENT_RIESGO_PRISION = 300;
export const SUPPLEMENT_ASISTENCIA_DETENIDO = 500;
export const SUPPLEMENT_NO_CONFORMIDAD = 300;

export const ADMIN_POINTS_BASE_PRICE = 350;
export const ADMIN_POINTS_SUCCESS_BONUS = 150;

// ---------------------------------------------------------------------------
// 2. NOTA FISCAL LITERAL Y RESUMIDA
// ---------------------------------------------------------------------------

export const STATUTORY_TAX_NOTE =
    'Nota informativa sobre honorarios profesionales y régimen fiscal: Las cantidades reflejadas corresponden estrictamente a los honorarios profesionales técnicos de dirección letrada y representación procesal. Los tributos legalmente aplicables conforme a la legislación fiscal vigente (Impuesto sobre el Valor Añadido al tipo general del 21% o retenciones de IRPF aplicables en caso de autónomos y personas jurídicas) se liquidan y detallan formalmente en la correspondiente hoja de encargo profesional firmada con carácter previo al inicio de las actuaciones.';

export const STATUTORY_TAX_NOTE_SHORT =
    'Los tributos legalmente aplicables (IVA 21% o retención IRPF) se liquidan y detallan formalmente en la hoja de encargo previa.';

// ---------------------------------------------------------------------------
// 3. FUNCIÓN FORMATPRICE
// ---------------------------------------------------------------------------

export interface FormatPriceOptions {
    withTaxSuffix?: boolean;
    decimals?: boolean; // true -> "680,00 €", false -> "680 €"
    prefix?: string; // e.g. "+"
}

export function formatPrice(amount: number, options?: FormatPriceOptions): string {
    const decimals = options?.decimals ?? false;
    const prefix = options?.prefix ?? '';

    const formattedNumber = decimals
        ? amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : amount.toLocaleString('es-ES');

    return `${prefix}${formattedNumber} €`;
}

// ---------------------------------------------------------------------------
// 4. SUPLEMENTOS ACUMULABLES TASADOS
// ---------------------------------------------------------------------------

export const CANONICAL_SUPPLEMENTS: Record<string, CanonicalPricingSupplement> = {
    profesional: {
        id: 'profesional',
        name: 'Conductor profesional / CAP y tacógrafo',
        shortLabel: 'conductor profesional (CAP y tacógrafo digital)',
        amount: SUPPLEMENT_PROFESIONAL,
        priceNumber: SUPPLEMENT_PROFESIONAL,
        formattedAmount: '500,00',
        price: '500.00',
        displayPrice: '+500 €',
        displayWithTaxLabel: '+500 €',
        appliesToLabel: 'Permisos C, D, E',
        appliesToProfesionales: true,
        description:
            'Titulares de permisos profesionales C, D o E en ejercicio laboral. Incluye la protección específica del CAP, la defensa técnica frente a la tarjeta de tacógrafo digital y el procedimiento en primera instancia.',
    },
    reincidencia: {
        id: 'reincidencia',
        name: 'Reincidencia o antecedentes penales activos',
        shortLabel: 'reincidencia o antecedentes penales activos',
        amount: SUPPLEMENT_REINCIDENCIA,
        priceNumber: SUPPLEMENT_REINCIDENCIA,
        formattedAmount: '200,00',
        price: '200.00',
        displayPrice: '+200 €',
        displayWithTaxLabel: '+200 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Antecedentes penales de seguridad vial vigentes e inscritos en el Registro Central de Penados.',
    },
    riesgoPrision: {
        id: 'riesgoPrision',
        name: 'Riesgo de prisión efectiva (multirreincidencia)',
        shortLabel: 'riesgo de prisión efectiva',
        amount: SUPPLEMENT_RIESGO_PRISION,
        priceNumber: SUPPLEMENT_RIESGO_PRISION,
        formattedAmount: '300,00',
        price: '300.00',
        displayPrice: '+300 €',
        displayWithTaxLabel: '+300 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Supuestos de multirreincidencia donde decae el beneficio de la suspensión ordinaria de la pena y el riesgo de ingreso en prisión exige una defensa reforzada.',
    },
    asistenciaDetenido: {
        id: 'asistenciaDetenido',
        name: 'Asistencia urgente al detenido en comisaría',
        shortLabel: 'asistencia urgente al detenido en comisaría',
        amount: SUPPLEMENT_ASISTENCIA_DETENIDO,
        priceNumber: SUPPLEMENT_ASISTENCIA_DETENIDO,
        formattedAmount: '500,00',
        price: '500.00',
        displayPrice: '+500 €',
        displayWithTaxLabel: '+500 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Desplazamiento urgente de letrado a comisaría o juzgado de guardia para asistencia presencial al detenido fuera del horario ordinario.',
    },
    noConformidad: {
        id: 'noConformidad',
        name: 'No conformidad / apertura de juicio oral',
        shortLabel: 'no conformidad / apertura de juicio oral',
        amount: SUPPLEMENT_NO_CONFORMIDAD,
        priceNumber: SUPPLEMENT_NO_CONFORMIDAD,
        formattedAmount: '300,00',
        price: '300.00',
        displayPrice: '+300 €',
        displayWithTaxLabel: '+300 €',
        appliesToLabel: 'Los 4 servicios base particulares',
        appliesToProfesionales: false,
        description:
            'Estrategia de defensa orientada a la libre absolución o impugnación técnica en juicio oral posterior.',
    },
};

export const PRICING_ADDONS = CANONICAL_SUPPLEMENTS;

export type PricingAddOn = CanonicalPricingSupplement;
export type ServicePricing = CanonicalServicePricing;
export type Payment6040Tier = Payment6040Plan;

// ---------------------------------------------------------------------------
// 5. SERVICIOS PENALES Y SUS PRECIOS CANÓNICOS
// ---------------------------------------------------------------------------

export const SERVICES_PRICING: CanonicalServicePricing[] = [
    {
        slug: 'alcoholemia',
        name: 'Alcoholemia',
        shortName: 'alcoholemia',
        offerName: 'Defensa por Alcoholemia — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/alcoholemia',
        basePriceNumber: PENAL_BASE_PRICE,
        priceNumber: PENAL_BASE_PRICE,
        basePriceFormatted: '680,00',
        basePrice: '680.00',
        basePriceDisplay: '680 €',
        displayPrice: '680 €',
        displayWithTaxLabel: '680 €, procurador incluido',
        serviceName: 'Defensa penal por delito de alcoholemia',
        serviceType: 'Defensa penal por conducción bajo influencia de alcohol',
        scopeSummary:
            'precio cerrado de 680 € (procurador incluido) para el supuesto base: juicio rápido con conformidad',
        description:
            'Honorarios profesionales de 680 € para el supuesto base: primer delito con conformidad en juicio rápido. Incluye Procurador de los Tribunales (0 € adicionales). Los supuestos de mayor complejidad llevan suplementos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'drogas',
        name: 'Drogas al volante',
        shortName: 'drogas',
        offerName: 'Defensa por Drogas al Volante — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/drogas',
        basePriceNumber: PENAL_BASE_PRICE,
        priceNumber: PENAL_BASE_PRICE,
        basePriceFormatted: '680,00',
        basePrice: '680.00',
        basePriceDisplay: '680 €',
        displayPrice: '680 €',
        displayWithTaxLabel: '680 €, procurador incluido',
        serviceName: 'Defensa penal por drogas al volante',
        serviceType: 'Defensa penal por conducción bajo influencia de drogas',
        scopeSummary:
            'precio cerrado de 680 € (procurador incluido) para el supuesto base: juicio rápido con conformidad',
        description:
            'Honorarios profesionales de 680 € para el supuesto base: primer delito con conformidad en juicio rápido. Incluye Procurador de los Tribunales (0 € adicionales). Los supuestos de mayor complejidad llevan suplementos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'velocidad',
        name: 'Exceso de velocidad',
        shortName: 'velocidad',
        offerName: 'Defensa por Exceso de Velocidad — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/velocidad',
        basePriceNumber: PENAL_BASE_PRICE,
        priceNumber: PENAL_BASE_PRICE,
        basePriceFormatted: '680,00',
        basePrice: '680.00',
        basePriceDisplay: '680 €',
        displayPrice: '680 €',
        displayWithTaxLabel: '680 €, procurador incluido',
        serviceName: 'Defensa penal por exceso de velocidad',
        serviceType: 'Defensa penal por delito de exceso de velocidad',
        scopeSummary:
            'precio cerrado de 680 € (procurador incluido) para el supuesto base: juicio rápido con conformidad',
        description:
            'Honorarios profesionales de 680 € para el supuesto base: primer delito con conformidad en juicio rápido. Incluye Procurador de los Tribunales (0 € adicionales). Los supuestos de mayor complejidad llevan suplementos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'sin-carnet',
        name: 'Conducir sin carné',
        shortName: 'sin carnet',
        offerName: 'Defensa por Conducir Sin Carné — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/sin-carnet',
        basePriceNumber: PENAL_BASE_PRICE,
        priceNumber: PENAL_BASE_PRICE,
        basePriceFormatted: '680,00',
        basePrice: '680.00',
        basePriceDisplay: '680 €',
        displayPrice: '680 €',
        displayWithTaxLabel: '680 €, procurador incluido',
        serviceName: 'Defensa penal por conducción sin permiso',
        serviceType: 'Defensa penal por conducción sin permiso o licencia',
        scopeSummary:
            'precio cerrado de 680 € (procurador incluido) para el supuesto base: juicio rápido con conformidad',
        description:
            'Honorarios profesionales de 680 € para el supuesto base: primer delito con conformidad en juicio rápido. Incluye Procurador de los Tribunales (0 € adicionales). Los supuestos de mayor complejidad llevan suplementos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'profesionales',
        name: 'Conductores profesionales (C, D, E)',
        shortName: 'conductores profesionales',
        offerName: 'Defensa para Conductores Profesionales — Primera Instancia',
        url: 'https://www.autoridad.legal/profesionales',
        basePriceNumber: PENAL_BASE_PRICE + SUPPLEMENT_PROFESIONAL, // 1180
        priceNumber: PENAL_BASE_PRICE + SUPPLEMENT_PROFESIONAL,
        basePriceFormatted: '1180,00',
        basePrice: '1180.00',
        basePriceDisplay: '1.180 €',
        displayPrice: '1.180 €',
        displayWithTaxLabel: '680 € + 500 € de suplemento por conductor profesional',
        serviceName: 'Defensa penal para conductores profesionales',
        serviceType: 'Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)',
        scopeSummary:
            '680 € + 500 € de suplemento por conductor profesional para el procedimiento completo en primera instancia hasta la sentencia. Incluye procurador y protección del CAP y tacógrafo digital.',
        description:
            'Honorarios de 680 € + 500 € de suplemento por conductor profesional para titulares de permisos C, D o E. Cubre el procedimiento completo en primera instancia hasta la sentencia. Incluye Procurador de los Tribunales (0 € adicionales), protección del CAP y tarjeta de tacógrafo digital. No incluye recurso de apelación ante la Audiencia Provincial.',
        applicableAddOns: ['reincidencia', 'riesgoPrision', 'asistenciaDetenido'],
    },
];

// Resumen unificado
export const PRICING_SUMMARY = {
    basePriceNumber: PENAL_BASE_PRICE,
    basePriceDisplay: `${PENAL_BASE_PRICE} €`,
    baseTotalDecimals: '680,00 €',
    proSupplementNumber: SUPPLEMENT_PROFESIONAL,
    proSupplementDisplay: `+${SUPPLEMENT_PROFESIONAL} €`,
    proTotalNumber: PENAL_BASE_PRICE + SUPPLEMENT_PROFESIONAL,
    proPriceDisplay: '1.180 €',
    proTotalDecimals: '1.180,00 €',
    proPriceExplanation: '680 € + 500 € de suplemento por conductor profesional',
    basePriceWithTaxAndProcurador: '680 €, procurador incluido',
    accidentsLabel: 'Accidentes con daños a terceros o lesiones',
    accidentsValue: 'Presupuesto específico por escrito tras revisar el atestado',
    taxNote: STATUTORY_TAX_NOTE,
    taxNoteShort: STATUTORY_TAX_NOTE_SHORT,
} as const;

// ---------------------------------------------------------------------------
// 6. PLANES DE PAGO 60/40 (OPCIÓN A: SOBRE HONORARIOS PROFESIONALES)
// ---------------------------------------------------------------------------

export function calculate6040(totalAmount: number): { pago60: number; pago40: number } {
    const pago60 = Math.round(totalAmount * 0.6);
    const pago40 = totalAmount - pago60;
    return { pago60, pago40 };
}

const base6040 = calculate6040(PENAL_BASE_PRICE);
const pro6040 = calculate6040(PENAL_BASE_PRICE + SUPPLEMENT_PROFESIONAL);

export const PAYMENT_60_40_TIERS: Payment6040Plan[] = [
    {
        id: 'base',
        label: `Servicios base (${PENAL_BASE_PRICE} €)`,
        totalAmount: PENAL_BASE_PRICE,
        totalDisplay: `${PENAL_BASE_PRICE} €`,
        totalWithDecimals: '680,00 €',
        pago60Amount: base6040.pago60,
        pago60Display: `${base6040.pago60} €`,
        pago60WithDecimals: `${base6040.pago60},00 €`,
        pago40Amount: base6040.pago40,
        pago40Display: `${base6040.pago40} € a 30 días`,
        pago40WithDecimals: `${base6040.pago40},00 € a 30 días`,
    },
    {
        id: 'profesionales',
        label: `Conductores profesionales (1.180 €)`,
        totalAmount: PENAL_BASE_PRICE + SUPPLEMENT_PROFESIONAL,
        totalDisplay: '1.180 €',
        totalWithDecimals: '1.180,00 €',
        pago60Amount: pro6040.pago60,
        pago60Display: `${pro6040.pago60} €`,
        pago60WithDecimals: `${pro6040.pago60},00 €`,
        pago40Amount: pro6040.pago40,
        pago40Display: `${pro6040.pago40} € a 30 días`,
        pago40WithDecimals: `${pro6040.pago40},00 € a 30 días`,
    },
];

export const PAYMENT_METHODS: string[] = [
    'Pago íntegro directo: abono completo al formalizar la hoja de encargo mediante tarjeta de crédito/débito o transferencia bancaria en la plataforma de custodia.',
    'Financiación hasta 12 meses: financiación bancaria externa en cuotas mensuales (Klarna/Stripe), sujeta a aprobación de la entidad financiera colaboradora.',
    `Modalidad híbrida 60/40: primer pago del 60 % al encargo y 40 % restante a 30 días (${PAYMENT_60_40_TIERS.map(t => `${t.label}: ${t.pago60Display} + ${t.pago40Display}`).join('; ')}).`,
];

// ---------------------------------------------------------------------------
// 7. SERVICIO ADMINISTRATIVO DE MULTAS Y PUNTOS (TODA ESPAÑA)
// ---------------------------------------------------------------------------

export const DEFENSE_POINTS_PRICING = {
    slug: 'defensa-puntos-carnet',
    url: 'https://www.autoridad.legal/defensa-puntos-carnet',
    serviceName: 'Defensa técnica de multas de tráfico y protección del carnet por puntos',
    serviceType: 'Defensa administrativa de multas de tráfico y puntos del carnet',
    basePriceNumber: ADMIN_POINTS_BASE_PRICE,
    basePriceFormatted: '350,00',
    basePriceDisplay: '350,00 €',
    basePriceWithTaxLabel: '350,00 €',
    baseConcept: 'Provisión base de defensa técnica',
    baseDescription: 'Estudio, alegaciones, proposición de prueba y recursos ordinarios',
    successBonusNumber: ADMIN_POINTS_SUCCESS_BONUS,
    successBonusFormatted: '150,00',
    successBonusDisplay: '150,00 €',
    successBonusWithTaxLabel: '150,00 €',
    successBonusConcept: 'Bono de éxito (conservar el carnet)',
    successBonusDescription: 'Solo si el conductor conserva la vigencia del permiso',
    totalFavorableDisplay: '500,00 €',
    totalFavorableWithTaxLabel: '500,00 €',
    taxNote: STATUTORY_TAX_NOTE,
    taxNoteShort: STATUTORY_TAX_NOTE_SHORT,
} as const;

// ---------------------------------------------------------------------------
// 8. HELPERS DE CONSULTA Y CÁLCULO
// ---------------------------------------------------------------------------

export function getServicePricing(slug: string): CanonicalServicePricing {
    const norm = slug.toLowerCase().trim() === 'sin_carnet' ? 'sin-carnet' : slug.toLowerCase().trim();
    return SERVICES_PRICING.find(s => s.slug === norm) || SERVICES_PRICING[0];
}

export function getFormattedServicePrice(slug: string): string {
    return getServicePricing(slug).basePriceDisplay;
}

/**
 * Calcula el desglose orientativo de cuotas (3, 6 y 12 meses)
 */
export function calculateFinancingQuotas(totalAmount: number): {
    total: number;
    cuota3: number;
    cuota6: number;
    cuota12: number;
} {
    return {
        total: totalAmount,
        cuota3: Math.ceil(totalAmount / 3),
        cuota6: Math.ceil(totalAmount / 6),
        cuota12: Math.ceil(totalAmount / 12),
    };
}

/**
 * Genera las líneas de "Honorarios" y "Recargos" para la cabecera de llms.txt y llms-full.txt
 */
export function renderDatosClaveHonorariosLines(): [string, string] {
    const honorariosLine = `- Honorarios defensa penal: ${PENAL_BASE_PRICE} € (procurador de los tribunales incluido) para juicio rápido con conformidad en Barcelona; ${PRICING_SUMMARY.proPriceDisplay} para conductores profesionales (${PRICING_SUMMARY.proPriceExplanation}).`;

    const addOnParts = Object.values(CANONICAL_SUPPLEMENTS).map(addOn => {
        const suffix = addOn.appliesToProfesionales ? '' : ' (particulares)';
        return `${addOn.shortLabel} ${addOn.displayPrice}${suffix}`;
    });

    const recargosLine = `- Suplementos tasados acumulables: ${addOnParts.join('; ')}. ${STATUTORY_TAX_NOTE_SHORT}`;

    return [honorariosLine, recargosLine];
}
