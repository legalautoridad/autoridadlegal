import { DefenseStrategy } from './defense-strategy';

export class DefaultDefenseStrategy implements DefenseStrategy {
    private citySlug: string;
    private cityName: string;

    constructor(citySlug: string) {
        this.citySlug = citySlug;
        // Basic capitalization helper for name representation
        this.cityName = citySlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getDistrictName(): string {
        return this.cityName;
    }

    getCitySlug(): string {
        return this.citySlug;
    }

    getLocalPoliceQuirks(): string {
        return `Mossos d'Esquadra y Policía Local de ${this.cityName}. Controles preventivos habituales en accesos y cascos urbanos durante el fin de semana.`;
    }

    getCourthouseTips(): string {
        return `Juzgados de Primera Instancia e Instrucción competentes para ${this.cityName}. En el juzgado de guardia se tramitan las conformidades de juicios rápidos por delitos contra la seguridad vial.`;
    }

    getLegalAdvice(): string {
        return `Defensa penal para el delito de alcoholemia (artículo 379.2 del Código Penal) en ${this.cityName}. Analizaremos en detalle los tiempos de toma de muestras del alcoholímetro y el cumplimiento de los márgenes de error reglamentarios.`;
    }

    getEtilometroType(): string {
        return "Etilómetro evidencial homologado (Dräger o Safir).";
    }

    getRagContext(): string {
        return `Standard safety and traffic enforcement rules apply in the ${this.cityName} jurisdiction. Fast-track proceedings under Spanish LECrim Art. 795 are conducted at the corresponding judicial district's instruction courts. The prosecutor demands standard penalties under Art. 379.2 CP, subject to a 1/3 reduction on prompt guilty pleas.`;
    }
}
