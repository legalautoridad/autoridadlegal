import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
    PENAL_BASE_PRICE,
    SUPPLEMENT_PROFESIONAL,
    SUPPLEMENT_REINCIDENCIA,
    SUPPLEMENT_RIESGO_PRISION,
    SUPPLEMENT_ASISTENCIA_DETENIDO,
    SUPPLEMENT_NO_CONFORMIDAD,
    ADMIN_POINTS_BASE_PRICE,
    ADMIN_POINTS_SUCCESS_BONUS,
    STATUTORY_TAX_NOTE,
    formatPrice,
    calculate6040,
    calculateFinancingQuotas,
    SERVICES_PRICING,
    CANONICAL_SUPPLEMENTS,
    PAYMENT_60_40_TIERS,
} from '../src/lib/pricing';

test('1. Canonical pricing constants and calculations', () => {
    assert.strictEqual(PENAL_BASE_PRICE, 680);
    assert.strictEqual(SUPPLEMENT_PROFESIONAL, 500);
    assert.strictEqual(SUPPLEMENT_REINCIDENCIA, 200);
    assert.strictEqual(SUPPLEMENT_RIESGO_PRISION, 300);
    assert.strictEqual(SUPPLEMENT_ASISTENCIA_DETENIDO, 500);
    assert.strictEqual(SUPPLEMENT_NO_CONFORMIDAD, 300);
    assert.strictEqual(ADMIN_POINTS_BASE_PRICE, 350);
    assert.strictEqual(ADMIN_POINTS_SUCCESS_BONUS, 150);

    // formatPrice test
    assert.strictEqual(formatPrice(680), '680 €');
    assert.strictEqual(formatPrice(680, { decimals: true }), '680,00 €');
    assert.strictEqual(formatPrice(500, { prefix: '+' }), '+500 €');

    // 60/40 calculation (Option A: on net honorarios)
    const base6040 = calculate6040(680);
    assert.strictEqual(base6040.pago60, 408);
    assert.strictEqual(base6040.pago40, 272);
    assert.strictEqual(base6040.pago60 + base6040.pago40, 680);

    const pro6040 = calculate6040(1180);
    assert.strictEqual(pro6040.pago60, 708);
    assert.strictEqual(pro6040.pago40, 472);
    assert.strictEqual(pro6040.pago60 + pro6040.pago40, 1180);

    // Quotas test
    const quotas = calculateFinancingQuotas(680);
    assert.strictEqual(quotas.cuota3, Math.ceil(680 / 3)); // 227
    assert.strictEqual(quotas.cuota6, Math.ceil(680 / 6)); // 114
    assert.strictEqual(quotas.cuota12, Math.ceil(680 / 12)); // 57

    // Statutory tax note presence
    assert.ok(STATUTORY_TAX_NOTE.includes('Las cantidades reflejadas corresponden estrictamente a los honorarios profesionales'));
});

test('2. Scan code files in src/ for prohibited old price amounts', () => {
    // Prohibited old amounts:
    // 980, 1.480 / 1480, 809,92, 170,08, 1.223,14, 256,86, 950 (excluding color classes / line heights),
    // 588, 392 (excluding art. 392 CP), 888, 592
    const PROHIBITED_PATTERNS = [
        { label: '980', regex: /\b980\b/ },
        { label: '1480 / 1.480', regex: /\b1\.?480\b/ },
        { label: '809,92', regex: /809[,.]92/ },
        { label: '170,08', regex: /170[,.]08/ },
        { label: '1.223,14', regex: /1\.?223[,.]14/ },
        { label: '256,86', regex: /256[,.]86/ },
        { label: '950 (price)', regex: /(?<![\w\-])950\b(?!\s*(?:ms|px))/ },
        { label: '588 (60% payment)', regex: /\b588\b/ },
        { label: '392 (40% payment)', regex: /(?<!art[ií]culo\s+)\b392\b(?!\s*CP|\s*del\s+C[oó]digo)/i },
        { label: '888 (60% pro)', regex: /\b888\b/ },
        { label: '592 (40% pro)', regex: /\b592\b/ },
    ];

    const violations: { file: string; line: number; label: string; text: string }[] = [];

    function scanDir(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === '.next' || entry.name === 'node_modules' || entry.name === 'okf') {
                    // skip build, dependencies and raw scraped markdown bundle
                    continue;
                }
                scanDir(fullPath);
            } else if (entry.isFile()) {
                if (
                    !entry.name.endsWith('.ts') &&
                    !entry.name.endsWith('.tsx') &&
                    !entry.name.endsWith('.js') &&
                    !entry.name.endsWith('.mjs')
                ) {
                    continue;
                }

                // Exclude pricing source files and this test itself
                if (
                    fullPath.endsWith('src/lib/pricing.ts') ||
                    fullPath.endsWith('lib/pricing.ts') ||
                    fullPath.endsWith('src/lib/config/pricing.ts') ||
                    fullPath.endsWith('tests/pricing-integrity.test.ts') ||
                    fullPath.endsWith('tests/audit-nov-9.test.ts')
                ) {
                    continue;
                }

                const content = fs.readFileSync(fullPath, 'utf-8');
                const lines = content.split('\n');

                lines.forEach((line, idx) => {
                    // Ignore CSS tailwind color classes like bg-slate-950, text-zinc-950
                    const cleanLine = line.replace(/[\w\-]+-950/g, '');

                    // Ignore SVG path strings which may have coordinate 588 or 392
                    if (cleanLine.includes(' d="') || cleanLine.includes(" d='")) {
                        return;
                    }

                    // Ignore Q-IDs such as Q1480858
                    if (cleanLine.includes('Q1480858') || cleanLine.includes('1480858')) {
                        return;
                    }

                    // Ignore phone numbers like +34 93 592 ...
                    if (cleanLine.includes('592') && cleanLine.includes('+34')) {
                        return;
                    }

                    for (const { label, regex } of PROHIBITED_PATTERNS) {
                        if (regex.test(cleanLine)) {
                            violations.push({
                                file: fullPath,
                                line: idx + 1,
                                label,
                                text: line.trim(),
                            });
                        }
                    }
                });
            }
        }
    }

    scanDir(path.join(process.cwd(), 'src'));

    if (violations.length > 0) {
        console.error('Found prohibited old price amounts in code:');
        violations.forEach(v => console.error(`  ${v.file}:${v.line} [${v.label}]: ${v.text}`));
    }

    assert.strictEqual(
        violations.length,
        0,
        `Expected 0 old price violations, found ${violations.length}`
    );
});
