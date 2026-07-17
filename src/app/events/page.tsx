/**
 * Page des événements
 */
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvents } from '@/hooks/useEvents'

// Import des modèles
import { EventTypes } from '@/models/Event'

// Composants layout
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Container from '@/components/ui/Container'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

// Composants événements
import EventCard from '@/components/events/EventCard'
import EventSearchBar from '@/components/events/EventSearchBar'
import EventCategories from '@/components/events/EventCategories'
import EventStats from '@/components/events/EventStats'
import SponsorsSection from '@/components/events/SponsorsSection'

// Types
interface EventType {
  id: string
  titre: string
  description: string
  type: string
  service: string
  image: string
  prix: number
  prixPromotion: number | null
  date: Date
  duree: number
  lieu: string
  formateur: {
    id: string
    nom: string
    titre: string
    bio: string
    photo: string
    specialites: string[]
  }
  nbPlaces: number
  nbInscrits: number
  statut: string
  videoPublicitaire?: string
}

// Catégories avec leurs labels
const categories = [
  { id: 'all', label: 'Tous', count: 0 },
  { id: 'conférence', label: 'Conférences', count: 0 },
  { id: 'séminaire', label: 'Séminaires', count: 0 },
  { id: 'formation', label: 'Formations', count: 0 },
]

export default function EventsPage() {
  const { events, loading, fetchEvents } = useEvents()
  
  // États
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([])
  const [viewMode, setViewMode] = useState('grid')

  // Charger les événements
  useEffect(() => {
    fetchEvents()
  }, [])

  // Mettre à jour les catégories avec les compteurs
  const updateCategories = useCallback(() => {
    const eventTypes = events.reduce((acc: Record<string, number>, event: EventType) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {})

    return categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: events.length }
      }
      return { ...cat, count: eventTypes[cat.id] || 0 }
    })
  }, [events])

  // Filtrer les événements
  useEffect(() => {
    // Vérifier que events est un tableau
    if (!events || !Array.isArray(events)) {
      setFilteredEvents([])
      return
    }

    let filtered = [...events]

    // Recherche avec vérification des valeurs undefined
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(event => {
        const titre = event?.titre || ''
        const description = event?.description || ''
        return titre.toLowerCase().includes(term) || 
               description.toLowerCase().includes(term)
      })
    }

    // Catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event?.type === selectedCategory)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedCategory])

  // Statistiques
  const stats = {
    total: events?.length || 0,
    upcoming: events?.filter((e: EventType) => e?.statut === 'à venir').length || 0,
    participants: events?.reduce((acc: number, e: EventType) => acc + (e?.nbInscrits || 0), 0) || 0,
  }

  // Rendu des événements
  const renderEvents = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner size="large" className="text-dice-blue" />
        </div>
      )
    }

    if (!filteredEvents || filteredEvents.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier votre recherche ou votre catégorie
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="mt-4 text-dice-blue hover:text-dice-blue-dark font-medium"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event?.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    )
  }

  const updatedCategories = updateCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-12">
          <Container>
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="default" className="mb-4">
                  Nos événements
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
                  Découvrez nos <br />
                  <span className="gradient-text">événements</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                  Des formations, conférences et séminaires pour votre développement personnel et professionnel.
                </p>

                {/* Statistiques */}
                <div className="mt-6">
                  <EventStats 
                    totalEvents={stats.total}
                    upcomingEvents={stats.upcoming}
                    participants={stats.participants}
                  />
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Section Recherche */}
        <section className="py-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-30">
          <Container>
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Barre de recherche */}
              <div className="flex-1 max-w-xl">
                <EventSearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Rechercher un événement..."
                />
              </div>

              {/* Vue mode toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-dice-blue/10 text-dice-blue' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-dice-blue/10 text-dice-blue' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h1zM11 3a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V4a1 1 0 011-1h1zM17 3a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V4a1 1 0 011-1h1zM5 9a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1a1 1 0 011-1h1zM11 9a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1zM17 9a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1zM5 15a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1a1 1 0 011-1h1zM11 15a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1zM17 15a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1z" />
                  </svg>
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* Catégories - UNIQUE FILTRE */}
        <section className="py-6">
          <Container>
            <EventCategories
              categories={updatedCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </Container>
        </section>

        {/* Grille des événements */}
        <section className="py-8">
          <Container>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredEvents?.length || 0} événement{filteredEvents?.length !== 1 ? 's' : ''} trouvé{filteredEvents?.length !== 1 ? 's' : ''}
              </div>
              {filteredEvents && filteredEvents.length > 0 && (
                <select className="text-sm bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none">
                  <option value="date">Trier par date</option>
                  <option value="popularity">Popularité</option>
                  <option value="price">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              )}
            </div>

            <AnimatePresence mode="wait">
              {renderEvents()}
            </AnimatePresence>
          </Container>
        </section>

      </main>
      
    </div>
  )
}