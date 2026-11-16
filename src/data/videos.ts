export interface VideoChapter {
    start: number; // in seconds
    end: number;   // in seconds
    name: string;
}

export interface VideoLocation {
    name: string;
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
}

export interface VideoData {
    youtubeId: string;
    title: string;
    description: string;
    uploadDate: string;
    duration: string;
    durationSeconds: number;
    thumbnailUrl: string;
    localThumbnail?: string;
    embedUrl: string;
    contentUrl: string;
    inLanguage: string;
    partidoJudicial?: string;
    partidosJudiciales?: string[];
    services: string[];
    chapters: VideoChapter[];
    transcript: string;
    location?: VideoLocation;
}

export const VIDEOS: VideoData[] = [
    {
        youtubeId: 'jYq3WdDtN5U',
        title: "Juicio Rápido Seguridad Vial en L'Hospitalet: Multas, Retirada de Carné, TBC y Conformidad",
        description: "Santiago Giménez Olavarriaga, Director Jurídico de Autoridad Legal, explica desde el Tribunal de Instancia de L'Hospitalet de Llobregat (Av. del Carrilet, 2) los cuatro aspectos procesales comunes a cualquier juicio rápido por un delito contra la seguridad vial: la adaptación de la multa a tus ingresos, la entrega física del carné el mismo día del juicio, los Trabajos en Beneficio de la Comunidad y la rebaja de un tercio por conformidad.",
        uploadDate: '2026-09-13T13:07:08-07:00',
        duration: 'PT5M46S',
        durationSeconds: 346,
        thumbnailUrl: 'https://i.ytimg.com/vi/jYq3WdDtN5U/maxresdefault.jpg',
        localThumbnail: '/images/videos/jYq3WdDtN5U.webp',
        embedUrl: 'https://www.youtube-nocookie.com/embed/jYq3WdDtN5U',
        contentUrl: 'https://www.youtube.com/watch?v=jYq3WdDtN5U',
        inLanguage: 'es-ES',
        partidoJudicial: 'hospitalet-de-llobregat',
        services: [
            'alcoholemia',
            'drogas',
            'velocidad',
            'sin-carnet',
            'conductores-profesionales',
        ],
        location: {
            name: "Tribunal de Instancia de L'Hospitalet de Llobregat",
            streetAddress: 'Av. del Carrilet, 2',
            postalCode: '08902',
            addressLocality: "L'Hospitalet de Llobregat",
            addressRegion: 'Barcelona',
            addressCountry: 'ES',
        },
        chapters: [
            {
                start: 0,
                end: 35,
                name: "Ubicación: Tribunal de Instancia de L'Hospitalet de Llobregat (Av. del Carrilet, 2)",
            },
            {
                start: 35,
                end: 130,
                name: '1. Adaptación de la multa a tu situación económica',
            },
            {
                start: 130,
                end: 175,
                name: '2. Retirada de carné y entrega física el mismo día del juicio',
            },
            {
                start: 175,
                end: 235,
                name: '3. Trabajos en Beneficio de la Comunidad (TBC) y riesgo de quebrantamiento',
            },
            {
                start: 235,
                end: 336,
                name: '4. La conformidad: rebaja de un tercio en multa y retirada',
            },
            {
                start: 336,
                end: 346,
                name: 'La decisión final es del cliente',
            },
        ],
        transcript: `Si has sido citado para un juicio rápido por cualquiera de los delitos contra la seguridad vial en L'Hospitalet de Llobregat, este que te voy a mostrar es el Tribunal de Instancia de L'Hospitalet de Llobregat, ubicado en la Avenida del Carrilet número 2. La Avenida del Carrilet es la calle que lo separa del Tribunal de Instancia de Barcelona, así que los dos tribunales están muy cerca el uno del otro.

Si te encuentras ante una citación en el Tribunal de Instancia de L'Hospitalet de Llobregat por cualquiera de los delitos contra la seguridad vial, hay una serie de cuestiones que debes tener en cuenta y que son comunes a todos ellos.

1. La multa se adapta a tu situación económica. Todos los delitos contra la seguridad vial llevan aparejadas unas penas comunes. Una de ellas es la multa, que podría ser sustituida por trabajos en beneficio de la comunidad. En Autoridad Legal te representaré yo o cualquier persona de mi equipo y prepararemos la estrategia. Pero, en general, aunque hay unos mínimos y unos baremos que sigue la Fiscalía a la hora de pedir las multas, la multa se tiene que adaptar a la situación económica de cada persona. Por eso es muy útil que traigas documentación que la acredite: tu situación laboral, tu nómina y cuánto ganas, si estás en desempleo, si recibes algún tipo de ayuda o tienes alguna discapacidad. También si pagas una pensión de alimentos, si tienes hijos a cargo o si tienes que hacer frente a una medicación cuyo coste puedas acreditar. Todas estas circunstancias pueden hacer que el fiscal ajuste la pena de multa a tu situación concreta, y eso va a ser muy beneficioso para ti.

2. La retirada del carné empieza el mismo día del juicio. Todos los delitos contra la seguridad vial, salvo el de conducción sin carné, llevan aparejada la retirada del carné. Esa retirada se puede empezar a cumplir en el mismo momento del juicio: si hay conformidad, se te pedirá que entregues el carné de conducir y desde ese mismo día empiezas a cumplir la pena. Esto importa por dos motivos. Primero, debes traer el carné de conducir al juicio. Segundo, si vienes en coche al Tribunal de Instancia de L'Hospitalet de Llobregat y entregas el carné, ya no podrás conducirlo de vuelta: necesitarás que otra persona lo conduzca o volver a recogerlo en otro momento.

3. Trabajos en Beneficio de la Comunidad (TBC). Es una pena que se impone en sustitución de la multa, y solo si la pide la persona acusada: no te la pueden imponer si tú no la solicitas. Consiste en realizar labores, normalmente en fin de semana para que no interfieran con tu trabajo. Para muchas personas resulta más engorroso que pagar la multa, pero otras lo prefieren. Ten siempre en cuenta que incumplir o no asistir a los trabajos una vez concretados supone un quebrantamiento de condena, y eso tiene consecuencias. No se puede tomar a broma.

4. La conformidad: rebaja de un tercio. En cualquier juicio rápido en el Tribunal de Instancia de L'Hospitalet, por ejemplo por alcoholemia, tienes acceso a la conformidad. El fiscal revisa el atestado y hace una petición de pena: un tiempo de retirada y un importe de multa, o incluso meses de prisión si el caso fuera muy grave. Como persona acusada, tienes derecho a aceptar los hechos y la pena que pide el fiscal y, solo por esa aceptación, se te aplica una rebaja de un tercio. Si el fiscal pide un año de retirada, con la reducción se queda en ocho meses, y la multa también se reduce en un tercio. Por eso hay que pensárselo muy bien antes de renunciar a la conformidad e ir a juicio, porque en juicio hay más incertidumbre. La excepción son casos como el de los transportistas, que no pueden permitirse entregar el carné de inmediato. Salvo que lo tengas muy claro, ir a juicio es un riesgo alto: aunque haya motivos para pensar que nos pueden dar la razón, también nos la pueden quitar, y si vas a juicio pierdes la opción de la reducción.

La decisión es tuya. Yo te pondré sobre la mesa todas las opciones, pero la decisión te corresponde a ti como persona acusada y no la puedo tomar yo por ti.`,
    },
];

/**
 * Get video assigned to a judicial district by slug.
 */
export function getVideoForPartido(slug: string): VideoData | undefined {
    return VIDEOS.find(
        v => v.partidoJudicial === slug || (v.partidosJudiciales && v.partidosJudiciales.includes(slug))
    );
}

/**
 * Get all videos assigned to a legal service slug.
 */
export function getVideosForService(serviceSlug: string): VideoData[] {
    return VIDEOS.filter(v => v.services.includes(serviceSlug));
}

/**
 * Get all videos.
 */
export function getAllVideos(): VideoData[] {
    return VIDEOS;
}

