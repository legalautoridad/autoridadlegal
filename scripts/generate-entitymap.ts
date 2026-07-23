import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { getLocations } from '../src/lib/db/locations';
import { getAllGlosarioTerms } from '../src/lib/db/glosario';
import { DefenseStrategySelector } from '../src/lib/strategies/strategy-selector';

async function generateEntityMap() {
    console.log('🚀 Generating Entity Map (entitymap.json & entitymap.html)...');

    const locations = await getLocations();
    const glossaryTerms = await getAllGlosarioTerms();
    const baseUrl = 'https://autoridadlegal.com';

    const services = [
        { id: 'alcoholemia', name: 'Delito de Alcoholemia y Juicio Rápido', description: 'Defensa penal urgente por alcoholemia positiva al volante.' },
        { id: 'drogas', name: 'Delito por Drogas al Volante', description: 'Impugnación de atestados toxicológicos y tests de saliva.' },
        { id: 'sin-carnet', name: 'Conducción Sin Carnet o Sin Puntos', description: 'Defensa por quebrantamiento de condena o pérdida total de puntos.' },
        { id: 'velocidad', name: 'Delito por Exceso de Velocidad', description: 'Defensa penal por radares y margen de error metrológico.' },
        { id: 'profesionales', name: 'Defensa para Conductores Profesionales', description: 'Protección de carnet para taxistas, transportistas y repartidores.' }
    ];

    // Extract unique courts
    const courtMap = new Map<string, { id: string; name: string; address?: string; phone?: string; municipalities: string[] }>();

    locations.forEach(loc => {
        const courtName = loc.courts?.name || 'Juzgado de Guardia de la Jurisdicción';
        const courtAddress = loc.courts?.address || undefined;
        const courtPhone = loc.courts?.phone || undefined;

        if (!courtMap.has(courtName)) {
            courtMap.set(courtName, {
                id: loc.court_id || courtName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                name: courtName,
                address: courtAddress,
                phone: courtPhone,
                municipalities: []
            });
        }
        courtMap.get(courtName)!.municipalities.push(loc.name);
    });

    const courts = Array.from(courtMap.values());

    // 1. Build entitymap.json
    const entityMapJson = {
        "$schema": "https://schema.org",
        "version": "1.1.0",
        "generatedAt": new Date().toISOString(),
        "organization": {
            "@type": "LegalService",
            "name": "Autoridad Legal",
            "legalName": "Autoridad Legal Servicios Jurídicos Penalistas",
            "url": baseUrl,
            "logo": `${baseUrl}/images/logo-transparent.png`,
            "telephone": "+34605118871",
            "email": "contacto@autoridadlegal.com",
            "areaServed": "Cataluña, España",
            "priceRange": "980€",
            "director": {
                "@type": "Person",
                "name": "Santiago Giménez Olavarriaga",
                "role": "Director Jurídico y Abogado Penalista",
                "collegiateNumber": "ICAB 31.389",
                "college": "Ilustre Colegio de la Abogacía de Barcelona (ICAB)",
                "url": `${baseUrl}/abogados/santiago-gimenez-olavarriaga`
            },
            "pricingTerms": {
                "amount": 980,
                "currency": "EUR",
                "taxIncluded": true,
                "procuratorIncluded": true,
                "paymentModel": "Custodia Segura (Escrow)",
                "financing": "Financiación hasta 12 meses"
            }
        },
        "services": services.map(s => ({
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "url": `${baseUrl}/${s.id}`
        })),
        "definedTermsCount": glossaryTerms.length,
        "definedTerms": glossaryTerms.map(t => ({
            "name": t.name,
            "description": t.description,
            "slug": t.slug,
            "htmlUrl": `${baseUrl}/glosario/${t.slug}`,
            "rawMarkdownUrl": `${baseUrl}/glosario/${t.slug}.md`
        })),
        "courts": courts,
        "municipalitiesCount": locations.length,
        "municipalities": locations.map(loc => {
            const strategy = DefenseStrategySelector.getStrategy(loc.slug);
            return {
                "name": loc.name,
                "slug": loc.slug,
                "zone": loc.zone || 'Cataluña',
                "courtName": loc.courts?.name || null,
                "courtAddress": loc.courts?.address || null,
                "quirks": strategy.getLocalPoliceQuirks(),
                "courthouseTips": strategy.getCourthouseTips(),
                "urls": services.reduce((acc, srv) => {
                    acc[srv.id] = `${baseUrl}/${srv.id}/${loc.slug}`;
                    return acc;
                }, {} as Record<string, string>)
            };
        })
    };

    // 2. Build entitymap.html
    const entityMapHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entity Map & Knowledge Graph | Autoridad Legal</title>
    <meta name="description" content="Mapa de Entidades, Glosario, Jurisdicciones y Cobertura Jurídica de Autoridad Legal en Cataluña. Red de defensa penal urgente por alcoholemia y juicios rápidos.">
    <link rel="canonical" href="${baseUrl}/entitymap.html">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; }
        .gold-border { border-color: #c5a059; }
        .gold-text { color: #c5a059; }
        .gold-bg { background-color: #c5a059; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-10 space-y-12">

    <!-- Header Section -->
    <header class="max-w-7xl mx-auto border-b border-white/10 pb-8 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    GEO & RAG Ground Truth Schema
                </span>
                <h1 class="text-3xl md:text-5xl font-black text-white mt-2">
                    Mapa de Entidades y Cobertura Legal (Entity Map)
                </h1>
                <p class="text-slate-400 text-sm md:text-base max-w-3xl mt-1">
                    Estructura jerárquica de conocimiento sobre Autoridad Legal, conceptos jurídicos, órganos judiciales, municipios y especialidades penales de guardia en Cataluña.
                </p>
            </div>
            <div class="flex items-center gap-3">
                <a href="/entitymap.json" target="_blank" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-2">
                    <span>📄 Descargar JSON Schema</span>
                </a>
                <a href="/llms.txt" target="_blank" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-all flex items-center gap-2">
                    <span>🤖 Ver llms.txt</span>
                </a>
            </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
            <div class="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <span class="text-xs uppercase font-bold text-slate-400">Entidad Principal</span>
                <p class="text-lg font-extrabold text-white mt-1">Autoridad Legal</p>
                <p class="text-[11px] text-amber-400 mt-0.5">ICAB 31.389 (Santiago Giménez)</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <span class="text-xs uppercase font-bold text-slate-400">Términos del Glosario</span>
                <p class="text-2xl font-black text-amber-400 mt-1">${glossaryTerms.length}</p>
                <p class="text-[11px] text-slate-400">Conceptos en Supabase</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <span class="text-xs uppercase font-bold text-slate-400">Municipios Cubiertos</span>
                <p class="text-2xl font-black text-amber-400 mt-1">${locations.length}</p>
                <p class="text-[11px] text-slate-400">Localidades en Cataluña</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <span class="text-xs uppercase font-bold text-slate-400">Partidos Judiciales</span>
                <p class="text-2xl font-black text-emerald-400 mt-1">${courts.length}</p>
                <p class="text-[11px] text-slate-400">Órganos judiciales y Juzgados</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900 border border-white/10">
                <span class="text-xs uppercase font-bold text-slate-400">Especialidades Penales</span>
                <p class="text-2xl font-black text-blue-400 mt-1">${services.length}</p>
                <p class="text-[11px] text-slate-400">Silos de defensa 24h</p>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto space-y-12">

        <!-- Core Entity Information -->
        <section class="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-6">
            <h2 class="text-xl md:text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                🏛️ Entidad Organización &amp; Dirección Jurídica
            </h2>
            <div class="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                <div class="space-y-3 bg-slate-950 p-5 rounded-2xl border border-white/5">
                    <p class="text-white font-bold">Autoridad Legal (Plataforma Jurídica Especializada)</p>
                    <ul class="space-y-1.5 text-xs text-slate-300">
                        <li><strong>Especialidad:</strong> Juicios Rápidos, Alcoholemia, Drogas al Volante y Seguridad Vial</li>
                        <li><strong>Ámbito Geográfico:</strong> Barcelona y toda Cataluña</li>
                        <li><strong>Teléfono Guardia 24h:</strong> <a href="tel:+34605118871" class="text-amber-400 underline">+34 605 118 871</a></li>
                        <li><strong>Tarifa Plana Cerrada:</strong> 980 € (IVA y Procurador incluidos)</li>
                        <li><strong>Garantía:</strong> Custodia Segura del pago (Escrow)</li>
                    </ul>
                </div>
                <div class="space-y-3 bg-slate-950 p-5 rounded-2xl border border-white/5">
                    <p class="text-white font-bold">Director Jurídico (Persona / Abogado)</p>
                    <ul class="space-y-1.5 text-xs text-slate-300">
                        <li><strong>Nombre:</strong> Santiago Giménez Olavarriaga</li>
                        <li><strong>Colegiado:</strong> ICAB 31.389 (Ilustre Colegio de la Abogacía de Barcelona)</li>
                        <li><strong>Cargo:</strong> Abogado Penalista y Director de Estrategia de Defensa</li>
                        <li><strong>Sede Principal:</strong> Barcelona, España</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Glossary Entities -->
        <section class="space-y-6">
            <h2 class="text-xl md:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3 flex items-center justify-between">
                <span>📖 Glosario de Entidades Jurídicas (${glossaryTerms.length})</span>
                <a href="/glosario" class="text-xs text-amber-400 hover:underline font-normal">Ver Glosario completo &rarr;</a>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                ${glossaryTerms.map(t => `
                    <div class="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                        <h4 class="font-bold text-white text-sm">${t.name}</h4>
                        <p class="text-slate-400 text-xs line-clamp-2">${t.description}</p>
                        <div class="flex items-center gap-3 pt-2 text-[11px]">
                            <a href="/glosario/${t.slug}" class="text-amber-400 hover:underline font-mono">HTML</a>
                            <a href="/glosario/${t.slug}.md" target="_blank" class="text-slate-400 hover:text-white font-mono">Raw .md</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Services Hierarchy -->
        <section class="space-y-4">
            <h2 class="text-xl md:text-2xl font-bold text-white border-l-4 border-blue-500 pl-3">
                ⚖️ Servicios y Silos Penales Especializados
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${services.map(s => `
                    <div class="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2 hover:border-blue-500/50 transition-all">
                        <h3 class="font-bold text-white text-base">${s.name}</h3>
                        <p class="text-slate-400 text-xs">${s.description}</p>
                        <a href="/${s.id}" class="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 font-semibold pt-2">
                            Ver Silo Legal &rarr;
                        </a>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Judicial Districts & Courts Map -->
        <section class="space-y-6">
            <h2 class="text-xl md:text-2xl font-bold text-white border-l-4 border-emerald-500 pl-3">
                🏢 Partidos Judiciales y Órganos Competentes
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${courts.map(c => `
                    <div class="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                        <div class="space-y-1">
                            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400">Partido Judicial</span>
                            <h3 class="font-bold text-white text-base">${c.name}</h3>
                            ${c.address ? `<p class="text-xs text-slate-400">📍 ${c.address}</p>` : ''}
                        </div>
                        <div class="pt-2 border-t border-white/5 space-y-1">
                            <p class="text-[11px] font-bold text-slate-400 uppercase">Municipios adscritos (${c.municipalities.length}):</p>
                            <div class="flex flex-wrap gap-1">
                                ${c.municipalities.map(m => `
                                    <span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-white/5">${m}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Complete Municipalities Index -->
        <section class="space-y-6">
            <h2 class="text-xl md:text-2xl font-bold text-white border-l-4 border-amber-500 pl-3">
                📍 Directorio Completo de Municipios (${locations.length})
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                ${locations.map(loc => `
                    <div class="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 hover:border-amber-500/40 transition-all">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-white text-sm">${loc.name}</h4>
                            <span class="text-[10px] text-slate-400 uppercase font-mono">${loc.slug}</span>
                        </div>
                        <p class="text-[11px] text-amber-400/90 truncate">
                            🏛️ ${loc.courts?.name || 'Juzgado Competente'}
                        </p>
                        <div class="pt-2 flex flex-wrap gap-1 text-[10px]">
                            <a href="/alcoholemia/${loc.slug}" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Alcoholemia</a>
                            <a href="/drogas/${loc.slug}" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Drogas</a>
                            <a href="/sin-carnet/${loc.slug}" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">Sin Carnet</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="max-w-7xl mx-auto border-t border-white/10 pt-8 text-center text-xs text-slate-400 space-y-2">
        <p>&copy; ${new Date().getFullYear()} Autoridad Legal. Director Jurídico: Santiago Giménez Olavarriaga (ICAB 31.389).</p>
        <p>Documentación generada automáticamente para Motores de Búsqueda, Modelos de Lenguaje (LLM) y Arquitecturas RAG GEO.</p>
    </footer>

    <!-- JSON-LD Entity Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(entityMapJson, null, 2)}
    </script>

</body>
</html>`;

    // Paths
    const publicJsonPath = path.join(__dirname, '../public/entitymap.json');
    const publicHtmlPath = path.join(__dirname, '../public/entitymap.html');
    const rootJsonPath = path.join(__dirname, '../entitymap.json');
    const rootHtmlPath = path.join(__dirname, '../entitymap.html');

    fs.writeFileSync(publicJsonPath, JSON.stringify(entityMapJson, null, 2), 'utf-8');
    fs.writeFileSync(publicHtmlPath, entityMapHtml, 'utf-8');
    fs.writeFileSync(rootJsonPath, JSON.stringify(entityMapJson, null, 2), 'utf-8');
    fs.writeFileSync(rootHtmlPath, entityMapHtml, 'utf-8');

    console.log(`✅ Entity Map generated successfully:`);
    console.log(`   - ${publicJsonPath}`);
    console.log(`   - ${publicHtmlPath}`);
    console.log(`   - ${rootJsonPath}`);
    console.log(`   - ${rootHtmlPath}`);
}

generateEntityMap().catch(err => {
    console.error('❌ Error generating Entity Map:', err);
    process.exit(1);
});
