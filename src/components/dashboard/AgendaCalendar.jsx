/**
 * Calendrier de l'agenda (mini vue)
 */
'use client'

import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function AgendaCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    return { days, firstDay, lastDay }
  }

  const { days, firstDay } = getDaysInMonth(currentDate)

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const hasEventOnDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.some(event => event.date === dateStr)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaChevronLeft className="text-gray-400 text-sm" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {currentDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaChevronRight className="text-gray-400 text-sm" />
        </button>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={`aspect-square flex items-center justify-center rounded-lg transition-colors ${
              isToday(date)
                ? 'bg-dice-blue text-white'
                : hasEventOnDay(date)
                ? 'bg-dice-blue/10 text-dice-blue hover:bg-dice-blue/20 cursor-pointer'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="text-xs font-medium">{date.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}