/**
 * Carte d'événement réutilisable - Avec toutes les dates et heures
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FaCalendar, FaMapMarker, FaClock, FaTicketAlt, 
  FaArrowRight, FaTag, FaUser, FaVenusMars,
  FaCalendarCheck, FaCalendarAlt
} from 'react-icons/fa'
import { format, differenceInDays, differenceInHours } from 'date-fns'
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
    end_date,
    location, 
    category, 
    capacity,
    available_tickets,
    status,
    promotion,
    formateur
  } = event

  const isPast = new Date(start_date) < new Date()
  const placesRestantes = (available_tickets || capacity) - (event.nb_inscrits || 0)
  const isFull = placesRestantes <= 0
  const isPublished = status === 'published'
  
  // Vérifier si une promotion est active
  const hasPromotion = promotion && promotion.pourcentage && Number(promotion.pourcentage) > 0

  // Obtenir le label du sexe ciblé
  const getSexeLabel = (sexe) => {
    if (!sexe) return 'Tous'
    const sexeMap = {
      'tous': 'Tous',
      'homme': 'Hommes',
      'femme': 'Femmes'
    }
    return sexeMap[sexe] || sexe
  }

  // Calcul du prix avec promotion
  const getPriceWithPromotion = () => {
    if (hasPromotion) {
      const discount = (price * promotion.pourcentage) / 100
      return Math.round(price - discount)
    }
    return price
  }

  const promoPrice = getPriceWithPromotion()
  const sexeLabel = getSexeLabel(promotion?.sexe)

  // Calcul de la durée
  const getDuration = (startDate, endDate) => {
    if (!endDate) return '1 jour'
    const days = differenceInDays(new Date(endDate), new Date(startDate))
    if (days === 0) {
      const hours = differenceInHours(new Date(endDate), new Date(startDate))
      return hours > 0 ? `${hours} heures` : 'Moins d\'une heure'
    }
    return `${days + 1} jours`
  }

  // Formater l'heure
  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm')
  }

  // Formater la date
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr })
  }

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
        window.location.href = `/events/${id}/reserve`
      }
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setIsReserving(false)
    }
  }

  if (!isPublished) return null

  const startDateFormatted = formatDate(start_date)
  const endDateFormatted = end_date ? formatDate(end_date) : startDateFormatted
  const startTime = formatTime(start_date)
  const endTime = end_date ? formatTime(end_date) : startTime
  const duration = getDuration(start_date, end_date || start_date)

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
        
        {/* Badge Promotion */}
        {hasPromotion && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg">
              <FaTag className="text-xs" />
              <span className="text-xs font-bold">-{promotion.pourcentage}%</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
            {category || 'Événement'}
          </Badge>
        </div>
        
        {isPast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge variant="warning" className="bg-yellow-500/90 backdrop-blur-sm text-white">
              Terminé
            </Badge>
          </div>
        )}
        
        {isFull && !isPast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge variant="danger" className="bg-red-500/90 backdrop-blur-sm text-white">
              Complet
            </Badge>
          </div>
        )}
        
        {!isPast && !isFull && placesRestantes <= 3 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
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

        {/* Dates et heures complètes */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendarCheck className="text-dice-blue text-xs flex-shrink-0" />
            <span>
              Du {startDateFormatted} au {endDateFormatted}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-dice-blue text-xs flex-shrink-0" />
            <span>
              {startTime} - {endTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-dice-blue text-xs flex-shrink-0" />
            <span>Durée: {duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarker className="text-dice-blue text-xs flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Promotion avec cible */}
        {hasPromotion && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700">
              <FaTag className="inline mr-1 text-green-500" />
              {promotion.description || 'Offre promotionnelle'}
            </p>
            
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-green-600">
              <span className="flex items-center gap-1">
                <FaVenusMars className="text-green-500" />
                Ciblé: {sexeLabel}
              </span>
              {promotion.duree && (
                <span className="flex items-center gap-1">
                  <FaClock className="text-green-500" />
                  {promotion.duree} jours
                </span>
              )}
              {promotion.nombre && (
                <span className="flex items-center gap-1">
                  <FaTicketAlt className="text-green-500" />
                  {promotion.nombre} places
                </span>
              )}
            </div>
          </div>
        )}

        {/* Formateur */}
        {formateur && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <FaUser className="inline mr-1 text-blue-500" />
              Formateur: {formateur.nom || formateur.name || 'À confirmer'}
            </p>
            {formateur.specialite && (
              <p className="text-xs text-blue-600 mt-1">
                <FaInfoCircle className="inline mr-1 text-blue-500" />
                Spécialité: {formateur.specialite}
              </p>
            )}
          </div>
        )}

        {/* Prix et bouton */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              {hasPromotion ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-bold text-dice-blue">
                    {promoPrice} {currency}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {price} {currency}
                  </span>
                  <Badge variant="success" className="text-xs bg-green-500 text-white">
                    -{promotion.pourcentage}%
                  </Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold text-dice-blue">
                  {price} {currency}
                </span>
              )}
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