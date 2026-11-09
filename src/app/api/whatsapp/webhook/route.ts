import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/lib/ai/actions';
import { updateLeadJson, getLeadJson, transferJsonToDb } from '@/lib/actions/leads';
import { sendWhatsAppMessage } from '@/lib/whatsapp/wasender';
import { analyzeIncomingWhatsAppMessage } from '@/lib/whatsapp/message-analyzer';

// Track recently processed message IDs to prevent duplicate replies when WaSender fires multiple webhook events
const processedMessageIds = new Set<string>();

export async function POST(req: NextRequest) {
    console.log('[WHATSAPP_WEBHOOK] Request received');
    const secret = process.env.WASENDER_WEBHOOK_SECRET;

    // 1. Security Validation
    const receivedSecret =
        req.headers.get('x-webhook-secret') ||
        req.headers.get('x-webhook-signature') ||
        req.nextUrl.searchParams.get('secret');

    if (secret && receivedSecret && receivedSecret !== secret) {
        console.warn('[WHATSAPP_WEBHOOK] Unauthorized access attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log(`[WHATSAPP_WEBHOOK] Event: ${body.event}`);

        // 2. Only process incoming `messages.received` events (ignore `messages-personal.received`, `messages.upsert`, `message.sent`, etc.)
        if (body.event && body.event !== 'messages.received') {
            console.log(`[WHATSAPP_WEBHOOK] Ignoring non-primary event: ${body.event}`);
            return NextResponse.json({ status: 'ignored', reason: `Ignored event ${body.event}` });
        }

        // 3. CRITICAL: Ignore messages sent by the bot itself to prevent infinite loops
        const isFromMe =
            body.data?.messages?.key?.fromMe === true ||
            body.data?.messages?.[0]?.key?.fromMe === true ||
            body.data?.fromMe === true;

        if (isFromMe) {
            console.log('[WHATSAPP_WEBHOOK] Ignoring self-sent message');
            return NextResponse.json({ status: 'ignored', reason: 'Self-sent message' });
        }

        // 4. Extract sender phone, message ID, and message text from WaSender payload
        const rawMessages = body.data?.messages;
        const messageObj = Array.isArray(rawMessages) ? rawMessages[0] : rawMessages;

        const messageId: string | undefined = messageObj?.key?.id || messageObj?.id;
        if (messageId) {
            if (processedMessageIds.has(messageId)) {
                console.log(`[WHATSAPP_WEBHOOK] Duplicate messageId=${messageId} ignored`);
                return NextResponse.json({ status: 'ignored', reason: 'Duplicate message ID' });
            }
            processedMessageIds.add(messageId);
            if (processedMessageIds.size > 500) {
                const oldest = processedMessageIds.values().next().value;
                if (oldest) processedMessageIds.delete(oldest);
            }
        }

        const from =
            messageObj?.key?.cleanedSenderPn ||
            messageObj?.key?.senderPn ||
            messageObj?.remoteJid ||
            messageObj?.key?.remoteJid;

        const messageText =
            messageObj?.messageBody ||
            messageObj?.message?.conversation ||
            messageObj?.message?.extendedTextMessage?.text;

        console.log(`[WHATSAPP_WEBHOOK] Extracted: id=${messageId}, from=${from}, text=${messageText}`);

        if (!from || !messageText) {
            console.error('[WHATSAPP_WEBHOOK] Failed to extract from/text. Body structure:', JSON.stringify(body));
            return NextResponse.json({ error: 'Missing data structure' }, { status: 400 });
        }

        // Normalize sender (remove @s.whatsapp.net, @lid, etc. and keep only digits)
        const phone = String(from).replace(/\D/g, '');
        console.log(`[WHATSAPP_WEBHOOK] Processing message from ${phone} (${from})...`);

        // 5. Understand what the message is about and generate the confirmation reply
        const analysis = await analyzeIncomingWhatsAppMessage(String(messageText));
        console.log('[WHATSAPP_WEBHOOK] Message analysis:', JSON.stringify(analysis));

        // 6. Retrieve & update lead session state
        const sessionData = (await getLeadJson(phone)) || {
            history: [],
            systemin: 'whatsapp',
            phone,
        };

        const history: Message[] = sessionData.history || [];
        const finalHistory: Message[] = ([
            ...history,
            { role: 'user', content: String(messageText) },
            { role: 'model', content: analysis.confirmationReply },
        ] as Message[]).slice(-10);

        await updateLeadJson(phone, {
            phone,
            incident_type: analysis.category,
            judicial_district: analysis.judicialDistrict || sessionData.judicial_district || null,
            city: analysis.judicialDistrict || sessionData.city || null,
            concerns: String(messageText),
            contact_date_time: new Date().toISOString(),
            history: finalHistory,
            lastUpdate: new Date().toISOString(),
            systemin: 'whatsapp',
        });

        // Best-effort persistence to Supabase `leads` table
        try {
            await transferJsonToDb(phone);
            console.log(`[WHATSAPP_WEBHOOK] Lead for ${phone} saved to DB.`);
        } catch (dbErr) {
            console.warn('[WHATSAPP_WEBHOOK] Lead kept in JSON (DB transfer warning):', dbErr);
        }

        // 7. Send confirmation WhatsApp message back via WaSender
        const sendResult = await sendWhatsAppMessage(phone, analysis.confirmationReply);

        return NextResponse.json({
            success: sendResult.success,
            analysis,
        });
    } catch (error: any) {
        console.error('[WHATSAPP_WEBHOOK] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
