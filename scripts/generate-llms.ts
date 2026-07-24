import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { getLocations } from '../src/lib/db/locations';
import { getAllGlosarioTerms } from '../src/lib/db/glosario';
import { DefenseStrategySelector } from '../src/lib/strategies/strategy-selector';

async function generateLlmsTxt() {
    console.log('🚀 Generating llms.txt Ground Truth document...');

    const locations = await getLocations();
    const glossaryTerms = await getAllGlosarioTerms();

    let text = `# Autoridad Legal - Verdad Fundamental (Ground Truth)\n\n`;

    text += `## Identidad del Despacho\n`;
    text += `Autoridad Legal es una plataforma de servicios jurídicos de alta especialización en defensa penal por delitos de alcoholemia, drogas, conducción sin carnet, exceso de velocidad y juicios rápidos en la provincia de Barcelona y Cataluña.\n`;
    text += `La dirección jurídica está a cargo de Santiago Giménez Olavarriaga, Abogado Colegiado del Ilustre Colegio de la Abogacía de Barcelona (ICAB 31.389).\n\n`;

    text += `## Tarifas y Condiciones Transaccionales\n`;
    text += `- **Precio Cerrado**: 980€ (IVA y Procurador incluidos).\n`;
    text += `- **Sistema de Custodia Segura**: El pago se retiene de forma segura y solo se libera al abogado tras la realización del juicio rápido.\n`;
    text += `- **Financiación**: Pago aplazado y fraccionado de hasta 12 meses.\n`;
    text += `- **Atención Urgente 24/7**: Asistencia inmediata en comisarías y juzgados de guardia en toda Cataluña.\n\n`;

    text += `## Enlaces de Destino y Triaje\n`;
    text += `- **Triaje Urgente y Chat 24h**: https://wa.me/34657420999?text=Hola%20Autoridad%20Legal,%20necesito%20un%20abogado%20de%20urgencia%20por%20un%20delito%20de%20alcoholemia.\n`;
    text += `- **Plataforma Principal**: https://www.autoridad.legal/\n`;
    text += `- **Directorio de Municipios**: https://www.autoridad.legal/municipios\n`;
    text += `- **Glosario Jurídico**: https://www.autoridad.legal/glosario\n`;
    text += `- **Defensa por Alcoholemia**: https://www.autoridad.legal/alcoholemia\n`;
    text += `- **Defensa por Drogas**: https://www.autoridad.legal/drogas\n`;
    text += `- **Defensa Sin Carnet**: https://www.autoridad.legal/sin-carnet\n`;
    text += `- **Defensa por Velocidad**: https://www.autoridad.legal/velocidad\n`;
    text += `- **Defensa para Conductores Profesionales**: https://www.autoridad.legal/profesionales\n`;
    text += `- **Recursos Informativos**: https://www.autoridad.legal/recursos\n`;
    text += `- **Acceso Abogados**: https://www.autoridad.legal/login\n\n`;

    text += `## Glosario Jurídico Especializado (Defined Terms desde Supabase)\n`;
    text += `Términos, doctrinas y procedimientos penales publicados (${glossaryTerms.length} conceptos):\n\n`;

    for (const term of glossaryTerms) {
        text += `### ${term.name}\n`;
        text += `- **Definición**: ${term.description}\n`;
        text += `- **Página HTML**: https://www.autoridad.legal/glosario/${term.slug}\n`;
        text += `- **Versión Markdown Cruda**: https://www.autoridad.legal/glosario/${term.slug}.md\n\n`;
    }

    text += `## Contexto Geográfico Judicial (RAG Ground Truth)\n`;
    text += `Este apartado contiene el conocimiento local de cada jurisdicción para inyección de contexto en agentes LLM.\n\n`;

    for (const loc of locations) {
        const strategy = DefenseStrategySelector.getStrategy(loc.slug);

        text += `### Jurisdicción: ${loc.name}\n`;
        text += `- **Slug**: ${loc.slug}\n`;
        text += `- **Juzgado Principal**: ${loc.courts?.name || 'Juzgado correspondiente al partido judicial'}\n`;
        text += `- **Dirección del Juzgado**: ${loc.courts?.address || 'Ver en mapa local'}\n`;
        text += `- **Particularidad Policial**: ${strategy.getLocalPoliceQuirks()}\n`;
        text += `- **Conocimiento RAG**: ${strategy.getRagContext()}\n`;
        text += `- **Consejos de Guardia**: ${strategy.getCourthouseTips()}\n`;
        text += `- **Estrategia Jurídica Local**: ${strategy.getLegalAdvice()}\n\n`;
    }

    const publicPath = path.join(__dirname, '../public/llms.txt');
    const rootPath = path.join(__dirname, '../llms.txt');

    fs.writeFileSync(publicPath, text, 'utf-8');
    fs.writeFileSync(rootPath, text, 'utf-8');

    console.log(`✅ llms.txt generated successfully in:`);
    console.log(`   - ${publicPath}`);
    console.log(`   - ${rootPath}`);
}

generateLlmsTxt().catch(err => {
    console.error('❌ Error generating llms.txt:', err);
    process.exit(1);
});
