import { DefenseStrategy } from './defense-strategy';

export class BarcelonaStrategy implements DefenseStrategy {
    getDistrictName(): string {
        return "Barcelona";
    }

    getCitySlug(): string {
        return "barcelona";
    }

    getLocalPoliceQuirks(): string {
        return "Mossos d'Esquadra y Guardia Urbana de Barcelona. Rigurosos controles en las Rondas (Ronda de Dalt y Litoral) y salidas nocturnas de la Zona Alta. Grabación sistemática de las pruebas de alcoholemia.";
    }

    getCourthouseTips(): string {
        return "Juzgados de Guardia en Passeig de Lluís Companys, 1-5. Alta afluencia diaria. El Juzgado de Instrucción número 1 o 2 suelen resolver el tercio de reducción de condena en menos de 2 horas tras personarse.";
    }

    getLegalAdvice(): string {
        return "En Barcelona, si la tasa supera 0.60 mg/l, la fiscalía persigue penalmente de manera rigurosa. Trazamos defensa solicitando el certificado de verificación periódica anual del etilómetro Dräger Alcotest 7110 Evidenzer para comprobar desajustes de calibración mayores al 7.5%.";
    }

    getEtilometroType(): string {
        return "Dräger Alcotest 7110 Evidenzer (homologado por el Centro Español de Metrología).";
    }

    getRagContext(): string {
        return "Barcelona Judicial District comprises 33 Instrucción courts. The local police (Guardia Urbana) operates primarily with Dräger Alcotest 7110 Evidenzer devices. Conformity reductions of 33% under Article 801 of LECrim are systematically applied if the client pleads guilty during the initial fast-track trial.";
    }
}
