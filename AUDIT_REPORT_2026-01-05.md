# AUDIT REPORT: AUTORIDAD LEGAL
**Fecha:** 2026-01-05
**Auditor:** Antigravity Agent

Este reporte detalla el estado técnico del proyecto tras un análisis profundo de la arquitectura, base de datos, lógica de negocio y seguridad.

---

## 🚦 RESUMEN DE ESTADO
*   **Estado General:** ⚠️ **AMARILLO (Con Riesgos Críticos)**
*   **Build:** 🛑 **ROTO** (Error de compilación TypeScript)
*   **Seguridad:** 🛑 **CRÍTICA** (Credenciales expuestas)

---

## 1. ARQUITECTURA DE ARCHIVOS
### ✅ LO BUENO
*   **Estructura Next.js 16:** Sigue correctamente el patrón App Router (`src/app`).
*   **Organización:** Carpetas bien segmentadas (`src/lib`, `src/components`, `src/actions`).
*   **Configuración:** Dependencias actualizadas (`next: 16.1.1`, `typescript: 5`).

### 🛑 LO CRÍTICO
*   **Seguridad:** El archivo `service-account.json` está en la raíz y **NO está en `.gitignore`**. Esto es un riesgo de seguridad masivo si se sube al repositorio.
*   **Build Roto:** `npm run build` falla.
    *   *Error:* `Module '"@/lib/utils"' has no exported member 'openChat'.`
    *   *Archivo:* `src/app/alcoholemia/[city]/[rate]/page.tsx`

---

## 2. INTEGRIDAD DE BASE DE DATOS (SUPABASE)
### ✅ LO BUENO
*   **Sistema Financiero:** La migración `20240106000000_financial_system.sql` implementa correctamente:
    *   `lawyer_wallets` (Saldo y validación `>=0`).
    *   `wallet_transactions` (Historial de movimientos).
    *   `lawyer_stats` (Métricas de desempeño).

### ⚠️ DEUDA TÉCNICA (AMARILLO)
*   **Conflicto de Tablas:**
    *   `schema.sql` define la tabla `leads`.
    *   La migración define la tabla `cases`.
    *   El código usa `cases`. Se debe unificar y limpiar `leads` si ya no se usa, o migrar los datos.
*   **Perfiles de Abogado:** La tabla `profiles` eXiste pero faltan campos explícitos requeridos por el negocio (`specialty`, `zone`) para el algoritmo de asignación.

### 🛑 LO FALTANTE (ROJO)
*   **`lawyer_availability`**: No existe ninguna tabla para gestionar el calendario o disponibilidad de abogados, ni en migraciones ni en esquema base.

---

## 3. LÓGICA DE NEGOCIO Y IA
### ✅ LO BUENO
*   **System Prompt:** `src/lib/ai/config.ts` contiene la versión correcta ("Autoridad Legal", "Inhibición", "Jailbreak").
*   **Algoritmo de Precios:** `calculate_legal_quote` en `src/lib/ai/tools.ts` es dinámico (Precio base + Complejidad + Negociación).
*   **Asignación Financiera:** `src/lib/actions/financial-actions.ts` implementa correctamente:
    *   Deducción atómica (Platform Fee - Reserva).
    *   Validación de saldo insuficiente.
    *   Reembolsos por "Unreachable" o "Cancelled".

---

## 4. PLAN DE ACCIÓN
Para desbloquear el proyecto y pasar a VERDE, ejecutar en orden:

1.  **SEGURIDAD INMEDIATA:**
    *   Añadir `service-account.json` a `.gitignore`.

2.  **REPARAR BUILD:**
    *   Corregir `src/app/alcoholemia/[city]/[rate]/page.tsx`. Eliminar importación de `openChat` o implementarla en `lib/utils`.

3.  **BASE DE DATOS:**
    *   Crear migración para unificar `leads` -> `cases`.
    *   Crear tabla `lawyer_availability`.
    *   Añadir campos `specialty` y `zone` a `profiles`.

4.  **LIMPIEZA:**
    *   Borrar `fix_schema.sql` y consolidar el esquema.

---
**Firma:** Antigravity Auditor
