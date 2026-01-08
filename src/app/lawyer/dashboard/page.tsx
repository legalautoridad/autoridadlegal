import { Suspense } from 'react'
import { getLawyerDashboardData } from '@/lib/actions/lawyer'
import { WalletHeader } from '@/components/lawyer/WalletHeader'
import { CaseInbox } from '@/components/lawyer/CaseInbox'
import { AvailabilityCalendar } from '@/components/lawyer/AvailabilityCalendar'

export const dynamic = 'force-dynamic'

export default async function LawyerDashboardPage() {
    // Fetch data on the server
    // If this throws (Unauthorized), Next.js error boundary catches it.
    const data = await getLawyerDashboardData()

    // Use default balance 0 if wallet not created yet (though logic implies it should exist)
    const balance = data.wallet?.balance ?? 0
    const isActive = data.wallet?.is_active ?? false
    // Default to false if verification data is missing (e.g. legacy users or incomplete onboarding)
    const isVerified = data.verification?.is_verified ?? false
    const verificationStatus = data.verification?.status || 'PENDING'

    return (
        <div className="min-h-screen pb-20 relative">

            {/* VERIFICATION OVERLAY */}
            {!isVerified && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                        <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
                                <span className="text-3xl">⏳</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cuenta en Verificación</h2>
                        <p className="text-slate-600 mb-6">
                            Tu perfil está siendo revisado por nuestro equipo de admisiones.
                            Estamos validando tu colegiación y seguro de RC.
                        </p>

                        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 mb-6 text-left space-y-2">
                            <div className="flex justify-between">
                                <span>Estado:</span>
                                <span className="font-semibold text-yellow-600">{verificationStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tiempo estimado:</span>
                                <span className="font-semibold text-slate-700">&lt; 24 horas</span>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button className="px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium">Contactar Soporte</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. TOP: Sticky Wallet Header */}
            <div className={!isVerified ? 'filter blur-sm pointer-events-none select-none' : ''}>
                <WalletHeader balance={balance} isActive={isActive} />
            </div>

            <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${!isVerified ? 'filter blur-sm pointer-events-none select-none' : ''}`}>

                {/* 2. GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Clean, Focused Inbox (Takes 2/3 width on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        <CaseInbox cases={data.cases} />
                    </div>

                    {/* RIGHT COLUMN: Utilities (Calendar, Stats, etc) */}
                    <div className="space-y-6">

                        {/* Availability Widget */}
                        <AvailabilityCalendar blockedDates={data.availability} />
                    </div>

                </div>

            </main>
        </div>
    )
}
