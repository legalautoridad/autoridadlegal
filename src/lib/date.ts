const MONTHS_ES = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
];

export function formatDateSpanish(dateStr: string): string {
    if (!dateStr) return '';
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
    if (match) {
        const day = parseInt(match[3], 10);
        const monthIndex = parseInt(match[2], 10) - 1;
        const year = match[1];
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${day} de ${MONTHS_ES[monthIndex]} de ${year}`;
        }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}
