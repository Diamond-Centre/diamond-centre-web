/**
 * Gestion des tickets — design DiCe + pagination + QR
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTicketAlt, FaSearch, FaSync,
  FaCheckCircle, FaTimesCircle, FaClock,
  FaUser, FaEnvelope, FaPhone, FaCalendar,
  FaDownload, FaQrcode, FaTimes, FaUndo,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

const PAGE_SIZE = 8

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'confirmed', label: 'Confirmés' },
  { id: 'pending', label: 'En attente' },
  { id: 'cancelled', label: 'Annulés' },
  { id: 'refunded', label: 'Remboursés' },
]

function statusMeta(status) {
  switch (String(status || '').toLowerCase()) {
    case 'confirmed':
    case 'paid':
    case 'payé':
      return {
        label: 'Confirmé',
        className: 'bg-emerald-50 text-[#0B9B6B]',
        icon: FaCheckCircle,
        tone: 'text-[#0B9B6B]',
        rail: 'bg-emerald-50',
      }
    case 'pending':
    case 'en_attente':
      return {
        label: 'En attente',
        className: 'bg-[#FFF4DE] text-[#B78103]',
        icon: FaClock,
        tone: 'text-[#B78103]',
        rail: 'bg-[#FFF8E8]',
      }
    case 'cancelled':
    case 'annulé':
      return {
        label: 'Annulé',
        className: 'bg-red-50 text-red-600',
        icon: FaTimesCircle,
        tone: 'text-red-600',
        rail: 'bg-red-50',
      }
    case 'refunded':
      return {
        label: 'Remboursé',
        className: 'bg-slate-100 text-slate-600',
        icon: FaUndo,
        tone: 'text-slate-600',
        rail: 'bg-slate-50',
      }
    default:
      return {
        label: status || '—',
        className: 'bg-[#E8F3FE] text-[#0A89F2]',
        icon: FaTicketAlt,
        tone: 'text-[#0A89F2]',
        rail: 'bg-[#E8F3FE]',
      }
  }
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(amount, currency = 'FCFA') {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  return `${n.toLocaleString('fr-FR')} ${currency}`
}

function initialOf(name) {
  const t = (name || '').trim()
  return t ? t[0].toUpperCase() : '?'
}

function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)
  const pages = []
  const window = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-sm text-[#667085]">
        Affichage <span className="font-semibold text-[#0B1220]">{from}–{to}</span> sur{' '}
        <span className="font-semibold text-[#0B1220]">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="w-10 h-10 rounded-xl border border-[#E8EEF5] bg-white text-[#667085] hover:bg-[#F3F6FA] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} className="w-8 text-center text-[#98A2B3]">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-10 h-10 px-2 rounded-xl text-sm font-bold transition-colors ${
                p === page
                  ? 'bg-[#0A89F2] text-white shadow-[0_6px_16px_rgba(10,137,242,0.3)]'
                  : 'border border-[#E8EEF5] bg-white text-[#667085] hover:bg-[#F3F6FA]'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="w-10 h-10 rounded-xl border border-[#E8EEF5] bg-white text-[#667085] hover:bg-[#F3F6FA] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

function TicketCard({ ticket, index, onShowQr }) {
  const meta = statusMeta(ticket.status)
  const StatusIcon = meta.icon
  const qr = ticket.qr_codes?.[0]
  const entryCode =
    typeof qr === 'object' && qr?.entry_code
      ? String(qr.entry_code).padStart(8, '0').slice(-8)
      : ticket.entry_code
        ? String(ticket.entry_code).padStart(8, '0').slice(-8)
        : null
  const qrCode = entryCode
  const validated = typeof qr === 'object' && qr?.validated

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.28 }}
      className="group flex overflow-hidden rounded-[22px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.04)] hover:shadow-[0_14px_32px_rgba(10,137,242,0.12)] hover:border-[#0A89F2]/35 transition-all"
    >
      <div className={`w-[88px] sm:w-[96px] shrink-0 flex flex-col items-center justify-center py-5 px-2 ${meta.rail}`}>
        <div
          className={`w-11 h-11 rounded-2xl bg-white flex items-center justify-center font-extrabold text-sm shadow-sm ${meta.tone}`}
        >
          {initialOf(ticket.customer_name)}
        </div>
        <p className="mt-2 text-[11px] font-bold text-[#98A2B3]">#{ticket.id}</p>
        {entryCode && (
          <p className="mt-1 font-mono text-[10px] font-bold tracking-wider text-[#0A89F2]">
            {entryCode}
          </p>
        )}
      </div>

      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-[#0B1220] text-[15px] truncate">
                {ticket.customer_name || 'Client'}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.className}`}>
                <StatusIcon className="text-[10px]" />
                {meta.label}
              </span>
              {validated && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0B9B6B]">
                  QR validé
                </span>
              )}
            </div>
            <p className="text-sm text-[#667085] line-clamp-1">
              {ticket.event_title || 'Événement'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-[#0A89F2]">
              {formatPrice(ticket.total_price, ticket.currency || 'FCFA')}
            </p>
            <p className="text-[11px] text-[#98A2B3] mt-0.5">
              {formatDate(ticket.created_at)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-[#667085]">
          <p className="flex items-center gap-2 truncate">
            <FaEnvelope className="text-[#0A89F2] text-xs shrink-0" />
            {ticket.customer_email || '—'}
          </p>
          <p className="flex items-center gap-2 truncate">
            <FaPhone className="text-[#0A89F2] text-xs shrink-0" />
            {ticket.customer_phone || '—'}
          </p>
          <p className="flex items-center gap-2 truncate sm:col-span-2">
            <FaCalendar className="text-[#0A89F2] text-xs shrink-0" />
            Réservé le {formatDate(ticket.created_at)}
            {ticket.event_start_date ? ` · Événement ${formatDate(ticket.event_start_date)}` : ''}
          </p>
        </div>

        {qrCode && (
          <div className="flex items-center gap-2">
            <FaQrcode className="text-[#0A89F2] text-xs" />
            <code className="text-[11px] font-mono bg-[#F3F6FA] text-[#667085] px-2 py-1 rounded-lg truncate max-w-full">
              {qrCode}
            </code>
          </div>
        )}

        <div className="mt-auto pt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onShowQr(ticket)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0A89F2] hover:bg-[#0770cc] transition-colors inline-flex items-center justify-center gap-2"
          >
            <FaQrcode className="text-xs" />
            Voir QR
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default function AdminTickets() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrCodeImage, setQrCodeImage] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getTickets(token)
      setTickets(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Erreur lors du chargement des tickets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadTickets()
  }, [router, loadTickets])

  const counts = useMemo(() => {
    const map = {
      all: tickets.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
    }
    for (const t of tickets) {
      const s = String(t.status || '').toLowerCase()
      if (s === 'paid' || s === 'payé') map.confirmed += 1
      else if (map[s] != null) map[s] += 1
    }
    return map
  }, [tickets])

  const filteredTickets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const status = String(ticket.status || '').toLowerCase()
      if (statusFilter === 'confirmed') {
        if (!['confirmed', 'paid', 'payé'].includes(status)) return false
      } else if (statusFilter !== 'all' && status !== statusFilter) {
        return false
      }
      if (!q) return true
      return (
        ticket.customer_name?.toLowerCase().includes(q) ||
        ticket.customer_email?.toLowerCase().includes(q) ||
        ticket.customer_phone?.toLowerCase().includes(q) ||
        ticket.event_title?.toLowerCase().includes(q) ||
        String(ticket.id).includes(q) ||
        ticket.qr_codes?.[0]?.entry_code?.includes(q) ||
        ticket.qr_codes?.[0]?.code?.toLowerCase().includes(q) ||
        String(ticket.entry_code || '').includes(q)
      )
    })
  }, [tickets, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageTickets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTickets.slice(start, start + PAGE_SIZE)
  }, [filteredTickets, page])

  const revenue = useMemo(() => {
    return tickets
      .filter((t) => ['confirmed', 'paid', 'payé'].includes(String(t.status || '').toLowerCase()))
      .reduce((sum, t) => sum + (Number(t.total_price) || 0), 0)
  }, [tickets])

  const generateQRCode = async (ticket) => {
    try {
      setQrLoading(true)
      const entry =
        ticket.entry_code ||
        (typeof ticket.qr_codes?.[0] === 'object'
          ? ticket.qr_codes[0]?.entry_code
          : null)
      const code = entry
        ? String(entry).replace(/\D/g, '').padStart(8, '0').slice(-8)
        : ticket.qr_codes?.[0]?.code ||
          (typeof ticket.qr_codes?.[0] === 'string' ? ticket.qr_codes[0] : null) ||
          `DC-${ticket.id}`

      const qrImage = await QRCode.toDataURL(String(code), {
        width: 360,
        margin: 2,
        color: { dark: '#0a89f2', light: '#ffffff' },
      })
      setQrCodeImage(qrImage)
      setSelectedTicket({ ...ticket, entry_code: code })
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération du QR code')
    } finally {
      setQrLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCodeImage || !selectedTicket) return
    const link = document.createElement('a')
    link.download = `ticket-${selectedTicket.id}-qr.png`
    link.href = qrCodeImage
    link.click()
    toast.success('QR code téléchargé')
  }

  const closeQr = () => {
    setSelectedTicket(null)
    setQrCodeImage(null)
  }

  return (
    <div className="relative -m-6 min-h-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#0A89F2]/[0.07] blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-[#0A89F2]/[0.05] blur-3xl" />
      </div>

      <div className="relative p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A89F2] mb-1">
              Diamond Centre
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1220] tracking-tight">
              Tickets
            </h1>
            <p className="text-[#667085] text-sm mt-1">
              Réservations, statuts et QR codes des participants
            </p>
          </div>
          <button
            type="button"
            onClick={loadTickets}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl border border-[#E8EEF5] bg-white text-sm font-medium text-[#667085] hover:bg-[#F3F6FA] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Rafraîchir
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: counts.all, tone: 'text-[#0A89F2]' },
            { label: 'Confirmés', value: counts.confirmed, tone: 'text-[#0B9B6B]' },
            { label: 'En attente', value: counts.pending, tone: 'text-[#B78103]' },
            {
              label: 'Revenus confirmés',
              value: formatPrice(revenue),
              tone: 'text-[#0B1220]',
              small: true,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[20px] border border-[#E8EEF5] bg-white/90 backdrop-blur-sm px-4 py-3.5 shadow-[0_4px_16px_rgba(11,18,32,0.03)]"
            >
              <p className={`${kpi.small ? 'text-lg' : 'text-2xl'} font-extrabold tracking-tight ${kpi.tone}`}>
                {kpi.value}
              </p>
              <p className="text-xs font-medium text-[#98A2B3] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-4 shadow-[0_8px_24px_rgba(11,18,32,0.04)] space-y-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] text-sm" />
            <input
              type="text"
              placeholder="Rechercher nom, email, téléphone, événement, ID, QR…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm focus:ring-2 focus:ring-[#0A89F2]/30 focus:border-[#0A89F2] focus:bg-white outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  statusFilter === f.id
                    ? 'bg-[#0A89F2] text-white'
                    : 'bg-[#F3F6FA] text-[#667085] hover:bg-[#E8F3FE] hover:text-[#0A89F2]'
                }`}
              >
                {f.label}
                {f.id !== 'all' && counts[f.id] != null ? ` (${counts[f.id]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button type="button" onClick={loadTickets} className="ml-3 underline font-medium">
              Réessayer
            </button>
          </div>
        )}

        {loading && tickets.length === 0 ? (
          <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-16 text-center text-[#667085]">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#0A89F2] border-t-transparent" />
            Chargement des tickets…
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#D0D5DD] bg-white/80 p-14 text-center">
            <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-[#E8F3FE] text-[#0A89F2] flex items-center justify-center">
              <FaTicketAlt className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1220] mb-1">Aucun ticket</h3>
            <p className="text-sm text-[#667085]">
              {tickets.length === 0
                ? 'Aucune réservation pour le moment.'
                : 'Aucun résultat pour ces filtres.'}
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {pageTickets.map((ticket, index) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    onShowQr={generateQRCode}
                  />
                ))}
              </div>
            </AnimatePresence>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={filteredTickets.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedTicket && qrCodeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeQr}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-[28px] shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#0A89F2] to-[#0057C2] px-5 pt-5 pb-6 text-white">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
                      QR Code DiCe
                    </p>
                    <h3 className="text-lg font-extrabold">Ticket #{selectedTicket.id}</h3>
                    <p className="text-sm text-white/90 mt-1 line-clamp-1">
                      {selectedTicket.event_title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeQr}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                    aria-label="Fermer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-[20px] border border-[#E8EEF5] bg-[#F8FAFC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeImage} alt="QR Code" className="w-56 h-56" />
                    <p className="mt-3 text-center text-[11px] uppercase tracking-wide text-[#98A2B3]">
                      Code d&apos;entrée
                    </p>
                    <p className="mt-1 text-center font-mono text-2xl font-bold tracking-[0.25em] text-[#0A89F2]">
                      {String(
                        selectedTicket.entry_code ||
                          selectedTicket.qr_codes?.[0]?.entry_code ||
                          '--------'
                      )
                        .replace(/\D/g, '')
                        .padStart(8, '0')
                        .slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8EEF5] p-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-[#667085]">
                    <FaUser className="text-[#0A89F2] text-xs" />
                    <span className="font-medium text-[#0B1220]">{selectedTicket.customer_name}</span>
                  </p>
                  <p className="flex items-center gap-2 text-[#667085]">
                    <FaEnvelope className="text-[#0A89F2] text-xs" />
                    {selectedTicket.customer_email || '—'}
                  </p>
                  <p className="text-[#667085]">
                    Total{' '}
                    <span className="font-bold text-[#0A89F2]">
                      {formatPrice(selectedTicket.total_price, selectedTicket.currency || 'FCFA')}
                    </span>
                    {' · '}×{selectedTicket.quantity || 1}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadQR}
                    disabled={qrLoading}
                    className="flex-1 py-3 rounded-2xl bg-[#0A89F2] text-white text-sm font-bold hover:bg-[#0770cc] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Télécharger
                  </button>
                  <button
                    type="button"
                    onClick={closeQr}
                    className="px-5 py-3 rounded-2xl border border-[#E8EEF5] text-sm font-semibold text-[#667085] hover:bg-[#F3F6FA]"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
