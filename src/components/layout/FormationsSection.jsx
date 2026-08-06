/**
 * Événements à venir — Refonte dynamique GSAP ScrollTrigger & Micro-interactions
 */
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { FaArrowRight, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EventCard from '@/components/events/EventCard'

gsap.registerPlugin(ScrollTrigger)

export default function FormationsSection({
  events = [],
  loading = false,
  onReserve,
}) {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  const list = Array.isArray(events) ? events.slice(0, 3) : []

  useEffect(() => {
    if (loading || list.length === 0) return

    const ctx = gsap.context(() => {

      gsap.fromTo(
        headerRef.current ? headerRef.current.children : [],
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.18,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading, list.length])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 md:py-32">

      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#0A89F2]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">

        <div ref={headerRef} className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#0B1220] sm:text-4xl md:text-5xl">
              Événements à venir
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#667085]">
              Réservez votre place aux prochaines conférences, formations et ateliers DiCe.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-[#F4F7FB] px-6 py-3 text-sm font-semibold text-[#0B1220] transition-all duration-300 hover:border-[#0A89F2]/40 hover:bg-[#0A89F2] hover:text-white"
            >
              <span>Tout voir</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-[#E8EEF5] bg-[#F4F7FB]/50 text-[#667085]">
            <FaSpinner className="mb-3 animate-spin text-2xl text-[#0A89F2]" />
            <span className="text-sm font-medium">Chargement des événements…</span>
          </div>
        ) : list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-[#E8EEF5] bg-[#F4F7FB] px-6 py-16 text-center"
          >
            <p className="text-lg font-bold text-[#0B1220]">
              Aucun événement publié pour le moment
            </p>
            <p className="mt-2 text-sm text-[#667085]">
              Revenez bientôt — le prochain programme arrive.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0A89F2] hover:underline"
            >
              <span>Explorer la page événements</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </motion.div>
        ) : (
          <div ref={gridRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((event, index) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                <EventCard
                  event={event}
                  index={index}
                  onReserve={onReserve}
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}