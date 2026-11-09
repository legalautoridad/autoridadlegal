import { createWasender, Wasender } from 'wasenderapi';

export function getWasenderClient(): Wasender {
    const apiKey = process.env.WASENDER_API_KEY;
    const webhookSecret = process.env.WASENDER_WEBHOOK_SECRET;

    return createWasender(
        apiKey,
        undefined, // personalAccessToken
        undefined, // baseUrl (defaults to https://wasenderapi.com/api)
        undefined, // custom fetch
        { enabled: true, maxRetries: 2 }, // automatically retries on 429 using retry_after
        webhookSecret
    );
}

export async function sendWhatsAppMessage(to: string, text: string) {
    const wasender = getWasenderClient();

    // Ensure phone number has + prefix for E.164
    const cleanDigits = to.replace(/\D/g, '');
    const recipient = cleanDigits ? `+${cleanDigits}` : to;

    try {
        const result = await wasender.sendText({
            to: recipient,
            text,
        });
        return { success: true, result };
    } catch (error: any) {
        console.error('[WASENDER] Error sending message to', recipient, error?.message || error);
        return { success: false, error: error?.message || error };
    }
}
