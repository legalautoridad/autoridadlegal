import Script from 'next/script';

type SchemaType = 'LegalService' | 'Article' | 'FAQPage' | 'Service' | 'Person';

interface SchemaOrgProps {
    type: SchemaType;
    data: Record<string, any>;
}

export function SchemaOrg({ type, data }: SchemaOrgProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return (
        <Script
            id={`schema-${type.toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
