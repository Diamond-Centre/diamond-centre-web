'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
// @ts-ignore
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
import DiamondJourney from '@/components/home/DiamondJourney'
import IntroSection from '@/components/home/IntroSection'
import ReservationModal from '@/components/events/ReservationModal'
import toast from 'react-hot-toast'

export default function Home() {
  const { events, loading, fetchPublicEvents } = useEvents()
  const { isAuthenticated } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // -- Intro & Scroll logic from DICE Refonte --
  const [scrollY, setScrollY] = useState(0)
  const [introAnimComplete, setIntroAnimComplete] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    // Only access sessionStorage on the client
    setIntroAnimComplete(sessionStorage.getItem('dice-intro-complete') === '1')
  }, [])

  useEffect(() => {
    fetchPublicEvents?.()
  }, [fetchPublicEvents])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking.current = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!introAnimComplete) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [introAnimComplete])

  const introProgress = introAnimComplete ? 1 : 0
  const scrollComplete = introAnimComplete
  const heroScrollY = Math.max(0, scrollY)

  const handleAutoIntroComplete = useCallback(() => {
    sessionStorage.setItem('dice-intro-complete', '1')
    setIntroAnimComplete(true)
  }, [])

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
    <div style={{ background: '#030816', minHeight: '100vh', overflow: 'hidden' }} className="font-outfit">
      {!introAnimComplete && <IntroSection
        scrollProgress={introProgress}
        scrollComplete={scrollComplete}
        onAutoIntroComplete={handleAutoIntroComplete}
      />}

      <HeroSection introProgress={introProgress} heroScrollY={heroScrollY} />
      <DiamondJourney />
      <PanelsSection />
      <FormationsSection
        events={upcomingEvents}
        loading={loading}
        onReserve={openReservation}
      />
      <WhyDiceSection />
      <SpeakersSection />
      <CTASection />

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
