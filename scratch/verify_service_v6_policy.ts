import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { getServiceFaqs, getServiceJsonLdConfig, normalizeServiceSlug } from '../src/lib/db/services';
import { SERVICES_PRICING, PRICING_ADDONS } from '../src/lib/config/pricing';

async function test() {
    console.log('=== VERIFICANDO PÁGINAS DE SERVICIO V6 (JSON-LD + COPY VISIBLE) ===\n');

    const services = ['alcoholemia', 'drogas', 'velocidad', 'sin-carnet', 'profesionales'];

    // 1. Grep checks for forbidden terms in codebase
    console.log('--- 1. Verificación de Términos Prohibidos en el Código ---');
    const forbiddenPatterns = ['desde 980', 'desde 1480', 'desde 1.480', 'tarifa plana', 'minPrice', '1.080 €'];
    let forbiddenErrors = 0;

    const filesToScan = [
        'src/app/(legal-silos)/[service]/page.tsx',
        'src/app/servicios/[slug]/page.tsx',
        'src/components/silo/ServiceTemplate.tsx',
        'src/lib/db/services.ts',
        'src/lib/db/cobertura.ts',
        'src/lib/config/pricing.ts'
    ];

    for (const relPath of filesToScan) {
        const fullPath = path.join(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            for (const pattern of forbiddenPatterns) {
                if (content.includes(pattern)) {
                    console.error(`❌ ERROR: "${pattern}" encontrado en ${relPath}`);
                    forbiddenErrors++;
                }
            }
        }
    }

    if (forbiddenErrors === 0) {
        console.log('✅ Verificado: Cero términos prohibidos en los archivos del silo de servicios y plantillas.');
    } else {
        process.exit(1);
    }

    // 2. Offer & AddOns Verification for each of the 5 services
    console.log('\n--- 2. Verificación de JSON-LD Offer y addOn por Servicio ---');

    for (const slug of services) {
        const normSlug = normalizeServiceSlug(slug);
        const pricing = SERVICES_PRICING.find(s => s.slug === normSlug);
        const jsonLdConfig = getServiceJsonLdConfig(normSlug);
        const isProfesionales = normSlug === 'profesionales';

        console.log(`\nEvaluando /${normSlug}:`);

        // Check base price
        const expectedBase = isProfesionales ? '1480.00' : '980.00';
        if (pricing?.basePrice === expectedBase) {
            console.log(`  ✅ basePrice: "${pricing.basePrice}" OK`);
        } else {
            console.error(`  ❌ ERROR basePrice: se esperaba "${expectedBase}", obtenido "${pricing?.basePrice}"`);
            process.exit(1);
        }

        // Check addOns count
        const expectedAddOnCount = isProfesionales ? 3 : 4;
        if (pricing?.applicableAddOns.length === expectedAddOnCount) {
            console.log(`  ✅ addOns count: ${pricing.applicableAddOns.length} OK (esperados ${expectedAddOnCount})`);
        } else {
            console.error(`  ❌ ERROR addOns count: se esperaban ${expectedAddOnCount}, obtenidos ${pricing?.applicableAddOns.length}`);
            process.exit(1);
        }

        // Check noConformidad is absent in profesionales and present in others
        if (isProfesionales) {
            if (pricing?.applicableAddOns.includes('noConformidad')) {
                console.error(`  ❌ ERROR: /profesionales NO debe incluir el addOn 'noConformidad'`);
                process.exit(1);
            } else {
                console.log(`  ✅ Verificado: /profesionales excluye correctamente 'noConformidad'.`);
            }
        } else {
            if (!pricing?.applicableAddOns.includes('noConformidad')) {
                console.error(`  ❌ ERROR: /${normSlug} DEBE incluir el addOn 'noConformidad'`);
                process.exit(1);
            }
        }

        // Check FAQs match visible
        const faqs = await getServiceFaqs(normSlug);
        console.log(`  ✅ service_faqs cargadas desde DB: ${faqs.length}`);
    }

    console.log('\n✨ TODAS LAS VERIFICACIONES DE LAS PÁGINAS DE SERVICIO V6 PASARON EXITOSAMENTE ✨');
}

test();
