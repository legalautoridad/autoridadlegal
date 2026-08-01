import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { SILO_CONFIGS } from '../src/lib/silo-config';

async function test() {
    console.log('=== VERIFICANDO BANDA DE ESTADÍSTICAS (TRUST BAND STATS) ===');

    const expectedStats = [
        { label: "Precio Claro", value: "Cerrado" },
        { label: "Financiación Disponible", value: "Flexible" },
        { label: "Atención", value: "Inmediata" }
    ];

    let totalSilos = 0;
    let errors = 0;

    for (const [slug, config] of Object.entries(SILO_CONFIGS)) {
        totalSilos++;
        console.log(`\n--- Silo: /${slug} ---`);
        console.log('Stats:', JSON.stringify(config.stats));

        if (JSON.stringify(config.stats) !== JSON.stringify(expectedStats)) {
            console.error(`❌ ERROR en /${slug}: stats no coinciden con las 3 celdas esperadas`);
            errors++;
        } else {
            console.log(`✅ /${slug}: las 3 celdas coinciden exactamente con el nuevo estándar.`);
        }
    }

    if (errors === 0) {
        console.log(`\n✨ TODAS LAS ${totalSilos} CONFIGURACIONES DE SILO TIENEN LAS NUEVAS ESTADÍSTICAS CERRADO/FLEXIBLE/INMEDIATA ✨`);
    } else {
        console.error(`\n❌ ERROR: ${errors} silos fallaron la validación.`);
    }
}

test();
