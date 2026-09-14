import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { createStaticClient } from '../src/lib/supabase/server';
import { parseGpsCoords } from '../src/lib/db/cobertura';

async function generateA0Drafts() {
    console.log('🚀 Generating STAGE A0 Fillable Drafts for 25 Judicial Districts...');

    const supabase = createStaticClient();

    // 1. Fetch Courts, Locations, Interest Points
    const { data: courts, error: courtsErr } = await supabase.from('courts').select('*').order('slug');
    if (courtsErr || !courts) {
        console.error('Error fetching courts:', courtsErr);
        process.exit(1);
    }

    const { data: locs } = await supabase.from('locations').select('id, name, slug, court_id');
    const { data: ls } = await supabase.from('location_services').select('location_id').eq('web_published', true);
    const publishedLocIds = new Set((ls || []).map(r => r.location_id));

    const { data: pointsData } = await supabase.from('interest_points').select('*');

    const outputDir = path.join(process.cwd(), 'content/borradores/partidos-judiciales');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let generatedCount = 0;

    for (const court of courts) {
        const slug = court.slug;
        const courtName = court.official_name || court.name || `Partido Judicial de ${slug}`;

        // Get active published municipalities
        const districtLocs = (locs || [])
            .filter(l => l.court_id === court.id && publishedLocIds.has(l.id))
            .sort((a, b) => a.name.localeCompare(b.name, 'es'));

        const locIds = new Set(districtLocs.map(l => l.id));
        const districtPoints = (pointsData || [])
            .filter(p => locIds.has(p.location_id))
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));

        // GPS formatting
        const gpsObj = parseGpsCoords(court.gps_coords);
        const gpsFormatted = gpsObj ? `${gpsObj.lat}, ${gpsObj.lng}` : (court.gps_coords ? String(court.gps_coords) : 'No consta');

        // Warnings / Flags
        const warnings: string[] = [];
        if (!court.phone_guardia) {
            warnings.push('⚠️ **ALERTA DATOS:** `phone_guardia` es **nulo** en la base de datos (se muestra el teléfono general de los juzgados o requiere verificación humana).');
        } else {
            const digits = court.phone_guardia.replace(/\D/g, '');
            if (digits.length < 9) {
                warnings.push(`⚠️ **ALERTA DATOS:** \`phone_guardia\` tiene un formato atípico (\`${court.phone_guardia}\`).`);
            }
        }

        if (!court.address) {
            warnings.push('⚠️ **ALERTA DATOS:** `address` es nula en la base de datos.');
        }

        if (!court.fiscalia_address) {
            warnings.push('⚠️ **ALERTA DATOS:** `fiscalia_address` es nula en la base de datos.');
        }

        if (!gpsObj) {
            warnings.push('⚠️ **ALERTA DATOS:** Coordenadas GPS no válidas o ausentes.');
        }

        // Efficiency data / Building organization
        let buildingOrg = 'No consta desglose de sedes en la base de datos.';
        if (court.efficiency_data) {
            const eff = court.efficiency_data;
            const parts: string[] = [];
            if (eff.reforma) parts.push(`- **Organización / Reforma:** ${eff.reforma}`);
            if (eff.secciones) {
                if (typeof eff.secciones === 'object') {
                    parts.push('- **Secciones y Sedes:**');
                    Object.entries(eff.secciones).forEach(([key, val]) => {
                        const cleanKey = key.replace(/_/g, ' ');
                        parts.push(`  - *${cleanKey}:* ${val}`);
                    });
                } else {
                    parts.push(`- **Secciones:** ${eff.secciones}`);
                }
            }
            if (parts.length > 0) {
                buildingOrg = parts.join('\n');
            }
        }

        // Group interest points by category/class
        const pointsGrouped = new Map<string, typeof districtPoints>();
        districtPoints.forEach(p => {
            const cat = p.class || p.category || 'Puntos de Control y Comisarías';
            if (!pointsGrouped.has(cat)) {
                pointsGrouped.set(cat, []);
            }
            pointsGrouped.get(cat)!.push(p);
        });

        // Format points section
        let pointsMarkdown = 'No constan puntos de interés registrados en la base de datos para los municipios activos de este partido.';
        if (districtPoints.length > 0) {
            const pParts: string[] = [];
            pointsGrouped.forEach((pts, catName) => {
                pParts.push(`#### ${catName}`);
                pts.forEach(p => {
                    const desc = p.details || p.description ? ` — ${p.details || p.description}` : '';
                    const coords = (p.lat != null && p.lng != null) ? ` (GPS: ${p.lat}, ${p.lng})` : '';
                    pParts.push(`- **${p.name}**${desc}${coords}`);
                });
            });
            pointsMarkdown = pParts.join('\n');
        }

        // Build markdown content
        const markdownContent = `# ${courtName}

${warnings.length > 0 ? `${warnings.join('\n')}\n\n` : ''}> **[A RELLENAR ABOGADO]**
> *Entradilla:* ¿Qué distingue a este partido judicial en la práctica? ¿Qué debería saber un abogado que comparece por primera vez aquí?

---

## 1. Municipios que abarca

*(Datos objetivos de la base de datos — solo municipios activos)*

Este partido judicial engloba los siguientes **${districtLocs.length} municipios activos**:
${districtLocs.map(l => `- **${l.name}** (\`${l.slug}\`)`).join('\n')}

