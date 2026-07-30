/**
 * Composant Calendrier pour le dashboard client
 */
'use client'

import { useState, useEffect } from 'react'
import { 
  FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaCircle
} from 'react-icons/fa'

// Jours de la semaine
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Mois en français
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function Calendar({ eventDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [calendarDays, setCalendarDays] = useState([])

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Générer les jours du calendrier
  useEffect(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    
    // Obtenir le jour de la semaine du premier jour (0 = Dimanche)
    let firstDayIndex = firstDayOfMonth.getDay()
    // Ajuster pour commencer par Lundi (1 = Lundi)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const days = []
    
    // Jours du mois précédent
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
      })
    }

    // Jours du mois courant
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i)
      })
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length // 6 lignes de 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i)
      })
    }

    setCalendarDays(days)
  }, [currentDate, currentMonth, currentYear])

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  // Vérifier si une date a un événement
  const hasEvent = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return eventDates.includes(dateStr)
  }

  // Vérifier si c'est aujourd'hui
  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  // Vérifier si c'est la date sélectionnée
  const isSelected = (date) => {
    if (!selectedDate) return false
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-dice-blue" />
          <h3 className="text-sm font-semibold text-gray-800">Agenda</h3>
        </div>
        <button
          onClick={goToToday}
          className="text-xs text-dice-blue hover:underline"
        >
          Aujourd'hui
        </button>
      </div>

      {/* Mois / Année */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronLeft className="text-gray-500 text-sm" />
        </button>
        <span className="text-sm font-medium text-gray-800">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronRight className="text-gray-500 text-sm" />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const hasEventOnDay = hasEvent(day.date)
          const isTodayDay = isToday(day.date)
          const isSelectedDay = isSelected(day.date)

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${day.isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                ${isTodayDay ? 'font-bold text-dice-blue' : ''}
                ${isSelectedDay ? 'bg-dice-blue text-white' : 'hover:bg-gray-100'}
                ${hasEventOnDay && !isSelectedDay ? 'bg-dice-blue/5' : ''}
              `}
            >
              {day.day}
              {hasEventOnDay && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className={`w-1 h-1 rounded-full ${isSelectedDay ? 'bg-white' : 'bg-dice-blue'}`} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Légende */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-dice-blue" />
          <span>Événement</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-dice-blue/20 border border-dice-blue/30" />
          <span>Aujourd'hui</span>
        </div>
      </div>

      {/* Informations du jour sélectionné */}
      {selectedDate && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-800">
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          {hasEvent(selectedDate) ? (
            <div className="mt-1 flex items-center gap-2 text-xs text-dice-blue">
              <FaCircle className="text-[8px]" />
              <span>Événement réservé ce jour</span>
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Aucun événement ce jour</p>
          )}
        </div>
      )}
    </div>
  )
}