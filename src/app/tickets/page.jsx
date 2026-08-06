/**
 * Page des tickets réservés
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaTicketAlt, FaArrowLeft, FaQrcode, FaDownload,
  FaCheckCircle, FaClock, FaTimesCircle, FaCalendar,
  FaMapMarker, FaUser, FaEuroSign
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function TicketsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadTickets(token)
  }, [router])

  const loadTickets = async (token) => {
    try {
      setLoading(true)
      const data = await api.getTickets(token)
      setTickets(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des tickets')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    if (filter === 'pending') return ticket.status === 'pending'
    if (filter === 'paid') return ticket.status === 'paid' || ticket.status === 'validated'
    if (filter === 'cancelled') return ticket.status === 'cancelled'
    return true
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return { label: 'Payé', icon: FaCheckCircle, className: 'bg-green-100 text-green-700' }
      case 'validated':
        return { label: 'Validé', icon: FaCheckCircle, className: 'bg-green-100 text-green-700' }
      case 'pending':
        return { label: 'En attente', icon: FaClock, className: 'bg-yellow-100 text-yellow-700' }
      case 'cancelled':
        return { label: 'Annulé', icon: FaTimesCircle, className: 'bg-red-100 text-red-700' }
      default:
        return { label: status || 'Inconnu', icon: FaTicketAlt, className: 'bg-gray-100 text-gray-700' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/espace-client" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Mes tickets</h1>
          <span className="text-sm text-gray-500 ml-auto">{tickets.length} tickets</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-dice-blue text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'paid' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Payés
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'cancelled' 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Annulés
          </button>
        </div>

        {/* Liste des tickets */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun ticket</h3>
            <p className="text-gray-400">Vous n'avez pas encore réservé de tickets</p>
            <Link href="/events">
              <button className="mt-4 px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors">
                Explorer les événements
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const status = getStatusBadge(ticket.status)
              const StatusIcon = status.icon

              return (
                <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-dice-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaTicketAlt className="text-dice-blue text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ticket.event_title || 'Événement'}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${status.className}`}>
                            <StatusIcon className="text-xs" />
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaCalendar className="text-dice-blue text-xs" />
                            <span>
                              {ticket.created_at ? format(new Date(ticket.created_at), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUser className="text-dice-blue text-xs" />
                            <span>{ticket.customer_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaEuroSign className="text-dice-blue text-xs" />
                            <span className="font-semibold text-dice-blue">
                              {ticket.total_price?.toLocaleString() || 0} {ticket.currency || 'FCFA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Quantité: {ticket.quantity || 1}</span>
                          </div>
                        </div>
                        {ticket.qr_codes && ticket.qr_codes.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <FaQrcode className="text-dice-blue" />
                            <span className="font-mono tracking-[0.2em] font-semibold text-dice-blue">
                              {String(
                                ticket.entry_code ||
                                  ticket.qr_codes[0]?.entry_code ||
                                  '--------'
                              )
                                .replace(/\D/g, '')
                                .padStart(8, '0')
                                .slice(-8)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {ticket.qr_codes && ticket.qr_codes.length > 0 && (
                        <button className="p-2 text-dice-blue hover:bg-dice-blue/10 rounded-lg transition-colors" title="Télécharger QR code">
                          <FaDownload className="text-sm" />
                        </button>
                      )}
                      <Link href={`/events/${ticket.event_id}`}>
                        <button className="px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm">
                          Voir événement
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}