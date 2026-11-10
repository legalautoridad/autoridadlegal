export interface PuntosFaq {
    cluster: string;
    question: string;
    answer: string;
}

export const PUNTOS_CLUSTERS: { name: string; description: string; faqs: { question: string; answer: string }[] }[] = [
    {
        name: 'El dilema del pronto pago y la retirada de puntos',
        description: 'Consecuencias procesales del abono con el 50% de descuento conforme al artículo 94 de la Ley de Seguridad Vial.',
        faqs: [
            {
                question: '¿Qué ocurre con mis puntos si pago la multa con el 50% de descuento?',
                answer: 'Abonar la multa con el 50% de descuento provoca la pérdida inmediata de los puntos en el Registro de Conductores e Infractores. Conforme al artículo 94 de la Ley de Tráfico, el pronto pago implica la terminación del procedimiento, la renuncia a alegar y la firmeza del acto administrativo sancionador, ejecutando la detracción registral de forma automática.',
            },
            {
                question: '¿Por qué un conductor con pocos puntos no debe acogerse al pronto pago?',
                answer: 'Un conductor con pocos puntos no debe acogerse al pronto pago porque extingue instantáneamente su autorización administrativa para conducir. Si los puntos detraídos superan el saldo disponible, el abono con reducción determina la firmeza sancionadora y precipita el expediente de pérdida de vigencia del artículo 64 de la Ley de Tráfico, inhabilitando al interesado durante seis meses ininterrumpidos (tres meses en conductores profesionales).',
            },
            {
                question: '¿Pagar la multa con reducción suspende el procedimiento o permite recurrir después?',
                answer: 'No, pagar la multa con reducción no suspende el procedimiento sancionador ni permite interponer recursos administrativos ordinarios con posterioridad. El artículo 94 de la Ley de Tráfico dispone que el pago bonificado agota y clausura el expediente sancionador en el acto, cerrando la vía de alegaciones y dejando únicamente expedita la compleja vía del recurso contencioso-administrativo judicial.',
            },
            {
                question: '¿Cuándo se descuentan efectivamente los puntos tras una denuncia de tráfico?',
                answer: 'Los puntos se descuentan únicamente cuando la sanción adquiere firmeza en vía administrativa, jamás en el momento en que los agentes entregan la denuncia. Mientras Autoridad Legal mantenga el expediente abierto mediante alegaciones, pruebas o recursos, el acto sancionador carece de ejecutividad, por lo que el Registro de Conductores e Infractores no puede restar ningún punto.',
            },
        ],
    },
    {
        name: 'Consolidación de los 24 meses y restablecimiento a 12 puntos',
        description: 'Régimen legal del artículo 65.1 de la Ley de Seguridad Vial para recuperar el saldo íntegro por el transcurso de dos años continuados.',
        faqs: [
            {
                question: '¿Cómo funciona la recuperación automática de 12 puntos a los dos años según el artículo 65.1 de la Ley de Tráfico?',
                answer: 'La recuperación automática de 12 puntos opera por ministerio de la ley cuando transcurren dos años continuados sin sanciones firmes que resten puntos. El artículo 65.1 de la Ley de Tráfico unificó este plazo de 24 meses para todas las infracciones graves o muy graves, ordenando a la DGT restablecer de oficio el crédito inicial completo de doce puntos.',
            },
            {
                question: '¿La fecha de una nueva multa interrumpe el cómputo de los 24 meses de recuperación?',
                answer: 'No, la fecha de comisión de una nueva infracción no interrumpe el cómputo de los 24 meses del artículo 65.1 de la Ley de Tráfico. El contador temporal legal únicamente se detiene o reinicia cuando recae una sanción firme en vía administrativa; las denuncias notificadas no adquieren firmeza mientras el expediente administrativo sancionador se encuentre en trámite de impugnación.',
            },
            {
                question: '¿Cómo logra la defensa administrativa que un conductor alcance los 24 meses sin perder el carnet?',
                answer: 'Autoridad Legal logra alcanzar los 24 meses articulando trámites contradictorios reglados. Mediante alegaciones, solicitud de informes policiales, propuesta de prueba metrológica y recursos ordinarios, Autoridad Legal extiende legalmente la tramitación de 4 a 8 meses, permitiendo que el saldo del conductor se restablezca automáticamente a 12 puntos antes de la firmeza.',
            },
            {
                question: '¿Qué sucede si la nueva sanción adquiere firmeza después de haber recuperado los 12 puntos?',
                answer: 'Si la nueva sanción adquiere firmeza tras recuperar los 12 puntos, la detracción se liquida sobre el saldo renovado y el carnet permanece vigente. Al descontarse los puntos sancionados de los doce puntos restablecidos por el artículo 65.1 de la Ley de Tráfico, el titular conserva saldo suficiente y elude completamente la declaración de pérdida de vigencia.',
            },
        ],
    },
    {
        name: 'Vigencia del carnet durante el recurso (movilidad y trabajo)',
        description: 'Validez formal de la autorización para conducir mientras se sustancian alegaciones y recursos ordinarios.',
        faqs: [
            {
                question: '¿Puedo seguir conduciendo legalmente mientras Autoridad Legal recurre mi multa?',
                answer: 'Sí, puede seguir conduciendo con total validez jurídica mientras Autoridad Legal recurra la sanción en vía administrativa. La interposición de alegaciones y recursos en plazo legal paraliza la ejecutividad del acto y la firmeza sancionadora, de forma que el permiso mantiene su plena vigencia formal en el Registro de Conductores e Infractores hasta dictarse resolución expresa definitiva.',
            },
            {
                question: '¿La policía me puede retirar el permiso de conducir mientras el expediente está en trámite?',
                answer: 'No, ningún cuerpo policial puede incautar su carnet de conducir mientras el expediente sancionador continúe en trámite contradictorio. La privación cautelar de la autorización solo procede por mandamiento judicial penal o tras notificarse formalmente la resolución firme de pérdida de vigencia del artículo 64 de la Ley de Tráfico dictada por la Jefatura Provincial de Tráfico competente.',
            },
            {
                question: '¿Qué diferencia legal existe entre la notificación de la denuncia y la declaración de pérdida de vigencia?',
                answer: 'La notificación de la denuncia inicia un procedimiento sancionador ordinario, mientras que la pérdida de vigencia constituye un procedimiento autónomo posterior reglado por el artículo 37 del Reglamento General de Conductores. La DGT solo puede declarar la pérdida de vigencia cuando constata que las sanciones que agotaron los puntos han adquirido firmeza inatacable en vía administrativa.',
            },
            {
                question: '¿Qué ocurre si cometo otra infracción mientras el recurso de la primera multa está en trámite?',
                answer: 'Si comete otra infracción en trámite, cada expediente se tramita de forma independiente sin acumulación automática de detracciones registrales. Los puntos de la nueva denuncia tampoco podrán restarse hasta que dicha segunda sanción adquiera firmeza propia; Autoridad Legal puede articular la defensa técnica simultánea de ambos expedientes para evitar la coincidencia de resoluciones sancionadoras firmes.',
            },
        ],
    },
    {
        name: 'Honorarios profesionales, justificación del servicio y bono de éxito',
        description: 'Condiciones de contratación, provisión base de 350 €, bono condicionado de 150 € y régimen tributario.',
        faqs: [
            {
                question: '¿Cuánto cuesta la defensa de una multa para evitar la pérdida del carnet?',
                answer: 'La defensa técnica letrada en Autoridad Legal tiene un coste cerrado de 350,00 € en concepto de honorarios profesionales base por el expediente sancionador administrativo completo. Adicionalmente, se pacta un bono de éxito condicionado de 150,00 €, devengable exclusivamente si el conductor conserva la vigencia legal de su carnet de conducir por anulación, caducidad o regeneración de puntos.',
            },
            {
                question: '¿Qué se considera exactamente «éxito» para el devengo del bono de 150 € en Autoridad Legal?',
                answer: 'Éxito es la consecución del objetivo sustancial: conservar la vigencia de la autorización para conducir vehículos a motor. El bono de éxito se devenga no solo si se anula la sanción, sino también si la tramitación permite alcanzar los 24 meses restaurando 12 puntos antes de la firmeza (artículo 65.1 LTSV), o si se recalifica la infracción a tipicidad sin pérdida de puntos.',
            },
            {
                question: '¿Por qué 350 € es un precio competitivo frente a plataformas automáticas de recursos?',
                answer: 'Los 350 € retribuyen la dirección letrada personalizada de un procedimiento complejo que nunca se resuelve con un formulario genérico. A diferencia de plataformas masivas de plantillas automáticas, Autoridad Legal audita cinemómetros, solicita pruebas, impugna informes policiales ampliatorios, formula alegaciones en audiencia, interpone recursos ordinarios y monitoriza permanentemente el Registro Central de la DGT hasta la resolución.',
            },
            {
                question: '¿Cómo se aplican los impuestos y la facturación en los honorarios de Autoridad Legal?',
                answer: 'Los importes de 350,00 € y 150,00 € corresponden estrictamente a honorarios letrados técnicos de dirección y representación. Los tributos aplicables conforme a la legislación vigente (IVA general del 21% o retenciones de IRPF) se liquidan y detallan formalmente en la hoja de encargo profesional firmada antes de iniciar las actuaciones.',
            },
        ],
    },
    {
        name: 'Plazos procesales, caducidad y prueba metrológica',
        description: 'Auditoría de cinemómetros y etilómetros (Orden ICT/155/2020) y caducidad anual del art. 112.3 LTSV.',
        faqs: [
            {
                question: '¿De qué plazo dispongo para recurrir una multa de tráfico antes de que sea firme?',
                answer: 'El plazo legal es de 20 días naturales computados desde el día siguiente al que se recibe la notificación de la denuncia. Dentro de este plazo legal improrrogable del artículo 93 de la Ley de Tráfico, Autoridad Legal debe presentar el pliego de alegaciones y proposición de pruebas para suspender la firmeza y retener los puntos.',
            },
            {
                question: '¿Cuándo caduca un procedimiento sancionador de tráfico según el artículo 112 de la Ley de Seguridad Vial?',
                answer: 'El procedimiento sancionador de tráfico caduca cuando transcurre un año desde su iniciación sin que la Administración notifique la resolución sancionadora definitiva. El artículo 112.3 de la Ley de Seguridad Vial determina que, consumado dicho plazo anual sin resolución expresa, procede acordar el archivo de las actuaciones, cancelando definitivamente la sanción económica y la pérdida de puntos.',
            },
            {
                question: '¿Qué defectos de calibración en cinemómetros o etilómetros anulan una sanción de puntos?',
                answer: 'La ausencia o caducidad del certificado de verificación metrológica del aparato conforme a la Orden ICT/155/2020 anula la sanción de puntos. Asimismo, omitir la aplicación de los márgenes de error metrológicos reglamentarios sobre la velocidad o alcoholemia registrada vulnera la presunción de inocencia, obligando a anular la detracción de puntos o recalificar la infracción.',
            },
            {
                question: '¿Qué sucede si la Administración no contesta a las alegaciones y propuestas de prueba?',
                answer: 'Si la Administración no resuelve las alegaciones ni practica la prueba propuesta, se genera una manifiesta indefensión material contraria a la ley. Dictar una resolución sancionadora obviando la prueba metrológica solicitada por Autoridad Legal vicia el acto conforme a la Ley 39/2015, permitiendo revocar la multa y blindar los puntos en reposición.',
            },
        ],
    },
    {
        name: 'Cobertura ante organismos y competencias territoriales',
        description: 'Actuación telemática oficial ante la DGT, Servei Català de Trànsit, Trafikoa, Navarra y Ayuntamientos.',
        faqs: [
            {
                question: '¿Autoridad Legal recurre multas ante el Servei Català de Trànsit y Trafikoa en el País Vasco?',
                answer: 'Sí, Autoridad Legal ejerce la representación letrada telemática directa ante el Servei Català de Trànsit y Trafikoa en el País Vasco. La intervención profesional abarca tanto a los organismos autonómicos con competencias de tráfico transferidas en Cataluña, Euskadi y Navarra, como a las cincuenta Jefaturas Provinciales de la Dirección General de Tráfico en toda España.',
            },
            {
                question: '¿Cómo se coordinan los organismos autonómicos de Cataluña, Euskadi y Navarra con el Registro Central de la DGT?',
                answer: 'Los organismos autonómicos gestionan de forma autónoma sus expedientes sancionadores pero dependen del Registro de Conductores e Infractores de la DGT. Conforme al artículo 8 de la Ley de Seguridad Vial, las resoluciones firmes del Servei Català de Trànsit o Trafikoa se comunican telemáticamente a la DGT central, único organismo titular de la detracción de puntos.',
            },
            {
                question: '¿Es posible recurrir multas impuestas por Ayuntamientos y Policías Locales de toda España?',
                answer: 'Sí, es perfectamente posible recurrir multas incoadas por Ayuntamientos y Policías Locales de cualquier municipio del territorio español. Autoridad Legal formula descargos e interpone recursos administrativos ante consistorios municipales y organismos provinciales delegados de recaudación, tales como SUMA o BASE, frenando la ejecutividad del cobro y la detracción de los puntos del carnet.',
            },
            {
                question: '¿Qué ocurre si un Ayuntamiento impone una multa muy grave pero no tramita la pérdida de puntos?',
                answer: 'El Ayuntamiento tramita la sanción económica pero carece de potestad para detraer puntos por sí mismo en el censo. Una vez que la sanción municipal deviene firme en vía administrativa, el consistorio traslada el expediente a la DGT para que el Registro Central aplique formalmente la resta de puntos sobre la licencia.',
            },
        ],
    },
    {
        name: 'Régimen postal de notificaciones y garantías procesales de Correos',
        description: 'Vicios formales de notificación conforme al artículo 42.2 de la Ley 39/2015 y jurisprudencia del Tribunal Constitucional.',
        faqs: [
            {
                question: '¿Qué defectos formales comete Correos que permiten anular una multa de tráfico?',
                answer: 'Omitir la hora en el primer intento de entrega o superar el plazo legal de tres días entre avisos invalida la notificación. El artículo 42.2 de la Ley 39/2015 exige registrar la hora con tres horas de diferencia entre intentos; su inobservancia vulnera el procedimiento y vicia las actuaciones sancionadoras.',
            },
            {
                question: '¿Por qué saltar directamente al TESTRA o TEU puede declarar nula una retirada de puntos?',
                answer: 'Publicar una sanción en TESTRA o TEU sin agotar los intentos en el domicilio real registrado vulnera el artículo 24 constitucional. Conforme a reiterada doctrina del Tribunal Constitucional, si la Administración o Correos no investigan domicilios alternativos disponibles en bases oficiales antes de recurrir a edictos, la notificación deviene nula de pleno derecho.',
            },
            {
                question: '¿Cómo se utiliza el plazo de recogida postal de 15 días en Correos?',
                answer: 'El conductor ausente dispone de 15 días naturales para retirar la carta certificada depositada en la oficina de Correos. Retirar la notificación postal hacia el final del plazo permite gestionar el expediente con margen suficiente, postergando el inicio del cómputo de 20 días para presentar las alegaciones de Autoridad Legal.',
            },
            {
                question: '¿Qué diferencia horaria de 3 horas exige el artículo 42.2 de la Ley 39/2015 en Correos?',
                answer: 'La ley exige que el segundo intento de entrega se practique en una franja horaria distinta mediando un mínimo de tres horas. Si el primer intento se realizó antes de las 15:00 horas, el segundo debe practicarse obligatoriamente después de esa hora, constituyendo vicio determinante de invalidez el incumplimiento de este intervalo legal.',
            },
        ],
    },
    {
        name: 'Apoderamiento telemático y representación procesal',
        description: 'Inscripción en @podera o Representa y gestión de canales postales y electrónicos.',
        faqs: [
            {
                question: '¿Cómo otorga un cliente la representación telemática a Autoridad Legal mediante Apodera o Representa?',
                answer: 'El cliente confiere la representación telemática en dos minutos desde su móvil u ordenador utilizando certificado digital, Cl@ve o idCAT Mòbil. Mediante el Registro Electrónico de Apoderamientos (@podera) del Estado o Representa de Cataluña, se inscribe el poder oficial permitiendo a Autoridad Legal personarse y actuar en sedes electrónicas con plena validez.',
            },
            {
                question: '¿Por qué la relación postal o electrónica con Tráfico influye en los plazos?',
                answer: 'Las personas físicas tienen derecho a no relacionarse electrónicamente con la Administración (artículo 14.1 Ley 39/2015). El canal postal de notificaciones mediante Correos suele generar plazos más amplios entre actuaciones, facilitando el seguimiento riguroso del calendario procesal necesario para la consolidación de puntos.',
            },
            {
                question: '¿Cómo se formaliza el alcance del apoderamiento letrado?',
                answer: 'El apoderamiento se formaliza con alcance específico para los trámites necesarios ante la Administración sancionadora, garantizando que el interesado mantenga el control sobre sus canales de comunicación habituales y la recepción ordenada de resoluciones.',
            },
            {
                question: '¿Cómo coordina Autoridad Legal el seguimiento de las notificaciones postales con el cliente?',
                answer: 'Autoridad Legal acuerda con el cliente que este custodie su buzón domiciliario y remita de inmediato fotografía del aviso postal recibido. El cliente retira la carta certificada en Correos dentro del plazo y traslada la resolución al letrado para formalizar el siguiente trámite contradictorio o el correspondiente recurso en plazo.',
            },
        ],
    },
    {
        name: 'Supuestos especiales: pérdida de carnet por incapacidad médica del INSS',
        description: 'Diferenciación de baremos entre Grupo 1 (particular, permiso B) y Grupo 2 (profesional) del Anexo IV RGCond.',
        faqs: [
            {
                question: '¿Por qué la DGT inicia la retirada del carnet si la Seguridad Social me concede una incapacidad?',
                answer: 'La DGT incoa de oficio la pérdida de vigencia al recibir la comunicación telemática de incapacidad laboral remitida por el INSS. Tráfico presume automáticamente la desaparición de aptitudes psicofísicas (artículo 36 Reglamento General de Conductores), abriendo un expediente para retirar todas las autorizaciones sin distinguir entre vehículos particulares y vehículos profesionales de gran tonelaje.',
            },
            {
                question: '¿En qué se diferencian los baremos médicos del Grupo 1 y Grupo 2 del Anexo IV del Reglamento?',
                answer: 'El Grupo 2 (camiones y autobuses) exige condiciones físicas muy estrictas e incompatibles con secuelas cardíacas o motoras permanentes. Por el contrario, el Grupo 1 (turismos y carnet B) admite patologías estabilizadas siempre que la función ventricular esté conservada y no existan síncopes, permitiendo preservar la licencia de conductor particular.',
            },
            {
                question: '¿Cómo defiende Autoridad Legal el carnet B ante una pérdida de vigencia por incapacidad médica?',
                answer: 'Autoridad Legal formaliza allanamiento a la revocación del Grupo 2 y formula oposición técnica acreditada para mantener el carnet B. Se incorporan informes clínicos del especialista que certifiquen estabilidad cardiológica o funcional, solicitando el mantenimiento del permiso de turismo condicionado a revisiones periódicas o adaptaciones.',
            },
            {
                question: '¿Puedo seguir conduciendo mi coche mientras se tramitan las alegaciones médicas ante la DGT?',
                answer: 'Sí, puede seguir conduciendo su coche legalmente durante toda la instrucción contradictoria del expediente de pérdida de vigencia. El acuerdo de inicio no retira la autorización cautelarmente; hasta que la Jefatura Provincial de Tráfico no dicte y notifique la resolución definitiva que ponga fin a la vía administrativa, el permiso conserva plena eficacia jurídica.',
            },
        ],
    },
    {
        name: 'Operativa del despacho y la frontera penal del art. 384 del Código Penal',
        description: 'Contacto ágil por WhatsApp, justificantes telemáticos y jurisprudencia sobre el dolo en la conducción sin puntos.',
        faqs: [
            {
                question: '¿Cómo es el proceso de contacto, estudio y contratación ágil con Autoridad Legal?',
                answer: 'El proceso se inicia por WhatsApp enviando copia de las multas y el extracto de puntos de la DGT para estudio letrado. Una vez analizada la viabilidad, se acuerdan los honorarios, el letrado tramita el apoderamiento telemático oficial que el cliente valida en un clic y se formaliza la defensa sin desplazamientos.',
            },
            {
                question: '¿Existe silencio administrativo positivo que me permita conducir si recurro la pérdida de vigencia?',
                answer: 'No, no existe silencio administrativo positivo que habilite a conducir si la pérdida de vigencia ha sido formalmente resuelta. Solicitar una suspensión administrativa no faculta a ponerse al volante; conducir con saldo cero constatado en el Registro de Conductores e Infractores tras notificarse la resolución firme desencadena responsabilidades penales de carácter inmediato.',
            },
            {
                question: '¿Qué exige el Tribunal Supremo para que conducir sin puntos sea delito según el artículo 384 del Código Penal?',
                answer: 'El Tribunal Supremo exige la constancia formal de notificación personal y fehaciente de la resolución de pérdida de vigencia. Conforme a las SSTS 319/2018 y 360/2025, el dolo típico del artículo 384 del Código Penal requiere acreditar que el conductor conocía de forma cierta la extinción de su carnet dictada por Tráfico.',
            },
            {
                question: '¿Qué documento acredita mi derecho a conducir si me para la policía durante la defensa del expediente?',
                answer: 'El justificante oficial de presentación telemática del recurso o pliego de alegaciones con sello de registro administrativo del Estado acredita la situación. Al comprobar los agentes la base de la DGT, constatarán que la sanción carece de firmeza y que el permiso permanece plenamente vigente en el Registro Central de Conductores.',
            },
        ],
    },
];

export const ALL_PUNTOS_FAQS: PuntosFaq[] = PUNTOS_CLUSTERS.flatMap(cluster =>
    cluster.faqs.map(faq => ({
        cluster: cluster.name,
        question: faq.question,
        answer: faq.answer,
    }))
);

