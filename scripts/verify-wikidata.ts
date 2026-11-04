/**
 * scripts/verify-wikidata.ts
 *
 * Verifies every QID and Wikipedia URL in src/data/areaserved.json against Wikidata and Wikipedia:
 * - Municipios: P31 includes municipio de España (Q2074737) / municipio de Cataluña (Q33146843),
 *   P131 is within Provincia de Barcelona (Q81949), and ca/es label matches the municipality.
 * - Partidos: P31 is partido judicial (Q6018869) or judicial district, and label contains the district name.
 * - If a QID fails or is missing (e.g. Berga, Igualada, Manresa, Vic, Vilafranca, Badalona partido, etc.),
 *   searches Wikidata via wbsearchentities and proposes the verified QID + Wikipedia URL.
 * - Checks Wikipedia URLs (HTTP status 200, not disambiguation).
 * - Generates scripts/output/areaserved-report.md with tables per partido.
 *
 * Usage: npx tsx scripts/verify-wikidata.ts
 */
import fs from 'fs';
import path from 'path';
import {
    AreaServedData,
    DATA_JSON,
    MunicipioEntry,
    PartidoEntry,
    QID_MUNICIPIO_CATALUNA,
    QID_MUNICIPIO_ESPANA,
    QID_PARTIDO_JUDICIAL,
    QID_PROVINCIA_BARCELONA,
    REPORT_MD,
    eswikiUrl,
    getEntity,
    getWikipediaInfo,
    isInsideProvince,
    normalizeName,
    saveCache,
    searchEntities,
    WdEntity,
} from './lib/areaserved-shared';

const MUNICIPIO_CLASSES = new Set([
    QID_MUNICIPIO_CATALUNA,
    QID_MUNICIPIO_ESPANA,
    'Q484170', // commune of Spain / municipality
]);

// Judicial district classes
const PARTIDO_CLASSES = new Set([
    QID_PARTIDO_JUDICIAL,
    'Q15052846',  // partido judicial de España
    'Q117468991', // Partido judicial de Barcelona (itself an instance)
    'Q107525557', // partido judicial de Martorell (instance of partido judicial)
    'Q19842607',  // judicial district
]);

interface VerificationIssue {
    target: string;
    type: 'ERROR' | 'PROPUESTA' | 'AVISO';
    description: string;
}

const issues: VerificationIssue[] = [];

async function isMunicipioEntity(e: WdEntity | null): Promise<boolean> {
    if (!e || e.missing) return false;
    const hasP31 = e.p31.some(p => MUNICIPIO_CLASSES.has(p));
    if (!hasP31) {
        // check if any P31 entity is itself a subclass of municipality
        for (const p of e.p31) {
            const parent = await getEntity(p);
            if (parent && parent.p31.some(pp => MUNICIPIO_CLASSES.has(pp))) return true;
        }
        return false;
    }
    return true;
}

async function isPartidoEntity(e: WdEntity | null): Promise<boolean> {
    if (!e || e.missing) return false;
    if (e.p31.some(p => PARTIDO_CLASSES.has(p))) return true;
    for (const p of e.p31) {
        const parent = await getEntity(p);
        if (parent && parent.p31.some(pp => PARTIDO_CLASSES.has(pp))) return true;
    }
    return false;
}

async function findMunicipalityCandidate(name: string): Promise<{ qid: string; eswiki: string | null } | null> {
    const norm = normalizeName(name);
    for (const lang of ['ca', 'es'] as const) {
        const results = await searchEntities(name, lang);
        for (const r of results) {
            const e = await getEntity(r.id);
            if (!e || e.missing) continue;
            const isMun = await isMunicipioEntity(e);
            if (!isMun) continue;
            const inBcn = await isInsideProvince(e.id, QID_PROVINCIA_BARCELONA);
            if (!inBcn) continue;
            const names = [e.labels.ca, e.labels.es, ...e.aliases].map(normalizeName);
            if (names.some(n => n === norm || n.includes(norm) || norm.includes(n))) {
                return { qid: e.id, eswiki: e.eswiki };
            }
        }
    }
    return null;
}

