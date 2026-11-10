/**
 * Verified Wikidata Entities for Schema.org and Knowledge Graph integration.
 * Verified against Wikidata API (wbgetentities) on 2026-11-10.
 */

export interface WikidataThing {
    '@type': 'Thing';
    name: string;
    sameAs: string;
}

export interface WikidataArea {
    '@type': 'AdministrativeArea';
    name: string;
    sameAs: string;
}

export const WIKIDATA_THINGS = {
    derechoPenal: {
        '@type': 'Thing',
        name: 'derecho penal',
        sameAs: 'https://www.wikidata.org/wiki/Q146491',
    },
    codigoPenal: {
        '@type': 'Thing',
        name: 'Código Penal de España',
        sameAs: 'https://www.wikidata.org/wiki/Q3825531',
    },
    seguridadVial: {
        '@type': 'Thing',
        name: 'seguridad vial',
        sameAs: 'https://www.wikidata.org/wiki/Q1147899',
    },
    conducirAlcohol: {
        '@type': 'Thing',
        name: 'conducir bajo los efectos del alcohol',
        sameAs: 'https://www.wikidata.org/wiki/Q97667559',
    },
    conduccionDrogas: {
        '@type': 'Thing',
        name: 'conducción bajo la influencia de sustancias psicoactivas',
        sameAs: 'https://www.wikidata.org/wiki/Q250062',
    },
    excesoVelocidad: {
        '@type': 'Thing',
        name: 'exceso de velocidad',
        sameAs: 'https://www.wikidata.org/wiki/Q10498215',
    },
    alcoholimetro: {
        '@type': 'Thing',
        name: 'alcoholímetro',
        sameAs: 'https://www.wikidata.org/wiki/Q754230',
    },
    multa: {
        '@type': 'Thing',
        name: 'multa',
        sameAs: 'https://www.wikidata.org/wiki/Q1243001',
    },
    permisoConducirEuropeo: {
        '@type': 'Thing',
        name: 'permiso de conducir europeo',
        sameAs: 'https://www.wikidata.org/wiki/Q1480858',
    },
    dgt: {
        '@type': 'Thing',
        name: 'Dirección General de Tráfico',
        sameAs: 'https://www.wikidata.org/wiki/Q5280627',
    },
    sct: {
        '@type': 'Thing',
        name: 'Servei Català de Trànsit',
        sameAs: 'https://www.wikidata.org/wiki/Q11949465',
    },
    guardiaCivilTrafico: {
        '@type': 'Thing',
        name: 'Agrupación de Tráfico de la Guardia Civil',
        sameAs: 'https://www.wikidata.org/wiki/Q8191791',
    },
} as const;

export const WIKIDATA_ICAB = {
    '@type': 'Organization',
    name: 'Ilustre Colegio de la Abogacía de Barcelona',
    alternateName: 'ICAB',
    url: 'https://www.icab.es',
    sameAs: 'https://www.wikidata.org/wiki/Q8347714',
} as const;

export const WIKIDATA_AREAS = {
    espana: {
        '@type': 'AdministrativeArea',
        name: 'España',
        sameAs: 'https://www.wikidata.org/wiki/Q29',
    },
    cataluna: {
        '@type': 'AdministrativeArea',
        name: 'Cataluña',
        sameAs: 'https://www.wikidata.org/wiki/Q5705',
    },
    paisVasco: {
        '@type': 'AdministrativeArea',
        name: 'País Vasco',
        sameAs: 'https://www.wikidata.org/wiki/Q3995',
    },
    navarra: {
        '@type': 'AdministrativeArea',
        name: 'Navarra',
        sameAs: 'https://www.wikidata.org/wiki/Q4018',
    },
} as const;

/**
 * Standard knowsAbout items for the Organization/LegalService sitewide schema.
 */
export const SITEWIDE_KNOWS_ABOUT: WikidataThing[] = [
    WIKIDATA_THINGS.derechoPenal,
    WIKIDATA_THINGS.codigoPenal,
    WIKIDATA_THINGS.seguridadVial,
    WIKIDATA_THINGS.conducirAlcohol,
    WIKIDATA_THINGS.conduccionDrogas,
    WIKIDATA_THINGS.excesoVelocidad,
    WIKIDATA_THINGS.alcoholimetro,
    WIKIDATA_THINGS.multa,
    WIKIDATA_THINGS.permisoConducirEuropeo,
    WIKIDATA_THINGS.dgt,
    WIKIDATA_THINGS.sct,
    WIKIDATA_THINGS.guardiaCivilTrafico,
];

/**
 * Relevant knowsAbout items for the administrative traffic fines & points defense service.
 */
export const DEFENSE_POINTS_KNOWS_ABOUT: WikidataThing[] = [
    WIKIDATA_THINGS.seguridadVial,
    WIKIDATA_THINGS.multa,
    WIKIDATA_THINGS.permisoConducirEuropeo,
    WIKIDATA_THINGS.dgt,
    WIKIDATA_THINGS.sct,
    WIKIDATA_THINGS.guardiaCivilTrafico,
    WIKIDATA_THINGS.alcoholimetro,
    WIKIDATA_THINGS.excesoVelocidad,
    WIKIDATA_THINGS.derechoPenal,
];

