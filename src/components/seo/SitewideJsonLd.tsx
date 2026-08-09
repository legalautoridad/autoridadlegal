import { getSitewideJsonLdV6 } from '@/lib/seo/home-jsonld';
import { getHomepageFaqs } from '@/lib/db/homepage-faqs';

export async function SitewideJsonLd() {
    const homepageFaqs = await getHomepageFaqs();
    const sitewideGraph = getSitewideJsonLdV6(homepageFaqs);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideGraph) }}
        />
    );
}
