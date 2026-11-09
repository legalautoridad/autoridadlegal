import test from 'node:test';
import assert from 'node:assert/strict';
import { WHATSAPP_MESSAGES } from '../src/lib/whatsapp/constants';
import { PHONE_CALL_DISPLAY } from '../src/lib/contact';
import { extractMessageData, processTriageStep } from '../src/lib/whatsapp/triage-machine';
import { extractName } from '../src/lib/whatsapp/name-extractor';
import { detectIncidentType, detectCity, isOutsideZone, hasCaseWords } from '../src/lib/whatsapp/classifier';

test('1. Mandatory extractName test cases', () => {
    assert.strictEqual(extractName('Me llamo Nico'), 'Nico');
    assert.strictEqual(extractName('me llamo nico'), 'Nico');
    assert.strictEqual(extractName('Soy Ana García'), 'Ana García');
    assert.strictEqual(extractName('Hola, soy Jordi, me han parado en un control'), 'Jordi');
    assert.strictEqual(extractName('Mi nombre es María de los Ángeles'), 'María de los Ángeles');
    assert.strictEqual(extractName('Nico'), 'Nico');
    assert.strictEqual(extractName('Me pararon en una alcoholemia'), null);
    assert.strictEqual(extractName('necesito un abogado urgente'), null);
    assert.strictEqual(extractName('123'), null);
});

test('2. Security & Anti-Preview: Bot messages contain NO "http" URLs and NO phone other than 605', () => {
    const textA = WHATSAPP_MESSAGES.MENSAJE_A;
    const textA2 = WHATSAPP_MESSAGES.MENSAJE_A2;
    const textBWithName = WHATSAPP_MESSAGES.MENSAJE_B('Carlos');
    const textBNoName = WHATSAPP_MESSAGES.MENSAJE_B(null);
    const textCWithName = WHATSAPP_MESSAGES.MENSAJE_C('Carlos');
    const textCNoName = WHATSAPP_MESSAGES.MENSAJE_C(null);

    const allTexts = [textA, textA2, textBWithName, textBNoName, textCWithName, textCNoName];

    // Must NOT contain "http"
    for (const text of allTexts) {
        assert.strictEqual(text.toLowerCase().includes('http'), false, `Found "http" in bot message: ${text}`);
    }

    // Must NOT contain any phone other than 605 118 871
    const phonePattern = /(?:\+?34|0034)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3}/g;
    for (const text of allTexts) {
        const matches = text.match(phonePattern) || [];
        for (const match of matches) {
            const cleanDigits = match.replace(/\D/g, '');
            assert.strictEqual(
                cleanDigits.endsWith('605118871'),
                true,
                `Found non-authorized phone number in bot text: ${match}`
            );
        }
    }

    assert.ok(textCWithName.includes(PHONE_CALL_DISPLAY));
    assert.ok(textCNoName.includes(PHONE_CALL_DISPLAY));
});

test('3. State machine: Full info on first message ("Hola, soy Jordi, me han parado por alcoholemia en Sabadell")', () => {
    const locations = ['Sabadell', 'Terrassa', 'Granollers', 'Barcelona'];
    const msg = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: { id: 'MSG_FULL', remoteJid: '34699111222@s.whatsapp.net', fromMe: false },
                message: { conversation: 'Hola, soy Jordi, me han parado por alcoholemia en Sabadell' },
            },
        },
    });

    const step = processTriageStep(null, msg, locations);
    assert.strictEqual(step.isNew, true);
    assert.strictEqual(step.name, 'Jordi');
    assert.strictEqual(step.wa_state, 'done');
    assert.strictEqual(step.incident_type, 'alcoholemia');
    assert.strictEqual(step.city, 'Sabadell');
    assert.strictEqual(step.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_C('Jordi'));
});

