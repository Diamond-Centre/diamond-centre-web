/**
 * Page de l'agenda
 */
'use client'

import { useState } from 'react'
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaClock, FaMapMarker, FaUser } from 'react-icons/fa'
import Button from '@/components/ui/Button'

// Données mockées
const mockEvents = [
  {
    id: '1',
    title: 'Développement Web avec React',
    date: '2026-08-15',
    time: '09:00-17:00',
    lieu: 'Abidjan, Plateau',
    formateur: 'André Marie',
    type: 'formation',
    status: 'confirmé'
  },
  {
    id: '2',
    title: 'Architecture Microservices avec Spring Boot',
    date: '2026-09-01',
    time: '10:00-18:00',
    lieu: 'Lyon, France',
    formateur: 'Brandon',
    type: 'séminaire',
    status: 'en_attente'
  },
  {
    id: '3',
    title: 'UI/UX Design - Créer des interfaces innovantes',
    date: '2026-08-20',
    time: '14:00-18:00',
    lieu: 'Bordeaux, France',
    formateur: 'Stéphane',
    type: 'conférence',
    status: 'confirmé'
  },
  {
    id: '4',
    title: 'Développement Mobile avec Flutter',
    date: '2026-07-10',
    time: '09:00-17:00',
    lieu: 'Marseille, France',
    formateur: 'Stéphane',
    type: 'atelier',
    status: 'terminé'
  }
]

const statusColors = {
  confirmé: 'bg-green-100 text-green-700 border-green-200',
  en_attente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  terminé: 'bg-gray-100 text-gray-700 border-gray-200',
  annulé: 'bg-red-100 text-red-700 border-red-200'
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('list') // 'list' | 'calendar'

  const events = mockEvents

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

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const hasEventOnDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.some(event => event.date === dateStr)
  }

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mon agenda</h1>
        <p className="text-gray-500">Gérez vos réservations et événements</p>
      </div>

      {/* Contrôles */}
      <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-dice-blue/10 text-dice-blue rounded-xl hover:bg-dice-blue/20 transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-dice-blue text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-dice-blue text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              Calendrier
            </button>
          </div>
        </div>
      </div>

      {/* Vue Calendrier */}
      {view === 'calendar' && (
        <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((date) => {
              const hasEvent = hasEventOnDay(date)
              const dayEvents = getEventsForDate(date)
              return (
                <div
                  key={date.toISOString()}
                  className={`aspect-square p-1 rounded-xl transition-all ${
                    isToday(date)
                      ? 'bg-dice-blue/10 border-2 border-dice-blue'
                      : hasEvent
                      ? 'bg-dice-blue/5 hover:bg-dice-blue/10 cursor-pointer'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center h-full">
                    <span className={`text-sm font-medium ${
                      isToday(date) ? 'text-dice-blue' : 'text-gray-700'
                    }`}>
                      {date.getDate()}
                    </span>
                    {hasEvent && (
                      <div className="w-1.5 h-1.5 rounded-full bg-dice-blue mt-0.5" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Vue Liste */}
      {view === 'list' && (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 hover:bg-white/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    event.type === 'formation' ? 'bg-blue-100 text-blue-600' :
                    event.type === 'séminaire' ? 'bg-purple-100 text-purple-600' :
                    event.type === 'conférence' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <FaCalendarAlt className="text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[event.status] || statusColors.en_attente}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-dice-blue text-xs" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMapMarker className="text-dice-blue text-xs" />
                        {event.lieu}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUser className="text-dice-blue text-xs" />
                        {event.formateur}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-4 py-2 bg-dice-blue text-white rounded-xl text-sm font-medium hover:bg-dice-blue-dark transition-colors">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
        .glass-card-dice:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
}