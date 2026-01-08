'use client';

import { useState } from 'react';
import { Lead } from '@/types';
import { LeadCard } from './LeadCard';
import { deleteTestLeads } from '@/lib/actions/leads'; // Import Server Action

interface DashboardViewProps {
    availableLeads: Lead[];
    myLeads: Lead[];
}

type Tab = 'marketplace' | 'my_cases';

export function DashboardView({ availableLeads, myLeads }: DashboardViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>('marketplace');
    const [loadingLeadId, setLoadingLeadId] = useState<string | null>(null);

    // Thunderdome Mock Data (Simulating a Founder)
    const currentLawyer = {
        id: 'me',
        tier: 'founder' as const,
        cooldown_expires_at: null
    };

    const handleAcceptLead = async (leadId: string, price: number) => {
        if (!confirm(`¿Confirmas el desbloqueo por ${price}€?`)) return;

        setLoadingLeadId(leadId);
        try {
            // Import dynamically to avoid server action issues in client component if not passed as prop
            // But better pattern: import at top if it's a server action marked 'use server'
            const { unlockLead } = await import('@/lib/actions/unlock-lead');
            const result = await unlockLead(leadId, price);

            if (result?.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert("¡Caso asignado con éxito! Ahora lo verás en 'Mis Casos'.");
            }
        } catch (e) {
            console.error(e);
            alert("Error al procesar la solicitud.");
        } finally {
            setLoadingLeadId(null);
        }
    };

    const handleCleanup = async () => {
        const { deleteTestLeads } = await import('@/lib/actions/leads');
        if (confirm("¿Borrar todos los leads de prueba? esto eliminará los datos generados por el checkout.")) {
            await deleteTestLeads();
            alert("Datos borrados. Recarga la página para ver cambios.");
        }
    };

    const leadsToShow = activeTab === 'marketplace' ? availableLeads : myLeads;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-serif">Gestión de Expedientes</h1>
                    <p className="text-slate-500">
                        {activeTab === 'marketplace' ? 'Oportunidades activas en tu zona' : 'Tus expedientes gestionados'}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={handleCleanup} className="text-xs text-red-400 hover:text-red-600 underline">
                        🗑️ Limpiar Datos
                    </button>
                    <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
                        <span className="text-slate-500">Tu Nivel:</span> <span className="text-amber-600 font-bold uppercase">{currentLawyer.tier}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('marketplace')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'marketplace'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Marketplace ({availableLeads.length})
                </button>
                <button
                    onClick={() => setActiveTab('my_cases')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'my_cases'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Mis Casos ({myLeads.length})
                </button>
            </div>

            {/* List */}
            <div className="grid md:grid-cols-2 gap-6">
                {leadsToShow.map(lead => (
                    <LeadCard
                        key={lead.id}
                        lead={lead}
                        lawyer={currentLawyer}
                        onAccept={() => handleAcceptLead(lead.id, lead.unlock_price)}
                        isOwned={activeTab === 'my_cases'}
                        isLoading={loadingLeadId === lead.id}
                    />
                ))}
            </div>

            {leadsToShow.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400">
                        {activeTab === 'marketplace'
                            ? 'No hay leads activos en este momento.'
                            : 'Aún no has aceptado ningún caso.'}
                    </p>
                </div>
            )}
        </div>
    );
}
