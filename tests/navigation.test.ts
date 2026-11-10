import test from 'node:test';
import assert from 'node:assert/strict';
import { getNavItems, isRouteActive, CANONICAL_NAV_ITEMS } from '../src/lib/navigation';

test('1. Default flag OFF: navigation excludes Multas y puntos and maintains 8 items', () => {
    delete process.env.NEXT_PUBLIC_SHOW_MULTAS_PUNTOS;
    const items = getNavItems();
    assert.equal(items.length, 8);
    const labels = items.map((i) => i.label);
    assert.deepEqual(labels, [
        'Busca tu juzgado',
        'Alcoholemia',
        'Drogas',
        'Sin carnet',
        'Velocidad',
        'Profesionales',
        'Honorarios',
        'Glosario',
    ]);
    assert.ok(!items.some((i) => i.href === '/defensa-puntos-carnet'));
});

test('2. Flag ON: navigation includes Multas y puntos in exact canonical order', () => {
    process.env.NEXT_PUBLIC_SHOW_MULTAS_PUNTOS = 'true';
    const items = getNavItems();
    assert.equal(items.length, 9);
    const labels = items.map((i) => i.label);
    assert.deepEqual(labels, [
        'Busca tu juzgado',
        'Alcoholemia',
        'Drogas',
        'Sin carnet',
        'Velocidad',
        'Profesionales',
        'Multas y puntos',
        'Honorarios',
        'Glosario',
    ]);

    const multasItem = items.find((i) => i.href === '/defensa-puntos-carnet');
    assert.ok(multasItem);
    assert.equal(multasItem.label, 'Multas y puntos');
    assert.equal(multasItem.ariaLabel, 'Multas y puntos, toda España');
    assert.equal(multasItem.badge, 'Toda España');
    assert.equal(multasItem.hasDivider, true);
    assert.equal(multasItem.category, 'admin');

    // Reset flag
    delete process.env.NEXT_PUBLIC_SHOW_MULTAS_PUNTOS;
});

test('3. Route active helper handles root, nested, and exact paths', () => {
    assert.equal(isRouteActive('/defensa-puntos-carnet', '/defensa-puntos-carnet'), true);
    assert.equal(isRouteActive('/defensa-puntos-carnet', '/honorarios'), false);
    assert.equal(isRouteActive('/juzgados', '/juzgados'), true);
    assert.equal(isRouteActive('/juzgados', '/juzgados/hospitalet-de-llobregat'), true);
    assert.equal(isRouteActive('/juzgados', '/alcoholemia'), false);
    assert.equal(isRouteActive('/alcoholemia', '/alcoholemia'), true);
    assert.equal(isRouteActive('/honorarios', '/honorarios'), true);
    assert.equal(isRouteActive('/glosario', '/glosario/delito-flagrante'), true);
});

