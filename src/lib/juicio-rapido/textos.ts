/**
 * Textos editables de las páginas de "Juicio rápido" (/juzgados y /juzgados/{partido}).
 * Pendientes de validación final por Santiago Giménez Olavarriaga (ICAB n.º 31.389).
 */

export interface PasoQueHacer {
    number: number;
    title: string;
    description: string;
    hasCourtAnchor?: boolean;
}

export interface PasoJuicioRapido {
    number: number;
    title: string;
    description: string;
}

export const CABECERA_TEXTOS = {
    lawyerLine: '24 h · Santiago Giménez Olavarriaga, abogado penalista · ICAB n.º 31.389',
    ctaPrimaryLabel: 'Llamar al abogado de guardia',
    ctaSecondaryLabel: 'Escribir por WhatsApp',
    stepsCardTitle: 'Qué hacer, paso a paso',
    entradillaPartido: (partido: string) =>
        `Si la policía te ha citado a juicio rápido, se celebrará en pocos días en el juzgado de guardia de ${partido}. Lo primero es hablar con tu abogado: cuanto antes revisemos el atestado, más margen hay para decidir cómo defenderte.`,
    entradillaHub:
        'Si la policía te ha citado a juicio rápido, se celebrará en pocos días en el juzgado de guardia que te corresponda. Lo primero es hablar con tu abogado: cuanto antes revisemos el atestado, más margen hay para decidir cómo defenderte.',
};

export const PASOS_QUE_HACER: PasoQueHacer[] = [
    {
        number: 1,
        title: 'Llama a tu abogado antes de nada',
        description:
            'Antes del juicio hay que revisar el atestado y decidir si conviene la conformidad o defenderte.',
    },
    {
        number: 2,
        title: 'Guarda la citación y los papeles',
        description:
            'La citación, la copia del atestado y el ticket del etilómetro, si te lo dieron.',
    },
    {
        number: 3,
        title: 'Anota lo que pasó',
        description:
            'Hora, lugar, qué pruebas te hicieron y quién intervino (Mossos, Guardia Urbana o Policía Local).',
    },
    {
        number: 4,
        title: 'Preséntate el día y la hora indicados',
        description: 'con tu DNI y la citación.',
        hasCourtAnchor: true,
    },
];

export const AVISO_DETENIDO = {
    boldLead: '¿Estás detenido ahora mismo?',
    beforePhone: 'Pide que avisen a tu abogado o llama al ',
    phoneDisplay: '605 118 871',
    phoneHref: 'tel:+34605118871',
    afterPhone: ': asistencia urgente en comisaría o en el juzgado de guardia.',
};

export const PASOS_COMO_ES_JUICIO_RAPIDO: PasoJuicioRapido[] = [
    {
        number: 1,
        title: 'Control y atestado',
        description: 'La policía hace las pruebas y redacta el atestado.',
    },
    {
        number: 2,
        title: 'Citación',
        description: 'Te entregan día y hora para presentarte en el juzgado de guardia.',
    },
    {
        number: 3,
        title: 'Juzgado de guardia',
        description: 'Declaras asistido por tu abogado y se decide cómo sigue el caso.',
    },
    {
        number: 4,
        title: 'Conformidad o juicio',
        description:
            'Con conformidad, la pena se reduce en un tercio (art. 801 LECrim). Si no, el caso va a juicio.',
    },
    {
        number: 5,
        title: 'Sentencia',
        description: 'Fija la pena y, si corresponde, la retirada del permiso de conducir.',
    },
];

export const DELITOS_TARJETAS = [
    {
        slug: 'alcoholemia' as const,
        title: 'Alcoholemia (art. 379.2 CP)',
        linkLabelPrefix: 'Alcoholemia',
        href: '/alcoholemia',
        summary: 'Conducción bajo la influencia del alcohol (art. 379.2 CP).',
    },
    {
        slug: 'drogas' as const,
        title: 'Drogas (art. 379.2 CP)',
        linkLabelPrefix: 'Drogas',
        href: '/drogas',
        summary: 'Conducción bajo la influencia de drogas (art. 379.2 CP).',
    },
    {
        slug: 'velocidad' as const,
        title: 'Velocidad (art. 379.1 CP)',
        linkLabelPrefix: 'Velocidad',
        href: '/velocidad',
        summary: 'Exceso de velocidad constitutivo de delito (art. 379.1 CP).',
    },
    {
        slug: 'sin-carnet' as const,
        title: 'Sin carnet (art. 384 CP)',
        linkLabelPrefix: 'Sin carnet',
        href: '/sin-carnet',
        summary: 'Conducir sin permiso, sin puntos o con el permiso retirado (art. 384 CP).',
    },
    {
        slug: 'profesionales' as const,
        title: 'Profesionales (permisos C, D, E y CAP)',
        linkLabelPrefix: 'Profesionales',
        href: '/profesionales',
        summary: 'Conductores con permisos C, D o E y CAP.',
    },
];

/**
 * Une elementos con ", " y la conjunción final indicada ("y" u "o").
 */
export function joinListSpanish(items: string[], conjunction: 'y' | 'o' = 'y'): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}

