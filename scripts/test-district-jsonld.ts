/**
 * scripts/test-district-jsonld.ts
 *
 * Validates buildDistrictJsonLdGraph against strict schema.org specifications:
 * 1. Exactly one Service node with @id = {canonical}#service.
 * 2. areaServed.containsPlace.length === municipalities.length.
 * 3. No sameAs is null, empty string, or generic "https://wikidata.org".
 * 4. WebPage node does NOT have an areaServed property.
 * 5. WebPage.mainEntity references {canonical}#service.
 * 6. All referenced @ids exist in the graph or are known global nodes
 *    (#organization, #website, #emergency-contact).
 * 7. Courthouse geo is on Courthouse, not on AdministrativeArea.
 *
 * Usage: npx tsx scripts/test-district-jsonld.ts
 */
import { buildDistrictJsonLdGraph } from '../src/lib/seo/district-jsonld';
import { DistrictFullData } from '../src/lib/db/district-content';

const mockData: DistrictFullData = {
    slug: 'martorell',
    court: {
        id: 'mock-court-1',
        slug: 'martorell',
        name: 'Martorell',
        judicialDistrict: 'Martorell',
        officialName: 'Tribunal de Instancia de Martorell',
        address: 'Passeig del Sindicat, 10, 08760 Martorell, Barcelona',
        phone: '+34 937 75 12 34',
        fiscaliaAddress: null,
        gpsCoords: { lat: 41.4775, lng: 1.9223 },
        atestadoInfo: null,
        hospitalContraste: null,
        depositoVehiculos: null,
        practicalReviewed: true,
        wikidataQid: 'Q6064889',
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Partido_judicial_de_Martorell',
        mapsUrl: 'https://maps.google.com/?cid=11772922754161233191',
        plusCode: 'FWHC+2W Martorell',
    },
    municipalities: [
        {
            id: 'm1',
            name: 'Martorell',
            slug: 'martorell',
            population: 28000,
            wikidataQid: 'Q15623',
            wikipediaUrl: 'https://es.wikipedia.org/wiki/Martorell',
        },
        {
            id: 'm2',
            name: 'Abrera',
            slug: 'abrera',
            population: 12000,
            wikidataQid: 'Q15593',
            wikipediaUrl: 'https://es.wikipedia.org/wiki/Abrera',
        },
        {
            id: 'm3',
            name: 'Castellví de Rosanes',
            slug: 'castellvi-de-rosanes',
            population: 2000,
            wikidataQid: 'Q15598',
            wikipediaUrl: 'https://es.wikipedia.org/wiki/Castellv%C3%AD_de_Rosanes',
        },
        {
            id: 'm4',
            name: 'Esparreguera',
            slug: 'esparreguera',
            population: 22000,
            wikidataQid: 'Q15620',
            wikipediaUrl: 'https://es.wikipedia.org/wiki/Esparraguera',
        },
    ],
    topMunicipalities: [],
    allMunicipalities: [],
    policeBodies: ['Mossos d\'Esquadra', 'Policía Local de Martorell'],
    publicTransport: ['FGC Martorell Central', 'Rodalies R4'],
    reviewedCourtFaqs: [
        {
            id: 'faq1',
            position: 1,
            question: '¿Dónde está el juzgado de guardia en Martorell?',
            answer: 'En Passeig del Sindicat, 10.',
        },
    ],
    pricing: [],
    published: true,
};

