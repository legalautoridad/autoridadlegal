import { createStaticClient } from '@/lib/supabase/server';

export interface HomepageFaq {
    id: string;
    position: number;
    category: 'marca' | 'servicio';
    service_slug: string | null;
    question: string;
    answer: string;
    created_at?: string;
}

export const FALLBACK_HOMEPAGE_FAQS: HomepageFaq[] = [
    {
        id: "99a97e67-29f7-45da-9508-300e18aa6c1a",
        position: 1,
        category: "marca",
        service_slug: null,
        question: "¿Cuánto cuesta defenderme?",
        answer: "El precio base para la defensa penal en juicio rápido con conformidad es de 680 € (procurador de los tribunales incluido sin coste adicional). Si concurren circunstancias específicas (conductor profesional, reincidencia, riesgo de prisión, asistencia urgente al detenido en comisaría o juicio sin conformidad), se aplican suplementos fijos comunicados previamente por escrito. Los tributos legalmente aplicables se liquidan y detallan formalmente en la hoja de encargo previa.",
    },
    {
        id: "702a1cbb-c805-49b1-bb33-de784dbba365",
        position: 2,
        category: "marca",
        service_slug: null,
        question: "¿Qué incluye el precio?",
        answer: "Incluye los honorarios profesionales completos del abogado penalista especialista en seguridad vial, los derechos de representación procesal del Procurador de los Tribunales (0 € adicionales) y toda la dirección del procedimiento urgente de guardia. Los tributos legalmente aplicables se liquidan y detallan formalmente en la hoja de encargo previa conforme a la nota informativa fiscal.",
    },
    {
        id: "bc015a56-e5ec-459a-9789-a6c4b78dfc0a",
        position: 3,
        category: "marca",
        service_slug: null,
        question: "¿Puedo pagar a plazos?",
        answer: "Sí, dispones de facilidades de financiación inmediata hasta en 12 meses. En caso de que la operación de financiación sea rechazada, aplicamos nuestro protocolo de salvamento 60/40: un 60% inicial para bloquear y activar el servicio urgente y el 40% restante a los 30 días.",
    },
    {
        id: "222536d0-a2e9-4333-b1b4-98a76179ef9c",
        position: 4,
        category: "marca",
        service_slug: null,
        question: "¿En cuánto tiempo me atiende un abogado?",
        answer: "Disponemos de un servicio de guardia 24/7. Tras activar tu solicitud, nos comprometemos a que un abogado especialista te contacte con la máxima urgencia, habitualmente en menos de 2 horas en horario laboral, o a primera hora del día si el incidente ocurre durante la madrugada.",
    },
    {
        id: "17969264-a65a-40ce-a744-add86284cdd2",
        position: 5,
        category: "marca",
        service_slug: null,
        question: "¿En qué municipios y juzgados actuáis?",
        answer: "Prestamos asistencia presencial de urgencia in situ en toda la provincia de Barcelona, ante los juzgados de guardia de sus 25 partidos judiciales, incluyendo la Ciutat de la Justícia, Badalona, L'Hospitalet de Llobregat, Sabadell, Terrassa y Rubí.",
    },
    {
        id: "f7f4546c-2c8d-4c87-8fe6-b8e63c6a5346",
        position: 6,
        category: "marca",
        service_slug: null,
        question: "¿Sois un despacho colegiado o un directorio?",
        answer: "Somos una firma jurídica colegiada dirigida por el letrado ejerciente Santiago Giménez Olavarriaga (colegiado ICAB nº 31.389). El pago de los honorarios queda retenido de forma segura en custodia y solo se libera al abogado asignado tras la celebración efectiva del juicio, con derecho a reembolso del importe si el abogado asignado no comparece.",
    },
    {
        id: "9477027e-41b6-4e2f-b650-00fe24d38e0a",
        position: 7,
        category: "servicio",
        service_slug: "alcoholemia",
        question: "¿Qué pasa si me niego a soplar?",
        answer: "La negativa a someterse a las pruebas de detección es un delito autónomo de desobediencia grave (artículo 383 del Código Penal). Conlleva de forma obligatoria penas de prisión de 6 a 12 meses y la privación del derecho a conducir de 1 a 4 años, una sanción penal significativamente más severa que la del propio positivo de alcoholemia ordinario.",
    },
    {
        id: "0a34d5db-1afb-4627-b525-839d0405dcc8",
        position: 8,
        category: "servicio",
        service_slug: "drogas",
        question: "¿Es delito conducir tras consumir drogas aunque no note efectos?",
        answer: "No de forma automática. La detección de sustancias en saliva acredita únicamente presencia, pero no influencia. Para que concurra delito penal, el atestado policial debe detallar síntomas objetivos de afectación psicológica o motora en la conducción. De lo contrario, se tramita como una infracción administrativa con multa de 1.000 € y detracción de 6 puntos. Autoridad Legal impugna de forma sistemática los atestados que equiparan la mera presencia residual con la influencia.",
    },
    {
        id: "ba27e434-79df-475f-8382-af4b16c34d56",
        position: 9,
        category: "servicio",
        service_slug: "velocidad",
        question: "¿A partir de qué velocidad es delito y no multa?",
        answer: "Se considera delito (artículo 379.1 del Código Penal) cuando el conductor excede el límite permitido en más de 60 km/h en vías urbanas o en más de 80 km/h en carreteras interurbanas. Cualquier exceso por debajo de estos umbrales objetivos se sanciona exclusivamente por vía administrativa ordinaria.",
    },
    {
        id: "da374330-fd4b-4188-b913-2a2b36f18648",
        position: 10,
        category: "servicio",
        service_slug: "sin-carnet",
        question: "¿Conducir sin carnet es delito o multa?",
        answer: "Es un delito penal contra la seguridad vial (artículo 384 del Código Penal) conducir tras haber perdido la totalidad del saldo de puntos de la DGT, por estar privado de licencia por mandamiento judicial, o por no haber obtenido jamás el carné. No obstante, circular con el permiso caducado por falta de renovación psicotécnica o poseer una licencia extranjera pendiente de homologar administrativa constituye únicamente una infracción de tráfico común.",
    },
    {
        id: "0e837405-8d27-406e-827d-96ee07754aeb",
        position: 11,
        category: "servicio",
        service_slug: "profesionales",
        question: "Si me retiran el carnet, ¿puedo seguir trabajando como transportista?",
        answer: "No. La pena de privación del derecho a conducir vehículos a motor impuesta en sentencia judicial firme es continua, absoluta e ininterrumpida las 24 horas del día. El ordenamiento penal español prohíbe de forma taxativa conceder licencias parciales o exenciones temporales para el ejercicio de actividades laborales o de reparto. Dado que perder el permiso puede habilitar a la empresa a un despido objetivo, nuestra firma valora agotar todas las vías de defensa —incluida la oposición en juicio ordinario cuando existe recorrido jurídico—, lo que además puede posponer la firmeza de la pena de privación del permiso mientras se resuelve el procedimiento.",
    },
];

export async function getHomepageFaqs(): Promise<HomepageFaq[]> {
    try {
        const supabase = createStaticClient();
        const { data, error } = await supabase
            .from('homepage_faqs')
            .select('*')
            .order('position', { ascending: true });

        if (error || !data || data.length === 0) {
            return FALLBACK_HOMEPAGE_FAQS;
        }

        return data as HomepageFaq[];
    } catch {
        return FALLBACK_HOMEPAGE_FAQS;
    }
}
