'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendar, FaClock, FaMapMarker, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEvents } from '@/hooks/useEvents'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import TicketReservation from '@/components/tickets/TicketReservation'
import Container from '@/components/ui/Container'
import EventLocationMap from '@/components/maps/EventLocationMap'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getEventById } = useEvents()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReservation, setShowReservation] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const data = await getEventById(params.id)
        if (!cancelled) {
          setEvent(data)
          setError(null)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Événement introuvable')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (params?.id) load()
    return () => {
      cancelled = true
    }
  }, [params?.id, getEventById])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Spinner />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-gray-600">{error || 'Événement introuvable'}</p>
        <Button variant="primary" onClick={() => router.push('/events')}>
          Retour aux événements
        </Button>
      </div>
    )
  }

  const parsedDate = event.date ? new Date(event.date) : null
  const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime())
  const placesRestantes = Math.max(
    0,
    Number(event.available_tickets ?? (event.nbPlaces - event.nbInscrits) ?? 0)
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <Container>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-dice-blue hover:underline mb-6"
        >
          <FaArrowLeft /> Retour
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="relative h-64 md:h-80 bg-gray-100">
            <Image
              src={event.image || '/images/events/placeholder.jpg'}
              alt={event.titre || 'Événement'}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{event.type || event.category || 'formation'}</Badge>
              <Badge variant="success">{event.statut || event.status}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {event.titre || event.title}
            </h1>

            <p className="text-gray-600 leading-relaxed">
              {event.description || 'Aucune description disponible.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-dice-blue" />
                <span>
                  {hasValidDate
                    ? format(parsedDate, 'dd MMMM yyyy', { locale: fr })
                    : event.date || 'Date à confirmer'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-dice-blue" />
                <span>{event.time || (hasValidDate ? format(parsedDate, 'HH:mm') : '--:--')}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FaMapMarker className="text-dice-blue" />
                <span>{event.lieu || event.location || 'Lieu à confirmer'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-dice-blue" />
                <span>{event.formateur?.nom || 'Diamond Centre'}</span>
              </div>
            </div>

            <EventLocationMap
              location={event.lieu || event.location}
              latitude={event.latitude}
              longitude={event.longitude}
              title="Localisation"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-3xl font-bold text-dice-blue">
                  {event.prix} {event.currency || '€'}
                </p>
                <p className="text-sm text-gray-500">
                  {placesRestantes} place{placesRestantes !== 1 ? 's' : ''} restante
                  {placesRestantes !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="primary"
                disabled={placesRestantes <= 0}
                onClick={() => setShowReservation(true)}
              >
                {placesRestantes <= 0 ? 'Complet' : 'Réserver'}
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>

      <TicketReservation
        event={event}
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
        onSuccess={(ticket: { quantity?: number }) => {
          const qty = Math.max(1, Number(ticket?.quantity ?? 1))
          setEvent((prev: any) => {
            if (!prev) return prev
            const currentAvailable = Number(
              prev.available_tickets ??
              (prev.nbPlaces != null && prev.nbInscrits != null
                ? prev.nbPlaces - prev.nbInscrits
                : 0)
            )
            const nextAvailable = Math.max(0, currentAvailable - qty)
            return {
              ...prev,
              available_tickets: nextAvailable,
              nbPlacesRestantes: nextAvailable,
              nbInscrits: Math.max(0, Number(prev.nbInscrits ?? 0) + qty),
            }
          })
          setShowReservation(false)
        }}
      />
    </div>
  )
}