---

## 2. El juzgado

*(Datos objetivos DB & OKF)*

- **Órgano oficial:** ${courtName}
- **Dirección:** ${court.address || 'No consta'}
- **Teléfono general:** ${court.phone || 'No consta'}
- **Coordenadas GPS:** ${gpsFormatted}

### Estructura y organización del edificio
${buildingOrg}

> **[A RELLENAR ABOGADO]**
> - **Aparcamiento y acceso:** ¿Dónde aparcar razonablemente cerca? ¿Entrada principal vs entrada de guardia?
> - **Horarios reales:** ¿A qué hora abren realmente la puerta de guardia y empiezan los juicios rápidos?
> - **Planta y salas:** ¿En qué planta/sala se celebran las conformidades de seguridad vial?

---

## 3. Fiscalía

- **Dirección de Fiscalía:** ${court.fiscalia_address || 'No consta'}

> **[A RELLENAR ABOGADO]**
> - **Horarios y contacto:** ¿Cuál es la ventana real de atención de los fiscales en este partido?
> - **Dinámica de trabajo:** ¿Cómo se gestionan las conformidades previas con la fiscalía en este juzgado?

---

## 4. Juzgado de guardia

- **Teléfono de guardia:** ${court.phone_guardia || court.phone || 'No consta (verificar teléfono directo de guardia)'}
- **Protocolo de guardia (DB):** ${court.protocolo_guardia || 'No consta'}

> **[A RELLENAR ABOGADO]**
> - **Cronología real desde la detención:** Tiempos medios reales desde la detención/atestado policial hasta la comparecencia en el juzgado de guardia en este partido judicial.

---

## 5. Criterios del fiscal

> ⚠️ **NOTA IMPORTANTE DE CONTENIDO:** El texto anterior de \`prosecutor_criteria\` en la base de datos es un lote generado automáticamente. Se ha excluido de la versión pública y debe ser verificado o reemplazado íntegramente por el letrado, nunca expandido ni reutilizado.

> **[A RELLENAR ABOGADO]**
> - **Criterios reales de la Fiscalía:** Umbrales de tasa, peticiones de penas, conformidad habitual y aplicación de la reducción de 1/3 de condena en este partido judicial.

---

## 6. Actuación policial en la zona

### Puntos de control y registros oficiales (${districtPoints.length} puntos en DB)

${pointsMarkdown}

> **[A RELLENAR ABOGADO]**
> - **Cuerpo policial y operativas habituales:** Mossos d'Esquadra vs Policía Local, tramos con más controles, etilómetros utilizados y prácticas observadas en la zona.

---

## 7. Experiencia del despacho

> **[A RELLENAR ABOGADO]**
> - Observaciones prácticas directas y estrategia del despacho en el ${courtName}.

---

## 8. Por tipo de delito

### 8.1 Alcoholemia (#alcoholemia)
- **Honorarios base:** 980 € (IVA y procurador incluidos)

> **[A RELLENAR ABOGADO]**
> - Particularidades de tramitación y conformidad para delitos de alcoholemia en este partido judicial.

### 8.2 Drogas / Estupefacientes (#drogas)
- **Honorarios base:** 980 € (IVA y procurador incluidos)

> **[A RELLENAR ABOGADO]**
> - Particularidades de tramitación y conformidad para delitos de drogas en este partido judicial.

### 8.3 Exceso de velocidad (#velocidad)
- **Honorarios base:** 980 € (IVA y procurador incluidos)

> **[A RELLENAR ABOGADO]**
> - Particularidades de tramitación y conformidad para delitos de velocidad en este partido judicial.

### 8.4 Conducción sin carnet (#sin-carnet)
- **Honorarios base:** 980 € (IVA y procurador incluidos)

> **[A RELLENAR ABOGADO]**
> - Particularidades de tramitación y conformidad para conducción sin permiso en este partido judicial.

### 8.5 Conductores profesionales (#profesionales)
- **Honorarios base:** 1.480 € (IVA y procurador incluidos)

> **[A RELLENAR ABOGADO]**
> - Particularidades de tramitación y conformidad para conductores profesionales en este partido judicial.

---

## 9. Vídeo y transcripción

> **[A RELLENAR ABOGADO]**
> - **URL del Vídeo:** [A RELLENAR URL]
> - **Transcripción:** [A RELLENAR TRANSCRIPCIÓN]
`;

        const filePath = path.join(outputDir, `${slug}.md`);
        fs.writeFileSync(filePath, markdownContent, 'utf-8');
        generatedCount++;
        console.log(`  - [${generatedCount}/25] Generated ${slug}.md (${districtLocs.length} municipios, ${districtPoints.length} puntos)`);
    }

    console.log(`\n✅ Successfully generated all ${generatedCount} STAGE A0 fillable draft files in content/borradores/partidos-judiciales/`);
}

generateA0Drafts().catch(err => {
    console.error('Error generating STAGE A0 drafts:', err);
    process.exit(1);
});
