/**
 * Lightbox pour afficher les détails d'un événement - Image à gauche
 */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTimes, FaCalendar, FaMapMarker, FaClock, 
  FaEuroSign, FaUsers, FaTicketAlt
} from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function EventLightbox({ 
  isOpen, 
  onClose, 
  event 
}) {
  if (!isOpen || !event) return null

  const isPast = new Date(event.start_date) < new Date()
  const placesRestantes = (event.available_tickets || event.capacity) - (event.nb_inscrits || 0)
  const isFull = placesRestantes <= 0

  const formatDateSwagger = (date) => {
    if (!date) return 'Date non définie'
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Image - À gauche (40%) */}
          <div className="relative w-full md:w-[40%] h-64 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  const parent = e.target.parentElement
                  const fallback = document.createElement('div')
                  fallback.className = 'w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center'
                  fallback.innerHTML = '<span class="text-6xl">🎯</span>'
                  parent.appendChild(fallback)
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-dice-blue/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-6xl">🎯</span>
              </div>
            )}
            
            {/* Badges superposés sur l'image */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-dice-blue/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                {event.category || 'Événement'}
              </span>
              {isPast ? (
                <span className="px-3 py-1 bg-yellow-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Terminé
                </span>
              ) : isFull ? (
                <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Complet
                </span>
              ) : placesRestantes <= 3 ? (
                <span className="px-3 py-1 bg-orange-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Dernières places
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  Disponible
                </span>
              )}
            </div>
          </div>

          {/* Informations - À droite (60%) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Titre */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {event.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {event.description}
            </p>

            {/* Détails format Swagger - 2 colonnes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* ID */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm font-medium text-gray-800">#{event.id}</p>
              </div>

              {/* Catégorie */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Catégorie</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{event.category}</p>
              </div>

              {/* Date de début */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Date de début</p>
                <p className="text-sm font-medium text-gray-800">{formatDateSwagger(event.start_date)}</p>
              </div>

              {/* Date de fin */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Date de fin</p>
                <p className="text-sm font-medium text-gray-800">{formatDateSwagger(event.end_date)}</p>
              </div>

              {/* Lieu */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Lieu</p>
                <p className="text-sm font-medium text-gray-800 truncate">{event.location}</p>
              </div>

              {/* Prix */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Prix</p>
                <p className="text-sm font-medium text-dice-blue">
                  {event.price} {event.currency || 'FCFA'}
                </p>
              </div>

              {/* Capacité */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Capacité</p>
                <p className="text-sm font-medium text-gray-800">{event.capacity} personnes</p>
              </div>

              {/* Places disponibles */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Places disponibles</p>
                <p className="text-sm font-medium text-gray-800">
                  {placesRestantes > 0 ? placesRestantes : 0} / {event.capacity}
                </p>
              </div>

              {/* Statut */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Statut</p>
                <p className="text-sm font-medium capitalize">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' :
                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status || 'Brouillon'}
                  </span>
                </p>
              </div>

              {/* Devise */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Devise</p>
                <p className="text-sm font-medium text-gray-800">{event.currency || 'XAF'}</p>
              </div>
            </div>

            {/* Promotion (si présente) */}
            {event.promotion && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 mb-6">
                <h4 className="text-sm font-semibold text-yellow-700 mb-2">🎉 Promotion</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Pourcentage</p>
                    <p className="font-medium text-yellow-700">{event.promotion.pourcentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prix promo</p>
                    <p className="font-medium text-yellow-700">{event.promotion.prix_promo} {event.currency || 'FCFA'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Durée</p>
                    <p className="font-medium text-gray-700">{event.promotion.duree} jours</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sexe ciblé</p>
                    <p className="font-medium text-gray-700 capitalize">{event.promotion.sexe || 'Tous'}</p>
                  </div>
                </div>
                {event.promotion.description && (
                  <p className="text-xs text-gray-600 mt-2">{event.promotion.description}</p>
                )}
              </div>
            )}

            {/* Dates de création/mise à jour */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Créé le</p>
                <p className="text-xs text-gray-600">{formatDateSwagger(event.created_at)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Mis à jour le</p>
                <p className="text-xs text-gray-600">{formatDateSwagger(event.updated_at)}</p>
              </div>
            </div>

            {/* Note de fermeture */}
            <p className="text-xs text-center text-gray-400 mt-4">
              Cliquez en dehors pour fermer
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex-shrink-0 md:hidden">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Événement #{event.id}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-dice-blue rounded-full" />
                Diamond Centre
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}