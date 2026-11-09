import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getWasenderClient, sendWhatsAppMessage } from '@/lib/whatsapp/wasender';
import {
    extractMessageData,
    processTriageStep,
    ConversationItem,
} from '@/lib/whatsapp/triage-machine';

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase server configuration');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

// In-memory cache for locations list to avoid querying the DB on every message
let cachedLocations: string[] | null = null;
let lastLocationsFetch = 0;

async function getLocationsList(supabase: ReturnType<typeof getSupabaseAdmin>): Promise<string[]> {
    const now = Date.now();
    if (cachedLocations && now - lastLocationsFetch < 3600000) {
        return cachedLocations;
    }
    try {
        const { data } = await supabase.from('locations').select('name');
        if (data && data.length > 0) {
            cachedLocations = data.map((l: any) => l.name).filter(Boolean);
            lastLocationsFetch = now;
            return cachedLocations!;
        }
    } catch (err) {
        console.error('[WHATSAPP_WEBHOOK] Error fetching locations:', err);
    }
    return cachedLocations || [];
}

export async function POST(req: NextRequest) {
    console.log('[WHATSAPP_WEBHOOK] Received incoming webhook request');

    // 1. Read raw body and verify signature using the official SDK
    const rawBody = await req.text();
    const wasender = getWasenderClient();

    const adapter = {
        getHeader: (name: string) => req.headers.get(name) || '',
        getRawBody: () => rawBody,
    };

    let event: any;
    try {
        event = await wasender.handleWebhookEvent(adapter);
    } catch (err: any) {
        console.warn('[WHATSAPP_WEBHOOK] Signature verification failed:', err?.message);
        return NextResponse.json({ error: 'Unauthorized: Invalid webhook signature' }, { status: 401 });
    }

    try {
        const eventType = event?.event;
        console.log(`[WHATSAPP_WEBHOOK] Event type: ${eventType}`);

        // 2. Only process incoming message events ('messages.received' or 'messages.upsert')
        if (eventType !== 'messages.received' && eventType !== 'messages.upsert') {
            return NextResponse.json({ status: 'ignored', reason: `Non-message event: ${eventType}` }, { status: 200 });
        }

        // 3. Extract message data
        const extracted = extractMessageData(event);

        // Filter: Ignore self-sent messages (CRITICAL: prevents infinite reply loop)
        if (extracted.fromMe) {
            console.log('[WHATSAPP_WEBHOOK] Ignoring self-sent message');
            return NextResponse.json({ status: 'ignored', reason: 'Self-sent message' }, { status: 200 });
        }

        // Filter: Ignore groups, status broadcasts, and newsletters
        if (extracted.isGroupOrBroadcast) {
            console.log(`[WHATSAPP_WEBHOOK] Ignoring group/broadcast message: ${extracted.remoteJid}`);
            return NextResponse.json({ status: 'ignored', reason: 'Group, broadcast, or newsletter' }, { status: 200 });
        }

        if (!extracted.messageId) {
            console.warn('[WHATSAPP_WEBHOOK] Missing message ID');
            return NextResponse.json({ status: 'ignored', reason: 'Missing message ID' }, { status: 200 });
        }

        const supabase = getSupabaseAdmin();

        // 4. Idempotency: insert message ID into whatsapp_events
        const { error: eventInsertError } = await supabase
            .from('whatsapp_events')
            .insert({
                message_id: extracted.messageId,
                received_at: new Date().toISOString(),
            });

        if (eventInsertError) {
            // If already processed (unique constraint violation code 23505), stop and reply 200
            if (
                eventInsertError.code === '23505' ||
                eventInsertError.message?.includes('duplicate key') ||
                eventInsertError.message?.includes('unique constraint')
            ) {
                console.log(`[WHATSAPP_WEBHOOK] Event ${extracted.messageId} already processed (idempotent).`);
                return NextResponse.json({ status: 'duplicate', messageId: extracted.messageId }, { status: 200 });
            }
            console.error('[WHATSAPP_WEBHOOK] Error tracking event in DB:', eventInsertError);
        }

        // 5. Look for an open lead: systemin = 'whatsapp', phone = ese número, is_taken = false, creado hace menos de 7 días
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Check active in-progress lead first (wa_state != 'done')
        const { data: openLeads, error: openLeadsError } = await supabase
            .from('leads')
            .select('*')
            .eq('systemin', 'whatsapp')
            .eq('phone', extracted.normalizedPhone)
            .eq('is_taken', false)
            .neq('wa_state', 'done')
            .gte('created_at', sevenDaysAgo)
            .order('created_at', { ascending: false })
            .limit(1);

        if (openLeadsError) {
            console.error('[WHATSAPP_WEBHOOK] Error querying active leads:', openLeadsError);
        }

        let targetLead = openLeads && openLeads.length > 0 ? openLeads[0] : null;

        // If no in-progress lead, check if a recent 'done' lead exists for this phone within 7 days
        if (!targetLead) {
            const { data: doneLeads } = await supabase
                .from('leads')
                .select('*')
                .eq('systemin', 'whatsapp')
                .eq('phone', extracted.normalizedPhone)
                .eq('is_taken', false)
                .eq('wa_state', 'done')
                .gte('created_at', sevenDaysAgo)
                .order('created_at', { ascending: false })
                .limit(1);

            if (doneLeads && doneLeads.length > 0) {
                targetLead = doneLeads[0];
            }
        }

        const locations = await getLocationsList(supabase);
        const decision = processTriageStep(targetLead, extracted, locations);

        let leadId: string | null = targetLead?.id || null;
        let currentConversation: ConversationItem[] = targetLead && Array.isArray(targetLead.conversation)
            ? targetLead.conversation
            : [];

        // 6. If NO open lead exists: INSERT immediately BEFORE sending any message
        if (decision.isNew) {
            const initialConversation: ConversationItem[] = [decision.inMsg];
            const nowIso = new Date().toISOString();

            const { data: insertedLead, error: insertError } = await supabase
                .from('leads')
                .insert({
                    phone: decision.phone,
                    systemin: 'whatsapp',
                    contact_date_time: nowIso,
                    concerns: decision.concerns,
                    wa_state: decision.wa_state,
                    conversation: initialConversation,
                    is_taken: false,
                    "lastUpdate": nowIso,
                    created_at: nowIso,
                })
                .select('id')
                .single();

            if (insertError) {
                console.error('[WHATSAPP_WEBHOOK] Error inserting new lead:', insertError);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }

            leadId = insertedLead.id;
            currentConversation = initialConversation;
            console.log(`[WHATSAPP_WEBHOOK] New lead created AL INSTANTE: ${leadId}`);
        } else if (targetLead) {
            // Existing lead: update state and append incoming message
            currentConversation = [...currentConversation, decision.inMsg];

            const updatePayload: Record<string, any> = {
                wa_state: decision.wa_state,
                conversation: currentConversation,
                "lastUpdate": new Date().toISOString(),
            };

            if (decision.name !== undefined) updatePayload.name = decision.name;
            if (decision.concerns !== undefined) updatePayload.concerns = decision.concerns;
            if (decision.incident_type !== undefined) updatePayload.incident_type = decision.incident_type;
            if (decision.city !== undefined) updatePayload.city = decision.city;

            const { error: updateError } = await supabase
                .from('leads')
                .update(updatePayload)
                .eq('id', targetLead.id);

            if (updateError) {
                console.error('[WHATSAPP_WEBHOOK] Error updating existing lead:', updateError);
            }
        }

        // 7. Send bot reply if dictated by the state machine
        if (decision.outMsgTextToSend && leadId) {
            console.log(`[WHATSAPP_WEBHOOK] Sending reply to ${extracted.normalizedPhone}...`);
            const sendResult = await sendWhatsAppMessage(extracted.normalizedPhone, decision.outMsgTextToSend);

            const outMsg: ConversationItem = {
                direction: 'out',
                type: 'text',
                text: decision.outMsgTextToSend,
                message_id: sendResult.result?.response?.data?.key?.id || null,
                timestamp: new Date().toISOString(),
            };

            // Append out message to conversation in DB
            const finalConversation = [...currentConversation, outMsg];
            await supabase
                .from('leads')
                .update({
                    conversation: finalConversation,
                    "lastUpdate": new Date().toISOString(),
                })
                .eq('id', leadId);
        }

        return NextResponse.json({
            status: 'success',
            lead_id: leadId,
            wa_state: decision.wa_state,
        }, { status: 200 });
    } catch (err: any) {
        console.error('[WHATSAPP_WEBHOOK] Unexpected error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
