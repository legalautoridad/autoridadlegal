import { headers } from 'next/headers';
import { getSitewideJsonLdV6 } from '@/lib/seo/home-jsonld';
import { getHomepageFaqs } from '@/lib/db/homepage-faqs';

export async function SitewideJsonLd() {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const isHome = pathname === '/' || pathname === '';

    const homepageFaqs = isHome ? await getHomepageFaqs() : undefined;
    const sitewideGraph = getSitewideJsonLdV6(homepageFaqs);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideGraph) }}
        />
    );
}
