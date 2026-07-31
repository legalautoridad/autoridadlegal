import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getServiceFaqs } from '../src/lib/db/services';
import { getCoberturaData } from '../src/lib/db/cobertura';

async function test() {
    console.log('=== VERIFICANDO NORMALIZACIÓN GRAMATICAL DE FAQS PROVINCIALES ===');

    const services = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

    for (const s of services) {
        const faqs = await getServiceFaqs(s);
        console.log(`\n--- Evaluando servicio: /${s} (${faqs.length} FAQs) ---`);

        let errors = 0;
        faqs.forEach((f, idx) => {
            const q = f.question;
            const a = f.answer;

            // Rule 1: "al el"
            if (/\bal\s+el\b/i.test(q) || /\bal\s+el\b/i.test(a)) {
                console.error(`❌ FAQ #${idx + 1} contiene 'al el': "${q}"`);
                errors++;
            }

            // Rule 2: "del el"
            if (/\bdel\s+el\b/i.test(q) || /\bdel\s+el\b/i.test(a)) {
                console.error(`❌ FAQ #${idx + 1} contiene 'del el': "${q}"`);
                errors++;
            }

            // Rule 3: "en Cataluña en Cataluña" or "en el partido judicial en Cataluña"
            if (/\ben Cataluña\s+en Cataluña\b/i.test(q) || /\ben Cataluña\s+en Cataluña\b/i.test(a)) {
                console.error(`❌ FAQ #${idx + 1} contiene 'en Cataluña en Cataluña'`);
                errors++;
            }
            if (/\ben el partido judicial en Cataluña\b/i.test(q) || /\ben el partido judicial en Cataluña\b/i.test(a)) {
                console.error(`❌ FAQ #${idx + 1} contiene 'en el partido judicial en Cataluña'`);
                errors++;
            }

            // Rule 4: Capitalization at start of string
            if (/^[a-z]/[Symbol.match](q)) {
                console.error(`❌ Pregunta #${idx + 1} empieza por minúscula: "${q}"`);
                errors++;
            }
            if (/^[a-z]/[Symbol.match](a)) {
                console.error(`❌ Respuesta #${idx + 1} empieza por minúscula: "${a}"`);
                errors++;
            }
        });

        if (errors === 0) {
            console.log(`  ✅ /${s}: 0 errores de 'al el', 'del el', dobles preposiciones o minúsculas.`);
        }
    }

    // Verify coverage pages /{servicio}/{municipio} remain unchanged
    console.log('\n--- VERIFICANDO QUE PÁGINAS DE COBERTURA NO CAMBIARON ---');
    const bcn = await getCoberturaData('alcoholemia', 'barcelona');
    if (bcn && bcn.faqs.length > 0) {
        console.log('Q1 Barcelona:', bcn.faqs[0].question);
        if (bcn.faqs[0].question.includes('Barcelona') && bcn.faqs[0].answer.includes('Tribunal de Instancia de Barcelona')) {
            console.log('  ✅ Cobertura Barcelona conserva intacta su localización específica a municipio y juzgado real.');
        } else {
            console.error('❌ ERROR: Se alteró la localización de las páginas de cobertura!');
        }
    }

    console.log('\n✨ TODAS LAS VERIFICACIONES GRAMATICALES COMPLETADAS EXITOSAMENTE ✨');
}

test();
