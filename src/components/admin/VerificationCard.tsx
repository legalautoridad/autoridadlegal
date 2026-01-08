'use client';

import { useState } from 'react';
import { approveLawyer, rejectLawyer } from '@/lib/actions/admin';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';

interface Props {
    profile: {
        id: string;
        document_number: string;
        bar_association: string;
        bar_number: string;
        office_address: string;
        created_at: string;
        verification_status: string;
        // Auth data would be joined ideally, but keeping it simple
    };
}

export function VerificationCard({ profile }: Props) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        if (!confirm('¿Aprobar acceso a este abogado?')) return;
        setLoading(true);
        await approveLawyer(profile.id);
        setLoading(false);
    };

    const handleReject = async () => {
        if (!confirm('¿Rechazar acceso?')) return;
        setLoading(true);
        await rejectLawyer(profile.id);
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900">ID: {profile.id.slice(0, 8)}...</h3>
                    <div className="text-xs text-slate-500">Registrado: {new Date(profile.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-700`}>
                    {profile.verification_status}
                </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 mb-6">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="block text-xs text-slate-400 uppercase">Colegio</span>
                        <div className="font-medium">{profile.bar_association}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-400 uppercase">Nº Colegiado</span>
                        <div className="font-medium">{profile.bar_number}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-400 uppercase">Documento</span>
                        <div className="font-medium">{profile.document_number}</div>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-400 uppercase">Dirección</span>
                        <div className="font-medium truncate">{profile.office_address}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <a
                    href="https://www.abogacia.es/servicios-abogacia/censo-de-letrados/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs text-blue-600 hover:underline mb-2"
                >
                    <ExternalLink className="w-3 h-3" /> Buscar en Censo CGAE
                </a>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        <X className="w-4 h-4" /> Rechazar
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium transition-colors shadow-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Aprobar</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
