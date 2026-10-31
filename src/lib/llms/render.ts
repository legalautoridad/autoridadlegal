import {
    SITE_BASE_URL,
    LLMS_NAP,
    LLMS_BLOCKQUOTE,
    LLMS_SERVICES,
    LLMS_PAYMENT_METHODS,
} from './constants';
import { getLlmsCourtsData, getLlmsFullDataset } from './data';

/**
 * Shared header (H1 + blockquote + "Datos clave") used identically by both /llms.txt and /llms-full.txt.
 */
export function renderCabecera(): string[] {
    return [
        '# Autoridad Legal',
        '',
        LLMS_BLOCKQUOTE,
        '',
        'Datos clave:',
        '',
        `- Ámbito: ${LLMS_NAP.ambito}`,
        `- Dirección: ${LLMS_NAP.direccion}.`,
        `- Teléfono de guardia del abogado (24 h): ${LLMS_NAP.telefonoGuardiaDisplay}.`,
        `- WhatsApp de triaje (asistente automático, 24 h): ${LLMS_NAP.whatsappDisplay}.`,
        `- Email: ${LLMS_NAP.email}.`,
        '- Honorarios: precio cerrado de 980 € (IVA y procurador incluidos) para el supuesto base (primer delito con conformidad en juicio rápido) en alcoholemia, drogas, velocidad y sin carnet; 1.480 € para conductores profesionales.',
        '- Los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado: reincidencia +200 €; juicio sin conformidad +300 € (no aplica a profesionales); riesgo de prisión efectiva +300 €; asistencia urgente al detenido en comisaría o juzgado de guardia +500 €.',
        '- Accidentes con daños a terceros o lesiones: presupuesto por escrito tras revisar el atestado.',
        '- Juzgado competente: el juicio rápido se celebra en el juzgado de guardia del partido judicial del lugar de los hechos.',
    ];
}

function formatEuroPrice(priceStr: string): string {
    const num = Math.round(Number(priceStr));
    if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return String(num);
}

/**
 * Renders /llms.txt from Supabase data and shared constants.
 */
export async function renderLlmsTxt(): Promise<string> {
    const courts = await getLlmsCourtsData();

    const lines: string[] = [
        ...renderCabecera(),
        '',
        '## Servicios',
        '',
        ...LLMS_SERVICES.map(s => `- [${s.title}](${s.url}): ${s.summary}`),
        '',
        '## Honorarios y contacto',
        '',
        `- [Honorarios](${SITE_BASE_URL}/honorarios): Precios cerrados, recargos tasados y formas de pago.`,
        `- [${LLMS_NAP.abogadoNombre}](${LLMS_NAP.abogadoPerfilUrl}): Abogado responsable, ICAB n.º ${LLMS_NAP.abogadoIcab}.`,
        `- [Guardia 24 h](${LLMS_NAP.telefonoGuardiaHref}): Teléfono de guardia del abogado.`,
        `- [WhatsApp](${LLMS_NAP.whatsappHref}): Triaje inicial 24 h con asistente automático.`,
        '',
        '## Juzgados de guardia por partido judicial',
        '',
        `- [Directorio de juzgados](${SITE_BASE_URL}/juzgados): Qué juzgado de guardia corresponde a cada municipio de la provincia de Barcelona.`,
    ];

    for (const c of courts) {
        const courtUrl = `${SITE_BASE_URL}/juzgados/${c.slug}`;
        if (c.slug === 'barcelona') {
            lines.push(`- [${c.judicialDistrict}](${courtUrl}): Juzgado de guardia de Barcelona ciudad.`);
        } else {
            const n = c.municipalities.length;
            const label = n === 1 ? '1 municipio' : `${n} municipios`;
            lines.push(
                `- [${c.judicialDistrict}](${courtUrl}): Partido judicial de ${c.judicialDistrict} (${label}): ${c.municipalities.join(', ')}.`
            );
        }
    }

    lines.push(
        '',
        '## Glosario',
        '',
        `- [Glosario penal de tráfico](${SITE_BASE_URL}/glosario): Definiciones de los conceptos del procedimiento penal por delitos contra la seguridad vial.`,
        '',
        '## Optional',
        '',
        `- [Versión completa](${SITE_BASE_URL}/llms-full.txt): Honorarios detallados, preguntas frecuentes de cada servicio, juzgados de guardia con dirección y municipios, y glosario completo.`,
        `- [Perfil profesional del abogado](${LLMS_NAP.abogadoWebPersonal}): Web personal de ${LLMS_NAP.abogadoNombre}.`
    );

    return lines.join('\n') + '\n';
}

