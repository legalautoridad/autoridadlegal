import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { WIKIDATA_THINGS, WIKIDATA_ICAB, WIKIDATA_AREAS } from '../src/lib/seo/wikidata';

const BOGUS_QIDS = [
    'Q19842607',
    'Q3602521',
    'Q150342',
    'Q5954562',
    'Q110823293',
    'Q1048450',
    'Q5807185',
    'Q1227546',
    'Q11948293',
    'Q12268153',
    'Q8965830',
];

test('1. No bogus Q-ids exist in any src/ file', () => {
    function scanDir(dir: string): string[] {
        const results: string[] = [];
        const files = readdirSync(dir);
        for (const file of files) {
            const fullPath = join(dir, file);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
                results.push(...scanDir(fullPath));
            } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
                results.push(fullPath);
            }
        }
        return results;
    }

    const allSrcFiles = scanDir(join(process.cwd(), 'src'));

    for (const filePath of allSrcFiles) {
        const content = readFileSync(filePath, 'utf-8');
        for (const bogusId of BOGUS_QIDS) {
            assert.strictEqual(
                content.includes(bogusId),
                false,
                `Found prohibited/bogus Wikidata ID ${bogusId} in ${filePath}`
            );
        }
    }
});

test('2. All declared Wikidata entities match official Wikidata labels', async () => {
    const declaredEntities: { id: string; name: string }[] = [];

    for (const val of Object.values(WIKIDATA_THINGS)) {
        const match = val.sameAs.match(/Q\d+/);
        if (match) declaredEntities.push({ id: match[0], name: val.name });
    }

    const icabMatch = WIKIDATA_ICAB.sameAs.match(/Q\d+/);
    if (icabMatch) declaredEntities.push({ id: icabMatch[0], name: WIKIDATA_ICAB.name });

    for (const val of Object.values(WIKIDATA_AREAS)) {
        const match = val.sameAs.match(/Q\d+/);
        if (match) declaredEntities.push({ id: match[0], name: val.name });
    }

    const ids = declaredEntities.map(e => e.id);
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=es|ca|en&format=json`;
    
    let res: Response;
    try {
        res = await fetch(url, { headers: { 'User-Agent': 'AutoridadLegalBot/1.0' } });
    } catch {
        // If offline / sandbox has no internet, skip network portion
        return;
    }

    if (!res.ok) return;
    const data = await res.json();

    for (const item of declaredEntities) {
        const entity = data.entities[item.id];
        assert.ok(entity, `Entity ${item.id} not found in Wikidata response`);
        const labels = [
            entity.labels?.es?.value?.toLowerCase(),
            entity.labels?.ca?.value?.toLowerCase(),
            entity.labels?.en?.value?.toLowerCase(),
        ].filter(Boolean);

        const declaredLower = item.name.toLowerCase();
        // Check if declared name is a match or partial match of one of the official labels
        const matches = labels.some(
            l => l.includes(declaredLower) || declaredLower.includes(l)
        );

        assert.ok(
            matches,
            `Wikidata label mismatch for ${item.id}: declared "${item.name}", official labels: [${labels.join(', ')}]`
        );
    }
});

