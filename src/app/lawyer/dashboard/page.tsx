import { Suspense } from 'react'
import { getLawyerDashboardData } from '@/lib/actions/lawyer'
import { WalletHeader } from '@/components/lawyer/WalletHeader'
import { CaseInbox } from '@/components/lawyer/CaseInbox'
import { AvailabilityCalendar } from '@/components/lawyer/AvailabilityCalendar'
import { ShieldAlert } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LawyerDashboardPage() {
    // Fetch data on the server
    // If this throws (Unauthorized), Next.js error boundary catches it.
    const data = await getLawyerDashboardData()

    // Use default balance 0 if wallet not created yet (though logic implies it should exist)
    const balance = data.wallet?.balance ?? 0
    // Default to false if verification data is missing (e.g. legacy users or incomplete onboarding)
    const isVerified = data.verification?.is_verified ?? false
    const verificationStatus = data.verification?.status || 'PENDING'

    /*
   * NEW: Read-Only Mode for Pending Users.
   * Instead of blocking, we show a banner and disable specific actions.
   */
    const isActive = isVerified;

    return (
        <div className="min-h-screen pb-20 relative bg-slate-50">

            {/* 1. WARNING BANNER FOR PENDING USERS */}
            {!isVerified && (
                <div className="bg-amber-50 border-b border-amber-200 p-4 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-700 mt-0.5">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 text-sm">Cuenta en Verificación</h3>
                            <p className="text-amber-800 text-sm mt-1">
                                Estamos validando tus credenciales colegiales (aprox. 24h).
                                Mientras tanto, puedes explorar el panel, pero <strong>no podrás recibir casos ni recargar saldo</strong> hasta ser aprobado.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Main Dashboard (Not blurred anymore) */}
            <div>
                <WalletHeader balance={balance} isActive={isActive} />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 2. GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Clean, Focused Inbox (Takes 2/3 width on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        <CaseInbox cases={data.cases} isActive={isActive} />
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
