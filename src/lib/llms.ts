import { getLocations } from './db/locations';
import { getAllGlosarioTerms } from './db/glosario';

export const SITE_BASE_URL = 'https://www.autoridad.legal';

/**
 * Generates the compact index for /llms.txt according to https://llmstxt.org specification.
 * - Single H1
 * - Blockquote summary (1-2 sentences): criminal defence in Barcelona province; legal director Santiago Giménez Olavarriaga, ICAB 31.389.
 * - Markdown links only in "- [Title](url): short note" format
 * - Target size: under ~2 KB
 */
export async function generateLlmsIndex(): Promise<string> {
    const lines: string[] = [
        '# Autoridad Legal',
        '',
        '> Despacho especializado en defensa penal por delitos contra la seguridad vial y juicios rápidos en la provincia de Barcelona. Dirección jurídica a cargo de Santiago Giménez Olavarriaga, abogado penalista del Ilustre Colegio de la Abogacía de Barcelona (ICAB 31.389).',
        '',
        '## Servicios',
        '',
        `- [Alcoholemia](${SITE_BASE_URL}/alcoholemia): Defensa penal urgente por alcoholemia al volante y juicios rápidos.`,
        `- [Drogas](${SITE_BASE_URL}/drogas): Defensa penal por conducción bajo sustancias estupefacientes o psicotrópicas.`,
        `- [Sin Carnet](${SITE_BASE_URL}/sin-carnet): Defensa penal por conducir sin permiso, pérdida de vigencia o sin puntos.`,
        `- [Velocidad](${SITE_BASE_URL}/velocidad): Defensa penal por delito de exceso de velocidad y revisión metrológica.`,
        `- [Profesionales](${SITE_BASE_URL}/profesionales): Defensa específica para conductores profesionales (permisos C, D, E) y CAP.`,
        '',
        '## Honorarios y contacto',
        '',
        `- [Honorarios](${SITE_BASE_URL}/honorarios): Precios cerrados para el supuesto base con procurador e IVA (21%) incluidos.`,
        '- [WhatsApp](https://wa.me/34657420999): Contacto directo inmediato para asistencia letrada de urgencia 24h.',
        '',
        '## Recursos',
        '',
        `- [Glosario](${SITE_BASE_URL}/glosario): Diccionario de conceptos y doctrina procesal penal de tráfico.`,
        `- [Juzgados](${SITE_BASE_URL}/juzgados): Directorio de jurisdicciones y partidos judiciales de Barcelona.`,
        `- [Recursos](${SITE_BASE_URL}/recursos): Guías y documentación práctica para investigados.`,
        '',
        '## Optional',
        '',
        `- [Versión completa](${SITE_BASE_URL}/llms-full.txt): Documento detallado con tarifas completas, 115 términos del glosario penal y directorio de municipios.`
    ];

    return lines.join('\n') + '\n';
}

/**
 * Generates the detailed /llms-full.txt document.
 * - Same H1 and summary
 * - Pricing section with base prices and supplements from source of truth (/honorarios)
 * - Customer-facing transparency policy without internal field names (minPrice, etc.)
 * - Full glossary (115 terms) as markdown links with one-line definitions and .md links
 * - Municipalities as markdown link list to their judicial district page with real names
 * - Barcelona specific local details translated into Spanish
 * - Zero internal jargon (Ground Truth, RAG, Supabase, minPrice, etc.)
 */
