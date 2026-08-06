/**
 * Liste des tickets de l'utilisateur
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTicketAlt, FaCalendar, FaMapMarker, FaUser, FaEuroSign, FaDownload, FaQrcode } from 'react-icons/fa'

// Données mockées
const mockTickets = [
  {
    id: '1',
    code: 'TCK-2026-001',
    formation: 'Développement Web avec React',
    date: '2026-08-15',
    lieu: 'Abidjan, Plateau',
    formateur: 'André Marie',
    prix: 150,
    statut: 'payé',
    qrCode: '/images/qr-code-1.png'
  },
  {
    id: '2',
    code: 'TCK-2026-002',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-09-01',
    lieu: 'Lyon, France',
    formateur: 'Brandon',
    prix: 200,
    statut: 'en_attente',
    qrCode: '/images/qr-code-2.png'
  },
  {
    id: '3',
    code: 'TCK-2026-003',
    formation: 'UI/UX Design - Créer des interfaces innovantes',
    date: '2026-08-20',
    lieu: 'Bordeaux, France',
    formateur: 'Stéphane',
    prix: 100,
    statut: 'payé',
    qrCode: '/images/qr-code-3.png'
  }
]

const statusColors = {
  payé: 'bg-green-100 text-green-700 border-green-200',
  en_attente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  annulé: 'bg-red-100 text-red-700 border-red-200',
  validé: 'bg-blue-100 text-blue-700 border-blue-200'
}

export default function TicketList({ tickets = mockTickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null)

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 hover:bg-white/40 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Info ticket */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaTicketAlt className="text-white text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-semibold text-gray-800">{ticket.formation}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[ticket.statut] || statusColors.en_attente}`}>
                    {ticket.statut}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Code: {ticket.code}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-dice-blue text-xs" />
                    {new Date(ticket.date).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarker className="text-dice-blue text-xs" />
                    {ticket.lieu}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser className="text-dice-blue text-xs" />
                    {ticket.formateur}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-dice-blue">
                    <FaEuroSign className="text-xs" />
                    {ticket.prix}€
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedTicket(ticket.id)}
                className="p-2 rounded-xl bg-dice-blue/10 text-dice-blue hover:bg-dice-blue/20 transition-colors"
              >
                <FaQrcode className="text-sm" />
              </button>
              <button className="p-2 rounded-xl bg-dice-blue/10 text-dice-blue hover:bg-dice-blue/20 transition-colors">
                <FaDownload className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <style jsx>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
        .glass-card-dice:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
}