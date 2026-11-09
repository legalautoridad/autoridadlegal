# PROMPT PARA ANTIGRAVITY — Incorporar `areaServed` (partido judicial → municipios) al JSON-LD de las páginas de juzgado

## Contexto

Proyecto: **autoridad.legal** (Next.js 16 App Router + Supabase). Antes de empezar, lee `AI_GUIDELINES.md`, `PROJECT_STATE.md` y `TECHNICAL_SPECS.md`, y sigue el protocolo de Git que indican: rama nueva y commits atómicos convencionales, nunca en `main`.

Rama: `feat/areaserved-jsonld-juzgados`

Fuente de datos: **`docs/areaserved-fuente.md`**, un documento en bruto que contiene, para cada partido judicial de la provincia de Barcelona:
- URL de Wikipedia y QID de Wikidata del partido judicial
- dirección del juzgado de guardia, enlace de Google Maps y Plus Code
- lista de municipios del partido, cada uno con su URL de Wikipedia y su QID de Wikidata

El documento empieza con un **ejemplo de JSON-LD (Martorell)** que sirve de inspiración, pero **no se debe copiar literalmente**: tiene errores (los detallo más abajo).

### Dónde está el código hoy
- `src/app/juzgados/[slug]/page.tsx`: renderiza las 25 páginas de partido judicial y construye un `@graph` con `WebPage`, `Courthouse` (dentro de `about`), `BreadcrumbList` y `FAQPage`. Ahora mismo `areaServed` cuelga de `WebPage` como una lista de `City` con solo `name`. **Esto es incorrecto en schema.org**: `areaServed` no es una propiedad de `WebPage`.
- `src/lib/db/district-content.ts` → `getDistrictData(slug)`: lee `courts` y `locations` (municipios, `location_type = 'municipio'`, excluye `bellaterra-uab`) de Supabase.
- `src/lib/seo/home-jsonld.ts`: aquí se define el nodo global `LegalService/Organization` con `@id` `https://www.autoridad.legal/#organization`. **No crear otro Organization**; se referencia por `@id`.
- `src/app/(legal-silos)/[service]/[city]/page.tsx`: las páginas de población **no tienen contenido propio** (hacen 301 a `/juzgados/{partido}` vía `src/data/municipio-a-partido.json` y el middleware). Por tanto, **el areaServed por población se expresa dentro de la página del partido**, mediante `containsPlace`. No hay que crear páginas nuevas.

---

## Objetivo

En cada página `/juzgados/[slug]`, añadir un nodo de servicio con un `areaServed` rico y verificable, que enlace con entidades de Wikidata:

```
Service (por partido)
 ├─ provider  → { "@id": "https://www.autoridad.legal/#organization" }
 ├─ areaServed → AdministrativeArea "Partido judicial de X"
 │     ├─ sameAs: [wikidata partido, wikipedia partido]
 │     ├─ containedInPlace: provincia de Barcelona (Q81949)
 │     └─ containsPlace: [ City {name, sameAs:[wikidata, wikipedia]} … todos los municipios del partido ]
 └─ (relacionado con) Courthouse existente (#courthouse) + hasMap
```

---

## Tareas

### 1. Persistir los identificadores (migración Supabase)
Crea `supabase/migrations/2026110X_add_wikidata_to_courts_locations.sql` con:
- `courts`: `wikidata_qid TEXT`, `wikipedia_url TEXT`, `maps_url TEXT`, `plus_code TEXT` (todas nullable)
- `locations`: `wikidata_qid TEXT`, `wikipedia_url TEXT` (nullable)
- Un `CHECK` opcional `wikidata_qid ~ '^Q[0-9]+$'`.

No toques columnas existentes. Sigue el estilo de las migraciones que ya hay.

