'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, CheckCircle, Clock, FileText, User, Briefcase, Users, AlertCircle } from 'lucide-react'
import { confirmCaseContact } from '@/lib/actions/lawyer'

interface ClientProfile {
    job?: string
    salary?: number
    children?: number
    mortgage?: boolean
    family_situation?: string
    antecedents_description?: string
    [key: string]: any
}

interface Case {
    id: string
    client_name: string
    client_phone: string
    client_email?: string
    client_city: string
    honorarios: number
    status: string
    created_at: string
    ai_summary?: string
    client_profile?: ClientProfile
    notes?: string
}

interface CaseInboxProps {
    cases: Case[],
    isActive?: boolean
}

export function CaseInbox({ cases, isActive = true }: CaseInboxProps) {
    if (cases.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                <div className="mx-auto h-12 w-12 text-gray-300">
                    <CheckCircle className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin casos pendientes</h3>
                <p className="mt-1 text-sm text-gray-500">Relájate, te notificaremos cuando entre uno nuevo.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Bandeja de Entrada ({cases.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-10"> {/* 2 Columns for detailed cards */}
                <AnimatePresence>
                    {cases.map((c) => (
                        <CaseCard key={c.id} caseData={c} isActive={isActive} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

function CaseCard({ caseData, isActive }: { caseData: Case, isActive: boolean }) {
    const [isPending, startTransition] = useTransition()
    const isAssigned = caseData.status === 'ASSIGNED'
    const isContacted = caseData.status === 'CONTACTED'
    const profile = caseData.client_profile || {}

    const handleConfirmContact = () => {
        if (!isActive) return; // Guard clause
        startTransition(async () => {
            try {
                await confirmCaseContact(caseData.id)
            } catch (err) {
                alert('Error al confirmar contacto.')
                console.error(err)
            }
        })
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative overflow-hidden rounded-xl border-l-4 shadow-md bg-white p-6 flex flex-col justify-between ${isAssigned ? 'border-amber-400 ring-1 ring-black/5' : 'border-emerald-500'
                }`}
        >
            <div>
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${isAssigned ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                            }`}>
                            {isAssigned ? 'PENDIENTE CONTACTO' : 'CONTACTADO'}
                        </span>
                        <h3 className="mt-2 text-xl font-bold text-gray-900 leading-tight">
                            {caseData.client_name || 'Cliente Anónimo'}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <User className="w-3 h-3 mr-1" />
                            {caseData.client_city || 'Ubicación desconocida'}
                        </div>
                    </div>
                    <div className="text-right bg-gray-50 px-3 py-1 rounded-lg">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Honorarios</p>
                        <p className="text-lg font-bold text-gray-900">{caseData.honorarios}€</p>
                    </div>
                </div>

                {/* AI SUMMARY (High Priority) */}
                {caseData.ai_summary && (
                    <div className="mb-5 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Resumen del Caso (AI)
                        </h4>
                        <p className="text-sm text-gray-800 leading-relaxed font-medium">
                            {caseData.ai_summary}
                        </p>
                    </div>
                )}

                {/* PROFILE DATA (Grid) */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Perfil Personal</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {profile.job && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{profile.job} ({profile.salary}€)</span>
                            </div>
                        )}
                        {(profile.children !== undefined) && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{profile.children} hijos, {profile.family_situation}</span>
                            </div>
                        )}
                        {profile.antecedents_description && (
                            <div className="col-span-2 flex items-start gap-2 text-sm text-rose-600 bg-rose-50 p-2 rounded">
                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                <span className="font-medium">Antecedentes: {profile.antecedents_description}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* NOTES */}
                {caseData.notes && (
                    <div className="mb-6 p-3 bg-yellow-50 rounded border border-yellow-100 text-sm italic text-yellow-800">
                        📝 {caseData.notes}
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <a href={`tel:${caseData.client_phone}`} className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    Llamar: {caseData.client_phone}
                </a>

                {isAssigned && (
                    <button
                        onClick={handleConfirmContact}
                        disabled={isPending || !isActive}
                        className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${isActive
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                CONFIRMAR CONTACTO REALIZADO
                            </>
                        )}
                    </button>
                )}

                {isContacted && (
                    <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        <CheckCircle className="w-5 h-5" />
                        Estás gestionando este caso
                    </div>
                )}
            </div>
        </motion.div>
    )
}
