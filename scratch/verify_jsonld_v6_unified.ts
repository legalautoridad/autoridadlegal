import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { getSitewideJsonLdV6 } from '../src/lib/seo/home-jsonld';
import { getHomepageFaqs } from '../src/lib/db/homepage-faqs';

async function test() {
    console.log('=== VERIFICANDO IMPLEMENTACIÓN DE JSON-LD V6 UNIFICADO (3 NODOS) ===\n');

    // 1. Load canonical json-ld-autoridad-legal-v6-unified.json
    const jsonPath = path.join('/Users/domingoimperatori/Documents/data/json-ld-autoridad-legal-v6-unified.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('❌ ERROR: No se encuentra json-ld-autoridad-legal-v6-unified.json');
        process.exit(1);
    }
    const expectedJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // 2. Fetch FAQs from DB and generate actual JSON-LD
    const dbFaqs = await getHomepageFaqs();
    console.log('FAQs cargadas desde Supabase homepage_faqs:', dbFaqs.length);

    const actualJson = getSitewideJsonLdV6(dbFaqs);

    // 3. Stringify both for comparison
    const expectedStr = JSON.stringify(expectedJson);
    const actualStr = JSON.stringify(actualJson);

    // 4. Rule verification: NO minPrice, NO 'desde', NO 'tarifa plana', NO '1080'
    const forbiddenTerms = ['minPrice', 'desde', 'tarifa plana', 'tarifa fija inamovible', '1080.00'];
    let forbiddenFound = 0;

    forbiddenTerms.forEach(term => {
        if (actualStr.includes(term)) {
            console.error(`❌ ERROR: Se encontró el término prohibido "${term}" en el JSON-LD generado!`);
            forbiddenFound++;
        } else {
            console.log(`✅ Verificado: No contiene "${term}"`);
        }
    });

    // 5. Check 3 nodes in @graph
    const graphNodes = actualJson['@graph'];
    console.log('\nNodos en @graph:', graphNodes.length);
    if (graphNodes.length !== 3) {
        console.error(`❌ ERROR: Se esperaban 3 nodos en @graph, pero hay ${graphNodes.length}`);
        process.exit(1);
    } else {
        console.log('✅ Verificado: El @graph tiene exactamente 3 nodos (Organization, FAQPage, Person).');
    }

    // Check node types and @ids
    console.log('Nodo 0:', graphNodes[0]['@type'], '| @id:', graphNodes[0]['@id']);
    console.log('Nodo 1:', graphNodes[1]['@type'], '| @id:', graphNodes[1]['@id']);
    console.log('Nodo 2:', graphNodes[2]['@type'], '| @id:', graphNodes[2]['@id']);

    const faqNode = graphNodes[1];
    if (faqNode['@type'] === 'FAQPage' && faqNode['@id'] === 'https://www.autoridad.legal/#faq') {
        console.log('✅ Nodo 1 es el FAQPage con @id https://www.autoridad.legal/#faq');
    } else {
        console.error('❌ ERROR: El nodo 1 no es FAQPage o su @id es incorrecto');
        process.exit(1);
    }

    if (faqNode.mainEntity.length === 11) {
        console.log('✅ FAQPage contiene exactamente 11 Preguntas (mainEntity).');
    } else {
        console.error(`❌ ERROR: FAQPage contiene ${faqNode.mainEntity.length} preguntas, se esperaban 11`);
        process.exit(1);
    }

    // 6. Structure & Equality Check
    if (expectedStr === actualStr) {
        console.log('\n✅ ÉXITO TOTAL: El JSON-LD generado coincide CARÁCTER POR CARÁCTER con json-ld-autoridad-legal-v6-unified.json!');
    } else {
        console.error('\n❌ ERROR: Hay diferencias entre el JSON-LD generado y json-ld-autoridad-legal-v6-unified.json');
        
        for (let i = 0; i < Math.max(expectedStr.length, actualStr.length); i++) {
            if (expectedStr[i] !== actualStr[i]) {
                console.log(`Diff at char ${i}:`);
                console.log('Expected around:', expectedStr.substring(Math.max(0, i - 20), i + 40));
                console.log('Actual   around:', actualStr.substring(Math.max(0, i - 20), i + 40));
                break;
            }
        }
        process.exit(1);
    }

    // 7. Check homepage page.tsx has NO separate JSON-LD script
    const homePath = path.join(process.cwd(), 'src/app/(home)/page.tsx');
    const homeContent = fs.readFileSync(homePath, 'utf-8');

    if (homeContent.includes('application/ld+json')) {
        console.error('❌ ERROR: src/app/(home)/page.tsx aún contiene un bloque <script type="application/ld+json"> separado!');
        process.exit(1);
    } else {
        console.log('✅ Verificado: src/app/(home)/page.tsx ya NO contiene ningún <script type="application/ld+json"> separado.');
    }

    if (forbiddenFound === 0 && expectedStr === actualStr) {
        console.log('\n✨ TODAS LAS VERIFICACIONES DE JSON-LD V6 UNIFICADO PASARON CORRECTAMENTE ✨');
    } else {
        process.exit(1);
    }
}

test();
