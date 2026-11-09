import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.WASENDER_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey);
const testPhone = '+34699999901';
const testRemoteJid = '34699999901@s.whatsapp.net';

async function sendWebhook(msgId: string, text: string) {
    const payload = {
        event: 'messages.received',
        timestamp: Math.floor(Date.now() / 1000),
        data: {
            messages: {
                key: {
                    id: msgId,
                    remoteJid: testRemoteJid,
                    fromMe: false,
                    addressingMode: 'pn',
                    cleanedSenderPn: '34699999901',
                },
                messageBody: text,
                message: {
                    conversation: text,
                },
            },
        },
    };

    const res = await fetch('http://localhost:3000/api/whatsapp/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-webhook-signature': secret!,
        },
        body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    return await res.json();
}

test('E2E Webhook: Lead creation, state advancement and idempotency in Supabase', async () => {
    // Clean any previous test leads
    await supabase.from('leads').delete().eq('phone', testPhone);

    // Step 1: Initial message creates lead in ask_name state
    const id1 = `TEST_${Date.now()}_1`;
    const res1 = await sendWebhook(id1, 'Hola, necesito abogado urgente');
    assert.strictEqual(res1.status, 'success');
    assert.strictEqual(res1.wa_state, 'ask_name');

    const { data: lead1 } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', testPhone)
        .single();

    assert.ok(lead1);
    assert.strictEqual(lead1.wa_state, 'ask_name');
    assert.strictEqual(lead1.systemin, 'whatsapp');
    assert.strictEqual(lead1.concerns, 'Hola, necesito abogado urgente');
    assert.strictEqual(lead1.conversation.length, 2); // 1 in + 1 out

    // Step 2: User gives name
    const id2 = `TEST_${Date.now()}_2`;
    const res2 = await sendWebhook(id2, 'Carlos Gómez');
    assert.strictEqual(res2.status, 'success');
    assert.strictEqual(res2.wa_state, 'ask_incident');

    const { data: lead2 } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', testPhone)
        .single();

    assert.strictEqual(lead2.name, 'Carlos Gómez');
    assert.strictEqual(lead2.wa_state, 'ask_incident');
    assert.strictEqual(lead2.conversation.length, 4); // 2 in + 2 out

    // Step 3: User describes incident
    const id3 = `TEST_${Date.now()}_3`;
    const res3 = await sendWebhook(id3, 'Control de alcoholemia anoche en Granollers, di 0.65');
    assert.strictEqual(res3.status, 'success');
    assert.strictEqual(res3.wa_state, 'done');

    const { data: lead3 } = await supabase
        .from('leads')
        .select('*')
        .eq('phone', testPhone)
        .single();

    assert.strictEqual(lead3.wa_state, 'done');
    assert.strictEqual(lead3.incident_type, 'alcoholemia');
    assert.strictEqual(lead3.city, 'Granollers');
    assert.strictEqual(lead3.conversation.length, 6); // 3 in + 3 out

    // Step 4: Idempotency test (repeat id3)
    const res4 = await sendWebhook(id3, 'Control de alcoholemia anoche en Granollers, di 0.65');
    assert.strictEqual(res4.status, 'duplicate');

    // Clean up test lead
    await supabase.from('leads').delete().eq('phone', testPhone);
});

