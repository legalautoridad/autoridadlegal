import { AUTHORS } from "./authors";

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Simplified for now, can remain HTML string
    authorId: string;
    category: 'alcoholemia' | 'herencias' | 'accidentes';
    publishedAt: string;
    image: string;
}

export const ARTICLES: Article[] = [
    // Alcoholemia
    {
        slug: "juicio-rapido-alcoholemia-guia",
        title: "Juicio Rápido por Alcoholemia: Guía de Supervivencia 2025",
        excerpt: "¿Te han citado para un juicio rápido? Te explicamos paso a paso qué ocurrirá y cómo podemos reducir tu condena.",
        content: `
            <p>El juicio rápido por alcoholemia es un procedimiento penal diseñado para enjuiciar delitos contra la seguridad vial de forma inmediata.</p>
            <h2>¿Qué se considera delito?</h2>
            <p>Superar los 0,60 mg/l en aire espirado es automáticamente un delito penal.</p>
            <h3>¿Puedo salvar mi carné?</h3>
            <p>La negociación con el Fiscal es clave. Aceptando los hechos (Conformidad) se reduce la pena un tercio automáticamente.</p>
        `,
        authorId: "marc-valls",
        category: "alcoholemia",
        publishedAt: "2024-12-28",
        image: "https://placehold.co/600x400/1e293b/ffffff?text=Juicio+Rapido"
    },
    // Herencias
    {
        slug: "bloqueo-cuentas-bancarias-herencia",
        title: "Cómo Desbloquear las Cuentas Bancarias de un Fallecido",
        excerpt: "Guía paso a paso para herederos: certificado de defunción, últimas voluntades y la gestión con las entidades bancarias para disponer de los fondos.",
        content: `
            <p>Tras el fallecimiento, las entidades bancarias bloquean las cuentas por seguridad hasta que se acredite la condición de heredero.</p>
            <h2>Documentación Imprescindible</h2>
            <ul>
                <li>Certificado de Defunción</li>
                <li>Certificado de Últimas Voluntades</li>
                <li>Copia autorizada del Testamento</li>
            </ul>
        `,
        authorId: "sofia-herrera",
        category: "herencias",
        publishedAt: "2024-03-10",
        image: "https://placehold.co/600x400/1e293b/ffffff?text=Herencias"
    },
    // Accidentes
    {
        slug: "latigazo-cervical-indemnizacion",
        title: "Indemnización por Latigazo Cervical: Baremo 2024",
        excerpt: "¿Cuánto se paga por día de baja? Analizamos las claves para maximizar tu indemnización tras un alcance trasero, la lesión más común en tráfico.",
        content: `
            <p>El esguince cervical es difícil de demostrar objetivamente, lo que aprovechan las aseguradoras para ofrecer indemnizaciones a la baja.</p>
            <h2>El Baremo de Tráfico 2025</h2>
            <p>Es vital contar con un informe médico concluyente que vincule el accidente con la patología.</p>
        `,
        authorId: "marc-valls",
        category: "accidentes",
        publishedAt: "2024-12-15",
        image: "https://images.unsplash.com/photo-1574063462828-b0a2d5206013?auto=format&fit=crop&q=80&w=1000"
    }
];
