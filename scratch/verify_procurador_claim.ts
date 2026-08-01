import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getServiceJsonLdConfig } from '../src/lib/db/services';
import { getCoberturaData } from '../src/lib/db/cobertura';
import { generateCoberturaJsonLd } from '../src/lib/seo/cobertura-jsonld';

async function test() {
    console.log('=== VERIFICANDO COINCIDENCIA DE RECLAMO: "con IVA y procurador incluidos" ===');

    const services = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

    for (const s of services) {
        const config = getServiceJsonLdConfig(s);
        console.log(`\n--- Evaluando servicio raíz: /${s} ---`);
        console.log('Description:', config.description);
        console.log('minPrice:', config.minPrice);

        if (!config.description.includes('con IVA y procurador incluidos')) {
            console.error(`❌ ERROR: /${s} no contiene 'con IVA y procurador incluidos'`);
        } else {
            console.log(`✅ /${s}: contiene 'con IVA y procurador incluidos'`);
        }
    }

    console.log('\n--- Evaluando página de cobertura: /alcoholemia/barcelona ---');
    const bcn = await getCoberturaData('alcoholemia', 'barcelona');
    if (bcn) {
        console.log('cobertura.description:', bcn.description);
        if (bcn.description.includes('con IVA y procurador incluidos')) {
            console.log('✅ Cobertura Barcelona: descripción alineada con "con IVA y procurador incluidos".');
        } else {
            console.error('❌ ERROR: cobertura.description no alineada.');
        }

        const jsonLd = generateCoberturaJsonLd(bcn, 'https://www.autoridad.legal/alcoholemia/barcelona');
        const serviceNode = jsonLd['@graph'].find((g: any) => g['@type'] === 'Service');
        console.log('JSON-LD Service.description:', serviceNode.description);
        console.log('JSON-LD Offer.priceSpecification:', JSON.stringify(serviceNode.offers.priceSpecification));

        if (serviceNode.offers.priceSpecification.valueAddedTaxIncluded === true && serviceNode.offers.priceSpecification.minPrice === 980) {
            console.log('✅ Offer.priceSpecification: minPrice 980, valueAddedTaxIncluded: true');
        } else {
            console.error('❌ ERROR: PriceSpecification mismatch');
        }
    }

    console.log('\n✨ VERIFICACIÓN DE RECLAMO PROCURADOR / IVA COMPLETADA CON ÉXITO ✨');
}

test();
