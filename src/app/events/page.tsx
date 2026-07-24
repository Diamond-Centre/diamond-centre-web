'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCalendar, FaMapMarker, FaClock, FaSearch, 
  FaFilter, FaTicketAlt
} from 'react-icons/fa'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import ReservationModal from '@/components/events/ReservationModal'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

// Catégories avec icônes
const categories = [
  { id: 'all', label: 'Tous', icon: '🎯' },
  { id: 'conférence', label: 'Conférences', icon: '🎤' },
  { id: 'séminaire', label: 'Séminaires', icon: '📚' },
  { id: 'formation', label: 'Formations', icon: '🎓' },
  { id: 'atelier', label: 'Ateliers', icon: '🛠️' },
]

export default function EventsPage() {
  const { events, loading, error, fetchPublicEvents } = useEvents()
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPublicEvents()
  }, [fetchPublicEvents])

  const filteredEvents = events?.filter(event => {
    const matchSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchSearch && matchCategory
  }) || []

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.start_date) - new Date(b.start_date)
    } else if (sortBy === 'price-asc') {
      return a.price - b.price
    } else if (sortBy === 'price-desc') {
      return b.price - a.price
    }
    return 0
  })

  const openReservation = (event) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center pt-20">
          <Spinner size="large" className="text-dice-blue" />
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center pt-20">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-700">Erreur de chargement</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => fetchPublicEvents()}
            >
              Réessayer
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        <Container>
          {/* En-tête */}
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Nos événements
            </h1>
            <p className="text-gray-600 mt-2">
              Découvrez tous nos événements à venir et réservez votre place
            </p>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent bg-white"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent text-sm"
                >
                  <option value="date">Trier par date</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-dice-blue text-white shadow-md shadow-dice-blue/25'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div className="text-sm text-gray-500 mb-4">
            {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''} trouvé{sortedEvents.length > 1 ? 's' : ''}
          </div>

          {/* Grille des événements */}
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-400">Essayez de modifier vos filtres ou votre recherche</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  fetchPublicEvents()
                }}
              >
                Réinitialiser
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event, index) => {
                const isPast = new Date(event.start_date) < new Date()
                const placesRestantes = (event.available_tickets || event.capacity) - (event.nb_inscrits || 0)
                const isFull = placesRestantes <= 0

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      {event.image_url ? (
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-5xl">🎯</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
                          {event.category || 'Événement'}
                        </Badge>
                      </div>
                      {isPast && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="warning" className="bg-yellow-500/90 backdrop-blur-sm">
                            Terminé
                          </Badge>
                        </div>
                      )}
                      {isFull && !isPast && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="danger" className="bg-red-500/90 backdrop-blur-sm">
                            Complet
                          </Badge>
                        </div>
                      )}
                      {!isPast && !isFull && placesRestantes <= 3 && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="warning" className="bg-orange-500/90 backdrop-blur-sm">
                            Dernières places
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-dice-blue transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-dice-blue text-xs flex-shrink-0" />
                          <span>
                            {format(new Date(event.start_date), 'dd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-dice-blue text-xs flex-shrink-0" />
                          <span>
                            {format(new Date(event.start_date), 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarker className="text-dice-blue text-xs flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-dice-blue">
                              {event.price} {event.currency || 'FCFA'}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              / personne
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {placesRestantes > 0 ? `${placesRestantes} places` : 'Complet'}
                          </div>
                        </div>

                        <Button 
                          variant="primary" 
                          fullWidth 
                          className="mt-2"
                          onClick={() => openReservation(event)}
                          disabled={isPast || isFull}
                        >
                          {isPast ? 'Terminé' : isFull ? 'Complet' : 'Réserver'}
                          {!isPast && !isFull && (
                            <FaTicketAlt className="ml-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Container>
      </main>

      {/* Modal de réservation */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSuccess={(ticket) => {
          console.log('Réservation réussie:', ticket)
          fetchPublicEvents()
        }}
      />
    </>
  )
}