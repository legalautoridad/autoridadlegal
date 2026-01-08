export interface Author {
    id: string;
    name: string;
    role: string;
    image: string;
    linkedinUrl: string;
    barNumber: string; // Critical for E-E-A-T
}

export const AUTHORS: Author[] = [
    {
        id: "marc-valls",
        name: "Dr. Marc Valls",
        role: "Socio Director - Área Penal",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc&gender=male", // Placeholder
        linkedinUrl: "https://linkedin.com",
        barNumber: "Col. 12345 ICAB"
    },
    {
        id: "sofia-herrera",
        name: "Lic. Sofia Herrera",
        role: "Socia - Derecho Civil",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&gender=female", // Placeholder
        linkedinUrl: "https://linkedin.com",
        barNumber: "Col. 67890 ICAB"
    }
];
