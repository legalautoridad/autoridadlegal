# PROMPT PARA ANTIGRAVITY — areaServed, fase 2: correcciones y seed

Sigue en la rama `feat/areaserved-jsonld-juzgados`. Mantén el protocolo de `AI_GUIDELINES.md`: commits atómicos y convencionales, nunca en `main`.

He revisado el HTML generado de `/juzgados/granollers` en dev y el informe `scripts/output/areaserved-report.md`. La estructura del grafo está bien (Service + AdministrativeArea + containsPlace + Courthouse separado). Quedan estos 5 puntos, **en este orden**.

---

## 1. Resolver las referencias globales en `/juzgados/*` (PRIORITARIO)

**Problema:** `src/components/seo/SitewideJsonLd.tsx` devuelve `null` en `/juzgados` y `/juzgados/*`. Por eso el grafo de estas páginas referencia `https://www.autoridad.legal/#organization`, `#website` y `#emergency-contact`, pero esos nodos **no existen en la página**. Google no resuelve un `@id` de otra URL, así que `Service.provider` queda como una referencia vacía.

**Qué hacer:**
- **No** quites la exclusión en `SitewideJsonLd` a ciegas. Primero averigua (git log/blame) por qué se excluyó y explícamelo en el resumen.
- En `src/lib/seo/district-jsonld.ts`, añade al `@graph` de cada página de juzgado:
  - Un nodo **reducido** de organización con el **mismo `@id`** `https://www.autoridad.legal/#organization` y el mismo `@type` que en `home-jsonld.ts` (`['LegalService','Organization']`). Lleva solo `name`, `url`, `logo`, `telephone` (de `PHONE_E164`), `contactPoint` → el nodo `#emergency-contact` y `sameAs` (las redes sociales que ya hay en `home-jsonld.ts`).
  - El nodo `ContactPoint` `#emergency-contact`, con los mismos datos que en `home-jsonld.ts`.
  - Un nodo `WebSite` `#website` mínimo (`url`, `name`, `inLanguage`).
- **No dupliques los valores a mano.** Extrae de `home-jsonld.ts` una función o constante compartida (por ejemplo `getOrganizationCoreNode()`, `getEmergencyContactNode()`, `getWebsiteNode()`) y úsala en los dos sitios. Así no se desincronizan.
- No metas aquí ni `OfferCatalog`, ni `VideoObject`, ni las FAQs de la home. Solo el núcleo.
- Actualiza el test (`scripts/test-district-jsonld.ts` o el que exista) para que **falle si un `@id` referenciado no está definido dentro del propio grafo**.

Commit: `fix(seo): define nodos organization/website/contact en el grafo de /juzgados`

## 2. Corregir el nodo `Courthouse`

- `address.streetAddress` lleva ahora "Carrer de Josep Umbert, 124, 08402 Granollers, Barcelona". Parsea `courts.address` para separar:
  - `streetAddress` → solo la calle y el número ("Carrer de Josep Umbert, 124")
  - `postalCode` → "08402"
  - `addressLocality` → el municipio de la dirección (no el nombre del partido)
  - Si el parseo falla en algún juzgado, deja `streetAddress` completo, **no inventes** valores y lístalo en el resumen.
- Añade `telephone` al `Courthouse` cuando `court.phone` exista, en formato E.164 (+34…). Hoy el teléfono se ve en la página pero no está en el JSON-LD.
- Genera una tabla para mí con la dirección actual de `courts` de los 25 juzgados frente a la de `docs/areaserved-fuente.md`, marcando las discrepancias. Por ejemplo, Granollers tiene en la BD "Carrer de Josep Umbert, 124, 08402" y en la fuente "Josep Umbert i Ventura, 124, 08400". **No cambies direcciones en la BD**; las valida el abogado.

Commit: `fix(seo): separa postalCode y añade telephone en Courthouse`

## 3. Seed real de Wikidata (solo cuando yo dé el OK)

- Prepara una muestra aleatoria de **15 municipios** con origen `wikidata-search`, repartidos entre Berga, Igualada, Manresa, Vic, Vilafranca y Arenys. Para cada uno: nombre en la BD, QID, etiqueta `ca` de Wikidata, `P131` (en qué entidad está) y enlace.
- Añade también los 25 QID de partido y su etiqueta de Wikidata.
- **Para y enséñame la muestra.** Cuando apruebe, ejecuta `scripts/seed-areaserved.ts` sin `--dry-run` y aplica OK + CORREGIDO-PROPUESTO.
- Después del seed, comprueba con una consulta que ningún `wikidata_qid` está repetido entre municipios distintos y que no hay QIDs de partido asignados a municipios.

Commit (si hay cambios en scripts o JSON): `chore(data): seed de wikidata_qid en courts y locations`

## 4. Municipios que faltan en la BD

- **Sant Feliu de Codines** (Q15444, partido de **Granollers**) no está en `locations` ni en `src/data/municipio-a-partido.json`.
- La provincia de Barcelona tiene **311 municipios** y la BD trabaja con 309 (sin `bellaterra-uab`). Compara la lista de municipios de la provincia en Wikidata (P31 municipio de Cataluña + P131 de las comarcas de la provincia de Barcelona) con `locations` y dime **cuáles faltan** y a qué partido pertenecen, con la fuente (Wikipedia del partido o CGPJ).
- Crea una migración que los inserte en `locations` (con `court_id`, `slug`, `name`, `location_type = 'municipio'`, `population` si se puede obtener, `wikidata_qid` y `wikipedia_url`). Añádelos también a `municipio-a-partido.json`. **Para antes de aplicar la migración** y enséñame el SQL.
- Comprueba que el buscador de municipios (`DistrictMunicipalitySection`) los encuentra y que `/alcoholemia/sant-feliu-de-codines` redirige con 301 a `/juzgados/granollers`.

Commit: `feat(data): añade municipios que faltaban (Sant Feliu de Codines, …)`

## 5. Validación final

- `npm run build` sin errores.
- En dev, extrae el JSON-LD de `/juzgados/granollers`, `/juzgados/vic`, `/juzgados/arenys-de-mar` y `/juzgados/barcelona`, y comprueba:
  - Que los `@id` referenciados están todos definidos en el grafo.
  - Que el partido y todos los municipios tienen `sameAs` con un QID válido, sin valores vacíos ni `https://wikidata.org` genérico.
  - Que `containsPlace.length` es igual al número de municipios mostrados en la página.
  - Que `Courthouse` tiene `postalCode` y `telephone` cuando hay dato.
- Pasa las 4 por https://validator.schema.org y por la prueba de resultados enriquecidos de Google, y adjunta el resultado (errores y avisos).
- Haz push de la rama.

## Entregable
Un resumen con:
1. Por qué se excluía `SitewideJsonLd` en `/juzgados` y qué has hecho.
2. La tabla de direcciones con discrepancias.
3. La muestra de 15 QIDs (punto de parada).
4. La lista de municipios que faltan y el SQL (punto de parada).
5. El resultado de los validadores.

**Puntos de parada obligatorios:** antes del seed (punto 3) y antes de aplicar la migración de municipios (punto 4).
