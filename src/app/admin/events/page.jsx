/**
 * Gestion des événements - Admin avec lightbox
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaPlus, FaEye, FaEdit, FaTrash, FaCalendar,
  FaMapMarker, FaUsers, FaTicketAlt, FaSearch,
  FaSync, FaSpinner,
  FaCalendarPlus
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EventLightbox from '@/components/events/EventLightbox'
import toast from 'react-hot-toast'

export default function AdminEvents() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = auth.getToken()
      const data = await api.getEvents(token)
      setEvents(data || [])
    } catch (err) {
      setError(err.message)
      toast.error('Erreur lors du chargement des événements')
    } finally {
      setLoading(false)
    }
  }

  // La suppression est maintenant gérée correctement avec DELETE
const handleDelete = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return
  
  try {
    const token = auth.getToken()
    await api.deleteEvent(id, token)
    toast.success('Événement supprimé avec succès !')
    await loadEvents()
  } catch (err) {
    toast.error(err.message || 'Erreur lors de la suppression')
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

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return { variant: 'success', label: 'Publié' }
    } else if (status === 'draft') {
      return { variant: 'warning', label: 'Brouillon' }
    } else {
      return { variant: 'default', label: status || 'Inconnu' }
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
    <>
      <div className="p-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des événements</h1>
            <p className="text-gray-500">
              {events.length} événement{events.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadEvents}
              disabled={loading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
            </button>
            <Link href="/admin/events/create">
              <Button variant="primary">
                <FaCalendarPlus className="mr-2" />
                Nouvel événement
              </Button>
            </Link>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
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

        {/* Liste des événements */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement</h3>
            <p className="text-gray-400">Commencez par créer votre premier événement</p>
            <Link href="/admin/events/create">
              <Button variant="primary" className="mt-4">
                <FaPlus className="mr-2" />
                Créer un événement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const statusBadge = getStatusBadge(event.status)
              const isDeleting = deleting === event.id
              
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendar className="text-dice-blue" />
                          {new Date(event.start_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarker className="text-dice-blue" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-dice-blue" />
                          {event.capacity} places
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTicketAlt className="text-dice-blue" />
                          {event.available_tickets || 0} disponibles
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-dice-blue">
                            {event.price} {event.currency || 'FCFA'}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openLightbox(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir sur le site"
                      >
                        <FaEye />
                      </button>
                      <Link href={`/admin/events/edit/${event.id}`}>
                        <button 
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={isDeleting}
                        className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50`}
                        title="Supprimer"
                      >
                        {isDeleting ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <EventLightbox
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        event={selectedEvent}
      />
    </>
  )
}