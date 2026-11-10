import Link from 'next/link';
import { formatDateSpanish } from '@/lib/date';

export { formatDateSpanish };

interface ReviewedByProps {
    date: string; // YYYY-MM-DD
    className?: string;
}

export function ReviewedBy({ date, className = 'text-slate-400' }: ReviewedByProps) {
    if (!date) return null;
    const formattedDate = formatDateSpanish(date);

    return (
        <div className={`text-xs sm:text-sm inline-flex flex-wrap items-center gap-1.5 ${className}`}>
            <span>Revisado por</span>
            <Link
                href="/abogados/santiago-gimenez-olavarriaga"
                className="font-semibold underline hover:text-[#ffe088] text-white transition-colors"
            >
                Santiago Giménez Olavarriaga, abogado (ICAB 31.389)
            </Link>
            <span>· Actualizado el {formattedDate}</span>
        </div>
    );
}
