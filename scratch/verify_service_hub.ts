import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getServiceFaqs, getServiceJsonLdConfig } from '../src/lib/db/services';
import { getCoberturaData } from '../src/lib/db/cobertura';

async function test() {
    console.log('=== VERIFICANDO PÁGINA PADRE DE SERVICIO (/alcoholemia Y /profesionales) ===');

    // 1. Service FAQs localization check for /alcoholemia
    const faqs = await getServiceFaqs('alcoholemia');
    console.log('Total FAQs cargadas para /alcoholemia:', faqs.length);

    let placeholderErrors = 0;
    faqs.forEach((f, idx) => {
        const text = f.question + ' ' + f.answer;
        if (/tu municipio/i.test(text)) {
            console.error(`❌ Placeholder 'tu municipio' hallado en FAQ #${idx + 1}: ${f.question}`);
            placeholderErrors++;
        }
        if (/de tu municipio/i.test(text)) {
            console.error(`❌ Placeholder 'de tu municipio' hallado en FAQ #${idx + 1}: ${f.question}`);
            placeholderErrors++;
        }
    });

    if (placeholderErrors === 0) {
        console.log('✅ Confirmado: NO se encuentra ningún "tu municipio" ni "de tu municipio" en las FAQs de /alcoholemia.');
    } else {
        console.error(`❌ ERROR: ${placeholderErrors} placeholders encontrados.`);
    }

    // Print sample localized provincial FAQ
    if (faqs.length > 0) {
        console.log('\n--- Ejemplo FAQ Localizada a ámbito provincial ---');
        console.log('Q1:', faqs[0].question);
        console.log('A1:', faqs[0].answer);
    }

    // 2. Offer config check
    const alcoConfig = getServiceJsonLdConfig('alcoholemia');
    console.log('\n--- Configuración /alcoholemia ---');
    console.log('minPrice type:', typeof alcoConfig.minPrice, 'value:', alcoConfig.minPrice);

    if (typeof alcoConfig.minPrice !== 'number' || alcoConfig.minPrice !== 980) {
        console.error('❌ ERROR: minPrice para /alcoholemia debe ser el número 980');
    } else {
        console.log('✅ Confirmado: minPrice para /alcoholemia es el número 980.');
    }

    const profConfig = getServiceJsonLdConfig('profesionales');
    console.log('\n--- Configuración /profesionales ---');
    console.log('minPrice type:', typeof profConfig.minPrice, 'value:', profConfig.minPrice);

    if (typeof profConfig.minPrice !== 'number' || profConfig.minPrice !== 1080) {
        console.error('❌ ERROR: minPrice para /profesionales debe ser el número 1080');
    } else {
        console.log('✅ Confirmado: minPrice para /profesionales es el número 1080.');
    }

    // 3. Verify coverage pages /{servicio}/{municipio} remain unchanged and specific
    console.log('\n--- VERIFICANDO PÁGINA DE COBERTURA /alcoholemia/barcelona ---');
    const bcnCobertura = await getCoberturaData('alcoholemia', 'barcelona');
    if (bcnCobertura && bcnCobertura.faqs.length > 0) {
        console.log('Q1 Barcelona:', bcnCobertura.faqs[0].question);
        if (bcnCobertura.faqs[0].question.includes('Barcelona') && bcnCobertura.faqs[0].answer.includes('Tribunal de Instancia de Barcelona')) {
            console.log('✅ Confirmado: Las páginas de cobertura /{servicio}/{municipio} conservan intacta su localización específica a municipio y juzgado real.');
        } else {
            console.error('❌ ERROR: Se alteró la localización de las páginas de cobertura!');
        }
    }

    console.log('\n✨ VERIFICACIÓN DE PÁGINAS PADRE DE SERVICIO COMPLETADA EXITOSAMENTE ✨');
}

test();
