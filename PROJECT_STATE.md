# 🏗️ PROJECT STATE: AUTORIDAD LEGAL (LegalTech MVP)

## 0. CRITICAL REFERENCES (SOURCE OF TRUTH)
*   **[TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)**: Contains the **Exact Database Schema**, **Field Definitions**, **Enums**, and **Business Logic Formulas**.
    *   ⚠️ **MANDATORY:** Consult `TECHNICAL_SPECS.md` before writing any code related to Database, Financial Logic, or Lawyer Availability.

## 1. VISION & PHILOSOPHY
- **Core Concept:** High-Frequency Legal Lead Arbitrage & Direct Assignment powered by Generative AI.
- **Value Prop:** Moving from passive directories to active **AI Triage (Gemini 2.5)** + **Programmatic SEO** + **Direct Expert Assignment**.
- **Key Differentiator:** "Silos de Autoridad Local" (e.g., `/alcoholemia/barcelona`) + "Closing the Deal" via AI + **Prepaid Lawyer Credits**.

## 2. TECH STACK (STRICT)
- **Framework:** Next.js 16 (Turbopack).
- **Language:** TypeScript.
- **Database & Auth:** Supabase (Postgres + Auth + RLS).
- **AI Engine:** Google Gemini 2.5 Flash (via Google GenAI SDK).
  - *Strategy:* **Monolithic Prompt** (System + Legal FAQ integrated).
  - *Performance:* Real-time conversational triage.
- **Styling:** Tailwind CSS + Framer Motion + Lucide React.
- **Payments:** Stripe (Reservation Mode for Clients).
- **Notifications:** SMS (Twilio/AWS SNS) + Email (Resend).
- **Deployment:** Vercel.

## 3. BUSINESS LOGIC: PREPAID ASSIGNMENT MODEL ("MONEDERO")
We operate on a **Firm-like Assignment Model** backed by a **Prepaid Credit System**.

### A. The Transaction Flow
1.  **User:** Signs Honorary Agreement & Pays Reservation (e.g., 50€).
2.  **System:** Generates PDF Contract immediately.
3.  **Assignment:** Algorithm selects the best available lawyer (Direct Assignment).
4.  **Monetization:**
    * **Total Fee:** 1.000€ (Example).
    * **Platform Fee:** 25% (250€).
    * **Deduction:** The system deducts (250€ - Reservation) from the Lawyer's Credit Balance.
    * **Lawyer Collection:** Lawyer collects the remaining balance (950€) directly from the client.

### B. The Lawyer Relationship (Golden Handcuffs)
* **Prepaid Wallet:** Lawyers purchase credit packs in advance (e.g., 1.000€).
* **Automatic Deduction:** Fees are deducted instantly upon assignment.
* **Zero Debt:** If `Credit Balance < Fee`, the lawyer is skipped in rotation.

---

## 4. ARCHITECTURE: THE "STRATEGIST" PROMPT
The core IP is the System Prompt (`src/lib/ai/config.ts`).
* **Role:** "Senior Penal Lawyer" (Autoridad Legal).
* **Logic:** Triage -> Risk Assessment -> Negotiation -> Market Anchor -> Close.
* **Safety:** "Jailbroken" via Prompt Engineering to allow specific legal triage (0.60 vs 0.65 rates).

---

## 5. CURRENT STATUS (LIVING DOCUMENT)
* ✅ **AI Core:** Gemini 2.5 Flash operational with "Inhibition Protocols".
* ✅ **Lead Capture:** Form Data flows to Supabase.
* ✅ **Closing Flow:** Dynamic Payment Button -> Checkout Summary -> PDF Contract.
* ✅ **DB Schema Deployed:** (Tablas `lawyer_availability`, `lawyer_wallets`, `cases` migradas).
* ✅ **System Audit Passed:** (Script `diagnose-system.ts` operativo y clean).
* ✅ **Lawyer Dashboard:** (Deployed at `/lawyer/dashboard`).

---

## 6. OPERATIONAL SPECS: ASSIGNMENT & PROTOCOLS

### A. Assignment Algorithm (Direct & Veto)
* **Logic:** Direct Assignment (No "Acceptance Button").
* **Veto Rule:** Lawyer has **2 HOURS** (or until 16:00) to reject via Dashboard if Force Majeure.
* **Rejection Penalty:** Unjustified rejection = Algo Penalty + Administrative Fee.

### B. The "Contact Protocol" (Mirror Audit)
1.  **Notification:** Lawyer receives SMS/Email: "CASE ASSIGNED. Contact Client by [Time]."
2.  **Action:** Lawyer clicks `[✅ CONTACTO REALIZADO]` in Dashboard.
3.  **Audit:** System immediately sends SMS to Client: *"Your lawyer confirms contacting you. If false, click here."*
4.  **Failure:** If no confirmation within window -> SMS Warning to Lawyer.

### C. Exception Handling (The "Safety Net")
1.  **Unreachable Client:**
    * Lawyer must click `[⚠️ INTENTO FALLIDO]` 3 times (>24h total).
    * Result: Case Closed + **Automatic Credit Refund**.
2.  **Client Cancelled:**
    * Lawyer marks `[❌ CANCELADO POR CLIENTE]` (Must input reason).
    * Result: Case Closed + **Automatic Credit Refund**.
    * *Anti-Fraud:* System triggers random "Mystery Audit" to client (10% of cases).

---

## 7. DB SCHEMA (IMPLEMENTED)
* **`lawyer_credits`**: Wallet balance management.
* **`lawyer_transactions`**: Ledger of deductions/refunds.
* **`lawyer_stats`**: Performance metrics (Conversion Rate, Cancellation Rate).
* **`cases`**: Enhanced status (`ASSIGNED`, `CONTACTED`, `UNREACHABLE`, `CANCELLED`).

---

## 8. ROADMAP

### Priority 1: Infrastructure
- [x] **DB Schema**: `lawyer_wallets`, `transactions`, `lawyer_stats`.

### Priority 2: System Audit (Refactoring)
- [x] Security Audit (Credentials & .gitignore).
- [x] Database Integrity Check.
- [x] Legacy Clean-up.

### Priority 3: Feature Development (NEXT)
### Priority 3: Feature Development (NEXT)
- [x] **Build Lawyer Dashboard UI** (`/lawyer/dashboard`).
- [ ] **Email/SMS Notifications** (Integration).