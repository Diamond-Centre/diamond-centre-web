'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaQrcode,
  FaSpinner,
  FaTimes,
  FaTicketAlt,
  FaTrash,
  FaUser,
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
  return true
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

function TicketShareBar({ ticket }) {
  const text = ticketShareText(ticket)
  const links = ticketShareLinks(text)
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const actions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: FaWhatsapp,
      className: 'bg-[#25D366] text-white',
      onClick: () => openShareWindow(links.whatsapp),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: FaFacebookF,
      className: 'bg-[#1877F2] text-white',
      onClick: () => openShareWindow(links.facebook),
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: FaTelegramPlane,
      className: 'bg-[#229ED9] text-white',
      onClick: () => openShareWindow(links.telegram),
    },
    {
      id: 'twitter',
      label: 'X',
      icon: FaTwitter,
      className: 'bg-[#0B1220] text-white',
      onClick: () => openShareWindow(links.twitter),
    },
    {
      id: 'email',
      label: 'Email',
      icon: FaEnvelope,
      className: 'bg-[#0A89F2] text-white',
      onClick: () => openShareWindow(links.email),
    },
    {
      id: 'copy',
      label: 'Copier',
      icon: FaCopy,
      className: 'bg-[#E8F3FE] text-[#0A89F2]',
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
      className: 'bg-[#F3F6FA] text-[#0B1220]',
      onClick: () => shareTicket(ticket),
    })
  }

  return (
    <div className="rounded-2xl border border-[#E8F3FE] bg-[#F7FBFF] p-3">
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2]">
        Partager sur les réseaux
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition hover:opacity-90 ${action.className}`}
            >
              <Icon className="text-base" />
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
  if (phase === 'ended') {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
        Passé
      </span>
    )
  }

  if (isScanned(ticket)) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#E8F3FE] px-2.5 py-0.5 text-[11px] font-semibold text-[#0A89F2]">
        Validé
      </span>
    )
  }

  if (isRefunded(status)) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
        Remboursé
      </span>
    )
  }

  if (isPending(status)) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FFF4DE] px-2.5 py-0.5 text-[11px] font-semibold text-[#B78103]">
        En attente
      </span>
    )
  }

  const label = eventTimingLabel(ticketEvent(ticket || {}))
  const className =
    phase === 'upcoming'
      ? 'bg-[#E8F3FE] text-[#0A89F2]'
      : 'bg-emerald-50 text-[#0B9B6B]'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  )
}

function TicketStub({ ticket, featured, onOpen, onDelete }) {
  const title = ticket.title || ticket.event_title || `Ticket #${ticket.id}`
  const day = new Date(ticketDate(ticket) || 0)
  const dayNum = Number.isNaN(day.getTime()) ? '—' : day.getDate()
  const month = Number.isNaN(day.getTime())
    ? ''
    : day.toLocaleDateString('fr-FR', { month: 'short' })
  const showDelete = canDeleteTicket(ticket)
  const past = ticketPhase(ticket) === 'ended'

  return (
    <motion.div
      role="button"
      tabIndex={0}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpen(ticket)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(ticket)
        }
      }}
      className={`group w-full cursor-pointer overflow-hidden text-left transition ${
        featured
          ? 'rounded-[28px] shadow-[0_20px_50px_rgba(10,137,242,0.22)]'
          : 'rounded-[22px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.04)] hover:border-[#0A89F2]/30 hover:shadow-[0_14px_32px_rgba(10,137,242,0.1)]'
      } ${past && !featured ? 'opacity-80' : ''}`}
    >
      {featured ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A89F2] via-[#0878d6] to-[#0057C2] text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-stretch sm:p-6">
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
                    Prochain billet
                  </span>
                  <StatusChip status={ticket.status} ticket={ticket} />
                  {isShareableTicket(ticket) ? (
                    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                      À partager
                    </span>
                  ) : null}
                </div>
                <h3 className="text-xl font-bold leading-snug sm:text-2xl">
                  {title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/95">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-1.5">
                  <FaCalendarAlt className="text-xs opacity-80" />
                  {formatDay(ticketDate(ticket))}
                </span>
                {timeRange(ticket) ? (
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-1.5">
                    <FaClock className="text-xs opacity-80" />
                    {timeRange(ticket)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="relative flex shrink-0 items-center gap-4 border-t border-dashed border-white/25 pt-4 sm:w-[140px] sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#0A89F2] shadow-lg sm:h-[88px] sm:w-[88px]">
                <FaQrcode className="text-2xl sm:text-3xl" />
              </div>
              <div className="sm:text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                  Places
                </p>
                <p className="text-2xl font-extrabold tabular-nums">
                  {ticket.quantity || 1}
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/15 bg-black/10 px-5 py-3 text-xs text-white/80 sm:px-6">
            <span className="font-mono tracking-[0.2em] font-semibold">
              {entryCodeOf(ticket) || qrPayload(ticket)}
            </span>
            <span className="inline-flex items-center gap-2">
              {showDelete ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(ticket)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-semibold text-white transition hover:bg-red-500"
                  aria-label="Supprimer ce ticket"
                >
                  <FaTrash className="text-[10px]" />
                  Supprimer
                </button>
              ) : null}
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                Afficher le QR
                <FaArrowRight className="text-[10px]" />
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[132px]">
          <div
            className={`flex w-[78px] shrink-0 flex-col items-center justify-center py-4 ${
              past ? 'bg-slate-100 text-slate-500' : 'bg-[#E8F3FE] text-[#0A89F2]'
            }`}
          >
            <span className="text-2xl font-extrabold leading-none">{dayNum}</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
              {month}
            </span>
            <div className="my-2 flex flex-col items-center gap-1">
              <span
                className={`h-1.5 w-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`}
              />
              <span
                className={`h-7 w-px ${past ? 'bg-slate-300' : 'bg-[#0A89F2]/35'}`}
              />
              <span
                className={`h-1.5 w-1.5 rounded-full ${past ? 'bg-slate-400' : 'bg-[#0A89F2]'}`}
              />
            </div>
            <FaTicketAlt className="text-xs opacity-60" />
          </div>

          {/* perforation */}
          <div className="relative w-0 shrink-0">
            <div className="absolute inset-y-3 left-0 w-px border-l border-dashed border-[#D0D5DD]" />
            <span className="absolute -left-2 top-0 h-4 w-4 -translate-y-1/2 rounded-full bg-[#F4F7FB]" />
            <span className="absolute -left-2 bottom-0 h-4 w-4 translate-y-1/2 rounded-full bg-[#F4F7FB]" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 pl-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <StatusChip status={ticket.status} ticket={ticket} />
                  {isShareableTicket(ticket) ? (
                    <span className="inline-flex items-center rounded-full bg-[#E8F3FE] px-2.5 py-0.5 text-[11px] font-semibold text-[#0A89F2]">
                      À partager
                    </span>
                  ) : null}
                </div>
                <h3 className="truncate text-[15px] font-semibold text-[#0B1220] group-hover:text-[#0A89F2]">
                  {title}
                </h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F6FA] text-[#0A89F2] transition group-hover:bg-[#E8F3FE]">
                <FaQrcode />
              </div>
            </div>
            <div className="space-y-1 text-sm text-[#667085]">
              {timeRange(ticket) ? (
                <p className="flex items-center gap-2">
                  <FaClock className="text-[10px] text-[#0A89F2]" />
                  {timeRange(ticket)}
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[10px] text-[#0A89F2]" />
                  {formatDayShort(ticketDate(ticket))}
                </p>
              )}
              {(ticket.location || ticket.event_location) && (
                <p className="flex items-center gap-2 truncate">
                  <FaMapMarkerAlt className="shrink-0 text-[10px] text-[#0A89F2]" />
                  <span className="truncate">
                    {ticket.location || ticket.event_location}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-[#F0F2F5] pt-2 text-xs text-[#98A2B3]">
              <span>1 place</span>
              <span className="inline-flex items-center gap-2">
                {showDelete ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(ticket)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-red-500 transition hover:bg-red-50"
                    aria-label="Supprimer ce ticket"
                  >
                    <FaTrash className="text-[10px]" />
                    Supprimer
                  </button>
                ) : null}
                <span className="inline-flex items-center gap-1 font-medium text-[#0A89F2] opacity-0 transition group-hover:opacity-100">
                  Voir le billet <FaArrowRight className="text-[9px]" />
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function TicketDetail({ ticket, onClose, onDelete }) {
  const [qrSrc, setQrSrc] = useState(null)
  const past = ticketPhase(ticket) === 'ended'
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A89F2] to-[#0057C2] px-6 pb-8 pt-5 text-white">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-white/75">
                Billet DiCe
              </p>
              <h3 className="text-lg font-bold leading-snug">
                {ticket.title || ticket.event_title || 'Événement'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={ticket.status} ticket={ticket} />
            {isShareableTicket(ticket) ? (
              <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                À partager
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative -mt-5 px-6">
          <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-5 shadow-[0_12px_40px_rgba(11,18,32,0.08)]">
            <div className="mx-auto flex h-[200px] w-[200px] items-center justify-center rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC]">
              {qrSrc ? (
                <Image
                  src={qrSrc}
                  alt="QR code du billet"
                  width={180}
                  height={180}
                  unoptimized
                />
              ) : (
                <FaSpinner className="animate-spin text-[#0A89F2]" />
              )}
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-wide text-[#98A2B3]">
              Code d&apos;entrée
            </p>
            <p className="mt-1 text-center font-mono text-2xl font-bold tracking-[0.25em] text-[#0A89F2]">
              {entryCodeOf(ticket) || '————————'}
            </p>
          </div>
        </div>

        <div className="space-y-3 px-6 py-6 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="mb-1 text-[11px] text-[#98A2B3]">Date</p>
              <p className="font-semibold capitalize text-[#0B1220]">
                {formatDay(ticketDate(ticket))}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F3F6FA] p-3">
              <p className="mb-1 text-[11px] text-[#98A2B3]">Horaire</p>
              <p className="font-semibold text-[#0B1220]">
                {timeRange(ticket) || 'À confirmer'}
              </p>
            </div>
          </div>

          {(ticket.location || ticket.event_location) && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#E8EEF5] p-3 text-[#667085]">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#0A89F2]" />
              <div>
                <p className="text-[11px] text-[#98A2B3]">Lieu</p>
                <p className="font-medium text-[#0B1220]">
                  {ticket.location || ticket.event_location}
                </p>
              </div>
            </div>
          )}

          {isShareableTicket(ticket) ? (
            <div className="rounded-2xl border border-[#E8F3FE] bg-[#F7FBFF] p-3 text-[#667085]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2]">
                Billet à partager
              </p>
              <p className="mt-1 text-sm">
                Ce billet n’a pas de nom. Envoyez le QR ou le code d’entrée à un ami, dans ou hors de l’application.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-2xl border border-[#E8EEF5] p-3 text-[#667085]">
              <FaUser className="mt-0.5 shrink-0 text-[#0A89F2]" />
              <div>
                <p className="text-[11px] text-[#98A2B3]">Participant</p>
                <p className="font-medium text-[#0B1220]">
                  {ticket.customer_name || ticket.customerName || '—'}
                </p>
                <p className="mt-0.5 text-xs">
                  1 place
                  {ticket.total_price != null
                    ? ` · ${Number(ticket.total_price).toLocaleString('fr-FR')} ${ticket.currency || 'XAF'}`
                    : ''}
                </p>
              </div>
            </div>
          )}

          {isShareableTicket(ticket) ? <TicketShareBar ticket={ticket} /> : null}

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-[#0A89F2] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0770cc]"
          >
            Fermer
          </button>
          {canDeleteTicket(ticket) ? (
            <button
              type="button"
              onClick={() => onDelete?.(ticket)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FaTrash className="text-xs" />
              Supprimer ce ticket
            </button>
          ) : isScanned(ticket) ? (
            <p className="text-center text-xs text-[#98A2B3]">
              Ce ticket a déjà été scanné et ne peut plus être supprimé.
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

export default function EspaceClientTicketsPage() {
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

  const featured =
    filter === 'upcoming' && filtered.length > 0 ? filtered[0] : null
  const list = featured ? filtered.slice(1) : filtered

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
    <div className="space-y-7">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
            Billets
          </p>
          <h1 className="mt-1 text-[2rem] font-extrabold tracking-tight text-[#0B1220]">
            Mes tickets
          </h1>
          <p className="mt-1 max-w-md text-[#667085]">
            Présentez le QR à l’entrée. Touchez un billet pour l’afficher.
          </p>
        </div>
        {!loading && !error ? (
          <div className="relative min-w-[148px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0A89F2] to-[#0057C2] p-[1px] shadow-[0_12px_28px_rgba(10,137,242,0.22)]">
            <div className="relative overflow-hidden rounded-[19px] bg-white px-4 py-3.5">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#0A89F2]/8" />
              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F3FE] text-[#0A89F2]">
                  <FaTicketAlt className="text-base" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#98A2B3]">
                    Billets
                  </p>
                  <p className="text-[1.75rem] font-extrabold leading-none tabular-nums text-[#0B1220]">
                    {tickets.length}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#667085]">
                    {counts.upcoming} à venir
                    {counts.ongoing > 0 ? ` · ${counts.ongoing} en cours` : ''}
                    {counts.past > 0 ? ` · ${counts.past} passé${counts.past > 1 ? 's' : ''}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </motion.header>

      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[#E8EEF5] bg-white p-1">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`inline-flex min-w-[5.5rem] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-[#0A89F2] text-white shadow-sm'
                  : 'text-[#667085] hover:bg-[#F3F6FA] hover:text-[#0B1220]'
              }`}
            >
              {f.label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                  active ? 'bg-white/20' : 'bg-[#F3F6FA] text-[#98A2B3]'
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-[28px] border border-[#E8EEF5] bg-white text-[#667085]">
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          Chargement des billets…
        </div>
      ) : error ? (
        <LoadError onRetry={() => window.location.reload()} />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-[#E8EEF5] bg-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(10,137,242,0.1),_transparent_55%)]" />
          <div className="relative px-6 py-14 text-center sm:py-16">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FE] text-[#0A89F2]">
              <FaTicketAlt className="text-xl" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0B1220]">
              {filter === 'past'
                ? 'Aucun billet passé'
                : filter === 'ongoing'
                  ? 'Aucun billet en cours'
                  : filter === 'upcoming'
                    ? 'Aucun billet à venir'
                    : 'Aucun billet'}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#667085]">
              {filter === 'past'
                ? 'Vos événements terminés apparaîtront dans cet onglet.'
                : 'Réservez un événement DiCe pour recevoir votre billet ici.'}
            </p>
            {filter !== 'past' && (
              <Link
                href="/events"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#0A89F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(10,137,242,0.28)] transition hover:bg-[#0770cc]"
              >
                Voir les événements
                <FaArrowRight className="text-xs" />
              </Link>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {featured ? (
            <TicketStub
              ticket={featured}
              featured
              onOpen={setSelected}
              onDelete={requestDelete}
            />
          ) : null}

          {list.length > 0 ? (
            <ul className="space-y-3">
              {list.map((t, i) => (
                <li key={t.id || t.ticket_id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <TicketStub
                      ticket={t}
                      onOpen={setSelected}
                      onDelete={requestDelete}
                    />
                  </motion.div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

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
          'Cette action est irréversible. La place sera libérée si le ticket n’a pas encore été utilisé.'
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
