import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, Message } from '@/lib/ai/actions';
import { updateLeadJson, getLeadJson } from '@/lib/actions/leads';
import { sendWhatsAppMessage } from '@/lib/whatsapp/wasender';

export async function POST(req: NextRequest) {
    console.log("[WHATSAPP_WEBHOOK] Request received");
    const secret = process.env.WASENDER_WEBHOOK_SECRET;
    
    // 1. Security Validation
    const headers = Object.fromEntries(req.headers.entries());
    console.log("[WHATSAPP_WEBHOOK] Headers:", JSON.stringify(headers));

    const receivedSecret = req.headers.get('x-webhook-secret') || req.nextUrl.searchParams.get('secret');
    console.log("[WHATSAPP_WEBHOOK] Received secret:", receivedSecret, "Expected:", secret);
    
    if (secret && receivedSecret !== secret) {
        console.warn("[WHATSAPP_WEBHOOK] Unauthorized access attempt");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log("[WHATSAPP_WEBHOOK] Received payload:", JSON.stringify(body));

        // 2. CRITICAL: Ignore messages sent by the bot itself to prevent infinite loops
        const isFromMe =
            body.data?.messages?.key?.fromMe === true ||
            body.data?.messages?.[0]?.key?.fromMe === true ||
            body.data?.fromMe === true;

        if (isFromMe) {
            console.log("[WHATSAPP_WEBHOOK] Ignoring self-sent message");
            return NextResponse.json({ status: 'ignored', reason: 'Self-sent message' });
        }

        // 3. Ignore redundant events (WaSender sends both received and upsert)
        if (body.event === 'messages.upsert') {
            console.log("[WHATSAPP_WEBHOOK] Ignoring redundant upsert event");
            return NextResponse.json({ status: 'ignored', reason: 'Redundant event' });
        }

        // WaSender payload structure (actual):
        // data.messages.remoteJid and data.messages.messageBody
        const messageObj = body.data?.messages;
        const from = messageObj?.key?.senderPn || messageObj?.remoteJid || messageObj?.key?.remoteJid;
        const messageText = messageObj?.messageBody || messageObj?.message?.conversation;

        console.log(`[WHATSAPP_WEBHOOK] Extracted: from=${from}, text=${messageText}`);

        if (!from || !messageText) {
            console.error("[WHATSAPP_WEBHOOK] Failed to extract from/text. Body structure:", JSON.stringify(body));
            return NextResponse.json({ error: 'Missing data structure' }, { status: 400 });
        }

        // Normalize sender (remove @s.whatsapp.net, @lid, etc. and keep only digits)
        const phone = from.replace(/\D/g, ''); 

        console.log(`[WHATSAPP_WEBHOOK] Processing message from ${phone} (${from})...`);

        // 2. State Management (Retrieve current slots and history)
        const sessionData = await getLeadJson(phone) || { 
            history: [], 
            systemin: 'whatsapp',
            phone: phone
        };

        // Ensure systemin is whatsapp for this flow
        sessionData.systemin = 'whatsapp';

        const history: Message[] = sessionData.history || [];
        const currentSlots = { ...sessionData };
        
        // Add user message to history
        const updatedHistory: Message[] = [
            ...history,
            { role: 'user', content: messageText }
        ];

        // 3. AI Processing
        console.log(`[WHATSAPP_IA] Processing message from ${phone}...`);
        const stream = await sendMessage(updatedHistory, 'alcoholemia', false, currentSlots);
        
        let fullResponse = "";
        for await (const chunk of stream) {
            try {
                const parsed = JSON.parse(chunk as string);
                if (parsed.type === 'text-delta') {
                    fullResponse += parsed.content;
                }
            } catch (e) {
                // If it's not JSON, it might be a raw string from fallback
                fullResponse += chunk;
            }
        }

        // 4. Slot Extraction & Cleaning (CRITICAL)
        let cleanText = fullResponse;
        const slotsMatch = fullResponse.match(/\[SLOTS:\s*(.*?)\]/);
        const newSlots: Record<string, string> = {};

        if (slotsMatch && slotsMatch[1]) {
            const pairs = slotsMatch[1].split(',').map(p => p.trim());
            pairs.forEach(pair => {
                let [key, val] = pair.split(/[=:]/).map(s => s.trim());
                if (key) key = key.replace(/['"{} [\]]+/g, '').trim();
                if (val) val = val.replace(/['"{} [\]]+/g, '').trim();
                if (key && val) newSlots[key] = val;
            });

            // Remove tag from response
            cleanText = cleanText.replace(/\[SLOTS:.*?\]/g, "").trim();
        }

        // Remove other technical tags
        cleanText = cleanText
            .replace(/\[SAVE_LEAD:.*?\]/g, "")
            .replace(/\[LEAD_DATA:.*?\]/g, "")
            .replace(/\[PAYMENT_BUTTON:.*?\]/g, "")
            .replace(/\[BLOQUE\]/gi, "\n\n")
            .trim();

        // 5. WhatsApp Formatting
        // Convert Markdown Bold (**) to WhatsApp Bold (*)
        cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, "*$1*");

        // 6. Update State
        const finalHistory = [
            ...updatedHistory,
            { role: 'model', content: fullResponse }
        ].slice(-10); // Keep last 10 messages for context

        await updateLeadJson(phone, {
            ...newSlots,
            history: finalHistory,
            lastUpdate: new Date().toISOString(),
            systemin: 'whatsapp'
        });

        // 7. Send Response via WaSender
        await sendWhatsAppMessage(phone, cleanText);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("[WHATSAPP_WEBHOOK] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
