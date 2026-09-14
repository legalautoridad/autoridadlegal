export interface BasePriceRow {
    servicio: string;
    base: string;
    iva: string;
    total: string;
}

export interface SupplementRow {
    circunstancia: string;
    suplemento: string;
    aplica: string;
    descripcion: string;
}

export interface Payment6040Row {
    servicio: string;
    precioTotal: string;
    pago60: string;
    pago40: string;
}

export interface SectionConfig {
    id: string;
    number: string;
    title: string;
    content?: string;
    items?: string[];
    basePricesTable?: BasePriceRow[];
    supplementsTable?: SupplementRow[];
    payment6040Table?: Payment6040Row[];
    accumulationNote?: string;
    signatureBlock?: {
        professional: {
            name: string;
            icab: string;
        };
        client: {
            name: string;
            document: string;
        };
    };
}

export interface AcuerdoHonorariosConfig {
    title: string;
    subtitle: string;
    version: string;
    effectiveDate: string;
    canonicalUrl: string;
    pdfUrl: string;
    professional: {
        name: string;
        condition: string;
        barAssociation: string;
        barNumber: string;
        brand: string;
        address: string;
        phone: string;
        email: string;
        website: string;
        professionalWebsite: string;
        privacyPolicyUrl: string;
    };
    sections: SectionConfig[];
}

