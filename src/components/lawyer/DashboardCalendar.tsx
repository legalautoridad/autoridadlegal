'use client'

import { useState, useTransition, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalendarIcon, 
    Ban, 
    Tag, 
    Briefcase, 
    Clock, 
    MapPin, 
    Check,
    AlertCircle,
    X,
    Calendar
} from 'lucide-react'
import { toggleDayAvailability, claimLead } from '@/lib/actions/lawyer'

interface Lead {
    id: string
    name: string
    city: string
    calculated_price: number
    citation_date_time?: string
    incident_type?: string
}

interface Case {
    id: string
    client_name: string
    client_city: string
    citation_date_time?: string
    status: string
}

interface DashboardCalendarProps {
    leads: Lead[]
    cases: Case[]
    blockedDates: { blocked_date: string }[]
    isActive: boolean
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

export function DashboardCalendar({ leads, cases, blockedDates, isActive }: DashboardCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isPending, startTransition] = useTransition()
    const [selectedDateEvents, setSelectedDateEvents] = useState<{ type: 'lead' | 'case', data: any }[] | null>(null)
    const [claimingId, setClaimingId] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Data indexing for O(1) day lookup
    const blockedSet = useMemo(() => new Set(blockedDates.map(d => d.blocked_date)), [blockedDates])
    
    const eventsByDate = useMemo(() => {
        const map: Record<string, { type: 'lead' | 'case', data: any }[]> = {}
        
        leads.forEach(l => {
            if (l.citation_date_time) {
                const date = l.citation_date_time.split('T')[0]
                if (!map[date]) map[date] = []
                map[date].push({ type: 'lead', data: l })
            }
        })
        
        cases.forEach(c => {
            if (c.citation_date_time) {
                const date = c.citation_date_time.split('T')[0]
                if (!map[date]) map[date] = []
                map[date].push({ type: 'case', data: c })
            }
        })
        
        return map
    }, [leads, cases])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    const handleDayClick = (day: number, events: any[]) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        
        if (events.length > 0) {
            setSelectedDateEvents(events)
        } else {
            // If no events, toggle availability (old behavior)
            if (new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))) return;
            
            startTransition(async () => {
                try {
                    await toggleDayAvailability(dateStr)
                } catch (e) {
                    alert("Error al actualizar disponibilidad")
                }
            })
        }
    }

    const handleClaim = async (leadId: string) => {
        if (!isActive) return
        setClaimingId(leadId)
        startTransition(async () => {
            try {
                const res = await claimLead(leadId)
                if (res.success) {
                    setSelectedDateEvents(null)
                }
            } catch (err: any) {
                alert(err.message || "Error al reclamar lead")
            } finally {
                setClaimingId(null)
            }
        })
    }

    if (!mounted) return <div className="h-[400px] bg-white rounded-2xl animate-pulse" />

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* HEADER */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 leading-tight">Agenda Legal</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Citaciones y Disponibilidad</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-xs font-black text-slate-700 min-w-[100px] text-center uppercase tracking-tighter">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* CALENDAR BODY */}
            <div className="p-6">
                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-4">
                    {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d) => (
                        <div key={d} className="text-[10px] font-black text-slate-400 text-center tracking-widest py-2">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startingDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isBlocked = blockedSet.has(dateStr)
                        const dayEvents = eventsByDate[dateStr] || []
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
                        const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))

                        return (
                            <button
                                key={day}
                                onClick={() => handleDayClick(day, dayEvents)}
                                className={`
                                    relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border group
                                    ${isPast ? 'bg-slate-50 border-transparent' : 'hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'}
                                    ${!isPast && isBlocked ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}
                                    ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                                    ${dayEvents.length > 0 ? 'ring-1 ring-amber-200' : ''}
                                `}
                            >
                                <span className={`text-sm font-black ${isPast ? 'text-slate-300' : isBlocked ? 'text-rose-600' : 'text-slate-700'}`}>
                                    {day}
                                </span>

                                {/* INDICATORS */}
                                <div className="absolute bottom-2 flex gap-1">
                                    {isBlocked && <div className="w-1 h-1 rounded-full bg-rose-500" />}
                                    {dayEvents.map((e, idx) => (
                                        <div key={idx} className={`w-1 h-1 rounded-full ${e.type === 'lead' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    ))}
                                </div>
                                
                                {dayEvents.length > 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
                                        {dayEvents.length}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* LEGEND */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads Disponsibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mis Casos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bloqueado</span>
                    </div>
                </div>
            </div>

            {/* EVENT DRAWER/MODAL */}
            <AnimatePresence>
                {selectedDateEvents && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                    Citaciones del día
                                </h3>
                                <button onClick={() => setSelectedDateEvents(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                                {selectedDateEvents.map((event, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border ${event.type === 'lead' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${event.type === 'lead' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                    {event.type === 'lead' ? 'OPORTUNIDAD' : 'CASO ACTIVO'}
                                                </span>
                                                <h4 className="font-black text-slate-900 mt-1">{event.data.name || event.data.client_name}</h4>
                                            </div>
                                            {event.type === 'case' && (
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase">{event.data.status}</span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                {event.data.city || event.data.client_city}
                                            </div>
                                            {event.type === 'lead' && event.data.incident_type && (
                                                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                    {event.data.incident_type}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-slate-900 font-black">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(event.data.citation_date_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
                                            </div>
                                        </div>

                                        {event.type === 'lead' && (
                                            <button
                                                onClick={() => handleClaim(event.data.id)}
                                                disabled={claimingId === event.data.id || !isActive}
                                                className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                                            >
                                                {claimingId === event.data.id ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                RECLAMAR LEAD ({event.data.calculated_price}€)
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
