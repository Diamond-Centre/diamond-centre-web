'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import Spinner from '@/components/ui/Spinner'
import LoadError from '@/components/ui/LoadError'
import EventCard from '@/components/events/EventCard'
import ReservationModal from '@/components/events/ReservationModal'
import toast from 'react-hot-toast'

import './events.css'

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'conference', label: 'Conférences' },
  { id: 'seminaire', label: 'Séminaires' },
  { id: 'formation', label: 'Formations' },
  { id: 'atelier', label: 'Ateliers' },
]

function normalizeCategory(value: unknown) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const sortOptions = [
  { value: 'created_at', label: 'Plus récent' },
  { value: 'date', label: 'Date' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'price-asc', label: 'Tarif croissant' },
  { value: 'price-desc', label: 'Tarif décroissant' },
]

const paramToCategoryMap: Record<string, string> = {
  conference: 'conference',
  seminar: 'seminaire',
  seminaire: 'seminaire',
  formation: 'formation',
  workshop: 'atelier',
  atelier: 'atelier',
}

const categoryToParamMap: Record<string, string> = {
  conference: 'conference',
  seminaire: 'seminar',
  formation: 'formation',
  atelier: 'workshop',
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <Spinner size="large" className="text-dice-blue" />
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
}

function EventsPageContent() {
  const { events, loading, error, fetchPublicEvents } = useEvents()
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeParam = searchParams.get('type')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Synchroniser le filtre actif avec le paramètre de l'URL
  useEffect(() => {
    if (typeParam) {
      const categoryId =
        paramToCategoryMap[normalizeCategory(typeParam)] ||
        paramToCategoryMap[typeParam]
      if (categoryId) {
        setSelectedCategory(categoryId)
      } else {
        setSelectedCategory('all')
      }
    } else {
      setSelectedCategory('all')
    }
  }, [typeParam])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const paramVal = categoryToParamMap[categoryId]
    if (paramVal) {
      router.push(`/events?type=${paramVal}`, { scroll: false })
    } else {
      router.push('/events', { scroll: false })
    }
  }

  useEffect(() => {
    fetchPublicEvents()
  }, [fetchPublicEvents])

  const getEffectivePrice = (event: any) => {
    if (event.promotion && event.promotion.pourcentage) {
      const discount = (event.price * event.promotion.pourcentage) / 100
      return Math.round(event.price - discount)
    }
    return event.price || 0
  }

  const filteredEvents =
    events?.filter((event) => {
      const matchSearch =
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategory =
        selectedCategory === 'all' ||
        normalizeCategory(event.category) === normalizeCategory(selectedCategory)
      return matchSearch && matchCategory
    }) || []

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'created_at': {
        const dateA = new Date(a.created_at || a.createdAt || 0)
        const dateB = new Date(b.created_at || b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      }
      case 'date':
        return new Date(a.start_date || a.date).getTime() - new Date(b.start_date || b.date).getTime()
      case 'popularity': {
        const popularityA = (a.nb_inscrits || 0) / (a.capacity || 1)
        const popularityB = (b.nb_inscrits || 0) / (b.capacity || 1)
        return popularityB - popularityA
      }
      case 'price-asc':
        return getEffectivePrice(a) - getEffectivePrice(b)
      case 'price-desc':
        return getEffectivePrice(b) - getEffectivePrice(a)
      default:
        return 0
    }
  })

  const openReservation = (event: any) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const getSortLabel = () =>
    sortOptions.find((opt) => opt.value === sortBy)?.label || 'Plus récent'

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <Spinner size="large" className="text-dice-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24 px-4">
        <div className="w-full max-w-md">
          <LoadError onRetry={() => fetchPublicEvents()} />
        </div>
      </div>
    )
  }

  return (
    <div className="events-page">
      <main>
        <section className="events-page-hero">
          <div className="events-page-glow" />
          <div className="events-page-copy">
            <span className="events-page-eyebrow">DIAMOND CENTRE · EXPÉRIENCES</span>
            <h1>Nos<br /><em>événements.</em></h1>
            <p>Formations, conférences et ateliers conçus pour provoquer des rencontres, développer les compétences et faire émerger de nouvelles ambitions.</p>
          </div>
          <div className="events-bento" aria-label="Aperçu des événements">
            <figure className="bento-main">
              <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&h=900&fit=crop&auto=format" alt="Conférence Diamond Centre" />
              <span>CONFÉRENCES</span>
            </figure>
            <figure>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=800&fit=crop&auto=format" alt="Formation Diamond Centre" />
              <span>FORMATIONS</span>
            </figure>
            <figure>
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop&auto=format" alt="Réseautage Diamond Centre" />
              <span>RÉSEAUTAGE</span>
            </figure>
          </div>
        </section>

        <section className="events-catalog">
          <div className="catalog-head">
            <div>
              <span>PROGRAMME</span>
              <h2>Trouvez votre prochaine expérience.</h2>
            </div>
            <p>{sortedEvents.length} événement{sortedEvents.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="events-toolbar">
            <div className="event-search">
              ⌕ <input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="event-filters">
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={selectedCategory === cat.id ? 'active' : ''}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {sortedEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
              <h3>Aucun événement trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  handleCategoryChange('all')
                  fetchPublicEvents()
                }}
                style={{ marginTop: 20, padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <div className="events-list">
              {sortedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onReserve={openReservation}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSuccess={(ticket: any) => {
          const qty = Math.max(1, Number(ticket?.quantity ?? 1))
          toast.success(
            `${qty} ticket${qty > 1 ? 's' : ''} réservé${qty > 1 ? 's' : ''} ! Retrouvez-les dans Mon espace.`
          )
          fetchPublicEvents()
        }}
      />
    </div>
  )
}
