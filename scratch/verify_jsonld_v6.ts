import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { getSitewideJsonLdV6 } from '../src/lib/seo/home-jsonld';

async function test() {
    console.log('=== VERIFICANDO IMPLEMENTACIÓN DE JSON-LD HOME V6 ===\n');

    // 1. Load canonical json-ld-autoridad-legal-v6.json
    const jsonPath = path.join('/Users/domingoimperatori/Documents/data/json-ld-autoridad-legal-v6.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('❌ ERROR: No se encuentra json-ld-autoridad-legal-v6.json en la ruta esperada');
        process.exit(1);
    }
    const expectedJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // 2. Generate actual JSON-LD from server helper
    const actualJson = getSitewideJsonLdV6();

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

    // 5. Structure & Equality Check
    if (expectedStr === actualStr) {
        console.log('\n✅ ÉXITO TOTAL: El JSON-LD generado coincide CARÁCTER POR CARÁCTER con json-ld-autoridad-legal-v6.json!');
    } else {
        console.error('\n❌ ERROR: Hay diferencias entre el JSON-LD generado y json-ld-autoridad-legal-v6.json');
        process.exit(1);
    }

    // 6. Check homepage page.tsx for forbidden terms
    const homePath = path.join(process.cwd(), 'src/app/(home)/page.tsx');
    const homeContent = fs.readFileSync(homePath, 'utf-8');

    if (homeContent.includes('minPrice') || homeContent.includes('tarifa plana') || homeContent.includes('desde 980')) {
        console.error('❌ ERROR: El archivo src/app/(home)/page.tsx aún contiene términos obsoletos (minPrice / tarifa plana / desde 980)!');
        process.exit(1);
    } else {
        console.log('✅ Verificado: src/app/(home)/page.tsx limpio de minPrice, tarifa plana y desde 980.');
    }

    if (forbiddenFound === 0 && expectedStr === actualStr) {
        console.log('\n✨ TODAS LAS VERIFICACIONES DE JSON-LD V6 PASARON CORRECTAMENTE ✨');
    } else {
        process.exit(1);
    }
}

test();
