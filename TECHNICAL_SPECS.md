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
- **`lawyer_subscriptions`** (New):
    - `id` (uuid, PK).
    - `lawyer_id` (uuid, FK `lawyer_profiles.id`).
    - `active_zones` (text[]): Array of contracted zones (e.g., ['BCN', 'MARESME']).
    - `active_matters` (text[]): Array of contracted matters (e.g., ['ALCOHOLEMIA']).
    - `monthly_fee` (numeric): Calculated recurring price.
    - `stripe_subscription_id` (text).
    - `status` (text): ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED').
    - `created_at` (timestamp).

- **`lawyer_wallets`**:
  - `lawyer_id` (uuid, PK)
  - `balance` (numeric): Must be >= 0.

- **`wallet_transactions`**:
  - `amount` (numeric): Negative for deductions, Positive for deposits.
  - `type` (text): [`DEPOSIT`, `CASE_FEE`, `REFUND_UNREACHABLE`, `REFUND_CANCELLED`]

### C. Core Business (`cases`)
*Replaces legacy `leads` table.*
- `id` (uuid, PK)
- `created_at` (timestamp)
- `status` (text): Enum [`PENDING`, `ASSIGNED`, `CONTACTED`, `UNREACHABLE`, `CANCELLED`, `CLOSED_SUCCESS`]
- `assigned_lawyer_id` (uuid, FK `auth.users`)
- `reservation_amount` (numeric): Usually 50.00.
- `honorarios` (numeric): Usually 1000.00.
- `client_name`, `client_phone` (text)
- `judicial_district` (text)
- `contact_confirmed_at` (timestamp): Set when lawyer clicks "Confirm".

### D. Lawyer Availability
- **`lawyer_availability`**:
  - `lawyer_id` (uuid)
  - `blocked_date` (date)
  - `reason` (text)

---

## 2. BUSINESS LOGIC ALGORITHMS

### A. Financial Deduction Formula
Executed atomically upon assignment.
```typescript
PlatformFee = TotalFee * 0.25; // 25% of total
Deduction = PlatformFee - ReservationPaidByClient;
// Example: 1000 * 0.25 = 250. Client paid 50. Deduction = 200.
```

### B. Assignment Rules (Direct Assignment)
Filter: Lawyers in District + Active + Credit Balance >= Deduction.

Exclude: Lawyers with blocked_date matching hearing_date.

Trigger: Send SMS/Email immediately.

Window: Lawyer has 2 hours (or until 16:00) to reject via Dashboard.

### C. The "Mirror Audit" Protocol
Event: Lawyer clicks [CONFIRM CONTACT].

System Action:

Update cases.status -> CONTACTED.

Send SMS to Client: "Lawyer [Name] confirmed contacting you."

---

## 3. ONBOARDING & VERIFICATION FLOW

### Pricing Model
- Base (1 Materia + 1 Zona): **150€**.
- Extra Materia: **+50€**.
- Extra Zona: **+80€**.

### Restrictions
- Verified Status: Lawyers cannot receive cases until `is_verified` is TRUE.
- Pending State: Dashboard shows overlay if paid but not verified.

---

## 4. SECURITY & SAFETY
Credentials: No .env or .json secrets in root unless in .gitignore.

Hygiene: Temporary scripts must be located in scripts/ and deleted after use.
