import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getCoberturaData } from '../src/lib/db/cobertura';
import { generateCoberturaJsonLd } from '../src/lib/seo/cobertura-jsonld';
import { generateMetadata } from '../src/app/(legal-silos)/[service]/[city]/page';

async function test() {
    console.log('=== VERIFICANDO ALINEACIÓN FAQ VISIBLE Y METADATOS ===');

    const cobertura = await getCoberturaData('alcoholemia', 'barcelona');
    if (!cobertura) {
        console.error('❌ ERROR: getCoberturaData("alcoholemia", "barcelona") devolvió null');
        process.exit(1);
    }

    const metadata = await generateMetadata({ params: Promise.resolve({ service: 'alcoholemia', city: 'barcelona' }) });
    console.log('\n--- METADATOS GENERADOS ---');
    console.log('Title:', metadata.title);
    console.log('Description:', metadata.description);
    console.log('OG Description:', metadata.openGraph?.description);
    console.log('Twitter Description:', metadata.twitter?.description);

    if (JSON.stringify(metadata).includes('tarifa plana')) {
        console.error('❌ ERROR: "tarifa plana" detectado en metadatos!');
    } else {
        console.log('✅ Confirmado: "tarifa plana" NO aparece en metadatos (Title/Description/OG/Twitter).');
    }

    const jsonLd = generateCoberturaJsonLd(cobertura, `https://www.autoridad.legal/alcoholemia/barcelona`);
    const faqNode = jsonLd['@graph'].find((g: any) => g['@type'] === 'FAQPage');

    console.log('\n--- VERIFICACIÓN COINCIDENCIA DE FAQS ---');
    console.log('Total FAQs cargadas para renderizado visible:', cobertura.faqs.length);
    console.log('Total FAQs en JSON-LD FAQPage:', faqNode.mainEntity.length);

    let mismatches = 0;
    cobertura.faqs.forEach((faq, i) => {
        const jsonFaq = faqNode.mainEntity[i];
        if (faq.question !== jsonFaq.name || faq.answer !== jsonFaq.acceptedAnswer.text) {
            console.error(`❌ Mismatch en FAQ #${i + 1}`);
            mismatches++;
        }
    });

    if (mismatches === 0) {
        console.log('✅ Coincidencia 100% IDÉNTICA carácter por carácter entre FAQs visibles y JSON-LD.');
    } else {
        console.error(`❌ ERROR: ${mismatches} discrepancias encontradas.`);
    }

    // Comprobando que no aparezca "1.06 mg" ni "competente en Barcelona"
    const fullText = JSON.stringify(cobertura.faqs);
    if (fullText.includes('1.06 mg') || fullText.includes('competente en Barcelona')) {
        console.error('❌ ERROR: Texto spun antiguo detectado en las FAQs!');
    } else {
        console.log('✅ Confirmado: FAQs limpias de "1.06 mg" y "(competente en Barcelona)".');
    }

    console.log('\n✨ VERIFICACIÓN DE ALINEACIÓN COMPLETADA EXITOSAMENTE ✨');
}

test();
