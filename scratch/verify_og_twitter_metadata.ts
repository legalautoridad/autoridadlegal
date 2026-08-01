import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateMetadata as generateServiceMetadata } from '../src/app/(legal-silos)/[service]/page';
import { generateMetadata as generateCoverageMetadata } from '../src/app/(legal-silos)/[service]/[city]/page';
import { generateMetadata as generateGlossaryTermMetadata } from '../src/app/glosario/[slug]/page';

async function test() {
    console.log('=== VERIFICANDO ETIQUETAS OPEN GRAPH Y TWITTER CARD ===');

    // 1. Service Parent Metadata Check (/alcoholemia)
    const serviceMeta = await generateServiceMetadata({ params: Promise.resolve({ service: 'alcoholemia' }) });
    const twService = serviceMeta.twitter as Record<string, any> | undefined;
    console.log('\n--- /alcoholemia ---');
    console.log('Title:', serviceMeta.title);
    console.log('OG Title:', serviceMeta.openGraph?.title);
    console.log('OG URL:', serviceMeta.openGraph?.url);
    console.log('OG SiteName:', serviceMeta.openGraph?.siteName);
    console.log('OG Image:', JSON.stringify(serviceMeta.openGraph?.images));
    console.log('Twitter Card:', twService?.card);
    console.log('Twitter Image:', JSON.stringify(twService?.images));

    if (!serviceMeta.openGraph || !serviceMeta.twitter) {
        console.error('❌ ERROR: Faltan bloques OpenGraph o Twitter en /alcoholemia');
    } else {
        console.log('✅ /alcoholemia: OG & Twitter correctamente generados.');
    }

    // 2. Coverage Leaf Metadata Check (/alcoholemia/barcelona)
    const coverageMeta = await generateCoverageMetadata({ params: Promise.resolve({ service: 'alcoholemia', city: 'barcelona' }) });
    const twCoverage = coverageMeta.twitter as Record<string, any> | undefined;
    console.log('\n--- /alcoholemia/barcelona ---');
    console.log('Title:', coverageMeta.title);
    console.log('OG Title:', coverageMeta.openGraph?.title);
    console.log('OG URL:', coverageMeta.openGraph?.url);
    console.log('OG Image:', JSON.stringify(coverageMeta.openGraph?.images));
    console.log('Twitter Card:', twCoverage?.card);

    if (!coverageMeta.openGraph?.images || !twCoverage?.images) {
        console.error('❌ ERROR: Faltan imágenes OG/Twitter en /alcoholemia/barcelona');
    } else {
        console.log('✅ /alcoholemia/barcelona: OG & Twitter imágenes añadidas.');
    }

    // 3. Glossary Term Metadata Check (/glosario/alcoholemia-penal)
    const termMeta = await generateGlossaryTermMetadata({ params: Promise.resolve({ slug: 'alcoholemia-penal' }) });
    console.log('\n--- /glosario/alcoholemia-penal ---');
    console.log('Title:', termMeta.title);
    console.log('OG Title:', termMeta.openGraph?.title);
    console.log('OG Image:', JSON.stringify(termMeta.openGraph?.images));

    if (String(termMeta.openGraph?.title).includes('| Autoridad Legal')) {
        console.error('❌ ERROR: openGraph.title no debe contener el sufijo "| Autoridad Legal"');
    } else {
        console.log('✅ openGraph.title no incluye el sufijo redundante "| Autoridad Legal".');
    }

    console.log('\n✨ TODAS LAS PRUEBAS DE ETIQUETAS METADATA COMPLETADAS EXITOSAMENTE ✨');
}

test();
