import { detectIncidentType, detectCity, hasCaseWords, isOutsideZone } from './classifier';
import { extractName } from './name-extractor';
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
    name?: string | null;
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
    const text = extracted.extractedText;

    const inMsg: ConversationItem = {
        direction: 'in',
        type: extracted.messageType,
        text,
        message_id: extracted.messageId,
        timestamp: now.toISOString(),
    };

    // 1. NEW LEAD (First message)
    if (!currentLead) {
        const foundName = extractName(text);
        const hasCase = hasCaseWords(text);
        const incidentType = detectIncidentType(text);
        let city = detectCity(text, locationNames);
        const outside = isOutsideZone(text);

        let concerns = text;
        if (hasCase || incidentType) {
            if (outside || !city) {
                city = null;
                concerns = `[REVISAR ZONA] ${text}`;
            }
        }

        // Case A: First message has BOTH name and case details
        if (foundName && hasCase) {
            return {
                isNew: true,
                phone: extracted.normalizedPhone,
                name: foundName,
                concerns,
                wa_state: 'done',
                incident_type: incidentType,
                city,
                inMsg,
                outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_C(foundName),
            };
        }

        // Case B: First message has name, but not case details
        if (foundName && !hasCase) {
            return {
                isNew: true,
                phone: extracted.normalizedPhone,
                name: foundName,
                concerns: text,
                wa_state: 'ask_incident',
                inMsg,
                outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_B(foundName),
            };
        }

        // Case C: First message has case details, but NO name
        if (!foundName && hasCase) {
            return {
                isNew: true,
                phone: extracted.normalizedPhone,
                concerns,
                wa_state: 'ask_name',
                incident_type: incidentType,
                city,
                inMsg,
                outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_A2,
            };
        }

        // Case D: First message is generic greeting (no name, no case)
        return {
            isNew: true,
            phone: extracted.normalizedPhone,
            concerns: text,
            wa_state: 'ask_name',
            inMsg,
            outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_A,
        };
    }

    // 2. EXISTING LEAD IN 'ask_name' STATE
    if (currentLead.wa_state === 'ask_name') {
        const foundName = extractName(text);

        // Count how many times the bot has already asked for the name
        const conversation: ConversationItem[] = Array.isArray(currentLead.conversation)
            ? currentLead.conversation
            : [];
        const timesNameAsked = conversation.filter(
            m => m.direction === 'out' && (m.text === WHATSAPP_MESSAGES.MENSAJE_A || m.text === WHATSAPP_MESSAGES.MENSAJE_A2)
        ).length;

        // Subcase 2.1: extractName returned a valid name
        if (foundName) {
            // Check if user also gave incident details in the same reply
            if (hasCaseWords(text)) {
                let combinedConcerns = currentLead.concerns ? `${currentLead.concerns}\n\n${text}` : text;
                const incident_type = detectIncidentType(combinedConcerns) || currentLead.incident_type || null;
                let city = detectCity(combinedConcerns, locationNames) || currentLead.city || null;
                const outside = isOutsideZone(combinedConcerns);

                if (outside || !city) {
                    city = null;
                    if (!combinedConcerns.startsWith('[REVISAR ZONA] ')) {
                        combinedConcerns = `[REVISAR ZONA] ${combinedConcerns}`;
                    }
                }

                return {
                    isNew: false,
                    name: foundName,
                    concerns: combinedConcerns,
                    wa_state: 'done',
                    incident_type,
                    city,
                    inMsg,
                    outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_C(foundName),
                };
            }

            return {
                isNew: false,
                name: foundName,
                wa_state: 'ask_incident',
                inMsg,
                outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_B(foundName),
            };
        }

        // Subcase 2.2: extractName returned null, but text contains case words
        if (hasCaseWords(text)) {
            let combinedConcerns = currentLead.concerns ? `${currentLead.concerns}\n\n${text}` : text;
            const incident_type = detectIncidentType(combinedConcerns) || currentLead.incident_type || null;
            let city = detectCity(combinedConcerns, locationNames) || currentLead.city || null;
            const outside = isOutsideZone(combinedConcerns);

            if (outside || !city) {
                city = null;
                if (!combinedConcerns.startsWith('[REVISAR ZONA] ')) {
                    combinedConcerns = `[REVISAR ZONA] ${combinedConcerns}`;
                }
            }

            // If we have already asked for the name >= 2 times, stop asking and proceed to done
            if (timesNameAsked >= 2) {
                return {
                    isNew: false,
                    name: null,
                    concerns: combinedConcerns,
                    wa_state: 'done',
                    incident_type,
                    city,
                    inMsg,
                    outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_C(null),
                };
            }

            // Otherwise, ask for name again with MENSAJE A2
            return {
                isNew: false,
                concerns: combinedConcerns,
                wa_state: 'ask_name',
                incident_type,
                city,
                inMsg,
                outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_A2,
            };
        }

        // Subcase 2.3: extractName returned null and does NOT look like a case
        return {
            isNew: false,
            name: null,
            wa_state: 'ask_incident',
            inMsg,
            outMsgTextToSend: WHATSAPP_MESSAGES.MENSAJE_B(null),
        };
    }

    // 3. EXISTING LEAD IN 'ask_incident' STATE
    if (currentLead.wa_state === 'ask_incident') {
        let combinedConcerns = currentLead.concerns ? `${currentLead.concerns}\n\n${text}` : text;
        const incident_type = detectIncidentType(combinedConcerns) || currentLead.incident_type || null;
        let city = detectCity(combinedConcerns, locationNames);
        const outside = isOutsideZone(combinedConcerns);

        if (outside || !city) {
            city = null;
            if (!combinedConcerns.startsWith('[REVISAR ZONA] ')) {
                combinedConcerns = `[REVISAR ZONA] ${combinedConcerns}`;
            }
        }

        const leadName = currentLead.name || null;

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

    // 4. EXISTING LEAD IN 'done' STATE
    let combinedConcerns = currentLead.concerns ? `${currentLead.concerns}\n\n${text}` : text;
    let city = currentLead.city || detectCity(combinedConcerns, locationNames);
    const outside = isOutsideZone(combinedConcerns);

    if (outside || !city) {
        city = null;
        if (!combinedConcerns.startsWith('[REVISAR ZONA] ')) {
            combinedConcerns = `[REVISAR ZONA] ${combinedConcerns}`;
        }
    }

    const conversation: ConversationItem[] = Array.isArray(currentLead.conversation)
        ? currentLead.conversation
        : [];
    const outMessages = conversation.filter(m => m.direction === 'out');
    const lastOut = outMessages[outMessages.length - 1];
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const shouldResendC = !lastOut?.timestamp || now.getTime() - new Date(lastOut.timestamp).getTime() > twelveHoursMs;

    const leadName = currentLead.name || null;

    return {
        isNew: false,
        concerns: combinedConcerns,
        city,
        wa_state: 'done',
        inMsg,
        outMsgTextToSend: shouldResendC ? WHATSAPP_MESSAGES.MENSAJE_C(leadName) : null,
    };
}
