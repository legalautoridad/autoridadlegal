export interface DefenseStrategy {
    getDistrictName(): string;
    getCitySlug(): string;
    getLocalPoliceQuirks(): string; // Policing habits (Mossos, Guardia Urbana, local police, locations)
    getCourthouseTips(): string;     // Secret courthouse tips, delay details, specific judges
    getLegalAdvice(): string;        // Localized legal advice
    getEtilometroType(): string;     // Model of breathalyzer used in the district (e.g. Evidenzer, SAFIR)
    getRagContext(): string;         // Dedicated context injection for AI Search / LLM bots
}
