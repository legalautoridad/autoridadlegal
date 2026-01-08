# 📐 TECHNICAL SPECIFICATIONS & ARCHITECTURE

## 1. DATABASE SCHEMA (SOURCE OF TRUTH)
The database is managed via Supabase (PostgreSQL). Use these exact table/column names.

### A. Core Business (`cases`)
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

### B. Lawyer Financials ("Monedero")
- **`lawyer_wallets`**:
  - `lawyer_id` (uuid, PK)
  - `balance` (numeric): Must be >= 0.
- **`wallet_transactions`**:
  - `amount` (numeric): Negative for deductions, Positive for deposits.
  - `type` (text): [`DEPOSIT`, `CASE_FEE`, `REFUND_UNREACHABLE`, `REFUND_CANCELLED`]

### C. Lawyer Availability
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

## 3. SECURITY & SAFETY
Credentials: No .env or .json secrets in root unless in .gitignore.

Hygiene: Temporary scripts must be located in scripts/ and deleted after use.
