import { CoberturaData } from '@/lib/db/cobertura';
import { SERVICES_PRICING, PRICING_ADDONS } from '@/lib/config/pricing';
import { normalizeServiceSlug } from '@/lib/db/services';

function getServiceType(serviceSlug: string): string {
    switch (serviceSlug) {
        case 'alcoholemia':
            return 'Defensa penal por alcoholemia';
        case 'drogas':
            return 'Defensa penal por drogas al volante';
        case 'velocidad':
            return 'Defensa penal por exceso de velocidad';
        case 'sin-carnet':
            return 'Defensa penal por conducción sin permiso';
        case 'profesionales':
            return 'Defensa penal para conductores profesionales';
        default:
            return 'Defensa penal por delitos contra la seguridad vial';
    }
}

/**
 * Normalizes phone numbers to clean E.164 format without spaces (e.g. "+34 93 554 86 50" -> "+34935548650")
 */
function normalizeE164Phone(phoneStr: string | null | undefined): string | undefined {
    if (!phoneStr) return undefined;
    const cleaned = phoneStr.replace(/[^\d+]/g, '');
    if (!cleaned) return undefined;
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('34')) return `+${cleaned}`;
    return `+34${cleaned}`;
}

/**
 * Parses full address string into clean streetAddress (street + number) and 5-digit postalCode.
 * Example: "Gran Via de les Corts Catalanes, 111, 08014 Barcelona"
 * -> streetAddress: "Gran Via de les Corts Catalanes, 111", postalCode: "08014"
 */
function parseAddressParts(rawAddress: string | null | undefined) {
    if (!rawAddress) {
        return { streetAddress: undefined, postalCode: undefined };
    }
    const cleanStr = rawAddress.trim();
    // Regex matching: ^(.*?),?\s*(\d{5})\s+(.*)$
    const match = cleanStr.match(/^(.*?)(?:,\s*)?\b(\d{5})\b\s*(.*)$/);
    if (match) {
        let street = match[1].trim();

        // Strip trailing comma if present
        if (street.endsWith(',')) {
            street = street.slice(0, -1).trim();
        }

        return {
            streetAddress: street || cleanStr,
            postalCode: match[2],
        };
    }

    return {
        streetAddress: cleanStr,
        postalCode: undefined,
    };
}

/**
 * Generates exact 4-node Schema.org @graph JSON-LD for coverage pages.
 */
export function generateCoberturaJsonLd(cobertura: CoberturaData, canonicalUrl: string) {
    const normSlug = normalizeServiceSlug(cobertura.service.slug);
    const pricingConfig = SERVICES_PRICING.find(s => s.slug === normSlug);
    const priceStr = pricingConfig ? pricingConfig.basePrice : (normSlug === 'profesionales' ? "1480.00" : "980.00");

    const graph: any[] = [];

    // NODO 1 — Courthouse (Ficha del juzgado / guardia 24h)
    if (cobertura.court) {
        const courtOfficialName = cobertura.court.official_name || cobertura.court.name;
        const rawPhone = cobertura.court.phone_guardia || cobertura.court.phone;
        const normalizedPhone = normalizeE164Phone(rawPhone);

        const courtAddressStr = cobertura.court.address || undefined;
        const { streetAddress, postalCode } = parseAddressParts(courtAddressStr);

        const courthouseObj: any = {
            "@type": "Courthouse",
            "@id": `${canonicalUrl}#courthouse`,
            "name": courtOfficialName,
        };

        if (streetAddress) {
            const postalAddressObj: any = {
                "@type": "PostalAddress",
                "streetAddress": streetAddress,
                "addressLocality": cobertura.location.name,
                "addressRegion": "Barcelona",
                "addressCountry": "ES",
            };
            if (postalCode) {
                postalAddressObj["postalCode"] = postalCode;
            }
            courthouseObj["address"] = postalAddressObj;
        }

        if (normalizedPhone) {
            courthouseObj["telephone"] = normalizedPhone;
        }

        if (cobertura.court.lat != null && cobertura.court.lng != null) {
            courthouseObj["geo"] = {
                "@type": "GeoCoordinates",
                "latitude": cobertura.court.lat,
                "longitude": cobertura.court.lng,
            };
        }

        if (cobertura.court.protocolo_guardia) {
            courthouseObj["description"] = cobertura.court.protocolo_guardia;
        }

        graph.push(courthouseObj);
    }

    // NODO 2 — ItemList (Puntos de control y comisarías con GPS)
    if (cobertura.interestPoints && cobertura.interestPoints.length > 0) {
        const itemListObj = {
            "@type": "ItemList",
            "@id": `${canonicalUrl}#interest-points`,
            "name": `Puntos de control y comisarías en ${cobertura.location.name}`,
            "itemListElement": cobertura.interestPoints.map((pt, index) => {
                const itemPlace: any = {
                    "@type": "Place",
                    "name": pt.name,
                };
                if (pt.details || pt.description) {
                    itemPlace["description"] = pt.details || pt.description;
                }
                if (pt.lat != null && pt.lng != null) {
                    itemPlace["geo"] = {
                        "@type": "GeoCoordinates",
                        "latitude": pt.lat,
                        "longitude": pt.lng,
                    };
                }
                return {
                    "@type": "ListItem",
                    "position": pt.position || index + 1,
                    "item": itemPlace,
                };
            }),
        };
        graph.push(itemListObj);
    }

    // NODO 3 — FAQPage (desde service_faqs localizadas y normalizadas)
    if (cobertura.faqs && cobertura.faqs.length > 0) {
        const faqObj = {
            "@type": "FAQPage",
            "@id": `${canonicalUrl}#faq`,
            "mainEntity": cobertura.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer,
                },
            })),
        };
        graph.push(faqObj);
    }

    // NODO 4 — Service con Offer anidado (precio, addOns y entidades canónicas)
    const nestedOffer: any = {
        "@type": "Offer",
        "@id": `${canonicalUrl}#offer`,
        "url": canonicalUrl,
        "priceCurrency": "EUR",
        "priceSpecification": {
            "@type": "PriceSpecification",
            "price": priceStr,
            "priceCurrency": "EUR",
            "valueAddedTaxIncluded": true,
        },
        "offeredBy": {
            "@type": "Organization",
            "@id": "https://www.autoridad.legal/#organization",
        },
        "seller": {
            "@type": "Person",
            "@id": "https://www.gimenezolavarriaga.abogado/#person",
        },
    };

    if (pricingConfig && pricingConfig.applicableAddOns.length > 0) {
        nestedOffer["addOn"] = pricingConfig.applicableAddOns.map(addOnId => {
            const addOn = PRICING_ADDONS[addOnId];
            return {
                "@type": "Offer",
                "name": addOn.name,
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": addOn.price,
                    "priceCurrency": "EUR",
                    "valueAddedTaxIncluded": true
                },
                "description": addOn.description
            };
        });
    }

    const serviceObj = {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        "serviceType": getServiceType(cobertura.service.slug),
        "name": cobertura.h1Title,
        "description": cobertura.description,
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": cobertura.location.name,
        },
        "provider": {
            "@type": "Organization",
            "@id": "https://www.autoridad.legal/#organization",
        },
        "offers": nestedOffer,
    };

    graph.push(serviceObj);

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    };
}
