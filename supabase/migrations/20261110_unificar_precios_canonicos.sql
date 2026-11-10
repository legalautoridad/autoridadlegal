-- ============================================================================
-- MIGRACIÓN: UNIFICACIÓN DE PRECIOS CANÓNICOS (AUTORIDAD LEGAL)
-- Fecha: 2026-11-10
-- Proyecto: xiqfcritzjabiunfwksn
-- ============================================================================

-- 1. HOMEPAGE FAQS: Actualizar respuesta de '¿Cuánto cuesta defenderme?'
UPDATE public.homepage_faqs
SET answer = 'El precio base para la defensa penal en juicio rápido con conformidad es de 680 € + IVA (procurador de los tribunales incluido sin coste adicional). Si concurren circunstancias específicas (conductor profesional, reincidencia, riesgo de prisión, asistencia urgente al detenido en comisaría o juicio sin conformidad), se aplican suplementos fijos comunicados previamente por escrito. Los tributos legalmente aplicables se liquidan y detallan formalmente en la hoja de encargo previa.',
    updated_at = NOW()
WHERE id = '99a97e67-29f7-45da-9508-300e18aa6c1a'
   OR question ILIKE '%Cuánto cuesta defenderme%';

-- 2. AI CONFIG: Tabla de historial y actualización del system_prompt
CREATE TABLE IF NOT EXISTS public.ai_config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Archivar copia actual
INSERT INTO public.ai_config_history (key, value)
SELECT key, value FROM public.ai_config WHERE key = 'system_prompt';

-- Actualizar system_prompt con precios canónicos y reglas actualizadas
UPDATE public.ai_config
SET value = $,
    updated_at = NOW()
WHERE key = 'system_prompt';

-- 3. LOCATION_SERVICES (645 filas no publicadas):
-- Actualizar '980 €' por '680 € + IVA' manteniendo is_published = false
UPDATE public.location_services
SET bluf_summary = REPLACE(bluf_summary, '980 €', '680 € + IVA'),
    updated_at = NOW()
WHERE is_published = false
  AND bluf_summary ILIKE '%980 €%';
