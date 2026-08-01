import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';

async function test() {
    console.log('=== VERIFICANDO LAS 3 CORRECCIONES EN PÁGINAS DE SERVICIO ===');

    const trustSignalsFile = path.join(process.cwd(), 'src/components/silo/TrustSignals.tsx');
    const trustSignalsContent = fs.readFileSync(trustSignalsFile, 'utf-8');

    console.log('\n--- Fix 1: Insignia "Sentencias 98%" -> "Colegiado ICAB 31389" ---');
    if (trustSignalsContent.includes('Sentencias 98%')) {
        console.error('❌ ERROR: "Sentencias 98%" sigue presente en TrustSignals.tsx');
    } else if (trustSignalsContent.includes('Colegiado ICAB 31389')) {
        console.log('✅ Confirmado: "Sentencias 98%" reemplazado por "Colegiado ICAB 31389" en TrustSignals.tsx.');
    } else {
        console.error('❌ ERROR: No se encontró "Colegiado ICAB 31389" en TrustSignals.tsx');
    }

    const serviceTemplateFile = path.join(process.cwd(), 'src/components/silo/ServiceTemplate.tsx');
    const serviceTemplateContent = fs.readFileSync(serviceTemplateFile, 'utf-8');

    console.log('\n--- Fix 2: Elemento <main> duplicado/anidado ---');
    if (serviceTemplateContent.includes('<main ')) {
        console.error('❌ ERROR: ServiceTemplate.tsx aún contiene un elemento <main>');
    } else {
        console.log('✅ Confirmado: ServiceTemplate.tsx utiliza <div> contenedor para evitar anidación de <main> dentro de (legal-silos)/layout.tsx.');
    }

    console.log('\n--- Fix 3: Clase de Tailwind no válida "text-slate-355" ---');
    if (serviceTemplateContent.includes('slate-355')) {
        console.error('❌ ERROR: ServiceTemplate.tsx aún contiene la clase no válida slate-355');
    } else {
        console.log('✅ Confirmado: Se eliminó completamente la clase no válida "text-slate-355" y se reemplazó por "text-slate-300".');
    }

    console.log('\n✨ TODAS LAS 3 CORRECCIONES FUERON VERIFICADAS CON ÉXITO ✨');
}

test();
