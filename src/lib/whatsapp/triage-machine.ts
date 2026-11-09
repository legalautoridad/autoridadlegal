import { detectIncidentType, detectCity } from './classifier';
import { WHATSAPP_MESSAGES } from './constants';

export interface ConversationItem {
    direction: 'in' | 'out';
    type: string;
    text: string;
    message_id?: string | null;
    timestamp: string;
}

export interface ExtractedWhatsAppMessage {
    messageId: string | null;
    remoteJid: string;
    normalizedPhone: string;
    fromMe: boolean;
    isGroupOrBroadcast: boolean;
    messageType: string;
    extractedText: string;
}

export function extractMessageData(payload: any): ExtractedWhatsAppMessage {
    const rawMessages = payload?.data?.messages;
    const messageObj = Array.isArray(rawMessages) ? rawMessages[0] : rawMessages || payload?.data;

    const key = messageObj?.key;
    const messageId = key?.id || messageObj?.id || null;
    const remoteJid = key?.remoteJid || messageObj?.remoteJid || '';
    const fromMe = key?.fromMe === true || payload?.data?.fromMe === true || false;

    const isGroupOrBroadcast =
        remoteJid.endsWith('@g.us') ||
        remoteJid.endsWith('@broadcast') ||
        remoteJid.endsWith('@newsletter') ||
        remoteJid === 'status@broadcast';

    // Phone extraction
    let rawPhone = '';
    if (remoteJid.endsWith('@lid')) {
        const pn = key?.cleanedSenderPn || key?.senderPn || messageObj?.cleanedSenderPn || messageObj?.senderPn;
        rawPhone = pn ? String(pn) : remoteJid;
    } else {
        rawPhone = remoteJid.includes('@') ? remoteJid.split('@')[0] : remoteJid;
    }

    const digits = rawPhone.replace(/\D/g, '');
    const normalizedPhone = digits ? `+${digits}` : rawPhone;

    // Type and text extraction
    const message = messageObj?.message;
    let messageType = 'text';
    let extractedText = '';

    if (message) {
        if (typeof message.conversation === 'string' && message.conversation) {
            messageType = 'text';
            extractedText = message.conversation;
        } else if (message.extendedTextMessage?.text) {
            messageType = 'text';
            extractedText = message.extendedTextMessage.text;
        } else if (message.audioMessage) {
            messageType = 'audio';
            extractedText = '[Audio recibido]';
        } else if (message.imageMessage) {
            messageType = 'image';
            extractedText = message.imageMessage.caption
                ? `[Imagen recibida: ${message.imageMessage.caption}]`
                : '[Imagen recibida]';
        } else if (message.documentMessage || message.documentWithCaptionMessage) {
            messageType = 'document';
            extractedText = '[Documento recibido]';
        } else if (message.locationMessage || message.liveLocationMessage) {
            messageType = 'location';
            const loc = message.locationMessage || message.liveLocationMessage;
            extractedText = `[Ubicación: lat ${loc?.degreesLatitude}, lon ${loc?.degreesLongitude}]`;
        } else if (message.videoMessage) {
            messageType = 'video';
            extractedText = '[Vídeo recibido]';
        } else if (message.stickerMessage) {
            messageType = 'sticker';
            extractedText = '[Sticker recibido]';
        } else if (typeof messageObj?.messageBody === 'string' && messageObj.messageBody) {
            messageType = 'text';
            extractedText = messageObj.messageBody;
        } else {
            messageType = 'other';
            extractedText = '[Archivo recibido]';
        }
    } else if (typeof messageObj?.messageBody === 'string' && messageObj.messageBody) {
        messageType = 'text';
        extractedText = messageObj.messageBody;
    } else {
        messageType = 'other';
        extractedText = '[Mensaje recibido]';
    }

    return {
        messageId,
        remoteJid,
        normalizedPhone,
        fromMe,
        isGroupOrBroadcast,
        messageType,
        extractedText,
    };
}

export interface LeadStateUpdate {
    isNew: boolean;
    name?: string;
    phone?: string;
    concerns?: string;
    wa_state: 'ask_name' | 'ask_incident' | 'done';
    incident_type?: string | null;
    city?: string | null;
    inMsg: ConversationItem;
    outMsgTextToSend: string | null;
}

export function processTriageStep(
    currentLead: any | null,
    extracted: ExtractedWhatsAppMessage,
    locationNames: string[] = [],
    now: Date = new Date()
): LeadStateUpdate {
    const inMsg: ConversationItem = {
        direction: 'in',
        type: extracted.messageType,
        text: extracted.extractedText,
        message_id: extracted.messageId,
        timestamp: now.toISOString(),
    };

    // 1. If NO existing lead -> create new lead, state = ask_name, send MENSAJE_A
    if (!currentLead) {
        return {
            isNew: true,
            phone: extracted.normalizedPhone,
            concerns: extracted.extractedText,
            wa_state: 'ask_name',
            inMsg,
            outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_A,
        };
    }

    const state = currentLead.wa_state;

    // 2. If state is 'ask_name' -> extract name, state = ask_incident, send MENSAJE_B
    if (state === 'ask_name') {
        const name = extracted.extractedText.slice(0, 80).trim() || 'estimado/a';
        return {
            isNew: false,
            name,
            wa_state: 'ask_incident',
            inMsg,
            outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_B(name),
        };
    }

    // 3. If state is 'ask_incident' -> append concerns, state = done, classify incident & city, send MENSAJE_C
    if (state === 'ask_incident') {
        const combinedConcerns = currentLead.concerns
            ? `${currentLead.concerns}\n\n${extracted.extractedText}`
            : extracted.extractedText;

        const incident_type = detectIncidentType(combinedConcerns);
        const city = detectCity(combinedConcerns, locationNames);
        const leadName = currentLead.name || 'estimado/a';

        return {
            isNew: false,
            concerns: combinedConcerns,
            wa_state: 'done',
            incident_type,
            city,
            inMsg,
            outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_C(leadName),
        };
    }

    // 4. If state is 'done' -> append concerns, only resend MENSAJE_C if > 12h since last out message
    const combinedConcerns = currentLead.concerns
        ? `${currentLead.concerns}\n\n${extracted.extractedText}`
        : extracted.extractedText;

    const conversation: ConversationItem[] = Array.isArray(currentLead.conversation)
        ? currentLead.conversation
        : [];

    const outMessages = conversation.filter((m) => m.direction === 'out');
    const lastOut = outMessages[outMessages.length - 1];
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const shouldResendC = !lastOut?.timestamp || now.getTime() - new Date(lastOut.timestamp).getTime() > twelveHoursMs;

    const leadName = currentLead.name || 'estimado/a';

    return {
        isNew: false,
        concerns: combinedConcerns,
        wa_state: 'done',
        inMsg,
        outMsgTextToSend: shouldResendC ? WHATSAPP_MESSAGES.MENSAJE_C(leadName) : null,
    };
}