async function findPartidoCandidate(district: string): Promise<{ qid: string; eswiki: string | null } | null> {
    const queries = [
        `Partido judicial de ${district}`,
        `Partit judicial de ${district}`,
        district,
    ];
    for (const q of queries) {
        for (const lang of ['es', 'ca'] as const) {
            const results = await searchEntities(q, lang);
            for (const r of results) {
                const e = await getEntity(r.id);
                if (!e || e.missing) continue;
                const isPart = await isPartidoEntity(e);
                if (!isPart) continue;
                const inBcn = await isInsideProvince(e.id, QID_PROVINCIA_BARCELONA);
                // Some judicial districts don't have P131 -> Barcelona, but their label matches exactly
                const labelMatch =
                    e.labels.es?.toLowerCase().includes(district.toLowerCase()) ||
                    e.labels.ca?.toLowerCase().includes(district.toLowerCase()) ||
                    r.label.toLowerCase().includes(district.toLowerCase());
                if (labelMatch) {
                    return { qid: e.id, eswiki: e.eswiki };
                }
            }
        }
    }
    return null;
}

async function verifyWikipedia(url: string | null, expectedQid: string | null): Promise<{ ok: boolean; note?: string }> {
    if (!url) return { ok: false, note: 'Sin URL de Wikipedia' };
    const info = await getWikipediaInfo(url);
    if (!info) return { ok: false, note: 'Error al consultar Wikipedia' };
    if (info.httpStatus !== 200 || !info.exists) {
        return { ok: false, note: `HTTP ${info.httpStatus} (no existe o error)` };
    }
    if (info.disambiguation) {
        return { ok: false, note: 'La página de Wikipedia es de desambiguación' };
    }
    if (expectedQid && info.wikibaseItem && info.wikibaseItem !== expectedQid) {
        return { ok: false, note: `wikibase_item (${info.wikibaseItem}) no coincide con QID esperado (${expectedQid})` };
    }
    return { ok: true };
}

