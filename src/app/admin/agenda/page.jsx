/**
 * Agenda admin — design premium aligné DiCe + logique mobile
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaSync,
  FaCalendarAlt,
  FaPlus,
  FaUsers,
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
const MONTHS_SHORT = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc',
]

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function parseEventDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return startOfDay(d)
}

function formatTime(value) {
  if (!value) return '—'
  const s = String(value)
  if (s.includes('T')) {
    const d = new Date(s)
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  }
  return s.slice(0, 5)
}

function formatFrDate(d) {
  if (!d) return '—'
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatShortDate(d) {
  if (!d) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function durationLabel(start, end) {
  if (!start || !end) return '—'
  const [sh, sm] = String(formatTime(start)).split(':').map(Number)
  const [eh, em] = String(formatTime(end)).split(':').map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return '—'
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins < 0) mins += 24 * 60
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}`
}

function eventCoversDay(event, day) {
  const start = parseEventDate(event.start_date)
  if (!start || !day) return false
  const end = parseEventDate(event.end_date) || start
  const d = startOfDay(day)
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime()
}

function buildMonthGrid(focusedMonth) {
  const year = focusedMonth.getFullYear()
  const month = focusedMonth.getMonth()
  const first = new Date(year, month, 1)
  const mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1
  const start = new Date(year, month, 1 - mondayOffset)
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    cells.push(date)
  }
  return cells
}

function statusMeta(status) {
  switch (String(status || '').toLowerCase()) {
    case 'published':
      return { label: 'Publié', className: 'bg-emerald-50 text-[#0B9B6B]' }
    case 'draft':
      return { label: 'Brouillon', className: 'bg-[#FFF4DE] text-[#B78103]' }
    case 'cancelled':
      return { label: 'Annulé', className: 'bg-red-50 text-red-600' }
    case 'completed':
      return { label: 'Terminé', className: 'bg-slate-100 text-slate-600' }
    default:
      return { label: status || '—', className: 'bg-[#E8F3FE] text-[#0A89F2]' }
  }
}

function EventCard({ event, index }) {
  const start = parseEventDate(event.start_date)
  const end = parseEventDate(event.end_date) || start
  const multiDay = start && end && start.getTime() !== end.getTime()
  const badge = statusMeta(event.status)
  const past = end && end.getTime() < startOfDay(new Date()).getTime()
  const dayNum = start?.getDate()
  const mon = start ? MONTHS_SHORT[start.getMonth()] : '—'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.28 }}
      className={`group flex overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.04)] hover:shadow-[0_14px_32px_rgba(10,137,242,0.14)] hover:border-[#0A89F2]/35 transition-all ${
        past ? 'opacity-80' : ''
      }`}
    >
      <div
        className={`w-[84px] sm:w-[92px] shrink-0 flex flex-col items-center justify-center py-4 px-2 ${
          past ? 'bg-slate-100' : 'bg-[#E8F3FE]'
        }`}
      >
        <span className={`text-sm font-bold ${past ? 'text-slate-500' : 'text-[#0A89F2]'}`}>
          {formatTime(event.start_time)}
        </span>
        <span className="text-[10px] text-[#98A2B3] mt-0.5">
          {dayNum} {mon}
        </span>
        <div className="my-2 flex flex-col items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`} />
          <span className={`w-px h-7 ${past ? 'bg-slate-300' : 'bg-[#0A89F2]/35'}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`} />
        </div>
        <span className={`text-sm font-bold ${past ? 'text-slate-500' : 'text-[#0A89F2]'}`}>
          {formatTime(event.end_time)}
        </span>
        <span className="text-[10px] text-[#98A2B3] mt-0.5">
          {durationLabel(event.start_time, event.end_time)}
        </span>
      </div>

      <div className="flex-1 min-w-0 p-4 flex gap-3">
        <div className="hidden sm:block w-14 h-14 rounded-2xl overflow-hidden bg-[#F3F6FA] shrink-0">
          {event.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#0A89F2] bg-[#E8F3FE]">
              <FaCalendarAlt />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.className}`}>
              {badge.label}
            </span>
            {event.category && (
              <span className="text-[11px] font-medium text-[#98A2B3] capitalize">
                {event.category}
              </span>
            )}
            {multiDay && (
              <span className="text-[11px] font-semibold text-[#0A89F2] bg-[#E8F3FE] px-2 py-0.5 rounded-full">
                Multi-jours
              </span>
            )}
          </div>
          <h3 className="font-semibold text-[#0B1220] text-[15px] leading-snug line-clamp-2">
            {event.title}
          </h3>
          {event.location && (
            <p className="text-sm text-[#667085] flex items-center gap-1.5 truncate">
              <FaMapMarkerAlt className="text-[#0A89F2] text-xs shrink-0" />
              {event.location}
            </p>
          )}
          {(event.capacity != null || event.available_tickets != null) && (
            <p className="text-xs text-[#98A2B3] flex items-center gap-1.5">
              <FaUsers className="text-[#0A89F2] text-[10px]" />
              {event.available_tickets != null && event.capacity != null
                ? `${Math.max(0, Number(event.capacity) - Number(event.available_tickets))}/${event.capacity} places prises`
                : `${event.capacity ?? '—'} places`}
            </p>
          )}
        </div>

        <Link
          href={`/admin/events/edit/${event.id}`}
          className="self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#0A89F2] bg-[#E8F3FE] hover:bg-[#0A89F2] hover:text-white transition-colors"
        >
          <FaEdit className="text-xs" />
          <span className="hidden sm:inline">Modifier</span>
        </Link>
      </div>
    </motion.div>
  )
}

export default function AdminAgendaPage() {
  const router = useRouter()
  const now = new Date()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [focusedMonth, setFocusedMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1)
  )
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(now))
  const [syncedOnce, setSyncedOnce] = useState(false)

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getEvents(token)
      const list = (Array.isArray(data) ? data : data?.data || [])
        .slice()
        .sort((a, b) => {
          const da = new Date(a.start_date || 0) - new Date(b.start_date || 0)
          if (da !== 0) return da
          return String(a.start_time || '').localeCompare(String(b.start_time || ''))
        })
      setEvents(list)
    } catch (err) {
      setError(err.message || 'Impossible de charger l’agenda')
      toast.error(err.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = auth.getToken()
    const user = auth.getUser()
    if (!token || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    loadEvents()
  }, [router, loadEvents])

  const occupiedDays = useMemo(() => {
    const set = new Set()
    for (const event of events) {
      const start = parseEventDate(event.start_date)
      if (!start) continue
      const end = parseEventDate(event.end_date) || start
      for (
        let d = new Date(start);
        d.getTime() <= end.getTime();
        d.setDate(d.getDate() + 1)
      ) {
        set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
      }
    }
    return set
  }, [events])

  const dayHasEvent = (day) =>
    occupiedDays.has(`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`)

  const eventCountOnDay = (day) =>
    events.filter((e) => eventCoversDay(e, day)).length

  const occupiedDaysInMonth = useMemo(() => {
    const y = focusedMonth.getFullYear()
    const m = focusedMonth.getMonth()
    let count = 0
    for (const key of occupiedDays) {
      const [yy, mm] = key.split('-').map(Number)
      if (yy === y && mm === m) count += 1
    }
    return count
  }, [occupiedDays, focusedMonth])

  const publishedCount = useMemo(
    () => events.filter((e) => e.status === 'published').length,
    [events]
  )

  const dayEvents = useMemo(() => {
    if (!selectedDay) {
      const y = focusedMonth.getFullYear()
      const m = focusedMonth.getMonth()
      return events.filter((e) => {
        const start = parseEventDate(e.start_date)
        return start && start.getFullYear() === y && start.getMonth() === m
      })
    }
    return events
      .filter((e) => eventCoversDay(e, selectedDay))
      .sort((a, b) =>
        String(a.start_time || '').localeCompare(String(b.start_time || ''))
      )
  }, [events, selectedDay, focusedMonth])

  const nextUpcoming = useMemo(() => {
    const today = startOfDay(new Date())
    const upcoming = events.filter((e) => {
      const end = parseEventDate(e.end_date) || parseEventDate(e.start_date)
      return end && end.getTime() >= today.getTime()
    })
    if (!upcoming.length) return null
    upcoming.sort(
      (a, b) => new Date(a.start_date || 0) - new Date(b.start_date || 0)
    )
    return upcoming[0]
  }, [events])

  useEffect(() => {
    if (loading || syncedOnce || !events.length) return
    const today = startOfDay(new Date())
    if (nextUpcoming) {
      const d = parseEventDate(nextUpcoming.start_date)
      if (d) {
        setFocusedMonth(new Date(d.getFullYear(), d.getMonth(), 1))
        setSelectedDay(d)
        setSyncedOnce(true)
        return
      }
    }
    setSelectedDay(today)
    setSyncedOnce(true)
  }, [loading, events.length, nextUpcoming, syncedOnce])

  const shiftMonth = (delta) => {
    const next = new Date(focusedMonth.getFullYear(), focusedMonth.getMonth() + delta, 1)
    setFocusedMonth(next)
    const y = next.getFullYear()
    const m = next.getMonth()
    const occupied = []
    for (const key of occupiedDays) {
      const [yy, mm, dd] = key.split('-').map(Number)
      if (yy === y && mm === m) occupied.push(new Date(yy, mm, dd))
    }
    occupied.sort((a, b) => a - b)
    if (occupied.length) {
      setSelectedDay(occupied[0])
    } else {
      const today = startOfDay(new Date())
      if (today.getFullYear() === y && today.getMonth() === m) {
        setSelectedDay(today)
      } else {
        setSelectedDay(new Date(y, m, 1))
      }
    }
  }

  const selectDay = (day) => {
    setSelectedDay(startOfDay(day))
    if (
      day.getMonth() !== focusedMonth.getMonth() ||
      day.getFullYear() !== focusedMonth.getFullYear()
    ) {
      setFocusedMonth(new Date(day.getFullYear(), day.getMonth(), 1))
    }
  }

  const calendarDays = useMemo(() => buildMonthGrid(focusedMonth), [focusedMonth])
  const today = startOfDay(new Date())
  const monthLabel = `${MONTHS[focusedMonth.getMonth()]} ${focusedMonth.getFullYear()}`

  return (
    <div className="relative -m-6 min-h-[calc(100vh-0px)]">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#0A89F2]/[0.07] blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-[#0A89F2]/[0.05] blur-3xl" />
      </div>

      <div className="relative p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A89F2] mb-1">
              Diamond Centre
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1220] tracking-tight">
              Agenda
            </h1>
            <p className="text-[#667085] text-sm mt-1">
              Vue calendrier de tous vos événements — comme sur l’app admin.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadEvents}
              className="px-4 py-2.5 rounded-2xl border border-[#E8EEF5] bg-white text-sm font-medium text-[#667085] hover:bg-[#F3F6FA] transition-colors flex items-center gap-2"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Rafraîchir
            </button>
            <Link
              href="/admin/events/create"
              className="px-4 py-2.5 rounded-2xl bg-[#0A89F2] text-white text-sm font-semibold hover:bg-[#0770cc] transition-colors flex items-center gap-2 shadow-[0_8px_20px_rgba(10,137,242,0.28)]"
            >
              <FaPlus className="text-xs" />
              Créer
            </Link>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Événements', value: events.length, tone: 'text-[#0A89F2]' },
            { label: 'Publiés', value: publishedCount, tone: 'text-[#0B9B6B]' },
            { label: 'Jours ce mois', value: occupiedDaysInMonth, tone: 'text-[#B78103]' },
            {
              label: 'Ce jour',
              value: selectedDay ? eventCountOnDay(selectedDay) : dayEvents.length,
              tone: 'text-[#0B1220]',
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[20px] border border-[#E8EEF5] bg-white/90 backdrop-blur-sm px-4 py-3.5 shadow-[0_4px_16px_rgba(11,18,32,0.03)]"
            >
              <p className={`text-2xl font-extrabold tracking-tight ${kpi.tone}`}>{kpi.value}</p>
              <p className="text-xs font-medium text-[#98A2B3] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button type="button" onClick={loadEvents} className="ml-3 underline font-medium">
              Réessayer
            </button>
          </div>
        )}

        {/* Next event hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0A89F2] to-[#0057C2] text-white shadow-[0_16px_40px_rgba(10,137,242,0.28)]"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute right-8 bottom-0 w-40 h-40 rounded-full bg-white/[0.06] blur-2xl" />

          <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
            {nextUpcoming?.image_url && (
              <div className="hidden md:block w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-white/25 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nextUpcoming.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1.5">
                {nextUpcoming ? 'Prochain événement' : 'Planning DiCe'}
              </p>
              {nextUpcoming ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-extrabold leading-snug line-clamp-2">
                    {nextUpcoming.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/90 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <FaCalendarAlt className="text-xs opacity-80" />
                      {formatShortDate(parseEventDate(nextUpcoming.start_date))}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FaClock className="text-xs opacity-80" />
                      {formatTime(nextUpcoming.start_time)} – {formatTime(nextUpcoming.end_time)}
                    </span>
                    {nextUpcoming.location && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <FaMapMarkerAlt className="text-xs opacity-80" />
                        {nextUpcoming.location}
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold text-white/95">
                  Aucun événement à venir — créez-en un pour remplir l’agenda.
                </p>
              )}
            </div>
            {nextUpcoming ? (
              <Link
                href={`/admin/events/edit/${nextUpcoming.id}`}
                className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white text-[#0A89F2] font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Modifier
              </Link>
            ) : (
              <Link
                href="/admin/events/create"
                className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white text-[#0A89F2] font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Créer un événement
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main grid: calendar + list */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          {/* Calendar */}
          <div className="xl:sticky xl:top-6 rounded-[24px] border border-[#E8EEF5] bg-white p-4 sm:p-5 shadow-[0_8px_28px_rgba(11,18,32,0.05)]">
            <div className="flex items-center gap-1 mb-4">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="p-2.5 rounded-xl hover:bg-[#F3F6FA] text-[#667085] transition-colors"
                aria-label="Mois précédent"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <h3 className="flex-1 text-center font-extrabold text-[#0B1220] text-[15px] tracking-tight">
                {monthLabel}
              </h3>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="p-2.5 rounded-xl hover:bg-[#F3F6FA] text-[#667085] transition-colors"
                aria-label="Mois suivant"
              >
                <FaChevronRight className="text-sm" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className={`ml-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  selectedDay == null
                    ? 'bg-[#0A89F2] text-white'
                    : 'text-[#0A89F2] bg-[#E8F3FE] hover:bg-[#d6ebfc]'
                }`}
              >
                Mois
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#667085] mb-3 px-1">
              <span className="w-2 h-2 rounded-full bg-[#0A89F2]" />
              Jour avec événement
            </div>

            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((label, i) => (
                <div
                  key={`${label}-${i}`}
                  className="text-center text-[11px] font-bold text-[#98A2B3] py-1.5"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map((day) => {
                const inMonth = day.getMonth() === focusedMonth.getMonth()
                const selected = selectedDay && sameDay(day, selectedDay)
                const isToday = sameDay(day, today)
                const hasEvent = dayHasEvent(day)
                const count = hasEvent ? eventCountOnDay(day) : 0

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => selectDay(day)}
                    className="relative h-12 flex flex-col items-center justify-center"
                  >
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] transition-all ${
                        selected
                          ? 'bg-[#0A89F2] text-white font-extrabold shadow-[0_6px_16px_rgba(10,137,242,0.35)] scale-105'
                          : isToday
                            ? 'bg-[#E8F3FE] text-[#0A89F2] font-extrabold ring-1 ring-[#0A89F2]'
                            : hasEvent
                              ? 'text-[#0B1220] font-extrabold hover:bg-[#E8F3FE]'
                              : inMonth
                                ? 'text-[#0B1220] font-semibold hover:bg-[#F3F6FA]'
                                : 'text-[#D0D5DD]'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {hasEvent && !selected && (
                      <span className="absolute bottom-1 flex gap-0.5">
                        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1 h-1 rounded-full ${isToday ? 'bg-[#0A89F2]' : 'bg-[#0A89F2]'}`}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const t = startOfDay(new Date())
                setFocusedMonth(new Date(t.getFullYear(), t.getMonth(), 1))
                setSelectedDay(t)
              }}
              className="mt-4 w-full py-2.5 rounded-2xl text-sm font-semibold text-[#0A89F2] bg-[#E8F3FE] hover:bg-[#d6ebfc] transition-colors"
            >
              Revenir à aujourd’hui
            </button>
          </div>

          {/* Day list */}
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0B1220] tracking-tight capitalize">
                  {selectedDay ? formatFrDate(selectedDay) : `Tout ${MONTHS[focusedMonth.getMonth()]}`}
                </h2>
                <p className="text-xs text-[#98A2B3] mt-0.5 font-medium">
                  {dayEvents.length} événement{dayEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              {selectedDay && (
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="text-sm font-semibold text-[#0A89F2] hover:underline"
                >
                  Voir le mois
                </button>
              )}
            </div>

            {loading && events.length === 0 ? (
              <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-12 text-center text-[#667085]">
                <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#0A89F2] border-t-transparent" />
                Chargement de l’agenda…
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {dayEvents.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-[24px] border border-dashed border-[#D0D5DD] bg-white/70 p-12 text-center"
                  >
                    <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-[#E8F3FE] text-[#0A89F2] flex items-center justify-center">
                      <FaCalendarAlt />
                    </div>
                    <p className="font-semibold text-[#0B1220]">Aucun événement ce jour-là</p>
                    <p className="text-sm text-[#667085] mt-1 mb-4">
                      Sélectionnez un autre jour ou créez un événement.
                    </p>
                    <Link
                      href="/admin/events/create"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0A89F2] text-white text-sm font-semibold hover:bg-[#0770cc]"
                    >
                      <FaPlus className="text-xs" />
                      Nouvel événement
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {dayEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
