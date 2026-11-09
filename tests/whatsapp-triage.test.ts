import test from 'node:test';
import assert from 'node:assert/strict';
import { WHATSAPP_MESSAGES } from '../src/lib/whatsapp/constants';
import { PHONE_CALL_DISPLAY, PHONE_CALL_E164, WHATSAPP_E164, WHATSAPP_DISPLAY } from '../src/lib/contact';
import { extractMessageData, processTriageStep } from '../src/lib/whatsapp/triage-machine';
import { detectIncidentType, detectCity } from '../src/lib/whatsapp/classifier';

test('Security check: Only PHONE_CALL_DISPLAY (+34 605 118 871) is cited in bot messages', () => {
    const textA = WHATSAPP_MESSAGES.MENSAJE_A;
    const textB = WHATSAPP_MESSAGES.MENSAJE_B('Carlos');
    const textC = WHATSAPP_MESSAGES.MENSAJE_C('Carlos');

    const allTexts = [textA, textB, textC];

    // Phone regex to find any phone pattern
    const phonePattern = /(?:\+?34|0034)?[ -]?[6789]\d{2}[ -]?\d{3}[ -]?\d{3}/g;

    for (const text of allTexts) {
        const matches = text.match(phonePattern) || [];
        for (const match of matches) {
            const cleanDigits = match.replace(/\D/g, '');
            // Only 605118871 (Santiago) is allowed to be mentioned in bot messages
            assert.strictEqual(
                cleanDigits.endsWith('605118871'),
                true,
                `Found forbidden phone number in bot text: ${match}`
            );
        }
    }

    assert.ok(textC.includes(PHONE_CALL_DISPLAY));
});

test('State machine: New lead -> ask_name -> ask_incident -> done', () => {
    const locations = ['Granollers', 'Barcelona', 'Mataró', 'Terrassa'];

    // STEP 1: New Lead
    const msg1 = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'MSG_001',
                    remoteJid: '34699000111@s.whatsapp.net',
                    fromMe: false,
                },
                message: { conversation: 'Hola, necesito ayuda legal' },
            },
        },
    });

    const step1 = processTriageStep(null, msg1, locations, new Date('2026-11-09T10:00:00Z'));
    assert.strictEqual(step1.isNew, true);
    assert.strictEqual(step1.wa_state, 'ask_name');
    assert.strictEqual(step1.phone, '+34699000111');
    assert.strictEqual(step1.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_A);

    // Mock saved lead in DB after step 1
    const leadAfterStep1 = {
        id: 'mock-lead-uuid',
        phone: '+34699000111',
        wa_state: 'ask_name',
        concerns: 'Hola, necesito ayuda legal',
        conversation: [
            step1.inMsg,
            { direction: 'out', type: 'text', text: step1.outMsgTextToSend, timestamp: '2026-11-09T10:00:01Z' },
        ],
    };

    // STEP 2: User provides name
    const msg2 = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'MSG_002',
                    remoteJid: '34699000111@s.whatsapp.net',
                    fromMe: false,
                },
                message: { conversation: 'Me llamo Marc Valls' },
            },
        },
    });

    const step2 = processTriageStep(leadAfterStep1, msg2, locations, new Date('2026-11-09T10:01:00Z'));
    assert.strictEqual(step2.isNew, false);
    assert.strictEqual(step2.wa_state, 'ask_incident');
    assert.strictEqual(step2.name, 'Me llamo Marc Valls');
    assert.strictEqual(step2.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_B('Me llamo Marc Valls'));

    // Mock saved lead in DB after step 2
    const leadAfterStep2 = {
        ...leadAfterStep1,
        name: 'Marc Valls',
        wa_state: 'ask_incident',
        conversation: [
            ...leadAfterStep1.conversation,
            step2.inMsg,
            { direction: 'out', type: 'text', text: step2.outMsgTextToSend, timestamp: '2026-11-09T10:01:01Z' },
        ],
    };

    // STEP 3: User provides incident details
    const msg3 = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'MSG_003',
                    remoteJid: '34699000111@s.whatsapp.net',
                    fromMe: false,
                },
                message: { conversation: 'Tuve un control de alcoholemia en Granollers y di 0.70' },
            },
        },
    });

    const step3 = processTriageStep(leadAfterStep2, msg3, locations, new Date('2026-11-09T10:02:00Z'));
    assert.strictEqual(step3.isNew, false);
    assert.strictEqual(step3.wa_state, 'done');
    assert.strictEqual(step3.incident_type, 'alcoholemia');
    assert.strictEqual(step3.city, 'Granollers');
    assert.strictEqual(step3.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_C('Marc Valls'));

    // Mock saved lead in DB after step 3
    const leadAfterStep3 = {
        ...leadAfterStep2,
        wa_state: 'done',
        incident_type: step3.incident_type,
        city: step3.city,
        conversation: [
            ...leadAfterStep2.conversation,
            step3.inMsg,
            { direction: 'out', type: 'text', text: step3.outMsgTextToSend, timestamp: '2026-11-09T10:02:01Z' },
        ],
    };

    // STEP 4: User sends message AFTER done (< 12 hours) -> does NOT resend MENSAJE_C
    const msg4 = extractMessageData({
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'MSG_004',
                    remoteJid: '34699000111@s.whatsapp.net',
                    fromMe: false,
                },
                message: { conversation: 'Por cierto, fue a las 3 de la mañana' },
            },
        },
    });

    const step4 = processTriageStep(leadAfterStep3, msg4, locations, new Date('2026-11-09T10:30:00Z')); // 28 mins later
    assert.strictEqual(step4.isNew, false);
    assert.strictEqual(step4.wa_state, 'done');
    assert.strictEqual(step4.outMsgTextToSend, null, 'Should not resend MENSAJE_C if < 12h');

    // STEP 5: User sends message AFTER done (> 12 hours) -> DOES resend MENSAJE_C
    const step5 = processTriageStep(leadAfterStep3, msg4, locations, new Date('2026-11-10T02:00:00Z')); // 16 hours later
    assert.strictEqual(step5.isNew, false);
    assert.strictEqual(step5.wa_state, 'done');
    assert.strictEqual(step5.outMsgTextToSend, WHATSAPP_MESSAGES.MENSAJE_C('Marc Valls'));
});

