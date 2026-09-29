'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import {
  FaUsers, FaSearch, FaSync, FaUserPlus, FaUserShield,
  FaEnvelope, FaPhone, FaUser, FaTimes, FaChevronLeft, FaChevronRight,
  FaEye, FaEdit, FaTrash, FaSpinner, FaLock, FaExclamationTriangle,
  FaEllipsisV, FaTicketAlt, FaCertificate, FaCheckCircle, FaClock,
  FaTimesCircle, FaUndo, FaCalendar, FaQrcode, FaDownload, FaShareAlt
} from 'react-icons/fa'
import Badge from '@/components/ui/Badge'
import LoadError from '@/components/ui/LoadError'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

const PAGE_SIZE = 10
const EMPTY_FORM = {
  name: '',
  email: '',
  telephone: '',
  sexe: 'homme',
  password: '',
  confirmPassword: '',
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}

function formatDateFr(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPriceFr(amount, currency = 'FCFA') {
  const n = Number(amount)
  if (Number.isNaN(n)) return null
  return `${n.toLocaleString('fr-FR')} ${currency}`
}

function initialOf(name) {
  const t = (name || '').trim()
  return t ? t[0].toUpperCase() : '?'
}

function isShareableTicket(t) {
  if (!t) return false
  if (t.shareable === true) return true
  return !String(t.customer_name || '').trim()
}

// Design identique à /admin/tickets — mêmes couleurs, mêmes classes
function ticketStatusMeta(status) {
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/80">
      <p className="text-sm text-gray-500">
        Affichage <span className="font-semibold text-gray-800">{from}–{to}</span> sur{' '}
        <span className="font-semibold text-gray-800">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          aria-label="Page précédente"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`ellipsis-${idx}`} className="w-7 text-center text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${p === page
                  ? 'bg-dice-blue text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
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
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          aria-label="Page suivante"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

// Carte de ticket — copie fidèle du design de /admin/tickets (TicketCard)
function ClientTicketCard({ ticket, index, onShowQr, buyerName }) {
  const meta = ticketStatusMeta(ticket.status)
  const StatusIcon = meta.icon
  const qr = ticket.qr_codes?.[0]
  const entryCode =
    typeof qr === 'object' && qr?.entry_code
      ? String(qr.entry_code).padStart(8, '0').slice(-8)
      : ticket.entry_code
        ? String(ticket.entry_code).padStart(8, '0').slice(-8)
        : null
  const validated = typeof qr === 'object' && qr?.validated
  const shareable = isShareableTicket(ticket)
  const buyerLabel = buyerName || ticket.customer_email || 'Client'

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
          {shareable ? (
            <FaShareAlt className="text-lg" />
          ) : (
            initialOf(ticket.customer_name)
          )}
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
                {shareable ? 'À partager' : ticket.customer_name || 'Client'}
              </h3>
              {shareable ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F3FE] text-[#0A89F2]">
                  <FaShareAlt className="text-[9px]" />
                  Place invitée
                </span>
              ) : null}
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
            {shareable ? (
              <p className="mt-1 text-xs text-[#667085]">
                Acheté par <span className="font-semibold text-[#0B1220]">{buyerLabel}</span>
              </p>
            ) : null}
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-[#0A89F2]">
              {formatPriceFr(ticket.total_price, ticket.currency || 'FCFA') || '—'}
            </p>
            <p className="text-[11px] text-[#98A2B3] mt-0.5">
              {formatDateFr(ticket.created_at)}
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
            Réservé le {formatDateFr(ticket.created_at)}
            {ticket.event_start_date ? ` · Événement ${formatDateFr(ticket.event_start_date)}` : ''}
          </p>
        </div>

        {entryCode && (
          <div className="flex items-center gap-2">
            <FaQrcode className="text-[#0A89F2] text-xs" />
            <code className="text-[11px] font-mono bg-[#F3F6FA] text-[#667085] px-2 py-1 rounded-lg truncate max-w-full">
              {entryCode}
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

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  // États pour les actions Admin (Voir, Éditer, Supprimer)
  const [viewUser, setViewUser] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    telephone: '',
    sexe: 'homme',
    password: '',
    confirmPassword: '',
  })
  const [updating, setUpdating] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // État pour la liste déroulante des actions client
  const [activeDropdownId, setActiveDropdownId] = useState(null)

  // États pour les Modaux de Tickets et Certificats Client
  const [modalTicketsUser, setModalTicketsUser] = useState(null)
  const [ticketsList, setTicketsList] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(false)

  const [modalCertificatsUser, setModalCertificatsUser] = useState(null)
  const [certificatsList, setCertificatsList] = useState([])
  const [loadingCertificats, setLoadingCertificats] = useState(false)

  // États pour le QR code affiché depuis le modal des tickets d'un client
  const [qrTicket, setQrTicket] = useState(null)
  const [qrImage, setQrImage] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  const currentUser = auth.getUser()
  const isSuperAdmin = currentUser?.role === 'super_admin'

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    loadUsers()
  }, [router])

  // Fermer le menu déroulant si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getUsers(token)
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs')
      toast.error(err.message || 'Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  // Chargement des tickets du client sélectionné : on récupère tous les tickets
  // (comme la page /admin/tickets) puis on filtre par correspondance d'email,
  // car il n'y a pas d'endpoint fiable de tickets par ID utilisateur.
  const handleOpenTicketsModal = async (user) => {
    setModalTicketsUser(user)
    setLoadingTickets(true)
    setTicketsList([])
    try {
      const token = auth.getToken()
      const res = await api.getTickets(token)
      const allTickets = Array.isArray(res) ? res : res?.data || []
      const targetEmail = normalizeEmail(user.email)

      const filtered = targetEmail
        ? allTickets.filter((t) => normalizeEmail(t.customer_email) === targetEmail)
        : []

      // Tri par date d'événement croissante, comme sur /admin/tickets
      filtered.sort((a, b) => {
        const dateA = a.event_start_date ? new Date(a.event_start_date).getTime() : Infinity
        const dateB = b.event_start_date ? new Date(b.event_start_date).getTime() : Infinity
        return dateA - dateB
      })

      setTicketsList(filtered)
    } catch (err) {
      toast.error(err.message || 'Impossible de récupérer les tickets')
    } finally {
      setLoadingTickets(false)
    }
  }

  // Chargement des certificats du client sélectionné.
  // Il n'existe pas d'endpoint global "tous les certificats" côté API — les
  // certificats sont exposés par formation, via api.getCertificateEligible(eventId),
  // qui renvoie { event, eligible, already_issued } (voir /admin/certificates).
  // On parcourt donc toutes les formations (catégorie "formation"), on récupère
  // les certificats déjà délivrés (already_issued) de chacune, et on ne garde
  // que ceux qui appartiennent à ce client : d'abord par identifiant utilisateur
  // (user_id / customer_id / recipient_id) si disponible, sinon par email.
  const handleOpenCertificatsModal = async (user) => {
    setModalCertificatsUser(user)
    setLoadingCertificats(true)
    setCertificatsList([])
    try {
      const token = auth.getToken()
      const eventsRes = await api.getAdminEvents(token)
      const allEvents = Array.isArray(eventsRes) ? eventsRes : eventsRes?.data || []
      const formationEvents = allEvents.filter(
        (e) =>
          String(e.category || '').toLowerCase() === 'formation' &&
          String(e.status || '').toLowerCase() !== 'cancelled'
      )

      const targetEmail = normalizeEmail(user.email)

      const perEventResults = await Promise.all(
        formationEvents.map(async (ev) => {
          try {
            const data = await api.getCertificateEligible(ev.id, token)
            const issued = Array.isArray(data?.already_issued) ? data.already_issued : []
            return issued
              .filter((c) => {
                // 1) Correspondance directe par identifiant utilisateur (le plus fiable)
                if (
                  user.id != null &&
                  (c.user_id === user.id || c.customer_id === user.id || c.recipient_id === user.id)
                ) {
                  return true
                }
                // 2) Sinon, correspondance par email destinataire
                return targetEmail && normalizeEmail(c.recipient_email) === targetEmail
              })
              .map((c) => ({
                ...c,
                event_title: c.event_title || ev.title,
              }))
          } catch {
            // Une formation en erreur ne doit pas bloquer les autres
            return []
          }
        })
      )

      const merged = perEventResults.flat()
      // Tri par date de délivrance décroissante (le plus récent en premier)
      merged.sort((a, b) => new Date(b.issued_at || 0) - new Date(a.issued_at || 0))

      setCertificatsList(merged)
    } catch (err) {
      toast.error(err.message || 'Impossible de récupérer les certificats')
    } finally {
      setLoadingCertificats(false)
    }
  }

  const generateClientQR = async (ticket) => {
    try {
      setQrLoading(true)
      const entry =
        ticket.entry_code ||
        (typeof ticket.qr_codes?.[0] === 'object' ? ticket.qr_codes[0]?.entry_code : null)
      const code = entry
        ? String(entry).replace(/\D/g, '').padStart(8, '0').slice(-8)
        : ticket.qr_codes?.[0]?.code ||
        (typeof ticket.qr_codes?.[0] === 'string' ? ticket.qr_codes[0] : null) ||
        `DC-${ticket.id}`

      const image = await QRCode.toDataURL(String(code), {
        width: 360,
        margin: 2,
        color: { dark: '#0a89f2', light: '#ffffff' },
      })
      setQrImage(image)
      setQrTicket({ ...ticket, entry_code: code })
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la génération du QR code')
    } finally {
      setQrLoading(false)
    }
  }

  const downloadClientQR = () => {
    if (!qrImage || !qrTicket) return
    const link = document.createElement('a')
    link.download = `ticket-${qrTicket.id}-qr.png`
    link.href = qrImage
    link.click()
    toast.success('QR code téléchargé')
  }

  const closeClientQR = () => {
    setQrTicket(null)
    setQrImage(null)
  }

  const counts = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length
    const clients = users.filter((u) => u.role === 'client' || (!u.role || u.role === 'user')).length
    return { total: users.length, admins, clients }
  }, [users])

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const role = user.role || ''
      const isAdmin = role === 'admin' || role === 'super_admin'
      if (roleFilter === 'admin' && !isAdmin) return false
      if (roleFilter === 'client' && isAdmin) return false

      if (!q) return true
      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.telephone?.toLowerCase().includes(q) ||
        String(user.id).includes(q)
      )
    })
  }, [users, searchTerm, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [searchTerm, roleFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, page])

  const roleBadge = (role) => {
    if (role === 'super_admin') return { label: 'Super admin', variant: 'purple' }
    if (role === 'admin') return { label: 'Admin', variant: 'default' }
    return { label: 'Client', variant: 'success' }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut gérer les administrateurs')
      return
    }
    if (!form.name.trim() || !form.email.trim() || !form.telephone.trim() || !form.password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (form.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setSubmitting(true)
      const token = auth.getToken()
      await api.createAdmin(
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          telephone: form.telephone.trim(),
          sexe: form.sexe,
          password: form.password,
        },
        token
      )
      toast.success('Administrateur créé avec succès')
      setForm(EMPTY_FORM)
      setShowForm(false)
      await loadUsers()
    } catch (err) {
      toast.error(err.message || 'Impossible de créer l’administrateur')
    } finally {
      setSubmitting(false)
    }
  }

  // Modification d'un admin
  const handleOpenEdit = (user) => {
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut gérer les administrateurs')
      return
    }
    if (user.role === 'super_admin') {
      toast.error('Le compte super admin ne peut pas être modifié ici')
      return
    }
    setEditUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      telephone: user.telephone || '',
      sexe: user.sexe || 'homme',
      password: '',
      confirmPassword: '',
    })
  }

  const handleUpdateAdmin = async (e) => {
    e.preventDefault()
    if (!editUser) return
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut gérer les administrateurs')
      return
    }

    const name = editForm.name.trim()
    const email = editForm.email.trim().toLowerCase()
    const telephone = editForm.telephone.replace(/\s+/g, '')
    const password = editForm.password
    const confirmPassword = editForm.confirmPassword

    if (!name || !email || !telephone || !editForm.sexe) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (password || confirmPassword) {
      if (password.length < 6) {
        toast.error('Le mot de passe doit contenir au moins 6 caractères')
        return
      }
      if (password !== confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas')
        return
      }
    }

    try {
      setUpdating(true)
      const token = auth.getToken()
      const payload = {
        name,
        email,
        telephone,
        sexe: editForm.sexe,
      }
      if (password) {
        payload.password = password
      }

      await api.updateAdmin(editUser.id, payload, token)
      toast.success(
        password
          ? 'Administrateur mis à jour. Le nouveau mot de passe est actif.'
          : 'Administrateur mis à jour avec succès'
      )
      setEditUser(null)
      setEditForm({
        name: '',
        email: '',
        telephone: '',
        sexe: 'homme',
        password: '',
        confirmPassword: '',
      })
      await loadUsers()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  const confirmDeleteUser = async () => {
    if (!deletingUser) return
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut supprimer un utilisateur')
      return
    }
    if (deletingUser.role === 'super_admin') {
      toast.error('Le compte super admin ne peut pas être supprimé')
      return
    }

    const isClient = deletingUser.role === 'client'

    try {
      setDeletingId(deletingUser.id)
      const token = auth.getToken()
      await api.deleteUser(deletingUser.id, token, isClient ? 'client' : 'admin')
      toast.success(
        isClient ? 'Client supprimé avec succès' : 'Administrateur supprimé avec succès'
      )
      setDeletingUser(null)
      await loadUsers()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-dice-blue" />
            Utilisateurs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {counts.total} utilisateur{counts.total > 1 ? 's' : ''} · {counts.admins} admin
            {counts.admins > 1 ? 's' : ''} · {counts.clients} client{counts.clients > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <FaSync />
            Rafraîchir
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm flex items-center gap-2"
            >
              {showForm ? <FaTimes /> : <FaUserPlus />}
              {showForm ? 'Fermer' : 'Nouvel admin'}
            </button>
          )}
        </div>
      </div>

      {isSuperAdmin && showForm && (
        <form
          onSubmit={handleCreateAdmin}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserShield className="text-dice-blue" />
            Ajouter un administrateur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="admin@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="+237670000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
              <select
                name="sexe"
                value={form.sexe}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                placeholder="Min. 6 caractères"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Création…' : 'Créer l’administrateur'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher (nom, email, téléphone, ID)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent bg-white"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Admins</option>
          <option value="client">Clients</option>
        </select>
      </div>

      {error ? (
        <div className="mb-6">
          <LoadError onRetry={loadUsers} />
        </div>
      ) : null}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun utilisateur</h3>
          <p className="text-gray-400">Aucun résultat pour ces filtres</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Rôle</th>
                  <th className="px-4 py-3 font-medium">Inscrit le</th>
                  <th className="px-4 py-3 font-medium text-right pr-12">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageUsers.map((user) => {
                  const badge = roleBadge(user.role)
                  const isAdminRole = user.role === 'admin' || user.role === 'super_admin'
                  return (
                    <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.picture}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-dice-blue/10 flex items-center justify-center">
                              <FaUser className="text-dice-blue text-sm" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{user.name || '—'}</p>
                            <p className="text-xs text-gray-400">#{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center gap-2">
                            <FaEnvelope className="text-dice-blue text-xs" />
                            {user.email || '—'}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaPhone className="text-dice-blue text-xs" />
                            {user.telephone || '—'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isAdminRole ? (
                          <div className="inline-flex items-center gap-1.5">
                            {/* Bouton Voir */}
                           <button
                              type="button"
                              onClick={() => setViewUser(user)}
                              className={`px-3 py-1.5 rounded-xl text-sm font-semibold text-dice-blue bg-dice-blue/10 hover:bg-dice-blue/20 transition-colors inline-flex items-center gap-1 ${
                                isSuperAdmin
                                  ? (user.role === 'admin' ? '-translate-x-1' : '-translate-x-12')
                                  : '-translate-x-12'
                              }`}
                              title="Voir"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            {isSuperAdmin && user.role === 'admin' && (
                              <>
                                {/* Bouton Éditer */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(user)}
                                  className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white bg-dice-blue hover:bg-dice-blue-dark transition-colors inline-flex items-center gap-1"
                                  title="Éditer"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                {/* Bouton Supprimer */}
                                <button
                                  type="button"
                                  onClick={() => setDeletingUser(user)}
                                  className="w-9 h-9 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors inline-flex items-center justify-center"
                                  title="Supprimer"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          /* Menu déroulant des actions pour les clients */
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDropdownId(activeDropdownId === user.id ? null : user.id)
                              }}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
                              title="Actions"
                            >
                              <FaEllipsisV className="text-sm -translate-x-12" />
                            </button>

                            {activeDropdownId === user.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-fadeIn text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    handleOpenTicketsModal(user)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                >
                                  <FaTicketAlt className="text-dice-blue text-xs" />
                                  Tous les tickets
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    handleOpenCertificatsModal(user)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                >
                                  <FaCertificate className="text-dice-blue text-xs" />
                                  Tous les certificats
                                </button>
                                {isSuperAdmin ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownId(null)
                                      setDeletingUser(user)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                  >
                                    <FaTrash className="text-xs" />
                                    Supprimer le client
                                  </button>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            totalItems={filteredUsers.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}

      {/* Modal de visualisation des informations */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setViewUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <div className="text-center mb-4">
              {viewUser.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewUser.picture}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-dice-blue"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-dice-blue/10 flex items-center justify-center mx-auto mb-2">
                  <FaUser className="text-dice-blue text-2xl" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800">{viewUser.name}</h3>
              <Badge variant={roleBadge(viewUser.role).variant}>
                {roleBadge(viewUser.role).label}
              </Badge>
            </div>
            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">ID :</span>
                <span className="text-gray-800">#{viewUser.id}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">Email :</span>
                <span className="text-gray-800">{viewUser.email || '—'}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">Téléphone :</span>
                <span className="text-gray-800">{viewUser.telephone || '—'}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">Sexe :</span>
                <span className="text-gray-800 capitalize">{viewUser.sexe || '—'}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">Date d'inscription :</span>
                <span className="text-gray-800">
                  {viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString('fr-FR') : '—'}
                </span>
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setViewUser(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des informations */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setEditUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUserShield className="text-dice-blue" />
              Modifier l'administrateur
            </h3>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  name="telephone"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
                <select
                  name="sexe"
                  value={editForm.sexe}
                  onChange={(e) => setEditForm({ ...editForm, sexe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe{' '}
                  <span className="text-xs text-gray-400 font-normal">
                    (laisser vide pour ne pas modifier)
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  placeholder="Min. 6 caractères"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={editForm.confirmPassword}
                  onChange={(e) =>
                    setEditForm({ ...editForm, confirmPassword: e.target.value })
                  }
                  placeholder="Retapez le nouveau mot de passe"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-dice-blue text-white rounded-xl hover:bg-dice-blue-dark text-sm font-medium disabled:opacity-50"
                >
                  {updating ? 'Mise à jour…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setDeletingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer{' '}
                {deletingUser.role === 'client' ? 'le client' : "l'administrateur"}{' '}
                <span className="font-semibold text-gray-800">{deletingUser.name}</span> ?
                Cette action est irréversible.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={deletingId === deletingUser.id}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {deletingId === deletingUser.id ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Suppression…
                  </>
                ) : (
                  'Confirmer la suppression'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'affichage des tickets d'un client — design identique à /admin/tickets */}
      {modalTicketsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative animate-fadeIn max-h-[85vh] flex flex-col">
            <button
              onClick={() => setModalTicketsUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FaTicketAlt className="text-dice-blue text-lg" />
              <h3 className="text-lg font-bold text-gray-800">
                Tickets de {modalTicketsUser.name || 'Client'}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {loadingTickets ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-dice-blue border-t-transparent" />
                </div>
              ) : ticketsList.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FaTicketAlt className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p>Aucun ticket trouvé pour ce client.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 gap-4">
                    {ticketsList.map((ticket, index) => (
                      <ClientTicketCard
                        key={ticket.id}
                        ticket={ticket}
                        index={index}
                        onShowQr={generateClientQR}
                        buyerName={modalTicketsUser.name}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTicketsUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR — même design que /admin/tickets */}
      <AnimatePresence>
        {qrTicket && qrImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeClientQR}
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
                    <h3 className="text-lg font-extrabold">Ticket #{qrTicket.id}</h3>
                    <p className="text-sm text-white/90 mt-1 line-clamp-1">
                      {qrTicket.event_title}
                    </p>
                    {isShareableTicket(qrTicket) ? (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                        <FaShareAlt className="text-[9px]" />
                        À partager
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={closeClientQR}
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
                    <img src={qrImage} alt="QR Code" className="w-56 h-56" />
                    <p className="mt-3 text-center text-[11px] uppercase tracking-wide text-[#98A2B3]">
                      Code d&apos;entrée
                    </p>
                    <p className="mt-1 text-center font-mono text-2xl font-bold tracking-[0.25em] text-[#0A89F2]">
                      {String(qrTicket.entry_code || '--------')
                        .replace(/\D/g, '')
                        .padStart(8, '0')
                        .slice(-8)}
                    </p>
                  </div>
                </div>

                {isShareableTicket(qrTicket) ? (
                  <div className="rounded-2xl border border-[#E8F3FE] bg-[#F7FBFF] p-4 text-sm">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0A89F2]">
                      <FaShareAlt className="text-[10px]" />
                      Billet à partager
                    </p>
                    <p className="mt-1.5 text-[#667085]">
                      Place sans nom, destinée à un invité. Achetée par{' '}
                      <span className="font-semibold text-[#0B1220]">
                        {modalTicketsUser?.name || qrTicket.customer_email || 'ce client'}
                      </span>
                      {modalTicketsUser?.name && qrTicket.customer_email
                        ? ` · ${qrTicket.customer_email}`
                        : ''}
                      .
                    </p>
                    <p className="mt-2 text-[#667085]">
                      Total{' '}
                      <span className="font-bold text-[#0A89F2]">
                        {formatPriceFr(qrTicket.total_price, qrTicket.currency || 'FCFA') || '—'}
                      </span>
                      {' · '}×{qrTicket.quantity || 1}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#E8EEF5] p-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-[#667085]">
                      <FaUser className="text-[#0A89F2] text-xs" />
                      <span className="font-medium text-[#0B1220]">{qrTicket.customer_name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-[#667085]">
                      <FaEnvelope className="text-[#0A89F2] text-xs" />
                      {qrTicket.customer_email || '—'}
                    </p>
                    <p className="text-[#667085]">
                      Total{' '}
                      <span className="font-bold text-[#0A89F2]">
                        {formatPriceFr(qrTicket.total_price, qrTicket.currency || 'FCFA') || '—'}
                      </span>
                      {' · '}×{qrTicket.quantity || 1}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadClientQR}
                    disabled={qrLoading}
                    className="flex-1 py-3 rounded-2xl bg-[#0A89F2] text-white text-sm font-bold hover:bg-[#0770cc] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Télécharger
                  </button>
                  <button
                    type="button"
                    onClick={closeClientQR}
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

      {/* Modal d'affichage des certificats d'un client */}
      {modalCertificatsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative animate-fadeIn max-h-[85vh] flex flex-col">
            <button
              onClick={() => setModalCertificatsUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FaCertificate className="text-dice-blue text-lg" />
              <h3 className="text-lg font-bold text-gray-800">
                Certificats de {modalCertificatsUser.name || 'Client'}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {loadingCertificats ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-dice-blue border-t-transparent" />
                </div>
              ) : certificatsList.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FaCertificate className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p>Aucun certificat trouvé pour ce client.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {certificatsList.map((cert) => (
                    <div
                      key={cert.id || cert.code}
                      className="p-4 border border-gray-200 rounded-xl hover:border-dice-blue/40 transition-colors bg-gray-50/50"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {cert.event_title || cert.title || cert.nom || `Certificat`}
                        </h4>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium capitalize">
                          Délivré
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 font-mono">
                        N° {cert.code || '—'}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-2">
                        <span>{cert.recipient_name || '—'}</span>
                        <span>
                          Délivré le : {cert.issued_at ? formatDateFr(cert.issued_at) : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setModalCertificatsUser(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
