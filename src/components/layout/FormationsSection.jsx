/**
 * Événements à venir — grille EventCard branchée API
 */
'use client'

import Link from 'next/link'
import { FaArrowRight, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import EventCard from '@/components/events/EventCard'

export default function FormationsSection({
  events = [],
  loading = false,
  onReserve,
}) {
  const list = Array.isArray(events) ? events.slice(0, 3) : []

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A89F2]">
              Programme
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1220] sm:text-4xl">
              Événements à venir
            </h2>
            <p className="mt-2 max-w-lg text-[#667085]">
              Réservez votre place aux prochaines conférences, formations et
              ateliers DiCe.
            </p>
          </motion.div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#E8EEF5] bg-[#F4F7FB] px-4 py-2.5 text-sm font-semibold text-[#0B1220] transition hover:border-[#0A89F2]/35 hover:text-[#0A89F2] sm:self-auto"
          >
            Tout voir
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center text-[#667085]">
            <FaSpinner className="mr-2 animate-spin text-[#0A89F2]" />
            Chargement des événements…
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#E8EEF5] bg-[#F4F7FB] px-6 py-14 text-center">
            <p className="font-semibold text-[#0B1220]">
              Aucun événement publié pour le moment
            </p>
            <p className="mt-2 text-sm text-[#667085]">
              Revenez bientôt — le prochain programme arrive.
            </p>
            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A89F2]"
            >
              Explorer la page événements
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onReserve={onReserve}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
