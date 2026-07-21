-- Migration: 20260712_create_services_table.sql
-- Objective: Create services table and seed it with current 8 services

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    theme TEXT NOT NULL,
    colors JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    hero JSONB NOT NULL DEFAULT '{}'::jsonb,
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    pain_points JSONB NOT NULL DEFAULT '{}'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on slug for fast queries
CREATE INDEX IF NOT EXISTS services_slug_idx ON public.services (slug);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. Policies for services (Public Read Access)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
CREATE POLICY "Enable read access for all users" ON public.services
    FOR SELECT USING (true);

-- 5. Seed initial data (the 8 services from silo-config.ts)
-- We insert using ON CONFLICT DO NOTHING to avoid duplicate key issues if run multiple times.
INSERT INTO public.services (slug, name, theme, colors, seo, hero, stats, pain_points, features)
VALUES
(
  'juicios-rapidos',
  'Juicios Rápidos',
  'urgency',
  '{"primary": "bg-trust-navy", "accent": "text-prestige-gold", "gradient": "from-trust-navy to-legal-ink"}'::jsonb,
  '{"title": "Abogado Juicios Rápidos | Defensa Penal 24h Especializada", "description": "Especialistas en juicios rápidos. Defensa técnica de élite para situaciones de máxima urgencia judicial. Asistencia inmediata 24h en comisarías y juzgados."}'::jsonb,
  '{"title": "Juicios Rápidos: Defensa Legal 24h Especializada", "subtitle": "Defensa técnica de élite para situaciones de máxima urgencia judicial. Asistencia en menos de 15 minutos.", "badge_text": "Atención Inmediata 24h", "specialty": "Juicios Rápidos", "cta": "Consulta Urgente"}'::jsonb,
  '[{"label": "Casos Gestionados", "value": "+2.500"}, {"label": "Sentencias Favorables", "value": "98%"}, {"label": "Tiempo de Respuesta", "value": "< 15 min"}]'::jsonb,
  '{"title": "¿Qué pasa si no actúas rápido?", "items": ["Retirada del permiso de conducir de forma inmediata", "Antecedentes penales graves que afecten a tu vida laboral", "Multas económicas muy elevadas y penas de prisión", "Pérdida de la oportunidad de reducción de un tercio de la pena"]}'::jsonb,
  '["Asistencia en Comisaría y Juzgado de Guardia", "Defensa Técnica de Élite en Tráfico y Seguridad Vial", "Reducción de Condena y Negociación de Conformidades"]'::jsonb
),
(
  'alcoholemia',
  'Alcoholemia',
  'urgency',
  '{"primary": "bg-orange-600", "accent": "text-orange-600", "gradient": "from-orange-50 to-orange-100"}'::jsonb,
  '{"title": "Abogados Alcoholemia | Juicio Rápido y Defensa Urgente", "description": "Especialistas en juicios rápidos por alcoholemia. Minimizamos retirada de carné and multas. Atención inmediata en comisaría y juzgado."}'::jsonb,
  '{"title": "Defensa Especializada en Alcoholemia y Seguridad Vial", "subtitle": "¿Positivo en control? No dejes que un error arruine tu vida laboral. Minimizamos la retirada de carné y la multa.", "badge_text": "Asistencia Inmediata", "specialty": "Alcoholemia", "cta": "Hablar con Abogado de Urgencia"}'::jsonb,
  '[{"label": "Casos Gestionados", "value": "+1.200"}, {"label": "Sentencias Favorables", "value": "94%"}, {"label": "Atención", "value": "Inmediata"}]'::jsonb,
  '{"title": "¿Qué pasa si no actúas rápido?", "items": ["Retirada del permiso de conducir hasta 4 años", "Antecedentes penales (problemas laborales)", "Multas económicas elevadas", "Posible pena de prisión en casos graves"]}'::jsonb,
  '["Asistencia en Comisaría", "Defensa en Juicio Rápido", "Recurso de Multas Tráfico"]'::jsonb
),
(
  'drogas',
  'Drogas',
  'urgency',
  '{"primary": "bg-red-600", "accent": "text-red-600", "gradient": "from-red-50 to-red-100"}'::jsonb,
  '{"title": "Abogados Delitos por Drogas | Defensa Penal 24h", "description": "Especialistas en defensa penal por conducir bajo la influencia de drogas. Evita penas de prisión y antecedentes penales. Asistencia en comisarías y juzgados."}'::jsonb,
  '{"title": "Defensa Especializada en Delitos por Drogas y Seguridad Vial", "subtitle": "¿Positivo en test de drogas? Protegemos tus derechos y defendemos tu libertad. Asistencia inmediata de guardia.", "badge_text": "Urgencia 24h", "specialty": "Drogas", "cta": "Abogado de Guardia por Drogas"}'::jsonb,
  '[{"label": "Casos Gestionados", "value": "+850"}, {"label": "Sentencias Favorables", "value": "92%"}, {"label": "Tiempo de Asistencia", "value": "< 30 min"}]'::jsonb,
  '{"title": "¿Qué consecuencias afrontas?", "items": ["Retirada del permiso de conducir hasta 4 años", "Penas de prisión de 3 a 6 meses", "Multas de hasta 1.000€ y pérdida de 6 puntos", "Antecedentes penales de larga duración"]}'::jsonb,
  '["Impugnación de Test de Saliva y Analítica de Sangre", "Defensa en Juicio Rápido por Delito 379.2 CP", "Asistencia Inmediata en Comisaría y Juzgado"]'::jsonb
),
(
  'sin-carnet',
  'Sin Carnet',
  'urgency',
  '{"primary": "bg-amber-600", "accent": "text-amber-600", "gradient": "from-amber-50 to-amber-100"}'::jsonb,
  '{"title": "Abogados Conducir Sin Carnet | Defensa de Urgencia 24h", "description": "Abogados especialistas en delitos por conducir sin carné, pérdida de puntos o privación judicial. Evita la cárcel. Defensa penal inmediata."}'::jsonb,
  '{"title": "Defensa Penal por Conducir Sin Carnet o Sin Puntos", "subtitle": "¿Te han interceptado sin licencia de conducir? Actuamos de urgencia para evitar antecedentes penales y penas de prisión.", "badge_text": "Guardia 24h", "specialty": "Sin Carnet", "cta": "Abogado Sin Carnet Urgente"}'::jsonb,
  '[{"label": "Casos Resueltos", "value": "100"}, {"label": "Atención Telefónica", "value": "24h/7d"}]'::jsonb,
  '{"title": "Gravedad de conducir sin permiso (Art. 384 CP)", "items": ["Penas de prisión de 3 a 6 meses", "Multas diarias severas durante meses", "Trabajos en beneficio de la comunidad", "Antecedentes penales que bloquean tu futuro"]}'::jsonb,
  '["Defensa en Juicios Rápidos en Toda Cataluña", "Recurso por Notificaciones de Pérdida de Puntos", "Negociación de Conformidades Mínimas"]'::jsonb
),
(
  'velocidad',
  'Velocidad',
  'urgency',
  '{"primary": "bg-rose-600", "accent": "text-rose-600", "gradient": "from-rose-50 to-rose-100"}'::jsonb,
  '{"title": "Abogados Exceso de Velocidad | Delito contra la Seguridad Vial", "description": "Especialistas en juicios rápidos por delitos de velocidad. Evita retirada de carné y antecedentes penales. Asistencia legal penal 24h."}'::jsonb,
  '{"title": "Abogados Especialistas en Delitos por Exceso de Velocidad", "subtitle": "¿Detectado por radar superando el límite penal? Defendemos tus derechos y evitamos la privación del permiso de conducir.", "badge_text": "Defensa de Radar", "specialty": "Velocidad", "cta": "Asistencia Penal por Radar"}'::jsonb,
  '[{"label": "Casos por Radar", "value": "+1.100"}, {"label": "Márgenes de Radar Anulados", "value": "95%"}, {"label": "Asistencia de Guardia", "value": "Inmediata"}]'::jsonb,
  '{"title": "Riesgos del delito de velocidad (Art. 379.1 CP)", "items": ["Retirada forzosa del carné de 1 a 4 años", "Pena de prisión de 3 a 6 meses", "Multa económica muy elevada", "Inscripción de antecedentes penales"]}'::jsonb,
  '["Impugnación de Homologación y Márgenes de Error de Radar", "Defensa y Representación en Juicios Rápidos", "Recurso de Multas en Vía Administrativa y Penal"]'::jsonb
),
(
  'profesionales',
  'Profesionales',
  'urgency',
  '{"primary": "bg-blue-600", "accent": "text-blue-600", "gradient": "from-blue-50 to-blue-100"}'::jsonb,
  '{"title": "Abogados Conductores Profesionales | Defensa de Guardia", "description": "Especialistas en defensa de transportistas, taxistas, comerciales y conductores profesionales. Protegemos tu medio de vida y tu carné."}'::jsonb,
  '{"title": "Defensa Legal Exclusiva para Conductores Profesionales", "subtitle": "Tu permiso de conducir es tu trabajo. Defendemos a transportistas y taxistas ante alcoholemias, drogas y pérdida de puntos.", "badge_text": "Protección Laboral", "specialty": "Profesionales", "cta": "Defender Mi Medio de Vida"}'::jsonb,
  '[{"label": "Profesionales Defendidos", "value": "+780"}, {"label": "Licencias Salvadas", "value": "96%"}, {"label": "Atención Urgente", "value": "24h"}]'::jsonb,
  '{"title": "¿Qué está en juego para ti?", "items": ["Pérdida inmediata de tu puesto de trabajo y licencia", "Límites de alcohol más estrictos (0.15 mg/l)", "Responsabilidad civil y multas de la empresa", "Inhabilitación profesional para conducir"]}'::jsonb,
  '["Defensa en Juicios Rápidos de Guardia", "Gestión de Pérdida de Puntos y Suspensión", "Sustitución de Penas para Mantener la Actividad"]'::jsonb
),
(
  'herencias',
  'Herencias',
  'trust',
  '{"primary": "bg-slate-800", "accent": "text-slate-800", "gradient": "from-slate-50 to-slate-200"}'::jsonb,
  '{"title": "Abogados Herencias y Sucesiones | Planificación Patrimonial", "description": "Expertos en desbloqueo de herencias, testamentos y fiscalidad sucesoria. Protege tu patrimonio familiar con autoridad legal."}'::jsonb,
  '{"title": "Desbloqueo de Herencias y Planificación Sucesoria", "subtitle": "Evita conflictos familiares y optimiza la carga fiscal de tu legado con expertos en derecho sucesorio.", "badge_text": "Expertos en Herencias", "specialty": "Herencias", "cta": "Consulta de Planificación"}'::jsonb,
  '[{"label": "Patrimonio Gestionado", "value": "+50M€"}, {"label": "Herencias Desbloqueadas", "value": "100%"}, {"label": "Experiencia", "value": "20 Años"}]'::jsonb,
  '{"title": "Riesgos de una mala gestión sucesoria", "items": ["Bloqueo de cuentas bancarias y bienes inmuebles", "Pago excesivo de Impuesto de Sucesiones", "Conflictos y roturas familiares irreversibles", "Pérdida de bonificaciones fiscales por plazos"]}'::jsonb,
  '["Testamentos y Últimas Voluntades", "Liquidación de Impuesto Sucesiones", "Mediación Familiar"]'::jsonb
),
(
  'accidentes',
  'Accidentes',
  'compensation',
  '{"primary": "bg-blue-600", "accent": "text-blue-600", "gradient": "from-blue-50 to-blue-100"}'::jsonb,
  '{"title": "Abogados Accidentes Tráfico | Indemnización Máxima", "description": "Reclamamos tu indemnización por accidente de tráfico. No aceptes la primera oferta del seguro. Consulta gratuita."}'::jsonb,
  '{"title": "Indemnización Máxima por Accidente", "subtitle": "No aceptes la primera oferta del seguro. Reclamamos lo que realmente te corresponde con peritos médicos independientes.", "badge_text": "Indemnización Máxima", "specialty": "Accidentes de Tráfico", "cta": "Valorar mi Indemnización Gratis"}'::jsonb,
  '[{"label": "Indemnizaciones", "value": "+3M€"}, {"label": "Éxito en Reclamación", "value": "98%"}, {"label": "Coste Inicial", "value": "0€"}]'::jsonb,
  '{"title": "¿Por qué no confiar solo en tu seguro?", "items": ["Ofertas hasta un 60% inferiores a lo legal", "Alta médica prematura sin curación total", "Secuelas no valoradas correctamente", "Conflicto de intereses entre aseguradoras"]}'::jsonb,
  '["Cálculo de Indemnización Real", "Negociación con Aseguradoras", "Sin Coste si No Ganamos"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
