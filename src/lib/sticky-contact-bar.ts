/**
 * Configuración de rutas excluidas y mensajes precargados de WhatsApp
 * para la barra de contacto fija global (StickyContactBar).
 */

export const STICKY_PHONE_HREF = 'tel:+34605118871';
export const STICKY_PHONE_DISPLAY = '+34 605 118 871';
export const STICKY_WHATSAPP_BASE = 'https://wa.me/34664364195';

/**
 * PASO 2 — Lista única de rutas donde NO se muestra la barra fija:
 * - /legal/* (aviso legal, privacidad, cookies, términos)
 * - /acuerdo-honorarios (modelo de hoja de encargo)
 * - /login (inicio de sesión)
 * - /checkout/* (formulario de pago Stripe y resumen/confirmación de encargo)
 * - /lawyer/* (registro de abogados, onboarding y panel privado de abogados)
 * - /admin/* (login de administración y formularios del panel de administración)
 */
export const HIDE_CONTACT_BAR: RegExp[] = [
    /^\/legal(\/|$)/,
    /^\/acuerdo-honorarios(\/|$)/,
    /^\/login(\/|$)/,
    /^\/checkout(\/|$)/,
    /^\/lawyer(\/|$)/,
    /^\/admin(\/|$)/,
];

export function shouldHideContactBar(pathname: string | null | undefined): boolean {
    if (!pathname) return false;
    return HIDE_CONTACT_BAR.some(regex => regex.test(pathname));
}

const SERVICE_WHATSAPP_MESSAGES: Record<string, string> = {
    '/alcoholemia': 'Hola, necesito un abogado por un delito de alcoholemia.',
    '/drogas': 'Hola, necesito un abogado por conducir bajo los efectos de drogas.',
    '/velocidad': 'Hola, necesito un abogado por un delito de exceso de velocidad.',
    '/sin-carnet': 'Hola, necesito un abogado por conducir sin carnet.',
    '/profesionales': 'Hola, soy conductor profesional y necesito un abogado.',
};

const DEFAULT_WHATSAPP_MESSAGE = 'Hola, necesito un abogado de guardia.';

/**
 * PASO 3 — Construye el texto precargado de WhatsApp según la ruta actual.
 * Para /juzgados/{slug}, utiliza el mapa dinámico slug -> judicial_district leído de la BD.
 */
export function getWhatsAppPreloadedText(
    pathname: string | null | undefined,
    courtDistrictsBySlug: Record<string, string> = {}
): string {
    if (!pathname) return DEFAULT_WHATSAPP_MESSAGE;

    const cleanPath = pathname.replace(/\/+$/, '') || '/';

    if (SERVICE_WHATSAPP_MESSAGES[cleanPath]) {
        return SERVICE_WHATSAPP_MESSAGES[cleanPath];
    }

    const juzgadoMatch = cleanPath.match(/^\/juzgados\/([^/]+)$/);
    if (juzgadoMatch) {
        const slug = decodeURIComponent(juzgadoMatch[1]).toLowerCase();
        const districtName = courtDistrictsBySlug[slug];
        if (districtName) {
            return `Hola, tengo un juicio rápido en ${districtName} y necesito un abogado.`;
        }
    }

    return DEFAULT_WHATSAPP_MESSAGE;
}

export function getWhatsAppHref(
    pathname: string | null | undefined,
    courtDistrictsBySlug: Record<string, string> = {}
): string {
    const text = getWhatsAppPreloadedText(pathname, courtDistrictsBySlug);
    return `${STICKY_WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

