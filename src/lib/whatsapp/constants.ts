import { PHONE_CALL_DISPLAY, PRIVACY_URL } from '@/lib/contact';

export const WHATSAPP_MESSAGES = {
    MENSAJE_A: `Hola, has contactado con Autoridad Legal, defensa penal en delitos de tráfico en Barcelona. Para que un abogado te ayude, ¿cómo te llamas? Tus datos se tratan de forma confidencial: ${PRIVACY_URL}`,
    MENSAJE_B: (nombre: string) =>
        `Gracias, ${nombre}. Cuéntanos brevemente qué ha pasado: qué ocurrió (alcoholemia, drogas, velocidad, sin carnet…), en qué municipio y si tienes citación para juicio rápido y para qué día.`,
    MENSAJE_C: (nombre: string) =>
        `Gracias, ${nombre}. Hemos recibido tu caso y un abogado te contactará en breve. Si es urgente o estás en comisaría, llama al abogado de guardia 24 h: ${PHONE_CALL_DISPLAY}.`,
};
