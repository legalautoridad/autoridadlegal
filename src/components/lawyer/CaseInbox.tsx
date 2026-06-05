'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Phone, 
    CheckCircle, 
    Clock, 
    FileText, 
    User, 
    Briefcase, 
    Users, 
    AlertCircle, 
    MapPin, 
    Tag, 
    Calendar, 
    Gavel, 
    AlertTriangle, 
    ShieldAlert, 
    CreditCard, 
    Smartphone,
    Save,
    ChevronRight,
    Circle,
    XCircle,
    Mail,
    MessageSquare,
    History,
    Inbox,
    Trash2,
    Check,
    Edit3,
    Euro,
    Globe
} from 'lucide-react'
import { confirmCaseContact, updateCase, cancelCase } from '@/lib/actions/lawyer'

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
    observations?: string
    notes?: string
    // Snapshot fields
    incident_type?: string
    incident_date_time?: string
    judicial_district?: string
    priors?: boolean
    priors_details?: string
    concerns?: string
    calculated_price?: number
    chosen_quota?: string
    dependents?: string
    income_data?: string
    has_citation?: boolean
    work_status?: string
    needs_license_for_work?: boolean
    contact_date_time?: string
    jail?: boolean
    rate?: string
    citation_date_time?: string
    systemin?: string
}

interface CaseInboxProps {
    activeCases: Case[],
    historicalCases: Case[],
    isActive?: boolean
}

// Utility for Spanish Date Format (DD/MM/YYYY HH:mm AM/PM)
// Normalized to avoid hydration mismatch by using a mounted check in the component or manual formatting
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
        hours = hours ? hours : 12 // the hour '0' should be '12'
        const hStr = hours.toString().padStart(2, '0')

        return `${day}/${month}/${year} ${hStr}:${minutes} ${ampm}`
    } catch (e) {
        return dateString
    }
}

// Format ISO/Date string for datetime-local input (YYYY-MM-DDTHH:mm)
const formatForInput = (dateString: string | null | undefined) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''
        
        const pad = (n: number) => n.toString().padStart(2, '0')
        const y = date.getFullYear()
        const m = pad(date.getMonth() + 1)
        const d = pad(date.getDate())
        const h = pad(date.getHours())
        const min = pad(date.getMinutes())
        
        return `${y}-${m}-${d}T${h}:${min}`
    } catch (e) {
        return ''
    }
}

