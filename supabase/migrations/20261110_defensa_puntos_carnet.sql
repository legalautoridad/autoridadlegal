-- Migration / Seed: Servicio nacional de recurso de multas y defensa de puntos
-- Archivo versionado en el repositorio (no aplicar a mano en producción sin aprobación)
BEGIN;

-- 1. Corrección menor en alcoholemia (Módulo 9): "and" -> "y" (137 caracteres)
UPDATE public.services
SET seo = jsonb_set(
  seo,
  '{description}',
  '"Especialistas en juicios rápidos por alcoholemia. Minimizamos retirada de carné y multas. Atención inmediata en comisaría y juzgado."'
)
WHERE slug = 'alcoholemia';

-- 2. Insertar o actualizar servicio 'defensa-puntos-carnet' en public.services
INSERT INTO public.services (
  slug,
  name,
  theme,
  colors,
  seo,
  hero,
  stats,
  pain_points,
  features,
  last_reviewed
)
VALUES (
  'defensa-puntos-carnet',
  'Recurso de Multas y Puntos del Carnet',
  'trust',
  '{"primary": "bg-trust-navy", "accent": "text-prestige-gold", "gradient": "from-trust-navy to-legal-ink"}'::jsonb,
  '{
    "title": "Recurso de multas y puntos del carnet | Autoridad Legal",
    "description": "Recurso de multas de tráfico y defensa de los puntos del carnet ante la DGT, el Servei Català de Trànsit y ayuntamientos. En toda España, sin desplazarte."
  }'::jsonb,
  '{
    "title": "Defensa Técnica de Multas de Tráfico y Protección del Carnet por Puntos",
    "subtitle": "Dirección letrada telemática ante la DGT, Servei Català de Trànsit, Trafikoa y Ayuntamientos. Suspensión de la firmeza administrativa y protección de la vigencia del permiso.",
    "badge_text": "Cobertura Nacional Telemática",
    "specialty": "Recurso de Multas y Puntos",
    "cta": "Consultar Sanción de Puntos"
  }'::jsonb,
  '[
    {"label": "Provisión Base", "value": "350 €"},
    {"label": "Bono de Éxito", "value": "150 €"},
    {"label": "Ámbito", "value": "Toda España"}
  ]'::jsonb,
  '{
    "title": "¿Por qué no debes pagar con el 50% de descuento si tienes pocos puntos?",
    "items": [
      "El pronto pago extingue el procedimiento y hace firme la sanción de forma inmediata",
      "La detracción de puntos se anota al momento en el Registro Central de Conductores",
      "Si tu saldo llega a cero, la DGT inicia el expediente de pérdida de vigencia por 6 meses",
      "Pagar con descuento implica la renuncia legal e irrevocable a presentar alegaciones"
    ]
  }'::jsonb,
  '[
    "Representación letrada telemática en toda España sin desplazamientos",
    "Suspensión cautelar de la detracción registral mientras se tramita el expediente",
    "Consolidación del plazo de 2 años para recuperar 12 puntos (art. 65.1 LTSV)",
    "Defensa del permiso B ante expedientes de incapacidad médica del INSS"
  ]'::jsonb,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  theme = EXCLUDED.theme,
  colors = EXCLUDED.colors,
  seo = EXCLUDED.seo,
  hero = EXCLUDED.hero,
  stats = EXCLUDED.stats,
  pain_points = EXCLUDED.pain_points,
  features = EXCLUDED.features,
  updated_at = timezone('utc'::text, now());

-- 3. Limpiar e insertar las 40 FAQs en public.service_faqs
DELETE FROM public.service_faqs WHERE service_slug = 'defensa-puntos-carnet';

