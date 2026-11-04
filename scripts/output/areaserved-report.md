# Informe de Verificación de `areaServed` (Partidos Judiciales y Municipios)

**Fecha:** 2026-11-04T14:21:49.571Z
**Proyecto:** autoridad.legal (Next.js 16 + Supabase)
**Total partidos judiciales:** 25
**Total municipios analizados:** 309

## 1. Resumen Ejecutivo de Errores y Acciones

### Errores corregidos en la fuente:
- **Ejemplo Martorell**: Descartado el ejemplo de la cabecera; se utiliza el listado unificado y verificado.
- **Granollers (municipio)**: Tenía Q15418 duplicado (Granera). Corregido a **Q15420**.
- **Corbera de Llobregat**: QID `Q15601Ç` contenía carácter basura. Corregido a **Q15601**.
- **El Prat de Llobregat (municipio)**: Usaba Q117469569 (partido) para el municipio. Corregido a **Q15628**.
- **Cornellà y Santa Coloma de Gramenet**: La fuente solo traía QID de municipio. Se obtuvieron los QIDs de los respectivos partidos judiciales.
- **Badalona**: Faltaba el QID y Wikipedia del partido judicial. Obtenido y propuesto.
- **Arenys de Mar**: No contenía QIDs. Se obtuvieron y verificaron todos sus 13 municipios vía Wikidata.
- **Gavà**: Plus Code corregido a `8244+X9 Gavà` (descartada la mezcla con Martorell).
- **Mollet del Vallès**: Dirección de la fuente corregida a localidad Mollet del Vallès.
- **Sant Quirze de Terrassa**: Normalizado a Sant Quirze del Vallès (Q13935).
- **5 Partidos ausentes en la fuente** (Berga, Igualada, Manresa, Vic, Vilafranca del Penedès): Se incorporaron todos sus municipios a partir de la BD de `locations` y se resolvieron sus QIDs vía Wikidata Search (`fuente: wikidata-search`).

### Incidencias y advertencias detectadas:
- **Errores bloqueantes (FALTA):** 0
- **Propuestas de corrección (CORREGIDO-PROPUESTO):** 186
- **Avisos / URLs sugeridas (AVISO):** 1

---
## 2. Detalle por Partido Judicial

