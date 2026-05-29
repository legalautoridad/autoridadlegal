import { LogOut, ShieldAlert } from 'lucide-react'
import { logoutLawyer } from '@/lib/actions/auth'
import { getLawyerDashboardData } from '@/lib/actions/lawyer'
import { WalletHeader } from '@/components/lawyer/WalletHeader'
import { CaseInbox } from '@/components/lawyer/CaseInbox'
import { LeadList } from '@/components/lawyer/LeadList'
import { DashboardCalendar } from '@/components/lawyer/DashboardCalendar'

export const dynamic = 'force-dynamic'

export default async function LawyerDashboardPage() {
    const data = await getLawyerDashboardData()

    const balance = data.wallet?.balance ?? 0
    const isActive = data.status.is_active
    const isVerified = data.verification?.is_verified ?? false

    return (
        <div className="min-h-screen pb-20 relative bg-slate-50">
            <div className="absolute top-6 right-6 z-[60]">
                <form action={logoutLawyer}>
                    <button
                        type="submit"
                        className="group flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-full hover:bg-slate-50 hover:border-red-100 hover:text-red-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </form>
            </div>

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

            <div>
                <WalletHeader balance={balance} isActive={isActive} isVerified={isVerified} profile={data.profile} />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <CaseInbox 
                            activeCases={data.activeCases} 
                            historicalCases={data.historicalCases} 
                            isActive={isActive} 
                        />
                        
                        <div className="border-t border-slate-200 pt-12">
                            <LeadList leads={data.leads} isActive={isActive} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* New Unified Legal Agenda Calendar */}
                        <DashboardCalendar 
                            leads={data.leads} 
                            cases={[...data.activeCases, ...data.historicalCases]} 
                            blockedDates={data.availability} 
                            isActive={isActive}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