### 2. Parsear la fuente y generar un JSON intermedio revisable
Script `scripts/build-areaserved-data.ts`, ejecutado con `npx tsx`:
1. Lee `docs/areaserved-fuente.md`. El markdown es irregular: tiene escapes `\_`, `\:`, `\!` y `www\.`, enlaces en formato `[texto](url)`, viñetas y nombres en castellano o en catalán. Desescápalo antes de parsear.
2. Genera `src/data/areaserved.json` con esta forma:
   ```json
   { "<court_slug>": { "partido": { "qid": "Q…", "wikipedia": "…", "mapsUrl": "…", "plusCode": "…" },
                       "municipios": [ { "locationSlug": "…", "nameSource": "…", "qid": "Q…", "wikipedia": "…" } ] } }
   ```
3. **Empareja cada municipio con la tabla `locations`** (por `court_id` del partido). Los nombres de la fuente vienen a menudo en castellano ("San Andrés de Llavaneras", "Tarrasa", "Esparraguera") y en la BD en catalán. Empareja así:
   a) primero, normalizando el nombre (sin acentos, minúsculas, sin artículos);
   b) si falla, usando la etiqueta `ca` / `es` del QID de Wikidata;
   c) si sigue fallando, márcalo en el informe y **no inventes el emparejamiento**.
4. Limpia las URLs de Google Maps: quita los parámetros de tracking (`g_ep`, `entry`, `authuser`). Mejor aún, constrúyelas a partir del `place_id`/CID si se puede extraer. Si no, usa `https://www.google.com/maps/search/?api=1&query=…` como ya hace la página.

### 3. Verificar TODOS los QID contra Wikidata (obligatorio)
Script `scripts/verify-wikidata.ts`. Para cada QID, llama a `https://www.wikidata.org/wiki/Special:EntityData/{QID}.json` (con rate limit suave y un User-Agent genérico del proyecto) y comprueba:
- **Municipios**: que `P31` incluya *municipio de España* (Q2074737) o *municipio de Cataluña* (Q33146843), que `P131` cuelgue de la provincia de Barcelona y que la etiqueta `ca` o `es` coincida con el municipio emparejado.
- **Partidos**: que `P31` sea *partido judicial* (Q6018869) o similar, y que la etiqueta contenga el nombre del partido.
- Si el QID falla, **búscalo** con la API `wbsearchentities` (por el nombre en `ca`) y propone el correcto en el informe. **No lo sustituyas en silencio**: déjalo en `scripts/output/areaserved-report.md` con el estado OK / CORREGIDO-PROPUESTO / FALTA.
- Comprueba también que las URLs de Wikipedia devuelven 200 y no son una desambiguación.

**Errores ya detectados en la fuente** (verifícalos y corrígelos):
- **Ejemplo Martorell** (cabecera del documento): usa QIDs distintos de los del listado (partido Q107525557 frente a Q6064889; Martorell Q15354 frente a Q15623; etc.), una dirección distinta ("Passeig de la Quartera" frente a "Passeig del Sindicat, 10") y coordenadas que no cuadran. **Manda el listado verificado, no el ejemplo.**
- **Granollers (municipio)**: tiene `Q15418` duplicado, que es el de Granera.
- **Corbera de Llobregat**: `Q15601Ç`, con un carácter basura.
- **El Prat de Llobregat (municipio)**: usa el QID del partido (Q117469569), no el del municipio.
- **Cornellà** y **Santa Coloma de Gramenet**: solo aparecen el QID y la Wikipedia del **municipio**; falta el del **partido judicial**. Búscalo.
- **Badalona**: falta la Wikipedia y el QID del partido.
- **Arenys de Mar**: no hay QIDs, dirección, Maps ni Plus Code. Obtén los QIDs de Wikidata. La dirección **déjala en null** si no está en `courts`.
- **Gavà**: el Plus Code mezcla el de Martorell (`FWHC+2W Martorell`). El correcto es `8244+X9 Gavà`.
- **Mollet del Vallès**: la dirección dice "08100 Barcelona" y el Plus Code "Barcelona". La localidad correcta es Mollet del Vallès.
- **"Sant Quirze de Terrasa"** = Sant Quirze del Vallès.
- **Barcelona**, **L'Hospitalet**, **El Prat**, **Cornellà** y **Santa Coloma** son partidos de un solo municipio. Comprueba que coinciden con la BD.
- **Faltan 5 partidos** en la fuente: **Berga, Igualada, Manresa, Vic y Vilafranca del Penedès**. Para estos, rellena los QIDs con búsqueda en Wikidata, a partir de los municipios que ya hay en `locations`, y márcalos como "fuente: wikidata-search" en el informe.