### Partido Judicial de Arenys de Mar (`arenys-de-mar`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q5854475](https://www.wikidata.org/wiki/Q5854475)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Arenys_de_Mar
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** La fuente no trae el QID del partido judicial.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Arenys de Mar | `arenys-de-mar` | [Q12110](https://www.wikidata.org/wiki/Q12110) | `OK` | [Link](https://es.wikipedia.org/wiki/Arenys_de_Mar) | fuente |
| Arenys de Munt | `arenys-de-munt` | [Q12101](https://www.wikidata.org/wiki/Q12101) | `OK` | [Link](https://es.wikipedia.org/wiki/Arenys_de_Munt) | fuente |
| Calella | `calella` | [Q12540](https://www.wikidata.org/wiki/Q12540) | `OK` | [Link](https://es.wikipedia.org/wiki/Calella) | fuente |
| Canet de Mar | `canet-de-mar` | [Q12114](https://www.wikidata.org/wiki/Q12114) | `OK` | [Link](https://es.wikipedia.org/wiki/Canet_de_Mar) | fuente |
| Fogars de la Selva | `fogars-de-la-selva` | [Q13083](https://www.wikidata.org/wiki/Q13083) | `OK` | [Link](https://es.wikipedia.org/wiki/Fog%C3%A1s_de_Tordera) | fuente |
| Malgrat de Mar | `malgrat-de-mar` | [Q12590](https://www.wikidata.org/wiki/Q12590) | `OK` | [Link](https://es.wikipedia.org/wiki/Malgrat_de_Mar) | fuente |
| Palafolls | `palafolls` | [Q12595](https://www.wikidata.org/wiki/Q12595) | `OK` | [Link](https://es.wikipedia.org/wiki/Palafolls) | fuente |
| Pineda de Mar | `pineda-de-mar` | [Q12552](https://www.wikidata.org/wiki/Q12552) | `OK` | [Link](https://es.wikipedia.org/wiki/Pineda_de_Mar) | fuente |
| Sant Cebrià de Vallalta | `sant-cebria-de-vallalta` | [Q12520](https://www.wikidata.org/wiki/Q12520) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Cipriano_de_Vallalta) | fuente |
| Sant Iscle de Vallalta | `sant-iscle-de-vallalta` | [Q12122](https://www.wikidata.org/wiki/Q12122) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Acisclo_de_Vallalta) | fuente |
| Sant Pol de Mar | `sant-pol-de-mar` | [Q12534](https://www.wikidata.org/wiki/Q12534) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Pol_de_Mar) | fuente |
| Santa Susanna | `santa-susanna` | [Q12587](https://www.wikidata.org/wiki/Q12587) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Susana_(Barcelona)) | fuente |
| Tordera | `tordera` | [Q12596](https://www.wikidata.org/wiki/Q12596) | `OK` | [Link](https://es.wikipedia.org/wiki/Tordera) | fuente |

### Partido Judicial de Badalona (`badalona`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q117468968](https://www.wikidata.org/wiki/Q117468968)
- **Wikipedia Partido:** FALTA
- **Sede / Dirección:** Carrer de Francesc Layret, 101, 08911 Badalona, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=15702101376790666361
- **Plus Code:** `F62X+54 Badalona`
- **Notas:** Maps: URL reconstruida desde el CID 15702101376790666361 (sin tracking). · La fuente no trae el QID del partido judicial. · La fuente no trae la Wikipedia del partido judicial.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Badalona | `badalona` | [Q15468](https://www.wikidata.org/wiki/Q15468) | `OK` | [Link](https://es.wikipedia.org/wiki/Badalona) | fuente |
| Montgat | `montgat` | [Q12022](https://www.wikidata.org/wiki/Q12022) | `OK` | [Link](https://es.wikipedia.org/wiki/Montgat) | fuente |
| Sant Adrià de Besòs | `sant-adria-de-besos` | [Q15471](https://www.wikidata.org/wiki/Q15471) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Adri%C3%A1n_de_Bes%C3%B3s) | fuente |

### Partido Judicial de Barcelona (`barcelona`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117468991](https://www.wikidata.org/wiki/Q117468991)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Barcelona
- **Sede / Dirección:** Gran Via de les Corts Catalanes, 111, Sants-Montjuïc, 08075 Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=2681878508334728094
- **Plus Code:** `947M+P9 Barcelona`
- **Notas:** Maps: URL reconstruida desde el CID 2681878508334728094 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Barcelona | `barcelona` | [Q1492](https://www.wikidata.org/wiki/Q1492) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Barcelona) | fuente |

### Partido Judicial de Berga (`berga`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q5550742](https://www.wikidata.org/wiki/Q5550742)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Berga
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Avià | `avia` | [Q15495](https://www.wikidata.org/wiki/Q15495) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Avi%C3%A1) | wikidata-search |
| Bagà | `baga` | [Q15486](https://www.wikidata.org/wiki/Q15486) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Bag%C3%A1) | wikidata-search |
| Berga | `berga` | [Q15487](https://www.wikidata.org/wiki/Q15487) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Berga) | wikidata-search |
| Borredà | `borreda` | [Q15488](https://www.wikidata.org/wiki/Q15488) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Borred%C3%A1) | wikidata-search |
| Capolat | `capolat` | [Q15489](https://www.wikidata.org/wiki/Q15489) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Capolat) | wikidata-search |
| Casserres | `casserres` | [Q15491](https://www.wikidata.org/wiki/Q15491) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Caserras) | wikidata-search |
| Castell de l'Areny | `castell-de-l-areny` | [Q15492](https://www.wikidata.org/wiki/Q15492) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castell_del_Areny) | wikidata-search |
| Castellar de n'Hug | `castellar-de-n-hug` | [Q15493](https://www.wikidata.org/wiki/Q15493) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellar_de_Nuch) | wikidata-search |
| Castellar del Riu | `castellar-del-riu` | [Q15494](https://www.wikidata.org/wiki/Q15494) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellar_del_Riu) | wikidata-search |
| Cercs | `cercs` | [Q15504](https://www.wikidata.org/wiki/Q15504) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Serchs) | wikidata-search |
| Fígols | `figols` | [Q15508](https://www.wikidata.org/wiki/Q15508) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/F%C3%ADgols) | wikidata-search |
| Gironella | `gironella` | [Q15509](https://www.wikidata.org/wiki/Q15509) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Gironella) | wikidata-search |
| Gisclareny | `gisclareny` | [Q15511](https://www.wikidata.org/wiki/Q15511) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Gisclareny) | wikidata-search |
| Guardiola de Berguedà | `guardiola-de-bergueda` | [Q15519](https://www.wikidata.org/wiki/Q15519) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Guardiola_de_Bergued%C3%A1) | wikidata-search |
| L'Espunyola | `l-espunyola` | [Q15506](https://www.wikidata.org/wiki/Q15506) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Espunyola) | wikidata-search |
| La Nou de Berguedà | `la-nou-de-bergueda` | [Q15524](https://www.wikidata.org/wiki/Q15524) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Nou_de_Bergued%C3%A1) | wikidata-search |
| La Pobla de Lillet | `la-pobla-de-lillet` | [Q15529](https://www.wikidata.org/wiki/Q15529) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Pobla_de_Lillet) | wikidata-search |
| La Quar | `la-quar` | [Q15535](https://www.wikidata.org/wiki/Q15535) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Quart) | wikidata-search |
| Montclar | `montclar` | [Q15521](https://www.wikidata.org/wiki/Q15521) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Montclar_(Barcelona)) | wikidata-search |
| Montmajor | `montmajor` | [Q15522](https://www.wikidata.org/wiki/Q15522) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Montmajor) | wikidata-search |
| Olvan | `olvan` | [Q15527](https://www.wikidata.org/wiki/Q15527) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Olv%C3%A1n) | wikidata-search |
| Puig-reig | `puig-reig` | [Q15534](https://www.wikidata.org/wiki/Q15534) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Puigreig) | wikidata-search |
| Sagàs | `sagas` | [Q15536](https://www.wikidata.org/wiki/Q15536) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Sag%C3%A1s) | wikidata-search |
| Saldes | `saldes` | [Q15537](https://www.wikidata.org/wiki/Q15537) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Saldes) | wikidata-search |
| Sant Jaume de Frontanyà | `sant-jaume-de-frontanya` | [Q15538](https://www.wikidata.org/wiki/Q15538) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Jaime_de_Frontanya) | wikidata-search |
| Sant Julià de Cerdanyola | `sant-julia-de-cerdanyola` | [Q15539](https://www.wikidata.org/wiki/Q15539) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Juli%C3%A1n_de_Cerda%C3%B1ola) | wikidata-search |
| Santa Maria de Merlès | `santa-maria-de-merles` | [Q15541](https://www.wikidata.org/wiki/Q15541) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Marl%C3%A9s) | wikidata-search |
| Vallcebre | `vallcebre` | [Q15543](https://www.wikidata.org/wiki/Q15543) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vallcebre) | wikidata-search |
| Vilada | `vilada` | [Q15544](https://www.wikidata.org/wiki/Q15544) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vilada) | wikidata-search |
| Viver i Serrateix | `viver-i-serrateix` | [Q15545](https://www.wikidata.org/wiki/Q15545) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Viver_y_Serrateix) | wikidata-search |

### Partido Judicial de Cerdanyola del Vallès (`cerdanyola-del-valles`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469292](https://www.wikidata.org/wiki/Q117469292)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Sarda%C3%B1ola_del_Vall%C3%A9s
- **Sede / Dirección:** Carrer del Roure, 08290 Cerdanyola del Vallès, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=2818399022493654510
- **Plus Code:** `F4MV+JM Cerdanyola del Vallès`
- **Notas:** Maps: URL reconstruida desde el CID 2818399022493654510 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Badia del Vallès | `badia-del-valles` | [Q13913](https://www.wikidata.org/wiki/Q13913) | `OK` | [Link](https://es.wikipedia.org/wiki/Badia_del_Vall%C3%A8s) | fuente |
| Barberà del Vallès | `barbera-del-valles` | [Q13916](https://www.wikidata.org/wiki/Q13916) | `OK` | [Link](https://es.wikipedia.org/wiki/Barber%C3%A1_del_Vall%C3%A9s) | fuente |
| Cerdanyola del Vallès | `cerdanyola-del-valles` | [Q13922](https://www.wikidata.org/wiki/Q13922) | `OK` | [Link](https://es.wikipedia.org/wiki/Sarda%C3%B1ola_del_Vall%C3%A9s) | fuente |
| Montcada i Reixac | `montcada-i-reixac` | [Q13927](https://www.wikidata.org/wiki/Q13927) | `OK` | [Link](https://es.wikipedia.org/wiki/Moncada_y_Reixach) | fuente |
| Ripollet | `ripollet` | [Q13933](https://www.wikidata.org/wiki/Q13933) | `OK` | [Link](https://es.wikipedia.org/wiki/Ripollet) | fuente |

### Partido Judicial de Cornellà de Llobregat (`cornella-de-llobregat`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q117469342](https://www.wikidata.org/wiki/Q117469342)
- **Wikipedia Partido:** FALTA
- **Sede / Dirección:** Carrer de Can Rosés, 1 -3 Cant, Carrer Rius i Taulet, 08940 Cornellà de Llobregat, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=5490866722612023348
- **Plus Code:** `933G+J2 Cornellà de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 5490866722612023348 (sin tracking). · La fuente no trae el QID del partido judicial. · La fuente no trae la Wikipedia del partido judicial.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Cornellà de Llobregat | `cornella-de-llobregat` | [Q15602](https://www.wikidata.org/wiki/Q15602) | `OK` | [Link](https://es.wikipedia.org/wiki/Cornell%C3%A1_de_Llobregat) | fuente |

### Partido Judicial de El Prat de Llobregat (`el-prat-de-llobregat`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469569](https://www.wikidata.org/wiki/Q117469569)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_El_Prat_de_Llobregat
- **Sede / Dirección:** Avinguda de la Verge de Montserrat, 121 (CP 08820)
- **Google Maps:** https://maps.google.com/?cid=1207958131248947744
- **Plus Code:** `838P+6F El Prat de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 1207958131248947744 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| El Prat de Llobregat | `el-prat-de-llobregat` | [Q15619](https://www.wikidata.org/wiki/Q15619) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/El_Prat_de_Llobregat) | fuente |

### Partido Judicial de Esplugues de Llobregat (`esplugues-de-llobregat`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469334](https://www.wikidata.org/wiki/Q117469334)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Esplugas_de_Llobregat
- **Sede / Dirección:** Carrer de Tomás Bretón, 32, 1ª planta, 08950 Esplugues de Llobregat, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=17268739941894684687
- **Plus Code:** `93GH+9Q Esplugues de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 17268739941894684687 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Esplugues de Llobregat | `esplugues-de-llobregat` | [Q15621](https://www.wikidata.org/wiki/Q15621) | `OK` | [Link](https://es.wikipedia.org/wiki/Esplugas_de_Llobregat) | fuente |
| Sant Just Desvern | `sant-just-desvern` | [Q15641](https://www.wikidata.org/wiki/Q15641) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Justo_Desvern) | fuente |

### Partido Judicial de Gavà (`gava`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469360](https://www.wikidata.org/wiki/Q117469360)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Gav%C3%A1
- **Sede / Dirección:** Plaça de J. M. Batista i Roca, s/n, 08850 Gavà, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=4553787445399538062
- **Plus Code:** `8244+X9 Gavà`
- **Notas:** La fuente trae 2 Plus Codes (FWHC+2W Martorell / 8244+X9 Gavà); se elige 8244+X9 por localidad. · Maps: URL reconstruida desde el CID 4553787445399538062 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Begues | `begues` | [Q15596](https://www.wikidata.org/wiki/Q15596) | `OK` | [Link](https://es.wikipedia.org/wiki/Begas) | fuente |
| Castelldefels | `castelldefels` | [Q15597](https://www.wikidata.org/wiki/Q15597) | `OK` | [Link](https://es.wikipedia.org/wiki/Castelldefels) | fuente |
| Gavà | `gava` | [Q15622](https://www.wikidata.org/wiki/Q15622) | `OK` | [Link](https://es.wikipedia.org/wiki/Gav%C3%A1) | fuente |
| Viladecans | `viladecans` | [Q15652](https://www.wikidata.org/wiki/Q15652) | `OK` | [Link](https://es.wikipedia.org/wiki/Viladecans) | fuente |

### Partido Judicial de Granollers (`granollers`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q6064797](https://www.wikidata.org/wiki/Q6064797)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Granollers
- **Sede / Dirección:** Carrer de Josep Umbert i Ventura, 124, 08400 Granollers, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=3057162847664968322
- **Plus Code:** `J73V+4Q Granollers`
- **Notas:** Maps: URL reconstruida desde el CID 3057162847664968322 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Aiguafreda | `aiguafreda` | [Q15389](https://www.wikidata.org/wiki/Q15389) | `OK` | [Link](https://es.wikipedia.org/wiki/Aiguafreda) | fuente |
| Bigues i Riells del Fai | `bigues-i-riells` | [Q15398](https://www.wikidata.org/wiki/Q15398) | `OK` | [Link](https://es.wikipedia.org/wiki/Bigas) | fuente |
| Caldes de Montbui | `caldes-de-montbui` | [Q15400](https://www.wikidata.org/wiki/Q15400) | `OK` | [Link](https://es.wikipedia.org/wiki/Caldas_de_Montbuy) | fuente |
| Campins | `campins` | [Q15401](https://www.wikidata.org/wiki/Q15401) | `OK` | [Link](https://es.wikipedia.org/wiki/Campins) | fuente |
| Canovelles | `canovelles` | [Q15402](https://www.wikidata.org/wiki/Q15402) | `OK` | [Link](https://es.wikipedia.org/wiki/Canovellas) | fuente |
| Cànoves i Samalús | `canoves-i-samalus` | [Q15403](https://www.wikidata.org/wiki/Q15403) | `OK` | [Link](https://es.wikipedia.org/wiki/C%C3%A1noves_y_Samal%C3%BAs) | fuente |
| Cardedeu | `cardedeu` | [Q15406](https://www.wikidata.org/wiki/Q15406) | `OK` | [Link](https://es.wikipedia.org/wiki/Cardedeu) | fuente |
| Castellterçol | `castelltercol` | [Q15408](https://www.wikidata.org/wiki/Q15408) | `OK` | [Link](https://es.wikipedia.org/wiki/Castelltersol) | fuente |
| Figaró-Montmany | `figaro-montmany` | [Q15409](https://www.wikidata.org/wiki/Q15409) | `OK` | [Link](https://es.wikipedia.org/wiki/Figar%C3%B3-Montmany) | fuente |
| Fogars de Montclús | `fogars-de-montclus` | [Q15411](https://www.wikidata.org/wiki/Q15411) | `OK` | [Link](https://es.wikipedia.org/wiki/Fog%C3%A1s_de_Moncl%C3%BAs) | fuente |
| Granera | `granera` | [Q15418](https://www.wikidata.org/wiki/Q15418) | `OK` | [Link](https://es.wikipedia.org/wiki/Granera) | fuente |
| Granollers | `granollers` | [Q15420](https://www.wikidata.org/wiki/Q15420) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Granollers) | fuente |
| Gualba | `gualba` | [Q15421](https://www.wikidata.org/wiki/Q15421) | `OK` | [Link](https://es.wikipedia.org/wiki/Gualba) | fuente |
| L'Ametlla del Vallès | `l-ametlla-del-valles` | [Q15397](https://www.wikidata.org/wiki/Q15397) | `OK` | [Link](https://es.wikipedia.org/wiki/La_Ametlla) | fuente |
| La Garriga | `la-garriga` | [Q15415](https://www.wikidata.org/wiki/Q15415) | `OK` | [Link](https://es.wikipedia.org/wiki/La_Garriga) | fuente |
| La Roca del Vallès | `la-roca-del-valles` | [Q15439](https://www.wikidata.org/wiki/Q15439) | `OK` | [Link](https://es.wikipedia.org/wiki/La_Roca_del_Vall%C3%A9s) | fuente |
| Les Franqueses del Vallès | `les-franqueses-del-valles` | [Q15412](https://www.wikidata.org/wiki/Q15412) | `OK` | [Link](https://es.wikipedia.org/wiki/Les_Franqueses_del_Vall%C3%A8s) | fuente |
| Lliçà de Munt | `llissa-de-munt` | [Q15425](https://www.wikidata.org/wiki/Q15425) | `OK` | [Link](https://es.wikipedia.org/wiki/Lliss%C3%A1_de_Munt) | fuente |
| Lliçà de Vall | `llissa-de-vall` | [Q15428](https://www.wikidata.org/wiki/Q15428) | `OK` | [Link](https://es.wikipedia.org/wiki/Lliss%C3%A1_de_Vall) | fuente |
| Llinars del Vallès | `llinars-del-valles` | [Q15423](https://www.wikidata.org/wiki/Q15423) | `OK` | [Link](https://es.wikipedia.org/wiki/Llinars_del_Vall%C3%A9s) | fuente |
| Montornès del Vallès | `montornes-del-valles` | [Q15433](https://www.wikidata.org/wiki/Q15433) | `OK` | [Link](https://es.wikipedia.org/wiki/Montorn%C3%A9s_del_Vall%C3%A9s) | fuente |
| Montseny | `montseny` | [Q15434](https://www.wikidata.org/wiki/Q15434) | `OK` | [Link](https://es.wikipedia.org/wiki/Montseny_(Barcelona)) | fuente |
| Sant Antoni de Vilamajor | `sant-antoni-de-vilamajor` | [Q15440](https://www.wikidata.org/wiki/Q15440) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Antonio_Vilamajor) | fuente |
| Sant Celoni | `sant-celoni` | [Q15441](https://www.wikidata.org/wiki/Q15441) | `OK` | [Link](https://es.wikipedia.org/wiki/Sant_Celoni) | fuente |
| Sant Esteve de Palautordera | `sant-esteve-de-palautordera` | [Q15442](https://www.wikidata.org/wiki/Q15442) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Esteban_de_Palautordera) | fuente |
| Sant Pere de Vilamajor | `sant-pere-de-vilamajor` | [Q15450](https://www.wikidata.org/wiki/Q15450) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Pedro_de_Vilamajor) | fuente |
| Sant Quirze Safaja | `sant-quirze-safaja` | [Q15452](https://www.wikidata.org/wiki/Q15452) | `OK` | [Link](https://es.wikipedia.org/wiki/Sant_Quirze_Safaja) | fuente |
| Santa Eulàlia de Ronçana | `santa-eulalia-de-ronsana` | [Q15454](https://www.wikidata.org/wiki/Q15454) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Eulalia_de_Ronsana) | fuente |
| Santa Maria de Palautordera | `santa-maria-de-palautordera` | [Q15456](https://www.wikidata.org/wiki/Q15456) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Palautordera) | fuente |
| Tagamanent | `tagamanent` | [Q15457](https://www.wikidata.org/wiki/Q15457) | `OK` | [Link](https://es.wikipedia.org/wiki/Tagamanent) | fuente |
| Vallgorguina | `vallgorguina` | [Q15458](https://www.wikidata.org/wiki/Q15458) | `OK` | [Link](https://es.wikipedia.org/wiki/Vallgorguina) | fuente |
| Vallromanes | `vallromanes` | [Q15460](https://www.wikidata.org/wiki/Q15460) | `OK` | [Link](https://es.wikipedia.org/wiki/Vallromanes) | fuente |
| Vilalba Sasserra | `villalba-sasserra` | [Q15461](https://www.wikidata.org/wiki/Q15461) | `OK` | [Link](https://es.wikipedia.org/wiki/Villalba_Saserra) | fuente |
| Vilanova del Vallès | `vilanova-del-valles` | [Q15463](https://www.wikidata.org/wiki/Q15463) | `OK` | [Link](https://es.wikipedia.org/wiki/Vilanova_del_Vall%C3%A9s) | fuente |

**Entradas de la fuente sin emparejar en la BD:**
- *SANT FELIU DE CODINES* (Q15444): Sin coincidencia por nombre ni por etiqueta Wikidata

### Partido Judicial de L'Hospitalet de Llobregat (`hospitalet-de-llobregat`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469392](https://www.wikidata.org/wiki/Q117469392)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Hospitalet_de_Llobregat
- **Sede / Dirección:** Av. del Carrilet, 2, 08902 L'Hospitalet de Llobregat, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=7699209551399261957
- **Plus Code:** `948M+73 L'Hospitalet de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 7699209551399261957 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| L'Hospitalet de Llobregat | `hospitalet-de-llobregat` | [Q15470](https://www.wikidata.org/wiki/Q15470) | `OK` | [Link](https://es.wikipedia.org/wiki/Hospitalet_de_Llobregat) | fuente |

### Partido Judicial de Igualada (`igualada`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q2842321](https://www.wikidata.org/wiki/Q2842321)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Igualada
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Argensola | `argensola` | [Q15936](https://www.wikidata.org/wiki/Q15936) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Argensola) | wikidata-search |
| Bellprat | `bellprat` | [Q15937](https://www.wikidata.org/wiki/Q15937) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Bellprat) | wikidata-search |
| Cabrera d'Anoia | `cabrera-d-anoia` | [Q15939](https://www.wikidata.org/wiki/Q15939) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Cabrera_de_Igualada) | wikidata-search |
| Calaf | `calaf` | [Q15940](https://www.wikidata.org/wiki/Q15940) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Calaf_(Espa%C3%B1a)) | wikidata-search |
| Calonge de Segarra | `calonge-de-segarra` | [Q15941](https://www.wikidata.org/wiki/Q15941) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Calonje_de_Segarra) | wikidata-search |
| Capellades | `capellades` | [Q15942](https://www.wikidata.org/wiki/Q15942) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Capellades) | wikidata-search |
| Carme | `carme` | [Q15943](https://www.wikidata.org/wiki/Q15943) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Carme) | wikidata-search |
| Castellfollit de Riubregós | `castellfollit-de-riubregos` | [Q15945](https://www.wikidata.org/wiki/Q15945) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellfollit_de_Riubreg%C3%B3s) | wikidata-search |
| Castellolí | `castelloli` | [Q15946](https://www.wikidata.org/wiki/Q15946) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellol%C3%AD) | wikidata-search |
| Copons | `copons` | [Q15947](https://www.wikidata.org/wiki/Q15947) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Cop%C3%B3ns) | wikidata-search |
| El Bruc | `el-bruc` | [Q15938](https://www.wikidata.org/wiki/Q15938) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Bruch) | wikidata-search |
| Els Hostalets de Pierola | `els-hostalets-de-pierola` | [Q15949](https://www.wikidata.org/wiki/Q15949) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Els_Hostalets_de_Pierola) | wikidata-search |
| Els Prats de Rei | `els-prats-de-rei` | [Q15961](https://www.wikidata.org/wiki/Q15961) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Els_Prats_de_Rei) | wikidata-search |
| Igualada | `igualada` | [Q15950](https://www.wikidata.org/wiki/Q15950) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Igualada) | wikidata-search |
| La Llacuna | `la-llacuna` | [Q15952](https://www.wikidata.org/wiki/Q15952) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Llacuna) | wikidata-search |
| La Pobla de Claramunt | `la-pobla-de-claramunt` | [Q15960](https://www.wikidata.org/wiki/Q15960) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Pobla_de_Claramunt) | wikidata-search |
| La Torre de Claramunt | `la-torre-de-claramunt` | [Q15971](https://www.wikidata.org/wiki/Q15971) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Torre_de_Claramunt) | wikidata-search |
| Montmaneu | `montmaneu` | [Q15955](https://www.wikidata.org/wiki/Q15955) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Montmaneu) | wikidata-search |
| Òdena | `odena` | [Q15957](https://www.wikidata.org/wiki/Q15957) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/%C3%93dena) | wikidata-search |
| Orpí | `orpi` | [Q15958](https://www.wikidata.org/wiki/Q15958) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Orp%C3%AD) | wikidata-search |
| Piera | `piera` | [Q15959](https://www.wikidata.org/wiki/Q15959) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Piera) | wikidata-search |
| Pujalt | `pujalt` | [Q15962](https://www.wikidata.org/wiki/Q15962) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Pujalt) | wikidata-search |
| Rubió | `rubio` | [Q15963](https://www.wikidata.org/wiki/Q15963) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Rubi%C3%B3) | wikidata-search |
| Sant Martí de Tous | `sant-marti-de-tous` | [Q15966](https://www.wikidata.org/wiki/Q15966) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mart%C3%ADn_de_Tous) | wikidata-search |
| Sant Martí Sesgueioles | `sant-marti-sesgueioles` | [Q15964](https://www.wikidata.org/wiki/Q15964) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mart%C3%ADn_Sasgayolas) | wikidata-search |
| Sant Pere Sallavinera | `sant-pere-sallavinera` | [Q15967](https://www.wikidata.org/wiki/Q15967) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Salavinera) | wikidata-search |
| Santa Margarida de Montbui | `santa-margarida-de-montbui` | [Q15968](https://www.wikidata.org/wiki/Q15968) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Margarita_de_Montbuy) | wikidata-search |
| Santa Maria de Miralles | `santa-maria-de-miralles` | [Q15970](https://www.wikidata.org/wiki/Q15970) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Miralles) | wikidata-search |
| Vallbona d'Anoia | `vallbona-d-anoia` | [Q15972](https://www.wikidata.org/wiki/Q15972) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vallbona) | wikidata-search |
| Veciana | `veciana` | [Q15973](https://www.wikidata.org/wiki/Q15973) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Veciana) | wikidata-search |
| Vilanova del Camí | `vilanova-del-cami` | [Q15974](https://www.wikidata.org/wiki/Q15974) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vilanova_del_Cam%C3%AD) | wikidata-search |

### Partido Judicial de Manresa (`manresa`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q6064880](https://www.wikidata.org/wiki/Q6064880)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Manresa
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Aguilar de Segarra | `aguilar-de-segarra` | [Q16675](https://www.wikidata.org/wiki/Q16675) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Aguilar_de_Segarra) | wikidata-search |
| Artés | `artes` | [Q16677](https://www.wikidata.org/wiki/Q16677) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Art%C3%A9s) | wikidata-search |
| Avinyó | `avinyo` | [Q16678](https://www.wikidata.org/wiki/Q16678) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Aviny%C3%B3) | wikidata-search |
| Balsareny | `balsareny` | [Q16679](https://www.wikidata.org/wiki/Q16679) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Balsareny) | wikidata-search |
| Calders | `calders` | [Q16680](https://www.wikidata.org/wiki/Q16680) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Calders) | wikidata-search |
| Callús | `callus` | [Q16682](https://www.wikidata.org/wiki/Q16682) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Call%C3%BAs) | wikidata-search |
| Cardona | `cardona` | [Q16683](https://www.wikidata.org/wiki/Q16683) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Cardona) | wikidata-search |
| Castellbell i el Vilar | `castellbell-i-el-vilar` | [Q16684](https://www.wikidata.org/wiki/Q16684) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellbell_y_Vilar) | wikidata-search |
| Castellfollit del Boix | `castellfollit-del-boix` | [Q16685](https://www.wikidata.org/wiki/Q16685) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellfollit_del_Boix) | wikidata-search |
| Castellgalí | `castellgali` | [Q16686](https://www.wikidata.org/wiki/Q16686) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellgal%C3%AD) | wikidata-search |
| Castellnou de Bages | `castellnou-de-bages` | [Q16687](https://www.wikidata.org/wiki/Q16687) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellnou_de_Bages) | wikidata-search |
| El Pont de Vilomara i Rocafort | `el-pont-de-vilomara-i-rocafort` | [Q16726](https://www.wikidata.org/wiki/Q16726) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Rocafort_y_Vilumara) | wikidata-search |
| Fonollosa | `fonollosa` | [Q16695](https://www.wikidata.org/wiki/Q16695) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Fonollosa) | wikidata-search |
| Gaià | `gaia` | [Q16696](https://www.wikidata.org/wiki/Q16696) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Gay%C3%A1) | wikidata-search |
| L'Estany | `l-estany` | [Q16694](https://www.wikidata.org/wiki/Q16694) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Estany) | wikidata-search |
| Manresa | `manresa` | [Q16697](https://www.wikidata.org/wiki/Q16697) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Manresa) | wikidata-search |
| Marganell | `marganell` | [Q16698](https://www.wikidata.org/wiki/Q16698) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Marganell) | wikidata-search |
| Moià | `moia` | [Q16702](https://www.wikidata.org/wiki/Q16702) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Moy%C3%A1) | wikidata-search |
| Monistrol de Calders | `monistrol-de-calders` | [Q16703](https://www.wikidata.org/wiki/Q16703) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Monistrol_de_Calders) | wikidata-search |
| Monistrol de Montserrat | `monistrol-de-montserrat` | [Q16704](https://www.wikidata.org/wiki/Q16704) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Monistrol_de_Montserrat) | wikidata-search |
| Mura | `mura` | [Q16722](https://www.wikidata.org/wiki/Q16722) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Mura) | wikidata-search |
| Navarcles | `navarcles` | [Q16723](https://www.wikidata.org/wiki/Q16723) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Navarcl%C3%A9s) | wikidata-search |
| Navàs | `navas` | [Q16724](https://www.wikidata.org/wiki/Q16724) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Nav%C3%A1s_(Barcelona)) | wikidata-search |
| Rajadell | `rajadell` | [Q16727](https://www.wikidata.org/wiki/Q16727) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Rajadell) | wikidata-search |
| Sallent | `sallent` | [Q16728](https://www.wikidata.org/wiki/Q16728) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Sallent_de_Llobregat) | wikidata-search |
| Sant Feliu Sasserra | `sant-feliu-sasserra` | [Q16729](https://www.wikidata.org/wiki/Q16729) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Fel%C3%ADu_Saserra) | wikidata-search |
| Sant Fruitós de Bages | `sant-fruitos-de-bages` | [Q16730](https://www.wikidata.org/wiki/Q16730) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Fructuoso_de_Bages) | wikidata-search |
| Sant Joan de Vilatorrada | `sant-joan-de-vilatorrada` | [Q16731](https://www.wikidata.org/wiki/Q16731) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Juan_de_Torruella) | wikidata-search |
| Sant Mateu de Bages | `sant-mateu-de-bages` | [Q16732](https://www.wikidata.org/wiki/Q16732) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mateo_de_Bages) | wikidata-search |
| Sant Salvador de Guardiola | `guardiola` | [Q16733](https://www.wikidata.org/wiki/Q16733) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Salvador_de_Guardiola) | wikidata-search |
| Sant Vicenç de Castellet | `sant-vicenc-de-castellet` | [Q16734](https://www.wikidata.org/wiki/Q16734) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Vicente_de_Castellet) | wikidata-search |
| Santa Maria d'Oló | `santa-maria-d-olo` | [Q16735](https://www.wikidata.org/wiki/Q16735) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Ol%C3%B3) | wikidata-search |
| Santpedor | `santpedor` | [Q16736](https://www.wikidata.org/wiki/Q16736) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santpedor) | wikidata-search |
| Súria | `suria` | [Q16737](https://www.wikidata.org/wiki/Q16737) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Suria) | wikidata-search |
| Talamanca | `talamanca` | [Q16738](https://www.wikidata.org/wiki/Q16738) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Talamanca_(Barcelona)) | wikidata-search |

### Partido Judicial de Martorell (`martorell`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q6064889](https://www.wikidata.org/wiki/Q6064889)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Martorell
- **Sede / Dirección:** Passeig del Sindicat, 10 (CP 08760)
- **Google Maps:** https://maps.google.com/?cid=11772922754161233191
- **Plus Code:** `FWHC+2W Martorell`
- **Notas:** Maps: URL reconstruida desde el CID 11772922754161233191 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Abrera | `abrera` | [Q15593](https://www.wikidata.org/wiki/Q15593) | `OK` | [Link](https://es.wikipedia.org/wiki/Abrera) | fuente |
| Castellví de Rosanes | `castellvi-de-rosanes` | [Q15598](https://www.wikidata.org/wiki/Q15598) | `OK` | [Link](https://es.wikipedia.org/wiki/Castellv%C3%AD_de_Rosanes) | fuente |
| Collbató | `collbato` | [Q15600](https://www.wikidata.org/wiki/Q15600) | `OK` | [Link](https://es.wikipedia.org/wiki/Collbat%C3%B3) | fuente |
| Esparreguera | `esparraguera` | [Q15620](https://www.wikidata.org/wiki/Q15620) | `OK` | [Link](https://es.wikipedia.org/wiki/Esparraguera) | fuente |
| Martorell | `martorell` | [Q15623](https://www.wikidata.org/wiki/Q15623) | `OK` | [Link](https://es.wikipedia.org/wiki/Martorell) | fuente |
| Masquefa | `masquefa` | [Q15954](https://www.wikidata.org/wiki/Q15954) | `OK` | [Link](https://es.wikipedia.org/wiki/Masquefa) | fuente |
| Olesa de Montserrat | `olesa-de-montserrat` | [Q15626](https://www.wikidata.org/wiki/Q15626) | `OK` | [Link](https://es.wikipedia.org/wiki/Olesa_de_Montserrat) | fuente |
| Sant Andreu de la Barca | `sant-andreu-de-la-barca` | [Q15634](https://www.wikidata.org/wiki/Q15634) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Andr%C3%A9s_de_la_Barca) | fuente |
| Sant Esteve Sesrovires | `sant-esteve-sesrovires` | [Q15638](https://www.wikidata.org/wiki/Q15638) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Esteban_Sasroviras) | fuente |

### Partido Judicial de Mataró (`mataro`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q6064895](https://www.wikidata.org/wiki/Q6064895)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Matar%C3%B3
- **Sede / Dirección:** Plaça Francisco Tomás i Valiente, s/n (CP 08302) [1, 2]
- **Google Maps:** https://maps.google.com/?cid=10272135822096008812
- **Plus Code:** `GCMQ+3V Mataró`
- **Notas:** Maps: URL reconstruida desde el CID 10272135822096008812 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Alella | `alella` | [Q12034](https://www.wikidata.org/wiki/Q12034) | `OK` | [Link](https://es.wikipedia.org/wiki/Alella) | fuente |
| Argentona | `argentona` | [Q11539](https://www.wikidata.org/wiki/Q11539) | `OK` | [Link](https://es.wikipedia.org/wiki/Argentona) | fuente |
| Cabrera de Mar | `cabrera-de-mar` | [Q12824](https://www.wikidata.org/wiki/Q12824) | `OK` | [Link](https://es.wikipedia.org/wiki/Cabrera_de_Mar) | fuente |
| Cabrils | `cabrils` | [Q12083](https://www.wikidata.org/wiki/Q12083) | `OK` | [Link](https://es.wikipedia.org/wiki/Cabrils) | fuente |
| Caldes d'Estrac | `caldes-d-estrac` | [Q12102](https://www.wikidata.org/wiki/Q12102) | `OK` | [Link](https://es.wikipedia.org/wiki/Caldetas) | fuente |
| Dosrius | `dosrius` | [Q11968](https://www.wikidata.org/wiki/Q11968) | `OK` | [Link](https://es.wikipedia.org/wiki/Dosrius) | fuente |
| El Masnou | `el-masnou` | [Q12039](https://www.wikidata.org/wiki/Q12039) | `OK` | [Link](https://es.wikipedia.org/wiki/El_Masnou) | fuente |
| Mataró | `mataro` | [Q11492](https://www.wikidata.org/wiki/Q11492) | `OK` | [Link](https://es.wikipedia.org/wiki/Matar%C3%B3) | fuente |
| Orrius | `orrius` | [Q12080](https://www.wikidata.org/wiki/Q12080) | `OK` | [Link](https://es.wikipedia.org/wiki/Orrius) | fuente |
| Premià de Dalt | `premia-de-dalt` | [Q12049](https://www.wikidata.org/wiki/Q12049) | `OK` | [Link](https://es.wikipedia.org/wiki/Premi%C3%A1_de_Dalt) | fuente |
| Premià de Mar | `premia-de-mar` | [Q12046](https://www.wikidata.org/wiki/Q12046) | `OK` | [Link](https://es.wikipedia.org/wiki/Premi%C3%A1_de_Mar) | fuente |
| Sant Andreu de Llavaneres | `sant-andreu-de-llavaneres` | [Q12093](https://www.wikidata.org/wiki/Q12093) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Andr%C3%A9s_de_Llavaneras) | fuente |
| Sant Vicenç de Montalt | `sant-vicenc-de-montalt` | [Q12095](https://www.wikidata.org/wiki/Q12095) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Vicente_de_Montalt) | fuente |
| Teià | `teia` | [Q12028](https://www.wikidata.org/wiki/Q12028) | `OK` | [Link](https://es.wikipedia.org/wiki/Tey%C3%A1) | fuente |
| Tiana | `tiana` | [Q12026](https://www.wikidata.org/wiki/Q12026) | `OK` | [Link](https://es.wikipedia.org/wiki/Tiana_(Barcelona)) | fuente |
| Vilassar de Dalt | `vilassar-de-dalt` | [Q12075](https://www.wikidata.org/wiki/Q12075) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Gin%C3%A9s_de_Vilasar) | fuente |
| Vilassar de Mar | `vilassar-de-mar` | [Q12071](https://www.wikidata.org/wiki/Q12071) | `OK` | [Link](https://es.wikipedia.org/wiki/Vilasar_de_Mar) | fuente |

### Partido Judicial de Mollet del Vallès (`mollet-del-valles`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469524](https://www.wikidata.org/wiki/Q117469524)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Mollet_del_Vall%C3%A9s
- **Sede / Dirección:** Carrer de les Llevadores, 2, 08100 Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=11600220240531087249
- **Plus Code:** `G6P9+68 Mollet del Vallès`
- **Notas:** Localidad del Plus Code en la fuente = "Barcelona"; se corrige a "Mollet del Vallès". · Maps: URL reconstruida desde el CID 11600220240531087249 (sin tracking). · Dirección de la fuente con localidad errónea ("Carrer de les Llevadores, 2, 08100 Barcelona, España"). No se publica: manda courts.address.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| La Llagosta | `la-llagosta` | [Q15422](https://www.wikidata.org/wiki/Q15422) | `OK` | [Link](https://es.wikipedia.org/wiki/La_Llagosta) | fuente |
| Martorelles | `martorelles` | [Q15429](https://www.wikidata.org/wiki/Q15429) | `OK` | [Link](https://es.wikipedia.org/wiki/Martorellas) | fuente |
| Mollet del Vallès | `mollet-del-valles` | [Q15430](https://www.wikidata.org/wiki/Q15430) | `OK` | [Link](https://es.wikipedia.org/wiki/Mollet_del_Vall%C3%A9s) | fuente |
| Montmeló | `montmelo` | [Q15431](https://www.wikidata.org/wiki/Q15431) | `OK` | [Link](https://es.wikipedia.org/wiki/Montmel%C3%B3) | fuente |
| Parets del Vallès | `parets-del-valles` | [Q15437](https://www.wikidata.org/wiki/Q15437) | `OK` | [Link](https://es.wikipedia.org/wiki/Parets) | fuente |
| Sant Fost de Campsentelles | `sant-fost-de-campsentelles` | [Q15445](https://www.wikidata.org/wiki/Q15445) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Fausto_de_Campcentellas) | fuente |
| Santa Maria de Martorelles | `santa-maria-de-martorelles` | [Q15455](https://www.wikidata.org/wiki/Q15455) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Martorellas_de_Arriba) | fuente |

### Partido Judicial de Rubí (`rubi`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q6064975](https://www.wikidata.org/wiki/Q6064975)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Rub%C3%AD
- **Sede / Dirección:** Carrer de Pere Esmendia, 15, 08191 Rubí, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=5372127517517987048
- **Plus Code:** `F2QJ+X7 Rubí`
- **Notas:** Maps: URL reconstruida desde el CID 5372127517517987048 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Castellbisbal | `castellbisbal` | [Q13921](https://www.wikidata.org/wiki/Q13921) | `OK` | [Link](https://es.wikipedia.org/wiki/Castellbisbal) | fuente |
| Rubí | `rubi` | [Q13934](https://www.wikidata.org/wiki/Q13934) | `OK` | [Link](https://es.wikipedia.org/wiki/Rub%C3%AD_(Barcelona)) | fuente |
| Sant Cugat del Vallès | `sant-cugat-del-valles` | [Q13936](https://www.wikidata.org/wiki/Q13936) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Cugat_del_Vall%C3%A9s) | fuente |

### Partido Judicial de Sabadell (`sabadell`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469765](https://www.wikidata.org/wiki/Q117469765)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Sabadell
- **Sede / Dirección:** Av. de Francesc Macià, 34, 08208 Sabadell, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=1161763006227761546
- **Plus Code:** `H33X+2F Sabadell`
- **Notas:** Maps: URL reconstruida desde el CID 1161763006227761546 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Castellar del Vallès | `castellar-del-valles` | [Q13918](https://www.wikidata.org/wiki/Q13918) | `OK` | [Link](https://es.wikipedia.org/wiki/Castellar_del_Vall%C3%A9s) | fuente |
| Gallifa | `gallifa` | [Q13928](https://www.wikidata.org/wiki/Q13928) | `OK` | [Link](https://es.wikipedia.org/wiki/Gallifa) | fuente |
| Palau-solità i Plegamans | `palau-solita-i-plegamans` | [Q13926](https://www.wikidata.org/wiki/Q13926) | `OK` | [Link](https://es.wikipedia.org/wiki/Palau-solit%C3%A0_i_Plegamans) | fuente |
| Polinyà | `polinya` | [Q13925](https://www.wikidata.org/wiki/Q13925) | `OK` | [Link](https://es.wikipedia.org/wiki/Poliny%C3%A1) | fuente |
| Sabadell | `sabadell` | [Q12258](https://www.wikidata.org/wiki/Q12258) | `OK` | [Link](https://es.wikipedia.org/wiki/Sabadell) | fuente |
| Sant Llorenç Savall | `sant-llorenc-savall` | [Q13937](https://www.wikidata.org/wiki/Q13937) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Lorenzo_Savall) | fuente |
| Sant Quirze del Vallès | `sant-quirze-del-valles` | [Q13935](https://www.wikidata.org/wiki/Q13935) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Quirico_de_Tarrasa) | fuente |
| Santa Perpètua de Mogoda | `santa-perpetua-de-mogoda` | [Q13941](https://www.wikidata.org/wiki/Q13941) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Perpetua_de_Moguda) | fuente |
| Sentmenat | `sentmenat` | [Q13943](https://www.wikidata.org/wiki/Q13943) | `OK` | [Link](https://es.wikipedia.org/wiki/Senmanat) | fuente |

### Partido Judicial de Sant Boi de Llobregat (`sant-boi-de-llobregat`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469787](https://www.wikidata.org/wiki/Q117469787)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_San_Baudilio_de_Llobregat
- **Sede / Dirección:** Carrer Carles Martí i Vila, 2-4, 08830 Sant Boi de Llobregat, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=13197497720322434982
- **Plus Code:** `82XR+J2 Sant Boi de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 13197497720322434982 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Sant Boi de Llobregat | `sant-boi-de-llobregat` | [Q15635](https://www.wikidata.org/wiki/Q15635) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Baudilio_de_Llobregat) | fuente |
| Sant Climent de Llobregat | `sant-climent-de-llobregat` | [Q15636](https://www.wikidata.org/wiki/Q15636) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Clemente_de_Llobregat) | fuente |
| Santa Coloma de Cervelló | `santa-coloma-de-cervello` | [Q15632](https://www.wikidata.org/wiki/Q15632) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Coloma_de_Cervell%C3%B3) | fuente |
| Torrelles de Llobregat | `torrelles-de-llobregat` | [Q15650](https://www.wikidata.org/wiki/Q15650) | `OK` | [Link](https://es.wikipedia.org/wiki/Torrellas_de_Llobregat) | fuente |

### Partido Judicial de Sant Feliu de Llobregat (`sant-feliu-de-llobregat`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469907](https://www.wikidata.org/wiki/Q117469907)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Sant_Feliu_de_Llobregat
- **Sede / Dirección:** Carrer de Dalt, 10-12, 08980 Sant Feliu de Llobregat, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=16966458240446042653
- **Plus Code:** `92MW+49 Sant Feliu de Llobregat`
- **Notas:** Maps: URL reconstruida desde el CID 16966458240446042653 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Cervelló | `cervello` | [Q15599](https://www.wikidata.org/wiki/Q15599) | `OK` | [Link](https://es.wikipedia.org/wiki/Cervell%C3%B3) | fuente |
| Corbera de Llobregat | `corbera-de-llobregat` | [Q15601](https://www.wikidata.org/wiki/Q15601) | `PENDIENTE` | [Link](https://es.wikipedia.org/wiki/Corbera_de_Llobregat) | fuente |
| El Papiol | `el-papiol` | [Q15631](https://www.wikidata.org/wiki/Q15631) | `OK` | [Link](https://es.wikipedia.org/wiki/El_Papiol) | fuente |
| La Palma de Cervelló | `la-palma-de-cervello` | [Q15630](https://www.wikidata.org/wiki/Q15630) | `OK` | [Link](https://es.wikipedia.org/wiki/La_Palma_de_Cervell%C3%B3) | fuente |
| Molins de Rei | `molins-de-rei` | [Q15624](https://www.wikidata.org/wiki/Q15624) | `OK` | [Link](https://es.wikipedia.org/wiki/Molins_de_Rey) | fuente |
| Pallejà | `palleja` | [Q15627](https://www.wikidata.org/wiki/Q15627) | `OK` | [Link](https://es.wikipedia.org/wiki/Pallej%C3%A1) | fuente |
| Sant Feliu de Llobregat | `sant-feliu-de-llobregat` | [Q15639](https://www.wikidata.org/wiki/Q15639) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Sant_Feliu_de_Llobregat) | wikidata-search |
| Sant Joan Despí | `sant-joan-despi` | [Q15640](https://www.wikidata.org/wiki/Q15640) | `OK` | [Link](https://es.wikipedia.org/wiki/Sant_Joan_Desp%C3%AD) | fuente |
| Sant Vicenç dels Horts | `sant-vicenc-dels-horts` | [Q15649](https://www.wikidata.org/wiki/Q15649) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Vicente_dels_Horts) | fuente |
| Vallirana | `vallirana` | [Q15651](https://www.wikidata.org/wiki/Q15651) | `OK` | [Link](https://es.wikipedia.org/wiki/Vallirana) | fuente |

### Partido Judicial de Santa Coloma de Gramenet (`santa-coloma-de-gramenet`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q117469947](https://www.wikidata.org/wiki/Q117469947)
- **Wikipedia Partido:** FALTA
- **Sede / Dirección:** Plaça d'en Baró, 6, 08921 Santa Coloma de Gramenet, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=16068413496007518461
- **Plus Code:** `F622+7X Santa Coloma de Gramenet`
- **Notas:** Maps: URL reconstruida desde el CID 16068413496007518461 (sin tracking). · La fuente no trae el QID del partido judicial. · La fuente no trae la Wikipedia del partido judicial.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Santa Coloma de Gramenet | `santa-coloma-de-gramenet` | [Q15473](https://www.wikidata.org/wiki/Q15473) | `OK` | [Link](https://es.wikipedia.org/wiki/Santa_Coloma_de_Gramanet) | fuente |

### Partido Judicial de Terrassa (`terrassa`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117469966](https://www.wikidata.org/wiki/Q117469966)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Tarrasa
- **Sede / Dirección:** Edifici Jutjats Nous, Rambleta del Pare Alegre, 112, 08224 Terrassa, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=10171223262054384256
- **Plus Code:** `H225+7C Terrassa`
- **Notas:** Maps: URL reconstruida desde el CID 10171223262054384256 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Matadepera | `matadepera` | [Q13929](https://www.wikidata.org/wiki/Q13929) | `OK` | [Link](https://es.wikipedia.org/wiki/Matadepera) | fuente |
| Rellinars | `rellinars` | [Q13932](https://www.wikidata.org/wiki/Q13932) | `OK` | [Link](https://es.wikipedia.org/wiki/Rellinars) | fuente |
| Terrassa | `terrassa` | [Q13939](https://www.wikidata.org/wiki/Q13939) | `OK` | [Link](https://es.wikipedia.org/wiki/Tarrasa) | fuente |
| Ullastrell | `ullastrell` | [Q13944](https://www.wikidata.org/wiki/Q13944) | `OK` | [Link](https://es.wikipedia.org/wiki/Ullastrell) | fuente |
| Vacarisses | `vacarisses` | [Q13945](https://www.wikidata.org/wiki/Q13945) | `OK` | [Link](https://es.wikipedia.org/wiki/Vacarisas) | fuente |
| Viladecavalls | `viladecavalls` | [Q13946](https://www.wikidata.org/wiki/Q13946) | `OK` | [Link](https://es.wikipedia.org/wiki/Viladecavalls) | fuente |

### Partido Judicial de Vic (`vic`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q6065039](https://www.wikidata.org/wiki/Q6065039)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Vic
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Alpens | `alpens` | [Q13777](https://www.wikidata.org/wiki/Q13777) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Alpens) | wikidata-search |
| Balenyà | `balenya` | [Q13776](https://www.wikidata.org/wiki/Q13776) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Baleny%C3%A1) | wikidata-search |
| Calldetenes | `calldetenes` | [Q13774](https://www.wikidata.org/wiki/Q13774) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Calldetenes) | wikidata-search |
| Castellcir | `castellcir` | [Q15407](https://www.wikidata.org/wiki/Q15407) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellcir) | wikidata-search |
| Centelles | `centelles` | [Q13773](https://www.wikidata.org/wiki/Q13773) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Centellas) | wikidata-search |
| Collsuspina | `collsuspina` | [Q13779](https://www.wikidata.org/wiki/Q13779) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Collsuspina) | wikidata-search |
| El Brull | `el-brull` | [Q13775](https://www.wikidata.org/wiki/Q13775) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Brull) | wikidata-search |
| Folgueroles | `folgueroles` | [Q13782](https://www.wikidata.org/wiki/Q13782) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Folgarolas) | wikidata-search |
| Gurb | `gurb` | [Q13783](https://www.wikidata.org/wiki/Q13783) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Gurb) | wikidata-search |
| L'Esquirol | `l-esquirol` | [Q13837](https://www.wikidata.org/wiki/Q13837) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Corc%C3%B3) | wikidata-search |
| Les Masies de Roda | `les-masies-de-roda` | [Q13803](https://www.wikidata.org/wiki/Q13803) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Mas%C3%ADas_de_Roda) | wikidata-search |
| Les Masies de Voltregà | `les-masies-de-voltrega` | [Q13801](https://www.wikidata.org/wiki/Q13801) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Las_Mas%C3%ADas_de_Voltreg%C3%A1) | wikidata-search |
| Lluçà | `lluça` | [Q13784](https://www.wikidata.org/wiki/Q13784) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Llus%C3%A1) | wikidata-search |
| Malla | `malla` | [Q13805](https://www.wikidata.org/wiki/Q13805) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Malla_(Barcelona)) | wikidata-search |
| Manlleu | `manlleu` | [Q13804](https://www.wikidata.org/wiki/Q13804) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Manlleu) | wikidata-search |
| Montesquiu | `montesquiu` | [Q13800](https://www.wikidata.org/wiki/Q13800) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Montesquiu) | wikidata-search |
| Muntanyola | `muntanyola` | [Q13799](https://www.wikidata.org/wiki/Q13799) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Montanyola) | wikidata-search |
| Olost | `olost` | [Q13798](https://www.wikidata.org/wiki/Q13798) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Olost) | wikidata-search |
| Orís | `oris` | [Q13797](https://www.wikidata.org/wiki/Q13797) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Or%C3%ADs) | wikidata-search |
| Oristà | `orista` | [Q13796](https://www.wikidata.org/wiki/Q13796) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Orist%C3%A1) | wikidata-search |
| Perafita | `perafita` | [Q13795](https://www.wikidata.org/wiki/Q13795) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Perafita) | wikidata-search |
| Prats de Lluçanès | `prats-de-llucanes` | [Q13814](https://www.wikidata.org/wiki/Q13814) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Prats_de_Llusan%C3%A9s) | wikidata-search |
| Roda de Ter | `roda-de-ter` | [Q13815](https://www.wikidata.org/wiki/Q13815) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Roda_de_Ter) | wikidata-search |
| Rupit i Pruit | `rupit-i-pruit` | [Q13816](https://www.wikidata.org/wiki/Q13816) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Rupit_y_Pru%C3%AFt) | wikidata-search |
| Sant Agustí de Lluçanès | `sant-agusti-de-llucanes` | [Q13817](https://www.wikidata.org/wiki/Q13817) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Agust%C3%ADn_de_Llusan%C3%A9s) | wikidata-search |
| Sant Bartomeu del Grau | `sant-bartomeu-del-grau` | [Q13818](https://www.wikidata.org/wiki/Q13818) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Bartolom%C3%A9_del_Grau) | wikidata-search |
| Sant Boi de Lluçanès | `sant-boi-de-llucanes` | [Q13819](https://www.wikidata.org/wiki/Q13819) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Baudilio_de_Llusan%C3%A9s) | wikidata-search |
| Sant Hipòlit de Voltregà | `sant-hipolit-de-voltrega` | [Q13820](https://www.wikidata.org/wiki/Q13820) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Hip%C3%B3lito_de_Voltreg%C3%A1) | wikidata-search |
| Sant Julià de Vilatorta | `sant-julia-de-vilatorta` | [Q13821](https://www.wikidata.org/wiki/Q13821) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Juli%C3%A1n_de_Vilatorta) | wikidata-search |
| Sant Martí d'Albars | `sant-marti-d-albars` | [Q13822](https://www.wikidata.org/wiki/Q13822) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mart%C3%ADn_del_Bas) | wikidata-search |
| Sant Martí de Centelles | `sant-marti-de-centelles` | [Q13823](https://www.wikidata.org/wiki/Q13823) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mart%C3%ADn_de_Centellas) | wikidata-search |
| Sant Pere de Torelló | `sant-pere-de-torello` | [Q13828](https://www.wikidata.org/wiki/Q13828) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Pedro_de_Torell%C3%B3) | wikidata-search |
| Sant Quirze de Besora | `sant-quirze-de-besora` | [Q13830](https://www.wikidata.org/wiki/Q13830) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Quirico_de_Besora) | wikidata-search |
| Sant Sadurní d'Osormort | `sant-sadurni-d-osormort` | [Q13831](https://www.wikidata.org/wiki/Q13831) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Saturnino_de_Osormort) | wikidata-search |
| Sant Vicenç de Torelló | `sant-vicenc-de-torello` | [Q13833](https://www.wikidata.org/wiki/Q13833) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Vicente_de_Torell%C3%B3) | wikidata-search |
| Santa Cecília de Voltregà | `santa-cecilia-de-voltrega` | [Q13832](https://www.wikidata.org/wiki/Q13832) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Cecilia_de_Voltreg%C3%A1) | wikidata-search |
| Santa Eugènia de Berga | `santa-eugenia-de-berga` | [Q13834](https://www.wikidata.org/wiki/Q13834) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Eugenia_de_Berga) | wikidata-search |
| Santa Eulàlia de Riuprimer | `santa-eulalia-de-riuprimer` | [Q13836](https://www.wikidata.org/wiki/Q13836) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Eulalia_de_Riuprimer) | wikidata-search |
| Santa Maria de Besora | `santa-maria-de-besora` | [Q13835](https://www.wikidata.org/wiki/Q13835) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Mar%C3%ADa_de_Besora) | wikidata-search |
| Seva | `seva` | [Q13839](https://www.wikidata.org/wiki/Q13839) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Seva_(Espa%C3%B1a)) | wikidata-search |
| Sobremunt | `sobremunt` | [Q13848](https://www.wikidata.org/wiki/Q13848) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Sobremunt) | wikidata-search |
| Sora | `sora` | [Q13849](https://www.wikidata.org/wiki/Q13849) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Sora_(Barcelona)) | wikidata-search |
| Taradell | `taradell` | [Q13850](https://www.wikidata.org/wiki/Q13850) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Taradell) | wikidata-search |
| Tavèrnoles | `tavernoles` | [Q13851](https://www.wikidata.org/wiki/Q13851) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Tabernolas) | wikidata-search |
| Tavertet | `tavertet` | [Q13852](https://www.wikidata.org/wiki/Q13852) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Tavertet) | wikidata-search |
| Tona | `tona` | [Q13853](https://www.wikidata.org/wiki/Q13853) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Tona_(Espa%C3%B1a)) | wikidata-search |
| Torelló | `torello` | [Q13854](https://www.wikidata.org/wiki/Q13854) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Torell%C3%B3) | wikidata-search |
| Vic | `vic` | [Q13855](https://www.wikidata.org/wiki/Q13855) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vic) | wikidata-search |
| Vilanova de Sau | `vilanova-de-sau` | [Q13859](https://www.wikidata.org/wiki/Q13859) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vilanova_de_Sau) | wikidata-search |

### Partido Judicial de Vilafranca del Penedès (`vilafranca-del-penedes`)
- **Estado Partido:** `CORREGIDO-PROPUESTO`
- **QID Partido:** [Q6065049](https://www.wikidata.org/wiki/Q6065049)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Villafranca_del_Panad%C3%A9s
- **Sede / Dirección:** *(en courts)*
- **Google Maps:** *(búsqueda por nombre)*
- **Plus Code:** `N/A`
- **Notas:** Partido ausente en la fuente: QID/Wikipedia a completar con búsqueda en Wikidata.

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Avinyonet del Penedès | `avinyonet-del-penedes` | [Q791068](https://www.wikidata.org/wiki/Q791068) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Avinyonet) | wikidata-search |
| Castellví de la Marca | `castellvi-de-la-marca` | [Q765591](https://www.wikidata.org/wiki/Q765591) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Castellv%C3%AD_de_la_Marca) | wikidata-search |
| El Pla del Penedès | `el-pla-del-penedes` | [Q1312464](https://www.wikidata.org/wiki/Q1312464) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Pla_del_Panad%C3%A9s) | wikidata-search |
| Font-rubí | `font-rubi` | [Q984398](https://www.wikidata.org/wiki/Q984398) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Fontrub%C3%AD) | wikidata-search |
| Gelida | `gelida` | [Q763729](https://www.wikidata.org/wiki/Q763729) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/G%C3%A9lida) | wikidata-search |
| La Granada | `la-granada` | [Q1228808](https://www.wikidata.org/wiki/Q1228808) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/La_Granada) | wikidata-search |
| Les Cabanyes | `les-cabanyes` | [Q1228790](https://www.wikidata.org/wiki/Q1228790) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Las_Cabanyas) | wikidata-search |
| Mediona | `mediona` | [Q686790](https://www.wikidata.org/wiki/Q686790) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Mediona) | wikidata-search |
| Olèrdola | `olerdola` | [Q1228441](https://www.wikidata.org/wiki/Q1228441) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Ol%C3%A8rdola) | wikidata-search |
| Olesa de Bonesvalls | `olesa-de-bonesvalls` | [Q659734](https://www.wikidata.org/wiki/Q659734) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Olesa_de_Bonesvalls) | wikidata-search |
| Pacs del Penedès | `pacs-del-penedes` | [Q958681](https://www.wikidata.org/wiki/Q958681) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Pachs_del_Panad%C3%A9s) | wikidata-search |
| Pontons | `pontons` | [Q1229275](https://www.wikidata.org/wiki/Q1229275) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Pontons) | wikidata-search |
| Puigdàlber | `puigdalber` | [Q1230115](https://www.wikidata.org/wiki/Q1230115) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Puigdalba) | wikidata-search |
| Sant Cugat Sesgarrigues | `sant-cugat-sesgarrigues` | [Q584252](https://www.wikidata.org/wiki/Q584252) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Cugat_Sasgarrigas) | wikidata-search |
| Sant Llorenç d'Hortons | `sant-llorenc-d-hortons` | [Q321918](https://www.wikidata.org/wiki/Q321918) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Lorenzo_de_Hort%C3%B3ns) | wikidata-search |
| Sant Martí Sarroca | `sant-marti-sarroca` | [Q593512](https://www.wikidata.org/wiki/Q593512) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Mart%C3%ADn_Sarroca) | wikidata-search |
| Sant Pere de Riudebitlles | `sant-pere-de-riudebitlles` | [Q633095](https://www.wikidata.org/wiki/Q633095) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Pedro_de_Riudevitlles) | wikidata-search |
| Sant Quintí de Mediona | `sant-quinti-de-mediona` | [Q648963](https://www.wikidata.org/wiki/Q648963) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Quint%C3%ADn_de_Mediona) | wikidata-search |
| Sant Sadurní d'Anoia | `sant-sadurni-d-anoia` | [Q984508](https://www.wikidata.org/wiki/Q984508) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/San_Sadurn%C3%AD_de_Noya) | wikidata-search |
| Santa Fe del Penedès | `santa-fe-del-penedes` | [Q920409](https://www.wikidata.org/wiki/Q920409) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Fe_del_Panad%C3%A9s) | wikidata-search |
| Santa Margarida i els Monjos | `santa-margarida-i-els-monjos` | [Q660350](https://www.wikidata.org/wiki/Q660350) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Santa_Margarita_y_Monj%C3%B3s) | wikidata-search |
| Subirats | `subirats` | [Q782758](https://www.wikidata.org/wiki/Q782758) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Subirats) | wikidata-search |
| Torrelavit | `torrelavit` | [Q1228768](https://www.wikidata.org/wiki/Q1228768) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Torrelavit) | wikidata-search |
| Torrelles de Foix | `torrelles-de-foix` | [Q984393](https://www.wikidata.org/wiki/Q984393) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Torrellas_de_Foix) | wikidata-search |
| Vilafranca del Penedès | `vilafranca-del-penedes` | [Q835012](https://www.wikidata.org/wiki/Q835012) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Villafranca_del_Panad%C3%A9s) | wikidata-search |
| Vilobí del Penedès | `vilobi-del-penedes` | [Q1228795](https://www.wikidata.org/wiki/Q1228795) | `CORREGIDO-PROPUESTO` | [Link](https://es.wikipedia.org/wiki/Vilov%C3%AD) | wikidata-search |

### Partido Judicial de Vilanova i la Geltrú (`vilanova-i-la-geltru`)
- **Estado Partido:** `OK`
- **QID Partido:** [Q117470023](https://www.wikidata.org/wiki/Q117470023)
- **Wikipedia Partido:** https://es.wikipedia.org/wiki/Partido_judicial_de_Villanueva_y_Geltr%C3%BA
- **Sede / Dirección:** Ronda Ibèrica, 175, 08800 Vilanova i la Geltrú, Barcelona, España
- **Google Maps:** https://maps.google.com/?cid=17581315882892468235
- **Plus Code:** `6PG8+J8 Vilanova i la Geltrú`
- **Notas:** Maps: URL reconstruida desde el CID 17581315882892468235 (sin tracking).

| Municipio | Slug | QID | Estado | Wikipedia | Origen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Canyelles | `canyelles` | [Q15559](https://www.wikidata.org/wiki/Q15559) | `OK` | [Link](https://es.wikipedia.org/wiki/Canyellas) | fuente |
| Castellet i la Gornal | `castellet-i-la-gornal` | [Q1228799](https://www.wikidata.org/wiki/Q1228799) | `OK` | [Link](https://es.wikipedia.org/wiki/Castellet_y_Gornal) | fuente |
| Cubelles | `cubelles` | [Q15558](https://www.wikidata.org/wiki/Q15558) | `OK` | [Link](https://es.wikipedia.org/wiki/Cubellas) | fuente |
| Olivella | `olivella` | [Q15557](https://www.wikidata.org/wiki/Q15557) | `OK` | [Link](https://es.wikipedia.org/wiki/Olivella) | fuente |
| Sant Pere de Ribes | `sant-pere-de-ribes` | [Q15555](https://www.wikidata.org/wiki/Q15555) | `OK` | [Link](https://es.wikipedia.org/wiki/San_Pedro_de_Ribas) | fuente |
| Sitges | `sitges` | [Q15551](https://www.wikidata.org/wiki/Q15551) | `OK` | [Link](https://es.wikipedia.org/wiki/Sitges) | fuente |
| Vilanova i la Geltrú | `vilanova-i-la-geltru` | [Q15553](https://www.wikidata.org/wiki/Q15553) | `OK` | [Link](https://es.wikipedia.org/wiki/Villanueva_y_Geltr%C3%BA) | fuente |
