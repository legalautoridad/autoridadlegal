export interface ServicePricing {
    slug: 'alcoholemia' | 'drogas' | 'velocidad' | 'sin-carnet' | 'profesionales';
    name: string;
    shortName: string;
    offerName: string;
    url: string;
    basePrice: string; // e.g. "980.00"
    priceNumber: number; // e.g. 980
    displayPrice: string; // e.g. "980 €"
    taxBase: string; // e.g. "809,92 €"
    taxAmount: string; // e.g. "170,08 €"
    totalWithDecimals: string; // e.g. "980,00 €"
    serviceName: string;
    serviceType: string;
    scopeSummary: string;
    description: string;
    applicableAddOns: string[];
}

export interface PricingAddOn {
    id: 'reincidencia' | 'noConformidad' | 'riesgoPrision' | 'asistenciaDetenido';
    name: string;
    shortLabel: string;
    price: string; // e.g. "200.00"
    priceNumber: number; // e.g. 200
    displayPrice: string; // e.g. "+200 €"
    appliesToLabel: string;
    appliesToProfesionales: boolean;
    description: string;
}

export interface Payment6040Tier {
    id: 'base' | 'profesionales';
    label: string;
    totalDisplay: string;
    totalWithDecimals: string;
    pago60Display: string;
    pago60WithDecimals: string;
    pago40Display: string;
    pago40WithDecimals: string;
}

export const PRICING_SUMMARY = {
    basePriceNumber: 980,
    basePriceDisplay: '980 €',
    baseTaxBase: '809,92 €',
    baseTaxAmount: '170,08 €',
    baseTotalDecimals: '980,00 €',
    proPriceNumber: 1480,
    proPriceDisplay: '1.480 €',
    proTaxBase: '1.223,14 €',
    proTaxAmount: '256,86 €',
    proTotalDecimals: '1.480,00 €',
    accidentsLabel: 'Accidentes con daños a terceros o lesiones',
    accidentsValue: 'Presupuesto específico por escrito tras revisar el atestado',
} as const;

export const PRICING_ADDONS: Record<string, PricingAddOn> = {
    reincidencia: {
        id: 'reincidencia',
        name: 'Reincidencia penal o antecedentes',
        shortLabel: 'reincidencia',
        price: '200.00',
        priceNumber: 200,
        displayPrice: '+200 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Antecedentes penales de seguridad vial vigentes e inscritos en el Registro Central de Penados.',
    },
    noConformidad: {
        id: 'noConformidad',
        name: 'Procedimiento sin conformidad',
        shortLabel: 'juicio sin conformidad',
        price: '300.00',
        priceNumber: 300,
        displayPrice: '+300 €',
        appliesToLabel: 'Los 4 servicios base (no aplica a profesionales)',
        appliesToProfesionales: false,
        description:
            'Estrategia de defensa orientada a la libre absolución o impugnación técnica en juicio oral posterior (el servicio de conductores profesionales ya incluye el procedimiento completo en primera instancia hasta la sentencia).',
    },
    riesgoPrision: {
        id: 'riesgoPrision',
        name: 'Antecedentes con riesgo de prisión efectiva',
        shortLabel: 'riesgo de prisión efectiva',
        price: '300.00',
        priceNumber: 300,
        displayPrice: '+300 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Supuestos de multirreincidencia donde decae la suspensión ordinaria de la pena y el riesgo de ingreso en prisión exige una defensa reforzada.',
    },
    asistenciaDetenido: {
        id: 'asistenciaDetenido',
        name: 'Asistencia letrada al detenido',
        shortLabel: 'asistencia urgente al detenido en comisaría o juzgado de guardia',
        price: '500.00',
        priceNumber: 500,
        displayPrice: '+500 €',
        appliesToLabel: 'Los 5 servicios',
        appliesToProfesionales: true,
        description:
            'Desplazamiento urgente de letrado a comisaría o juzgado de guardia para asistencia presencial al detenido fuera del horario ordinario.',
    },
};

