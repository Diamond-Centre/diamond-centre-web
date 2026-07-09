/**
 * Carte d'événement avec réservation
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FaCalendar, 
  FaMapMarker, 
  FaUser, 
  FaEuroSign, 
  FaClock,
  FaArrowRight
} from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import TicketReservation from '@/components/tickets/TicketReservation'

export default function EventCard({ 
  event, 
  variant = 'default',
  className,
  onVideoClick 
}) {
  const { 
    id, 
    titre, 
    description, 
    image, 
    prix, 
    prixPromotion, 
    date, 
    lieu, 
    formateur, 
    type, 
    statut,
    nbPlaces,
    nbInscrits
  } = event

  const [isHovered, setIsHovered] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const isFull = nbInscrits >= nbPlaces
  const isPast = new Date(date) < new Date()
  const placesRestantes = nbPlaces - nbInscrits

  const getStatusBadge = () => {
    if (isPast) return { label: 'Terminé', variant: 'gray' }
    if (isFull) return { label: 'Complet', variant: 'danger' }
    if (placesRestantes <= 3) return { label: 'Dernières places', variant: 'warning' }
    return { label: 'Disponible', variant: 'success' }
  }

  const status = getStatusBadge()

  const handleReserve = () => {
    if (!isPast && !isFull) {
      setShowReservation(true)
    }
  }

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          'group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300',
          'border border-gray-100',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <Image
            src={image || '/images/events/placeholder.jpg'}
            alt={titre}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
          />
          
          {/* Badge de statut */}
          <div className="absolute top-4 left-4">
            <Badge variant={status.variant}>
              {status.label}
            </Badge>
          </div>

          {/* Badge de type */}
          <div className="absolute top-4 right-4">
            <Badge variant="default">
              {type}
            </Badge>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {titre}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Détails */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-dice-blue text-xs" />
              <span>
                {format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-dice-blue text-xs" />
              <span>
                {format(new Date(date), 'HH:mm')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarker className="text-dice-blue text-xs" />
              <span className="truncate">{lieu}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-dice-blue text-xs" />
              <span className="truncate">{formateur?.nom || 'Formateur'}</span>
            </div>
          </div>

          {/* Prix et places */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-dice-blue">
                  {prixPromotion ? (
                    <>
                      <span className="text-sm text-gray-400 line-through mr-2">
                        {prix}€
                      </span>
                      {prixPromotion}€
                    </>
                  ) : (
                    `${prix}€`
                  )}
                </span>
                {prixPromotion && (
                  <Badge variant="success" className="ml-2 text-xs">
                    -{Math.round((1 - prixPromotion/prix) * 100)}%
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}
              </div>
            </div>

            {/* Bouton de réservation */}
            <Button 
              variant="primary" 
              fullWidth 
              className="mt-4 group"
              disabled={isPast || isFull}
              onClick={handleReserve}
            >
              {isPast ? 'Terminé' : isFull ? 'Complet' : 'Réserver'}
              {!isPast && !isFull && (
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modal de réservation */}
      <TicketReservation
        event={event}
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
        onSuccess={() => {
          setShowReservation(false)
          // Rafraîchir les données
        }}
      />
    </>
  )
}