test('4. State machine: User responds with case details instead of name', () => {
    const locations = ['Granollers', 'Barcelona'];

    // Lead currently in 'ask_name' state (asked once via MENSAJE_A)
    const existingLead = {
        id: 'lead-123',
        phone: '+34699111222',
        wa_state: 'ask_name',
        concerns: 'Hola',
        conversation: [
            { direction: 'in', type: 'text', text: 'Hola', timestamp: '2026-11-09T10:00:00Z' },
            { direction: 'out', type: 'text', text: WHATSAPP_MESSAGES.MENSAJE_A, timestamp: '2026-11-09T10:00:01Z' },
        ],
    };

    // User replies with incident details instead of their name:
    const msg = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: { id: 'MSG_INCIDENT_INSTEAD_OF_NAME', remoteJid: '34699111222@s.whatsapp.net', fromMe: false },
                message: { conversation: 'Me pararon en un control de alcoholemia anoche' },
            },
        },
    });

    const step = processTriageStep(existingLead, msg, locations);
    assert.strictEqual(step.isNew, false);
    assert.strictEqual(step.name, undefined); // NOT stored in name
    assert.strictEqual(step.wa_state, 'ask_name'); // Asks name again
    assert.ok(step.concerns?.includes('alcoholemia'));
    assert.strictEqual(step.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_A2); // "Gracias por contárnoslo. ¿Cómo te llamas?"
});

test('5. State machine: Two replies without name -> sets name = null and transitions to done with MENSAJE_C', () => {
    const locations = ['Granollers', 'Barcelona'];

    // Lead where name was already asked twice (MENSAJE_A then MENSAJE_A2)
    const existingLead = {
        id: 'lead-123',
        phone: '+34699111222',
        wa_state: 'ask_name',
        concerns: 'Hola\n\nMe pararon por alcoholemia',
        conversation: [
            { direction: 'in', type: 'text', text: 'Hola', timestamp: '2026-11-09T10:00:00Z' },
            { direction: 'out', type: 'text', text: WHATSAPP_MESSAGES.MENSAJE_A, timestamp: '2026-11-09T10:00:01Z' },
            { direction: 'in', type: 'text', text: 'Me pararon por alcoholemia', timestamp: '2026-11-09T10:01:00Z' },
            { direction: 'out', type: 'text', text: WHATSAPP_MESSAGES.MENSAJE_A2, timestamp: '2026-11-09T10:01:01Z' },
        ],
    };

    // User fails to give name a second time:
    const msg = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: { id: 'MSG_STILL_NO_NAME', remoteJid: '34699111222@s.whatsapp.net', fromMe: false },
                message: { conversation: 'Es que tengo el juicio mañana a las 10' },
            },
        },
    });

    const step = processTriageStep(existingLead, msg, locations);
    assert.strictEqual(step.isNew, false);
    assert.strictEqual(step.name, null); // Leaves name = null
    assert.strictEqual(step.wa_state, 'done'); // Transitions to done
    assert.strictEqual(step.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_C(null));
});

test('6. Municipality outside zone: Girona / Madrid sets city = null and prepends [REVISAR ZONA]', () => {
    const locations = ['Granollers', 'Barcelona', 'Mataró']; // Barcelona province only

    const existingLead = {
        id: 'lead-123',
        name: 'Pere',
        phone: '+34699111222',
        wa_state: 'ask_incident',
        concerns: 'Hola',
        conversation: [
            { direction: 'in', type: 'text', text: 'Hola', timestamp: '2026-11-09T10:00:00Z' },
            { direction: 'out', type: 'text', text: WHATSAPP_MESSAGES.MENSAJE_A, timestamp: '2026-11-09T10:00:01Z' },
            { direction: 'in', type: 'text', text: 'Pere', timestamp: '2026-11-09T10:01:00Z' },
            { direction: 'out', type: 'text', text: WHATSAPP_MESSAGES.MENSAJE_B('Pere'), timestamp: '2026-11-09T10:01:01Z' },
        ],
    };

    const msgGirona = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: { id: 'MSG_GIRONA', remoteJid: '34699111222@s.whatsapp.net', fromMe: false },
                message: { conversation: 'Alcoholemia anoche en Girona capital' },
            },
        },
    });

    const step = processTriageStep(existingLead, msgGirona, locations);
    assert.strictEqual(step.wa_state, 'done');
    assert.strictEqual(step.city, null, 'City outside Barcelona province must be null');
    assert.ok(step.concerns?.startsWith('[REVISAR ZONA] '), 'Concerns must be prefixed with [REVISAR ZONA]');
    assert.strictEqual(step.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_C('Pere'), 'Response to user must still be MENSAJE_C');
});
