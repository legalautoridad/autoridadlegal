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

    return (
        <div className="min-h-screen pb-20">

            {/* 1. TOP: Sticky Wallet Header */}
            <WalletHeader balance={balance} isActive={isActive} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

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

                        {/* Future: Stats Widget */}
                        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 opacity-50">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">Tus Estadísticas</h3>
                    <p className="text-xs text-gray-400 mt-2">Próximamente...</p>
                </div> */}
                    </div>

                </div>

            </main>
        </div>
    )
}
