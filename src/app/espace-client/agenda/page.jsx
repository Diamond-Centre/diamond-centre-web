/**
 * Agenda client — inspiré de l’app mobile DICE (agenda_page.dart)
 * Hero prochain RDV + calendrier mensuel + liste filtrée par jour
 */
'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTimes,
  FaClock,
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { isEventEnded } from '@/lib/eventTiming'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const MONTHS_SHORT = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc',
]

function toDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
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

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function durationLabel(start, end) {
  if (!start || !end || !String(start).includes(':') || !String(end).includes(':')) {
    return '—'
  }
  const [sh, sm] = String(start).split(':').map(Number)
  const [eh, em] = String(end).split(':').map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return '—'
  let mins = eh * 60 + em - (sh * 60 + sm)
  if (mins < 0) mins += 24 * 60
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}`
}

function normalizeBooking(raw) {
  const dateRaw = raw.date || raw.event_start_date || raw.event_date || ''
  let date = String(dateRaw).slice(0, 10)
  if (date && date.includes('T')) date = date.slice(0, 10)
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const d = new Date(dateRaw)
    date = Number.isNaN(d.getTime()) ? toDateKey(new Date()) : toDateKey(d)
  }
  const statusRaw = String(raw.status || '').toLowerCase()
  const status =
    statusRaw === 'pending' || statusRaw === 'awaiting_payment'
      ? 'pending'
      : 'confirmed'
  const endDateRaw = raw.event_end_date || raw.end_date || dateRaw
  let endDate = String(endDateRaw || '').slice(0, 10)
  if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    const d = new Date(endDateRaw)
    endDate = Number.isNaN(d.getTime()) ? date : toDateKey(d)
  }
  return {
    id: raw.id || raw.ticket_id,
    title: raw.title || raw.event_title || 'Événement',
    date,
    endDate: endDate || date,
    start: raw.start || raw.event_start_time || '09:00',
    end: raw.end || raw.event_end_time || '17:00',
    location: raw.location || raw.event_location || 'Lieu à confirmer',
    status,
    ticketCode:
      raw.entry_code ||
      raw.ticketCode ||
      raw.qr_code ||
      `DC-${raw.id || raw.ticket_id}`,
  }
}

function formatFullDate(d) {
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildMonthGrid(focusedMonth) {
  const year = focusedMonth.getFullYear()
  const month = focusedMonth.getMonth()
  const first = new Date(year, month, 1)
  let mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1
  const start = new Date(year, month, 1 - mondayOffset)
  const cells = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    cells.push({
      date,
      inMonth: date.getMonth() === month,
      key: toDateKey(date),
    })
  }
  return cells
}

function isBookingEnded(booking) {
  return isEventEnded({
    end_date: booking?.endDate,
    start_date: booking?.date,
  })
}

function StatusChip({ status }) {
  const confirmed = status === 'confirmed'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
        confirmed
          ? 'bg-emerald-50 text-[#0B9B6B]'
          : 'bg-[#FFF4DE] text-[#B78103]'
      }`}
    >
      {confirmed ? 'Confirmé' : 'En attente'}
    </span>
  )
}

function BookingCard({ booking, onOpen }) {
  const day = parseKey(booking.date)
  const dayNum = day.getDate()
  const mon = MONTHS_SHORT[day.getMonth()]
  const past = isBookingEnded(booking)

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpen(booking)}
      className={`w-full text-left flex overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.04)] hover:shadow-[0_12px_28px_rgba(10,137,242,0.12)] transition-shadow ${
        past ? 'opacity-75' : ''
      }`}
    >
      {/* Time rail — mobile style */}
      <div
        className={`w-[88px] shrink-0 flex flex-col items-center justify-center py-4 px-2 ${
          past ? 'bg-slate-100' : 'bg-[#E8F3FE]'
        }`}
      >
        <span className={`text-sm font-bold ${past ? 'text-slate-500' : 'text-[#0A89F2]'}`}>
          {booking.start}
        </span>
        <span className="text-[10px] text-[#98A2B3] mt-0.5">
          {dayNum} {mon}
        </span>
        <div className="my-2 flex flex-col items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`} />
          <span className={`w-px h-6 ${past ? 'bg-slate-300' : 'bg-[#0A89F2]/40'}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`} />
        </div>
        <span className={`text-sm font-bold ${past ? 'text-slate-500' : 'text-[#0A89F2]'}`}>
          {booking.end}
        </span>
        <span className="text-[10px] text-[#98A2B3] mt-0.5">
          {dayNum} {mon}
        </span>
      </div>

      <div className="flex-1 p-4 min-w-0 flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <StatusChip status={booking.status} />
          <span className="text-xs text-[#98A2B3] font-medium">
            {durationLabel(booking.start, booking.end)}
          </span>
        </div>
        <h3 className="font-semibold text-[#0B1220] text-[15px] leading-snug line-clamp-2">
          {booking.title}
        </h3>
        <p className="text-sm text-[#667085] flex items-center gap-1.5 truncate">
          <FaMapMarkerAlt className="text-[#0A89F2] text-xs shrink-0" />
          {booking.location}
        </p>
      </div>

      <div className="pr-4 flex items-center text-[#98A2B3]">
        <span className="text-xl leading-none">›</span>
      </div>
    </motion.button>
  )
}

