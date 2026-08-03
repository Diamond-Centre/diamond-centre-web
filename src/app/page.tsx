'use client'

import { useEffect, useState } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import HeroSection from '@/components/layout/HeroSection'
import WhyDiceSection from '@/components/layout/WhyDiceSection'
import FormationsSection from '@/components/layout/FormationsSection'
import CTASection from '@/components/layout/CTASection'
import ReservationModal from '@/components/events/ReservationModal'
import toast from 'react-hot-toast'

export default function Home() {
  const { events, loading, fetchPublicEvents } = useEvents()
  const { isAuthenticated } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPublicEvents?.()
  }, [fetchPublicEvents])

  const upcomingEvents = (events || [])
    .filter((e) => {
      if (e.status && e.status !== 'published') return false
      const d = new Date(e.end_date || e.start_date || 0)
      if (Number.isNaN(d.getTime())) return true
      return d.getTime() >= Date.now() - 86400000
    })
    .sort(
      (a, b) =>
        new Date(a.start_date || 0).getTime() -
        new Date(b.start_date || 0).getTime()
    )
    .slice(0, 3)

  const openReservation = (event) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <HeroSection />
      <WhyDiceSection />
      <FormationsSection
        events={upcomingEvents}
        loading={loading}
        onReserve={openReservation}
      />
      <CTASection />

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
          fetchPublicEvents?.()
        }}
      />
    </div>
  )
}