### 4. Seed a Supabase
Script `scripts/seed-areaserved.ts`:
- Tiene un modo `--dry-run` por defecto, que imprime los UPDATE.
- Solo aplica las filas en estado **OK** (o las corregidas que yo apruebe editando el JSON).
- Es idempotente.

**Para y enséñame el informe antes de ejecutarlo sin `--dry-run`.**

### 5. Exponer los datos en `getDistrictData`
En `src/lib/db/district-content.ts`:
- Añade `wikidata_qid` y `wikipedia_url` al `select` de `locations` y a la interfaz `DistrictMunicipality`.
- Añade `wikidataQid`, `wikipediaUrl`, `mapsUrl` y `plusCode` a `DistrictCourtData`.
- Si la columna es null, el campo es null. Nada se rompe.

### 6. JSON-LD en `src/app/juzgados/[slug]/page.tsx`
Extrae la construcción a un helper puro y testeable, `src/lib/seo/district-jsonld.ts`, que reciba `DistrictFullData` y devuelva el `@graph`. Los cambios:

1. **Quita `areaServed` del nodo `WebPage`** (no es válido ahí). Añade al `WebPage` `mainEntity: { "@id": "{canonical}#service" }`.
2. **Nuevo nodo `Service`**, que se añade al `@graph`:
   ```json
   {
     "@type": "Service",
     "@id": "{canonical}#service",
     "name": "Abogado para juicio rápido en {partido}",
     "serviceType": "Defensa penal en delitos contra la seguridad vial (juicio rápido)",
     "provider": { "@id": "https://www.autoridad.legal/#organization" },
     "url": "{canonical}",
     "areaServed": {
       "@type": "AdministrativeArea",
       "@id": "{canonical}#partido-judicial",
       "name": "Partido judicial de {partido}",
       "sameAs": ["https://www.wikidata.org/wiki/{qidPartido}", "{wikipediaPartido}"],
       "containedInPlace": { "@type": "AdministrativeArea", "name": "Provincia de Barcelona", "sameAs": "https://www.wikidata.org/wiki/Q81949" },
       "containsPlace": [
         { "@type": "City", "name": "{municipio}", "sameAs": ["https://www.wikidata.org/wiki/{qid}", "{wikipedia}"] }
       ]
     },
     "availableChannel": { "@type": "ServiceChannel", "servicePhone": { "@type": "ContactPoint", "telephone": "{PHONE_E164}" } }
   }
   ```
   - `containsPlace` lleva **todos** los municipios del partido, en el orden de `municipalities`.
   - `sameAs` incluye **solo los valores no nulos**. Si un municipio no tiene ninguno, se deja `{ "@type": "City", "name": … }` sin `sameAs`. **Nunca** se pone una URL genérica de Wikidata (es la misma regla que ya aplica `glosario/[slug]`).
   - Si el partido no tiene QID, el `AdministrativeArea` va sin `sameAs`.
   - Mueve la referencia del teléfono a la constante `PHONE_E164` de `@/lib/config`. **No lo escribas a mano.**
   - Revisa `home-jsonld.ts` por si el teléfono ya está en `#emergency-contact`. Si es así, referencia `{ "@id": "https://www.autoridad.legal/#emergency-contact" }` en vez de duplicarlo.
