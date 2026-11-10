import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { formatDateSpanish } from '../src/lib/date';
import { getSitewideJsonLdV6 } from '../src/lib/seo/home-jsonld';
import { PHONE_CALL_E164, WHATSAPP_URL } from '../src/lib/contact';

test('1. Meta descriptions in Home and /honorarios are ≤ 155 characters', () => {
    const homeContent = fs.readFileSync(path.join(process.cwd(), 'src/app/(home)/page.tsx'), 'utf-8');
    const honorariosContent = fs.readFileSync(path.join(process.cwd(), 'src/app/honorarios/page.tsx'), 'utf-8');

    // Extract description from Home
    const homeDescMatch = /description:\s*["'`]([^"'`]+)["'`]/.exec(homeContent);
    assert.ok(homeDescMatch, 'Home description must be found');
    const homeDesc = homeDescMatch[1];
    assert.ok(homeDesc.length <= 155, `Home description exceeds 155 chars (${homeDesc.length}): "${homeDesc}"`);
    assert.strictEqual(
        homeDesc,
        'Abogado penalista 24 h en Barcelona para alcoholemia, drogas, velocidad y sin carnet. Juicio rápido: 680 €, procurador incluido.'
    );

    // Extract description from /honorarios
    const honDescMatch = /description:\s*["'`]([^"'`]+)["'`]/.exec(honorariosContent);
    assert.ok(honDescMatch, 'Honorarios description must be found');
    const honDesc = honDescMatch[1];
    assert.ok(honDesc.length <= 155, `Honorarios description exceeds 155 chars (${honDesc.length}): "${honDesc}"`);
    assert.strictEqual(
        honDesc,
        'Honorarios cerrados por escrito: 680 € con procurador incluido en alcoholemia, drogas, velocidad y sin carnet; 680 € + 500 € para profesionales.'
    );
});

test('2. 404 page has title "Página no encontrada | Autoridad Legal", visible H1, and links', () => {
    const notFoundContent = fs.readFileSync(path.join(process.cwd(), 'src/app/not-found.tsx'), 'utf-8');

    assert.ok(notFoundContent.includes("title: 'Página no encontrada | Autoridad Legal'"));
    assert.ok(notFoundContent.includes('index: false'));
    assert.ok(notFoundContent.includes('<h1'));
    assert.ok(notFoundContent.includes('Página no encontrada'));
    assert.ok(notFoundContent.includes('href="/"'));
    assert.ok(notFoundContent.includes('href="/juzgados"'));
    assert.ok(notFoundContent.includes('href="/honorarios"'));
});

test('3. ReviewedBy date formatting and practical_reviewed gating', () => {
    const formatted = formatDateSpanish('2026-11-09');
    assert.strictEqual(formatted, '9 de noviembre de 2026');

    const formattedAnother = formatDateSpanish('2026-07-22');
    assert.strictEqual(formattedAnother, '22 de julio de 2026');

    // In juzgados page, verify ReviewedBy is only rendered when court.practicalReviewed is true
    const juzgadosContent = fs.readFileSync(path.join(process.cwd(), 'src/app/juzgados/[slug]/page.tsx'), 'utf-8');
    assert.ok(juzgadosContent.includes('court.practicalReviewed && court.lastReviewed'));
});

test('4. Organization JSON-LD has both contactPoints (emergency + WhatsApp support)', () => {
    const jsonLd = getSitewideJsonLdV6();
    assert.ok(jsonLd && Array.isArray(jsonLd['@graph']), 'JSON-LD @graph must be an array');

    const orgNode = jsonLd['@graph'].find((node: any) => node['@id'] === 'https://www.autoridad.legal/#organization');
    assert.ok(orgNode, 'Organization node must exist');

    const contactPoints = orgNode.contactPoint;
    assert.ok(Array.isArray(contactPoints), 'contactPoint must be an array');
    assert.strictEqual(contactPoints.length, 2, 'Must have exactly 2 contactPoints');

    const emergency = contactPoints.find((cp: any) => cp.contactType === 'emergency');
    assert.ok(emergency, 'Emergency contactPoint must exist');
    assert.strictEqual(emergency.telephone, PHONE_CALL_E164);

    const support = contactPoints.find((cp: any) => cp.contactType === 'customer support');
    assert.ok(support, 'Customer support WhatsApp contactPoint must exist');
    assert.strictEqual(support.url, WHATSAPP_URL);
    assert.deepStrictEqual(support.availableLanguage, ['es', 'ca']);
    assert.strictEqual(support.areaServed, 'ES-B');
    assert.strictEqual(support.hoursAvailable?.dayOfWeek?.length, 7);

    // Verify sameAs URLs
    const sameAs: string[] = orgNode.sameAs;
    assert.ok(sameAs.includes('https://www.linkedin.com/company/autoridad-legal/'));
    assert.ok(sameAs.includes('https://www.facebook.com/AutoridadLegal/'));
    assert.ok(sameAs.includes('https://www.instagram.com/autoridad.legal/'));
    assert.ok(sameAs.includes('https://x.com/AutoridadLegal_'));
    assert.ok(sameAs.includes('https://www.youtube.com/@Autoridad_Legal'));
    // Verify no numeric IDs remain in sameAs
    assert.ok(!sameAs.some(url => url.includes('135936660')), 'No numeric LinkedIn ID');
    assert.ok(!sameAs.some(url => url.includes('61591553736969')), 'No numeric Facebook ID');
});

test('5. No SpeedTrap or radar points published in district pages', () => {
    const districtContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/db/district-content.ts'), 'utf-8');
    const juzgadoPage = fs.readFileSync(path.join(process.cwd(), 'src/app/juzgados/[slug]/page.tsx'), 'utf-8');

    // Verify filter excludes SpeedTraps and radars
    assert.ok(districtContent.includes('radar'));
    assert.ok(districtContent.includes('velocidad'));
    assert.ok(!juzgadoPage.includes('SpeedTrap'));
    assert.ok(!juzgadoPage.includes('zonas_calientes'));
});
