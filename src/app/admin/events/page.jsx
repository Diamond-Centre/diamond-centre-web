/**
 * Gestion des événements — design DiCe + pagination
 */
'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlus, FaEye, FaEdit, FaTrash, FaCalendar,
  FaMapMarkerAlt, FaUsers, FaTicketAlt, FaSearch,
  FaSync, FaSpinner, FaTag, FaChevronLeft, FaChevronRight, FaSortAmountDown,
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import EventLightbox from '@/components/events/EventLightbox'
import toast from 'react-hot-toast'

const PAGE_SIZE = 12

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'published', label: 'Publiés' },
  { id: 'draft', label: 'Brouillons' },
  { id: 'cancelled', label: 'Annulés' },
  { id: 'completed', label: 'Terminés' },
]

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'conference', label: 'Conférence' },
  { id: 'formation', label: 'Formation' },
  { id: 'seminaire', label: 'Séminaire' },
  { id: 'atelier', label: 'Atelier' },
  { id: 'webinaire', label: 'Webinaire' },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function getImageUrl(event) {
  if (!event) return null

  let rawUrl =
    event.image_url ||
    event.imageUrl ||
    (typeof event.image === 'string' ? event.image : event.image?.url || event.image?.path) ||
    event.images?.[0]?.url ||
    event.images?.[0]

  if (!rawUrl || typeof rawUrl !== 'string') return null

  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('data:')) {
    const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
    rawUrl = `${API_BASE_URL}${cleanPath}`
  }

  const updatedAt = event.updated_at || event.updatedAt
  if (updatedAt) {
    const time = new Date(updatedAt).getTime()
    if (!Number.isNaN(time)) {
      const separator = rawUrl.includes('?') ? '&' : '?'
      return `${rawUrl}${separator}v=${time}`
    }
  }

  return rawUrl
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

function formatPrice(price, currency = 'FCFA') {
  const n = Number(price)
  if (Number.isNaN(n)) return '—'
  return `${n.toLocaleString('fr-FR')} ${currency}`
}

function soldCount(event) {
  const capacity = Number(event.capacity) || 0
  const available = Number(event.available_tickets)
  if (!capacity || Number.isNaN(available)) return 0
  return Math.max(0, capacity - available)
}

function hasPromo(event) {
  return event?.promotion && Number(event.promotion.pourcentage) > 0
}

