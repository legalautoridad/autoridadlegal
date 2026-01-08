'use client'

import { useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import { toggleDayAvailability } from '@/lib/actions/lawyer'

interface AvailabilityCalendarProps {
    blockedDates: { blocked_date: string }[]
}

export function AvailabilityCalendar({ blockedDates }: AvailabilityCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isPending, startTransition] = useTransition()

    // Create a Set for O(1) lookups. Note: DB dates are YYYY-MM-DD
    const blockedSet = new Set(blockedDates.map(d => d.blocked_date))

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Adjust so Monday is 0

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleDayClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        // Prevent blocking past dates
        if (new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))) return;

        startTransition(async () => {
            try {
                await toggleDayAvailability(dateStr)
            } catch (e) {
                console.error(e)
                alert("Error al actualizar disponibilidad")
            }
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Ban className="w-5 h-5 text-rose-500" />
                    Control de Disponibilidad
                </h2>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium w-24 text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Haz clic en un día para <span className="font-bold text-rose-600">bloquearlo</span> si no puedes atender casos.
            </p>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <div key={d} className="text-xs font-bold text-gray-400 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 md:h-12" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isBlocked = blockedSet.has(dateStr)
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
                    const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0))

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            disabled={isPast || isPending}
                            className={`
                h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                ${isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:ring-2 hover:ring-gray-200'}
                ${!isPast && isBlocked ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200 relative overflow-hidden' : ''}
                ${!isPast && !isBlocked ? 'bg-white text-gray-700 border border-gray-100' : ''}
                ${isToday ? 'font-bold underline decoration-2 decoration-blue-500 underline-offset-4' : ''}
              `}
                        >
                            {day}
                            {!isPast && isBlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-rose-500/10">
                                    <Ban className="w-4 h-4 opacity-50" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
