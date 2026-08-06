/**
 * Mes tickets - Avec affichage du QR code
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaTicketAlt, FaSearch, FaEye, FaDownload, FaArrowLeft, FaQrcode } from 'react-icons/fa'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function TicketsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadTickets(token)
  }, [router])

  const loadTickets = async (token) => {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTickets(data || [])
      }
    } catch (error) {
      console.error('Erreur chargement tickets:', error)
      toast.error('Erreur lors du chargement des tickets')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.id?.toString().includes(searchTerm)
    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus
    return matchSearch && matchStatus
  })

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return { label: 'Payé', className: 'bg-green-100 text-green-700' }
      case 'validated': return { label: 'Validé', className: 'bg-blue-100 text-blue-700' }
      case 'pending': return { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' }
      case 'cancelled': return { label: 'Annulé', className: 'bg-red-100 text-red-700' }
      default: return { label: status || 'Inconnu', className: 'bg-gray-100 text-gray-700' }
    }
  }

  const handleShowQR = (ticket) => {
    setSelectedTicket(ticket)
    setShowQRModal(true)
  }

  const handleDownloadQR = (ticket) => {
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 300, 300)
    
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🎫', 150, 100)
    ctx.font = '14px Arial'
    ctx.fillText(`Ticket #${ticket.id}`, 150, 150)
    ctx.fillStyle = '#1a1a2e'
    ctx.font = '12px Arial'
    ctx.fillText(ticket.event_title || 'Événement', 150, 180)
    ctx.fillText(ticket.customer_name || 'Client', 150, 200)
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 28px monospace'
    const entry =
      ticket.entry_code ||
      ticket.qr_codes?.[0]?.entry_code ||
      ticket.qr_codes?.[0]?.code ||
      '--------'
    ctx.fillText(String(entry).replace(/\D/g, '').padStart(8, '0').slice(-8), 150, 240)
    
    const link = document.createElement('a')
    link.download = `ticket-${ticket.id}-qr.png`
    link.href = canvas.toDataURL()
    link.click()
    toast.success('QR code téléchargé')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mes tickets</h1>
          <p className="text-gray-500">{tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none bg-white shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none bg-white shadow-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="paid">Payé</option>
          <option value="validated">Validé</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-7xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun ticket</h3>
          <p className="text-gray-400">Vous n'avez pas encore de tickets</p>
          <Link href="/events">
            <button className="mt-4 px-6 py-2.5 bg-dice-blue text-white rounded-xl hover:bg-dice-blue-dark transition-colors">
              Explorer les événements
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const status = getStatusLabel(ticket.status)
            const hasQR = ticket.qr_codes && ticket.qr_codes.length > 0

            return (
              <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dice-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaTicketAlt className="text-dice-blue text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {ticket.event_title || 'Événement'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ticket.quantity || 1} place{ticket.quantity > 1 ? 's' : ''}
                        {hasQR && (
                          <span className="ml-2 text-xs text-dice-blue font-medium">
                            ✓ QR code disponible
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="text-sm font-semibold text-dice-blue">
                      {ticket.total_price?.toLocaleString() || 0} FCFA
                    </span>
                    {hasQR && (
                      <>
                        <button
                          onClick={() => handleShowQR(ticket)}
                          className="p-2 text-dice-blue hover:bg-dice-blue/10 rounded-lg transition-colors"
                          title="Voir QR Code"
                        >
                          <FaQrcode />
                        </button>
                        <button
                          onClick={() => handleDownloadQR(ticket)}
                          className="p-2 text-dice-blue hover:bg-dice-blue/10 rounded-lg transition-colors"
                          title="Télécharger QR"
                        >
                          <FaDownload />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="w-48 h-48 bg-dice-blue/5 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎫</div>
                    <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded tracking-[0.2em]">
                      {String(
                        selectedTicket.entry_code ||
                          selectedTicket.qr_codes?.[0]?.entry_code ||
                          '--------'
                      )
                        .replace(/\D/g, '')
                        .padStart(8, '0')
                        .slice(-8)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      #{selectedTicket.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Événement:</span> {selectedTicket.event_title}</p>
              <p><span className="font-medium">Nom:</span> {selectedTicket.customer_name}</p>
              <p><span className="font-medium">Places:</span> {selectedTicket.quantity}</p>
              <p><span className="font-medium">Statut:</span> <span className="text-green-600">Payé</span></p>
            </div>

            <button
              onClick={() => {
                handleDownloadQR(selectedTicket)
                setShowQRModal(false)
              }}
              className="w-full mt-4 px-4 py-2 bg-dice-blue text-white rounded-xl hover:bg-dice-blue-dark transition-colors"
            >
              Télécharger le QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  )
}