export const SERVICES_PRICING: ServicePricing[] = [
    {
        slug: 'alcoholemia',
        name: 'Alcoholemia',
        shortName: 'alcoholemia',
        offerName: 'Defensa por Alcoholemia — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/alcoholemia',
        basePrice: '980.00',
        priceNumber: 980,
        displayPrice: '980 €',
        taxBase: '809,92 €',
        taxAmount: '170,08 €',
        totalWithDecimals: '980,00 €',
        serviceName: 'Defensa penal por delito de alcoholemia',
        serviceType: 'Defensa penal por conducción bajo influencia de alcohol',
        scopeSummary:
            'precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad',
        description:
            'Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'drogas',
        name: 'Drogas al volante',
        shortName: 'drogas',
        offerName: 'Defensa por Drogas al Volante — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/drogas',
        basePrice: '980.00',
        priceNumber: 980,
        displayPrice: '980 €',
        taxBase: '809,92 €',
        taxAmount: '170,08 €',
        totalWithDecimals: '980,00 €',
        serviceName: 'Defensa penal por drogas al volante',
        serviceType: 'Defensa penal por conducción bajo influencia de drogas',
        scopeSummary:
            'precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad',
        description:
            'Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'velocidad',
        name: 'Exceso de velocidad',
        shortName: 'velocidad',
        offerName: 'Defensa por Exceso de Velocidad — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/velocidad',
        basePrice: '980.00',
        priceNumber: 980,
        displayPrice: '980 €',
        taxBase: '809,92 €',
        taxAmount: '170,08 €',
        totalWithDecimals: '980,00 €',
        serviceName: 'Defensa penal por exceso de velocidad',
        serviceType: 'Defensa penal por delito de exceso de velocidad',
        scopeSummary:
            'precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad',
        description:
            'Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'sin-carnet',
        name: 'Conducir sin carné',
        shortName: 'sin carnet',
        offerName: 'Defensa por Conducir Sin Carné — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/sin-carnet',
        basePrice: '980.00',
        priceNumber: 980,
        displayPrice: '980 €',
        taxBase: '809,92 €',
        taxAmount: '170,08 €',
        totalWithDecimals: '980,00 €',
        serviceName: 'Defensa penal por conducción sin permiso',
        serviceType: 'Defensa penal por conducción sin permiso o licencia',
        scopeSummary:
            'precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: juicio rápido con conformidad',
        description:
            'Precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'riesgoPrision', 'asistenciaDetenido'],
    },
    {
        slug: 'profesionales',
        name: 'Conductores profesionales (C, D, E)',
        shortName: 'conductores profesionales',
        offerName: 'Defensa para Conductores Profesionales — Procedimiento en Primera Instancia',
        url: 'https://www.autoridad.legal/profesionales',
        basePrice: '1480.00',
        priceNumber: 1480,
        displayPrice: '1.480 €',
        taxBase: '1.223,14 €',
        taxAmount: '256,86 €',
        totalWithDecimals: '1.480,00 €',
        serviceName: 'Defensa penal para conductores profesionales',
        serviceType: 'Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)',
        scopeSummary:
            'precio cerrado de 1.480 € (980 € base + 500 € de suplemento profesional ya incluido; base 1.223,14 € + IVA 256,86 €; procurador e IVA incluidos) para el procedimiento completo en primera instancia hasta la sentencia. No incluye el recurso de apelación ante la Audiencia Provincial. Incluye la protección del CAP y la tarjeta de tacógrafo digital.',
        description:
            'Precio cerrado de 1.480 € (980 € + 500 € de suplemento profesional ya incluido; IVA y procurador incluidos) para conductores profesionales (permisos C, D, E). Cubre el procedimiento completo en primera instancia hasta la sentencia. No incluye el recurso de apelación ante la Audiencia Provincial. Incluye la protección del CAP y la tarjeta de tacógrafo digital. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'riesgoPrision', 'asistenciaDetenido'],
    },
];

export const PAYMENT_60_40_TIERS: Payment6040Tier[] = [
    {
        id: 'base',
        label: 'Servicios base (980 €)',
        totalDisplay: '980 €',
        totalWithDecimals: '980,00 €',
        pago60Display: '588 €',
        pago60WithDecimals: '588,00 €',
        pago40Display: '392 €',
        pago40WithDecimals: '392,00 € a 30 días',
    },
    {
        id: 'profesionales',
        label: 'Profesionales (1.480 €)',
        totalDisplay: '1.480 €',
        totalWithDecimals: '1.480,00 €',
        pago60Display: '888 €',
        pago60WithDecimals: '888,00 €',
        pago40Display: '592 €',
        pago40WithDecimals: '592,00 € a 30 días',
    },
];

export const PAYMENT_METHODS: string[] = [
    'Pago íntegro directo: abono completo al formalizar la hoja de encargo mediante tarjeta de crédito/débito o transferencia bancaria en la plataforma de pago en custodia.',
    'Financiación hasta 12 meses: financiación bancaria externa en cuotas mensuales (Klarna/Stripe), sujeta a aprobación de la entidad financiera colaboradora.',
    `Modalidad híbrida 60/40: primer pago del 60 % al encargo y 40 % pendiente a 30 días (${PAYMENT_60_40_TIERS.map(t => `${t.label}: ${t.pago60Display} + ${t.pago40Display}`).join('; ')}).`,
];

export function getServicePricing(slug: string): ServicePricing {
    const norm = slug.toLowerCase().trim() === 'sin_carnet' ? 'sin-carnet' : slug.toLowerCase().trim();
    return SERVICES_PRICING.find(s => s.slug === norm) || SERVICES_PRICING[0];
}

export function getFormattedServicePrice(slug: string): string {
    return getServicePricing(slug).displayPrice;
}

/**
 * Generates the "Honorarios" and "Recargos" lines for the "Datos clave" header in /llms.txt and /llms-full.txt
 * directly from SERVICES_PRICING and PRICING_ADDONS so there is zero hardcoded duplication.
 */
export function renderDatosClaveHonorariosLines(): [string, string] {
    const baseServices = SERVICES_PRICING.filter(s => s.slug !== 'profesionales');
    const proService = getServicePricing('profesionales');
    const basePrice = baseServices[0].displayPrice;
    const baseNames = baseServices.map(s => s.shortName);
    const baseListText =
        baseNames.slice(0, -1).join(', ') + ' y ' + baseNames[baseNames.length - 1];

    const honorariosLine = `- Honorarios: precio cerrado de ${basePrice} (IVA y procurador incluidos) para el supuesto base (primer delito con conformidad en juicio rápido) en ${baseListText}; ${proService.displayPrice} para ${proService.shortName}.`;

    const addOnParts = Object.values(PRICING_ADDONS).map(addOn => {
        const suffix = addOn.appliesToProfesionales ? '' : ' (no aplica a profesionales)';
        return `${addOn.shortLabel} ${addOn.displayPrice}${suffix}`;
    });

    const recargosLine = `- Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado: ${addOnParts.join('; ')}.`;

    return [honorariosLine, recargosLine];
}
