import { PHONE_E164, DEFAULT_OG_IMAGE } from '@/lib/config';
import { SERVICES_PRICING, PRICING_ADDONS } from '@/lib/config/pricing';

export interface FaqItem {
    question: string;
    answer: string;
}

export function getSitewideJsonLdV6(faqs?: FaqItem[]) {
    const graphNodes: any[] = [
        {
            '@type': ['LegalService', 'Organization'],
            '@id': 'https://www.autoridad.legal/#organization',
            'name': 'Autoridad Legal',
            'legalName': 'Santiago Giménez Olavarriaga',
            'taxID': '46358445J',
            'description': 'Despacho penalista especializado en delitos contra la seguridad vial en la provincia de Barcelona. Defensa urgente 24h en juicio rápido por alcoholemia, drogas al volante, exceso de velocidad, conducción sin carné y casos de conductores profesionales, con honorarios cerrados y tasados por escrito (IVA y procurador incluidos).',
            'url': 'https://www.autoridad.legal',
            'telephone': PHONE_E164,
            'email': 'contacto@autoridad.legal',
            'image': DEFAULT_OG_IMAGE,
            'logo': 'https://www.autoridad.legal/images/logo-transparent.png',
            'priceRange': '980€–1480€',
            'knowsLanguage': ['es', 'ca'],
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Av. Diagonal 437, Principal 3ª',
                'postalCode': '08036',
                'addressLocality': 'Barcelona',
                'addressRegion': 'Cataluña',
                'addressCountry': 'ES'
            },
            'areaServed': {
                '@type': 'AdministrativeArea',
                'name': 'Provincia de Barcelona'
            },
            'contactPoint': [
                {
                    '@type': 'ContactPoint',
                    '@id': 'https://www.autoridad.legal/#emergency-contact',
                    'telephone': PHONE_E164,
                    'contactType': 'emergency',
                    'url': `tel:${PHONE_E164}`,
                    'availableLanguage': ['es', 'ca'],
                    'areaServed': 'ES-B',
                    'hoursAvailable': {
                        '@type': 'OpeningHoursSpecification',
                        'dayOfWeek': [
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday'
                        ],
                        'opens': '00:00',
                        'closes': '23:59'
                    }
                }
            ],
            'founder': {
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person'
            },
            'knowsAbout': [
                'Delitos contra la seguridad vial',
                'Alcoholemia al volante',
                'Negativa a someterse a las pruebas de alcohol o drogas',
                'Conducción bajo la influencia de drogas',
                'Exceso de velocidad como delito',
                'Conducción sin permiso o licencia',
                'Defensa penal de conductores profesionales',
                'Juicio rápido (diligencias urgentes)',
                'Derecho penal',
                'https://www.wikidata.org/wiki/Q19842607',
                'https://www.wikidata.org/wiki/Q3602521',
                'https://www.wikidata.org/wiki/Q150342',
                'https://www.wikidata.org/wiki/Q5954562',
                'https://www.wikidata.org/wiki/Q110823293',
                'https://www.wikidata.org/wiki/Q1048450',
                'https://www.wikidata.org/wiki/Q5807185'
            ],
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                '@id': 'https://www.autoridad.legal/#honorarios',
                'name': 'Catálogo de Honorarios Cerrados — Defensa en Seguridad Vial',
                'itemListElement': SERVICES_PRICING.map(svc => ({
                    '@type': 'Offer',
                    'name': svc.offerName,
                    'url': svc.url,
                    'availability': 'https://schema.org/InStock',
                    'priceSpecification': {
                        '@type': 'PriceSpecification',
                        'price': svc.basePrice,
                        'priceCurrency': 'EUR',
                        'valueAddedTaxIncluded': true
                    },
                    'acceptedPaymentMethod': [
                        {
                            '@type': 'PaymentMethod',
                            'name': 'Financiación externa (Klarna/Stripe), sujeta a aprobación bancaria'
                        },
                        {
                            '@type': 'PaymentMethod',
                            'name': 'Sistema de Facilidades de Pago Híbrido Flex 60/40 de Autoridad Legal'
                        }
                    ],
                    'itemOffered': {
                        '@type': 'Service',
                        'name': svc.serviceName,
                        'serviceType': svc.serviceType,
                        'url': svc.url
                    },
                    'description': svc.description,
                    'addOn': svc.applicableAddOns.map(addOnId => {
                        const addOn = PRICING_ADDONS[addOnId];
                        return {
                            '@type': 'Offer',
                            'name': addOn.name,
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'price': addOn.price,
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'description': addOn.description
                        };
                    })
                }))
            },
            'subjectOf': {
                '@type': 'VideoObject',
                '@id': 'https://www.autoridad.legal/#video-hero',
                'name': 'CITACIÓN A JUICIO RÁPIDO: Cómo defender tu carné y tu empleo',
                'description': 'Santiago Giménez Olavarriaga detalla el protocolo de defensa urgente 24h ante citaciones de tráfico y juicios rápidos por alcoholemia, drogas, exceso de velocidad o conducción sin carnet.',
                'thumbnailUrl': 'https://i.ytimg.com/vi/DwJMpDn_URY/maxresdefault.jpg',
                'uploadDate': '2026-08-06T20:33:53Z',
                'duration': 'PT1M45S',
                'embedUrl': 'https://www.youtube.com/embed/DwJMpDn_URY',
                'contentUrl': 'https://www.youtube.com/watch?v=DwJMpDn_URY',
                'transcript': 'Soy Santiago Giménez Olavarriaga, abogado penalista y director de Autoridad Legal. Si estás viendo este vídeo es porque has sido citado a un juicio rápido por alguno de los delitos contra la seguridad vial; Alcoholemia, Conducción bajo los efectos de las drogas, Conducción sin carnet o Exceso de velocidad. Es posible que en este momento tu economía, tu carnet, tu trabajo y tu reputación se vean seriamente amenazadas. La situación es la siguiente: Si no haces nada, por defecto, se te asigna un abogado de oficio al cual conocerás el mismo día del juicio y en la misma sede del juzgado. Nosotros en Autoridad Legal, trabajamos de forma distinta: preparamos tu estrategia con antelación. Te representa siempre un especialista que conoce perfectamente los juzgados y los criterios de jueces y fiscales, aquellos que conocerán de tu asunto. En Autoridad Legal nuestros compromisos quedan plasmados por escrito en un acuerdo de honorarios. En ellos se refleja que serás representado por un abogado especializado, que el precio es cerrado e incluye también los costes de Procurador y el IVA. Si lo necesitas, disponemos de diferentes fórmulas de financiación. En cuanto al pago disponemos de un sistema de Pago Seguro; tu dinero queda retenido de forma segura en tu cuenta: y solo tras el servicio prestado por el abogado en el juzgado, ese dinero se libera.',
                'hasPart': [
                    {
                        '@type': 'Clip',
                        'name': 'Citación a Juicio Rápido: Tu situación de urgencia',
                        'startOffset': 3,
                        'endOffset': 29,
                        'url': 'https://www.youtube.com/watch?v=DwJMpDn_URY&t=3s'
                    },
                    {
                        '@type': 'Clip',
                        'name': 'El peligro de ir con Abogado de Oficio de madrugada',
                        'startOffset': 29,
                        'endOffset': 53,
                        'url': 'https://www.youtube.com/watch?v=DwJMpDn_URY&t=29s'
                    },
                    {
                        '@type': 'Clip',
                        'name': 'Honorarios cerrados y transparentes (Acuerdo por escrito)',
                        'startOffset': 53,
                        'endOffset': 71,
                        'url': 'https://www.youtube.com/watch?v=DwJMpDn_URY&t=53s'
                    },
                    {
                        '@type': 'Clip',
                        'name': 'Sistema de Pago Seguro: Tu dinero retenido y garantizado',
                        'startOffset': 71,
                        'endOffset': 105,
                        'url': 'https://www.youtube.com/watch?v=DwJMpDn_URY&t=71s'
                    }
                ]
            },
            'sameAs': [
                'https://www.linkedin.com/company/135936660/',
                'https://www.facebook.com/profile.php?id=61591553736969',
                'https://www.instagram.com/autoridad.legal/',
                'https://x.com/AutoridadLegal_',
                'https://www.youtube.com/@Autoridad_Legal'
            ]
        }
    ];

    if (faqs && faqs.length > 0) {
        graphNodes.push({
            '@type': 'FAQPage',
            '@id': 'https://www.autoridad.legal/#faq',
            'inLanguage': 'es',
            'about': {
                '@id': 'https://www.autoridad.legal/#organization'
            },
            'publisher': {
                '@id': 'https://www.autoridad.legal/#organization'
            },
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        });
    }

    graphNodes.push({
        '@type': 'Person',
        '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person',
        'name': 'Santiago Giménez Olavarriaga',
        'givenName': 'Santiago',
        'familyName': 'Giménez Olavarriaga',
        'description': 'Abogado penalista colegiado en el Ilustre Colegio de la Abogacía de Barcelona (ICAB nº 31.389). Ejerce la dirección jurídica de Autoridad Legal y es especialista en la defensa de delitos contra la seguridad vial, con especial atención al control metrológico de etilómetros.',
        'jobTitle': 'Director Jurídico y Abogado Penalista Ejerciente',
        'image': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg',
        'url': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga',
        'email': 'contacto@autoridad.legal',
        'telephone': PHONE_E164,
        'knowsLanguage': ['es', 'ca'],
        'worksFor': {
            '@id': 'https://www.autoridad.legal/#organization'
        },
        'memberOf': {
            '@type': 'Organization',
            'name': 'Ilustre Colegio de la Abogacía de Barcelona',
            'alternateName': 'ICAB',
            'url': 'https://www.icab.es'
        },
        'hasCredential': {
            '@type': 'EducationalOccupationalCredential',
            'credentialCategory': 'Colegiación profesional',
            'recognizedBy': {
                '@type': 'Organization',
                'name': 'Ilustre Colegio de la Abogacía de Barcelona',
                'alternateName': 'ICAB'
            },
            'identifier': '31389',
            'url': 'https://www.icab.es/es/colegio/miembros/index.html?id=31389'
        },
        'knowsAbout': [
            'Delitos contra la seguridad vial',
            'Alcoholemia al volante',
            'Negativa a someterse a las pruebas de alcohol o drogas',
            'Conducción bajo la influencia de drogas',
            'Exceso de velocidad como delito',
            'Conducción sin permiso o licencia',
            'Defensa penal de conductores profesionales',
            'Juicio rápido (diligencias urgentes)',
            'Derecho penal',
            'https://www.wikidata.org/wiki/Q19842607',
            'https://www.wikidata.org/wiki/Q3602521',
            'https://www.wikidata.org/wiki/Q150342',
            'https://www.wikidata.org/wiki/Q5954562',
            'https://www.wikidata.org/wiki/Q110823293',
            'https://www.wikidata.org/wiki/Q1048450',
            'https://www.wikidata.org/wiki/Q5807185'
        ],
        'sameAs': [
            'https://www.linkedin.com/in/santiagogimenezolavarriaga/',
            'https://www.gimenezolavarriaga.abogado',
            'https://www.facebook.com/santiago.gimenez.olavarriaga',
            'https://www.instagram.com/santiago.gimenez.abogado/',
            'https://x.com/santiagogolavar',
            'https://www.youtube.com/@SantiagoGiménezOlavarriaga',
            'https://www.icab.es/es/colegio/miembros/index.html?id=31389'
        ]
    });

    return {
        '@context': 'https://schema.org',
        '@graph': graphNodes
    };
}