INSERT INTO public.service_faqs (service_slug, position, topic, question, answer)
VALUES
-- Cluster 1: El Dilema del Pronto Pago y la Retirada de Puntos
('defensa-puntos-carnet', 1, 'El Dilema del Pronto Pago y la Retirada de Puntos',
 '¿Qué ocurre con mis puntos si pago la multa con el 50% de descuento?',
 'Abonar la multa con el 50% de descuento provoca la pérdida inmediata de los puntos en el Registro de Conductores e Infractores. Conforme al artículo 94 de la Ley de Tráfico, el pronto pago implica la terminación del procedimiento, la renuncia a alegar y la firmeza del acto administrativo sancionador, ejecutando la detracción registral de forma automática.'),

('defensa-puntos-carnet', 2, 'El Dilema del Pronto Pago y la Retirada de Puntos',
 '¿Por qué un conductor con pocos puntos no debe acogerse al pronto pago?',
 'Un conductor con pocos puntos no debe acogerse al pronto pago porque extingue instantáneamente su autorización administrativa para conducir. Si los puntos detraídos superan el saldo disponible, el abono con reducción determina la firmeza sancionadora y precipita el expediente de pérdida de vigencia del artículo 64 de la Ley de Tráfico, inhabilitando al interesado durante seis meses ininterrumpidos (tres meses para conductores profesionales).'),

('defensa-puntos-carnet', 3, 'El Dilema del Pronto Pago y la Retirada de Puntos',
 '¿Pagar la multa con reducción suspende el procedimiento o permite recurrir después?',
 'No, pagar la multa con reducción no suspende el procedimiento sancionador ni permite interponer recursos administrativos ordinarios con posterioridad. El artículo 94 de la Ley de Tráfico dispone que el pago bonificado agota y clausura el expediente sancionador en el acto, cerrando la vía de alegaciones y dejando únicamente expedita la compleja vía del recurso contencioso-administrativo judicial.'),

('defensa-puntos-carnet', 4, 'El Dilema del Pronto Pago y la Retirada de Puntos',
 '¿Cuándo se descuentan efectivamente los puntos tras una denuncia de tráfico?',
 'Los puntos se descuentan únicamente cuando la sanción adquiere firmeza en vía administrativa, jamás en el momento en que los agentes entregan la denuncia. Mientras Autoridad Legal mantenga el expediente abierto mediante alegaciones, pruebas o recursos, el acto sancionador carece de ejecutividad, por lo que el Registro de Conductores e Infractores no puede restar ningún punto.'),

-- Cluster 2: Consolidación de los 24 Meses (Regeneración de Puntos)
('defensa-puntos-carnet', 5, 'Consolidación de los 24 Meses (Regeneración de Puntos)',
 '¿Cómo funciona la recuperación automática de 12 puntos a los dos años según el artículo 65.1 de la Ley de Tráfico?',
 'La recuperación automática de 12 puntos opera por ministerio de la ley cuando transcurren dos años continuados sin sanciones firmes que resten puntos. El artículo 65.1 de la Ley de Tráfico unificó este plazo de 24 meses para todas las infracciones graves o muy graves, ordenando a la DGT restablecer de oficio el crédito inicial completo de doce puntos.'),

('defensa-puntos-carnet', 6, 'Consolidación de los 24 Meses (Regeneración de Puntos)',
 '¿La fecha de una nueva multa interrumpe el cómputo de los 24 meses de recuperación?',
 'No, la fecha de comisión de una nueva infracción no interrumpe el cómputo de los 24 meses del artículo 65.1 de la Ley de Tráfico. El contador temporal legal únicamente se detiene o reinicia cuando recae una sanción firme en vía administrativa; las denuncias notificadas no adquieren firmeza mientras el expediente administrativo sancionador se encuentre en trámite de impugnación.'),

('defensa-puntos-carnet', 7, 'Consolidación de los 24 Meses (Regeneración de Puntos)',
 '¿Cómo logra la defensa administrativa que un conductor alcance los 24 meses sin perder el carnet?',
 'Autoridad Legal logra alcanzar los 24 meses articulando trámites contradictorios reglados. Mediante alegaciones, solicitud de informes policiales, propuesta de prueba metrológica y recursos ordinarios, Autoridad Legal extiende legalmente la tramitación de 4 a 8 meses, permitiendo que el saldo del conductor se restablezca automáticamente a 12 puntos antes de la firmeza.'),

