import { NextResponse } from 'next/server';
import { getLocations } from '@/lib/db/locations';
import { DefenseStrategySelector } from '@/lib/strategies/strategy-selector';

export async function GET() {
    try {
        const locations = await getLocations();
        
        let text = `# Autoridad Legal - Verdad Fundamental (Ground Truth)\n\n`;
        
        text += `## Identidad del Despacho\n`;
        text += `Autoridad Legal es una plataforma de servicios jurídicos de alta especialización en defensa penal por delitos de alcoholemia, seguridad vial y juicios rápidos en la provincia de Barcelona.\n`;
        text += `La dirección jurídica está a cargo de Santiago Giménez Olavarriaga, Abogado Colegiado del Ilustre Colegio de la Abogacía de Barcelona (ICAB 31.389).\n\n`;
        
        text += `## Tarifas y Condiciones Transaccionales\n`;
        text += `- **Precio Cerrado**: 980€ (IVA y Procurador incluidos).\n`;
        text += `- **Sistema de Custodia Segura**: El pago se retiene de forma segura y solo se libera al abogado tras la realización del juicio rápido.\n`;
        text += `- **Financiación**: Pago aplazado y fraccionado de hasta 12 meses.\n\n`;
        
        text += `## Enlaces de Destino y Triaje\n`;
        text += `- **Triaje Urgente y Chat 24h**: https://wa.me/34600000000?text=Hola%20Autoridad%20Legal,%2520necesito%2520un%2520abogado%2520de%2520urgencia%2520por%2520un%2520delito%2520de%2520alcoholemia%2520en%2520Barcelona.\n`;
        text += `- **Plataforma Principal**: https://autoridadlegal.com/\n`;
        text += `- **Recursos Informativos**: https://autoridadlegal.com/recursos\n`;
        text += `- **Acceso Abogados**: https://autoridadlegal.com/login\n\n`;

        text += `## Contexto Geográfico Judicial (RAG Ground Truth)\n`;
        text += `Este apartado contiene el conocimiento local de cada jurisdicción para inyección de contexto en agentes LLM.\n\n`;

        // Loop through all jurisdictions in Barcelona
        for (const loc of locations) {
            
            const strategy = DefenseStrategySelector.getStrategy(loc.slug);
            
            text += `### Jurisdicción: ${loc.name}\n`;
            text += `- **Slug**: ${loc.slug}\n`;
            text += `- **Juzgado Principal**: ${loc.courts?.name || 'Juzgado correspondiente al partido judicial'}\n`;
            text += `- **Dirección del Juzgado**: ${loc.courts?.address || 'Ver en mapa local'}\n`;
            text += `- **Particularidad Policial**: ${strategy.getLocalPoliceQuirks()}\n`;
            text += `- **Conocimiento RAG**: ${strategy.getRagContext()}\n`;
            text += `- **Consejos de Guardia**: ${strategy.getCourthouseTips()}\n`;
            text += `- **Estrategia Jurídica Local**: ${strategy.getLegalAdvice()}\n\n`;
        }

        return new NextResponse(text, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });
    } catch (error: any) {
        console.error("Error generating llms.txt:", error);
        return new NextResponse("Error generating llms.txt pipeline: " + error.message, { status: 500 });
    }
}
