import { PHONE_CALL_DISPLAY } from '@/lib/contact';

export const WHATSAPP_MESSAGES = {
    MENSAJE_A: `Hola, soy el asistente de Autoridad Legal, defensa penal en delitos de tráfico en Barcelona. ¿Cómo te llamas?
(Tus datos son confidenciales y solo se usan para atender tu consulta.)`,

    MENSAJE_A2: 'Gracias por contárnoslo. ¿Cómo te llamas?',

    MENSAJE_B: (nombre?: string | null) => {
        const prefix = nombre ? `Gracias, ${nombre}.` : 'Gracias.';
        return `${prefix} ¿Qué ha pasado? Cuéntanos qué ocurrió (alcoholemia, drogas, velocidad, sin carnet…), en qué municipio y si tienes citación para juicio rápido y para qué día.`;
    },

    MENSAJE_C: (nombre?: string | null) => {
        const prefix = nombre ? `Perfecto, ${nombre}.` : 'Perfecto.';
        return `${prefix} Un abogado te contactará en breve. Si es urgente o estás en comisaría, llama al abogado de guardia 24 h: ${PHONE_CALL_DISPLAY}.`;
    },
};
