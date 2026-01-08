import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CreditBadge({ balance }: { balance: number }) {
    const isLow = balance < 50;

    return (
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <div className={cn(
                "p-2 rounded-full",
                isLow ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            )}>
                <Wallet className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Saldo Disponible</div>
                <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(balance)}
                </div>
            </div>
            {isLow && (
                <button className="ml-2 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    Recargar
                </button>
            )}
        </div>
    );
}