function EventCard({ event, index, onView, onDelete, deleting }) {
  const badge = statusMeta(event.status)
  const sold = soldCount(event)
  const capacity = Number(event.capacity) || 0
  const fill = capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0
  const promo = hasPromo(event)
  const imageUrl = getImageUrl(event)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.28 }}
      className="group flex flex-col overflow-hidden rounded-[22px] border border-[#E8EEF5] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.04)] hover:shadow-[0_16px_36px_rgba(10,137,242,0.14)] hover:border-[#0A89F2]/35 transition-all"
    >
      <div className="relative h-40 overflow-hidden bg-[#E8F3FE]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={imageUrl}
            src={imageUrl}
            alt={event.title || 'Événement'}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#0A89F2]">
            <FaCalendar className="text-3xl opacity-60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm ${badge.className}`}>
            {badge.label}
          </span>
          {promo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4DE] text-[#B78103]">
              <FaTag className="text-[9px]" />
              -{event.promotion.pourcentage}%
            </span>
          )}
        </div>
        <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold drop-shadow line-clamp-1">
          {formatPrice(event.price, event.currency || 'FCFA')}
        </p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          {event.category && (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2] mb-1 capitalize">
              {event.category}
            </p>
          )}
          <h3 className="font-bold text-[#0B1220] text-[15px] leading-snug line-clamp-2">
            {event.title}
          </h3>
        </div>

        <div className="space-y-1.5 text-sm text-[#667085]">
          <p className="flex items-center gap-2 truncate">
            <FaCalendar className="text-[#0A89F2] text-xs shrink-0" />
            {formatDate(event.start_date)}
            {event.end_date && event.end_date !== event.start_date
              ? ` → ${formatDate(event.end_date)}`
              : ''}
          </p>
          {event.location && (
            <p className="flex items-center gap-2 truncate">
              <FaMapMarkerAlt className="text-[#0A89F2] text-xs shrink-0" />
              {event.location}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-[#98A2B3] mb-1.5">
            <span className="inline-flex items-center gap-1">
              <FaUsers className="text-[#0A89F2]" />
              {sold}/{capacity || '—'} places
            </span>
            <span className="inline-flex items-center gap-1">
              <FaTicketAlt className="text-[#0A89F2]" />
              {event.available_tickets ?? 0} dispo.
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[#E8EEF5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0A89F2] transition-all"
              style={{ width: `${fill}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onView(event)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#0A89F2] bg-[#E8F3FE] hover:bg-[#d6ebfc] transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <FaEye className="text-xs" />
            Voir
          </button>
          <Link
            href={`/admin/events/edit/${event.id}`}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0A89F2] hover:bg-[#0770cc] transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <FaEdit className="text-xs" />
            Éditer
          </Link>
          <button
            type="button"
            onClick={() => onDelete(event)}
            disabled={deleting}
            className="w-11 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors inline-flex items-center justify-center disabled:opacity-50"
            title="Supprimer"
          >
            {deleting ? <FaSpinner className="animate-spin text-sm" /> : <FaTrash className="text-sm" />}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  const pages = []
  const window = 2
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - window && i <= page + window)
    ) {
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
          aria-label="Page précédente"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`ellipsis-${idx}`} className="w-8 text-center text-[#98A2B3]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-10 h-10 px-2 rounded-xl text-sm font-bold transition-colors ${p === page
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
          aria-label="Page suivante"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default function AdminEvents() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_desc')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getEvents(token)
      const list = Array.isArray(data) ? data : data?.data || []
      setEvents(list)
    } catch (err) {
      setError(err.message)
      toast.error('Erreur lors du chargement des événements', { id: 'events-load-error' })
    } finally {
      setLoading(false)
    }
  }, [])

  const didInit = useRef(false)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    if (didInit.current) return
    didInit.current = true
    loadEvents()
  }, [router, loadEvents])

  // Met à jour dynamiquement le statut à 'completed' si la date de début dépasse la date système
  const processedEvents = useMemo(() => {
    const now = new Date()
    return events.map((event) => {
      if (!event.start_date) return event
      const startDate = new Date(event.start_date)
      const currentStatus = String(event.status || '').toLowerCase()

      if (
        currentStatus !== 'cancelled' &&
        !Number.isNaN(startDate.getTime()) &&
        startDate < now
      ) {
        return { ...event, status: 'completed' }
      }
      return event
    })
  }, [events])

  const counts = useMemo(() => {
    const byStatus = {
      all: processedEvents.length,
      published: 0,
      draft: 0,
      cancelled: 0,
      completed: 0,
    }
    for (const e of processedEvents) {
      const s = String(e.status || '').toLowerCase()
      if (byStatus[s] != null) byStatus[s] += 1
    }
    return byStatus
  }, [processedEvents])

  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    const nowTime = Date.now()

    return processedEvents
      .filter((event) => {
        if (statusFilter !== 'all' && String(event.status).toLowerCase() !== statusFilter) {
          return false
        }
        if (
          categoryFilter !== 'all' &&
          String(event.category || '').toLowerCase() !== categoryFilter
        ) {
          return false
        }
        if (!q) return true
        return (
          event.title?.toLowerCase().includes(q) ||
          event.location?.toLowerCase().includes(q) ||
          event.category?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const getTime = (val) => {
          if (!val) return 0
          const t = new Date(val).getTime()
          return Number.isNaN(t) ? 0 : t
        }

        const isCompletedA = String(a.status || '').toLowerCase() === 'completed'
        const isCompletedB = String(b.status || '').toLowerCase() === 'completed'

        // Regroupement prioritaire : événements actifs/publiés d'abord, terminés ensuite
        if (!isCompletedA && isCompletedB) return -1
        if (isCompletedA && !isCompletedB) return 1

        // 1. Tri : Date de début la plus proche du système (Publiés → Terminés)
        if (sortBy === 'closest_to_now') {
          const timeA = getTime(a.start_date)
          const timeB = getTime(b.start_date)
          return Math.abs(timeA - nowTime) - Math.abs(timeB - nowTime)
        }

        // 2. Tri : Date de début la plus éloignée du système
        if (sortBy === 'farthest_from_now') {
          const timeA = getTime(a.start_date)
          const timeB = getTime(b.start_date)
          return Math.abs(timeB - nowTime) - Math.abs(timeA - nowTime)
        }

        // 3. Tri : Date de début (Récent -> Ancien)
        if (sortBy === 'start_desc') {
          return getTime(b.start_date) - getTime(a.start_date)
        }

        // 4. Tri : Date de début (Ancien -> Récent)
        if (sortBy === 'start_asc') {
          return getTime(a.start_date) - getTime(b.start_date)
        }

        // 5. Tri : Date de création (Récent -> Ancien)
        if (sortBy === 'created_desc') {
          const timeA = getTime(a.created_at || a.createdAt)
          const timeB = getTime(b.created_at || b.createdAt)
          return timeB - timeA
        }

        // 6. Tri : Date de création (Ancien -> Récent)
        if (sortBy === 'created_asc') {
          const timeA = getTime(a.created_at || a.createdAt)
          const timeB = getTime(b.created_at || b.createdAt)
          return timeA - timeB
        }

        return 0
      })
  }, [processedEvents, searchTerm, statusFilter, categoryFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, categoryFilter, sortBy])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredEvents.slice(start, start + PAGE_SIZE)
  }, [filteredEvents, page])

  const handleDelete = async (event) => {
    if (!confirm(`Supprimer « ${event.title} » ?`)) return
    try {
      setDeletingId(event.id)
      const token = auth.getToken()
      await api.deleteEvent(event.id, token)
      toast.success('Événement supprimé', { id: `event-delete-${event.id}` })
      await loadEvents()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression', { id: `event-delete-${event.id}` })
    } finally {
      setDeletingId(null)
    }
  }

  const openLightbox = (event) => {
    setSelectedEvent(event)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <div className="relative min-h-screen w-full flex flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#0A89F2]/[0.07] blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-[#0A89F2]/[0.05] blur-3xl" />
        </div>

        <div className="relative p-4 sm:p-6 sm:px-8 space-y-6 w-full flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A89F2] mb-1">
                Diamond Centre
              </p>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0B1220] tracking-tight">
                Événements
              </h1>
              <p className="text-[#667085] text-sm mt-1">
                {events.length} événement{events.length !== 1 ? 's' : ''} · gérez publications, places et promos
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadEvents}
                disabled={loading}
                className="px-4 py-2.5 rounded-2xl border border-[#E8EEF5] bg-white text-sm font-medium text-[#667085] hover:bg-[#F3F6FA] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                Rafraîchir
              </button>
              <Link
                href="/admin/events/create"
                className="px-4 py-2.5 rounded-2xl bg-[#0A89F2] text-white text-sm font-semibold hover:bg-[#0770cc] transition-colors inline-flex items-center gap-2 shadow-[0_8px_20px_rgba(10,137,242,0.28)]"
              >
                <FaPlus className="text-xs" />
                Nouvel événement
              </Link>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: counts.all, tone: 'text-[#0A89F2]' },
              { label: 'Publiés', value: counts.published, tone: 'text-[#0B9B6B]' },
              { label: 'Brouillons', value: counts.draft, tone: 'text-[#B78103]' },
              { label: 'Résultats', value: filteredEvents.length, tone: 'text-[#0B1220]' },
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

          {/* Filters */}
          <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-4 shadow-[0_8px_24px_rgba(11,18,32,0.04)] space-y-3">
            {/* Barre de recherche + Tri */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] text-sm" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, lieu ou catégorie…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm focus:ring-2 focus:ring-[#0A89F2]/30 focus:border-[#0A89F2] focus:bg-white outline-none transition-colors"
                />
              </div>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto pl-3.5 pr-8 py-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm font-medium text-[#0B1220] focus:ring-2 focus:ring-[#0A89F2]/30 focus:border-[#0A89F2] focus:bg-white outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="created_desc">Date de création : Récent → Ancien</option>
                  <option value="created_asc">Date de création : Ancien → Récent</option>
                  <option value="closest_to_now">Evenement le plus proche</option>
                </select>
                <FaSortAmountDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] text-xs pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === f.id
                        ? 'bg-[#0A89F2] text-white'
                        : 'bg-[#F3F6FA] text-[#667085] hover:bg-[#E8F3FE] hover:text-[#0A89F2]'
                      }`}
                  >
                    {f.label}
                    {f.id !== 'all' && counts[f.id] != null ? ` (${counts[f.id]})` : ''}
                  </button>
                ))}
              </div>
              <div className="lg:ml-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-[280px] px-3.5 py-3 rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm font-medium text-[#0B1220] focus:ring-2 focus:ring-[#0A89F2]/30 focus:border-[#0A89F2] focus:bg-white outline-none transition-colors cursor-pointer"
                >
                  {CATEGORY_FILTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <button type="button" onClick={loadEvents} className="ml-3 underline font-medium">
                Réessayer
              </button>
            </div>
          )}

          {/* Content */}
          {loading && events.length === 0 ? (
            <div className="rounded-[24px] border border-[#E8EEF5] bg-white p-16 text-center text-[#667085]">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[#0A89F2] border-t-transparent" />
              Chargement des événements…
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#D0D5DD] bg-white/80 p-14 text-center">
              <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-[#E8F3FE] text-[#0A89F2] flex items-center justify-center">
                <FaCalendar className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1220] mb-1">Aucun événement</h3>
              <p className="text-sm text-[#667085] mb-5">
                {events.length === 0
                  ? 'Créez votre premier événement DiCe.'
                  : 'Aucun résultat pour ces filtres.'}
              </p>
              {events.length === 0 && (
                <Link
                  href="/admin/events/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0A89F2] text-white text-sm font-semibold hover:bg-[#0770cc]"
                >
                  <FaPlus className="text-xs" />
                  Créer un événement
                </Link>
              )}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                  {pageEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      onView={openLightbox}
                      onDelete={handleDelete}
                      deleting={deletingId === event.id}
                    />
                  ))}
                </div>
              </AnimatePresence>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
                totalItems={filteredEvents.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </div>
      </div>

      <EventLightbox
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        event={selectedEvent}
      />
    </>
  )
}