/**
 * Renders /llms-full.txt from Supabase data and shared constants/pricing.
 */
export async function renderLlmsFull(): Promise<string> {
    const { courts, serviceFaqsBySlug, homepageFaqs, glossaryTerms, pricing } = await getLlmsFullDataset();

    const lines: string[] = [
        ...renderCabecera(),
        '',
        '## Honorarios',
        `URL: ${SITE_BASE_URL}/honorarios`,
        '',
        '### Precio por servicio (IVA y procurador incluidos)',
    ];

    for (const svc of pricing.services) {
        const formattedPrice = formatEuroPrice(svc.basePrice);
        lines.push(
            `- **${svc.name}** (${svc.url}): precio cerrado de ${formattedPrice} € (IVA y procurador incluidos) para el supuesto base; los supuestos de mayor complejidad llevan recargos fijos y tasados, comunicados por escrito y por adelantado.`
        );
    }

    lines.push('', '### Recargos tasados (IVA incluido)');

    for (const addOn of Object.values(pricing.addOns)) {
        const formattedAddOnPrice = formatEuroPrice(addOn.price);
        const appliesToProfesionales = pricing.services
            .find(s => s.slug === 'profesionales')
            ?.applicableAddOns.includes(addOn.id);
        const scopeLabel = appliesToProfesionales
            ? 'Aplica a los 5 servicios (alcoholemia, drogas, velocidad, sin carnet y conductores profesionales).'
            : 'Aplica a los 4 servicios base (alcoholemia, drogas, velocidad y sin carnet; no aplica a profesionales).';
        lines.push(`- **${addOn.name} (+${formattedAddOnPrice} €)**: ${scopeLabel} ${addOn.description}`);
    }

    lines.push(
        '- **Accidentes con daños a terceros o lesiones**: presupuesto por escrito tras revisar el atestado.',
        '',
        '### Formas de pago',
        ...LLMS_PAYMENT_METHODS.map(m => `- ${m}`),
        '',
        '## Servicios'
    );

    for (const svcMeta of LLMS_SERVICES) {
        const faqs = serviceFaqsBySlug[svcMeta.slug] || [];
        lines.push(
            '',
            `### ${svcMeta.title}`,
            `URL: ${svcMeta.url}`,
            svcMeta.summary,
            'Preguntas frecuentes:'
        );

        for (const faq of faqs) {
            lines.push(`**P:** ${faq.question.trim()}`);
            lines.push(`**R:** ${faq.answer.trim()}`);
        }
    }

    lines.push('', '## Preguntas frecuentes generales');

    for (const faq of homepageFaqs) {
        lines.push(`**P:** ${faq.question.trim()}`);
        lines.push(`**R:** ${faq.answer.trim()}`);
    }

    lines.push('', '## Juzgados de guardia por partido judicial');

    for (const c of courts) {
        const courtUrl = `${SITE_BASE_URL}/juzgados/${c.slug}`;
        const n = c.municipalities.length;
        lines.push(
            '',
            `### ${c.judicialDistrict}`,
            `URL: ${courtUrl}`,
            `Dirección del juzgado: ${c.address}`,
            `Municipios (${n}): ${c.municipalities.join(', ')}`
        );
    }

    lines.push('', '## Glosario');

    for (const term of glossaryTerms) {
        const termUrl = `${SITE_BASE_URL}/glosario/${term.slug}`;
        const cleanDesc = (term.description || '').replace(/\r?\n+/g, ' ').trim();
        lines.push('', `### ${term.name}`, cleanDesc, `URL: ${termUrl}`);
    }

    return lines.join('\n') + '\n';
}

