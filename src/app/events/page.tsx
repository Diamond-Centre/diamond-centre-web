/**
 * Page publique des événements - Avec toutes les dates et heures
 */
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCalendar, FaMapMarker, FaClock, FaSearch, 
  FaFilter, FaTicketAlt, FaTag, FaStar,
  FaUser, FaUsers, FaEuroSign, FaInfoCircle,
  FaPercent, FaClock as FaClockIcon, FaCalendarAlt,
  FaVenusMars, FaCalendarCheck
} from 'react-icons/fa'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { format, differenceInDays, differenceInHours } from 'date-fns'
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

  // Calcul du prix avec promotion
  const getPriceWithPromotion = (event) => {
    if (event.promotion && event.promotion.pourcentage) {
      const discount = (event.price * event.promotion.pourcentage) / 100
      return Math.round(event.price - discount)
    }
    return event.price
  }

  const getPriceDisplay = (event) => {
    const promoPrice = getPriceWithPromotion(event)
    
    if (event.promotion && event.promotion.pourcentage) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl font-bold text-dice-blue">
            {promoPrice} {event.currency || 'FCFA'}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {event.price} {event.currency || 'FCFA'}
          </span>
          <Badge variant="success" className="text-xs bg-green-500 text-white">
            -{event.promotion.pourcentage}%
          </Badge>
        </div>
      )
    }
    
    return (
      <span className="text-2xl font-bold text-dice-blue">
        {event.price} {event.currency || 'FCFA'}
      </span>
    )
  }

  // Calcul de la durée
  const getDuration = (startDate, endDate) => {
    const days = differenceInDays(new Date(endDate), new Date(startDate))
    if (days === 0) {
      const hours = differenceInHours(new Date(endDate), new Date(startDate))
      return hours > 0 ? `${hours} heures` : 'Moins d\'une heure'
    }
    return `${days + 1} jours`
  }

  // Obtenir le label du sexe ciblé
  const getSexeLabel = (sexe) => {
    if (!sexe) return 'Tous'
    const sexeMap = {
      'tous': 'Tous',
      'homme': 'Hommes',
      'femme': 'Femmes'
    }
    return sexeMap[sexe] || sexe
  }

  // Formater l'heure
  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm')
  }

  // Formater la date
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr })
  }

 // Dans la page des événements
// Dans la page des événements, gérer le succès de la réservation
const handleReservationSuccess = (ticketData) => {
  console.log('✅ Réservation réussie:', ticketData)
  console.log('🎫 Ticket ID:', ticketData.id)
  console.log('📧 Client:', ticketData.customer_name)
  console.log('📅 Événement:', ticketData.event_title)
  console.log('🔢 QR Code:', ticketData.qrCode?.qr_code)
  
  // Le ticket est automatiquement visible dans /admin/tickets
  toast.success('Ticket réservé avec succès ! Visible dans le dashboard admin.')
  
  // Rafraîchir les événements pour mettre à jour les places disponibles
  fetchPublicEvents()
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
                const hasPromotion = event.promotion && event.promotion.pourcentage > 0
                const promoPrice = hasPromotion ? Math.round(getPriceWithPromotion(event)) : null
                const duration = getDuration(event.start_date, event.end_date)
                const sexeLabel = getSexeLabel(event.promotion?.sexe)
                const startDate = formatDate(event.start_date)
                const endDate = formatDate(event.end_date)
                const startTime = formatTime(event.start_date)
                const endTime = formatTime(event.end_date)

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
                          onError={(e) => {
                            e.target.style.display = 'none'
                            const parent = e.target.parentElement
                            const fallback = document.createElement('div')
                            fallback.className = 'w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center'
                            fallback.innerHTML = '<span class="text-5xl">🎯</span>'
                            parent.appendChild(fallback)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-5xl">🎯</span>
                        </div>
                      )}
                      
                      {/* Badge Promotion */}
                      {hasPromotion && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                            <FaTag className="text-xs" />
                            <span className="text-xs font-bold">-{event.promotion.pourcentage}%</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
                          {event.category || 'Événement'}
                        </Badge>
                      </div>
                      
                      {isPast && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                          <Badge variant="warning" className="bg-yellow-500/90 backdrop-blur-sm">
                            Terminé
                          </Badge>
                        </div>
                      )}
                      
                      {isFull && !isPast && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                          <Badge variant="danger" className="bg-red-500/90 backdrop-blur-sm">
                            Complet
                          </Badge>
                        </div>
                      )}
                      
                      {!isPast && !isFull && placesRestantes <= 3 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
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

                      {/* Détails de l'événement avec toutes les dates et heures */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaCalendarCheck className="text-dice-blue text-xs flex-shrink-0" />
                          <span>
                            Du {startDate} au {endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClockIcon className="text-dice-blue text-xs flex-shrink-0" />
                          <span>
                            {startTime} - {endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-dice-blue text-xs flex-shrink-0" />
                          <span>Durée: {duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarker className="text-dice-blue text-xs flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUsers className="text-dice-blue text-xs flex-shrink-0" />
                          <span>Capacité: {event.capacity} places</span>
                        </div>
                      </div>

                      {/* Description de la promotion avec cible */}
                      {hasPromotion && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700">
                            <FaTag className="inline mr-1 text-green-500" />
                            {event.promotion.description || 'Offre promotionnelle'}
                          </p>
                          
                          {/* Cible de la promotion */}
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-green-600">
                            <span className="flex items-center gap-1">
                              <FaVenusMars className="text-green-500" />
                              Ciblé: {sexeLabel}
                            </span>
                            {event.promotion.duree && (
                              <span className="flex items-center gap-1">
                                <FaClockIcon className="text-green-500" />
                                {event.promotion.duree} jours
                              </span>
                            )}
                            {event.promotion.nombre && (
                              <span className="flex items-center gap-1">
                                <FaTicketAlt className="text-green-500" />
                                {event.promotion.nombre} places
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Informations du formateur */}
                      {event.formateur && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <FaUser className="inline mr-1 text-blue-500" />
                            Formateur: {event.formateur.nom || event.formateur.name || 'À confirmer'}
                          </p>
                          {event.formateur.specialite && (
                            <p className="text-xs text-blue-600 mt-1">
                              <FaInfoCircle className="inline mr-1 text-blue-500" />
                              Spécialité: {event.formateur.specialite}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Prix et bouton */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {getPriceDisplay(event)}
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
        onSuccess={(result) => {
          console.log('✅ Réservation réussie:', result)
          // Mettre à jour la liste des événements
          fetchPublicEvents()
          toast.success('Ticket créé avec succès ! Consultez-le dans le dashboard admin.')
        }}
      />
    </>
  )
}