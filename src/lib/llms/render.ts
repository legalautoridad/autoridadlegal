import {
    SITE_BASE_URL,
    LLMS_NAP,
    LLMS_BLOCKQUOTE,
    LLMS_SERVICES,
} from './constants';
import {
    PAYMENT_METHODS,
    renderDatosClaveHonorariosLines,
    DEFENSE_POINTS_PRICING,
    STATUTORY_TAX_NOTE_SHORT,
} from '@/lib/pricing';
import { getLlmsCourtsData, getLlmsFullDataset } from './data';

/**
 * Shared header (H1 + blockquote + "Datos clave") used identically by both /llms.txt and /llms-full.txt.
 * Generates the Honorarios and Recargos lines dynamically from src/lib/config/pricing.ts.
 */
export function renderCabecera(): string[] {
    const [honorariosLine, recargosLine] = renderDatosClaveHonorariosLines();
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
        honorariosLine,
        recargosLine,
        '- Accidentes con daños a terceros o lesiones: presupuesto por escrito tras revisar el atestado.',
        '- Juzgado competente: el juicio rápido se celebra en el juzgado de guardia del partido judicial del lugar de los hechos.',
    ];
}

/**
 * Renders /llms.txt from Supabase data and shared constants/pricing.
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
        '## Recurso de multas y puntos del carnet (toda España)',
        '',
        `- [Recurso de multas y puntos del carnet](${DEFENSE_POINTS_PRICING.url}): Defensa administrativa telemática ante la DGT, Servei Català de Trànsit, Trafikoa, Servicio de Tráfico de Navarra, Ayuntamientos y organismos de recaudación (SUMA, BASE).`,
        '- Método: Oposición formal en vía administrativa mediante pliegos de alegaciones, auditoría metrológica y recursos ordinarios, impidiendo la firmeza registral de la detracción de puntos mientras se consolida la recuperación automática de los 12 puntos (art. 65.1 LTSV) o caduca el expediente.',
        `- Honorarios: ${DEFENSE_POINTS_PRICING.basePriceDisplay} de provisión base y ${DEFENSE_POINTS_PRICING.successBonusDisplay} de bono de éxito condicionado a conservar la vigencia del permiso. Los tributos aplicables se liquidan y detallan formalmente en la hoja de encargo previa.`,
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
        '### Precio por servicio (procurador de los tribunales incluido)',
    ];

    for (const svc of pricing.services) {
        lines.push(
            `- **${svc.name}** (${svc.url}): honorarios de ${svc.displayWithTaxLabel} para el supuesto base; los supuestos de mayor complejidad llevan suplementos fijos y tasados, comunicados por escrito y por adelantado.`
        );
    }

    lines.push('', '### Suplementos tasados');

    for (const addOn of Object.values(pricing.addOns)) {
        lines.push(
            `- **${addOn.name} (${addOn.displayWithTaxLabel})**: ${addOn.appliesToLabel}. ${addOn.description}`
        );
    }

    lines.push(
        '- **Accidentes con daños a terceros o lesiones**: presupuesto por escrito tras revisar el atestado.',
        `- **Régimen fiscal**: ${STATUTORY_TAX_NOTE_SHORT}`,
        '',
        '### Formas de pago',
        ...PAYMENT_METHODS.map(m => `- ${m}`),
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

    const puntosFaqs = serviceFaqsBySlug['defensa-puntos-carnet'] || [];
    lines.push(
        '',
        '### Recurso de multas y puntos del carnet (toda España)',
        `URL: ${DEFENSE_POINTS_PRICING.url}`,
        'Defensa administrativa telemática ante la DGT, Servei Català de Trànsit, Trafikoa, Navarra y Ayuntamientos.',
        `- ${DEFENSE_POINTS_PRICING.baseConcept}: ${DEFENSE_POINTS_PRICING.basePriceWithTaxLabel} (${DEFENSE_POINTS_PRICING.baseDescription})`,
        `- ${DEFENSE_POINTS_PRICING.successBonusConcept}: ${DEFENSE_POINTS_PRICING.successBonusWithTaxLabel} (${DEFENSE_POINTS_PRICING.successBonusDescription})`,
        DEFENSE_POINTS_PRICING.taxNote
    );
    if (puntosFaqs.length > 0) {
        lines.push('Preguntas frecuentes:');
        for (const faq of puntosFaqs) {
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
