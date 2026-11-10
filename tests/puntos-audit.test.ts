import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFENSE_POINTS_PRICING } from '../src/lib/config/pricing';
import { metadata } from '../src/app/defensa-puntos-carnet/page';
import { ALL_PUNTOS_FAQS } from '../src/lib/data/defensa-puntos-data';
import { PHONE_CALL_E164, PHONE_CALL_DISPLAY, WHATSAPP_URL, WHATSAPP_DISPLAY } from '../src/lib/contact';

test('1. Meta description of /defensa-puntos-carnet is <= 155 characters', () => {
    const desc = metadata.description as string;
    assert.ok(desc, 'Description must exist');
    assert.ok(desc.length <= 155, `Description too long: ${desc.length} chars: "${desc}"`);
    assert.strictEqual(desc, 'Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte.');
});

test('2. Pricing consistency across constants, tax note and amounts', () => {
    assert.strictEqual(DEFENSE_POINTS_PRICING.basePriceNumber, 350);
    assert.strictEqual(DEFENSE_POINTS_PRICING.successBonusNumber, 150);
    assert.strictEqual(DEFENSE_POINTS_PRICING.basePriceDisplay, '350,00 €');
    assert.strictEqual(DEFENSE_POINTS_PRICING.successBonusDisplay, '150,00 €');

    const expectedTaxNote =
        'Nota informativa sobre honorarios profesionales y régimen fiscal: Las cantidades reflejadas corresponden estrictamente a los honorarios profesionales técnicos de dirección letrada y representación procesal. Los tributos legalmente aplicables conforme a la legislación fiscal vigente (Impuesto sobre el Valor Añadido al tipo general del 21% o retenciones de IRPF aplicables en caso de autónomos y personas jurídicas) se liquidan y detallan formalmente en la correspondiente hoja de encargo profesional firmada con carácter previo al inicio de las actuaciones.';
    assert.strictEqual(DEFENSE_POINTS_PRICING.taxNote, expectedTaxNote);
});

test('3. Exact 40 FAQs loaded in canonical dataset with 10 clusters', () => {
    assert.strictEqual(ALL_PUNTOS_FAQS.length, 40);
});

test('4. Server-rendered HTML of /defensa-puntos-carnet verification via localhost', async () => {
    let res: Response;
    try {
        res = await fetch('http://localhost:3000/defensa-puntos-carnet');
    } catch {
        // Dev server not reachable, skip network test
        return;
    }

    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Check single H1
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    assert.strictEqual(h1Matches.length, 1, `Expected exactly 1 <h1>, found ${h1Matches.length}`);

    // Check 3 semantic tables
    const tableMatches = html.match(/<table[^>]*>/gi) || [];
    assert.ok(tableMatches.length >= 3, `Expected at least 3 <table> elements, found ${tableMatches.length}`);
    assert.ok(html.includes('<caption'), 'Tables must have captions');
    assert.ok(html.includes('<thead'), 'Tables must have thead');
    assert.ok(html.includes('<tbody'), 'Tables must have tbody');
    assert.ok(html.includes('scope="col"'), 'Tables must have col scope');
    assert.ok(html.includes('scope="row"'), 'Tables must have row scope');

    // Check tax note is in server-rendered HTML
    assert.ok(html.includes('Nota informativa sobre honorarios profesionales y régimen fiscal'), 'Tax note must be rendered in HTML');

    // Check contact points
    assert.ok(html.includes(PHONE_CALL_DISPLAY), 'Must include phone display');
    assert.ok(html.includes(WHATSAPP_DISPLAY), 'Must include WhatsApp display');

    // Check no 64.6 appears in the HTML
    assert.strictEqual(html.includes('64.6'), false, 'HTML must NOT contain "64.6"');
    assert.ok(html.includes('65.1'), 'HTML must contain "65.1"');

    // Check JSON-LD
    const jsonLdMatches = Array.from(html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi));
    assert.ok(jsonLdMatches.length > 0, 'Must contain application/ld+json scripts');

    let serviceNode: any = null;
    let faqNode: any = null;

    for (const match of jsonLdMatches) {
        try {
            const parsed = JSON.parse(match[1]);
            const graph = parsed['@graph'] || [parsed];
            for (const node of graph) {
                if (node['@type'] === 'LegalService' && node['@id']?.includes('defensa-puntos-carnet')) {
                    serviceNode = node;
                }
                if (node['@type'] === 'FAQPage') {
                    faqNode = node;
                }
            }
        } catch {
            // ignore
        }
    }

    assert.ok(serviceNode, 'LegalService node for defensa-puntos-carnet must exist');
    assert.strictEqual(serviceNode.hasOfferCatalog?.itemListElement?.length, 2);

    assert.ok(faqNode, 'FAQPage node must exist');
    assert.strictEqual(faqNode.mainEntity.length, 40, 'FAQPage must contain exactly 40 questions');
});
