import { PHONE_E164 } from '@/lib/config';

export interface SchemaParams {
    baseUrl?: string;
    service: string;
    city: string;
    cityName: string;
    specialtyName: string;
    courtName?: string;
    courtAddress?: string;
    faqs?: { question: string; answer: string }[];
    videoUrl?: string;
    videoName?: string;
    videoDescription?: string;
}

export interface SchemaGenerator {
    generate(params: SchemaParams): Record<string, any>;
}

// 1. Concrete Generator for LegalService (Local Business specialization)
class LegalServiceGenerator implements SchemaGenerator {
    generate(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const pageUrl = `${base}/${params.service}/${params.city}`;
        
        return {
            "@type": "LegalService",
            "@id": `${pageUrl}#legal-service`,
            "name": `Autoridad Legal - Abogados ${params.specialtyName} ${params.cityName}`,
            "description": `Defensa penal y asistencia urgente en ${params.cityName} por delitos de ${params.specialtyName}. Director jurídico: Santiago Giménez Olavarriaga.`,
            "url": pageUrl,
            "telephone": PHONE_E164,
            "priceRange": "€€€",
            "image": "https://www.autoridad.legal/public/images/logo.png",
            "provider": {
                "@type": "Person",
                "@id": `${base}/#attorney`
            },
            "areaServed": {
                "@type": "City",
                "name": params.cityName
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": params.cityName,
                "addressRegion": "Barcelona",
                "addressCountry": "ES"
            }
        };
    }
}

// 2. Concrete Generator for Attorney Person
class AttorneyGenerator implements SchemaGenerator {
    generate(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        
        return {
            "@type": "Person",
            "@id": `${base}/#attorney`,
            "name": "Santiago Giménez Olavarriaga",
            "jobTitle": "Abogado de Defensa Penal y Seguridad Vial",
            "worksFor": {
                "@type": "Organization",
                "name": "Autoridad Legal",
                "url": base
            },
            "memberOf": {
                "@type": "Organization",
                "name": "Ilustre Colegio de la Abogacía de Barcelona (ICAB)",
                "url": "https://www.icab.es"
            },
            "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Universidad de Barcelona"
            }
        };
    }
}

// 3. Concrete Generator for Courthouse (Government Building)
class CourthouseGenerator implements SchemaGenerator {
    generate(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const pageUrl = `${base}/${params.service}/${params.city}`;
        
        if (!params.courtName) {
            return {};
        }

        return {
            "@type": "GovernmentBuilding",
            "@id": `${pageUrl}#courthouse`,
            "name": params.courtName,
            "address": params.courtAddress ? {
                "@type": "PostalAddress",
                "streetAddress": params.courtAddress,
                "addressLocality": params.cityName,
                "addressCountry": "ES"
            } : undefined
        };
    }
}

// 4. Concrete Generator for FAQPage
class FAQPageGenerator implements SchemaGenerator {
    generate(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const pageUrl = `${base}/${params.service}/${params.city}`;
        
        if (!params.faqs || params.faqs.length === 0) {
            return {};
        }

        return {
            "@type": "FAQPage",
            "@id": `${pageUrl}#faq`,
            "mainEntity": params.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    }
}

// 5. Concrete Generator for VideoObject (Interactive video guides)
class VideoObjectGenerator implements SchemaGenerator {
    generate(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const pageUrl = `${base}/${params.service}/${params.city}`;
        
        const videoUrl = params.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Placeholder/Fallback
        const name = params.videoName || `Guía de Juicios Rápidos en ${params.cityName}`;
        const desc = params.videoDescription || `Video guía explicativa de asistencia por alcoholemia en ${params.cityName}.`;

        return {
            "@type": "VideoObject",
            "@id": `${pageUrl}#video`,
            "name": name,
            "description": desc,
            "thumbnailUrl": "https://www.autoridad.legal/images/video-thumbnail.jpg",
            "uploadDate": "2026-01-08T08:00:00+01:00",
            "contentUrl": videoUrl,
            "embedUrl": videoUrl.replace("watch?v=", "embed/")
        };
    }
}

// Factory Class implementing GoF Factory Method pattern
export class SchemaFactory {
    private static generators: Record<string, SchemaGenerator> = {
        "legalservice": new LegalServiceGenerator(),
        "attorney": new AttorneyGenerator(),
        "courthouse": new CourthouseGenerator(),
        "faqpage": new FAQPageGenerator(),
        "videoobject": new VideoObjectGenerator()
    };

