/**
 * Gestion des tickets - Admin avec QR code
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import { 
  FaTicketAlt, FaSearch, FaSync, FaSpinner,
  FaCheckCircle, FaTimesCircle, FaClock,
  FaUser, FaEnvelope, FaPhone, FaCalendar,
  FaDownload, FaQrcode, FaEye, FaTrash
} from 'react-icons/fa'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

export default function AdminTickets() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrCodeImage, setQrCodeImage] = useState(null)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getTickets(token)
      setTickets(data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Erreur lors du chargement des tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return
    
    try {
      const token = auth.getToken()
      await api.deleteTicket(id, token)
      toast.success('Ticket supprimé avec succès')
      await loadTickets()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression')
    }
  }

  const generateQRCode = async (ticket) => {
    try {
      const qrData = {
        ticket_id: ticket.id,
        event_id: ticket.event_id,
        event_title: ticket.event_title,
        customer_name: ticket.customer_name,
        quantity: ticket.quantity,
        total_price: ticket.total_price,
        currency: ticket.currency,
        created_at: ticket.created_at,
        qr_code: ticket.qr_codes?.[0]?.code || `DC-${ticket.id}-${Date.now()}`
      }
      
      const qrString = JSON.stringify(qrData)
      const qrImage = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0a89f2',
          light: '#ffffff'
        }
      })
      
      setQrCodeImage(qrImage)
      setSelectedTicket(ticket)
    } catch (error) {
      console.error('Erreur génération QR code:', error)
      toast.error('Erreur lors de la génération du QR code')
    }
  }

  const downloadQR = () => {
    if (qrCodeImage) {
      const link = document.createElement('a')
      link.download = `ticket-${selectedTicket?.id || 'event'}-qr.png`
      link.href = qrCodeImage
      link.click()
      toast.success('QR code téléchargé !')
    }
  }

  const filteredTickets = tickets.filter(ticket => 
    ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id?.toString().includes(searchTerm)
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'payé':
        return { variant: 'success', label: 'Payé', icon: FaCheckCircle }
      case 'pending':
      case 'en_attente':
        return { variant: 'warning', label: 'En attente', icon: FaClock }
      case 'cancelled':
      case 'annulé':
        return { variant: 'danger', label: 'Annulé', icon: FaTimesCircle }
      default:
        return { variant: 'default', label: status || 'Inconnu', icon: FaTicketAlt }
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
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des tickets</h1>
          <p className="text-gray-500">
            {tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={loadTickets}
          disabled={loading}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Rafraîchir
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un ticket (nom, email, événement, ID)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun ticket</h3>
          <p className="text-gray-400">Aucun ticket n'a été réservé pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => {
            const statusBadge = getStatusBadge(ticket.status)
            const StatusIcon = statusBadge.icon
            
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Informations du ticket */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Ticket #{ticket.id}
                      </h3>
                      <Badge variant={statusBadge.variant}>
                        <StatusIcon className="inline mr-1 text-xs" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-dice-blue" />
                        <span>{ticket.customer_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="text-dice-blue" />
                        <span>{ticket.customer_email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-dice-blue" />
                        <span>{ticket.customer_phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar className="text-dice-blue" />
                        <span>{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">Événement:</span>
                      <span className="text-gray-600 ml-2">{ticket.event_title || 'N/A'}</span>
                    </div>
                    
                    <div className="mt-1 text-sm">
                      <span className="font-medium text-gray-700">Quantité:</span>
                      <span className="text-gray-600 ml-2">{ticket.quantity || 1}</span>
                      <span className="font-medium text-gray-700 ml-4">Total:</span>
                      <span className="text-dice-blue font-semibold ml-2">
                        {ticket.total_price?.toLocaleString() || 0} {ticket.currency || 'FCFA'}
                      </span>
                    </div>

                    {/* QR Code */}
                    {ticket.qr_codes && ticket.qr_codes.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <FaQrcode className="text-dice-blue" />
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {ticket.qr_codes[0].code || 'N/A'}
                          </span>
                          {ticket.qr_codes[0].validated && (
                            <Badge variant="success" className="text-xs">
                              Validé
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => generateQRCode(ticket)}
                      className="p-2 text-dice-blue hover:bg-dice-blue/10 rounded-lg transition-colors"
                      title="Voir QR code"
                    >
                      <FaQrcode />
                    </button>
                    {ticket.qr_codes && ticket.qr_codes.length > 0 && (
                      <button
                        onClick={() => {
                          const canvas = document.createElement('canvas')
                          canvas.width = 200
                          canvas.height = 200
                          const ctx = canvas.getContext('2d')
                          ctx.fillStyle = 'white'
                          ctx.fillRect(0, 0, 200, 200)
                          ctx.fillStyle = '#0a89f2'
                          ctx.font = 'bold 16px Arial'
                          ctx.textAlign = 'center'
                          ctx.fillText('🎫', 100, 80)
                          ctx.font = '12px Arial'
                          ctx.fillText(ticket.qr_codes[0].code, 100, 120)
                          ctx.fillStyle = '#1a1a2e'
                          ctx.font = '10px Arial'
                          ctx.fillText(`#${ticket.id}`, 100, 140)
                          const link = document.createElement('a')
                          link.download = `ticket-${ticket.id}-qr.png`
                          link.href = canvas.toDataURL()
                          link.click()
                          toast.success('QR code téléchargé !')
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Télécharger QR code"
                      >
                        <FaDownload />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal QR Code */}
      {selectedTicket && qrCodeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                QR Code - Ticket #{selectedTicket.id}
              </h3>
              <button
                onClick={() => {
                  setSelectedTicket(null)
                  setQrCodeImage(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <img src={qrCodeImage} alt="QR Code" className="w-64 h-64" />
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Ticket:</span> #{selectedTicket.id}</p>
              <p><span className="font-medium">Client:</span> {selectedTicket.customer_name}</p>
              <p><span className="font-medium">Événement:</span> {selectedTicket.event_title}</p>
              <p><span className="font-medium">Statut:</span> {selectedTicket.status}</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={downloadQR}
                variant="primary"
                fullWidth
              >
                <FaDownload className="mr-2" />
                Télécharger QR
              </Button>
              <Button
                onClick={() => {
                  setSelectedTicket(null)
                  setQrCodeImage(null)
                }}
                variant="outline"
                fullWidth
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}