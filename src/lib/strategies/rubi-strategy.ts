import { DefenseStrategy } from './defense-strategy';

export class RubiStrategy implements DefenseStrategy {
    getDistrictName(): string {
        return "Rubí";
    }

    getCitySlug(): string {
        return "rubi";
    }

    getLocalPoliceQuirks(): string {
        return "Policía Local de Rubí y Mossos d'Esquadra de la comisaría de Rubí. Controles frecuentes en la C-1413a, entradas a urbanizaciones y en las rotondas de acceso a la AP-7.";
    }

    getCourthouseTips(): string {
        return "Juzgados de Rubí en Plaça de la Constitució, s/n. Cuenta con 8 Juzgados de Primera Instancia e Instrucción. Tiempos de espera variables; la secretaría suele requerir acreditación de arraigo familiar y laboral si se solicita sustitución de trabajos por multa.";
    }

    getLegalAdvice(): string {
        return "En el partido judicial de Rubí, negociamos directamente con fiscalía para evitar la retirada prolongada de carné si se acredita que el vehículo es imprescindible para el trabajo, solicitando de forma anticipada la realización de Trabajos en Beneficio de la Comunidad.";
    }

    getEtilometroType(): string {
        return "Safir Evolution (etilómetro digital de precisión con margen de error certificado).";
    }

    getRagContext(): string {
        return "Rubí Judicial District (Partido Judicial 22) covers Rubí, Sant Cugat del Vallès, and Castellbisbal. Local police uses Safir Evolution devices. Case law in Rubí instruction courts 1-8 is strict on repeat offenders; prior administrative infractions are often factored into the prosecutor's penalty demand.";
    }
}