    /**
     * Factory Method to generate a single schema object
     */
    public static createSchema(type: "legalservice" | "attorney" | "courthouse" | "faqpage" | "videoobject", params: SchemaParams): Record<string, any> {
        const generator = this.generators[type];
        if (!generator) {
            throw new Error(`Schema generator of type "${type}" is not registered.`);
        }
        return generator.generate(params);
    }

    /**
     * High-level helper to generate the entire interconnected SEO Graph of entities
     */
    public static generateEntityGraph(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const pageUrl = `${base}/${params.service}/${params.city}`;

        const graph: any[] = [];

        // 1. Generate LegalService
        const legalService = this.createSchema("legalservice", params);
        
        // 2. Generate Attorney (Santiago Giménez Olavarriaga)
        const attorney = this.createSchema("attorney", params);
        
        // 3. Generate Courthouse link
        const courthouse = this.createSchema("courthouse", params);
        
        // 4. Generate FAQ page schema
        const faqPage = this.createSchema("faqpage", params);

        // 5. Generate Video object schema
        const videoObject = this.createSchema("videoobject", params);

        // Build relationships
        if (courthouse && Object.keys(courthouse).length > 0) {
            // Link LegalService to specific local courthouse location/jurisdiction
            legalService.location = {
                "@type": "Place",
                "@id": `${pageUrl}#courthouse`
            };
            graph.push(courthouse);
        }

        // Link FAQPage & VideoObject context
        if (faqPage && Object.keys(faqPage).length > 0) {
            legalService.subjectOf = legalService.subjectOf || [];
            legalService.subjectOf.push({
                "@type": "FAQPage",
                "@id": `${pageUrl}#faq`
            });
            graph.push(faqPage);
        }

        if (videoObject && Object.keys(videoObject).length > 0) {
            legalService.subjectOf = legalService.subjectOf || [];
            legalService.subjectOf.push({
                "@type": "VideoObject",
                "@id": `${pageUrl}#video`
            });
            graph.push(videoObject);
        }

        graph.push(legalService);
        graph.push(attorney);

        return {
            "@context": "https://schema.org",
            "@graph": graph
        };
    }

    /**
     * Helper to generate specialized nested JSON-LD for emergency landing pages
     */
    public static generateEmergencyGraph(params: SchemaParams): Record<string, any> {
        const base = params.baseUrl || "https://www.autoridad.legal";
        const city = params.city;
        
        const servicesList = [
            { id: "alcoholemia", name: "Defensa Penal por Alcoholemia" },
            { id: "drogas", name: "Defensa Penal por Conducir bajo Efecto de Drogas" },
            { id: "sin-carnet", name: "Defensa Penal por Conducir Sin Carnet o Sin Puntos" },
            { id: "velocidad", name: "Defensa Penal por Exceso de Velocidad y Radares" },
            { id: "profesionales", name: "Defensa Penal para Conductores Profesionales" }
        ];

        const offerCatalog = {
            "@type": "OfferCatalog",
            "name": "Servicios de Urgencia Penal",
            "itemListElement": servicesList.map((srv, idx) => ({
                "@type": "Offer",
                "position": idx + 1,
                "itemOffered": {
                    "@type": "Service",
                    "name": srv.name,
                    "url": `${base}/${srv.id}/${city}`
                }
            }))
        };

        const founder = {
            "@type": "Person",
            "name": "Santiago Giménez Olavarriaga",
            "jobTitle": "Director Jurídico y Abogado Penalista",
            "sameAs": [
                "https://www.linkedin.com/in/santiago-gimenez-olavarriaga",
                "https://www.abogacia.es"
            ]
        };

        const legalService = {
            "@type": "LegalService",
            "@id": `${base}/${params.service}/${city}#legal-service`,
            "name": `Autoridad Legal - Abogado ${params.specialtyName} ${params.cityName}`,
            "description": `Defensa penal de guardia y asistencia 24h por delito de ${params.specialtyName} en ${params.cityName}.`,
            "url": `${base}/${params.service}/${city}`,
            "telephone": PHONE_E164,
            "priceRange": "980€–1480€",
            "image": "https://www.autoridad.legal/images/lawyer_video_thumbnail.png",
            "sameAs": [
                "https://www.linkedin.com/company/autoridad-legal/",
                "https://www.facebook.com/AutoridadLegal/",
                "https://www.instagram.com/autoridad.legal/",
                "https://x.com/AutoridadLegal_",
                "https://www.youtube.com/@Autoridad_Legal"
            ],
            "founder": founder,
            "hasOfferCatalog": offerCatalog,
            "areaServed": {
                "@type": "City",
                "name": params.cityName
            }
        };

        return {
            "@context": "https://schema.org",
            "@graph": [
                legalService
            ]
        };
    }
}
