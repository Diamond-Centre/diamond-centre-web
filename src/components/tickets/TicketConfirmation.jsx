/**
 * Confirmation de réservation
 */
'use client'

import { motion } from 'framer-motion'
import { FaCheckCircle, FaTicketAlt, FaCalendar, FaMapMarker, FaUser, FaEuroSign } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function TicketConfirmation({ 
  ticket, 
  event, 
  onClose, 
  onViewTicket 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Icône de succès */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <FaCheckCircle className="text-4xl text-green-500" />
      </motion.div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800">Réservation confirmée !</h3>
        <p className="text-gray-500">
          Votre place est réservée pour l'événement
        </p>
      </div>

      {/* Détails du ticket */}
      <div className="bg-gradient-to-br from-dice-blue/5 to-purple-500/5 rounded-xl p-6 border border-dice-blue/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaTicketAlt className="text-dice-blue" />
            <span className="font-medium">Ticket #{ticket?.code || 'N/A'}</span>
          </div>
          <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Confirmé
          </span>
        </div>

        <div className="text-left space-y-2 text-sm">
          <p className="font-semibold">{event?.titre}</p>
          <div className="grid grid-cols-2 gap-2 text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-dice-blue" />
              <span>{format(new Date(event?.date), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarker className="text-dice-blue" />
              <span>{event?.lieu}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-dice-blue" />
              <span>{event?.formateur?.nom}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEuroSign className="text-dice-blue" />
              <span>{ticket?.prixPaye} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} fullWidth>
          Fermer
        </Button>
        <Button variant="primary" onClick={onViewTicket} fullWidth>
          Voir mon ticket
        </Button>
      </div>
    </motion.div>
  )
}