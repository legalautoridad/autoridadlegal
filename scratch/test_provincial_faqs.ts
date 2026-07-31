import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createStaticClient } from '../src/lib/supabase/server';

function localizeProvincialFaqText(text: string): string {
    if (!text) return '';

    let result = text
        // Specific phrase replacements to preserve natural Spanish grammar
        .replace(/Juzgado de Guardia de tu municipio/gi, 'Juzgado de Guardia de su partido judicial')
        .replace(/juzgado competente de tu municipio/gi, 'el juzgado competente')
        .replace(/en el partido judicial de tu municipio/gi, 'en su partido judicial')
        .replace(/en el partido judicial en Cataluña/gi, 'en su partido judicial')
        .replace(/el hospital de tu municipio/gi, 'un hospital de Cataluña')
        .replace(/el hospital en Cataluña/gi, 'un hospital de Cataluña')
        .replace(/de urgencias en Cataluña/gi, 'de urgencias')
        .replace(/en tu municipio/gi, 'en Cataluña')
        .replace(/\s+de tu municipio/gi, ' en Cataluña')
        .replace(/tu municipio/gi, 'Cataluña')
        .replace(/\bX\s*mg\/l\b/gi, '0,60 mg/l o más');

    // Grammar & Duplication Cleanup Rules
    result = result
        // Rule 1: "al el" -> "al"
        .replace(/\bal\s+el\b/gi, 'al')
        // Rule 2: "del el" -> "del"
        .replace(/\bdel\s+el\b/gi, 'del')
        // Rule 3: "ante el el" -> "ante el"
        .replace(/\bante\s+el\s+el\b/gi, 'ante el')
        // Collapsing duplicated prepositions
        .replace(/\ben Cataluña\s+en Cataluña\b/gi, 'en Cataluña')
        .replace(/\bde Cataluña\s+de Cataluña\b/gi, 'de Cataluña')
        .replace(/\ben su partido judicial\s+en Cataluña\b/gi, 'en su partido judicial')
        .replace(/\bde su partido judicial\s+en Cataluña\b/gi, 'de su partido judicial')
        .replace(/\bel\s+el\b/gi, 'el')
        .replace(/\s+/g, ' ')
        .trim();

    // Rule 4: Capitalize first letter if needed
    if (result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
}

async function test() {
    const supabase = createStaticClient();
    const services = ['alcoholemia', 'drogas', 'sin-carnet', 'velocidad', 'profesionales'];

    for (const service of services) {
        const norm = service === 'sin-carnet' ? 'sin_carnet' : service;
        const { data: faqs } = await supabase
            .from('service_faqs')
            .select('question, answer')
            .or(`service_slug.eq.${service},service_slug.eq.${norm}`)
            .order('position', { ascending: true });

        console.log(`\n=== SERVICIO: ${service} (Total FAQs: ${faqs?.length || 0}) ===`);
        
        let errors = 0;
        faqs?.forEach((f, idx) => {
            const locQ = localizeProvincialFaqText(f.question);
            const locA = localizeProvincialFaqText(f.answer);

            // Check for artifacts
            if (/\bal\s+el\b/i.test(locQ) || /\bal\s+el\b/i.test(locA)) {
                console.error(`❌ "al el" en FAQ #${idx + 1}`);
                errors++;
            }
            if (/\bdel\s+el\b/i.test(locQ) || /\bdel\s+el\b/i.test(locA)) {
                console.error(`❌ "del el" en FAQ #${idx + 1}`);
                errors++;
            }
            if (/\ben Cataluña\s+en Cataluña\b/i.test(locQ) || /\ben Cataluña\s+en Cataluña\b/i.test(locA)) {
                console.error(`❌ "en Cataluña en Cataluña" en FAQ #${idx + 1}`);
                errors++;
            }
            if (/^[a-z]/[Symbol.match](locQ) || /^[a-z]/[Symbol.match](locA)) {
                console.error(`❌ Minúscula al inicio en FAQ #${idx + 1}`);
                errors++;
            }

            if (idx === 0 || idx === 6 || idx === 12) {
                console.log(`[FAQ #${idx + 1}] Q: ${locQ}`);
                console.log(`[FAQ #${idx + 1}] A: ${locA.slice(0, 140)}...`);
            }
        });

        if (errors === 0) {
            console.log(`✅ ${service}: 0 errores gramaticales o artefactos.`);
        }
    }
}

test();