('defensa-puntos-carnet', 8, 'Consolidación de los 24 Meses (Regeneración de Puntos)',
 '¿Qué sucede si la nueva sanción adquiere firmeza después de haber recuperado los 12 puntos?',
 'Si la nueva sanción adquiere firmeza tras recuperar los 12 puntos, la detracción se liquida sobre el saldo renovado y el carnet permanece vigente. Al descontarse los puntos sancionados de los doce puntos restablecidos por el artículo 65.1 de la Ley de Tráfico, el titular conserva saldo suficiente y elude completamente la declaración de pérdida de vigencia.'),

-- Cluster 3: Vigencia del Carnet Durante el Recurso (Movilidad y Trabajo)
('defensa-puntos-carnet', 9, 'Vigencia del Carnet Durante el Recurso (Movilidad y Trabajo)',
 '¿Puedo seguir conduciendo legalmente mientras Autoridad Legal recurre mi multa?',
 'Sí, puede seguir conduciendo con total validez jurídica mientras Autoridad Legal recurra la sanción en vía administrativa. La interposición de alegaciones y recursos en plazo legal paraliza la ejecutividad del acto y la firmeza sancionadora, de forma que el permiso mantiene su plena vigencia formal en el Registro de Conductores e Infractores hasta dictarse resolución expresa definitiva.'),

('defensa-puntos-carnet', 10, 'Vigencia del Carnet Durante el Recurso (Movilidad y Trabajo)',
 '¿La policía me puede retirar el permiso de conducir mientras el expediente está en trámite?',
 'No, ningún cuerpo policial puede incautar su carnet de conducir mientras el expediente sancionador continúe en trámite contradictorio. La privación cautelar de la autorización solo procede por mandamiento judicial penal o tras notificarse formalmente la resolución firme de pérdida de vigencia del artículo 64 de la Ley de Tráfico dictada por la Jefatura Provincial de Tráfico competente.'),

('defensa-puntos-carnet', 11, 'Vigencia del Carnet Durante el Recurso (Movilidad y Trabajo)',
 '¿Qué diferencia legal existe entre la notificación de la denuncia y la declaración de pérdida de vigencia?',
 'La notificación de la denuncia inicia un procedimiento sancionador ordinario, mientras que la pérdida de vigencia constituye un procedimiento autónomo posterior reglado por el artículo 37 del Reglamento General de Conductores. La DGT solo puede declarar la pérdida de vigencia cuando constata que las sanciones que agotaron los puntos han adquirido firmeza inatacable en vía administrativa.'),

('defensa-puntos-carnet', 12, 'Vigencia del Carnet Durante el Recurso (Movilidad y Trabajo)',
 '¿Qué ocurre si cometo otra infracción mientras el recurso de la primera multa está en trámite?',
 'Si comete otra infracción en trámite, cada expediente se tramita de forma independiente sin acumulación automática de detracciones registrales. Los puntos de la nueva denuncia tampoco podrán restarse hasta que dicha segunda sanción adquiera firmeza propia; Autoridad Legal puede articular la defensa técnica simultánea de ambos expedientes para evitar la coincidencia de resoluciones sancionadoras firmes.'),

-- Cluster 4: Honorarios Profesionales, Justificación del Servicio y Bono de Éxito
('defensa-puntos-carnet', 13, 'Honorarios Profesionales, Justificación del Servicio y Bono de Éxito',
 '¿Cuánto cuesta la defensa de una multa para evitar la pérdida del carnet?',
 'La defensa técnica letrada en Autoridad Legal tiene un coste cerrado de 350,00 € en concepto de honorarios profesionales base por el expediente sancionador administrativo completo. Adicionalmente, se pacta un bono de éxito condicionado de 150,00 €, devengable exclusivamente si el conductor conserva la vigencia legal de su carnet de conducir por anulación, caducidad o regeneración de puntos.'),

