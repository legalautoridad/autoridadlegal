export async function sendWhatsAppMessage(to: string, text: string) {
    const apiKey = process.env.WASENDER_API_KEY;

    // Clean phone number (keep only digits)
    const cleanTo = to.replace(/\D/g, '');
    if (!cleanTo) {
        console.error('[WASENDER] Invalid recipient phone number:', to);
        return { success: false, error: 'Invalid recipient phone number' };
    }

    if (!apiKey) {
        console.error('[WASENDER] Missing WASENDER_API_KEY configuration');
        return { success: false, error: 'Missing WASENDER_API_KEY configuration' };
    }

    try {
        // Add a natural 2-second delay before replying so WhatsApp does not flag sub-second automated replies on newly linked devices
        await new Promise(resolve => setTimeout(resolve, 2000));

        const restUrl = 'https://wasenderapi.com/api/send-message';
        console.log(`[WASENDER] Sending message to +${cleanTo} via REST API...`);

        const sendViaRest = async () => {
            const restRes = await fetch(restUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    to: `+${cleanTo}`,
                    text,
                }),
            });
            const contentType = restRes.headers.get('content-type') || '';
            const restResult = contentType.includes('application/json')
                ? await restRes.json()
                : { raw: await restRes.text() };
            return { status: restRes.status, ok: restRes.ok, body: restResult };
        };

        let attempt = await sendViaRest();

        // If WaSender Account Protection rate-limits (1 message every 5 seconds), wait and retry once (never bypass via MCP)
        if (attempt.status === 429) {
            const waitSec = Number(attempt.body?.retry_after) || 6;
            console.log(`[WASENDER] Rate limited (429), waiting ${waitSec}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, (waitSec + 1) * 1000));
            attempt = await sendViaRest();
        }

        console.log(`[WASENDER] REST status: ${attempt.status}, body:`, JSON.stringify(attempt.body));

        if (attempt.ok && attempt.body?.success !== false) {
            console.log(`[WASENDER] Message sent successfully to +${cleanTo}`);
            return { success: true, data: attempt.body };
        }

        console.error('[WASENDER] API Error:', attempt.body);
        return { success: false, error: attempt.body };
    } catch (error) {
        console.error('[WASENDER] Network/Server Error:', error);
        return { success: false, error };
    }
}
