export type FAQ = {
    question: string;
    answer: string;
    category: 'alcoholemia' | 'accidentes' | 'herencias';
    keywords: string[];
};

export const FAQS: FAQ[] = [
    // --- ALCOHOLEMIAS ---
    {
        question: "¿Cuál es la tasa de alcoholemia permitida en 2025?",
        answer: "<strong>General:</strong> Se reduce de 0,5 a 0,2 g/l en sangre (0,10 mg/l en aire). <br/><strong>Noveles y Profesionales:</strong> Límite unificado de 0,2 g/l en sangre.",
        category: 'alcoholemia',
        keywords: ['tasa alcoholemia', '2025', '0,2 g/l']
    },
    {
        question: "¿Cuándo se considera que la alcoholemia es un delito penal?",
        answer: "Superar <strong>0,60 mg/l</strong> en aire espirado (o 1,2 g/l en sangre) es delito según el Código Penal. Si hay accidente, se puede imputar delito incluso con tasas menores como 0,40 mg/l si hay síntomas evidentes de embriaguez.",
        category: 'alcoholemia',
        keywords: ['delito penal', '0,60 mg/l', 'código penal']
    },
    {
        question: "¿Qué es un \"juicio rápido\" y qué debo hacer si me citan?",
        answer: "El juicio rápido es el procedimiento penal estándar para estos casos. Se celebra en pocos días tras la citación. <strong>Es obligatorio acudir con un abogado y Procurador.</strong>",
        category: 'alcoholemia',
        keywords: ['juicio rápido', 'citación', 'abogado obligatorio']
    },
    {
        question: "¿Puedo reducir mi condena si reconozco los hechos?",
        answer: "Si el conductor acepta la pena solicitada por el Fiscal, se aplica una <strong>reducción de un tercio (1/3)</strong> en la condena, incluyendo la retirada del carnet.",
        category: 'alcoholemia',
        keywords: ['conformidad', 'reducción condena', 'un tercio']
    },
    {
        question: "¿Qué pasa si me niego a realizar la prueba de alcoholemia?",
        answer: "Aclarar que la negativa no es la solución. Negarse es un <strong>delito autónomo</strong> castigado con penas de prisión de 6 meses a 1 año y retirada del carnet de 1 a 4 años.",
        category: 'alcoholemia',
        keywords: ['negativa prueba', 'delito autónomo', 'prisión']
    },
    {
        question: "¿Por cuánto tiempo me quitarán el carnet de conducir?",
        answer: "<strong>Vía administrativa:</strong> De 3 a 6 meses según la tasa. <br/><strong>Vía penal:</strong> Retirada obligatoria de entre 1 y 4 años.",
        category: 'alcoholemia',
        keywords: ['retirada carnet', 'vía penal', 'administrativa']
    },
    {
        question: "Si he dado positivo pero el accidente no fue mi culpa, ¿puedo reclamar?",
        answer: "Sí es posible reclamar si la culpa fue exclusiva del otro conductor, aunque la aseguradora contraria intentará alegar concurrencia de culpas por el positivo.",
        category: 'alcoholemia',
        keywords: ['accidente', 'culpa exclusiva', 'reclamar']
    },
    {
        question: "¿Tendré antecedentes penales tras una condena por alcoholemia?",
        answer: "Sí, una condena penal genera antecedentes que pueden afectar a oposiciones o permisos de residencia. Estos pueden cancelarse pasado el plazo legal (habitualmente 2 años tras cumplir la pena).",
        category: 'alcoholemia',
        keywords: ['antecedentes penales', 'cancelación', 'oposiciones']
    },
    {
        question: "¿Mi seguro cubrirá los daños si he dado positivo?",
        answer: "Generalmente, las aseguradoras pagan a terceros pero luego ejercen el <strong>derecho de repetición</strong> contra el conductor ebrio para que este devuelva el importe de las indemnizaciones pagadas.",
        category: 'alcoholemia',
        keywords: ['seguro', 'derecho repetición', 'pagar daños']
    },
    {
        question: "¿Por qué necesito un abogado especialista y cuánto cuesta?",
        answer: "Un especialista puede detectar errores en el ticket del etilómetro o en el procedimiento policial que lleven a la absolución o a negociar una conformidad favorable. Los precios van en función de la urgencia, la pena solicitada y el lugar donde ocurrieron los hechos.",
        category: 'alcoholemia',
        keywords: ['abogado especialista', 'precio', 'errores etilómetro']
    },
    {
        question: "¿Cuál es el margen de error de los etilómetros en 2025?",
        answer: "Los etilómetros de precisión deben cumplir con márgenes de error establecidos (generalmente un 5% o un 7,5% según la antigüedad del aparato). Si el resultado es muy cercano al límite penal (ej. 0,61 o 0,62 mg/l), un abogado puede impugnar el resultado aplicando el margen de error a favor del reo para reducir la condena de delito a falta administrativa.",
        category: 'alcoholemia',
        keywords: ['margen error', 'etilómetro', 'impugnar']
    },
    {
        question: "He dado positivo con el coche de empresa, ¿me pueden despedir?",
        answer: "Sí. Conducir bajo los efectos del alcohol durante la jornada laboral o en un vehículo de empresa puede ser motivo de <strong>despido disciplinario procedente</strong> sin indemnización, especialmente si el puesto requiere el uso habitual del vehículo.",
        category: 'alcoholemia',
        keywords: ['coche empresa', 'despido procedente', 'sin indemnización']
    },
    {
        question: "¿Puedo fraccionar el pago de la multa penal por alcoholemia?",
        answer: "Sí, los juzgados suelen permitir el fraccionamiento de la multa económica impuesta en el juicio rápido (que suele durar entre 6 y 10 meses). Debes solicitarlo formalmente acreditando tu situación económica.",
        category: 'alcoholemia',
        keywords: ['fraccionar multa', 'pago a plazos', 'situación económica']
    },
    {
        question: "¿Qué son los \"Trabajos en Beneficio de la Comunidad\" (TBC)?",
        answer: "Es una pena que consiste en realizar labores sociales sin remuneración. Se suelen imponer entre 31 y 90 días en casos de conformidad. Si no tienes ingresos para pagar la multa, esta es la alternativa más común para evitar la cárcel.",
        category: 'alcoholemia',
        keywords: ['trabajos beneficio comunidad', 'TBC', 'alternativa cárcel']
    },
    {
        question: "¿Cómo puedo recuperar los puntos del carnet tras una alcoholemia?",
        answer: "Depende de si la sanción fue administrativa (pérdida de 4 o 6 puntos) o penal (retirada del carnet por tiempo determinado). Si te retiran el carnet por vía judicial más de 2 años, deberás realizar un curso de reeducación y sensibilización vial (curso de recuperación de puntos) y volver a examinarte.",
        category: 'alcoholemia',
        keywords: ['recuperar puntos', 'curso reeducación', 'examen']
    },
    {
        question: "¿Qué ocurre si el positivo es por drogas y no por alcohol?",
        answer: "La tasa de drogas es de \"tolerancia cero\". Cualquier presencia de sustancias psicoactivas detectada mediante test de saliva conlleva una multa administrativa de 1.000 € y 6 puntos, o una pena de prisión si se demuestra influencia real en la conducción.",
        category: 'alcoholemia',
        keywords: ['drogas', 'tolerancia cero', 'test saliva']
    },
    {
        question: "¿Puedo negarme a soplar si el etilómetro no parece estar homologado?",
        answer: "No se recomienda. Debes realizar la prueba y, posteriormente, tu abogado solicitará el certificado de verificación periódica del aparato. La negativa es un delito más grave que el propio positivo en la mayoría de los casos.",
        category: 'alcoholemia',
        keywords: ['homologación', 'certificado verificación', 'negarse soplar']
    },
    {
        question: "¿Cómo afecta la reincidencia en un control de alcoholemia?",
        answer: "Si has sido condenado por lo mismo en los últimos 10 años, el juez no podrá aplicar la suspensión de la pena de prisión (si la hubiere) y las multas y tiempos de retirada del carnet serán significativamente mayores.",
        category: 'alcoholemia',
        keywords: ['reincidencia', 'antecedentes', 'prisión']
    },
    {
        question: "¿Cuándo prescriben los antecedentes penales de una alcoholemia?",
        answer: "Tras cumplir la condena (haber pagado la multa y pasado el tiempo de retirada), el plazo para cancelar antecedentes es generalmente de 2 años (si la pena fue de hasta 12 meses de retirada) o de 3 años (si fue superior).",
        category: 'alcoholemia',
        keywords: ['prescripción', 'cancelar antecedentes', 'plazos']
    },
    {
        question: "¿Es gratis el abogado de oficio para estos casos?",
        answer: "No. El abogado de oficio solo es gratuito si demuestras falta de recursos económicos (umbral de ingresos bajo). Si superas ese umbral, el Colegio de Abogados te pasará la factura por la defensa realizada en el juicio rápido. Es distinto el abogado de oficio que el derecho a la Justicia Gratuita aunque puedan confluir.",
        category: 'alcoholemia',
        keywords: ['abogado oficio', 'justicia gratuita', 'coste']
    },

    // --- ACCIDENTES DE TRÁFICO ---
    {
        question: "¿Qué es lo primero que debo hacer tras un accidente de tráfico?",
        answer: "Lo principal es aplicar el protocolo <strong>PAS: Proteger el lugar, Avisar a emergencias y Socorrer a los heridos</strong>. Inmediatamente después, rellena el parte amistoso o solicita la presencia de la policía para levantar un atestado.",
        category: 'accidentes',
        keywords: ['PAS', 'parte amistoso', 'atestado']
    },
    {
        question: "¿Cuál es el plazo para comunicar un siniestro a la compañía de seguros?",
        answer: "De acuerdo con la Ley de Contrato de Seguro en España, dispones de un <strong>plazo máximo de 7 días</strong> para comunicar el accidente a tu aseguradora, a menos que la póliza especifique un periodo superior.",
        category: 'accidentes',
        keywords: ['plazo comunicar', '7 días', 'ley contrato seguro']
    },
    {
        question: "¿Cuánto tiempo tengo para reclamar una indemnización por lesiones?",
        answer: "Tienes un plazo de <strong>1 año</strong> por la vía civil (desde el alta médica o estabilización de las secuelas) para reclamar daños y perjuicios. Si el accidente constituye un delito, el plazo de prescripción varía según el Código Penal.",
        category: 'accidentes',
        keywords: ['plazo reclamar', '1 año', 'prescripción']
    },
    {
        question: "¿Qué documentación necesito para reclamar una indemnización?",
        answer: "Necesitarás el atestado policial o parte amistoso, el informe de urgencias (emitido antes de 72 horas), los informes de seguimiento médico, facturas de gastos derivados y la póliza del seguro.",
        category: 'accidentes',
        keywords: ['documentación', 'informe urgencias', 'facturas']
    },
    {
        question: "¿Qué es el Baremo de Autos y cómo afecta a mi indemnización?",
        answer: "El Baremo de Autos es el sistema legal que actualiza anualmente las cuantías de las indemnizaciones por muerte, secuelas y lesiones temporales. Puedes consultar las tablas oficiales en la Dirección General de Seguros (DGSFP).",
        category: 'accidentes',
        keywords: ['baremo autos', 'cuantías', 'tablas oficiales']
    },
    {
        question: "¿Tengo derecho a indemnización si fui el culpable del accidente?",
        answer: "Como conductor culpable no tienes derecho a indemnización por daños personales, pero sí podrías recibir asistencia médica según las coberturas de tu \"Seguro del Conductor\". Los ocupantes siempre tienen derecho a indemnización, independientemente de quién fuera el culpable.",
        category: 'accidentes',
        keywords: ['conductor culpable', 'ocupantes', 'seguro conductor']
    },
    {
        question: "¿Qué hacer si el otro conductor no tiene seguro o se da a la fuga?",
        answer: "En estos casos, la reclamación debe dirigirse al <strong>Consorcio de Compensación de Seguros</strong>, organismo encargado de cubrir siniestros donde el vehículo responsable es desconocido o carece de seguro obligatorio.",
        category: 'accidentes',
        keywords: ['consorcio', 'sin seguro', 'fuga']
    },
    {
        question: "¿Es obligatorio acudir a urgencias si no siento dolor inmediato?",
        answer: "Sí. Para reclamar con éxito, es imprescindible acudir a urgencias en las <strong>primeras 72 horas</strong>. Muchas lesiones cervicales o internas no presentan síntomas inmediatos debido a la adrenalina.",
        category: 'accidentes',
        keywords: ['urgencias', '72 horas', 'lesiones ocultas']
    },
    {
        question: "¿Puedo elegir libremente mi centro de rehabilitación?",
        answer: "Sí, gracias a los convenios de asistencia sanitaria (UNESPA), los lesionados pueden elegir el centro de rehabilitación que deseen de entre los adheridos, sin coste para ellos y con independencia de su aseguradora.",
        category: 'accidentes',
        keywords: ['rehabilitación', 'UNESPA', 'libre elección']
    },
    {
        question: "¿Qué diferencia hay entre el parte amistoso y el atestado policial?",
        answer: "El parte amistoso es un acuerdo mutuo entre conductores. El atestado es un documento oficial elaborado por la autoridad (Policía o Guardia Civil) que tiene mayor presunción de veracidad en caso de juicio.",
        category: 'accidentes',
        keywords: ['parte amistoso', 'atestado', 'veracidad']
    },
    {
        question: "¿Quién paga los gastos médicos tras un accidente de tráfico?",
        answer: "Los gastos médicos son cubiertos por la aseguradora del vehículo responsable o por la propia (según el convenio UNESPA), nunca por la Seguridad Social, que posteriormente reclamará el coste a las compañías.",
        category: 'accidentes',
        keywords: ['gastos médicos', 'aseguradora', 'seguridad social']
    },
    {
        question: "¿Qué es el latigazo cervical y qué indemnización le corresponde?",
        answer: "Es la lesión más común (esguince cervical). Su indemnización depende de la duración del tratamiento y las secuelas, generalmente oscilando entre los 1.500 € y 6.000 € según el Baremo 2025.",
        category: 'accidentes',
        keywords: ['latigazo cervical', 'indemnización', 'esguince']
    },
    {
        question: "¿Puedo reclamar daños materiales si mi coche es declarado \"siniestro total\"?",
        answer: "Si el coste de reparación supera el valor venal del vehículo, la aseguradora declarará siniestro total. Tienes derecho al valor de mercado del coche más un porcentaje por \"valor de afección\" (entre el 10% y el 30%).",
        category: 'accidentes',
        keywords: ['siniestro total', 'valor venal', 'valor afección']
    },
    {
        question: "¿Tengo derecho a un abogado de mi elección?",
        answer: "Sí. La mayoría de las pólizas incluyen una cláusula de <strong>Defensa Jurídica</strong> que te permite elegir un abogado externo. La aseguradora cubrirá los honorarios hasta el límite establecido en tu contrato.",
        category: 'accidentes',
        keywords: ['libre elección abogado', 'defensa jurídica', 'póliza']
    },
    {
        question: "¿Qué sucede si el accidente ocurre yendo o volviendo del trabajo?",
        answer: "Se considera un accidente <em>in itinere</em> y tiene la consideración legal de accidente laboral. Esto otorga derechos adicionales frente a la Mutua de Trabajo y la Seguridad Social.",
        category: 'accidentes',
        keywords: ['in itinere', 'accidente laboral', 'mutua']
    },
    {
        question: "¿Qué es la concurrencia de culpas?",
        answer: "Ocurre cuando ambos conductores han cometido una infracción que ha contribuido al accidente. En este caso, la indemnización se reduce proporcionalmente al grado de responsabilidad de cada uno.",
        category: 'accidentes',
        keywords: ['concurrencia culpas', 'responsabilidad compartida', 'reducción indemnización']
    },
    {
        question: "¿Cómo se calculan los días de perjuicio personal?",
        answer: "Se dividen en: Perjuicio Muy Grave (ingreso en UCI), Grave (estancia hospitalaria), Moderado (baja laboral o impedimento para actividades habituales) y Básico (días de curación sin baja).",
        category: 'accidentes',
        keywords: ['perjuicio personal', 'días baja', 'grave', 'moderado']
    },
    {
        question: "¿Qué cubre la garantía de asistencia en viaje?",
        answer: "Suele cubrir el remolque del vehículo, el transporte de los ocupantes hasta su domicilio y, en ocasiones, el alojamiento si el accidente ocurre lejos de la residencia habitual.",
        category: 'accidentes',
        keywords: ['asistencia viaje', 'grúa', 'alojamiento']
    },
    {
        question: "¿Es vinculante la oferta motivada de la aseguradora?",
        answer: "La aseguradora debe presentarte una oferta en un máximo de 3 meses. No es vinculante para ti; si no estás de acuerdo, puedes rechazarla y acudir a la vía judicial o mediación.",
        category: 'accidentes',
        keywords: ['oferta motivada', 'no vinculante', 'rechazar']
    },
    {
        question: "¿Qué importancia tienen los testigos en un accidente de tráfico?",
        answer: "Los testigos imparciales son cruciales cuando no hay acuerdo en el parte amistoso. Sus datos deben recogerse en el momento del accidente para que su testimonio tenga validez ante el seguro o un juez.",
        category: 'accidentes',
        keywords: ['testigos', 'validez', 'juicio']
    },

    // --- HERENCIAS ---
    {
        question: "¿Qué pasos debo seguir tras el fallecimiento de un familiar para la herencia?",
        answer: "Primero, obtén el certificado de defunción. Tras 15 días hábiles, solicita el Certificado de Últimas Voluntades y el de Contratos de Seguros. Estos documentos indicarán si existe testamento y ante qué notario se otorgó para solicitar una copia autorizada.",
        category: 'herencias',
        keywords: ['certificado defunción', 'últimas voluntades', 'pasos herencia']
    },
    {
        question: "¿Qué ocurre si el fallecido no dejó testamento (abintestato)?",
        answer: "Cuando no hay testamento, la ley determina los herederos siguiendo un orden de parentesco: hijos, padres, cónyuge y hermanos. Es necesario realizar una <strong>Declaración de Herederos</strong> ante notario para designar legalmente a los beneficiarios.",
        category: 'herencias',
        keywords: ['abintestato', 'sin testamento', 'declaración herederos']
    },
    {
        question: "¿Cómo puedo saber si soy beneficiario de un seguro de vida?",
        answer: "Debes solicitar el Certificado de Contratos de Seguros de cobertura de fallecimiento en la sede electrónica del Ministerio de Justicia. Este registro informa de los seguros vigentes y la entidad aseguradora con la que se contrataron.",
        category: 'herencias',
        keywords: ['seguro vida', 'certificado seguros', 'ministerio justicia']
    },
    {
        question: "¿Qué es la copia autorizada del testamento y dónde se pide?",
        answer: "Es el documento original firmado por el testador que tiene validez legal. Se solicita en la notaría donde se realizó el testamento, aportando los certificados de defunción y últimas voluntades.",
        category: 'herencias',
        keywords: ['copia autorizada', 'notaría', 'validez legal']
    },
    {
        question: "¿Qué plazo hay para aceptar una herencia?",
        answer: "Legalmente no hay un plazo máximo para aceptar la herencia, pero el derecho a reclamarla suele prescribir a los 30 años. Sin embargo, los plazos fiscales para pagar impuestos son de <strong>6 meses</strong>.",
        category: 'herencias',
        keywords: ['plazo aceptación', 'prescripción', 'impuestos']
    },
    {
        question: "¿Cuánto tiempo tengo para pagar el Impuesto de Sucesiones?",
        answer: "El plazo es de <strong>seis meses</strong> desde el fallecimiento. Se puede solicitar una prórroga de otros seis meses adicionales dentro de los primeros cinco meses del plazo inicial, aunque esto devengará intereses de demora.",
        category: 'herencias',
        keywords: ['impuesto sucesiones', 'plazo pago', 'prórroga']
    },
    {
        question: "¿Qué es la plusvalía municipal en una herencia y quién la paga?",
        answer: "Es el impuesto sobre el incremento de valor de los terrenos urbanos. Deben pagarlo los herederos que reciben un inmueble. El plazo es de seis meses, prorrogables a un año si se solicita a tiempo al Ayuntamiento.",
        category: 'herencias',
        keywords: ['plusvalía municipal', 'inmueble', 'ayuntamiento']
    },
    {
        question: "¿Cómo afecta la Comunidad Autónoma al pago del Impuesto de Sucesiones?",
        answer: "En España, el Impuesto de Sucesiones está cedido a las Comunidades Autónomas. Regiones como Madrid, Andalucía o Murcia tienen bonificaciones de hasta el 99% para familiares directos, mientras que otras mantienen tipos más elevados.",
        category: 'herencias',
        keywords: ['comunidad autónoma', 'bonificaciones', 'diferencias regionales']
    },
    {
        question: "¿Se puede pagar el Impuesto de Sucesiones con el dinero de la cuenta del fallecido?",
        answer: "Sí. Los bancos permiten disponer del saldo de las cuentas del fallecido exclusivamente para el pago de los impuestos de la herencia (Sucesiones), siempre que se justifique con la autoliquidación tributaria.",
        category: 'herencias',
        keywords: ['pago impuestos', 'cuentas bancarias', 'saldo fallecido']
    },
    {
        question: "¿Qué es la legítima y quiénes son los herederos forzosos?",
        answer: "La legítima es la parte de la herencia que la ley reserva obligatoriamente a ciertos parientes. Los herederos forzosos son, en primer lugar, los hijos y descendientes; a falta de estos, los padres y ascendientes; y el viudo/a en la forma que establece la ley.",
        category: 'herencias',
        keywords: ['legítima', 'herederos forzosos', 'reserva ley']
    },
    {
        question: "¿Se puede desheredar a un hijo en España?",
        answer: "Es posible pero muy complejo. Debe alegarse una causa legal tasada en el Código Civil, como maltrato psicológico, falta de relación continuada e imputable al hijo, o haber negado alimentos al progenitor.",
        category: 'herencias',
        keywords: ['desheredar', 'causa legal', 'maltrato']
    },
    {
        question: "¿Qué pasa si un heredero se niega a firmar o repartir la herencia?",
        answer: "Desde 2015, se puede acudir a un notario para que realice un requerimiento al heredero que bloquea el proceso (interpelación notarial). Si en 30 días no contesta, se entiende que acepta la herencia \"pura y simplemente\".",
        category: 'herencias',
        keywords: ['bloqueo herencia', 'interpelación notarial', 'plazo 30 días']
    },
    {
        question: "¿Qué es el usufructo viudal?",
        answer: "Es el derecho del cónyuge sobreviviente a disfrutar de los bienes del fallecido (como el uso de la vivienda), aunque la propiedad pertenezca a los hijos. El viudo no puede vender los bienes, pero sí usarlos o percibir sus rentas.",
        category: 'herencias',
        keywords: ['usufructo viudal', 'uso vivienda', 'cónyuge']
    },
    {
        question: "¿Cómo se reparte una herencia sin acuerdo entre las partes?",
        answer: "Si no hay acuerdo extrajudicial ni mediación posible, se debe acudir a la vía judicial mediante un <strong>procedimiento de división de herencia</strong>, donde un perito y un contador-partidor realizarán el inventario y reparto.",
        category: 'herencias',
        keywords: ['sin acuerdo', 'división judicial', 'contador-partidor']
    },
    {
        question: "¿Qué significa aceptar una herencia \"a beneficio de inventario\"?",
        answer: "Es una fórmula para proteger el patrimonio personal del heredero. Permite pagar las deudas del fallecido solo con los bienes de la herencia, sin que el heredero responda con su propio dinero por las deudas heredadas.",
        category: 'herencias',
        keywords: ['beneficio inventario', 'proteger patrimonio', 'deudas']
    },
    {
        question: "¿Puedo renunciar a una herencia?",
        answer: "Sí, la renuncia o repudiación debe hacerse de forma expresa ante notario. Es importante saber que la renuncia es irrevocable y que no se puede renunciar solo a las deudas y quedarse con los bienes.",
        category: 'herencias',
        keywords: ['renuncia', 'irrevocable', 'notario']
    },
    {
        question: "¿Qué pasa con las deudas del fallecido tras la herencia?",
        answer: "Si aceptas la herencia de forma \"pura y simple\", asumes tanto los bienes como las deudas. Si las deudas superan a los bienes, el heredero deberá pagarlas con su propio patrimonio personal.",
        category: 'herencias',
        keywords: ['deudas', 'aceptación pura', 'patrimonio personal']
    },
    {
        question: "¿Cómo heredan los sobrinos si no hay hijos ni hermanos vivos?",
        answer: "Si solo quedan sobrinos, estos heredan por \"derecho propio\" y a partes iguales. Si hay hermanos y sobrinos (hijos de un hermano fallecido), los sobrinos heredan \"por representación\" la parte que le tocaba a su padre/madre.",
        category: 'herencias',
        keywords: ['sobrinos', 'derecho propio', 'representación']
    },
    {
        question: "¿Cuál es la diferencia entre legado y herencia?",
        answer: "El heredero sucede al fallecido en todos sus derechos y obligaciones (título universal). El legatario recibe un bien o derecho concreto (título particular) designado específicamente en el testamento y no responde de las deudas generales.",
        category: 'herencias',
        keywords: ['legado', 'título particular', 'heredero']
    },
    {
        question: "¿Qué es el testamento \"del uno para el otro\"?",
        answer: "Es el testamento cruzado habitual entre matrimonios. Aunque no existe como tal en el Código Civil común (cada uno hace el suyo), se suele incluir la cláusula <strong>Socini</strong>, que deja al cónyuge el usufructo universal de todos los bienes a cambio de no reclamar la legítima estricta hasta que ambos falten.",
        category: 'herencias',
        keywords: ['testamento cruzado', 'cláusula socini', 'usufructo universal']
    },
    // --- HERENCIAS (ESPECÍFICO CATALUÑA) ---
    {
        question: "¿A cuánto asciende la legítima en Cataluña?",
        answer: "A diferencia del derecho común (donde es de 1/3 o 2/3), en Cataluña la legítima es la <strong>cuarta parte (25%)</strong> del valor de la herencia. Este importe se divide a partes iguales entre todos los legitimarios (hijos o, en su defecto, padres).",
        category: 'herencias',
        keywords: ['legítima cataluña', '25%', 'cuarta parte']
    },
    {
        question: "¿Quiénes son los herederos forzosos o legitimarios en Cataluña?",
        answer: "En Cataluña, son legitimarios únicamente los <strong>hijos y descendientes</strong>. A falta de estos, lo son los <strong>padres</strong>. El cónyuge viudo no es legitimario en el derecho catalán, aunque tiene otros derechos económicos como la \"cuarta vidual\".",
        category: 'herencias',
        keywords: ['legitimarios cataluña', 'hijos', 'cónyuge no legitimario']
    },
    {
        question: "¿Qué es la \"Cuarta Vidual\" y quién puede reclamarla?",
        answer: "Es un derecho específico del cónyuge viudo o pareja de hecho superviviente que, con sus bienes propios y los heredados, no tenga recursos suficientes para su sustento. Permite reclamar hasta un máximo de la <strong>cuarta parte (25%)</strong> del patrimonio hereditario.",
        category: 'herencias',
        keywords: ['cuarta vidual', 'cónyuge viudo', 'recursos insuficientes']
    },
    {
        question: "¿Es válida la pareja de hecho para heredar en Cataluña?",
        answer: "Sí. En Cataluña, el Código Civil catalán equipara totalmente los derechos sucesorios de las <strong>parejas de hecho</strong> (convivencia de más de 2 años o con hijos comunes) a los de los matrimonios, incluso en la sucesión intestada (sin testamento).",
        category: 'herencias',
        keywords: ['pareja hecho', 'equiparación matrimonio', 'código civil catalán']
    },
    {
        question: "¿Qué ocurre con el \"Any de Plor\" (Año de Luto)?",
        answer: "Es un derecho exclusivo en Cataluña que permite al cónyuge o pareja supérstite vivir en la vivienda conyugal durante el <strong>año siguiente al fallecimiento</strong> y ser alimentado a cargo del patrimonio del fallecido, según el nivel de vida que mantenían.",
        category: 'herencias',
        keywords: ['any de plor', 'año luto', 'uso vivienda']
    },
    {
        question: "¿Cómo funciona la sucesión sin testamento (intestada) en Cataluña?",
        answer: "El orden es distinto al resto de España. En Cataluña, si hay hijos y cónyuge, el cónyuge o pareja de hecho tiene el <strong>usufructo universal</strong> de toda la herencia por ley. El cónyuge puede optar, en los 90 días siguientes, por cambiar ese usufructo por la propiedad de una <strong>cuarta parte de la herencia</strong> más el usufructo de la vivienda habitual.",
        category: 'herencias',
        keywords: ['intestada cataluña', 'usufructo universal', 'opción conmutación']
    },
    {
        question: "¿Qué es el heredero de confianza?",
        answer: "Es una figura del derecho catalán donde el testador designa a personas para que den a los bienes el destino que él les comunicó de forma confidencial (habitualmente de palabra o carta privada). Es una figura de máxima relevancia en grandes patrimonios y empresas familiares.",
        category: 'herencias',
        keywords: ['heredero confianza', 'destino confidencial', 'derecho catalán']
    },
    {
        question: "¿Existe el \"testamento ante testigos\" en Cataluña?",
        answer: "No. A diferencia del Código Civil español, en Cataluña <strong>no son válidos</strong> los testamentos otorgados solo ante testigos en caso de epidemia o peligro de muerte. El testamento debe ser siempre notarial u hológrafo (escrito de puño y letra bajo estrictos requisitos).",
        category: 'herencias',
        keywords: ['testamento testigos', 'no válido', 'cataluña']
    },
    {
        question: "¿Cuál es el plazo de prescripción para reclamar la legítima en Cataluña?",
        answer: "El plazo para que un hijo reclame su legítima a los herederos es de <strong>10 años</strong> desde la muerte del causante. En el derecho común, este plazo suele interpretarse como de 30 años para acciones reales, por lo que la diferencia es fundamental.",
        category: 'herencias',
        keywords: ['prescripción legítima', '10 años', 'cataluña']
    },
    {
        question: "¿Cómo tributa el Impuesto de Sucesiones en Cataluña en 2025?",
        answer: "Cataluña aplica sus propias tarifas y bonificaciones. Para descendientes directos (Grupo I y II), existen bonificaciones decrecientes que pueden llegar hasta el 99% en cuotas bajas, pero que se reducen conforme aumenta la base imponible. Es vital consultar las tablas actualizadas de la Agència Tributària de Catalunya.",
        category: 'herencias',
        keywords: ['impuesto sucesiones 2025', 'cataluña', 'bonificaciones']
    }
];