('defensa-puntos-carnet', 14, 'Honorarios Profesionales, Justificación del Servicio y Bono de Éxito',
 '¿Qué se considera exactamente «éxito» para el devengo del bono de 150 € en Autoridad Legal?',
 'Éxito es la consecución del objetivo sustancial: conservar la vigencia de la autorización para conducir vehículos a motor. El bono de éxito se devenga no solo si se anula la sanción, sino también si la tramitación permite alcanzar los 24 meses restaurando 12 puntos antes de la firmeza (artículo 65.1 LTSV), o si se recalifica la infracción a tipicidad sin pérdida de puntos.'),

('defensa-puntos-carnet', 15, 'Honorarios Profesionales, Justificación del Servicio y Bono de Éxito',
 '¿Por qué 350 € es un precio altamente competitivo frente a plataformas automáticas de recursos?',
 'Los 350 € retribuyen la dirección letrada personalizada de un procedimiento complejo que nunca se resuelve con un formulario genérico. A diferencia de plataformas masivas de plantillas automáticas, Autoridad Legal audita cinemómetros, solicita pruebas, impugna informes policiales ampliatorios, formula alegaciones en audiencia, interpone recursos ordinarios y monitoriza permanentemente el Registro Central de la DGT hasta la resolución.'),

('defensa-puntos-carnet', 16, 'Honorarios Profesionales, Justificación del Servicio y Bono de Éxito',
 '¿Cómo se aplican los impuestos y la facturación en los honorarios de Autoridad Legal?',
 'Los importes de 350,00 € y 150,00 € corresponden estrictamente a honorarios letrados técnicos de dirección y representación. Los tributos aplicables conforme a la legislación vigente (IVA general del 21% o retenciones de IRPF) se liquidan y detallan formalmente en la hoja de encargo profesional firmada antes de iniciar las actuaciones.'),

-- Cluster 5: Plazos Procesales, Caducidad y Prueba Metrológica
('defensa-puntos-carnet', 17, 'Plazos Procesales, Caducidad y Prueba Metrológica',
 '¿De qué plazo dispongo para recurrir una multa de tráfico antes de que sea firme?',
 'El plazo legal es de 20 días naturales computados desde el día siguiente al que se recibe la notificación de la denuncia. Dentro de este plazo legal improrrogable del artículo 93 de la Ley de Tráfico, Autoridad Legal debe presentar el pliego de alegaciones y proposición de pruebas para suspender la firmeza y retener los puntos.'),

('defensa-puntos-carnet', 18, 'Plazos Procesales, Caducidad y Prueba Metrológica',
 '¿Cuándo caduca un procedimiento sancionador de tráfico según el artículo 112 de la Ley de Seguridad Vial?',
 'El procedimiento sancionador de tráfico caduca cuando transcurre un año desde su iniciación sin que la Administración notifique la resolución sancionadora definitiva. El artículo 112.3 de la Ley de Seguridad Vial determina que, consumado dicho plazo anual sin resolución expresa, procede acordar el archivo de las actuaciones, cancelando definitivamente la sanción económica y la pérdida de puntos.'),

('defensa-puntos-carnet', 19, 'Plazos Procesales, Caducidad y Prueba Metrológica',
 '¿Qué defectos de calibración en cinemómetros o etilómetros anulan una sanción de puntos?',
 'La ausencia o caducidad del certificado de verificación metrológica del aparato conforme a la Orden ICT/155/2020 anula la sanción de puntos. Asimismo, omitir la aplicación de los márgenes de error metrológicos reglamentarios sobre la velocidad o alcoholemia registrada vulnera la presunción de inocencia, obligando a anular la detracción de puntos o recalificar la infracción.'),

('defensa-puntos-carnet', 20, 'Plazos Procesales, Caducidad y Prueba Metrológica',
 '¿Qué sucede si la Administración no contesta a las alegaciones y propuestas de prueba?',
 'Si la Administración no resuelve las alegaciones ni practica la prueba propuesta, se genera una manifiesta indefensión material contraria a la ley. Dictar una resolución sancionadora obviando la prueba metrológica solicitada por Autoridad Legal vicia el acto conforme a la Ley 39/2015, permitiendo revocar la multa y blindar los puntos en reposición.'),

