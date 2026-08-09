export interface ServicePricing {
    slug: string;
    name: string;
    offerName: string;
    url: string;
    basePrice: string; // e.g. "980.00"
    serviceName: string;
    serviceType: string;
    description: string;
    applicableAddOns: string[];
}

export interface PricingAddOn {
    id: string;
    name: string;
    price: string; // e.g. "200.00"
    description: string;
}

export const PRICING_ADDONS: Record<string, PricingAddOn> = {
    reincidencia: {
        id: 'reincidencia',
        name: 'Suplemento por Reincidencia Delictiva',
        price: '200.00',
        description: 'Recargo fijo de 200 € (IVA incluido) aplicable cuando el investigado cuenta con antecedentes penales de seguridad vial vigentes e inscritos en el Registro Central de Penados.',
    },
    noConformidad: {
        id: 'noConformidad',
        name: 'Suplemento procesal por No Conformidad',
        price: '300.00',
        description: 'Recargo fijo de 300 € (IVA incluido) cuando la estrategia de defensa descarta la conformidad para pelear la libre absolución o la nulidad de las actuaciones en juicio ordinario posterior, con mayor carga procesal.',
    },
    asistenciaDetenido: {
        id: 'asistenciaDetenido',
        name: 'Suplemento por Asistencia al Detenido de Urgencia',
        price: '500.00',
        description: 'Recargo fijo de 500 € (IVA incluido) por asistencia inmediata al detenido con desplazamiento del letrado a dependencias policiales fuera del horario ordinario.',
    },
    riesgoPrision: {
        id: 'riesgoPrision',
        name: 'Suplemento por Riesgo de Prisión Efectiva',
        price: '300.00',
        description: 'Recargo fijo de 300 € (IVA incluido) en supuestos de multirreincidencia donde decae el beneficio de la suspensión ordinaria de la pena y el riesgo de prisión efectiva exige una defensa reforzada.',
    },
};

export const SERVICES_PRICING: ServicePricing[] = [
    {
        slug: 'alcoholemia',
        name: 'Alcoholemia',
        offerName: 'Defensa por Alcoholemia — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/alcoholemia',
        basePrice: '980.00',
        serviceName: 'Defensa penal por delito de alcoholemia',
        serviceType: 'Defensa penal por conducción bajo influencia de alcohol',
        description: 'Precio cerrado de 980 € (IVA y derechos de procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, detallados en los suplementos y comunicados siempre por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'asistenciaDetenido', 'riesgoPrision'],
    },
    {
        slug: 'drogas',
        name: 'Drogas al Volante',
        offerName: 'Defensa por Drogas al Volante — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/drogas',
        basePrice: '980.00',
        serviceName: 'Defensa penal por drogas al volante',
        serviceType: 'Defensa penal por conducción bajo influencia de drogas',
        description: 'Precio cerrado de 980 € (IVA y derechos de procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, detallados en los suplementos y comunicados siempre por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'asistenciaDetenido', 'riesgoPrision'],
    },
    {
        slug: 'velocidad',
        name: 'Exceso de Velocidad',
        offerName: 'Defensa por Exceso de Velocidad — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/velocidad',
        basePrice: '980.00',
        serviceName: 'Defensa penal por exceso de velocidad',
        serviceType: 'Defensa penal por delito de exceso de velocidad',
        description: 'Precio cerrado de 980 € (IVA y derechos de procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, detallados en los suplementos y comunicados siempre por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'asistenciaDetenido', 'riesgoPrision'],
    },
    {
        slug: 'sin-carnet',
        name: 'Conducir Sin Carné',
        offerName: 'Defensa por Conducir Sin Carné — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/sin-carnet',
        basePrice: '980.00',
        serviceName: 'Defensa penal por conducción sin permiso',
        serviceType: 'Defensa penal por conducción sin permiso o licencia',
        description: 'Precio cerrado de 980 € (IVA y derechos de procurador incluidos) para el supuesto base: primer delito con conformidad en juicio rápido. Los supuestos de mayor complejidad llevan recargos fijos y tasados, detallados en los suplementos y comunicados siempre por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'noConformidad', 'asistenciaDetenido', 'riesgoPrision'],
    },
    {
        slug: 'profesionales',
        name: 'Conductores Profesionales',
        offerName: 'Defensa para Conductores Profesionales — Juicio Rápido con Conformidad',
        url: 'https://www.autoridad.legal/profesionales',
        basePrice: '1480.00',
        serviceName: 'Defensa penal para conductores profesionales',
        serviceType: 'Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)',
        description: 'Precio cerrado de 1.480 € (IVA y derechos de procurador incluidos) para conductores profesionales (permisos C, D, E). Incluye la complejidad jurídica añadida de salvaguardar el Certificado de Aptitud Profesional (CAP) y la vigencia de la tarjeta de tacógrafo digital. Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados siempre por escrito y por adelantado.',
        applicableAddOns: ['reincidencia', 'asistenciaDetenido', 'riesgoPrision'],
    },
];