test('Filter: Messages fromMe are correctly identified', () => {
    const fromMePayload = {
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'OUT_001',
                    remoteJid: '34699000111@s.whatsapp.net',
                    fromMe: true,
                },
                message: { conversation: 'Mensaje saliente del bot' },
            },
        },
    };
    const extracted = extractMessageData(fromMePayload);
    assert.strictEqual(extracted.fromMe, true);
});

test('Filter: Group and newsletter messages are identified', () => {
    const groupPayload = {
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'GRP_001',
                    remoteJid: '120363000000000000@g.us',
                    fromMe: false,
                },
                message: { conversation: 'Mensaje de grupo' },
            },
        },
    };
    const extractedGroup = extractMessageData(groupPayload);
    assert.strictEqual(extractedGroup.isGroupOrBroadcast, true);

    const newsletterPayload = {
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'NEWS_001',
                    remoteJid: '120363111111111111@newsletter',
                    fromMe: false,
                },
                message: { conversation: 'Canal de noticias' },
            },
        },
    };
    const extractedNews = extractMessageData(newsletterPayload);
    assert.strictEqual(extractedNews.isGroupOrBroadcast, true);
});

test('Media handling: Audio/Image/Doc messages advance state without crashing', () => {
    const audioPayload = {
        event: 'messages.received',
        data: {
            messages: {
                key: {
                    id: 'AUDIO_001',
                    remoteJid: '34688111222@s.whatsapp.net',
                    fromMe: false,
                },
                message: {
                    audioMessage: { seconds: 12, mimetype: 'audio/ogg; codecs=opus' },
                },
            },
        },
    };
    const extractedAudio = extractMessageData(audioPayload);
    assert.strictEqual(extractedAudio.messageType, 'audio');
    assert.strictEqual(extractedAudio.extractedText, '[Audio recibido]');

    // Advancing state with audio
    const step = processTriageStep(null, extractedAudio);
    assert.strictEqual(step.isNew, true);
    assert.strictEqual(step.wa_state, 'ask_name');
    assert.strictEqual(step.inMsg.type, 'audio');
});

test('Classification: Incident keywords and city detection', () => {
    assert.strictEqual(detectIncidentType('Me han parado y he dado positivo en alcoholemia'), 'alcoholemia');
    assert.strictEqual(detectIncidentType('Iba a 140 en zona 80 y me cazó un radar de velocidad'), 'velocidad');
    assert.strictEqual(detectIncidentType('Test de drogas positivo en cocaína'), 'drogas');
    assert.strictEqual(detectIncidentType('Me pillaron conduciendo sin carnet ni puntos'), 'sin-carnet');
    assert.strictEqual(detectIncidentType('Tuve un accidente y choque por alcance'), 'accidente');
    assert.strictEqual(detectIncidentType('Hola buenas tardes'), null);

    const locations = ['Vic', 'Mataró', 'Granollers', 'Hospitalet de Llobregat', 'Barcelona'];
    assert.strictEqual(detectCity('El control fue en Granollers cerca de la estación', locations), 'Granollers');
    assert.strictEqual(detectCity('Ocurrió en Vic', locations), 'Vic');
    assert.strictEqual(detectCity('Fue en Hospitalet de Llobregat', locations), 'Hospitalet de Llobregat');
    assert.strictEqual(detectCity('No sé en qué pueblo era', locations), null);
});

