/**
 * Carte d'événement réutilisable
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaCalendar, FaMapMarker, FaClock, FaTicketAlt, FaArrowRight } from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function EventCard({ 
  event, 
  variant = 'default',
  className,
  onReserve,
  showReserveButton = true
}) {
  const { user, isAuthenticated } = useAuth()
  const [isReserving, setIsReserving] = useState(false)
  
  const { 
    id, 
    title, 
    description, 
    image_url, 
    price, 
    currency = 'FCFA',
    start_date, 
    location, 
    category, 
    capacity,
    available_tickets,
    status
  } = event

  const isPast = new Date(start_date) < new Date()
  const placesRestantes = (available_tickets || capacity) - (event.nb_inscrits || 0)
  const isFull = placesRestantes <= 0
  const isPublished = status === 'published'

  const handleReserve = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver')
      return
    }
    
    setIsReserving(true)
    try {
      if (onReserve) {
        await onReserve(event.id)
      } else {
        // Redirection vers la page de réservation
        window.location.href = `/events/${id}/reserve`
      }
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setIsReserving(false)
    }
  }

  if (!isPublished) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        'bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-5xl">🎯</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
            {category || 'Événement'}
          </Badge>
        </div>
        {isPast && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning" className="bg-yellow-500/90 backdrop-blur-sm text-white">
              Terminé
            </Badge>
          </div>
        )}
        {isFull && !isPast && (
          <div className="absolute top-4 right-4">
            <Badge variant="danger" className="bg-red-500/90 backdrop-blur-sm text-white">
              Complet
            </Badge>
          </div>
        )}
        {!isPast && !isFull && placesRestantes <= 3 && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning" className="bg-orange-500/90 backdrop-blur-sm text-white">
              Dernières places
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-dice-blue transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-dice-blue text-xs flex-shrink-0" />
            <span>
              {format(new Date(start_date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-dice-blue text-xs flex-shrink-0" />
            <span>
              {format(new Date(start_date), 'HH:mm')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarker className="text-dice-blue text-xs flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-dice-blue">
                {price} {currency}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                / personne
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {placesRestantes > 0 ? `${placesRestantes} places` : 'Complet'}
            </div>
          </div>

          {showReserveButton ? (
            <Button 
              variant="primary" 
              fullWidth 
              className="mt-2"
              onClick={handleReserve}
              loading={isReserving}
              disabled={isPast || isFull || isReserving}
            >
              {isPast ? 'Terminé' : isFull ? 'Complet' : 'Réserver'}
              {!isPast && !isFull && (
                <FaTicketAlt className="ml-2" />
              )}
            </Button>
          ) : (
            <Link href={`/events/${id}`}>
              <Button variant="outline" fullWidth className="mt-2">
                Voir détails
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}