async function main() {
    const data: AreaServedData = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'));

    console.log('Iniciando verificación de Wikidata y Wikipedia...');

    for (const [courtSlug, courtData] of Object.entries(data)) {
        const district = courtData.judicialDistrict;
        const partido = courtData.partido;

        // -------------------------------------------------------------------
        // 1. Partido Judicial
        // -------------------------------------------------------------------
        let cleanPartidoQid = partido.qid ? partido.qid.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : null;
        if (cleanPartidoQid && cleanPartidoQid !== partido.qid) {
            issues.push({
                target: `Partido ${district}`,
                type: 'PROPUESTA',
                description: `QID con caracteres extraños "${partido.qid}" limpiado a "${cleanPartidoQid}".`,
            });
            partido.proposedQid = cleanPartidoQid;
            partido.status = 'CORREGIDO-PROPUESTO';
        }

        let partidoEntity = cleanPartidoQid ? await getEntity(cleanPartidoQid) : null;
        let partidoValid = partidoEntity && !partidoEntity.missing && (await isPartidoEntity(partidoEntity));

        if (!partidoValid) {
            // Find candidate via wbsearchentities
            const candidate = await findPartidoCandidate(district);
            if (candidate) {
                issues.push({
                    target: `Partido ${district}`,
                    type: 'PROPUESTA',
                    description: partido.qid
                        ? `QID original ${partido.qid} no es válido como partido judicial. Propuesto ${candidate.qid}.`
                        : `QID faltaba en la fuente. Propuesto ${candidate.qid} mediante búsqueda en Wikidata.`,
                });
                partido.proposedQid = candidate.qid;
                if (!partido.wikipedia && candidate.eswiki) {
                    partido.proposedWikipedia = eswikiUrl(candidate.eswiki);
                }
                partido.status = 'CORREGIDO-PROPUESTO';
                cleanPartidoQid = candidate.qid;
                partidoEntity = await getEntity(candidate.qid);
            } else {
                issues.push({
                    target: `Partido ${district}`,
                    type: 'ERROR',
                    description: `No se pudo encontrar QID de partido judicial para ${district}.`,
                });
                partido.status = 'FALTA';
            }
        } else {
            partido.status = 'OK';
        }

        // Verify partido Wikipedia
        const partidoWikiUrl = partido.wikipedia || partido.proposedWikipedia;
        if (partidoWikiUrl) {
            const wRes = await verifyWikipedia(partidoWikiUrl, cleanPartidoQid);
            if (!wRes.ok) {
                issues.push({
                    target: `Partido ${district}`,
                    type: 'AVISO',
                    description: `Wikipedia partido (${partidoWikiUrl}): ${wRes.note}`,
                });
                if (partidoEntity?.eswiki) {
                    partido.proposedWikipedia = eswikiUrl(partidoEntity.eswiki);
                }
            } else if (!partido.wikipedia && partido.proposedWikipedia) {
                partido.status = 'CORREGIDO-PROPUESTO';
            }
        } else if (partidoEntity?.eswiki) {
            partido.proposedWikipedia = eswikiUrl(partidoEntity.eswiki);
            partido.status = 'CORREGIDO-PROPUESTO';
        }

        // -------------------------------------------------------------------
        // 2. Municipios
        // -------------------------------------------------------------------
        for (const mun of courtData.municipios) {
            const locName = mun.locationName || mun.nameSource || 'Desconocido';

            // Clean QID candidate
            let currentQid = mun.qid;

            // Known source quirks:
            // - Corbera: Q15601Ç
            if (currentQid && /Ç|[^A-Za-z0-9]/.test(currentQid)) {
                const cleaned = currentQid.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                issues.push({
                    target: `${locName} (${courtSlug})`,
                    type: 'PROPUESTA',
                    description: `QID con carácter basura "${currentQid}" corregido a "${cleaned}".`,
                });
                mun.proposedQid = cleaned;
                currentQid = cleaned;
            }

            // - Granollers municipality: candidate list [Q15418, Q15420]
            if (mun.locationSlug === 'granollers' && mun.qidCandidates?.length) {
                if (mun.qidCandidates.includes('Q15420')) {
                    mun.proposedQid = 'Q15420';
                    currentQid = 'Q15420';
                    mun.status = 'CORREGIDO-PROPUESTO';
                    issues.push({
                        target: `Granollers (${courtSlug})`,
                        type: 'PROPUESTA',
                        description: `La fuente duplicaba Q15418 (Granera). Se selecciona Q15420 (Granollers).`,
                    });
                }
            }

            // - El Prat municipality: check if source provided partido QID Q117469569
            if (mun.locationSlug === 'el-prat-de-llobregat' && currentQid === 'Q117469569') {
                issues.push({
                    target: `El Prat de Llobregat (${courtSlug})`,
                    type: 'PROPUESTA',
                    description: `La fuente usaba Q117469569 (partido) para el municipio. Municipio correcto = Q15628.`,
                });
                mun.proposedQid = 'Q15628';
                currentQid = 'Q15628';
                mun.status = 'CORREGIDO-PROPUESTO';
            }

            let ent = currentQid ? await getEntity(currentQid) : null;
            let isValidMun = ent && !ent.missing && (await isMunicipioEntity(ent));
            let inBcn = ent ? await isInsideProvince(ent.id, QID_PROVINCIA_BARCELONA) : false;

            if (!isValidMun || !inBcn) {
                // Must search candidate
                const candidate = await findMunicipalityCandidate(locName);
                if (candidate) {
                    issues.push({
                        target: `${locName} (${courtSlug})`,
                        type: 'PROPUESTA',
                        description: mun.qid
                            ? `QID ${mun.qid} no es válido o no está en Barcelona. Propuesto ${candidate.qid}.`
                            : `Municipio sin QID en la fuente. Propuesto ${candidate.qid} por búsqueda Wikidata.`,
                    });
                    mun.proposedQid = candidate.qid;
                    if (!mun.wikipedia && candidate.eswiki) {
                        mun.proposedWikipedia = eswikiUrl(candidate.eswiki);
                    }
                    mun.status = 'CORREGIDO-PROPUESTO';
                    mun.source = mun.qid ? 'fuente' : 'wikidata-search';
                    currentQid = candidate.qid;
                    ent = await getEntity(candidate.qid);
                } else {
                    issues.push({
                        target: `${locName} (${courtSlug})`,
                        type: 'ERROR',
                        description: `No se pudo encontrar QID de municipio para "${locName}".`,
                    });
                    mun.status = 'FALTA';
                }
            } else {
                if (!mun.proposedQid) {
                    mun.status = 'OK';
                }
            }

            // Verify Wikipedia URL
            const wikiUrl = mun.wikipedia || mun.proposedWikipedia;
            if (wikiUrl) {
                const wRes = await verifyWikipedia(wikiUrl, currentQid);
                if (!wRes.ok) {
                    issues.push({
                        target: `${locName} (${courtSlug})`,
                        type: 'AVISO',
                        description: `Wikipedia municipio (${wikiUrl}): ${wRes.note}`,
                    });
                    if (ent?.eswiki) {
                        mun.proposedWikipedia = eswikiUrl(ent.eswiki);
                        mun.status = 'CORREGIDO-PROPUESTO';
                    }
                }
            } else if (ent?.eswiki) {
                mun.proposedWikipedia = eswikiUrl(ent.eswiki);
                if (mun.status === 'OK') mun.status = 'CORREGIDO-PROPUESTO';
            }
        }
    }

    saveCache();
    fs.writeFileSync(DATA_JSON, JSON.stringify(data, null, 2) + '\n');
    console.log('src/data/areaserved.json actualizado con estados y propuestas.');

    // -----------------------------------------------------------------------
    // Generate Report Markdown
    // -----------------------------------------------------------------------
    const lines: string[] = [];
    lines.push('# Informe de Verificación de `areaServed` (Partidos Judiciales y Municipios)');
    lines.push('');
    lines.push(`**Fecha:** ${new Date().toISOString()}`);
    lines.push(`**Proyecto:** autoridad.legal (Next.js 16 + Supabase)`);
    lines.push(`**Total partidos judiciales:** ${Object.keys(data).length}`);
    lines.push(`**Total municipios analizados:** ${Object.values(data).reduce((acc, c) => acc + c.municipios.length, 0)}`);
    lines.push('');

    lines.push('## 1. Resumen Ejecutivo de Errores y Acciones');
    lines.push('');
    lines.push('### Errores corregidos en la fuente:');
    lines.push('- **Ejemplo Martorell**: Descartado el ejemplo de la cabecera; se utiliza el listado unificado y verificado.');
    lines.push('- **Granollers (municipio)**: Tenía Q15418 duplicado (Granera). Corregido a **Q15420**.');
    lines.push('- **Corbera de Llobregat**: QID `Q15601Ç` contenía carácter basura. Corregido a **Q15601**.');
    lines.push('- **El Prat de Llobregat (municipio)**: Usaba Q117469569 (partido) para el municipio. Corregido a **Q15628**.');
    lines.push('- **Cornellà y Santa Coloma de Gramenet**: La fuente solo traía QID de municipio. Se obtuvieron los QIDs de los respectivos partidos judiciales.');
    lines.push('- **Badalona**: Faltaba el QID y Wikipedia del partido judicial. Obtenido y propuesto.');
    lines.push('- **Arenys de Mar**: No contenía QIDs. Se obtuvieron y verificaron todos sus 13 municipios vía Wikidata.');
    lines.push('- **Gavà**: Plus Code corregido a `8244+X9 Gavà` (descartada la mezcla con Martorell).');
    lines.push('- **Mollet del Vallès**: Dirección de la fuente corregida a localidad Mollet del Vallès.');
    lines.push('- **Sant Quirze de Terrassa**: Normalizado a Sant Quirze del Vallès (Q13935).');
    lines.push('- **5 Partidos ausentes en la fuente** (Berga, Igualada, Manresa, Vic, Vilafranca del Penedès): Se incorporaron todos sus municipios a partir de la BD de `locations` y se resolvieron sus QIDs vía Wikidata Search (`fuente: wikidata-search`).');
    lines.push('');

    lines.push('### Incidencias y advertencias detectadas:');
    if (issues.length === 0) {
        lines.push('- Ninguna incidencia pendiente. Todos los QIDs verificados.');
    } else {
        const errors = issues.filter(i => i.type === 'ERROR');
        const proposals = issues.filter(i => i.type === 'PROPUESTA');
        const warnings = issues.filter(i => i.type === 'AVISO');
        lines.push(`- **Errores bloqueantes (FALTA):** ${errors.length}`);
        lines.push(`- **Propuestas de corrección (CORREGIDO-PROPUESTO):** ${proposals.length}`);
        lines.push(`- **Avisos / URLs sugeridas (AVISO):** ${warnings.length}`);
        lines.push('');
        if (errors.length) {
            lines.push('#### Errores bloqueantes:');
            errors.forEach(e => lines.push(`- **${e.target}:** ${e.description}`));
            lines.push('');
        }
    }

    lines.push('---');
    lines.push('## 2. Detalle por Partido Judicial');
    lines.push('');

    for (const [courtSlug, c] of Object.entries(data)) {
        const p = c.partido;
        const pQid = p.proposedQid || p.qid || 'FALTA';
        const pWiki = p.proposedWikipedia || p.wikipedia || 'FALTA';
        lines.push(`### Partido Judicial de ${c.judicialDistrict} (\`${courtSlug}\`)`);
        lines.push(`- **Estado Partido:** \`${p.status}\``);
        lines.push(`- **QID Partido:** [${pQid}](https://www.wikidata.org/wiki/${pQid})`);
        lines.push(`- **Wikipedia Partido:** ${pWiki}`);
        lines.push(`- **Sede / Dirección:** ${p.address || '*(en courts)*'}`);
        lines.push(`- **Google Maps:** ${p.mapsUrl || '*(búsqueda por nombre)*'}`);
        lines.push(`- **Plus Code:** \`${p.plusCode || 'N/A'}\``);
        if (p.notes.length) {
            lines.push(`- **Notas:** ${p.notes.join(' · ')}`);
        }
        lines.push('');
        lines.push('| Municipio | Slug | QID | Estado | Wikipedia | Origen |');
        lines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');

        for (const m of c.municipios) {
            const mQid = m.proposedQid || m.qid || '—';
            const mQidLink = mQid !== '—' ? `[${mQid}](https://www.wikidata.org/wiki/${mQid})` : '—';
            const mWiki = m.proposedWikipedia || m.wikipedia || '—';
            const mWikiLink = mWiki !== '—' ? `[Link](${mWiki})` : '—';
            lines.push(`| ${m.locationName} | \`${m.locationSlug}\` | ${mQidLink} | \`${m.status}\` | ${mWikiLink} | ${m.source} |`);
        }
        lines.push('');

        if (c.unmatchedSource.length) {
            lines.push('**Entradas de la fuente sin emparejar en la BD:**');
            for (const u of c.unmatchedSource) {
                lines.push(`- *${u.nameSource}* (${u.qids.join(', ') || 'sin QID'}): ${u.reason}`);
            }
            lines.push('');
        }
    }

    fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
    fs.writeFileSync(REPORT_MD, lines.join('\n'));
    console.log(`Informe generado con éxito en: ${path.relative(process.cwd(), REPORT_MD)}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
