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
                'description': 'Despacho penalista especializado en delitos contra la seguridad vial en la provincia de Barcelona.',
                'url': 'https://www.autoridad.legal',
                'telephone': PHONE_E164,
                'email': 'contacto@autoridad.legal',
                'image': 'https://www.autoridad.legal/images/logo-transparent.png',
                'logo': 'https://www.autoridad.legal/images/logo-transparent.png',
                'priceRange': '€€',
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
                'founder': {
                    '@id': 'https://www.gimenezolavarriaga.abogado/#person'
                }
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
                }
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