-- Cluster 6: Cobertura Ante Organismos y Competencias Territoriales
('defensa-puntos-carnet', 21, 'Cobertura Ante Organismos y Competencias Territoriales',
 '¿Autoridad Legal recurre multas ante el Servei Català de Trànsit y Trafikoa en el País Vasco?',
 'Sí, Autoridad Legal ejerce la representación letrada telemática directa ante el Servei Català de Trànsit y Trafikoa en el País Vasco. La intervención profesional abarca tanto a los organismos autonómicos con competencias de tráfico transferidas en Cataluña, Euskadi y Navarra, como a las cincuenta Jefaturas Provinciales de la Dirección General de Tráfico en toda España.'),

('defensa-puntos-carnet', 22, 'Cobertura Ante Organismos y Competencias Territoriales',
 '¿Cómo se coordinan los organismos autonómicos de Cataluña, Euskadi y Navarra con el Registro Central de la DGT?',
 'Los organismos autonómicos gestionan de forma autónoma sus expedientes sancionadores pero dependen del Registro de Conductores e Infractores de la DGT. Conforme al artículo 8 de la Ley de Seguridad Vial, las resoluciones firmes del Servei Català de Trànsit o Trafikoa se comunican telemáticamente a la DGT central, único organismo titular de la detracción de puntos.'),

('defensa-puntos-carnet', 23, 'Cobertura Ante Organismos y Competencias Territoriales',
 '¿Es posible recurrir multas impuestas por Ayuntamientos y Policías Locales de toda España?',
 'Sí, es perfectamente posible recurrir multas incoadas por Ayuntamientos y Policías Locales de cualquier municipio del territorio español. Autoridad Legal formula descargos e interpone recursos administrativos ante consistorios municipales y organismos provinciales delegados de recaudación, tales como SUMA o BASE, frenando la ejecutividad del cobro y la detracción de los puntos del carnet.'),

('defensa-puntos-carnet', 24, 'Cobertura Ante Organismos y Competencias Territoriales',
 '¿Qué ocurre si un Ayuntamiento impone una multa muy grave pero no tramita la pérdida de puntos?',
 'El Ayuntamiento tramita la sanción económica pero carece de potestad para detraer puntos por sí mismo en el censo. Una vez que la sanción municipal deviene firme en vía administrativa, el consistorio traslada el expediente a la DGT para que el Registro Central aplique formalmente la resta de puntos sobre la licencia.'),

-- Cluster 7: Régimen Postal de Notificaciones y Vicios de Nulidad de Correos
('defensa-puntos-carnet', 25, 'Régimen Postal de Notificaciones y Vicios de Nulidad de Correos',
 '¿Qué defectos formales comete Correos que permiten anular una multa de tráfico?',
 'Omitir la hora en el primer intento de entrega o superar el plazo legal de tres días entre avisos invalida la notificación. El artículo 42.2 de la Ley 39/2015 exige registrar la hora con tres horas de diferencia entre intentos; su inobservancia vulnera el procedimiento y vicia las actuaciones sancionadoras.'),

('defensa-puntos-carnet', 26, 'Régimen Postal de Notificaciones y Vicios de Nulidad de Correos',
 '¿Por qué saltar directamente al TESTRA o TEU puede declarar nula una retirada de puntos?',
 'Publicar una sanción en TESTRA o TEU sin agotar los intentos en el domicilio real registrado vulnera el artículo 24 constitucional. Conforme a reiterada doctrina del Tribunal Constitucional, si la Administración o Correos no investigan domicilios alternativos disponibles en bases oficiales antes de recurrir a edictos, la notificación deviene nula de pleno derecho.'),

