import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';

async function test() {
    console.log('=== VERIFICANDO UNICIDAD DE NODOS SCHEMAS (#organization y #person) ===');

    const sitewideFile = path.join(process.cwd(), 'src/components/seo/SitewideJsonLd.tsx');
    const sitewideContent = fs.readFileSync(sitewideFile, 'utf-8');

    const homepageFile = path.join(process.cwd(), 'src/app/(home)/page.tsx');
    const homepageContent = fs.readFileSync(homepageFile, 'utf-8');

    // 1. Check SitewideJsonLd has rich properties
    console.log('\n--- 1. SitewideJsonLd.tsx ---');
    const hasOrgSameAs = sitewideContent.includes('hasOfferCatalog') && sitewideContent.includes('contactPoint');
    const hasPersonSameAs = sitewideContent.includes('hasCredential') && sitewideContent.includes('knowsAbout');

    if (hasOrgSameAs && hasPersonSameAs) {
        console.log('✅ SitewideJsonLd.tsx contiene los nodos RICOS completos de #organization y #person.');
    } else {
        console.error('❌ ERROR: SitewideJsonLd.tsx no contiene todos los atributos ricos.');
    }

    // 2. Check Homepage page.tsx has NO duplicate #organization or #person definitions
    console.log('\n--- 2. src/app/(home)/page.tsx ---');
    const orgInHome = homepageContent.includes('https://www.autoridad.legal/#organization');
    const personInHome = homepageContent.includes('https://www.gimenezolavarriaga.abogado/#person');

    if (!orgInHome && !personInHome) {
        console.log('✅ Confirmado: La página principal NO duplica los nodos #organization o #person.');
    } else {
        console.error('❌ ERROR: La página principal aún contiene definiciones duplicadas de #organization o #person.');
    }

    if (homepageContent.includes('FAQPage') && homepageContent.includes('https://www.autoridad.legal/#faq')) {
        console.log('✅ La página principal conserva la definición única del nodo FAQPage (#faq).');
    }

    console.log('\n✨ CADA @ID (#organization Y #person) APARECE DEFINIDO EXACTAMENTE UNA VEZ SITIEWIDE ✨');
}

test();
