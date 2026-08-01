import { PHONE_E164 } from '@/lib/config';

export function SitewideJsonLd() {
    const sitewideGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['LegalService', 'Organization'],
                '@id': 'https://www.autoridad.legal/#organization',
                'name': 'Autoridad Legal',
                'legalName': 'Autoridad Legal',
                'description': 'Despacho penalista especializado en delitos contra la seguridad vial en la provincia de Barcelona. Defensa 24h en juicio rápido por alcoholemia, drogas al volante, exceso de velocidad, conducción sin permiso y casos de conductores profesionales, con honorarios cerrados y transparentes.',
                'url': 'https://www.autoridad.legal',
                'telephone': PHONE_E164,
                'email': 'contacto@autoridad.legal',
                'image': 'https://www.autoridad.legal/images/logo-transparent.png',
                'logo': 'https://www.autoridad.legal/images/logo-transparent.png',
                'priceRange': '€€',
                'knowsLanguage': ['es', 'ca'],
                'address': {
                    '@type': 'PostalAddress',
                    'streetAddress': 'Avenida Diagonal 437, Principal 3ª',
                    'postalCode': '08036',
                    'addressLocality': 'Barcelona',
                    'addressRegion': 'Cataluña',
                    'addressCountry': 'ES'
                },
                'areaServed': {
                    '@type': 'AdministrativeArea',
                    'name': 'Provincia de Barcelona'
                },
                'contactPoint': [{
                    '@type': 'ContactPoint',
                    '@id': 'https://www.autoridad.legal/#emergency-contact',
                    'telephone': PHONE_E164,
                    'contactType': 'emergency',
                    'availableLanguage': ['es', 'ca'],
                    'areaServed': 'ES-B',
                    'hoursAvailable': {
                        '@type': 'OpeningHoursSpecification',
                        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        'opens': '00:00',
                        'closes': '23:59'
                    }
                }],
                'founder': {
                    '@id': 'https://www.gimenezolavarriaga.abogado/#person'
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
                    'https://www.wikidata.org/wiki/Q19842607',
                    'https://www.wikidata.org/wiki/Q3602521',
                    'https://www.wikidata.org/wiki/Q150342'
                ],
                'hasOfferCatalog': {
                    '@type': 'OfferCatalog',
                    'name': 'Servicios de Defensa Penal en Delitos contra la Seguridad Vial',
                    'itemListElement': [
                        {
                            '@type': 'Offer',
                            'name': 'Defensa por Alcoholemia',
                            'url': 'https://www.autoridad.legal/alcoholemia',
                            'availability': 'https://schema.org/InStock',
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'minPrice': '980.00',
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'itemOffered': {
                                '@type': 'Service',
                                'name': 'Defensa penal por alcoholemia',
                                'serviceType': 'Defensa penal por conducción bajo influencia de alcohol',
                                'url': 'https://www.autoridad.legal/alcoholemia'
                            },
                            'description': 'Precio base cerrado desde 980 € (IVA y procurador incluidos). Puede incrementarse según las circunstancias del caso, siempre comunicado por escrito y por adelantado.'
                        },
                        {
                            '@type': 'Offer',
                            'name': 'Defensa por Drogas al Volante',
                            'url': 'https://www.autoridad.legal/drogas',
                            'availability': 'https://schema.org/InStock',
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'minPrice': '980.00',
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'itemOffered': {
                                '@type': 'Service',
                                'name': 'Defensa penal por drogas al volante',
                                'serviceType': 'Defensa penal por conducción bajo influencia de drogas',
                                'url': 'https://www.autoridad.legal/drogas'
                            },
                            'description': 'Precio base cerrado desde 980 € (IVA y procurador incluidos). Puede incrementarse según las circunstancias del caso, siempre comunicado por escrito y por adelantado.'
                        },
                        {
                            '@type': 'Offer',
                            'name': 'Defensa por Exceso de Velocidad',
                            'url': 'https://www.autoridad.legal/velocidad',
                            'availability': 'https://schema.org/InStock',
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'minPrice': '980.00',
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'itemOffered': {
                                '@type': 'Service',
                                'name': 'Defensa penal por exceso de velocidad',
                                'serviceType': 'Defensa penal por delito de exceso de velocidad',
                                'url': 'https://www.autoridad.legal/velocidad'
                            },
                            'description': 'Precio base cerrado desde 980 € (IVA y procurador incluidos). Puede incrementarse según las circunstancias del caso, siempre comunicado por escrito y por adelantado.'
                        },
                        {
                            '@type': 'Offer',
                            'name': 'Defensa por Conducir Sin Carné',
                            'url': 'https://www.autoridad.legal/sin-carnet',
                            'availability': 'https://schema.org/InStock',
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'minPrice': '980.00',
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'itemOffered': {
                                '@type': 'Service',
                                'name': 'Defensa penal por conducción sin permiso',
                                'serviceType': 'Defensa penal por conducción sin permiso o licencia',
                                'url': 'https://www.autoridad.legal/sin-carnet'
                            },
                            'description': 'Precio base cerrado desde 980 € (IVA y procurador incluidos). Puede incrementarse según las circunstancias del caso, siempre comunicado por escrito y por adelantado.'
                        },
                        {
                            '@type': 'Offer',
                            'name': 'Defensa para Conductores Profesionales',
                            'url': 'https://www.autoridad.legal/profesionales',
                            'availability': 'https://schema.org/InStock',
                            'priceSpecification': {
                                '@type': 'PriceSpecification',
                                'minPrice': '1080.00',
                                'priceCurrency': 'EUR',
                                'valueAddedTaxIncluded': true
                            },
                            'itemOffered': {
                                '@type': 'Service',
                                'name': 'Defensa penal para conductores profesionales',
                                'serviceType': 'Defensa penal de tráfico para titulares de permisos profesionales (C, D, E)',
                                'url': 'https://www.autoridad.legal/profesionales'
                            },
                            'description': 'Precio base cerrado desde 1.080 € (IVA y procurador incluidos). Puede incrementarse según las circunstancias del caso, siempre comunicado por escrito y por adelantado.'
                        }
                    ]
                },
                'openingHoursSpecification': [{
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    'opens': '00:00',
                    'closes': '23:59'
                }],
                'sameAs': [
                    'https://www.linkedin.com/company/135936660/',
                    'https://www.facebook.com/profile.php?id=61591553736969',
                    'https://www.instagram.com/autoridad.legal/',
                    'https://x.com/AutoridadLegal_',
                    'https://www.youtube.com/@Autoridad_Legal'
                ]
            },
            {
                '@type': 'Person',
                '@id': 'https://www.gimenezolavarriaga.abogado/#person',
                'name': 'Santiago Giménez Olavarriaga',
                'givenName': 'Santiago',
                'familyName': 'Giménez Olavarriaga',
                'description': 'Abogado penalista ejerciente colegiado en el Ilustre Colegio de la Abogacía de Barcelona (ICAB nº 31389), especializado en la defensa de delitos contra la seguridad vial en la provincia de Barcelona.',
                'jobTitle': 'Director Jurídico y Abogado Penalista Ejerciente',
                'image': 'https://xiqfcritzjabiunfwksn.supabase.co/storage/v1/object/public/images/SantiagoGimenezOlavarriaga.jpeg',
                'url': 'https://www.gimenezolavarriaga.abogado',
                'email': 'santiago@gimenezolavarriaga.abogado',
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
                    'Negativa a someterse a las pruebas',
                    'Conducción bajo la influencia de drogas',
                    'Exceso de velocidad como delito',
                    'Conducción sin permiso',
                    'Derecho penal',
                    'https://www.wikidata.org/wiki/Q19842607',
                    'https://www.wikidata.org/wiki/Q3602521',
                    'https://www.wikidata.org/wiki/Q150342'
                ],
                'sameAs': [
                    'https://www.linkedin.com/in/santiagogimenezolavarriaga/',
                    'https://www.facebook.com/santiago.gimenez.olavarriaga',
                    'https://www.instagram.com/santiago.gimenez.abogado/',
                    'https://x.com/santiagogolavar',
                    'https://www.youtube.com/@SantiagoGiménezOlavarriaga',
                    'https://www.icab.es/es/colegio/miembros/index.html?id=31389'
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideGraph) }}
        />
    );
}