('defensa-puntos-carnet', 27, 'Régimen Postal de Notificaciones y Vicios de Nulidad de Correos',
 '¿Cómo se utiliza el plazo de recogida postal de 15 días en Correos?',
 'El conductor ausente dispone de 15 días naturales para retirar la carta certificada depositada en la oficina de Correos. Retirar la notificación postal hacia el final del plazo permite gestionar el expediente con margen suficiente, postergando el inicio del cómputo de 20 días para presentar las alegaciones de Autoridad Legal.'),

('defensa-puntos-carnet', 28, 'Régimen Postal de Notificaciones y Vicios de Nulidad de Correos',
 '¿Qué diferencia horaria de 3 horas exige el artículo 42.2 de la Ley 39/2015 en Correos?',
 'La ley exige que el segundo intento de entrega se practique en una franja horaria distinta mediando un mínimo de tres horas. Si el primer intento se realizó antes de las 15:00 horas, el segundo debe practicarse obligatoriamente después de esa hora, constituyendo vicio determinante de invalidez el incumplimiento de este intervalo legal.'),

-- Cluster 8: Apoderamiento Telemático y Representación en Notificaciones
('defensa-puntos-carnet', 29, 'Apoderamiento Telemático y Representación en Notificaciones',
 '¿Cómo otorga un cliente la representación telemática a Autoridad Legal mediante Apodera o Representa?',
 'El cliente confiere la representación telemática en dos minutos desde su móvil u ordenador utilizando certificado digital, Cl@ve o idCAT Mòbil. Mediante el Registro Electrónico de Apoderamientos (@podera) del Estado o Representa de Cataluña, se inscribe el poder oficial permitiendo a Autoridad Legal personarse y actuar en sedes electrónicas con plena validez.'),

('defensa-puntos-carnet', 30, 'Apoderamiento Telemático y Representación en Notificaciones',
 '¿Por qué la relación postal o electrónica con Tráfico influye en los plazos?',
 'Las personas físicas tienen derecho a no relacionarse electrónicamente con la Administración (artículo 14.1 Ley 39/2015). El canal postal de notificaciones mediante Correos suele generar plazos más amplios entre actuaciones, facilitando el seguimiento riguroso del calendario procesal necesario para la consolidación de puntos.'),

('defensa-puntos-carnet', 31, 'Apoderamiento Telemático y Representación en Notificaciones',
 '¿Cómo se formaliza el alcance del apoderamiento letrado?',
 'El apoderamiento se formaliza con alcance específico para los trámites necesarios ante la Administración sancionadora, garantizando que el interesado mantenga el control sobre sus canales de comunicación habituales y la recepción ordenada de resoluciones.'),

('defensa-puntos-carnet', 32, 'Apoderamiento Telemático y Representación en Notificaciones',
 '¿Cómo coordina Autoridad Legal el seguimiento de las notificaciones postales con el cliente?',
 'Autoridad Legal acuerda con el cliente que este custodie su buzón domiciliario y remita de inmediato fotografía del aviso postal recibido. El cliente retira la carta certificada en Correos dentro del plazo y traslada la resolución al letrado para formalizar el siguiente trámite contradictorio o el correspondiente recurso en plazo.'),

-- Cluster 9: Supuestos Especiales: Pérdida de Carnet por Incapacidad TGSS/INSS
('defensa-puntos-carnet', 33, 'Supuestos Especiales: Pérdida de Carnet por Incapacidad TGSS/INSS',
 '¿Por qué la DGT inicia la retirada del carnet si la Seguridad Social me concede una incapacidad?',
 'La DGT incoa de oficio la pérdida de vigencia al recibir la comunicación telemática de incapacidad laboral remitida por el INSS. Tráfico presume automáticamente la desaparición de aptitudes psicofísicas (artículo 36 Reglamento General de Conductores), abriendo un expediente para retirar todas las autorizaciones sin distinguir entre vehículos particulares y vehículos profesionales de gran tonelaje.'),