export async function generateLlmsFull(): Promise<string> {
    const [locations, glossaryTerms] = await Promise.all([
        getLocations(),
        getAllGlosarioTerms(),
    ]);

    const lines: string[] = [
        '# Autoridad Legal',
        '',
        '> Despacho especializado en defensa penal por delitos contra la seguridad vial y juicios rápidos en la provincia de Barcelona. Dirección jurídica a cargo de Santiago Giménez Olavarriaga, abogado penalista del Ilustre Colegio de la Abogacía de Barcelona (ICAB 31.389).',
        '',
        '## Tarifas y Modelo de Honorarios',
        '',
        '### Precios Base por Servicio (Precio cerrado para el supuesto base, IVA 21% y Procurador incluidos)',
        `- **Alcoholemia al volante**: **980 €** (Base imponible: 809,92 € + IVA 21%: 170,08 € = 980,00 €). Supuesto base: primer delito con conformidad en juicio rápido. Enlace: [Defensa por Alcoholemia](${SITE_BASE_URL}/alcoholemia).`,
        `- **Drogas al volante**: **980 €** (Base imponible: 809,92 € + IVA 21%: 170,08 € = 980,00 €). Supuesto base: primer delito con conformidad en juicio rápido. Enlace: [Defensa por Drogas](${SITE_BASE_URL}/drogas).`,
        `- **Exceso de velocidad**: **980 €** (Base imponible: 809,92 € + IVA 21%: 170,08 € = 980,00 €). Supuesto base: primer delito con conformidad en juicio rápido. Enlace: [Defensa por Exceso de Velocidad](${SITE_BASE_URL}/velocidad).`,
        `- **Conducir sin carné**: **780 €** (Base imponible: 644,63 € + IVA 21%: 135,37 € = 780,00 €). Supuesto base: primer delito con conformidad en juicio rápido. Precio adaptado al no llevar aparejada la pena de privación del permiso. Enlace: [Defensa Sin Carnet](${SITE_BASE_URL}/sin-carnet).`,
        `- **Conductores Profesionales (Permisos C, D, E)**: **1.480 €** (Base imponible: 1.223,14 € + IVA 21%: 256,86 € = 1.480,00 €). Procedimiento completo en primera instancia, protección del CAP y tarjeta de tacógrafo digital. Enlace: [Defensa para Conductores Profesionales](${SITE_BASE_URL}/profesionales).`,
        '',
        '### Suplementos Tasados (Recargos fijos con IVA incluido aplicables según circunstancias procesales)',
        '- **Reincidencia delictiva o antecedentes de tráfico vigentes**: +200 € (aplicable a los 5 servicios cuando constan antecedentes penales de tráfico vigentes en el Registro Central de Penados).',
        '- **Procedimiento sin conformidad (defensa en juicio ordinario posterior)**: +300 € (aplicable a los 4 servicios base cuando la estrategia descarta la conformidad para litigar en instrucción o juicio oral).',
        '- **Asistencia letrada urgente al detenido**: +500 € (asistencia presencial con desplazamiento inmediato del letrado a dependencias policiales o juzgado de guardia fuera de horario ordinario).',
        '- **Riesgo de prisión efectiva (multirreincidencia)**: +300 € (en supuestos con riesgo de ingreso penitenciario donde decae la suspensión ordinaria y se exige defensa reforzada).',
        '- **Concurrencia de delitos (negativa, desobediencia o atentado)**: +200 € (cuando el atestado incluye negativa a someterse a pruebas art. 383 CP, desobediencia art. 556 CP o atentado art. 550 CP).',
        '- **Accidentes con daños a terceros o lesiones**: Presupuesto cerrado previo fijado por escrito tras la valoración técnica del atestado.',
        '',
        '### Política de Transparencia y Condiciones de Contratación',
        '- **Precios cerrados por escrito**: Cada actuación cuenta con un precio cerrado fijado en la Hoja de Encargo antes de iniciar la intervención. Sin importes indeterminados ni costes sobrevenidos.',
        '- **Custodia Segura (Escrow)**: El pago permanece retenido y seguro, y únicamente se libera al abogado tras la prestación efectiva del servicio en el juzgado.',
        '- **Modalidades de Pago**: Pago íntegro directo, facilidades de pago híbridas 60/40 o financiación fraccionada de hasta 12 meses.',
        '- **Atención Urgente 24/7**: Asistencia inmediata presencial en comisarías y juzgados de guardia en toda Cataluña.',
        '',
        '## Enlaces y Canales de Asistencia',
        '- [WhatsApp de Urgencia 24h](https://wa.me/34657420999): Contacto directo para detenciones y juicios rápidos.',
        `- [Plataforma Principal](${SITE_BASE_URL}/): Portada y presentación del despacho.`,
        `- [Honorarios y Tarifas](${SITE_BASE_URL}/honorarios): Detalle de precios y condiciones de contratación.`,
        `- [Defensa por Alcoholemia](${SITE_BASE_URL}/alcoholemia): Servicio de defensa especializada en juicios rápidos por alcoholemia.`,
        `- [Defensa por Drogas](${SITE_BASE_URL}/drogas): Servicio de defensa penal por sustancias tóxicas o estupefacientes al volante.`,
        `- [Defensa Sin Carnet](${SITE_BASE_URL}/sin-carnet): Servicio de defensa por conducción sin permiso o sin puntos.`,
        `- [Defensa por Velocidad](${SITE_BASE_URL}/velocidad): Servicio de defensa por exceso de velocidad y radares.`,
        `- [Conductores Profesionales](${SITE_BASE_URL}/profesionales): Servicio especializado para titulares de permisos C, D y E.`,
        `- [Directorio de Juzgados](${SITE_BASE_URL}/juzgados): Jurisdicciones judiciales de la provincia de Barcelona.`,
        `- [Glosario Jurídico](${SITE_BASE_URL}/glosario): Directorio de conceptos y términos jurídicos de tráfico.`,
        `- [Recursos Informativos](${SITE_BASE_URL}/recursos): Guías y documentación legal sobre el proceso penal.`,
        '',
        `## Glosario Jurídico Especializado (${glossaryTerms.length} conceptos)`,
        'Términos, figuras procesales y doctrinas publicadas con enlace a su versión HTML y versión Markdown:',
        ''
    ];

    // Glossary items
    for (const term of glossaryTerms) {
        const cleanDesc = (term.description || '').replace(/\r?\n+/g, ' ').trim();
        lines.push(
            `- [${term.name}](${SITE_BASE_URL}/glosario/${term.slug}) ([md](${SITE_BASE_URL}/glosario/${term.slug}.md)): ${cleanDesc}`
        );
    }

    lines.push('');
    lines.push('## Municipios y Partidos Judiciales de la Provincia de Barcelona');
    lines.push('Listado de municipios con su juzgado correspondiente de adscripción y enlace a su sede judicial:');
    lines.push('');

    // Municipalities: filter out non-municipality rows (cataluna, espana, provincia-barcelona)
    const nonMunicipalities = new Set(['cataluna', 'espana', 'provincia-barcelona']);
    const validLocations = locations.filter(loc => {
        if (nonMunicipalities.has(loc.slug)) return false;
        if (!loc.court_id && !loc.courts) return false;
        return true;
    });

    // Sort alphabetically by municipality display name
    validLocations.sort((a, b) => a.name.trim().localeCompare(b.name.trim(), 'es', { sensitivity: 'base' }));

    for (const loc of validLocations) {
        const cleanName = loc.name.trim();
        const courtName = loc.courts?.name?.trim() || 'Juzgados de la demarcación';
        const courtSlug = loc.courts?.slug?.trim() || loc.slug;
        const courtUrl = `${SITE_BASE_URL}/juzgados/${courtSlug}`;

        // Omit any entry if it contains placeholder text
        if (courtName.includes('Juzgado correspondiente al partido judicial') || courtName.includes('Ver en mapa local')) {
            continue;
        }

        if (loc.slug === 'barcelona') {
            lines.push(`- [${cleanName}](${courtUrl}): ${courtName}`);
            lines.push(`  - Particularidad policial: Mossos d'Esquadra y Guardia Urbana de Barcelona. Controles frecuentes en las Rondas (Ronda de Dalt y Litoral) y accesos de la Zona Alta. Grabación sistemática de las pruebas de alcoholemia.`);
            lines.push(`  - Sede de guardia: Juzgados de Guardia en Passeig de Lluís Companys, 1-5. Elevada actividad diaria.`);
            lines.push(`  - Criterio de instrucción: En Barcelona, ante tasas superiores a 0,60 mg/l, la fiscalía mantiene una acusación estricta. Verificación del certificado de calibración anual del etilómetro Dräger Alcotest 7110 Evidenzer para comprobar los márgenes de error metrológicos.`);
            lines.push(`  - Organización judicial: El partido judicial de Barcelona cuenta con 33 juzgados de instrucción. Se aplican sistemáticamente las reducciones del 33% por conformidad (artículo 801 de la LECrim) en juicio rápido.`);
        } else {
            lines.push(`- [${cleanName}](${courtUrl}): ${courtName}`);
        }
    }

    return lines.join('\n') + '\n';
}