function DetailModal({ booking, onClose }) {
  if (!booking) return null
  const past = isBookingEnded(booking)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-br from-[#0A89F2] to-[#0057C2] px-6 pt-5 pb-6 text-white">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-white/80 text-xs font-medium mb-1">Détail de la réservation</p>
              <h3 className="text-lg font-bold leading-snug">{booking.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="text-[#98A2B3] text-xs mb-1">Début</p>
              <p className="font-semibold text-[#0B1220] flex items-center gap-1.5">
                <FaClock className="text-[#0A89F2] text-xs" />
                {booking.start}
              </p>
              <p className="text-xs text-[#667085] mt-0.5 capitalize">{formatFullDate(day)}</p>
            </div>
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="text-[#98A2B3] text-xs mb-1">Fin</p>
              <p className="font-semibold text-[#0B1220] flex items-center gap-1.5">
                <FaClock className="text-[#0A89F2] text-xs" />
                {booking.end}
              </p>
              <p className="text-xs text-[#667085] mt-0.5">
                Durée {durationLabel(booking.start, booking.end)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8EEF5] p-4 space-y-2 text-sm">
            <p className="flex items-start gap-2 text-[#667085]">
              <FaMapMarkerAlt className="text-[#0A89F2] mt-0.5 shrink-0" />
              <span>
                <span className="block text-xs text-[#98A2B3]">Lieu</span>
                <span className="text-[#0B1220] font-medium">{booking.location}</span>
              </span>
            </p>
            <p className="flex items-start gap-2 text-[#667085]">
              <FaTicketAlt className="text-[#0A89F2] mt-0.5 shrink-0" />
              <span>
                <span className="block text-xs text-[#98A2B3]">N° billet</span>
                <span className="text-[#0B1220] font-medium font-mono">{booking.ticketCode}</span>
              </span>
            </p>
            <div>
              <StatusChip status={booking.status} />
              <span className={`ml-2 text-xs font-medium ${past ? 'text-[#98A2B3]' : 'text-[#0B9B6B]'}`}>
                {past ? 'Passé' : 'Encore'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Link
              href="/espace-client/tickets"
              className="flex-1 text-center py-3 rounded-2xl bg-[#0A89F2] text-white font-semibold text-sm hover:bg-[#0770cc] transition-colors"
            >
              Voir le billet
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-[#E8EEF5] text-[#667085] font-medium text-sm hover:bg-[#F3F6FA] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AgendaPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const today = useMemo(() => startOfDay(new Date()), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const token = auth.getToken()
        const list = await api.getMyBookings(token)
        if (!cancelled) {
          setBookings(list.map(normalizeBooking).filter((b) => b.date))
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Impossible de charger l’agenda')
          setBookings([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const nearestUpcoming = useMemo(() => {
    return [...bookings]
      .filter((b) => startOfDay(parseKey(b.date)) >= today)
      .sort((a, b) => parseKey(a.date) - parseKey(b.date) || a.start.localeCompare(b.start))[0] || null
  }, [bookings, today])

  const [focusedMonth, setFocusedMonth] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState(() => today)
  const [detail, setDetail] = useState(null)
  const [syncedOnce, setSyncedOnce] = useState(false)

  useEffect(() => {
    if (!loading && !syncedOnce) {
      if (nearestUpcoming) {
        const d = parseKey(nearestUpcoming.date)
        setFocusedMonth(d)
        setSelectedDay(d)
      }
      setSyncedOnce(true)
    }
  }, [loading, nearestUpcoming, syncedOnce])

  const eventKeys = useMemo(() => new Set(bookings.map((b) => b.date)), [bookings])
  const nearestKey = nearestUpcoming?.date

  const cells = useMemo(() => buildMonthGrid(focusedMonth), [focusedMonth])

  const filtered = useMemo(() => {
    if (!selectedDay) {
      return [...bookings].sort((a, b) => parseKey(a.date) - parseKey(b.date))
    }
    const key = toDateKey(selectedDay)
    return bookings.filter((b) => b.date === key)
  }, [bookings, selectedDay])

  const goMonth = (delta) => {
    const next = new Date(focusedMonth.getFullYear(), focusedMonth.getMonth() + delta, 1)
    setFocusedMonth(next)
    const inMonth = bookings
      .map((b) => parseKey(b.date))
      .filter((d) => d.getMonth() === next.getMonth() && d.getFullYear() === next.getFullYear())
      .sort((a, b) => a - b)
    if (inMonth.length) {
      setSelectedDay(inMonth[0])
    } else if (
      next.getMonth() === today.getMonth() &&
      next.getFullYear() === today.getFullYear()
    ) {
      setSelectedDay(today)
    } else {
      setSelectedDay(new Date(next.getFullYear(), next.getMonth(), 1))
    }
  }

  const listTitle = selectedDay
    ? formatFullDate(selectedDay)
    : 'Toutes les réservations'

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-[28px] font-extrabold text-[#0B1220] tracking-tight">Agenda</h2>
        <p className="text-[#667085] text-sm mt-1">
          Calendrier de vos réservations synchronisées avec le serveur DICE.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-10 text-center text-[#667085]">
          Chargement de l’agenda…
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
      {/* Hero — prochain événement */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0A89F2] to-[#0057C2] text-white shadow-[0_16px_40px_rgba(10,137,242,0.28)]">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -left-6 bottom-0 w-28 h-28 rounded-full bg-white/5" />
        <div className="relative p-5 sm:p-6">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-2">
            {nearestUpcoming ? 'Prochain événement' : 'Planning DiCe'}
          </p>
          {nearestUpcoming ? (
            <>
              <h3 className="text-xl font-bold leading-snug mb-3 max-w-md">
                {nearestUpcoming.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-white/90 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <FaClock className="text-xs" />
                  {nearestUpcoming.start} – {nearestUpcoming.end}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <FaMapMarkerAlt className="text-xs" />
                  {nearestUpcoming.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetail(nearestUpcoming)}
                className="inline-flex items-center gap-2 bg-white text-[#0A89F2] font-semibold text-sm px-4 py-2.5 rounded-2xl hover:bg-white/95 transition-colors"
              >
                Voir les détails
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">Aucune réservation à venir</h3>
              <p className="text-white/80 text-sm mb-4">
                Explorez les événements et réservez votre place.
              </p>
              <Link
                href="/events"
                className="inline-flex bg-white text-[#0A89F2] font-semibold text-sm px-4 py-2.5 rounded-2xl"
              >
                Voir les événements
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Calendar card */}
      <div className="rounded-[24px] bg-white border border-[#E8EEF5] shadow-[0_8px_30px_rgba(11,18,32,0.05)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="p-2.5 rounded-xl hover:bg-[#E8F3FE] text-[#667085] transition-colors"
              aria-label="Mois précédent"
            >
              <FaChevronLeft />
            </button>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1220] min-w-[140px] text-center capitalize">
              {MONTHS[focusedMonth.getMonth()]} {focusedMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="p-2.5 rounded-xl hover:bg-[#E8F3FE] text-[#667085] transition-colors"
              aria-label="Mois suivant"
            >
              <FaChevronRight />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
              selectedDay === null
                ? 'bg-[#0A89F2] text-white'
                : 'bg-[#E8F3FE] text-[#0A89F2] hover:bg-[#d6ebfc]'
            }`}
          >
            Tout
          </button>
        </div>

        <p className="text-[11px] text-[#98A2B3] mb-3">
          Cercle ambre = prochain événement — touchez un jour pour filtrer.
        </p>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d, i) => (
            <div
              key={`${d}-${i}`}
              className="text-center text-[11px] font-semibold text-[#98A2B3] py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, inMonth, key }) => {
            const hasEvent = eventKeys.has(key)
            const isNearest = key === nearestKey
            const isSelected = selectedDay && sameDay(date, selectedDay)
            const isTod = sameDay(date, today)

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedDay(date)
                  if (isNearest && nearestUpcoming) setDetail(nearestUpcoming)
                }}
                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center
                  transition-all text-sm font-semibold
                  ${!inMonth ? 'text-[#CBD5E1]' : 'text-[#0B1220]'}
                  ${isSelected ? 'bg-[#0A89F2] text-white shadow-md shadow-blue-500/25' : ''}
                  ${!isSelected && isTod ? 'bg-[#E8F3FE] text-[#0A89F2]' : ''}
                  ${!isSelected && !isTod && inMonth ? 'hover:bg-[#F3F6FA]' : ''}
                `}
              >
                <span
                  className={`
                    w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full
                    ${isNearest && !isSelected ? 'ring-2 ring-[#FFB020] ring-offset-1' : ''}
                  `}
                >
                  {date.getDate()}
                </span>
                {hasEvent && !isSelected && (
                  <span
                    className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      isNearest ? 'bg-[#FFB020]' : 'bg-[#0A89F2]'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#0B1220] capitalize truncate">
          {listTitle}
        </h3>
        <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-[#E8F3FE] text-[#0A89F2] text-xs font-bold">
          {filtered.length} réservation{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Event list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 rounded-[24px] border border-dashed border-[#E8EEF5] bg-white"
            >
              <p className="text-[#667085] mb-4">Rien ce jour-là</p>
              <Link
                href="/events"
                className="inline-flex px-4 py-2.5 rounded-2xl bg-[#0A89F2] text-white text-sm font-semibold"
              >
                Voir les événements
              </Link>
            </motion.div>
          ) : (
            filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onOpen={setDetail}
              />
            ))
          )}
        </AnimatePresence>
      </div>
        </>
      )}

      <AnimatePresence>
        {detail && (
          <DetailModal booking={detail} onClose={() => setDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
