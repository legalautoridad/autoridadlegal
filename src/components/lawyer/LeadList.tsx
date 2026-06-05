'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Tag, 
    ChevronRight, 
    Calendar, 
    MapPin, 
    Clock, 
    Check, 
    AlertCircle,
    Smartphone,
    Mail,
    User,
    Users,
    Briefcase,
    ShieldAlert,
    CreditCard,
    Smartphone as SmartphoneIcon,
    X,
    Gavel,
    Euro
} from 'lucide-react'
import { claimLead } from '@/lib/actions/lawyer'

interface Lead {
    id: string
    name: string
    phone: string
    email?: string
    city: string
    work_status?: string
    incident_date_time?: string
    incident_type?: string
    needs_license_for_work?: boolean
    rate?: string
    judicial_district?: string
    citation_date_time?: string
    priors?: boolean
    priors_details?: string
    concerns?: string
    calculated_price?: number
    chosen_quota?: string
    dependents?: string
    income_data?: string
    has_citation?: boolean
    contact_date_time?: string
    jail?: boolean
    ai_summary?: string
    systemin?: string
}

interface LeadListProps {
    leads: Lead[]
    isActive?: boolean
}

// Manual formatting to avoid hydration mismatch (Intl spaces can vary)
const formatSpanishDate = (dateString: string | null | undefined, includeTime = false) => {
    if (!dateString) return 'No indicada'
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString
        
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        
        if (!includeTime) return `${day}/${month}/${year}`

        let hours = date.getHours()
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12 
        const hStr = hours.toString().padStart(2, '0')

        return `${day}/${month}/${year} ${hStr}:${minutes} ${ampm}`
    } catch (e) {
        return dateString
    }
}

export function LeadList({ leads, isActive = true }: LeadListProps) {
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (leads.length > 0 && !selectedLeadId) {
            setSelectedLeadId(leads[0].id)
        }
    }, [leads, selectedLeadId])

    const selectedLead = leads.find((l) => l.id === selectedLeadId)

    const handleClaim = (leadId: string) => {
        if (!isActive) return
        if (confirm('¿Quieres reclamar este lead? El coste se deducirá de tu saldo.')) {
            startTransition(async () => {
                try {
                    const res = await claimLead(leadId)
                    if (res.success) {
                        setSelectedLeadId(null)
                    }
                } catch (err: any) {
                    alert(err.message || 'Error al reclamar lead')
                }
            })
        }
    }

    if (!mounted) return <div className="h-[600px] bg-white rounded-2xl animate-pulse" />

    if (leads.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
                    <Users className="h-full w-full" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No hay leads disponibles</h3>
                <p className="mt-1 text-sm text-slate-500">Vuelve más tarde para ver nuevas oportunidades.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Oportunidades de Leads ({leads.length})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* LIST COLUMN */}
                <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[700px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    <AnimatePresence mode="popLayout">
                        {leads.map((lead) => (
                            <motion.button
                                key={lead.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedLeadId(lead.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                    selectedLeadId === lead.id
                                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700`}>
                                            NUEVO
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {formatSpanishDate(new Date().toISOString())}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 truncate">
                                        {lead.name || 'Cliente Potencial'}
                                    </h4>
                                    <div className="flex items-center text-xs text-slate-500 gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">{lead.city}</span>
                                    </div>
                                    {lead.citation_date_time && (
                                        <div className="flex items-center text-[10px] text-amber-600 font-bold gap-1 mt-1 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                                            <Calendar className="w-3 h-3" />
                                            Citación: {formatSpanishDate(lead.citation_date_time, true)}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${
                                    selectedLeadId === lead.id ? 'translate-x-1 text-indigo-500' : 'text-slate-300 group-hover:translate-x-1'
                                }`} />
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* DETAIL COLUMN */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedLead ? (
                            <motion.div
                                key={selectedLead.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden h-full flex flex-col"
                            >
                                {/* HEADER */}
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                Lead #1293
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {formatSpanishDate(new Date().toISOString())}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{selectedLead.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio del Lead</p>
                                        <p className="text-2xl font-black text-indigo-600">{selectedLead.calculated_price}€</p>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-8 flex-1 overflow-y-auto space-y-10">
                                    
                                    {/* SOURCE INFO */}
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <SmartphoneIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origen</p>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{selectedLead.systemin || 'Web'}</p>
                                        </div>
                                    </div>

                                    {/* GRID DETAILS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> Detalles del Incidente
                                            </h4>
                                            <div className="space-y-4">
                                                <DetailItem label="Tipo" value={selectedLead.incident_type} icon={<Tag className="w-4 h-4" />} />
                                                <DetailItem label="Fecha del Incidente" value={formatSpanishDate(selectedLead.incident_date_time, true)} icon={<Calendar className="w-4 h-4" />} />
                                                <DetailItem label="Ciudad" value={selectedLead.city} icon={<MapPin className="w-4 h-4" />} />
                                                <DetailItem label="Partido Judicial" value={selectedLead.judicial_district} icon={<Gavel className="w-4 h-4" />} />
                                                <DetailItem label="Calabozo" value={selectedLead.jail ? 'SÍ' : 'NO'} icon={<AlertCircle className="w-4 h-4" />} />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <User className="w-3 h-3" /> Situación del Cliente
                                            </h4>
                                            <div className="space-y-4">
                                                <DetailItem label="Trabajo" value={selectedLead.work_status} icon={<Briefcase className="w-4 h-4" />} />
                                                <DetailItem label="Ingresos" value={selectedLead.income_data} icon={<Mail className="w-4 h-4" />} />
                                                <DetailItem label="Personas a cargo" value={selectedLead.dependents} icon={<Users className="w-4 h-4" />} />
                                                <DetailItem label="Antecedentes" value={selectedLead.priors ? 'SÍ' : 'NO'} icon={<ShieldAlert className="w-4 h-4" />} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* CITATION INFO */}
                                    <div className="space-y-4 pt-6 border-t border-slate-100">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" /> Citación y Cuotas
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <DetailItem label="Fecha Citación" value={formatSpanishDate(selectedLead.citation_date_time, true)} icon={<Clock className="w-4 h-4" />} />
                                            <DetailItem label="Cuota Elegida" value={selectedLead.chosen_quota} icon={<CreditCard className="w-4 h-4" />} />
                                            <DetailItem label="Tasa" value={selectedLead.rate} icon={<Euro className="w-4 h-4" />} />
                                        </div>
                                    </div>

                                    {/* AI SUMMARY */}
                                    {selectedLead.ai_summary && (
                                        <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                                            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare className="w-3 h-3" /> Resumen de Inteligencia Artificial
                                            </h4>
                                            <p className="text-sm text-slate-600 italic leading-relaxed">
                                                "{selectedLead.ai_summary}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* FOOTER ACTIONS */}
                                <div className="p-6 border-t border-slate-100 bg-white">
                                    <button
                                        onClick={() => handleClaim(selectedLead.id)}
                                        disabled={isPending || !isActive}
                                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 ${
                                            isActive 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isPending ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                RECLAMAR ESTE CASO
                                            </>
                                        )}
                                    </button>
                                    {!isActive && (
                                        <p className="text-center text-[10px] text-rose-500 font-bold uppercase mt-3 animate-pulse">
                                            Debes estar ACTIVO para reclamar leads
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">Selecciona un lead para ver los detalles</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

function DetailItem({ label, value, icon }: { label: string, value?: string, icon: any }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
                <p className="text-sm font-bold text-slate-900">{value || 'No especificado'}</p>
            </div>
        </div>
    )
}

function MessageSquare({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    )
}
