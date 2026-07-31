/**
 * Page publique des événements — grille + réservation
 */
'use client'

import { useEffect, useState } from 'react'
import { FaSearch, FaTicketAlt } from 'react-icons/fa'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import EventCard from '@/components/events/EventCard'
import ReservationModal from '@/components/events/ReservationModal'
import toast from 'react-hot-toast'

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'conférence', label: 'Conférences' },
  { id: 'séminaire', label: 'Séminaires' },
  { id: 'formation', label: 'Formations' },
  { id: 'atelier', label: 'Ateliers' },
]

const sortOptions = [
  { value: 'created_at', label: 'Plus récent' },
  { value: 'date', label: 'Date' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'price-asc', label: 'Tarif croissant' },
  { value: 'price-desc', label: 'Tarif décroissant' },
]

export default function EventsPage() {
  const { events, loading, error, fetchPublicEvents } = useEvents()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPublicEvents()
  }, [fetchPublicEvents])

  const getEffectivePrice = (event) => {
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
        selectedCategory === 'all' || event.category === selectedCategory
      return matchSearch && matchCategory
    }) || []

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'created_at': {
        const dateA = new Date(a.created_at || a.createdAt || 0)
        const dateB = new Date(b.created_at || b.createdAt || 0)
        return dateB - dateA
      }
      case 'date':
        return new Date(a.start_date) - new Date(b.start_date)
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

  const openReservation = (event) => {
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
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Erreur de chargement
          </h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => fetchPublicEvents()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#F4F7FB] pt-24">
        <Container>
          <div className="py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
              Programme
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1220] md:text-4xl">
              Nos événements
            </h1>
            <p className="mt-2 max-w-xl text-[#667085]">
              Formations, conférences et ateliers DiCe — réservez votre place en
              quelques secondes.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  type="text"
                  placeholder="Rechercher un événement…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8EEF5] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0A89F2]/40 focus:ring-2 focus:ring-[#0A89F2]/15"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[160px] rounded-2xl border border-[#E8EEF5] bg-white px-4 py-3 text-sm outline-none focus:border-[#0A89F2]/40 focus:ring-2 focus:ring-[#0A89F2]/15"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#0A89F2] text-white shadow-[0_8px_20px_rgba(10,137,242,0.28)]'
                      : 'border border-[#E8EEF5] bg-white text-[#667085] hover:border-[#0A89F2]/35 hover:text-[#0A89F2]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-[#667085]">
              {sortedEvents.length} événement
              {sortedEvents.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-[#98A2B3]">
              Tri : <span className="font-medium text-[#667085]">{getSortLabel()}</span>
            </p>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#E8EEF5] bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FE] text-[#0A89F2]">
                <FaTicketAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1220]">
                Aucun événement trouvé
              </h3>
              <p className="mt-2 text-sm text-[#667085]">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <Button
                variant="outline"
                className="mt-5"
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
            <div className="grid gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onSuccess={(ticket) => {
          const qty = Math.max(1, Number(ticket?.quantity ?? 1))
          toast.success(
            `${qty} ticket${qty > 1 ? 's' : ''} réservé${qty > 1 ? 's' : ''} ! Retrouvez-les dans Mon espace.`
          )
          fetchPublicEvents()
        }}
      />
    </>
  )
}
