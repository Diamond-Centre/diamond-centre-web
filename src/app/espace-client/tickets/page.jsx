'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaSpinner,
  FaTimes,
  FaTrash,
  FaWhatsapp,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
  FaEnvelope,
  FaCopy,
  FaEllipsisH,
} from 'react-icons/fa'
import QRCode from 'qrcode'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import { ticketStore } from '@/lib/ticketStore'
import { eventTimingLabel, eventTimingPhase } from '@/lib/eventTiming'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import LoadError from '@/components/ui/LoadError'
import toast from 'react-hot-toast'

const FILTERS = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'ongoing', label: 'En cours' },
  { id: 'past', label: 'Passés' },
  { id: 'all', label: 'Tous' },
]

function ticketDate(t) {
  return t.date || t.event_start_date || t.event_date || t.created_at
}

function formatDay(value) {
  if (!value) return 'Date à confirmer'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDayShort(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

function timeRange(t) {
  if (t.start && t.end) return `${t.start} – ${t.end}`
  if (t.time) return t.time
  if (t.event_start_time && t.event_end_time) {
    return `${t.event_start_time} – ${t.event_end_time}`
  }
  return null
}

function entryCodeOf(t) {
  const raw =
    t.entry_code ||
    (Array.isArray(t.qr_codes) && t.qr_codes[0] && typeof t.qr_codes[0] === 'object'
      ? t.qr_codes[0].entry_code
      : null)
  if (!raw) return null
  return String(raw).replace(/\D/g, '').padStart(8, '0').slice(-8)
}

/** Value encoded in / shown for the QR — always the 8-digit entry code when available */
function qrPayload(t) {
  return (
    entryCodeOf(t) ||
    t.qr_code ||
    t.ticketCode ||
    (Array.isArray(t.qr_codes) && t.qr_codes[0]
      ? typeof t.qr_codes[0] === 'string'
        ? t.qr_codes[0]
        : t.qr_codes[0].code
      : null) ||
    `DC-${t.id || t.ticket_id}`
  )
}

function isPending(status) {
  const s = String(status || '').toLowerCase()
  return s === 'pending' || s === 'awaiting_payment'
}

function isScanned(ticket) {
  return String(ticket?.status || '').toLowerCase() === 'scanne'
}

function isRefunded(status) {
  const s = String(status || '').toLowerCase()
  return s === 'rembourse' || s === 'refunded'
}

function canDeleteTicket(ticket) {
  if (!ticket) return false
  if (isScanned(ticket)) return false
  if (ticket.certificate_id || ticket.certificate || ticket.has_certificate) {
    return false
  }
  return ticketPhase(ticket) === 'ended'
}

function ticketIdOf(ticket) {
  return ticket?.id || ticket?.ticket_id
}

function ticketEvent(t) {
  return {
    end_date: t.event_end_date || t.end_date,
    start_date: t.event_start_date || t.date || t.event_date || t.start_date,
  }
}

function ticketPhase(t) {
  return eventTimingPhase(ticketEvent(t))
}

function isShareableTicket(t) {
  if (!t) return false
  if (t.shareable === true) return true
  return !String(t.customer_name || t.customerName || '').trim()
}

function ticketShareText(ticket) {
  const code = entryCodeOf(ticket) || qrPayload(ticket)
  const title = ticket.title || ticket.event_title || 'Événement'
  return `Billet DiCe — ${title}\nCode d’entrée : ${code}\nPrésentez ce code ou le QR à l’entrée.`
}

function ticketShareLinks(text) {
  const encoded = encodeURIComponent(text)
  const site =
    typeof window !== 'undefined' ? window.location.origin : 'https://diamond-centre.vercel.app'
  return {
    whatsapp: `https://wa.me/?text=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(site)}&quote=${encoded}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(site)}&text=${encoded}`,
    twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
    email: `mailto:?subject=${encodeURIComponent('Billet DiCe')}&body=${encoded}`,
  }
}

function openShareWindow(url) {
  if (url.startsWith('mailto:')) {
    window.location.href = url
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=720')
}

async function copyShareText(text) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    el.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

async function shareTicket(ticket) {
  const text = ticketShareText(ticket)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'Billet DiCe', text })
      return true
    } catch (err) {
      if (err?.name === 'AbortError') return true
    }
  }
  return false
}