('defensa-puntos-carnet', 34, 'Supuestos Especiales: Pérdida de Carnet por Incapacidad TGSS/INSS',
 '¿En qué se diferencian los baremos médicos del Grupo 1 y Grupo 2 del Anexo IV del Reglamento?',
 'El Grupo 2 (camiones y autobuses) exige condiciones físicas muy estrictas e incompatibles con secuelas cardíacas o motoras permanentes. Por el contrario, el Grupo 1 (turismos y carnet B) admite patologías estabilizadas siempre que la función ventricular esté conservada y no existan síncopes, permitiendo preservar la licencia de conductor particular.'),

('defensa-puntos-carnet', 35, 'Supuestos Especiales: Pérdida de Carnet por Incapacidad TGSS/INSS',
 '¿Cómo defiende Autoridad Legal el carnet B ante una pérdida de vigencia por incapacidad médica?',
 'Autoridad Legal formaliza allanamiento a la revocación del Grupo 2 y formula oposición técnica acreditada para mantener el carnet B. Se incorporan informes clínicos del especialista que certifiquen estabilidad cardiológica o funcional, solicitando el mantenimiento del permiso de turismo condicionado a revisiones periódicas o adaptaciones.'),

('defensa-puntos-carnet', 36, 'Supuestos Especiales: Pérdida de Carnet por Incapacidad TGSS/INSS',
 '¿Puedo seguir conduciendo mi coche mientras se tramitan las alegaciones médicas ante la DGT?',
 'Sí, puede seguir conduciendo su coche legalmente durante toda la instrucción contradictoria del expediente de pérdida de vigencia. El acuerdo de inicio no retira la autorización cautelarmente; hasta que la Jefatura Provincial de Tráfico no dicte y notifique la resolución definitiva que ponga fin a la vía administrativa, el permiso conserva plena eficacia jurídica.'),

-- Cluster 10: Operativa del Despacho y la Frontera Penal del Art. 384 CP
('defensa-puntos-carnet', 37, 'Operativa del Despacho y la Frontera Penal del Art. 384 CP',
 '¿Cómo es el proceso de contacto, estudio y contratación ágil con Autoridad Legal?',
 'El proceso se inicia por WhatsApp enviando copia de las multas y el extracto de puntos de la DGT para estudio letrado. Una vez analizada la viabilidad, se acuerdan los honorarios, el letrado tramita el apoderamiento telemático oficial que el cliente valida en un clic y se formaliza la defensa sin desplazamientos.'),

('defensa-puntos-carnet', 38, 'Operativa del Despacho y la Frontera Penal del Art. 384 CP',
 '¿Existe silencio administrativo positivo que me permita conducir si recurro la pérdida de vigencia?',
 'No, no existe silencio administrativo positivo que habilite a conducir si la pérdida de vigencia ha sido formalmente resuelta. Solicitar una suspensión administrativa no faculta a ponerse al volante; conducir con saldo cero constatado en el Registro de Conductores e Infractores tras notificarse la resolución firme desencadena responsabilidades penales de carácter inmediato.'),

('defensa-puntos-carnet', 39, 'Operativa del Despacho y la Frontera Penal del Art. 384 CP',
 '¿Qué exige el Tribunal Supremo para que conducir sin puntos sea delito según el artículo 384 del Código Penal?',
 'El Tribunal Supremo exige la constancia formal de notificación personal y fehaciente de la resolución de pérdida de vigencia. Conforme a las SSTS 319/2018 y 360/2025, el dolo típico del artículo 384 del Código Penal requiere acreditar que el conductor conocía de forma cierta la extinción de su carnet dictada por Tráfico.'),

('defensa-puntos-carnet', 40, 'Operativa del Despacho y la Frontera Penal del Art. 384 CP',
 '¿Qué documento acredita mi derecho a conducir si me para la policía durante la defensa del expediente?',
 'El justificante oficial de presentación telemática del recurso o pliego de alegaciones con sello de registro administrativo del Estado acredita la situación. Al comprobar los agentes la base de la DGT, constatarán que la sanción carece de firmeza y que el permiso permanece plenamente vigente en el Registro Central de Conductores.');

COMMIT;

