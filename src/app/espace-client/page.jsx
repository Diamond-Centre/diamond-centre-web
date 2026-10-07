'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { eventTimingLabel, eventTimingPhase } from '@/lib/eventTiming'
import LoadError from '@/components/ui/LoadError'
import TileField from '@/components/espace-client/TileField'

function bookingDate(b) {
  return b.date || b.event_start_date || b.event_date || b.created_at
}

function bookingEvent(b) {
  return {
    start_date: b.event_start_date || b.date || b.event_date || b.start_date,
    end_date: b.event_end_date || b.end_date,
  }
}

function formatDay(value) {
  if (!value) return 'Date à confirmer'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const label = d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
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

function capitalizeName(value) {
  const s = String(value || '').trim()
  if (!s) return s
  // « STÉPHANE » → « Stéphane » ; les noms déjà mixtes sont laissés tels quels
  if (s === s.toUpperCase()) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
  return s
}

// « MOSSEBO STÉPHANE » (NOM Prénom) -> « Stéphane » ; « Jean Dupont » -> « Jean »
function pickFirstName(user) {
  if (user?.prenom) return user.prenom
  const parts = String(user?.name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'là'
  if (parts.length === 1) return parts[0]
  const isUpper = (w) => w === w.toUpperCase() && w !== w.toLowerCase()
  if (isUpper(parts[0])) {
    const mixed = parts.find((w) => !isUpper(w))
    return mixed || parts[parts.length - 1]
  }
  return parts[0]
}

function dayParts(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return { num: '—', month: '' }
  return {
    num: d.getDate(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
  }
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

  const { next, active, activeCount } = useMemo(() => {
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
      active: list,
      activeCount: upcoming.length + ongoing.length,
    }
  }, [bookings])

  const firstName = capitalizeName(pickFirstName(user))

  const todayLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const nextPhase = next ? eventTimingPhase(bookingEvent(next)) : null

  return (
    <div>
      {/* Salutation */}
      <header>
        <p className="ec-eyebrow">{todayLabel}</p>
        <h1 className="ec-h1">Bonjour, {firstName}.</h1>
        <p className="ec-lead">
          Votre prochaine expérience Diamond Centre et vos rendez-vous, en un coup d’œil.
        </p>
      </header>

      {/* Prochain rendez-vous */}
      <div style={{ marginTop: 32 }}>
        {loading ? (
          <div className="ec-card ec-loading" style={{ minHeight: 344 }}>
            Chargement de vos réservations…
          </div>
        ) : error ? (
          <LoadError onRetry={() => window.location.reload()} />
        ) : next ? (
          <section className="ec-hero">
            <TileField cols={15} rows={6} />
            <div className="ec-hero-body">
              <span className={`ec-pill ${nextPhase === 'ongoing' ? 'ec-pill--live' : 'ec-pill--soon'}`}>
                <span aria-hidden="true">●</span>
                {nextPhase === 'ongoing' ? 'En cours' : 'À venir'}
              </span>

              <h2 className="ec-hero-title">
                {next.title || next.event_title || 'Événement réservé'}
              </h2>

              <div className="ec-hero-meta">
                <div>
                  <span>
                    <span aria-hidden="true">▦</span>
                    {formatDay(bookingDate(next))}
                  </span>
                  {timeRange(next) ? (
                    <span>
                      <span aria-hidden="true">●</span>
                      {timeRange(next)}
                    </span>
                  ) : null}
                </div>
                {next.location || next.event_location ? (
                  <div>
                    <span>
                      <span aria-hidden="true">⌖</span>
                      {next.location || next.event_location}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="ec-hero-actions">
                <Link href="/espace-client/tickets" className="ec-btn ec-btn--white">
                  Voir mon billet →
                </Link>
                <Link href="/espace-client/agenda" className="ec-btn ec-btn--ghost">
                  Ouvrir l’agenda
                </Link>
              </div>
            </div>

            <div className="ec-hero-side">
              <small>Places</small>
              <strong>{next.quantity || 1}</strong>
              <span className={`ec-pill ${isPending(next.status) ? 'ec-pill--wait' : 'ec-pill--ok'}`}>
                {statusLabel(next.status)}
              </span>
              <span className="ec-pill ec-pill--info">
                {eventTimingLabel(bookingEvent(next))}
              </span>
            </div>
          </section>
        ) : (
          <section className="ec-hero ec-hero--empty">
            <TileField cols={15} rows={6} />
            <div className="ec-hero-body">
            <p className="ec-eyebrow">Commencer</p>
            <h2 className="ec-hero-title">Aucune réservation à venir ou en cours</h2>
            <p className="ec-card-sub" style={{ margin: '12px auto 0', maxWidth: 440 }}>
              Explorez les formations et conférences DiCe, puis réservez votre place en quelques secondes.
            </p>
            <div className="ec-hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/events" className="ec-btn ec-btn--white">
                Voir les événements →
              </Link>
            </div>
            </div>
          </section>
        )}
      </div>

      {/* À venir et en cours + raccourcis */}
      <div className="ec-overview">
        <section>
          <div className="ec-section-head">
            <div>
              <h2>À venir et en cours</h2>
              <p>
                {activeCount} réservation{activeCount !== 1 ? 's' : ''} active
                {activeCount !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/espace-client/tickets" className="ec-link">
              Tout voir
            </Link>
          </div>

          {!loading && !error && active.length > 0 ? (
            <div className="ec-panel">
              <ul className="ec-list">
                {active.map((b) => {
                  const phase = eventTimingPhase(bookingEvent(b))
                  const parts = dayParts(bookingDate(b))
                  const meta = [timeRange(b), b.location || b.event_location]
                    .filter(Boolean)
                    .join(' · ')
                  return (
                    <li key={b.id || b.ticket_id}>
                      <Link href="/espace-client/tickets" className="ec-item">
                        <div className="ec-date">
                          <b>{parts.num}</b>
                          <small>{parts.month}</small>
                        </div>
                        <div className="ec-item-body">
                          <span
                            className={`ec-pill ${phase === 'ongoing' ? 'ec-pill--ok' : 'ec-pill--blue'}`}
                          >
                            {eventTimingLabel(bookingEvent(b))}
                          </span>
                          <p className="ec-item-title" style={{ marginTop: 8 }}>
                            {b.title || b.event_title || 'Événement'}
                          </p>
                          <p className="ec-item-meta">{meta || formatDay(bookingDate(b))}</p>
                        </div>
                        <span className="ec-item-arrow" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {!loading && !error && active.length === 0 ? (
            <div className="ec-panel ec-panel--empty">
              Vos prochaines réservations apparaîtront ici.
            </div>
          ) : null}
        </section>

        <aside className="ec-shortcuts">
          <h3>Raccourcis</h3>
          <p>Accès rapide à votre espace</p>
          <ul>
            {[
              {
                href: '/espace-client/tickets',
                label: 'Mes tickets',
                hint: `${bookings.length} billet${bookings.length !== 1 ? 's' : ''}`,
              },
              { href: '/espace-client/agenda', label: 'Agenda', hint: 'Calendrier' },
              { href: '/events', label: 'Événements', hint: 'Réserver' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="ec-shortcut">
                  <span className="ec-shortcut-ico" aria-hidden="true">↗</span>
                  <span className="ec-shortcut-txt">
                    <b>{item.label}</b>
                    <small>{item.hint}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