// « SAVE THE DATE » : image exacte de la maquette, qui s'écrit puis s'efface en boucle (cf. CSS .ec-std)
function SaveTheDate() {
  return (
    <div className="ec-std" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/espace-client/save-the-date.png"
        srcSet="/espace-client/save-the-date.png 1x, /espace-client/save-the-date@2x.png 2x"
        alt=""
        width={376}
        height={43}
        draggable={false}
      />
    </div>
  )
}

function TicketShareBar({ ticket }) {
  const text = ticketShareText(ticket)
  const links = ticketShareLinks(text)
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const actions = [
    { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, bg: '#25D366', onClick: () => openShareWindow(links.whatsapp) },
    { id: 'facebook', label: 'Facebook', icon: FaFacebookF, bg: '#1877F2', onClick: () => openShareWindow(links.facebook) },
    { id: 'telegram', label: 'Telegram', icon: FaTelegramPlane, bg: '#229ED9', onClick: () => openShareWindow(links.telegram) },
    { id: 'twitter', label: 'X', icon: FaTwitter, bg: '#0B1220', onClick: () => openShareWindow(links.twitter) },
    { id: 'email', label: 'Email', icon: FaEnvelope, bg: '#118cff', onClick: () => openShareWindow(links.email) },
    {
      id: 'copy',
      label: 'Copier',
      icon: FaCopy,
      bg: 'rgba(255,255,255,0.12)',
      onClick: async () => {
        const copied = await copyShareText(text)
        if (copied) toast.success('Code d’entrée copié.')
        else toast.error('Impossible de copier le code.')
      },
    },
  ]

  if (canNativeShare) {
    actions.push({
      id: 'more',
      label: 'Plus',
      icon: FaEllipsisH,
      bg: 'rgba(255,255,255,0.12)',
      onClick: () => shareTicket(ticket),
    })
  }

  return (
    <div className="ec-tile">
      <p className="ec-tile-label" style={{ textAlign: 'center' }}>Partager sur les réseaux</p>
      <div className="ec-share">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              style={{ background: action.bg }}
            >
              <Icon />
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StatusChip({ status, ticket }) {
  const phase = ticketPhase(ticket || {})

  // Date wins over payment state so past tickets never stay "En attente"
  if (phase === 'ended') return <span className="ec-pill ec-pill--past">Passé</span>
  if (isScanned(ticket)) return <span className="ec-pill ec-pill--blue">Validé</span>
  if (isRefunded(status)) return <span className="ec-pill ec-pill--past">Remboursé</span>
  if (isPending(status)) return <span className="ec-pill ec-pill--wait">En attente</span>

  const label = eventTimingLabel(ticketEvent(ticket || {}))
  return (
    <span className={`ec-pill ${phase === 'upcoming' ? 'ec-pill--blue' : 'ec-pill--ok'}`}>
      {label}
    </span>
  )
}

function TicketStub({ ticket, onOpen, onDelete }) {
  const title = ticket.title || ticket.event_title || `Ticket #${ticket.id}`
  const day = new Date(ticketDate(ticket) || 0)
  const validDay = !Number.isNaN(day.getTime())
  const dayNum = validDay ? day.getDate() : '—'
  const month = validDay
    ? day.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()
    : ''
  const showDelete = canDeleteTicket(ticket)
  const place = ticket.location || ticket.event_location
  const meta = [timeRange(ticket) || formatDayShort(ticketDate(ticket)), place]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(ticket)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(ticket)
        }
      }}
      className="ec-item ec-item--lg"
      style={{ opacity: ticketPhase(ticket) === 'ended' ? 0.85 : 1 }}
    >
      <div className="ec-date">
        <b>{dayNum}</b>
        <small>{month}</small>
      </div>
      <div className="ec-item-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <StatusChip status={ticket.status} ticket={ticket} />
          {isShareableTicket(ticket) ? (
            <span className="ec-pill ec-pill--blue">À partager</span>
          ) : null}
        </div>
        <p className="ec-item-title" style={{ marginTop: 8 }}>{title}</p>
        <p className="ec-item-meta">{meta}</p>
      </div>
      {showDelete ? (
        <button
          type="button"
          className="ec-del"
          aria-label="Supprimer ce ticket"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(ticket)
          }}
        >
          <FaTrash />
          Supprimer
        </button>
      ) : null}
      <span className="ec-item-arrow" aria-hidden="true">→</span>
    </div>
  )
}

