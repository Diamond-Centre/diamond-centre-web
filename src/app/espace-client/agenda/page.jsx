'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { eventTimingLabel, eventTimingPhase } from '@/lib/eventTiming'
import LoadError from '@/components/ui/LoadError'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function toDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseKey(key) {
  if (!key) return startOfDay(new Date())
  const [y, m, d] = String(key).split('-').map(Number)
  if ([y, m, d].some((n) => Number.isNaN(n))) return startOfDay(new Date())
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
  const mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1
  const start = new Date(year, month, 1 - mondayOffset)
  const cells = []
  const weeks = Math.ceil((mondayOffset + new Date(year, month + 1, 0).getDate()) / 7)
  for (let i = 0; i < weeks * 7; i++) {
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

function bookingEvent(booking) {
  return {
    end_date: booking?.endDate,
    start_date: booking?.date,
  }
}

function bookingPhase(booking) {
  return eventTimingPhase(bookingEvent(booking))
}


const COUNT_WORDS = ['Aucune', 'Une', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf']

function StatusChip({ status }) {
  return status === 'confirmed' ? (
    <span className="ec-pill ec-pill--ok">Confirmé</span>
  ) : (
    <span className="ec-pill ec-pill--wait">En attente</span>
  )
}

function phasePill(phase) {
  if (phase === 'ended') return 'ec-pill--past'
  if (phase === 'upcoming') return 'ec-pill--blue'
  return 'ec-pill--ok'
}

function BookingCard({ booking, onOpen }) {
  const phase = bookingPhase(booking)

  return (
    <button
      type="button"
      onClick={() => onOpen(booking)}
      className="ec-item ec-booking ec-fadein"
      style={phase === 'ended' ? { filter: 'saturate(0.8)' } : undefined}
    >
      <span className="ec-booking-time">{booking.start}</span>
      <span className="ec-booking-body">
        <StatusChip status={booking.status} />
        <span className="ec-booking-title">{booking.title}</span>
        <span className="ec-booking-loc">
          <span aria-hidden="true">⌖</span> {booking.location}
        </span>
      </span>
      <span className="ec-item-arrow" aria-hidden="true">→</span>
    </button>
  )
}

function DetailModal({ booking, onClose }) {
  if (!booking) return null
  const phase = bookingPhase(booking)
  const day = parseKey(booking.date)

  return (
    <div className="ec-modal" onClick={onClose} role="presentation">
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="ec-modal-panel"
      >
        <div className="ec-modal-head">
          <div>
            <p className="ec-eyebrow">Détail de la réservation</p>
            <h3>{booking.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <StatusChip status={booking.status} />
              <span className={`ec-pill ${phasePill(phase)}`}>
                {eventTimingLabel(bookingEvent(booking))}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="ec-modal-close" aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        <div className="ec-modal-body">
          <div className="ec-tiles2">
            <div className="ec-tile">
              <p className="ec-tile-label">Début</p>
              <p className="ec-tile-value">{booking.start}</p>
              <p className="ec-tile-text" style={{ textTransform: 'capitalize' }}>{formatFullDate(day)}</p>
            </div>
            <div className="ec-tile">
              <p className="ec-tile-label">Fin</p>
              <p className="ec-tile-value">{booking.end}</p>
              <p className="ec-tile-text">Durée {durationLabel(booking.start, booking.end)}</p>
            </div>
          </div>

          <div className="ec-tile">
            <p className="ec-tile-label">Lieu</p>
            <p className="ec-tile-value">{booking.location}</p>
          </div>
          <div className="ec-tile">
            <p className="ec-tile-label">N° billet</p>
            <p className="ec-tile-value" style={{ fontFamily: 'ui-monospace, monospace' }}>
              {booking.ticketCode}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/espace-client/tickets"
              className="ec-btn ec-btn--sky"
              style={{ flex: 1 }}
            >
              Voir le billet →
            </Link>
            <button type="button" onClick={onClose} className="ec-btn ec-btn--dark" style={{ height: 50, borderRadius: 14 }}>
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
          setBookings(
            (Array.isArray(list) ? list : [])
              .map(normalizeBooking)
              .filter((b) => b.date)
          )
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

  const monthName = MONTHS[focusedMonth.getMonth()]
  const monthCount = bookings.filter((b) => {
    const d = parseKey(b.date)
    return (
      d.getMonth() === focusedMonth.getMonth() &&
      d.getFullYear() === focusedMonth.getFullYear()
    )
  }).length

  let planningLine = 'Aucune réservation enregistrée ce mois-ci.'
  if (monthCount === 1) planningLine = 'Une réservation est actuellement enregistrée.'
  else if (monthCount > 1) {
    const word = COUNT_WORDS[monthCount] || String(monthCount)
    planningLine = `${word} réservations sont actuellement enregistrées.`
  }

  let listTitle = 'Toutes les réservations'
  if (selectedDay) {
    const dayNum = selectedDay.getDate()
    const monthLabel = `${MONTHS[selectedDay.getMonth()]} ${selectedDay.getFullYear()}`
    const weekday = selectedDay.toLocaleDateString('fr-FR', { weekday: 'long' })
    listTitle =
      filtered.length > 0
        ? `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${dayNum} ${monthLabel}`
        : `Jour ${dayNum} · ${monthLabel}`
  }

  return (
    <div>
      <header>
        <h1 className="ec-h1" style={{ marginTop: 0 }}>Agenda</h1>
        <p className="ec-lead" style={{ marginTop: 6 }}>
          Calendrier de vos réservations synchronisées avec DiCe.
        </p>
      </header>

      {loading ? (
        <div className="ec-card ec-loading" style={{ marginTop: 24 }}>
          Chargement de l’agenda…
        </div>
      ) : error ? (
        <div style={{ marginTop: 24 }}>
          <LoadError onRetry={() => window.location.reload()} />
        </div>
      ) : (
        <>
          <section className="ec-card ec-planning" style={{ marginTop: 24 }}>
            <small>Planning DiCe</small>
            <h2>Vos expériences de {monthName.toLowerCase()}</h2>
            <p>{planningLine}</p>
          </section>

          <section className="ec-card ec-cal">
            <div className="ec-cal-head">
              <div className="ec-cal-nav">
                <button type="button" onClick={() => goMonth(-1)} aria-label="Mois précédent">‹</button>
                <h3>{monthName} {focusedMonth.getFullYear()}</h3>
                <button type="button" onClick={() => goMonth(1)} aria-label="Mois suivant">›</button>
              </div>
              <button
                type="button"
                className="ec-cal-all"
                aria-pressed={selectedDay === null}
                onClick={() => setSelectedDay(null)}
              >
                Tout
              </button>
            </div>

            <div className="ec-cal-week">
              {WEEKDAYS.map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
            </div>

            <div className="ec-cal-grid">
              {cells.map(({ date, key }) => {
                const hasEvent = eventKeys.has(key)
                const isSelected = Boolean(selectedDay && sameDay(date, selectedDay))
                return (
                  <button
                    key={key}
                    type="button"
                    className="ec-cal-day"
                    aria-pressed={isSelected}
                    data-today={sameDay(date, today)}
                    onClick={() => setSelectedDay(date)}
                  >
                    {date.getDate()}
                    {hasEvent ? <span className="ec-cal-dot" /> : null}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="ec-day-head">
            <h3>{listTitle}</h3>
            <span>
              {filtered.length} réservation{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="ec-empty">
              <div className="ec-empty-ico" aria-hidden="true">▣</div>
              <h3>Rien ce jour-là</h3>
              <p>Vos billets apparaîtront ici au bon moment.</p>
              <Link href="/events" className="ec-btn ec-btn--sky">
                Voir les événements →
              </Link>
            </div>
          ) : (
            <div className="ec-list ec-list--loose">
              {filtered.map((b) => (
                <BookingCard key={`${b.id}-${selectedDay ? toDateKey(selectedDay) : 'all'}`} booking={b} onOpen={setDetail} />
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {detail && <DetailModal booking={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>
    </div>
  )
}
