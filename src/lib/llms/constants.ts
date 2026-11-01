export const SITE_BASE_URL = 'https://www.autoridad.legal';

export const LLMS_NAP = {
    ambito: 'provincia de Barcelona, en los 25 partidos judiciales listados abajo.',
    direccion: 'Avenida Diagonal 437, Principal 3ª, 08036 Barcelona',
    telefonoGuardiaDisplay: '+34 605 118 871',
    telefonoGuardiaHref: 'tel:+34605118871',
    whatsappDisplay: '+34 657 420 999',
    whatsappHref: 'https://wa.me/34657420999',
    email: 'contacto@autoridad.legal',
    abogadoNombre: 'Santiago Giménez Olavarriaga',
    abogadoIcab: '31.389',
    abogadoPerfilUrl: 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
    abogadoWebPersonal: 'https://www.gimenezolavarriaga.abogado',
} as const;

export const LLMS_BLOCKQUOTE =
    '> Despacho de defensa penal especializado en delitos contra la seguridad vial (alcoholemia, drogas, conducción sin permiso, exceso de velocidad y conductores profesionales) y juicios rápidos en la provincia de Barcelona. Dirección jurídica: Santiago Giménez Olavarriaga, abogado penalista colegiado en el Ilustre Colegio de la Abogacía de Barcelona (ICAB n.º 31.389).';

export interface LlmsServiceMeta {
    slug: 'alcoholemia' | 'drogas' | 'sin-carnet' | 'velocidad' | 'profesionales';
    title: string;
    url: string;
    summary: string;
}

export const LLMS_SERVICES: LlmsServiceMeta[] = [
    {
        slug: 'alcoholemia',
        title: 'Alcoholemia',
        url: `${SITE_BASE_URL}/alcoholemia`,
        summary: 'Defensa penal por conducción bajo la influencia del alcohol (art. 379.2 CP) y juicios rápidos.',
    },
    {
        slug: 'drogas',
        title: 'Drogas',
        url: `${SITE_BASE_URL}/drogas`,
        summary: 'Defensa penal por conducción bajo la influencia de drogas o estupefacientes (art. 379.2 CP).',
    },
    {
        slug: 'sin-carnet',
        title: 'Sin carnet',
        url: `${SITE_BASE_URL}/sin-carnet`,
        summary: 'Defensa penal por conducir sin permiso, con pérdida de vigencia por puntos o con el permiso retirado judicialmente (art. 384 CP).',
    },
    {
        slug: 'velocidad',
        title: 'Velocidad',
        url: `${SITE_BASE_URL}/velocidad`,
        summary: 'Defensa penal por exceso de velocidad constitutivo de delito (art. 379.1 CP) y revisión metrológica del radar.',
    },
    {
        slug: 'profesionales',
        title: 'Profesionales',
        url: `${SITE_BASE_URL}/profesionales`,
        summary: 'Defensa específica para conductores profesionales (permisos C, D y E) y CAP.',
    },
];