function TicketDetail({ ticket, onClose, onDelete }) {
  const [qrSrc, setQrSrc] = useState(null)
  const code = qrPayload(ticket)

  useEffect(() => {
    let cancelled = false
    async function build() {
      try {
        const dataUrl = await QRCode.toDataURL(String(code), {
          width: 280,
          margin: 2,
          color: { dark: '#0B1220', light: '#FFFFFF' },
        })
        if (!cancelled) setQrSrc(dataUrl)
      } catch {
        if (!cancelled) setQrSrc(null)
      }
    }
    build()
    return () => {
      cancelled = true
    }
  }, [code])

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
            <p className="ec-eyebrow">Billet DiCe</p>
            <h3>{ticket.title || ticket.event_title || 'Événement'}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <StatusChip status={ticket.status} ticket={ticket} />
              {isShareableTicket(ticket) ? (
                <span className="ec-pill ec-pill--blue">À partager</span>
              ) : null}
            </div>
          </div>
          <button type="button" onClick={onClose} className="ec-modal-close" aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        <div className="ec-modal-body">
          <div className="ec-qr">
            <div className="ec-qr-box">
              {qrSrc ? (
                <Image src={qrSrc} alt="QR code du billet" width={180} height={180} unoptimized />
              ) : (
                <FaSpinner className="animate-spin" style={{ color: '#118cff' }} />
              )}
            </div>
            <p className="ec-tile-label" style={{ textAlign: 'center', marginTop: 12 }}>Code d’entrée</p>
            <p className="ec-qr-code">{entryCodeOf(ticket) || '————————'}</p>
          </div>

          <div className="ec-tiles2">
            <div className="ec-tile">
              <p className="ec-tile-label">Date</p>
              <p className="ec-tile-value" style={{ textTransform: 'capitalize' }}>
                {formatDay(ticketDate(ticket))}
              </p>
            </div>
            <div className="ec-tile">
              <p className="ec-tile-label">Horaire</p>
              <p className="ec-tile-value">{timeRange(ticket) || 'À confirmer'}</p>
            </div>
          </div>

          {(ticket.location || ticket.event_location) && (
            <div className="ec-tile">
              <p className="ec-tile-label">Lieu</p>
              <p className="ec-tile-value">{ticket.location || ticket.event_location}</p>
            </div>
          )}

          {isShareableTicket(ticket) ? (
            <div className="ec-tile">
              <p className="ec-tile-label">Billet à partager</p>
              <p className="ec-tile-text">
                Acheté par vous
                {ticket.customer_email ? ` (${ticket.customer_email})` : ''}. Ce billet n’a pas de nom — envoyez le QR ou le code d’entrée à un ami.
              </p>
            </div>
          ) : (
            <div className="ec-tile">
              <p className="ec-tile-label">Participant</p>
              <p className="ec-tile-value">{ticket.customer_name || ticket.customerName || '—'}</p>
              <p className="ec-tile-text">
                1 place
                {ticket.total_price != null
                  ? ` · ${Number(ticket.total_price).toLocaleString('fr-FR')} ${ticket.currency || 'XAF'}`
                  : ''}
              </p>
            </div>
          )}

          {isShareableTicket(ticket) ? <TicketShareBar ticket={ticket} /> : null}

          <button type="button" onClick={onClose} className="ec-btn ec-btn--sky" style={{ width: '100%' }}>
            Fermer
          </button>
          {canDeleteTicket(ticket) ? (
            <button
              type="button"
              onClick={() => onDelete?.(ticket)}
              className="ec-btn ec-btn--danger"
              style={{ width: '100%' }}
            >
              <FaTrash />
              Supprimer ce ticket
            </button>
          ) : isScanned(ticket) ? (
            <p className="ec-modal-note">Ce ticket a déjà été scanné et ne peut plus être supprimé.</p>
          ) : ticketPhase(ticket) !== 'ended' ? (
            <p className="ec-modal-note">Vous pourrez supprimer ce ticket une fois l’événement passé.</p>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

export default function EspaceClientTicketsPage() {
  const searchParams = useSearchParams()
  const focusTicketId = searchParams?.get('ticket')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('upcoming')
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const token = auth.getToken()
        const list = await api.getMyBookings(token)
        if (!cancelled) {
          setTickets(list)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Impossible de charger vos tickets')
          setTickets([])
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

  useEffect(() => {
    if (!focusTicketId || tickets.length === 0) return
    const match = tickets.find(
      (t) => String(ticketIdOf(t)) === String(focusTicketId)
    )
    if (!match) return
    setFilter('all')
    setSelected(match)
  }, [focusTicketId, tickets])

  const sorted = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const ta = new Date(ticketDate(a) || 0).getTime()
      const tb = new Date(ticketDate(b) || 0).getTime()
      return ta - tb
    })
  }, [tickets])

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    if (filter === 'past') return sorted.filter((t) => ticketPhase(t) === 'ended').reverse()
    if (filter === 'ongoing') return sorted.filter((t) => ticketPhase(t) === 'ongoing')
    return sorted.filter((t) => ticketPhase(t) === 'upcoming')
  }, [sorted, filter])


  const counts = useMemo(
    () => ({
      upcoming: sorted.filter((t) => ticketPhase(t) === 'upcoming').length,
      ongoing: sorted.filter((t) => ticketPhase(t) === 'ongoing').length,
      past: sorted.filter((t) => ticketPhase(t) === 'ended').length,
      all: sorted.length,
    }),
    [sorted]
  )

  function requestDelete(ticket) {
    setDeleteError(null)
    setDeleteTarget(ticket)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const id = ticketIdOf(deleteTarget)
    try {
      setDeleting(true)
      setDeleteError(null)
      await api.deleteTicket(id, auth.getToken())
      ticketStore.remove(id)
      setTickets((prev) =>
        prev.filter((t) => Number(ticketIdOf(t)) !== Number(id))
      )
      if (selected && Number(ticketIdOf(selected)) === Number(id)) {
        setSelected(null)
      }
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.message || 'Impossible de supprimer ce ticket')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <section className="ec-card ec-card--pad">
        <SaveTheDate />
        <div className="ec-card-head">
          <div>
            <p className="ec-eyebrow">Billets</p>
            <h1 className="ec-card-title">Mes tickets</h1>
            <p className="ec-card-sub">
              Présentez le QR à l’entrée. Touchez un billet pour l’afficher.
            </p>
          </div>
          {!loading && !error ? (
            <div className="ec-stat">
              <small>Billets</small>
              <strong>{tickets.length}</strong>
              <em>
                {counts.upcoming} à venir
                {counts.ongoing > 0 ? ` · ${counts.ongoing} en cours` : ''}
                {counts.past > 0 ? ` · ${counts.past} passé${counts.past > 1 ? 's' : ''}` : ''}
              </em>
            </div>
          ) : null}
        </div>

        <div className="ec-filters" role="group" aria-label="Filtrer les billets">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="ec-filter"
              aria-pressed={filter === f.id}
              onMouseEnter={() => setFilter(f.id)}
              onFocus={() => setFilter(f.id)}
              onClick={() => setFilter(f.id)}
            >
              {filter === f.id ? (
                <motion.span
                  layoutId="ec-filter-pill"
                  className="ec-filter-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span>{f.label}</span>
              <i>{counts[f.id]}</i>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          {loading ? (
            <div className="ec-loading">
              <FaSpinner className="animate-spin" />
              Chargement des billets…
            </div>
          ) : error ? (
            <LoadError onRetry={() => window.location.reload()} />
          ) : filtered.length === 0 ? (
            <div className="ec-empty">
              <div className="ec-empty-ico" aria-hidden="true">▣</div>
              <h3>
                {filter === 'past'
                  ? 'Aucun billet passé'
                  : filter === 'ongoing'
                    ? 'Aucun billet en cours'
                    : filter === 'upcoming'
                      ? 'Aucun billet à venir'
                      : 'Aucun billet'}
              </h3>
              <p>
                {filter === 'past'
                  ? 'Vos événements terminés apparaîtront dans cet onglet.'
                  : 'Réservez un événement DiCe pour recevoir votre billet ici.'}
              </p>
              {filter !== 'past' && (
                <Link href="/events" className="ec-btn ec-btn--sky">
                  Voir les événements →
                </Link>
              )}
            </div>
          ) : (
            <ul className="ec-list ec-list--loose">
              {filtered.map((t) => (
                <li key={t.id || t.ticket_id}>
                  <TicketStub ticket={t} onOpen={setSelected} onDelete={requestDelete} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected ? (
          <TicketDetail
            ticket={selected}
            onClose={() => setSelected(null)}
            onDelete={requestDelete}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer ce ticket"
        message={
          deleteError ||
          'Cette action est irréversible. Seuls les billets d’événements déjà passés peuvent être supprimés.'
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (deleting) return
          setDeleteTarget(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
