import { DistrictFullData, DistrictMunicipality } from '@/lib/db/district-content';
import { PHONE_E164 } from '@/lib/config';

export interface DistrictJsonLdOptions {
    canonicalUrl?: string;
    pageTitle?: string;
    pageDescription?: string;
    faqs?: { question: string; answer: string }[];
}

function cleanSameAs(wikidataQid?: string | null, wikipediaUrl?: string | null): string[] | undefined {
    const list: string[] = [];
    if (wikidataQid && /^Q\d+$/i.test(wikidataQid.trim())) {
        list.push(`https://www.wikidata.org/wiki/${wikidataQid.trim()}`);
    }
    if (wikipediaUrl && /^https?:\/\//i.test(wikipediaUrl.trim())) {
        list.push(wikipediaUrl.trim());
    }
    return list.length > 0 ? list : undefined;
}

/**
 * Builds the schema.org @graph for a judicial district page (/juzgados/[slug]).
 *
 * Strict schema.org rules applied:
 * 1. WebPage does NOT carry areaServed (invalid schema.org property on WebPage).
 *    WebPage references the Service node via mainEntity: { "@id": "{canonical}#service" }.
 * 2. New Service node (#service) links to Organization (#organization) as provider,
 *    and carries the rich areaServed -> AdministrativeArea (#partido-judicial).
 * 3. AdministrativeArea containsPlace lists all municipalities with Wikidata/Wikipedia sameAs.
 * 4. Courthouse is a standalone node (#courthouse) referenced by WebPage.about,
 *    containedInPlace -> #partido-judicial, geo on Courthouse (never on AdministrativeArea).
 * 5. Reuses global #organization, #website, and #emergency-contact identifiers.
 */
export function buildDistrictJsonLdGraph(data: DistrictFullData, options: DistrictJsonLdOptions = {}) {
    const canonical = options.canonicalUrl || `https://www.autoridad.legal/juzgados/${data.slug}`;
    const court = data.court;
    const partido = court.judicialDistrict;
    const oficial = court.officialName;

    const pageTitle =
        options.pageTitle || `Juicio rápido en ${partido}: qué hacer y juzgado de guardia | Autoridad Legal`;
    const pageDescription =
        options.pageDescription ||
        `Defensa urgente 24h en juicio rápido en el partido judicial de ${partido} y juzgado de guardia.`;

    // 1. Courthouse node (#courthouse)
    const courthouseId = `${canonical}#courthouse`;
    const partidoJudicialId = `${canonical}#partido-judicial`;
    const serviceId = `${canonical}#service`;
    const webpageId = `${canonical}#webpage`;
    const breadcrumbId = `${canonical}#breadcrumb`;
    const faqId = `${canonical}#faq`;

    const defaultMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        court.address ? `${oficial}, ${court.address}` : oficial
    )}`;
    const mapsUrl = court.mapsUrl || defaultMapsUrl;

    const courthouseNode: Record<string, any> = {
        '@type': 'Courthouse',
        '@id': courthouseId,
        name: oficial,
        hasMap: mapsUrl,
        containedInPlace: {
            '@id': partidoJudicialId,
        },
    };

    if (court.address) {
        courthouseNode.address = {
            '@type': 'PostalAddress',
            streetAddress: court.address,
            addressLocality: partido,
            addressRegion: 'Barcelona',
            addressCountry: 'ES',
        };
    }

    if (court.gpsCoords) {
        courthouseNode.geo = {
            '@type': 'GeoCoordinates',
            latitude: court.gpsCoords.lat,
            longitude: court.gpsCoords.lng,
        };
    }

    // 2. Municipalities under containsPlace
    const containsPlace = data.municipalities.map((m: DistrictMunicipality) => {
        const node: Record<string, any> = {
            '@type': 'City',
            name: m.name,
        };
        const sameAs = cleanSameAs(
            (m as any).wikidataQid || (m as any).wikidata_qid,
            (m as any).wikipediaUrl || (m as any).wikipedia_url
        );
        if (sameAs) {
            node.sameAs = sameAs;
        }
        return node;
    });

    // 3. AdministrativeArea (#partido-judicial)
    const partidoSameAs = cleanSameAs(court.wikidataQid, court.wikipediaUrl);
    const administrativeAreaNode: Record<string, any> = {
        '@type': 'AdministrativeArea',
        '@id': partidoJudicialId,
        name: `Partido judicial de ${partido}`,
        containedInPlace: {
            '@type': 'AdministrativeArea',
            name: 'Provincia de Barcelona',
            sameAs: 'https://www.wikidata.org/wiki/Q81949',
        },
        containsPlace,
    };
    if (partidoSameAs) {
        administrativeAreaNode.sameAs = partidoSameAs;
    }

    // 4. Service node (#service)
    const serviceNode: Record<string, any> = {
        '@type': 'Service',
        '@id': serviceId,
        name: `Abogado para juicio rápido en ${partido}`,
        serviceType: 'Defensa penal en delitos contra la seguridad vial (juicio rápido)',
        provider: {
            '@id': 'https://www.autoridad.legal/#organization',
        },
        url: canonical,
        areaServed: administrativeAreaNode,
        availableChannel: {
            '@type': 'ServiceChannel',
            servicePhone: {
                '@id': 'https://www.autoridad.legal/#emergency-contact',
            },
        },
    };

    // 5. WebPage node (#webpage) - areaServed removed, mainEntity -> #service
    const webPageNode: Record<string, any> = {
        '@type': 'WebPage',
        '@id': webpageId,
        url: canonical,
        name: pageTitle,
        description: pageDescription,
        inLanguage: 'es',
        isPartOf: {
            '@id': 'https://www.autoridad.legal/#website',
        },
        provider: {
            '@id': 'https://www.autoridad.legal/#organization',
        },
        publisher: {
            '@id': 'https://www.autoridad.legal/#organization',
        },
        breadcrumb: {
            '@id': breadcrumbId,
        },
        about: {
            '@id': courthouseId,
        },
        mainEntity: {
            '@id': serviceId,
        },
    };

    // 6. BreadcrumbList (#breadcrumb)
    const breadcrumbNode: Record<string, any> = {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: 'https://www.autoridad.legal',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Juicio rápido',
                item: 'https://www.autoridad.legal/juzgados',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: partido,
                item: canonical,
            },
        ],
    };

    // 7. FAQPage (#faq) - identical to existing logic
    const faqs = options.faqs || [];
    const faqNode: Record<string, any> | null =
        faqs.length > 0
            ? {
                  '@type': 'FAQPage',
                  '@id': faqId,
                  mainEntity: faqs.map(faq => ({
                      '@type': 'Question',
                      name: faq.question,
                      acceptedAnswer: {
                          '@type': 'Answer',
                          text: faq.answer,
                      },
                  })),
              }
            : null;

    const graph = [webPageNode, serviceNode, courthouseNode, breadcrumbNode];
    if (faqNode) {
        graph.push(faqNode);
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
