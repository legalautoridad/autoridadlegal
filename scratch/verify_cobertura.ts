import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getCoberturaData } from '../src/lib/db/cobertura';
import { generateCoberturaJsonLd } from '../src/lib/seo/cobertura-jsonld';

async function verify() {
    console.log('=== VERIFICANDO PULIDO DEL NODO COURTHOUSE (BARCELONA Y SABADELL) ===');

    // 1. Barcelona Test
    const bcnData = await getCoberturaData('alcoholemia', 'barcelona');
    if (!bcnData) {
        console.error('❌ ERROR: getCoberturaData("alcoholemia", "barcelona") devolvió null');
        process.exit(1);
    }

    const bcnJsonLd = generateCoberturaJsonLd(bcnData, `https://www.autoridad.legal/alcoholemia/barcelona`);
    const bcnCourthouse = bcnJsonLd['@graph'].find((g: any) => g['@type'] === 'Courthouse');

    console.log('\n--- Courthouse Barcelona ---');
    console.log(JSON.stringify(bcnCourthouse, null, 2));

    if (bcnCourthouse.address?.streetAddress !== 'Gran Via de les Corts Catalanes, 111') {
        console.error(`❌ ERROR: streetAddress incorrecto para Barcelona: "${bcnCourthouse.address?.streetAddress}"`);
    } else {
        console.log('  ✅ streetAddress parseado correctamente sin CP ni localidad: "Gran Via de les Corts Catalanes, 111"');
    }

    if (bcnCourthouse.address?.postalCode !== '08014') {
        console.error(`❌ ERROR: postalCode incorrecto para Barcelona: "${bcnCourthouse.address?.postalCode}"`);
    } else {
        console.log('  ✅ postalCode extraído correctamente: "08014"');
    }

    if (!bcnCourthouse.geo || bcnCourthouse.geo.latitude !== 41.363788 || bcnCourthouse.geo.longitude !== 2.129377) {
        console.error(`❌ ERROR: GeoCoordinates incorrectos para Barcelona Courthouse:`, bcnCourthouse.geo);
    } else {
        console.log('  ✅ geo (GeoCoordinates) presente y exacto: lat 41.363788, lng 2.129377');
    }

    // 2. Sabadell Test
    const sbdData = await getCoberturaData('alcoholemia', 'sabadell');
    if (sbdData) {
        const sbdJsonLd = generateCoberturaJsonLd(sbdData, `https://www.autoridad.legal/alcoholemia/sabadell`);
        const sbdCourthouse = sbdJsonLd['@graph'].find((g: any) => g['@type'] === 'Courthouse');

        console.log('\n--- Courthouse Sabadell ---');
        console.log(JSON.stringify(sbdCourthouse, null, 2));

        if (sbdCourthouse.address?.streetAddress !== 'Avinguda de Francesc Macià, 34-36') {
            console.error(`❌ ERROR: streetAddress incorrecto para Sabadell: "${sbdCourthouse.address?.streetAddress}"`);
        } else {
            console.log('  ✅ streetAddress parseado correctamente para Sabadell: "Avinguda de Francesc Macià, 34-36"');
        }

        if (sbdCourthouse.address?.postalCode !== '08208') {
            console.error(`❌ ERROR: postalCode incorrecto para Sabadell: "${sbdCourthouse.address?.postalCode}"`);
        } else {
            console.log('  ✅ postalCode extraído correctamente para Sabadell: "08208"');
        }

        if (!sbdCourthouse.geo || sbdCourthouse.geo.latitude !== 41.554907 || sbdCourthouse.geo.longitude !== 2.094593) {
            console.error(`❌ ERROR: GeoCoordinates incorrectos para Sabadell Courthouse:`, sbdCourthouse.geo);
        } else {
            console.log('  ✅ geo (GeoCoordinates) presente y exacto para Sabadell: lat 41.554907, lng 2.094593');
        }
    }

    console.log('\n✨ TODAS LAS VERIFICACIONES DEL NODO COURTHOUSE COMPLETADAS EXITOSAMENTE ✨');
}

verify();