export function CaseInbox({ activeCases, historicalCases, isActive = true }: CaseInboxProps) {
    const [currentTab, setCurrentTab] = useState<'active' | 'history'>('active')
    const displayCases = currentTab === 'active' ? activeCases : historicalCases
    
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (displayCases.length > 0 && !selectedCaseId) {
            setSelectedCaseId(displayCases[0].id)
        }
    }, [currentTab, displayCases.length, selectedCaseId])

    const selectedCase = displayCases.find(c => c.id === selectedCaseId)

    if (!mounted) return <div className="h-[600px] bg-white rounded-2xl animate-pulse" />

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    Gestión de Casos
                </h2>
                
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setCurrentTab('active')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentTab === 'active' 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Inbox className="w-4 h-4" />
                        ACTIVOS ({activeCases.length})
                    </button>
                    <button
                        onClick={() => setCurrentTab('history')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentTab === 'history' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        HISTORIAL ({historicalCases.length})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[700px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {displayCases.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400 font-medium">No hay casos en esta sección</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {displayCases.map((c) => (
                                <motion.button
                                    key={c.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                        selectedCaseId === c.id
                                            ? currentTab === 'active' 
                                                ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200 shadow-sm'
                                                : 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                c.status.startsWith('CLOSED') ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {c.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {formatSpanishDate(c.created_at)}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 truncate">
                                            {c.client_name || 'Cliente Anónimo'}
                                        </h4>
                                        <div className="flex items-center text-xs text-slate-500 gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{c.client_city}</span>
                                        </div>
                                        {c.citation_date_time && (
                                            <div className="flex items-center text-[10px] text-amber-600 font-bold gap-1 mt-1 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                                                <Calendar className="w-3 h-3" />
                                                Citación: {formatSpanishDate(c.citation_date_time, true)}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${
                                        selectedCaseId === c.id ? 'translate-x-1 text-emerald-500' : 'text-slate-300 group-hover:translate-x-1'
                                    }`} />
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedCase ? (
                            <CaseDetail key={selectedCase.id} caseData={selectedCase} isActive={isActive} />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">Selecciona un caso para ver los detalles</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

function CaseDetail({ caseData, isActive }: { caseData: Case, isActive: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [hasChanges, setHasChanges] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        client_name: caseData.client_name || '',
        client_phone: caseData.client_phone || '',
        client_email: caseData.client_email || '',
        client_city: caseData.client_city || '',
        status: caseData.status,
        observations: caseData.observations || '',
        incident_type: caseData.incident_type || '',
        incident_date_time: caseData.incident_date_time || '',
        judicial_district: caseData.judicial_district || '',
        jail: !!caseData.jail,
        priors: !!caseData.priors,
        priors_details: caseData.priors_details || '',
        work_status: caseData.work_status || '',
        needs_license_for_work: !!caseData.needs_license_for_work,
        income_data: caseData.income_data || '',
        dependents: caseData.dependents || '',
        chosen_quota: caseData.chosen_quota || '',
        rate: caseData.rate || '',
        citation_date_time: caseData.citation_date_time || '',
        systemin: caseData.systemin || 'Web'
    })

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setHasChanges(true)
    }

    const handleSave = () => {
        if (!isActive) return
        startTransition(async () => {
            try {
                // Clean data: convert empty strings to null for date fields
                const cleanedData = {
                    ...formData,
                    incident_date_time: formData.incident_date_time || null,
                    citation_date_time: formData.citation_date_time || null,
                    contact_date_time: (formData as any).contact_date_time || null,
                }
                await updateCase(caseData.id, cleanedData)
                setHasChanges(false)
                setIsEditing(false)
            } catch (err: any) {
                alert(err.message || 'Error al actualizar el caso')
            }
        })
    }

    const handleCancel = () => {
        if (!isActive) return
        if (confirm('¿Estás seguro de que quieres cancelar este caso? Volverá a estar disponible como lead para otros abogados.')) {
            startTransition(async () => {
                try {
                    await cancelCase(caseData.id)
                } catch (err: any) {
                    alert(err.message || 'Error al cancelar el caso')
                }
            })
        }
    }

    const getStatusColor = (s: string) => {
        switch(s) {
            case 'OPEN': return 'bg-emerald-100 text-emerald-700'
            case 'CLOSED_FINISHED': return 'bg-blue-100 text-blue-700'
            case 'CLOSED_REJECTED': return 'bg-red-100 text-red-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden h-full flex flex-col"
        >
            {/* HEADER */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <div className="relative group/status">
                            <button 
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-transparent hover:border-slate-300 ${getStatusColor(formData.status)}`}
                            >
                                {formData.status === 'OPEN' && <Circle className="w-3 h-3 fill-emerald-500" />}
                                {formData.status === 'CLOSED_FINISHED' && <CheckCircle className="w-3 h-3" />}
                                {formData.status === 'CLOSED_REJECTED' && <XCircle className="w-3 h-3" />}
                                {formData.status.replace('_', ' ')}
                            </button>
                            
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 p-1">
                                <button onClick={() => handleChange('status', 'OPEN')} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-2"><Circle className="w-3 h-3 fill-emerald-500" /> CASO ABIERTO</button>
                                <button onClick={() => handleChange('status', 'CLOSED_FINISHED')} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center gap-2"><CheckCircle className="w-3 h-3 text-blue-500" /> CERRADO FINALIZADO</button>
                                <button onClick={() => handleChange('status', 'CLOSED_REJECTED')} className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-lg flex items-center gap-2"><XCircle className="w-3 h-3 text-red-500" /> CERRADO RECHAZADO</button>
                            </div>
                        </div>

                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {formatSpanishDate(caseData.created_at, true)}
                        </span>
                        
                        <span className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            Origen: {formData.systemin}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input 
                                value={formData.client_name}
                                onChange={(e) => handleChange('client_name', e.target.value)}
                                className="text-2xl font-black text-slate-900 bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                            />
                        ) : (
                            <h3 className="text-2xl font-black text-slate-900">{formData.client_name || 'Cliente'}</h3>
                        )}
                        <button onClick={() => setIsEditing(!isEditing)} className="p-1 text-slate-400 hover:text-emerald-500 transition-colors">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Honorarios</p>
                        <p className="text-xl font-black text-slate-900">{caseData.honorarios}€</p>
                    </div>
                    
                    {formData.status === 'OPEN' && (
                        <button
                            onClick={handleCancel}
                            disabled={isPending || !isActive}
                            title="Cancelar y liberar lead"
                            className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-90 shadow-sm"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}

                    <a href={`tel:${formData.client_phone}`} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all active:scale-90 shadow-md">
                        <Phone className="w-6 h-6" />
                    </a>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-8 flex-1 space-y-10 overflow-y-auto bg-white">
                
                {/* OBSERVATIONS */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Observaciones del Abogado
                        </h4>
                        {hasChanges && <span className="text-[10px] font-black text-amber-500 uppercase animate-pulse">Cambios sin guardar</span>}
                    </div>
                    <div className="relative">
                        <textarea
                            value={formData.observations}
                            onChange={(e) => handleChange('observations', e.target.value)}
                            placeholder="Añade observaciones sobre el progreso del caso..."
                            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none font-medium"
                        />
                        {hasChanges && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                onClick={handleSave} disabled={isPending}
                                className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                            >
                                {isPending ? <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="w-4 h-4" />}
                                GUARDAR CAMBIOS
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* EDITABLE DETAILS SECTIONS */}
                <div className="space-y-8">
                    {/* SECTION: INCIDENT */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Gavel className="w-3 h-3" /> Detalles del Incidente
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
                            <EditField label="Tipo de Incidente" value={formData.incident_type} onChange={(v) => handleChange('incident_type', v)} icon={<Tag className="w-4 h-4" />} />
                            <DateEditField label="Fecha del Incidente" value={formData.incident_date_time} onChange={(v) => handleChange('incident_date_time', v)} icon={<Calendar className="w-4 h-4" />} />
                            <EditField label="Ciudad" value={formData.client_city} onChange={(v) => handleChange('client_city', v)} icon={<MapPin className="w-4 h-4" />} />
                            <EditField label="Partido Judicial" value={formData.judicial_district} onChange={(v) => handleChange('judicial_district', v)} icon={<Gavel className="w-4 h-4" />} />
                            <ToggleField label="Calabozo" value={formData.jail} onChange={(v) => handleChange('jail', v)} icon={<AlertTriangle className="w-4 h-4" />} />
                            <ToggleField label="Antecedentes" value={formData.priors} onChange={(v) => handleChange('priors', v)} icon={<ShieldAlert className="w-4 h-4" />} />
                            <div className="col-span-2">
                                <EditField label="Detalles Antecedentes" value={formData.priors_details} onChange={(v) => handleChange('priors_details', v)} icon={<ShieldAlert className="w-4 h-4" />} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION: PERSONAL */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Users className="w-3 h-3" /> Situación Personal
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
                            <EditField label="Situación Laboral" value={formData.work_status} onChange={(v) => handleChange('work_status', v)} icon={<Briefcase className="w-4 h-4" />} />
                            <EditField label="Ingresos" value={formData.income_data} onChange={(v) => handleChange('income_data', v)} icon={<Mail className="w-4 h-4" />} />
                            <EditField label="Personas a cargo" value={formData.dependents} onChange={(v) => handleChange('dependents', v)} icon={<Users className="w-4 h-4" />} />
                            <ToggleField label="Necesita carnet para trabajar" value={formData.needs_license_for_work} onChange={(v) => handleChange('needs_license_for_work', v)} icon={<Smartphone className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* SECTION: CITATION & QUOTA */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> Citación y Cuotas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
                            <EditField label="Cuota Elegida" value={formData.chosen_quota} onChange={(v) => handleChange('chosen_quota', v)} icon={<CreditCard className="w-4 h-4" />} />
                            <EditField label="Tasa" value={formData.rate} onChange={(v) => handleChange('rate', v)} icon={<Tag className="w-4 h-4" />} />
                            <DateEditField label="Fecha de Citación" value={formData.citation_date_time} onChange={(v) => handleChange('citation_date_time', v)} icon={<Clock className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Smartphone className="w-3 h-3" /> Información de Contacto
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EditField label="Teléfono" value={formData.client_phone} onChange={(v) => handleChange('client_phone', v)} icon={<Phone className="w-4 h-4" />} />
                            <EditField label="Email" value={formData.client_email} onChange={(v) => handleChange('client_email', v)} icon={<Mail className="w-4 h-4" />} />
                        </div>
                    </div>
                </div>

                {/* AI SUMMARY */}
                {caseData.ai_summary && (
                    <div className="space-y-3 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" /> Resumen AI Inicial
                        </h4>
                        <p className="text-sm text-slate-500 italic leading-relaxed">"{caseData.ai_summary}"</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

function EditField({ label, value, onChange, icon, type = 'text' }: { label: string, value: any, onChange: (v: any) => void, icon: any, type?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {icon} {label}
            </label>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
        </div>
    )
}

// Special Field for Dates with Calendar Widget and Spanish Format
function DateEditField({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon: any }) {
    const displayValue = formatSpanishDate(value, true)
    const inputValue = formatForInput(value)

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {icon} {label}
            </label>
            <div className="relative">
                {/* Visible Formatted Text */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
                        {displayValue}
                    </span>
                </div>
                {/* Hidden Input that triggers the native widget */}
                <input 
                    type="datetime-local"
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value
                        if (val) {
                            // Convert back to ISO for DB
                            onChange(new Date(val).toISOString())
                        } else {
                            onChange('')
                        }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-transparent focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[38px] cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}

function ToggleField({ label, value, onChange, icon }: { label: string, value: boolean, onChange: (v: boolean) => void, icon: any }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {icon} {label}
            </label>
            <button 
                onClick={() => onChange(!value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                    value 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
            >
                {value ? 'SÍ' : 'NO'}
                <div className={`w-4 h-4 rounded-full border-2 ${value ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-100 border-slate-300'}`} />
            </button>
        </div>
    )
}
