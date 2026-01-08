# 🏛️ AUTORIDAD LEGAL - PROJECT STATUS & ROADMAP
**Versión:** 0.3.0 (MVP Alpha)
**Fecha:** 08/01/2026
**Tecnología:** Next.js 14, Supabase (Auth/DB/RLS), Tailwind, TypeScript.

## ✅ LOGROS CONSOLIDADOS (DONE)

### 1. MÓDULO ABOGADOS (PROVIDER SIDE)
- **Onboarding Completo:** Registro público `/lawyer/register`, selección de Colegios (ICAB, etc.) y validación de datos.
- **Gestión de Zonas (Marketplace):** Selección de zonas comerciales vs partidos judiciales con precios dinámicos. (Mapa retirado por usabilidad móvil, sustituido por listas claras).
- **Dashboard & Seguridad:**
    - Bloqueo preventivo de cuentas `PENDING`.
    - Desbloqueo automático tras aprobación Admin.
    - Logout y gestión de sesión segura.
- **Calendario:** Infraestructura para bloqueo de fechas (disponibilidad).

### 2. MÓDULO CLIENTES (LEAD SIDE)
- **Chatbot IA Comercial:**
    - Estrategia definida: Prompt System + Context Caching (Ready for Production).
    - Flujo: Captura de datos -> Scoring de Lead -> Cierre.
- **Cierre de Acuerdo:**
    - Botón de contratación integrado.
    - Generación de PDF de encargo profesional (Descarga/Envío).
    - Asignación: El lead aparece reflejado en el Dashboard del abogado.

### 3. INFRAESTRUCTURA & ADMIN
- **Arquitectura SEO Programático:** Estructura de carpetas y sitemaps preparada para escalado masivo de keywords locales.
- **Panel de Administración:** `/admin/verifications` para control manual de altas (Aprobar/Rechazar).
- **Base de Datos:** Tablas relacionales (`lawyer_profiles`, `subscriptions`, `leads`) con seguridad RLS activada.

---

## 🔮 FASE 2: EL FUTURO (ROADMAP PARA CTO)
Estas son las funcionalidades diseñadas que requieren implementación en la siguiente fase:

### 1. ALGORITMO DE ASIGNACIÓN (EL CEREBRO)
Refinamiento del sistema de reparto de leads. Debe considerar:
- **Zonas Contratadas:** Match geográfico estricto.
- **Materia:** Especialidad del abogado.
- **Score de Calidad:** Puntuación interna del abogado (basada en cierres/valoraciones).
- **Disponibilidad:** Consultar bloqueo de fechas en Calendario antes de asignar.
- **Balance:** Comprobación de saldo/créditos disponibles.
- **Fallback:** Lógica de asignación por defecto si no hay abogados disponibles en la zona (Lead huérfano).

### 2. SISTEMA DE PENALIZACIONES
- Lógica para restar score o bloquear temporalmente a abogados que rechacen leads asignados o no respondan en tiempo (SLA).

### 3. NOTIFICACIONES OMNICANAL
- Implementar avisos automáticos tras la asignación: SMS, WhatsApp (Twilio/Meta API) y Email (Resend/SendGrid).

### 4. PAGOS REALES
- Migrar de la simulación actual a Stripe Connect / Checkout real.

---