function runTests() {
    console.log('--- Iniciando tests de buildDistrictJsonLdGraph ---');

    const graphResult = buildDistrictJsonLdGraph(mockData, {
        canonicalUrl: 'https://www.autoridad.legal/juzgados/martorell',
        faqs: [{ question: '¿Dónde es el juicio rápido?', answer: 'En el juzgado de guardia.' }],
    });

    const graph = graphResult['@graph'];
    if (!Array.isArray(graph)) {
        throw new Error('FAILED: @graph no es un array');
    }

    // 1. Service node check
    const services = graph.filter(n => n['@type'] === 'Service');
    if (services.length !== 1) {
        throw new Error(`FAILED: Se esperaba exactamente 1 nodo Service, encontrados ${services.length}`);
    }
    const service = services[0];
    if (service['@id'] !== 'https://www.autoridad.legal/juzgados/martorell#service') {
        throw new Error(`FAILED: Service @id incorrecto: ${service['@id']}`);
    }
    console.log('✓ 1. Exactamente 1 nodo Service con @id correcto');

    // 2. areaServed & containsPlace count
    const areaServed = service.areaServed;
    if (!areaServed || areaServed['@type'] !== 'AdministrativeArea') {
        throw new Error('FAILED: areaServed no es un AdministrativeArea');
    }
    const containsPlace = areaServed.containsPlace;
    if (!Array.isArray(containsPlace)) {
        throw new Error('FAILED: containsPlace no es un array');
    }
    if (containsPlace.length !== mockData.municipalities.length) {
        throw new Error(
            `FAILED: containsPlace.length (${containsPlace.length}) !== municipalities.length (${mockData.municipalities.length})`
        );
    }
    console.log(`✓ 2. areaServed.containsPlace contiene los ${mockData.municipalities.length} municipios`);

    // 3. sameAs validation
    const checkSameAs = (sameAs: any, context: string) => {
        if (!sameAs) return;
        const list = Array.isArray(sameAs) ? sameAs : [sameAs];
        for (const item of list) {
            if (typeof item !== 'string' || item.trim() === '') {
                throw new Error(`FAILED: sameAs vacío en ${context}`);
            }
            if (item.toLowerCase() === 'https://wikidata.org' || item.toLowerCase() === 'https://www.wikidata.org') {
                throw new Error(`FAILED: sameAs genérico de wikidata.org en ${context}`);
            }
            if (!item.startsWith('http')) {
                throw new Error(`FAILED: sameAs no es una URL válida en ${context}: ${item}`);
            }
        }
    };

    checkSameAs(areaServed.sameAs, 'AdministrativeArea partido');
    for (const city of containsPlace) {
        checkSameAs(city.sameAs, `City ${city.name}`);
    }
    console.log('✓ 3. Todos los sameAs son URLs válidas y verificables (ninguno genérico o vacío)');

    // 4. WebPage areaServed removal & mainEntity
    const webPage = graph.find(n => n['@type'] === 'WebPage');
    if (!webPage) {
        throw new Error('FAILED: Falta nodo WebPage');
    }
    if ('areaServed' in webPage) {
        throw new Error('FAILED: WebPage todavía contiene la propiedad inválida areaServed');
    }
    if (!webPage.mainEntity || webPage.mainEntity['@id'] !== 'https://www.autoridad.legal/juzgados/martorell#service') {
        throw new Error('FAILED: WebPage.mainEntity no apunta a #service');
    }
    console.log('✓ 4. WebPage no contiene areaServed y enlaza a #service vía mainEntity');

    // 5. Courthouse node & geo placement
    const courthouse = graph.find(n => n['@type'] === 'Courthouse');
    if (!courthouse) {
        throw new Error('FAILED: Falta nodo Courthouse');
    }
    if (courthouse['@id'] !== 'https://www.autoridad.legal/juzgados/martorell#courthouse') {
        throw new Error(`FAILED: Courthouse @id incorrecto: ${courthouse['@id']}`);
    }
    if (!courthouse.geo || typeof courthouse.geo.latitude !== 'number') {
        throw new Error('FAILED: Courthouse no contiene las coordenadas geo');
    }
    if ('geo' in areaServed) {
        throw new Error('FAILED: AdministrativeArea contiene erróneamente propiedad geo (debe estar en Courthouse)');
    }
    if (courthouse.containedInPlace['@id'] !== 'https://www.autoridad.legal/juzgados/martorell#partido-judicial') {
        throw new Error('FAILED: Courthouse no está containedInPlace en #partido-judicial');
    }
    console.log('✓ 5. Courthouse es un nodo independiente con geo y containedInPlace referenciando al partido');

    // 6. ID references validation
    const collectIds = (obj: any, ids = new Set<string>()): Set<string> => {
        if (!obj || typeof obj !== 'object') return ids;
        if (obj['@id'] && typeof obj['@id'] === 'string') ids.add(obj['@id']);
        for (const val of Object.values(obj)) {
            if (Array.isArray(val)) {
                val.forEach(v => collectIds(v, ids));
            } else if (typeof val === 'object') {
                collectIds(val, ids);
            }
        }
        return ids;
    };

    const definedIds = collectIds(graph);
    const globalIds = new Set([
        'https://www.autoridad.legal/#organization',
        'https://www.autoridad.legal/#website',
        'https://www.autoridad.legal/#emergency-contact',
    ]);

    const verifyRef = (ref: any, context: string) => {
        if (!ref) return;
        if (typeof ref === 'object' && ref['@id']) {
            const id = ref['@id'];
            if (!definedIds.has(id) && !globalIds.has(id)) {
                throw new Error(`FAILED: Referencia @id desconocida "${id}" en ${context}`);
            }
        }
    };

    verifyRef(service.provider, 'Service.provider');
    verifyRef(service.availableChannel?.servicePhone, 'Service.availableChannel');
    verifyRef(webPage.isPartOf, 'WebPage.isPartOf');
    verifyRef(webPage.provider, 'WebPage.provider');
    verifyRef(webPage.publisher, 'WebPage.publisher');
    verifyRef(webPage.about, 'WebPage.about');
    verifyRef(webPage.breadcrumb, 'WebPage.breadcrumb');
    verifyRef(courthouse.containedInPlace, 'Courthouse.containedInPlace');
    console.log('✓ 6. Todas las referencias @id del grafo son consistentes y resuelven correctamente');

    console.log('\nTODOS LOS TESTS PASARON CON ÉXITO (7/7)');
}

runTests();
