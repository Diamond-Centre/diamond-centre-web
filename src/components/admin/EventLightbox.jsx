'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTimes, 
  FaCalendar, 
  FaClock, 
  FaMapMarker, 
  FaUser, 
  FaTag, 
  FaUsers,
  FaEuroSign,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function EventLightbox({ event, isOpen, onClose, onEdit }) {
  const lightboxRef = useRef(null)

  // Fermer avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Empêcher le scroll du body quand le lightbox est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fermer en cliquant sur le fond
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen || !event) return null

  const formatDate = (date) => {
    if (!date) return 'Non définie'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price, currency) => {
    if (!price) return 'Gratuit'
    return `${price.toLocaleString()} ${currency || 'XAF'}`
  }

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return { label: 'Publié', variant: 'success' }
    }
    return { label: 'Brouillon', variant: 'warning' }
  }

  const statusBadge = getStatusBadge(event.status)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <FaTimes className="text-xl text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Image - 40% sur desktop */}
              <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-dice-blue/10 to-purple-500/10 flex-shrink-0">
                {event.image_url && event.image_url !== '/images/events/placeholder.jpg' ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <GiDiamondRing className="text-6xl text-dice-blue/20 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Aucune image</p>
                    </div>
                  </div>
                )}
                
                {/* Badge de statut sur l'image */}
                <div className="absolute top-4 left-4">
                  <Badge variant={statusBadge.variant}>
                    {statusBadge.label}
                  </Badge>
                </div>

                {/* Badge de catégorie */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="default">
                    {event.category || 'Non catégorisé'}
                  </Badge>
                </div>
              </div>

              {/* Contenu - 60% sur desktop */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* Titre */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 pr-8">
                  {event.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                  {event.description || 'Aucune description disponible'}
                </p>

                {/* Détails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaCalendar className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-700">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Heure</p>
                      <p className="text-sm font-medium text-gray-700">{event.time || 'Non définie'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarker className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lieu</p>
                      <p className="text-sm font-medium text-gray-700">{event.location || 'Non défini'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUsers className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Capacité</p>
                      <p className="text-sm font-medium text-gray-700">
                        {event.capacity || 0} places
                        {event.available_tickets !== undefined && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({event.available_tickets} disponibles)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaEuroSign className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Prix</p>
                      <p className="text-sm font-bold text-dice-blue">
                        {formatPrice(event.price, event.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaTag className="text-dice-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Catégorie</p>
                      <p className="text-sm font-medium text-gray-700">
                        {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Non catégorisé'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 mb-4">
                  <p>Créé le: {new Date(event.created_at).toLocaleString('fr-FR')}</p>
                  {event.updated_at && (
                    <p>Modifié le: {new Date(event.updated_at).toLocaleString('fr-FR')}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      onClose()
                      if (onEdit) onEdit()
                    }}
                    className="flex-1 min-w-[120px]"
                  >
                    ✏️ Modifier
                  </Button>
                  <Link href={`/events/${event.id}`} target="_blank" className="flex-1 min-w-[120px]">
                    <Button variant="outline" size="medium" fullWidth>
                      <FaExternalLinkAlt className="mr-2 text-sm" />
                      Voir sur le site
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}