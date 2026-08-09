import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { getCoberturaData } from '../src/lib/db/cobertura';
import { generateCoberturaJsonLd } from '../src/lib/seo/cobertura-jsonld';

async function test() {
    console.log('=== VERIFICANDO PÁGINAS DE MUNICIPIO V6 (JSON-LD + COPY VISIBLE) ===\n');

    // 1. Grep verification for forbidden expressions
    console.log('--- 1. Verificación Grep de expresiones prohibidas ---');

    const codeFiles = [
        'src/lib/seo/cobertura-jsonld.ts',
        'src/lib/db/cobertura.ts',
        'src/lib/strategies/barcelona-strategy.ts',
        'src/components/silo/DynamicCtaObserver.tsx',
        'src/lib/silo-config.ts',
        'src/app/(legal-silos)/[service]/[city]/page.tsx'
    ];

    let errors = 0;
    for (const file of codeFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('Garantizamos tu defensa')) {
                console.error(`❌ ERROR: "Garantizamos tu defensa" en ${file}`);
                errors++;
            }
            if (/\b\d+\.\d{2}\s*mg\/l\b/.test(content)) {
                console.error(`❌ ERROR: "N.NN mg/l" (separador punto) en ${file}`);
                errors++;
            }
        }
    }

    if (errors === 0) {
        console.log('✅ Grep OK: Cero expresiones "Garantizamos tu defensa" ni separadores con punto en tasas.');
    } else {
        process.exit(1);
    }

    // 2. Test JSON-LD generation for /alcoholemia/barcelona and /profesionales/barcelona
    console.log('\n--- 2. Verificación de JSON-LD en /alcoholemia/barcelona ---');
    const cobAlcoholemia = await getCoberturaData('alcoholemia', 'barcelona');
    if (!cobAlcoholemia) {
        console.error('❌ ERROR: No se obtuvieron datos para /alcoholemia/barcelona');
        process.exit(1);
    }

    const canonicalUrlAlco = 'https://www.autoridad.legal/alcoholemia/barcelona';
    const jsonLdAlco = generateCoberturaJsonLd(cobAlcoholemia, canonicalUrlAlco);

    const graphAlco = jsonLdAlco['@graph'];
    console.log(`✅ Nodos en @graph: ${graphAlco.length}`);

    // Check Service node
    const serviceNode = graphAlco.find((n: any) => n['@type'] === 'Service');
    if (!serviceNode) {
        console.error('❌ ERROR: No se encontró el nodo Service');
        process.exit(1);
    }

    const offer = serviceNode.offers;
    if (!offer || offer.priceSpecification.price !== '980.00') {
        console.error(`❌ ERROR: Offer price se esperaba "980.00", obtenido "${offer?.priceSpecification?.price}"`);
        process.exit(1);
    }

    if (!Array.isArray(offer.addOn) || offer.addOn.length !== 4) {
        console.error(`❌ ERROR: Se esperaban 4 addOns en /alcoholemia/barcelona, obtenidos ${offer?.addOn?.length}`);
        process.exit(1);
    }

    console.log(`✅ basePrice: "${offer.priceSpecification.price}" OK`);
    console.log(`✅ addOns count: ${offer.addOn.length} OK (4 recargos)`);
    console.log(`✅ offeredBy: "${offer.offeredBy['@id']}" OK`);
    console.log(`✅ seller: "${offer.seller['@id']}" OK`);
    console.log(`✅ provider: "${serviceNode.provider['@id']}" OK`);

    // Check /profesionales/barcelona
    console.log('\n--- 3. Verificación de JSON-LD en /profesionales/barcelona ---');
    const cobProf = await getCoberturaData('profesionales', 'barcelona');
    if (cobProf) {
        const canonicalUrlProf = 'https://www.autoridad.legal/profesionales/barcelona';
        const jsonLdProf = generateCoberturaJsonLd(cobProf, canonicalUrlProf);
        const graphProf = jsonLdProf['@graph'];
        const serviceProf = graphProf.find((n: any) => n['@type'] === 'Service');
        const offerProf = serviceProf.offers;

        if (offerProf.priceSpecification.price !== '1480.00') {
            console.error(`❌ ERROR: /profesionales price se esperaba "1480.00", obtenido "${offerProf.priceSpecification.price}"`);
            process.exit(1);
        }

        if (!Array.isArray(offerProf.addOn) || offerProf.addOn.length !== 3) {
            console.error(`❌ ERROR: Se esperaban 3 addOns en /profesionales/barcelona, obtenidos ${offerProf?.addOn?.length}`);
            process.exit(1);
        }

        const hasNoConformidad = offerProf.addOn.some((a: any) => a.name.includes('No Conformidad'));
        if (hasNoConformidad) {
            console.error('❌ ERROR: /profesionales NO debe incluir el recargo No Conformidad');
            process.exit(1);
        }

        console.log(`✅ basePrice /profesionales: "${offerProf.priceSpecification.price}" OK`);
        console.log(`✅ addOns count /profesionales: ${offerProf.addOn.length} OK (3 recargos, exento de No Conformidad)`);
    }

    console.log('\n✨ TODAS LAS VERIFICACIONES DE PÁGINAS DE MUNICIPIO PASARON CON ÉXITO ✨');
}

test();