export const ACUERDO_HONORARIOS_CONFIG: AcuerdoHonorariosConfig = {
    title: 'Hoja de Encargo Profesional',
    subtitle: 'Modelo Estándar de Asistencia Jurídica en Juicio Rápido por Delito Contra la Seguridad Vial',
    version: '1.0',
    effectiveDate: '10 de agosto de 2026',
    canonicalUrl: 'https://www.autoridad.legal/acuerdo-honorarios',
    pdfUrl: '/acuerdo-honorarios.pdf',
    professional: {
        name: 'Santiago Giménez Olavarriaga',
        condition: 'Abogado penalista ejerciente',
        barAssociation: 'Ilustre Colegio de la Abogacía de Barcelona (ICAB)',
        barNumber: '31.389',
        brand: 'Autoridad Legal',
        address: 'Av. Diagonal 437, Principal 3ª, 08036 Barcelona',
        phone: '+34 605 118 871',
        email: 'santiago@gimenezolavarriaga.abogado',
        website: 'https://www.autoridad.legal',
        professionalWebsite: 'https://www.gimenezolavarriaga.abogado',
        privacyPolicyUrl: 'https://www.autoridad.legal/legal/privacy',
    },
    sections: [
        {
            id: 'identificacion',
            number: '1',
            title: 'Identificación del profesional y del cliente',
            content: `El profesional responsable de la dirección jurídica es Santiago Giménez Olavarriaga, letrado colegiado nº 31.389 del Ilustre Colegio de la Abogacía de Barcelona (ICAB), con domicilio profesional en Av. Diagonal 437, Principal 3ª, 08036 Barcelona.

En las hojas de encargo individualizadas se incorporan los datos identificativos y de contacto facilitados por el cliente (nombre completo, DNI/NIE/pasaporte, domicilio, teléfono y correo electrónico) para la gestión del encargo y la defensa jurídica contratada.`,
        },
        {
            id: 'objeto',
            number: '2',
            title: 'Objeto del encargo',
            content: `El cliente encarga al profesional la prestación de asistencia jurídica en relación con un procedimiento de juicio rápido o actuación penal por delito contra la seguridad vial (alcoholemia, drogas al volante, exceso de velocidad, conducción sin carné o situación específica de conductor profesional) ante el juzgado o partido judicial competente.

El servicio contratado corresponde a la defensa técnica en el procedimiento con conformidad o procedimiento de primera instancia dentro del alcance descrito en esta hoja. La aceptación de este encargo no supone garantía de un resultado judicial concreto, el cual corresponde en exclusiva a los órganos judiciales según los hechos y pruebas del procedimiento.`,
        },
        {
            id: 'actuaciones-incluidas',
            number: '3',
            title: 'Actuaciones incluidas',
            content: 'Dentro del alcance contratado se incluyen las siguientes actuaciones:',
            items: [
                'Análisis inicial de la información facilitada por el cliente.',
                'Revisión de la documentación disponible y fiscalización técnica del atestado policial.',
                'Orientación jurídica y diseño de la estrategia procesal del procedimiento.',
                'Preparación de la actuación ante el Juzgado de Guardia o Juzgado de Instrucción.',
                'Coordinación de la asistencia presencial letrada.',
                'Asistencia letrada al juicio rápido con conformidad (o procedimiento completo en primera instancia para conductores profesionales).',
                'Coordinación con el procurador de los tribunales cuando su intervención esté incluida.',
                'Información puntual e ininterrumpida al cliente sobre el desarrollo de la actuación.',
                'Entrega de la resolución formal y documentación judicial correspondiente.',
            ],
        },
        {
            id: 'actuaciones-no-incluidas',
            number: '4',
            title: 'Actuaciones no incluidas',
            content: 'Salvo contratación o pacto escrito posterior, no están incluidas:',
            items: [
                'Asistencia letrada al detenido en comisaría salvo suplemento específico (+500 €).',
                'Juicios rápidos sin conformidad para los 4 servicios base salvo contratación de suplemento (+300 €).',
                'Recursos de apelación ante la Audiencia Provincial, queja o nulidad de actuaciones (excluido expresamente en todos los servicios, incluido conductores profesionales).',
                'Procedimientos penales ordinarios posteriores o independientes de la primera instancia.',
                'Accidentes de tráfico con daños materiales o corporales a terceros.',
                'Accidentes con lesiones o reclamaciones civiles derivadas.',
                'Informes periciales de terceros (metrológicos, médicos, reconstrucción de accidentes).',
                'Actuaciones ante juzgados distintos de los identificados en la hoja de encargo.',
                'Incidentes de ejecución de sentencia o revocación de suspensión de pena.',
            ],
        },
        {
            id: 'precio-base',
            number: '5',
            title: 'Precio del servicio base',
            content: 'Tarifas cerradas por escrito para el supuesto base en juicios rápidos de seguridad vial (derechos de procurador e IVA 21 % incluidos):',
            basePricesTable: [
                { servicio: 'Conducir sin carné', base: '644,63 €', iva: '135,37 €', total: '780,00 €' },
                { servicio: 'Alcoholemia, Drogas al volante o Exceso de velocidad', base: '809,92 €', iva: '170,08 €', total: '980,00 €' },
                { servicio: 'Conductores profesionales (C, D, E) — Primera Instancia', base: '1.223,14 €', iva: '256,86 €', total: '1.480,00 €' },
            ],
        },
        {
            id: 'suplementos',
            number: '6',
            title: 'Suplementos tasados',
            content: 'Los suplementos solo se aplican cuando la circunstancia correspondiente concurre y exige un alcance distinto del servicio base, comunicándose siempre por escrito antes de la contratación. Todos los importes incluyen IVA:',
            supplementsTable: [
                { circunstancia: 'Reincidencia o antecedentes penales relevantes', suplemento: '+200 €', aplica: 'Los 5 servicios', descripcion: 'Antecedentes penales de seguridad vial inscritos y no cancelados en el Registro Central de Penados.' },
                { circunstancia: 'Procedimiento sin conformidad', suplemento: '+300 €', aplica: 'Los 4 servicios base (N/A en profesionales)', descripcion: 'Estrategia defensiva orientada a la absolución o juicio oral posterior. Excluido en profesionales (su tarifa de 1.480 € ya incluye el procedimiento en primera instancia).' },
                { circunstancia: 'Antecedentes con riesgo de prisión efectiva', suplemento: '+300 €', aplica: 'Los 5 servicios', descripcion: 'Multirreincidencia o riesgo de revocación de la suspensión ordinaria de la pena privativa de libertad.' },
                { circunstancia: 'Asistencia letrada al detenido (urgencia in situ)', suplemento: '+500 €', aplica: 'Los 5 servicios', descripcion: 'Desplazamiento urgente de letrado a comisaría o centro de custodia policial fuera de horas de despacho.' },
                { circunstancia: 'Concurrencia de delitos (negativa, resistencia, desobediencia o atentado)', suplemento: '+200 €', aplica: 'Los 5 servicios', descripcion: 'Concurrencia de delitos (negativa, resistencia, desobediencia o atentado) — +200 €. Aplica cuando el atestado por alcoholemia o drogas incluye negativa a someterse a las pruebas (art. 383 CP), resistencia o desobediencia grave (art. 556 CP) o atentado a agentes de la autoridad (art. 550 CP). Aplica a todos los servicios.' },
                { circunstancia: 'Accidentes, daños, lesiones o reclamaciones civiles', suplemento: 'Presupuesto específico', aplica: 'Según supuesto', descripcion: 'Siniestros con atestados complejos, daños materiales a terceros o responsabilidad civil por lesiones.' },
            ],
            accumulationNote: 'Nota sobre cláusula de acumulación: La Hoja de Encargo individualizada concretará, en función del supuesto del cliente, si los suplementos concurrentes se estructuran mediante acumulación justificada por actuaciones independientes o mediante presupuesto cerrado final único.',
        },
        {
            id: 'formas-pago',
            number: '7',
            title: 'Formas de pago y facilidades',
            content: `El cliente puede elegir entre las modalidades de pago disponibles:
• Pago íntegro directo al formalizar la hoja de encargo.
• Modalidad híbrida de pago fraccionado 60/40.
• Financiación bancaria externa en cuotas mensuales (Klarna/Stripe), sujeta a aprobación de la entidad financiera colaboradora.`,
        },
        {
            id: 'modalidad-6040',
            number: '8',
            title: 'Modalidad de pago 60/40',
            content: 'La modalidad híbrida 60/40 permite abonar el 60 % inicial al contratar y el 40 % restante a los 30 días:',
            payment6040Table: [
                { servicio: 'Sin Carné (780 €)', precioTotal: '780,00 €', pago60: '468,00 €', pago40: '312,00 € a 30 días' },
                { servicio: 'Servicios Base (980 €)', precioTotal: '980,00 €', pago60: '588,00 €', pago40: '392,00 € a 30 días' },
                { servicio: 'Profesionales (1.480 €)', precioTotal: '1.480,00 €', pago60: '888,00 €', pago40: '592,00 € a 30 días' },
            ],
        },
        {
            id: 'impago',
            number: '9',
            title: 'Impago del importe pendiente',
            content: 'En caso de rechazo, devolución o falta de pago del segundo cargo pendiente en la modalidad fraccionada, la hoja de encargo prevé una cantidad de 300 € en concepto de gestión de impago y recobro, además de los importes pendientes y acciones de reclamación correspondientes.',
        },
        {
            id: 'colaboracion',
            number: '10',
            title: 'Documentación y colaboración del cliente',
            content: 'El cliente se compromete a facilitar información veraz y completa, entregar la documentación disponible, comunicar citaciones judiciales de inmediato y seguir las indicaciones técnicas del letrado.',
        },
        {
            id: 'informacion-procedimiento',
            number: '11',
            title: 'Información sobre el procedimiento',
            content: 'El profesional informará puntualmente sobre las actuaciones esenciales, opciones procesales y consecuencias previsibles de la conformidad o del juicio ordinario.',
        },
        {
            id: 'comunicacion',
            number: '12',
            title: 'Comunicación con el cliente',
            content: 'Las comunicaciones se realizarán por teléfono, correo electrónico, mensajería profesional y plataformas electrónicas seguras.',
        },
        {
            id: 'proteccion-datos',
            number: '13',
            title: 'Protección de datos personales',
            content: `El responsable del tratamiento es Santiago Giménez Olavarriaga (Av. Diagonal 437, Principal 3ª, 08036 Barcelona, santiago@gimenezolavarriaga.abogado). Los datos se tratarán para prestar la asistencia jurídica contratada, gestionar la facturación y cumplir obligaciones deontológicas y legales.

Puede consultar la información completa sobre privacidad y ejercicio de derechos en la Política de Privacidad oficial: https://www.autoridad.legal/legal/privacy.`,
        },
        {
            id: 'facturacion',
            number: '14',
            title: 'Facturación',
            content: 'El profesional emitirá la factura oficial correspondiente con desglose de base imponible, 21 % de IVA, derechos de procurador y suplementos acordados.',
        },
        {
            id: 'desistimiento',
            number: '15',
            title: 'Desistimiento y terminación',
            content: 'Se recabará autorización expresa para el inicio inmediato de las actuaciones de urgencia. La terminación anticipada no elimina los honorarios devengados por actuaciones ya realizadas.',
        },
        {
            id: 'sustitucion',
            number: '16',
            title: 'Sustitución o colaboración profesional',
            content: 'Cuando la asistencia urgente en guardia lo requiera, el profesional podrá coordinarse con otros letrados o procuradores garantizando la máxima calidad defensiva.',
        },
        {
            id: 'reclamaciones',
            number: '17',
            title: 'Reclamaciones y solución de controversias',
            content: 'Las consultas o reclamaciones profesionales podrán dirigirse ante el letrado y, en su caso, ante los servicios de información y arbitraje del Ilustre Colegio de la Abogacía de Barcelona (www.icab.cat).',
        },
        {
            id: 'aceptacion-firma',
            number: '18',
            title: 'Modelización de Aceptación',
            content: 'La Hoja de Encargo individualizada formalizada con cada cliente recoge expresamente la modalidad de pago elegida, el desglose final de suplementos aprobados y el precio total con IVA.',
        },
        {
            id: 'firma',
            number: '19',
            title: 'Firma',
            content: 'En [lugar], a [fecha].',
            signatureBlock: {
                professional: {
                    name: 'Santiago Giménez Olavarriaga',
                    icab: '31.389',
                },
                client: {
                    name: '[nombre completo]',
                    document: '[DNI/NIE/Pasaporte]',
                },
            },
        },
    ],
};
