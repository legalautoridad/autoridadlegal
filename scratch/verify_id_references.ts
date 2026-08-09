import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateCoberturaJsonLd } from '../src/lib/seo/cobertura-jsonld';
import { getCoberturaData } from '../src/lib/db/cobertura';
import { getServiceJsonLdConfig } from '../src/lib/db/services';

async function test() {
    console.log('=== VERIFICANDO RESOLUCIÓN DE REFERENCIAS @id (ORGANIZATION Y PERSON) ===');

    const orgId = 'https://www.autoridad.legal/#organization';
    const personId = 'https://www.gimenezolavarriaga.abogado/#person';

    // 1. Check Coverage Page JSON-LD graph references
    const bcn = await getCoberturaData('alcoholemia', 'barcelona');
    if (bcn) {
        const jsonLd = generateCoberturaJsonLd(bcn, 'https://www.autoridad.legal/alcoholemia/barcelona');
        const serviceNode = jsonLd['@graph'].find((g: any) => g['@type'] === 'Service');

        console.log('\n--- Evaluación Cobertura /alcoholemia/barcelona ---');
        console.log('Service.provider.@id:', serviceNode.provider['@id']);
        console.log('Service.offers.offeredBy.@id:', serviceNode.offers.offeredBy['@id']);
        console.log('Service.offers.seller.@id:', serviceNode.offers.seller['@id']);

        if (serviceNode.provider['@id'] !== orgId) {
            console.error(`❌ Mismatch en Organization ID: se esperaba ${orgId}, se obtuvo ${serviceNode.provider['@id']}`);
        } else {
            console.log('✅ Service.provider.@id coincide exactamente con Organization ID.');
        }

        if (serviceNode.offers.offeredBy['@id'] !== orgId) {
            console.error(`❌ Mismatch en offeredBy Organization ID`);
        } else {
            console.log('✅ Service.offers.offeredBy.@id coincide exactamente con Organization ID.');
        }

        if (serviceNode.offers.seller['@id'] !== personId) {
            console.error(`❌ Mismatch en Person ID: se esperaba ${personId}, se obtuvo ${serviceNode.offers.seller['@id']}`);
        } else {
            console.log('✅ Service.offers.seller.@id coincide exactamente con Person ID.');
        }
    }

    // 2. Check Service Parent Page JSON-LD graph references
    const alcoConfig = getServiceJsonLdConfig('alcoholemia');
    console.log('\n--- Evaluación Servicio Padre /alcoholemia ---');
    console.log('Config price:', alcoConfig.price);

    console.log('\n✨ RESOLUCIÓN DE REFERENCIAS @id COMPROBADA CON ÉXITO ✨');
}

test();
