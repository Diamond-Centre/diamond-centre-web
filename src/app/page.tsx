'use client'

import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { isEventEnded } from '@/lib/eventTiming'
import HeroSection from '@/components/layout/HeroSection'
import PanelsSection from '@/components/home/PanelsSection'
import FormationsSection from '@/components/layout/FormationsSection'
import WhyDiceSection from '@/components/layout/WhyDiceSection'
import SpeakersSection from '@/components/home/SpeakersSection'
import CTASection from '@/components/layout/CTASection'
import FloatingDiamond from '@/components/home/FloatingDiamond'
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

  // Recalcule les positions ScrollTrigger une fois polices / images chargées
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const fonts = (document as any).fonts
    if (fonts?.ready) fonts.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const upcomingEvents = (events || [])
    .filter((e: any) => {
      if (e.status && e.status !== 'published') return false
      return !isEventEnded(e)
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.start_date || 0).getTime() -
        new Date(b.start_date || 0).getTime()
    )
    .slice(0, 3)

  const openReservation = (event: any) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#020817] font-outfit">
      <HeroSection />
      <PanelsSection />
      <FormationsSection
        events={upcomingEvents}
        loading={loading}
        onReserve={openReservation}
      />
      <WhyDiceSection />
      <SpeakersSection />
      <CTASection />

      <FloatingDiamond />

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
          fetchPublicEvents?.()
        }}
      />
    </div>
  )
}
