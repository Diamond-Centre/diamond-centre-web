'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/validators'
import { FaCalendar, FaMapMarker, FaUser, FaEuroSign, FaClock } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function EventDetails() {
  const { id } = useParams()
  const { getEventById } = useEvents()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getEventById(id)
        setEvent(data)
      } catch (error) {
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [id])

  const handleReserve = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    
    setReserving(true)
    try {
      // Logique de réservation
      toast.success('Réservation effectuée avec succès !')
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setReserving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  if (!event) return <div className="text-center py-12"><h2 className="text-2xl">Formation non trouvée</h2></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={event.image || '/images/events/placeholder.jpg'}
            alt={event.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full">
            {event.type}
          </span>
        </div>
        
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{event.price} €</div>
              {event.promotion && (
                <div className="text-sm text-gray-400 line-through">{event.originalPrice} €</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-blue-600" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-600" />
                <span>{event.duration} heures</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarker className="text-blue-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-600" />
                <span>Formateur: {event.instructor}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Places disponibles: {event.availableSeats} / {event.totalSeats}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${((event.totalSeats - event.availableSeats) / event.totalSeats) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              size="large"
              onClick={handleReserve}
              loading={reserving}
            >
              Réserver maintenant
            </Button>
            <Link href="/events">
              <Button variant="outline" size="large">
                Voir toutes les formations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}