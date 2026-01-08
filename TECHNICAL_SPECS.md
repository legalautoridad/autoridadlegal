# 📐 TECHNICAL SPECIFICATIONS & ARCHITECTURE

## 1. DATABASE SCHEMA (SOURCE OF TRUTH)
The database is managed via Supabase (PostgreSQL). Use these exact table/column names.

### A. Lawyer Identity (`lawyer_profiles`)
*Extends `auth.users`. Contains legal verification data.*
*   `id` (uuid, PK, references `auth.users`): 1:1 link.
*   `document_type` (text): ENUM ('DNI', 'NIF').
*   `document_number` (text).
*   `bar_association` (text): Colegio de Abogados (e.g., 'ICAB').
*   `bar_number` (text): Nº Colegiado.
*   `office_address` (text): Fiscal/Office address.
*   `notification_email` (text): Critical for alerts (may differ from auth email).
*   `notification_phone` (text).
*   `website_url` (text): Optional.
*   `is_verified` (boolean): Default `FALSE`.
*   `verification_status` (text): ENUM ('PENDING', 'VERIFIED', 'REJECTED').
*   `created_at`, `updated_at` (timestamps).

### B. Lawyer Financials ("Monedero" & Subscriptions)
- **`lawyer_subscriptions`**:
    - `id` (uuid, PK).
    - `lawyer_id` (uuid, FK `lawyer_profiles.id`).
    - `active_zones` (text[]): Array of **Zone IDs** (e.g., ['BCN_VALLES', 'MARESME']).
    - `active_matters` (text[]): Array of contracted matters (e.g., ['ALCOHOLEMIA']).
    - `monthly_fee` (numeric): Calculated recurring price.
    - `stripe_subscription_id` (text).
    - `status` (text): ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED').
    - `created_at` (timestamp).

---

## 2. ONBOARDING & ZONE DEFINITIONS

### Commercial Zones (Groups of Judicial Districts)
The user selects these **Commercial Zones**. The system internally maps them to Judicial Districts if needed, but for billing we store the Zone ID.

1.  **BCN_VALLES**: Barcelona, Badalona, Hospitalet, Terrassa, Sabadell, Cornellà, Sant Boi, Sta Coloma, Cerdanyola, El Prat, Esplugues, Gavà, Martorell, Mollet, Rubí, Sant Feliu.
2.  **MARESME**: Mataró, Arenys de Mar, Granollers.
3.  **GARRAF**: Vilanova i la Geltrú, Vilafranca del Penedès, Igualada.
4.  **MANRESA**: Manresa, Berga, Vic.

### Pricing Model
- **Base Fee**: **150€** (Includes 1 Zone + 1 Matter).
- **Extra Zone**: **+80€** each.
- **Extra Matter**: **+50€** each.
