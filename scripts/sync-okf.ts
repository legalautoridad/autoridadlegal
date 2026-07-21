import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { parseOKFCobertura, parsePuntosDeInteres, parseFrontmatter, OKFCobertura, PuntoDeInteres } from '../src/lib/okf/parser';
import { OKFGitHubClient } from '../src/lib/okf/github-client';

// Load .env.local environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function syncOKF() {
    console.log('🚀 Starting OKF Data Ingestion & Sync from GitHub...');

    const client = new OKFGitHubClient();
    const isLocal = client.hasLocalRepository();

    if (isLocal) {
        console.log('📦 Local OKF repository detected at /Users/domingoimperatori/Documents/OKF_AL');
    } else {
        console.log('🌐 Fetching OKF repository from GitHub API using Personal Access Token...');
    }

    const outputDir = path.join(__dirname, '../src/content/okf');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Fetch & parse Coberturas
    console.log('📄 Syncing servicios/cobertura files...');
    const coberturaFiles = await client.listDirectory('servicios/cobertura');
    const mdFiles = coberturaFiles.filter(f => f.endsWith('.md') && f !== 'index.md');

    console.log(`Found ${mdFiles.length} cobertura markdown files in OKF bundle.`);

    const coberturasList: OKFCobertura[] = [];
    const faqsMap: Record<string, { question: string; answer: string }[]> = {};

    let processedCount = 0;
    for (const fileName of mdFiles) {
        try {
            const rawContent = await client.getFileContent(`servicios/cobertura/${fileName}`);
            const parsed = parseOKFCobertura(rawContent);

            if (parsed.frontmatter.service && parsed.frontmatter.municipio) {
                coberturasList.push(parsed);

                const key = `${parsed.frontmatter.service}:${parsed.frontmatter.municipio}`;
                if (parsed.faqs.length > 0) {
                    faqsMap[key] = parsed.faqs;
                }
            }
            processedCount++;
            if (processedCount % 100 === 0 || processedCount === mdFiles.length) {
                console.log(`  Processed ${processedCount}/${mdFiles.length} coberturas...`);
            }
        } catch (err: any) {
            console.error(`❌ Error parsing ${fileName}:`, err.message);
        }
    }

    // 2. Fetch & parse Geografia / Municipios (Puntos de Interés)
    console.log('📍 Syncing geografia/municipios files for Puntos de Interés...');
    const municipiosMap: Record<string, { title: string; puntos_de_interes: PuntoDeInteres[] }> = {};

    try {
        const municipioFiles = await client.listDirectory('geografia/municipios');
        const munMdFiles = municipioFiles.filter(f => f.endsWith('.md') && f !== 'index.md');

        console.log(`Found ${munMdFiles.length} municipio markdown files.`);

        for (const fileName of munMdFiles) {
            try {
                const rawContent = await client.getFileContent(`geografia/municipios/${fileName}`);
                const { data } = parseFrontmatter(rawContent);
                const slug = data.slug || fileName.replace('.md', '');
                const title = data.title || slug;
                const puntos = parsePuntosDeInteres(rawContent);

                municipiosMap[slug] = {
                    title,
                    puntos_de_interes: puntos,
                };
            } catch (e: any) {
                console.error(`❌ Error parsing municipio ${fileName}:`, e.message);
            }
        }
    } catch (err: any) {
        console.error('⚠️ Could not list geografia/municipios:', err.message);
    }

    // Save compiled JSON artifacts
    const coberturasPath = path.join(outputDir, 'coberturas.json');
    fs.writeFileSync(coberturasPath, JSON.stringify(coberturasList, null, 2), 'utf-8');
    console.log(`✅ Saved ${coberturasList.length} coberturas to ${coberturasPath}`);

    const faqsPath = path.join(outputDir, 'faqs.json');
    fs.writeFileSync(faqsPath, JSON.stringify(faqsMap, null, 2), 'utf-8');
    console.log(`✅ Saved FAQs for ${Object.keys(faqsMap).length} service/municipality routes to ${faqsPath}`);

    const municipiosPath = path.join(outputDir, 'municipios.json');
    fs.writeFileSync(municipiosPath, JSON.stringify(municipiosMap, null, 2), 'utf-8');
    console.log(`✅ Saved Puntos de Interés for ${Object.keys(municipiosMap).length} municipalities to ${municipiosPath}`);

    // Summary metadata
    const summary = {
        total_coberturas: coberturasList.length,
        total_municipios: Object.keys(municipiosMap).length,
        services: Array.from(new Set(coberturasList.map(c => c.frontmatter.service))),
        municipios: Array.from(new Set(coberturasList.map(c => c.frontmatter.municipio))),
        last_synced_at: new Date().toISOString(),
    };

    const summaryPath = path.join(outputDir, 'summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

    console.log('\n🎉 OKF Sync completed successfully!');
    console.log(`Services found: ${summary.services.join(', ')}`);
    console.log(`Total Municipalities: ${summary.total_municipios}`);
}

syncOKF().catch(err => {
    console.error('💥 Fatal error during OKF sync:', err);
    process.exit(1);
});
