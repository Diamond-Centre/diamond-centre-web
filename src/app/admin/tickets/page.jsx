/**
 * Gestion des tickets - Admin avec QR codes complets
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaTicketAlt, FaSearch, FaSync, FaSpinner, 
  FaUser, FaCalendar, FaMapMarker, FaClock,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaDownload, FaQrcode, FaEye, FaPrint,
  FaEnvelope, FaPhone, FaEuroSign, FaTag
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

// Couleurs pour les statuts
const statusColors = {
  'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
  'paid': { bg: 'bg-green-100', text: 'text-green-700', label: 'Payé' },
  'validated': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Validé' },
  'cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé' }
}

export default function AdminTickets() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tickets, setTickets] = useState([])
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const autoRefreshRef = useRef(null)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadData()
    
    // Auto-refresh toutes les 30 secondes
    autoRefreshRef.current = setInterval(() => {
      if (!loading) {
        loadData(true)
      }
    }, 30000)
    
    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current)
      }
    }
  }, [])

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setRefreshing(true)
      setError(null)
      
      const token = auth.getToken()
      if (!token) {
        router.push('/auth/login')
        return
      }
      
      // Charger les tickets
      const ticketsData = await api.getTickets(token)
      setTickets(ticketsData || [])
      
      // Charger les événements pour les noms
      try {
        const eventsData = await api.getEvents(token)
        setEvents(eventsData || [])
      } catch (err) {
        console.warn('Erreur chargement événements:', err)
      }
      
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tickets')
      if (!silent) toast.error(err.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    await loadData(false)
    toast.success('Tickets actualisés')
  }

  const getEventTitle = (eventId) => {
    const event = events.find(e => e.id === eventId)
    return event ? event.title : `Événement #${eventId}`
  }

  const getEventLocation = (eventId) => {
    const event = events.find(e => e.id === eventId)
    return event ? event.location : 'N/A'
  }

  const getStatusBadge = (status) => {
    const config = statusColors[status] || statusColors.pending
    return (
      <Badge variant={status === 'paid' ? 'success' : status === 'validated' ? 'default' : status === 'cancelled' ? 'danger' : 'warning'}>
        {config.label}
      </Badge>
    )
  }

  const loadTickets = async () => {
  try {
    setLoading(true)
    const token = auth.getToken()
    const data = await api.getTickets(token) // Récupère tous les tickets
    setTickets(data || [])
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle className="text-green-500" />
      case 'validated':
        return <FaCheckCircle className="text-blue-500" />
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />
      default:
        return <FaHourglassHalf className="text-yellow-500" />
    }
  }

  const handleValidateTicket = async (qrCode) => {
    try {
      const token = auth.getToken()
      const result = await api.validateTicket(qrCode, token)
      
      if (result.valid) {
        toast.success('Ticket validé avec succès !')
        await loadData(true)
      } else {
        toast.error(result.error || 'Ticket invalide')
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la validation')
    }
  }

  const downloadQR = (ticket) => {
    if (!ticket.qr_codes || ticket.qr_codes.length === 0) {
      toast.error('Aucun QR code disponible')
      return
    }
    
    const qrCode = ticket.qr_codes[0].code || ticket.qr_codes[0]
    const eventTitle = getEventTitle(ticket.event_id)
    const eventLocation = getEventLocation(ticket.event_id)
    
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 500
    const ctx = canvas.getContext('2d')
    
    // Fond
    const gradient = ctx.createLinearGradient(0, 0, 400, 500)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(1, '#f8fafc')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 400, 500)
    
    // Bordure
    ctx.strokeStyle = '#0a89f2'
    ctx.lineWidth = 3
    ctx.strokeRect(10, 10, 380, 480)
    
    // En-tête
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🎫 TICKET', 200, 55)
    
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 70)
    ctx.lineTo(360, 70)
    ctx.stroke()
    
    // QR Code
    const qrSize = 180
    const qrX = (400 - qrSize) / 2
    const qrY = 90
    
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(qrX, qrY, qrSize, qrSize)
    
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('■', 200, qrY + qrSize / 2 + 10)
    
    ctx.fillStyle = '#1a1a2e'
    ctx.font = '14px Arial'
    ctx.fillText(qrCode, 200, qrY + qrSize + 30)
    
    // Informations du ticket
    ctx.textAlign = 'left'
    ctx.font = '12px Arial'
    ctx.fillStyle = '#4b5563'
    
    const infoY = qrY + qrSize + 60
    const info = [
      { label: 'Ticket #', value: ticket.id },
      { label: 'Événement', value: eventTitle },
      { label: 'Lieu', value: eventLocation },
      { label: 'Client', value: ticket.customer_name || 'N/A' },
      { label: 'Email', value: ticket.customer_email || 'N/A' },
      { label: 'Téléphone', value: ticket.customer_phone || 'N/A' },
      { label: 'Places', value: ticket.quantity || 1 },
      { label: 'Total', value: `${ticket.total_price || 0} ${ticket.currency || 'FCFA'}` },
      { label: 'Statut', value: statusColors[ticket.status]?.label || ticket.status },
      { label: 'Date', value: ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('fr-FR') : 'N/A' }
    ]
    
    info.forEach((item, index) => {
      const y = infoY + index * 22
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Arial'
      ctx.fillText(item.label, 40, y)
      ctx.fillStyle = '#1a1a2e'
      ctx.font = '12px Arial'
      ctx.fillText(item.value, 120, y)
    })
    
    // Pied de page
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Diamond Centre - Ticket valide uniquement avec QR code', 200, 485)
    ctx.fillText(`Généré le ${new Date().toLocaleString('fr-FR')}`, 200, 498)
    
    const link = document.createElement('a')
    link.download = `ticket-${ticket.id}-qr.png`
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Ticket téléchargé avec succès')
  }

  const printTicket = (ticket) => {
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Veuillez autoriser les popups pour l\'impression')
      return
    }
    
    const qrCode = ticket.qr_codes?.[0]?.code || ticket.qr_codes?.[0] || 'N/A'
    const eventTitle = getEventTitle(ticket.event_id)
    const eventLocation = getEventLocation(ticket.event_id)
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket #${ticket.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: white; }
          .ticket { max-width: 600px; margin: 0 auto; border: 2px solid #0a89f2; border-radius: 12px; padding: 30px; }
          .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #0a89f2; font-size: 28px; margin: 0; }
          .header .subtitle { color: #6b7280; font-size: 14px; }
          .qr-section { text-align: center; margin: 20px 0; }
          .qr-code { font-size: 48px; }
          .info { margin: 20px 0; }
          .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .info-label { width: 120px; color: #6b7280; font-size: 14px; }
          .info-value { flex: 1; color: #1a1a2e; font-weight: 500; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          .status-paid { background: #d1fae5; color: #065f46; }
          .status-validated { background: #dbeafe; color: #1e40af; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
          @media print { body { padding: 0; } .ticket { border: none; } }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>🎫 TICKET</h1>
            <div class="subtitle">Ticket #${ticket.id}</div>
          </div>
          
          <div class="qr-section">
            <div class="qr-code">■</div>
            <div style="font-family: monospace; font-size: 12px; margin-top: 8px; color: #4b5563;">${qrCode}</div>
          </div>
          
          <div class="info">
            <div class="info-row">
              <div class="info-label">Événement</div>
              <div class="info-value">${eventTitle}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Lieu</div>
              <div class="info-value">${eventLocation}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Client</div>
              <div class="info-value">${ticket.customer_name || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">${ticket.customer_email || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Téléphone</div>
              <div class="info-value">${ticket.customer_phone || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Places</div>
              <div class="info-value">${ticket.quantity || 1}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total</div>
              <div class="info-value">${ticket.total_price || 0} ${ticket.currency || 'FCFA'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Statut</div>
              <div class="info-value">
                <span class="status status-${ticket.status || 'pending'}">
                  ${statusColors[ticket.status]?.label || ticket.status || 'En attente'}
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Date</div>
              <div class="info-value">${ticket.created_at ? new Date(ticket.created_at).toLocaleString('fr-FR') : 'N/A'}</div>
            </div>
          </div>
          
          <div class="footer">
            Diamond Centre - Ticket valide uniquement avec QR code<br>
            Généré le ${new Date().toLocaleString('fr-FR')}
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = 
      ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id?.toString().includes(searchTerm) ||
      getEventTitle(ticket.event_id).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus
    
    return matchSearch && matchStatus
  })

  // Statistiques
  const stats = {
    total: tickets.length,
    paid: tickets.filter(t => t.status === 'paid').length,
    validated: tickets.filter(t => t.status === 'validated').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    cancelled: tickets.filter(t => t.status === 'cancelled').length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des tickets</h1>
          <p className="text-gray-500 flex items-center gap-2">
            <span>{tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total</span>
            {tickets.length > 0 && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Auto-refresh actif
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSync />
            )}
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-dice-blue">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Payés</p>
          <p className="text-2xl font-bold text-green-500">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Validés</p>
          <p className="text-2xl font-bold text-blue-500">{stats.validated}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Annulés</p>
          <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ID ou événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payés</option>
          <option value="validated">Validés</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
          <button
            onClick={handleRefresh}
            className="ml-4 text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'Aucun ticket trouvé' : 'Aucun ticket réservé'}
          </h3>
          <p className="text-gray-400">
            {searchTerm 
              ? 'Essayez de modifier votre recherche' 
              : 'Les tickets apparaîtront ici après une réservation'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-dice-blue hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const statusConfig = statusColors[ticket.status] || statusColors.pending
            const qrCode = ticket.qr_codes?.[0]?.code || ticket.qr_codes?.[0] || 'N/A'
            
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* En-tête du ticket */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-10 h-10 bg-dice-blue/10 rounded-lg flex items-center justify-center">
                        <FaTicketAlt className="text-dice-blue" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Ticket #{ticket.id}
                      </h3>
                      {getStatusBadge(ticket.status)}
                    </div>

                    {/* QR Code avec informations */}
                    <div className="flex items-start gap-4 mt-3">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-dice-blue/5 rounded-lg flex items-center justify-center border-2 border-dice-blue/20">
                          <div className="text-center">
                            <div className="text-2xl">🎫</div>
                            <div className="text-[8px] font-mono text-gray-500 truncate max-w-[60px]">
                              {qrCode.substring(0, 10)}...
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaUser className="text-dice-blue flex-shrink-0" />
                            <span className="truncate">{ticket.customer_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaEnvelope className="text-dice-blue flex-shrink-0" />
                            <span className="truncate">{ticket.customer_email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-dice-blue flex-shrink-0" />
                            <span className="truncate">{ticket.customer_phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendar className="text-dice-blue flex-shrink-0" />
                            <span className="truncate">
                              {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaTicketAlt className="text-dice-blue flex-shrink-0" />
                            <span>{ticket.quantity || 1} place{ticket.quantity > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaEuroSign className="text-dice-blue flex-shrink-0" />
                            <span className="font-semibold text-dice-blue">
                              {ticket.total_price || 0} {ticket.currency || 'FCFA'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          <span className="font-medium">Événement:</span> {getEventTitle(ticket.event_id)}
                          <span className="ml-3 font-medium">Lieu:</span> {getEventLocation(ticket.event_id)}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <FaQrcode className="text-dice-blue text-xs" />
                          <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {qrCode}
                          </span>
                          {ticket.qr_codes?.[0]?.validated && (
                            <Badge variant="success" className="text-xs">
                              Validé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {ticket.status === 'paid' && !ticket.qr_codes?.[0]?.validated && (
                      <button
                        onClick={() => handleValidateTicket(qrCode)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Valider le ticket"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket)
                        setIsModalOpen(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => downloadQR(ticket)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Télécharger le ticket"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => printTicket(ticket)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Imprimer le ticket"
                    >
                      <FaPrint />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Détails du ticket */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Ticket #{selectedTicket.id}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {getEventTitle(selectedTicket.event_id)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedTicket(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* QR Code avec toutes les informations */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-xl border-2 border-dice-blue/20 shadow-lg max-w-sm w-full">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎫</div>
                    <div className="text-xs font-mono bg-gray-100 px-3 py-1 rounded inline-block">
                      {selectedTicket.qr_codes?.[0]?.code || selectedTicket.qr_codes?.[0] || 'DC-XXXX'}
                    </div>
                    {selectedTicket.qr_codes?.[0]?.validated && (
                      <div className="mt-2 text-green-600 text-sm font-semibold">
                        ✅ Validé
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ticket</span>
                      <span className="font-semibold">#{selectedTicket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client</span>
                      <span className="font-semibold">{selectedTicket.customer_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-semibold">{selectedTicket.customer_email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Téléphone</span>
                      <span className="font-semibold">{selectedTicket.customer_phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Événement</span>
                      <span className="font-semibold">{getEventTitle(selectedTicket.event_id)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lieu</span>
                      <span className="font-semibold">{getEventLocation(selectedTicket.event_id)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Places</span>
                      <span className="font-semibold">{selectedTicket.quantity || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-semibold text-dice-blue">
                        {selectedTicket.total_price || 0} {selectedTicket.currency || 'FCFA'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Statut</span>
                      <div>{getStatusBadge(selectedTicket.status)}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réservé le</span>
                      <span className="font-semibold">
                        {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expire le</span>
                      <span className="font-semibold">
                        {selectedTicket.expires_at ? new Date(selectedTicket.expires_at).toLocaleString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                {selectedTicket.status === 'paid' && !selectedTicket.qr_codes?.[0]?.validated && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const qrCode = selectedTicket.qr_codes?.[0]?.code || selectedTicket.qr_codes?.[0]
                      if (qrCode) {
                        handleValidateTicket(qrCode)
                        setIsModalOpen(false)
                      }
                    }}
                  >
                    <FaCheckCircle className="mr-2" />
                    Valider le ticket
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => downloadQR(selectedTicket)}
                >
                  <FaDownload className="mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  onClick={() => printTicket(selectedTicket)}
                >
                  <FaPrint className="mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}