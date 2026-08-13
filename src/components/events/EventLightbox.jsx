'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes, FaCalendar, FaMapMarker, FaClock,
  FaEuroSign, FaUsers, FaTicketAlt, FaTag, FaLayerGroup, FaCoins, FaInfoCircle
} from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function EventLightbox({
  isOpen,
  onClose,
  event
}) {
  if (!isOpen || !event) return null

  const endKey = String(event.end_date || event.start_date || '').slice(0, 10)
  const today = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })()
  const isPast = Boolean(endKey && endKey < today)
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

  // Construction de l'URL Google Maps Embed
  // Si latitude/longitude sont disponibles, on les utilise en priorité (plus précis)
  // Sinon on utilise le texte du lieu (location) comme requête de recherche
  const getMapEmbedUrl = () => {
    if (event.latitude && event.longitude) {
      return `https://www.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`
    }
    if (event.location) {
      return `https://www.google.com/maps?q=${encodeURIComponent(event.location)}&z=15&output=embed`
    }
    return null
  }

  const mapEmbedUrl = getMapEmbedUrl()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Overlay en flou de verre sombre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Conteneur Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row ring-1 ring-black/5 z-10"
        >
          {/* Bouton Fermer flottant moderne */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white rounded-full transition-all duration-200 active:scale-95 group shadow-lg"
            title="Fermer"
          >
            <FaTimes className="text-base group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Section Image - À gauche (42% en MD) */}
          <div className="relative w-full md:w-[42%] h-64 md:h-auto flex-shrink-0 overflow-hidden bg-slate-900">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none'
                  const parent = e.target.parentElement
                  const fallback = document.createElement('div')
                  fallback.className = 'w-full h-full bg-gradient-to-br from-slate-900 via-dice-blue/40 to-slate-800 flex items-center justify-center'
                  fallback.innerHTML = '<span class="text-7xl animate-pulse"></span>'
                  parent.appendChild(fallback)
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-dice-blue/30 to-slate-800 flex items-center justify-center">
                <span className="text-7xl animate-pulse">🎯</span>
              </div>
            )}

            {/* Voile sombre en bas pour booster la lisibilité des badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

            {/* Badges sur l'image */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 z-10">
              <span className="px-3 py-1 bg-dice-blue/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                {event.category || 'Événement'}
              </span>
              {isPast ? (
                <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                  Terminé
                </span>
              ) : isFull ? (
                <span className="px-3 py-1 bg-rose-500/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                  Complet
                </span>
              ) : placesRestantes <= 3 ? (
                <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                  Dernières places
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                  Disponible
                </span>
              )}
            </div>
          </div>

          {/* Section Contenu - À droite (58% en MD) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-mono">
                  #{event.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md capitalize ${event.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                    event.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {event.status || 'Brouillon'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Description */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Cartes de données clés - Grille réorganisée */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Catégorie</p>
                <p className="text-sm font-bold text-slate-800 capitalize truncate">{event.category}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Prix</p>
                <p className="text-sm font-bold text-dice-blue truncate">
                  {event.price} {event.currency || 'FCFA'}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Devise</p>
                <p className="text-sm font-bold text-slate-800 truncate">{event.currency || 'XAF'}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Date Début</p>
                <p className="text-sm font-bold text-slate-800 truncate">{formatDateSwagger(event.start_date)}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Date Fin</p>
                <p className="text-sm font-bold text-slate-800 truncate">{formatDateSwagger(event.end_date)}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Capacité</p>
                <p className="text-sm font-bold text-slate-800 truncate">{event.capacity} pers.</p>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Places libres</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {placesRestantes > 0 ? placesRestantes : 0} / {event.capacity}
                </p>
              </div>

              <div className="col-span-2 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-dice-blue/30 transition-colors">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Lieu</p>
                <p className="text-sm font-bold text-slate-800 truncate">{event.location}</p>
              </div>
            </div>

            {/* Carte de Géolocalisation - Google Maps intégrée directement */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
              {mapEmbedUrl ? (
                <iframe
                  key={mapEmbedUrl}
                  title={`Carte - ${event.location || event.title}`}
                  src={mapEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[260px]"
                />
              ) : (
                <div className="w-full h-[260px] bg-slate-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <FaMapMarker className="text-2xl" />
                  <p className="text-xs font-medium">Localisation non disponible</p>
                </div>
              )}
            </div>

            {/* Promotion (si présente) */}
            {event.promotion && (
              <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-100/30 rounded-2xl p-5 border border-amber-200/80 shadow-sm relative overflow-hidden space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500 text-white rounded-lg text-xs">
                    <FaTag />
                  </span>
                  <h4 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider">
                    Offre Promotionnelle
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <p className="text-[10px] font-bold uppercase text-amber-700/80">Réduction</p>
                    <p className="font-extrabold text-amber-900">{event.promotion.pourcentage}%</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <p className="text-[10px] font-bold uppercase text-amber-700/80">Prix Promo</p>
                    <p className="font-extrabold text-amber-900">{event.promotion.prix_promo} {event.currency || 'FCFA'}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <p className="text-[10px] font-bold uppercase text-amber-700/80">Durée</p>
                    <p className="font-bold text-slate-800">{event.promotion.duree} jours</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/50">
                    <p className="text-[10px] font-bold uppercase text-amber-700/80">Cible</p>
                    <p className="font-bold text-slate-800 capitalize">{event.promotion.sexe || 'Tous'}</p>
                  </div>
                </div>

                {event.promotion.description && (
                  <p className="text-xs text-amber-900/80 font-medium italic pt-1 border-t border-amber-200/50">
                    {event.promotion.description}
                  </p>
                )}
              </div>
            )}

            {/* Horodatages de suivi */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Créé le</p>
                <p className="text-xs font-semibold text-gray-600">{formatDateSwagger(event.created_at)}</p>
              </div>
              <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mis à jour le</p>
                <p className="text-xs font-semibold text-gray-600">{formatDateSwagger(event.updated_at)}</p>
              </div>
            </div>

            {/* Note d'aide */}
            <p className="text-xs text-center text-gray-400 pt-2 font-medium">
              Cliquez à l'extérieur de la fenêtre pour la fermer
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}