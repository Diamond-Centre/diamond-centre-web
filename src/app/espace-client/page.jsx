'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSpinner,
  FaTicketAlt,
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { eventTimingLabel, eventTimingPhase } from '@/lib/eventTiming'
import LoadError from '@/components/ui/LoadError'

function bookingDate(b) {
  return b.date || b.event_start_date || b.event_date || b.created_at
}

function bookingEvent(b) {
  return {
    start_date: b.event_start_date || b.date || b.event_date || b.start_date,
    end_date: b.event_end_date || b.end_date,
  }
}

function timingClass(phase) {
  if (phase === 'ended') return 'text-[#98A2B3]'
  if (phase === 'upcoming') return 'text-[#0A89F2]'
  return 'text-[#0B9B6B]'
}

function formatDay(value) {
  if (!value) return 'Date à confirmer'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatShort(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

function timeRange(b) {
  if (b.start && b.end) return `${b.start} – ${b.end}`
  if (b.time) return b.time
  if (b.event_start_time && b.event_end_time) {
    return `${b.event_start_time} – ${b.event_end_time}`
  }
  return null
}

function statusLabel(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'pending' || s === 'awaiting_payment') return 'En attente'
  return 'Confirmé'
}

function isPending(status) {
  const s = String(status || '').toLowerCase()
  return s === 'pending' || s === 'awaiting_payment'
}

export default function EspaceClientHomePage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const token = auth.getToken()
        const list = await api.getMyBookings(token)
        if (!cancelled) {
          setBookings(list)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Impossible de charger vos réservations')
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

  const { next, rest, activeCount } = useMemo(() => {
    const startTime = (b) => new Date(bookingDate(b) || 0).getTime() || 0
    const upcoming = bookings
      .filter((b) => eventTimingPhase(bookingEvent(b)) === 'upcoming')
      .sort((a, b) => startTime(a) - startTime(b))
    const ongoing = bookings
      .filter((b) => eventTimingPhase(bookingEvent(b)) === 'ongoing')
      .sort((a, b) => startTime(a) - startTime(b))

    const list = [...ongoing.slice(0, 3), ...upcoming]
    return {
      next: list[0] || null,
      rest: list.slice(1),
      activeCount: upcoming.length + ongoing.length,
    }
  }, [bookings])

  const firstName =
    user?.prenom ||
    (user?.name ? String(user.name).split(' ')[0] : null) ||
    'là'

  const todayLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-8">
      {/* Greeting — brand + person, one composition */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-1"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
          {todayLabel}
        </p>
        <h1 className="text-[2rem] font-extrabold tracking-tight text-[#0B1220] sm:text-[2.5rem]">
          Bonjour, {firstName}
        </h1>
        <p className="max-w-lg text-[#667085]">
          Votre prochain rendez-vous DiCe, et ceux en cours, en un coup d’œil.
        </p>
      </motion.header>

      {/* Primary: next event hero */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-[28px] border border-[#E8EEF5] bg-white text-[#667085]">
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          Chargement de vos réservations…
        </div>
      ) : error ? (
        <LoadError onRetry={() => window.location.reload()} />
      ) : next ? (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A89F2] via-[#0878d6] to-[#0057C2] text-white shadow-[0_20px_50px_rgba(10,137,242,0.28)]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute right-10 bottom-8 h-24 w-24 rounded-full border border-white/15" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
                {eventTimingPhase(bookingEvent(next)) === 'ongoing'
                  ? 'En cours'
                  : 'À venir'}
              </div>

              <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
                {next.title || next.event_title || 'Événement réservé'}
              </h2>

              <div className="flex flex-wrap gap-2.5 text-sm text-white/95">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3.5 py-2 backdrop-blur-sm">
                  <FaCalendarAlt className="text-xs opacity-80" />
                  {formatDay(bookingDate(next))}
                </span>
                {timeRange(next) ? (
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3.5 py-2 backdrop-blur-sm">
                    <FaClock className="text-xs opacity-80" />
                    {timeRange(next)}
                  </span>
                ) : null}
                {next.location || next.event_location ? (
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3.5 py-2 backdrop-blur-sm">
                    <FaMapMarkerAlt className="text-xs opacity-80" />
                    {next.location || next.event_location}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/espace-client/tickets"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0A89F2] transition hover:bg-white/95"
                >
                  Voir mon billet
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  href="/espace-client/agenda"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Ouvrir l’agenda
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="rounded-[22px] bg-white/12 px-5 py-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                  Places
                </p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums">
                  {next.quantity || 1}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  isPending(next.status)
                    ? 'bg-[#FFF4DE] text-[#B78103]'
                    : 'bg-emerald-50 text-[#0B9B6B]'
                }`}
              >
                {statusLabel(next.status)}
              </span>
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {eventTimingLabel(bookingEvent(next))}
              </span>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(10,137,242,0.12),_transparent_55%)]" />
          <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A89F2]">
              Commencer
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#0B1220] sm:text-3xl">
              Aucune réservation à venir ou en cours
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[#667085]">
              Explorez les formations et conférences DiCe, puis réservez votre
              place en quelques secondes.
            </p>
            <Link
              href="/events"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#0A89F2] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(10,137,242,0.3)] transition hover:bg-[#0770cc]"
            >
              Voir les événements
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </motion.section>
      )}

      {/* Secondary: remaining upcoming + quiet shortcuts */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="space-y-4"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0B1220]">À venir et en cours</h3>
              <p className="text-sm text-[#98A2B3]">
                {activeCount} réservation
                {activeCount !== 1 ? 's' : ''} active
                {activeCount !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              href="/espace-client/tickets"
              className="text-sm font-medium text-[#0A89F2] hover:underline"
            >
              Tout voir
            </Link>
          </div>

          {!loading && !error && rest.length === 0 && next ? (
            <p className="rounded-[20px] border border-dashed border-[#E8EEF5] bg-white px-5 py-8 text-center text-sm text-[#667085]">
              C’est votre seule réservation pour le moment.
            </p>
          ) : null}

          {!loading && !error && rest.length > 0 ? (
            <ul className="space-y-3">
              {rest.map((b, i) => (
                <motion.li
                  key={b.id || b.ticket_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <Link
                    href="/espace-client/tickets"
                    className="group flex overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white transition hover:border-[#0A89F2]/35 hover:shadow-[0_12px_28px_rgba(10,137,242,0.08)]"
                  >
                    <div className="flex w-[72px] shrink-0 flex-col items-center justify-center bg-[#E8F3FE] py-4 text-[#0A89F2]">
                      <span className="text-lg font-extrabold leading-none">
                        {(() => {
                          const d = new Date(bookingDate(b))
                          return Number.isNaN(d.getTime()) ? '—' : d.getDate()
                        })()}
                      </span>
                      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                        {formatShort(bookingDate(b)).replace(/^\d+\s*/, '')}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0B1220] group-hover:text-[#0A89F2]">
                          {b.title || b.event_title || 'Événement'}
                        </p>
                        <p className={`mt-0.5 text-[11px] font-semibold ${timingClass(eventTimingPhase(bookingEvent(b)))}`}>
                          {eventTimingLabel(bookingEvent(b))}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-[#667085]">
                          {timeRange(b) || formatDay(bookingDate(b))}
                          {b.location ? ` · ${b.location}` : ''}
                        </p>
                      </div>
                      <FaArrowRight className="shrink-0 text-xs text-[#CBD5E1] transition group-hover:text-[#0A89F2]" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          ) : null}

          {!loading && !error && !next ? (
            <p className="rounded-[20px] border border-dashed border-[#E8EEF5] bg-white px-5 py-8 text-center text-sm text-[#667085]">
              Vos prochaines réservations apparaîtront ici.
            </p>
          ) : null}
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-bold text-[#0B1220]">Raccourcis</h3>
          <p className="text-sm text-[#98A2B3]">Accès rapide à votre espace</p>

          <div className="space-y-2 pt-1">
            {[
              {
                href: '/espace-client/tickets',
                label: 'Mes tickets',
                hint: `${bookings.length} billet${bookings.length !== 1 ? 's' : ''}`,
                icon: FaTicketAlt,
              },
              {
                href: '/espace-client/agenda',
                label: 'Agenda',
                hint: 'Calendrier',
                icon: FaCalendarAlt,
              },
              {
                href: '/events',
                label: 'Événements',
                hint: 'Réserver',
                icon: FaArrowRight,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-[18px] border border-transparent bg-white px-4 py-3.5 transition hover:border-[#0A89F2]/25 hover:bg-[#E8F3FE]/60"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F3FE] text-[#0A89F2] transition group-hover:bg-[#0A89F2] group-hover:text-white">
                    <Icon className="text-sm" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#0B1220]">
                      {item.label}
                    </span>
                    <span className="block text-xs text-[#98A2B3]">{item.hint}</span>
                  </span>
                  <FaArrowRight className="text-xs text-[#CBD5E1] transition group-hover:text-[#0A89F2]" />
                </Link>
              )
            })}
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