3. **Courthouse**: sácalo de `about` y conviértelo en un nodo propio del `@graph` con `@id` `{canonical}#courthouse`; `WebPage.about` pasa a ser `{ "@id": … }`. Añádele:
   - `hasMap`: `mapsUrl` si existe; si no, la URL de búsqueda de Maps que ya se calcula en la página
   - `containedInPlace`: `{ "@id": "{canonical}#partido-judicial" }`
   - `addressLocality`: **el municipio sede real**. Ojo con Mollet: el valor actual es `partido`, y eso es correcto salvo en los casos con dirección errónea.
   - El `geo` se queda **en el Courthouse** (ya existe con `gps_coords`). **No** pongas `geo` en el `AdministrativeArea`, como hace el ejemplo: las coordenadas son del edificio, no del partido.
4. **No uses `globalLocationNumber`** para los Plus Codes, como hace la fuente. GLN es un código GS1 de 13 dígitos, y meter ahí un Plus Code produce datos inválidos. El Plus Code se guarda en BD; si se quiere exponer, que vaya en `hasMap` como URL `https://plus.codes/{code}` o que no se publique.
5. No crees nodos `Organization`, `LegalService` ni `Person` nuevos. **Un único `<script type="application/ld+json">` por página**, igual que ahora.

### 7. Tests y validación
- Test unitario de `district-jsonld.ts` (si hay framework de unit tests; si no, un script `scripts/test-district-jsonld.ts`) que valide:
  - que hay un solo nodo `Service` y que `areaServed.containsPlace.length === municipalities.length`;
  - que ningún `sameAs` es null, una cadena vacía o `https://wikidata.org`;
  - que `WebPage` no tiene `areaServed`;
  - que todos los `@id` referenciados existen en el grafo o son los globales (`#organization`, `#website`, `#emergency-contact`).
- Ejecuta `npm run build` y comprueba que compila.
- Arranca `npm run dev` y extrae el JSON-LD de `/juzgados/martorell`, `/juzgados/granollers`, `/juzgados/barcelona` y `/juzgados/arenys-de-mar`. Pásalo por el validador de schema.org (https://validator.schema.org) y por la prueba de resultados enriquecidos de Google. Adjunta los resultados al informe.
- Comprueba que el `FAQPage` y el `BreadcrumbList` siguen idénticos (no hay regresión).

### 8. Extras opcionales (pregúntame antes)
- Añadir `areaServed` agregado, con los 25 `AdministrativeArea` por `@id`, en el nodo `#organization` de `home-jsonld.ts`.
- Exponer los QIDs en `llms.txt` / `llms-full.txt` y en `entitymap.json` (`npm run generate:entitymap`).

---

## Reglas
- **No inventes QIDs ni URLs.** Todo dato que publiques en `sameAs` tiene que estar verificado en el paso 3.
- No cambies los textos visibles de la página, el `metadata`, las URLs canónicas, `robots` ni el sitemap.
- No toques `.env.local`, `service-account.json` ni las credenciales.
- Commits sugeridos:
  1. `feat(db): añade wikidata_qid/wikipedia_url a courts y locations`
  2. `chore(scripts): parser y verificador de areaServed desde fuente`
  3. `feat(seo): nodo Service con areaServed por partido judicial en /juzgados/[slug]`
  4. `fix(seo): elimina areaServed inválido de WebPage y separa Courthouse`
  5. `test(seo): validación del grafo JSON-LD de juzgados`

## Entregables
1. `scripts/output/areaserved-report.md`: una tabla por partido con municipio, QID, estado y acción. Al principio, un resumen de errores corregidos y pendientes.
2. Un diff del JSON-LD antes/después para `/juzgados/martorell`.
3. La rama empujada y lista para merge manual.

**Puntos de parada obligatorios:** (a) después del informe de verificación (paso 3) y (b) antes del seed real (paso 4). Espera mi OK.
