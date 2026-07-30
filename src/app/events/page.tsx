/**
 * Page publique des événements - Avec réservation
 */
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCalendar, FaMapMarker, FaClock, FaSearch, 
  FaTicketAlt, FaTag, FaUser, FaUsers, FaInfoCircle,
  FaClock as FaClockIcon, FaCalendarAlt, FaVenusMars, FaCalendarCheck
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

// Catégories sans icônes
const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'conférence', label: 'Conférences' },
  { id: 'séminaire', label: 'Séminaires' },
  { id: 'formation', label: 'Formations' },
  { id: 'atelier', label: 'Ateliers' },
]

// Options de tri
const sortOptions = [
  { value: 'created_at', label: 'Plus récent' },
  { value: 'date', label: 'Date' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'price-asc', label: 'Tarif croissant' },
  { value: 'price-desc', label: 'Tarif décroissant' },
]

// Nombre de colonnes par ligne
const COLS_PER_ROW = 3

// Hauteur fixe pour la section promotion
const PROMO_SECTION_HEIGHT = 80

export default function EventsPage() {
  const { events, loading, error, fetchPublicEvents } = useEvents()
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
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

  // Fonction pour obtenir le prix effectif (avec promotion si présente)
  const getEffectivePrice = (event) => {
    if (event.promotion && event.promotion.pourcentage) {
      const discount = (event.price * event.promotion.pourcentage) / 100
      return Math.round(event.price - discount)
    }
    return event.price || 0
  }

  // Fonction de tri avec prise en compte des promotions
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'created_at':
        const dateA = new Date(a.created_at || a.createdAt || 0)
        const dateB = new Date(b.created_at || b.createdAt || 0)
        return dateB - dateA
      
      case 'date':
        return new Date(a.start_date) - new Date(b.start_date)
      
      case 'popularity':
        const popularityA = (a.nb_inscrits || 0) / (a.capacity || 1)
        const popularityB = (b.nb_inscrits || 0) / (b.capacity || 1)
        return popularityB - popularityA
      
      case 'price-asc':
        const priceA = getEffectivePrice(a)
        const priceB = getEffectivePrice(b)
        return priceA - priceB
      
      case 'price-desc':
        const priceADesc = getEffectivePrice(a)
        const priceBDesc = getEffectivePrice(b)
        return priceBDesc - priceADesc
      
      default:
        return 0
    }
  })

  // Grouper les événements par ligne
  const getEventsByRow = () => {
    const rows = []
    for (let i = 0; i < sortedEvents.length; i += COLS_PER_ROW) {
      rows.push(sortedEvents.slice(i, i + COLS_PER_ROW))
    }
    return rows
  }

  // Vérifier si une ligne a au moins une promotion
  const rowHasPromotion = (row) => {
    return row.some(event => event.promotion && event.promotion.pourcentage > 0)
  }

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

  // Dans la page des événements, gérer le succès de la réservation
  const handleReservationSuccess = (ticketData) => {
    console.log('✅ Réservation réussie:', ticketData)
    console.log('🎫 Ticket ID:', ticketData.id)
    console.log('📧 Client:', ticketData.customer_name)
    console.log('📅 Événement:', ticketData.event_title)
    console.log('🔢 QR Code:', ticketData.qrCode?.qr_code)
    
    toast.success('Ticket réservé avec succès ! Retrouvez-le dans "Mes tickets".')
    fetchPublicEvents()
  }

  // Obtenir le label du tri
  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy)
    return option ? option.label : 'Plus récent'
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

  const eventRows = getEventsByRow()

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

          {/* Barre de recherche, filtres et tri */}
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
              
              <div className="flex gap-2 items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent text-sm min-w-[140px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catégories sans icônes */}
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
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''} trouvé{sortedEvents.length > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-400">
              Tri : <span className="font-medium">{getSortLabel()}</span>
            </div>
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
            <div className="space-y-6">
              {eventRows.map((row, rowIndex) => {
                const hasPromoInRow = rowHasPromotion(row)
                
                return (
                  <div key={rowIndex} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {row.map((event, index) => {
                      const isPast = new Date(event.start_date) < new Date()
                      const placesRestantes = (event.available_tickets || event.capacity) - (event.nb_inscrits || 0)
                      const isFull = placesRestantes <= 0
                      const hasPromotion = event.promotion && event.promotion.pourcentage > 0
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
                          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full"
                        >
                          {/* Image - hauteur fixe */}
                          <div className="relative h-52 flex-shrink-0 overflow-hidden bg-gray-100">
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

                          {/* Contenu - flex flex-col avec hauteur totale */}
                          <div className="p-5 flex flex-col flex-1">
                            {/* Titre et description */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-dice-blue transition-colors">
                              {event.title}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-shrink-0">
                              {event.description}
                            </p>

                            {/* Détails - espacement fixe */}
                            <div className="space-y-2 text-sm text-gray-600 flex-shrink-0">
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

                            {/* Section promotion avec hauteur FIXE */}
                            <div className="flex-shrink-0 mt-3" style={{ height: hasPromoInRow ? `${PROMO_SECTION_HEIGHT}px` : '0px' }}>
                              {hasPromoInRow && (
                                hasPromotion ? (
                                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg h-full overflow-hidden">
                                    <p className="text-xs text-green-700">
                                      <FaTag className="inline mr-1 text-green-500" />
                                      {event.promotion.description || 'Offre promotionnelle'}
                                    </p>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-green-600">
                                      <span className="flex items-center gap-1">
                                        <FaVenusMars className="text-green-500" />
                                        {sexeLabel}
                                      </span>
                                      {event.promotion.duree && (
                                        <span className="flex items-center gap-1">
                                          <FaClockIcon className="text-green-500" />
                                          {event.promotion.duree}j
                                        </span>
                                      )}
                                      {event.promotion.nombre && (
                                        <span className="flex items-center gap-1">
                                          <FaTicketAlt className="text-green-500" />
                                          {event.promotion.nombre}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full" />
                                )
                              )}
                            </div>

                            {/* Section formateur */}
                            <div className="flex-shrink-0 mt-3" style={{ minHeight: event.formateur ? 'auto' : '0px' }}>
                              {event.formateur && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-xs text-blue-700 truncate">
                                    <FaUser className="inline mr-1 text-blue-500" />
                                    {event.formateur.nom || event.formateur.name || 'À confirmer'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Prix et bouton - mt-auto pour pousser vers le bas */}
                            <div className="mt-auto pt-3 border-t border-gray-100 flex-shrink-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  {getPriceDisplay(event)}
                                  <span className="text-xs text-gray-400 ml-1">
                                    / pers.
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {placesRestantes > 0 ? `${placesRestantes} pl.` : 'Complet'}
                                </div>
                              </div>

                              <Button 
                                variant="primary" 
                                fullWidth 
                                className="mt-2 text-sm py-2"
                                onClick={() => openReservation(event)}
                                disabled={isPast || isFull}
                              >
                                {isPast ? 'Terminé' : isFull ? 'Complet' : 'Réserver'}
                                {!isPast && !isFull && (
                                  <FaTicketAlt className="ml-1.5 text-xs" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
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
      onSuccess={(ticketData) => {
        console.log('✅ Réservation réussie:', ticketData)
        fetchPublicEvents()
        //toast.success('Ticket réservé avec succès !')
      }}
    />
    </>
  )
}