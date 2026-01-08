'use client';

import { useState, useEffect } from 'react';
import { Lock, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lead } from '@/types'; // Use Global Type

export interface Lawyer {
    id: string;
    tier: 'founder' | 'premium' | 'standard';
    cooldown_expires_at?: string | null;
}

interface LeadCardProps {
    lead: Lead;
    lawyer: Lawyer;
    onAccept: (leadId: string) => void;
    isOwned?: boolean;
    isLoading?: boolean;
}

export function LeadCard({ lead, lawyer, onAccept, isOwned, isLoading }: LeadCardProps) {
    const isPlatinum = lead.amount_paid > 0;

    if (isOwned) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mb-2">
                            ✅ CASO ACTIVO
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{lead.customer_name}</h3>
                        <p className="text-sm text-slate-500 font-mono">{lead.customer_phone}</p>
                        <p className="text-sm text-slate-500 font-mono">{lead.customer_email}</p>
                        <p className="text-sm text-slate-900 mt-1 font-medium">{lead.vertical} en {lead.city}</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-indigo-600">{lead.agreed_price}€</span>
                        <span className="text-xs text-slate-400">Honorarios</span>
                    </div>
                </div>
                <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm">
                    VER DETALLES COMPLETOS
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    {isPlatinum ? (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                💎 PLATINO (Reservado)
                            </span>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                50€ Pagados
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                🥈 PLATA (Interesado)
                            </span>
                        </div>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        {lead.vertical === 'alcoholemia' && '🍷'}
                        Alcoholemia en {lead.city}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-md line-clamp-2">
                        {lead.ai_summary || "Sin resumen disponible."}
                    </p>
                </div>
                <div className="text-right">
                    <span className="block text-xl font-bold text-slate-600">{lead.agreed_price}€</span>
                    <span className="text-xs text-slate-400">Valor Caso</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
                    <span>Precio de desbloqueo:</span>
                    <span className="font-bold text-slate-900 text-lg">{lead.unlock_price}€</span>
                </div>

                <button
                    onClick={() => onAccept(lead.id)}
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                >
                    {isLoading ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <Zap className="w-4 h-4 fill-current" />
                    )}
                    {isLoading ? "PROCESANDO..." : `DESBLOQUEAR POR ${lead.unlock_price}€`}
                </button>
            </div>
        </div>
    );
}
