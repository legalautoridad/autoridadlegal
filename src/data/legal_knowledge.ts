export type LegalEntry = {
    type: 'FAQ' | 'ATOMIC_FACT';
    category: string;
    question: string;
    content: string;
    source?: string;
};

export const LEGAL_KNOWLEDGE: LegalEntry[] = [
    // Block 1
    {
        "type": "ATOMIC_FACT",
        "category": "Tasas de Alcohol",
        "question": "Límites penales objetivos por tasa de alcohol",
        "content": "Se considera delito contra la seguridad vial (Art. 379.2 CP) conducir con una tasa de alcohol en aire espirado superior a 0,60 mg/l o una tasa en sangre superior a 1,2 g/l. Estas tasas operan como presunción 'iuris et de iure' de influencia, no admitiendo prueba en contrario.",
        "source": "Art. 379.2 CP, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Tasas de Alcohol",
        "question": "Límites administrativos generales y especiales",
        "content": "La tasa administrativa general prohibida es superior a 0,25 mg/l en aire (0,5 g/l en sangre). Para conductores profesionales, de vehículos de emergencia, mercancías peligrosas o conductores noveles (primeros 2 años), el límite se reduce a superior a 0,15 mg/l en aire (0,3 g/l en sangre).",
        "source": "Art. 20 RGCir, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Tipicidad",
        "question": "¿Es delito dar exactamente 0,60 mg/l en el etilómetro?",
        "content": "No necesariamente por la vía de la tasa objetiva, ya que el Código Penal exige que sea 'superior a 0,60'. Sin embargo, puede ser delito bajo el primer inciso del Art. 379.2 CP si existen síntomas evidentes de influencia en la conducción acreditados por los agentes.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Antecedentes Penales",
        "question": "Plazos de cancelación de antecedentes penales",
        "content": "Para las penas por delitos contra la seguridad vial (consideradas 'menos graves'), el plazo de cancelación es de 2 años para prisión, multa o trabajos en beneficio de la comunidad. En la privación del derecho a conducir: 6 meses si la retirada es igual o inferior a 1 año, y 2 años si es superior a 1 año.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Antecedentes Penales",
        "question": "Cómputo del plazo de cancelación de antecedentes",
        "content": "El plazo de cancelación comienza a contar desde el cumplimiento total de la última de las penas impuestas (pago total de multa o fin del periodo de retirada del carné). Si hay varias penas, debe transcurrir el plazo más largo de los aplicables para que consten como cancelados.",
        "source": "Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Procedimiento",
        "question": "¿Cuál es la diferencia entre Juicio Rápido y Diligencias Previas?",
        "content": "El Juicio Rápido (Art. 795 LECrim) se aplica ante delitos flagrantes con instrucción sencilla y permite la conformidad con reducción de pena. Las Diligencias Previas se incoan cuando el caso es complejo (accidentes con lesionados graves, necesidad de reconstrucción pericial o falta de atestado inicial completo) y suelen derivar en un Procedimiento Abreviado.",
        "source": "Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Juicio Rápido",
        "question": "¿Qué beneficio económico y penal tiene la conformidad?",
        "content": "La conformidad en el Juzgado de Guardia permite una reducción de un tercio (1/3) de la pena solicitada por el Fiscal (tanto en la multa como en el tiempo de privación del carné). No es recurrible si se acepta.",
        "source": "Art. 801 LECrim, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Negativa (Art. 383)",
        "question": "Consecuencias penales de negarse a soplar",
        "content": "La negativa a someterse a las pruebas de alcoholemia o drogas requeridas por un agente es un delito autónomo castigado con prisión de 6 meses a 1 año y privación del derecho a conducir de 1 a 4 años. Esta pena es, por lo general, más grave que la de dar positivo.",
        "source": "Art. 383 CP, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Negativa (Art. 383)",
        "question": "Negativa a la segunda prueba de alcoholemia",
        "content": "La negativa a realizar la segunda prueba de precisión (tras un primer resultado positivo o presencia de síntomas) es constitutiva del delito del Art. 383 CP. La jurisprudencia del Tribunal Supremo establece que ambas mediciones son fases de una única prueba obligatoria.",
        "source": "STS 210/2017, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Penalidad",
        "question": "Posibilidad de sustituir o fraccionar penas",
        "content": "La pena de multa puede ser fraccionada en el tiempo según la capacidad económica del reo. La pena de prisión puede ser sustituida por Trabajos en Beneficio de la Comunidad (TBC), habitualmente con una equivalencia de un día de trabajo por cada día de prisión, en el rango de 31 a 90 días para estos delitos.",
        "source": "Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Penalidad",
        "question": "¿Se puede fraccionar la retirada del permiso de conducir?",
        "content": "Según el criterio de Audiencias Provinciales como la de Valladolid, no cabe el fraccionamiento de la pena de privación del permiso de conducir; una vez iniciada, debe cumplirse de forma ininterrumpida hasta su total ejecución.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Costas Procesales",
        "question": "Costas y gastos en el proceso de alcoholemia",
        "content": "El condenado suele ser cargado con las costas procesales. Los gastos de la tasación pericial (análisis de sangre de contraste) son del interesado si el resultado es positivo; si es negativo, corren a cargo de la Administración. Los honorarios de abogado privado oscilan entre 600€ y 1.800€ para casos estándar en 2025.",
        "source": "Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Costas Procesales",
        "question": "¿El abogado de oficio es gratis siempre?",
        "content": "No. La designación de un abogado del Turno de Oficio solo es gratuita si el investigado acredita insuficiencia de recursos económicos según la Ley de Asistencia Jurídica Gratuita. Si no se reconoce el derecho, el investigado deberá abonar la minuta (mínimo orientativo de 600-650€ en juicios rápidos).",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Reincidencia",
        "question": "Aplicación de la agravante de reincidencia (Art. 22.8 CP)",
        "content": "La reincidencia se aplica si el culpable ha sido condenado ejecutoriamente por un delito comprendido en el mismo título del Código Penal y de la misma naturaleza. Su efecto es la imposición de la pena en su mitad superior. No computan antecedentes cancelados o que debieran serlo.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Fisiología y Prueba",
        "question": "Cálculo retrospectivo y Curva de Widmark",
        "content": "La Curva de Widmark describe las fases de absorción (ascendente), meseta y eliminación (descendente) del alcohol. Los tribunales pueden aplicar un cálculo retrospectivo para inferir que en el momento del accidente la tasa era superior a la detectada una hora después si el sujeto estaba en fase descendente.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Fisiología y Prueba",
        "question": "Tiempos de absorción y metabolismo",
        "content": "El contenido de alcohol en sangre previsible se calcula mediante la fórmula: gramos de alcohol ingeridos / (peso en kg x coeficiente [0.7 hombres / 0.6 mujeres]). El nivel de alcohol suele bajar aproximadamente un 1% (o tasa equivalente) por cada hora transcurrida tras la última ingesta.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Metrología y Márgenes de Error",
        "question": "Margen de error legal (Orden ICT/155/2020)",
        "content": "Para etilómetros en servicio (más de 1 año), se aplica un margen de error máximo permitido (EMP) del 7,5% para concentraciones entre 0,40 mg/l y 2 mg/l. Para concentraciones ≤ 0,40 mg/l, el error es de 0,030 mg/l.",
        "source": "Orden ICT/155/2020, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Metrología y Márgenes de Error",
        "question": "Doctrina del redondeo a favor del reo",
        "content": "El Tribunal Supremo establece (STS 788/2023) que los resultados con tres decimales tras aplicar el margen de error deben redondearse al segundo decimal. Si el tercer decimal no es superior a 5, se redondea hacia abajo. Ejemplo: 0,65 mg/l - 7,5% = 0,60125 -> 0,60 mg/l (Absolución por no ser 'superior' a 0,60).",
        "source": "STS 788/2023, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Seguros",
        "question": "¿Cubre el seguro la multa o la defensa en caso de alcoholemia?",
        "content": "No. La conducción bajo la influencia del alcohol se considera conducta dolosa. La aseguradora pagará la indemnización a terceros pero tiene el derecho de repetición (reclamar el importe íntegro) contra el conductor, el asegurado y el propietario del vehículo.",
        "source": "Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Procedimiento Policial",
        "question": "Intervalo obligatorio entre pruebas",
        "content": "Entre la primera y la segunda medición con etilómetro evidencial deben transcurrir al menos 10 minutos. El incumplimiento de este intervalo es causa de nulidad de la prueba por falta de garantías de fiabilidad técnica (eliminación de alcohol en boca).",
        "source": "Pasajes"
    },
    // Block 2
    {
        "type": "ATOMIC_FACT",
        "category": "Margenes de Error",
        "question": "Dato técnico sobre etilómetros",
        "content": "Los etilómetros evidenciales tienen un margen de error máximo permitido (EMP). Según la Orden ICT/155/2020, se debe aplicar un margen a favor del reo. Habitualmente es del 7,5% en aparatos en servicio para tasas superiores a 0,40 mg/l.",
        "source": "Orden ICT/155/2020 / Circular Fiscalía"
    },
    {
        "type": "FAQ",
        "category": "Juicio Rápido",
        "question": "¿Qué beneficio tiene la conformidad?",
        "content": "La conformidad (reconocer hechos) en el juicio rápido supone la reducción automática de un tercio (1/3) de la condena solicitada, tanto en multa como en tiempo de retirada.",
        "source": "Art 801 LECrim"
    },
    // Block 3
    {
        "type": "FAQ",
        "category": "Tasas Especiales",
        "question": "¿Existe una tasa específica para conductores menores de edad?",
        "content": "Sí. Según el Art. 14 de la Ley de Seguridad Vial, los conductores menores de edad no pueden circular con una tasa superior a 0,0 miligramos de alcohol por litro de aire espirado o 0,0 gramos por litro de sangre. Es una política de tolerancia cero absoluta.",
        "source": "Art. 14 LSV, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Sujeto Activo",
        "question": "Responsabilidad en vehículos de aprendizaje (Autoescuelas)",
        "content": "En vehículos que circulen en función de aprendizaje de la conducción, tiene la consideración legal de conductor la persona que está a cargo de los mandos adicionales (el profesor), no el alumno. Por tanto, el profesor es el sujeto imputable en un control de alcoholemia.",
        "source": "Anexo I RDL 6/2015, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Exenciones y Salud",
        "question": "¿Puede el uso de un inhalador para el asma dar un falso positivo?",
        "content": "Ciertos estudios y jurisprudencia reconocen que los inhaladores en aerosol pueden producir lecturas positivas en el etilómetro durante los primeros 10 minutos tras su aplicación, incluso sin excipiente alcohólico. Por ello es vital respetar el tiempo de espera reglamentario de 10 minutos entre pruebas.",
        "source": "Sentencia AP Ourense 395/2017, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Garantías del Proceso",
        "question": "¿Qué ocurre si ha pasado mucho tiempo entre el accidente y la prueba?",
        "content": "Si existe un lapso de tiempo excesivo (ej. más de una hora) entre la conducción y el requerimiento, el tribunal puede absolver al conductor. Se considera que el principio de tipicidad exige que el sujeto 'acabara de conducir' para que el resultado sea vinculante con el hecho de la circulación.",
        "source": "Sentencia AP Cádiz 1304/2017, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Procedimiento Policial",
        "question": "Pruebas específicas de atención y concentración en el Acta de Signos",
        "content": "El acta de signos externos incluye pruebas psicofísicas de precisión como: contar de 20 a 0 hacia atrás de tres en tres (20, 17, 14...), o identificar letras específicas en una serie leída por el agente (ej. dar un golpe cada vez que se oiga la letra 'A'). Fallar en 2 o más se considera prueba no superada.",
        "source": "Acta de Signos Externos, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Suspensión de Pena",
        "question": "¿Qué es el dispositivo 'Alcolock' y cómo afecta a la condena?",
        "content": "Tras la reforma de 2015, el uso del Alcolock (dispositivo de bloqueo de arranque mediante aire espirado) puede imponerse como una regla de conducta del Art. 83 CP vinculada a la suspensión de la pena de prisión en delitos contra la seguridad vial.",
        "source": "Art. 83 CP, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Defensa Técnica",
        "question": "¿Es posible alegar imposibilidad física para soplar?",
        "content": "Sí. Según el Art. 22.2 RGCir, se exime de la prueba del etilómetro a quienes sufran dolencias o enfermedades (ej. insuficiencias respiratorias graves o traqueotomía) cuya gravedad impida la práctica. En estos casos, el personal médico decidirá las pruebas clínicas alternativas (sangre u orina).",
        "source": "Art. 22.2 RGCir, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Responsabilidad Civil",
        "question": "Plazo de prescripción de la acción de repetición de la aseguradora",
        "content": "La facultad de la aseguradora para reclamar al conductor el importe de las indemnizaciones pagadas a terceros tras una condena por alcoholemia prescribe transcurrido un año desde la fecha en que se hizo el pago efectivo al perjudicado.",
        "source": "Art. 10 LRCSCVM, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Tipos de Vehículos",
        "question": "¿Se puede cometer delito de alcoholemia en un patinete eléctrico (VMP)?",
        "content": "Los patinetes eléctricos que no superan los 25 km/h no tienen la consideración de vehículo a motor. Por tanto, dar positivo en ellos conlleva sanción administrativa (multa), pero no delito penal del Art. 379, ya que el Código Penal exige conducir un 'vehículo de motor o ciclomotor'.",
        "source": "STS 120/2022, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Costas y Recursos",
        "question": "¿Cuánto cuesta recurrir una sentencia de alcoholemia ante la Audiencia?",
        "content": "Un recurso de apelación en 2025 tiene un coste adicional de honorarios profesionales que oscila entre los 500€ y 800€. Si el caso llega excepcionalmente al recurso de casación ante el Tribunal Supremo, los honorarios pueden subir entre 1.200€ y 2.000€.",
        "source": "Benchmarks Honorarios 2025, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Causas de Exención",
        "question": "¿Puede la adicción grave servir de atenuante?",
        "content": "Sí. El Art. 21.2 CP prevé como atenuante actuar por causa de una grave adicción a bebidas alcohólicas o drogas. Debe acreditarse una dependencia que nuble las capacidades del sujeto, aunque no llegue a anularlas por completo (lo que derivaría en eximente).",
        "source": "Art. 21.2 CP, Pasajes"
    },
    {
        "type": "ATOMIC_FACT",
        "category": "Metrología y Redondeo",
        "question": "Tasa real para imputación penal considerando el redondeo",
        "content": "Debido a la doctrina del redondeo (STS 788/2023), una tasa de 0,65 mg/l medida por el etilómetro se considera atípica (0,60 mg/l corregido). Para que la imputación penal por tasa objetiva sea segura e inatacable, el aparato debe arrojar un resultado igual o superior a 0,66 mg/l.",
        "source": "Oficio Fiscalía / STS 788/2023, Pasajes"
    },
    {
        "type": "FAQ",
        "category": "Derechos Procesales",
        "question": "¿Se puede usar el análisis de sangre terapéutico como prueba de cargo?",
        "content": "Sí, pero es controvertido. Si se extrae sangre por motivos médicos tras un accidente, el juez puede ordenar el análisis de los tóxicos. Sin embargo, si la resolución judicial no está motivada o no hay consentimiento previo para fines legales, puede impugnarse por vulnerar el derecho a la intimidad.",
        "source": "STC 40/2024, Pasajes"
    }
];

export function getKnowledgeByCategory(categoryFilter: string) {
    return LEGAL_KNOWLEDGE.filter(k =>
        k.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        k.question.toLowerCase().includes(categoryFilter.toLowerCase())
    );
}
