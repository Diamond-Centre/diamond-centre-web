// Ajouter la gestion des réservations
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaCalendar, FaMapMarker, FaUser, FaEuroSign, FaClock } from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function EventCard({ event, className }) {
  const { user, isAuthenticated } = useAuth()
  const [reserving, setReserving] = useState(false)
  
  const { 
    id, 
    title, 
    description, 
    image_url, 
    price, 
    currency = 'XAF',
    start_date, 
    location, 
    category, 
    capacity,
    available_tickets,
    status
  } = event

  const isPast = new Date(start_date) < new Date()
  const isFull = available_tickets <= 0
  const isPublished = status === 'published'

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    
    setReserving(true)
    try {
      // Rediriger vers la page de réservation
      window.location.href = `/events/${id}/reserve`
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setReserving(false)
    }
  }

  if (!isPublished) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100', className)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="default">{category}</Badge>
        </div>
        {isFull && (
          <div className="absolute top-4 right-4">
            <Badge variant="danger">Complet</Badge>
          </div>
        )}
        {isPast && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning">Terminé</Badge>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-dice-blue text-xs" />
            <span>
              {format(new Date(start_date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-dice-blue text-xs" />
            <span>
              {format(new Date(start_date), 'HH:mm')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarker className="text-dice-blue text-xs" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-dice-blue">
                {price} {currency}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                / personne
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {available_tickets || 0} places disponibles
            </div>
          </div>

          <Link href={`/events/${id}`}>
            <Button variant="primary" fullWidth className="mt-3">
              Voir détails
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}