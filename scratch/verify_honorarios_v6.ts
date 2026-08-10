import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { getHonorariosPageJsonLd } from '../src/lib/seo/home-jsonld';

async function test() {
    console.log('=== VERIFICANDO PÁGINA /honorarios Y REDIRECCIÓN 301 (CANON V6) ===\n');

    // 1. Grep verification for forbidden expressions on /honorarios
    console.log('--- 1. Verificación Grep de términos prohibidos en /honorarios ---');
    const honorariosFile = path.join(process.cwd(), 'src/app/honorarios/page.tsx');
    const content = fs.readFileSync(honorariosFile, 'utf-8');

    const forbiddenTerms = [
        'desde ',
        'tarifa plana',
        'garantizamos',
        'minPrice',
        'Suplemento profesional',
        '200€ por impago',
        '300€ por impago',
        '200 € por impago',
        '300 € por impago'
    ];

    let forbiddenErrors = 0;
    for (const term of forbiddenTerms) {
        if (content.toLowerCase().includes(term.toLowerCase())) {
            console.error(`❌ ERROR: Término prohibido "${term}" encontrado en /honorarios/page.tsx`);
            forbiddenErrors++;
        }
    }

    if (forbiddenErrors === 0) {
        console.log('✅ Grep OK: Cero términos prohibidos en /honorarios/page.tsx.');
    } else {
        process.exit(1);
    }

    // 2. JSON-LD Verification
    console.log('\n--- 2. Verificación de JSON-LD de /honorarios ---');
    const jsonLd = getHonorariosPageJsonLd();
    const graph = jsonLd['@graph'];

    console.log(`✅ Nodos en @graph: ${graph.length}`);

    const webpageNode = graph.find((n: any) => n['@type'] === 'WebPage');
    if (!webpageNode || webpageNode['@id'] !== 'https://www.autoridad.legal/honorarios#webpage') {
        console.error('❌ ERROR: Nodo WebPage no válido en JSON-LD');
        process.exit(1);
    }
    console.log('✅ WebPage @id: "https://www.autoridad.legal/honorarios#webpage" OK');
    console.log(`✅ WebPage about: "${(webpageNode as any)?.about?.['@id']}" OK`);
    console.log(`✅ WebPage publisher: "${(webpageNode as any)?.publisher?.['@id']}" OK`);
    console.log(`✅ WebPage mainEntity: "${(webpageNode as any)?.mainEntity?.['@id']}" OK`);

    const breadcrumbNode = graph.find((n: any) => n['@type'] === 'BreadcrumbList');
    if (!breadcrumbNode || (breadcrumbNode as any)?.itemListElement?.length !== 2) {
        console.error('❌ ERROR: BreadcrumbList no válido');
        process.exit(1);
    }
    console.log('✅ BreadcrumbList: Inicio -> Honorarios OK');

    const catalogNode = graph.find((n: any) => n['@type'] === 'OfferCatalog');
    if (!catalogNode || catalogNode['@id'] !== 'https://www.autoridad.legal/#honorarios') {
        console.error('❌ ERROR: OfferCatalog no tiene @id "https://www.autoridad.legal/#honorarios"');
        process.exit(1);
    }
    console.log('✅ OfferCatalog @id: "https://www.autoridad.legal/#honorarios" OK');
    console.log(`✅ Ítems en OfferCatalog: ${(catalogNode as any)?.itemListElement?.length}`);

    // Check base prices in catalog
    const alcoOffer: any = (catalogNode as any)?.itemListElement?.find((i: any) => i.url.includes('/alcoholemia'));
    if (alcoOffer?.priceSpecification?.price !== '980.00') {
        console.error(`❌ ERROR: Precio alcoholemia se esperaba "980.00", obtenido "${alcoOffer?.priceSpecification?.price}"`);
        process.exit(1);
    }

    const profOffer: any = (catalogNode as any)?.itemListElement?.find((i: any) => i.url.includes('/profesionales'));
    if (profOffer?.priceSpecification?.price !== '1480.00') {
        console.error(`❌ ERROR: Precio profesionales se esperaba "1480.00", obtenido "${profOffer?.priceSpecification?.price}"`);
        process.exit(1);
    }

    console.log('✅ Precios base del catálogo: Alcoholemia 980.00 € / Profesionales 1480.00 € OK');

    console.log('\n✨ TODAS LAS VERIFICACIONES DE /honorarios PASARON CON ÉXITO ✨');
}

test();