export function getHonorariosPageJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': 'https://www.autoridad.legal/honorarios#webpage',
                'url': 'https://www.autoridad.legal/honorarios',
                'name': 'Precio, honorarios y financiación | Autoridad Legal',
                'description': 'Información sobre el modelo de honorarios cerrados, tarifas base de 980 € y 1.480 €, suplementos aplicables, desglose de IVA y modalidades de financiación para la defensa penal en juicios rápidos.',
                'inLanguage': 'es',
                'dateModified': '2026-08-10T09:00:00+02:00',
                'about': {
                    '@id': 'https://www.autoridad.legal/#organization'
                },
                'publisher': {
                    '@id': 'https://www.autoridad.legal/#organization'
                },
                'mainEntity': {
                    '@id': 'https://www.autoridad.legal/#honorarios'
                }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.autoridad.legal/honorarios#breadcrumb',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Inicio',
                        'item': 'https://www.autoridad.legal/'
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Honorarios',
                        'item': 'https://www.autoridad.legal/honorarios'
                    }
                ]
            },
            {
                '@type': 'OfferCatalog',
                '@id': 'https://www.autoridad.legal/#honorarios',
                'name': 'Catálogo de Honorarios Cerrados — Defensa en Seguridad Vial',
                'itemListElement': SERVICES_PRICING.map(svc => ({
                    '@type': 'Offer',
                    'name': svc.offerName,
                    'url': svc.url,
                    'availability': 'https://schema.org/InStock',
                    'priceSpecification': {
                        '@type': 'PriceSpecification',
                        'price': svc.basePrice,
                        'priceCurrency': 'EUR',
                        'valueAddedTaxIncluded': true
                    },
                    'acceptedPaymentMethod': [
                        {
                            '@type': 'PaymentMethod',
                            'name': 'Financiación externa (Klarna/Stripe), sujeta a aprobación bancaria'
                        },
                        {
                            '@type': 'PaymentMethod',
                            'name': 'Sistema de Facilidades de Pago Híbrido Flex 60/40 de Autoridad Legal'
                        }
                    ],
                    'itemOffered': {
                        '@type': 'Service',
                        'name': svc.serviceName,
                        'serviceType': svc.serviceType,
                        'url': svc.url
                    },
                    'description': svc.description,
                    'addOn': svc.applicableAddOns.map(addOnId => {
                        const addOn = PRICING_ADDONS[addOnId];
                        return {
                            '@type': 'Offer',
                            'name': addOn.name,
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'price': addOn.price,
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'description': addOn.description
                        };
                    })
                }))
            },
            {
                '@type': 'Organization',
                '@id': 'https://www.autoridad.legal/#organization'
            },
            {
                '@type': 'Person',
                '@id': 'https://www.autoridad.legal/abogados/santiago-gimenez-olavarriaga#person'
            }
        ]
    };
}

