/**
 * Page des tickets
 */
'use client'

import { useState } from 'react'
import { FaTicketAlt, FaSearch, FaFilter } from 'react-icons/fa'
import TicketList from '@/components/dashboard/TicketList'
import Button from '@/components/ui/Button'

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
  },
  {
    id: '4',
    code: 'TCK-2026-004',
    formation: 'Développement Mobile avec Flutter',
    date: '2026-07-10',
    lieu: 'Marseille, France',
    formateur: 'Stéphane',
    prix: 180,
    statut: 'validé',
    qrCode: '/images/qr-code-4.png'
  }
]

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTickets = mockTickets.filter(ticket => {
    const matchSearch = ticket.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || ticket.statut === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes tickets</h1>
        <p className="text-gray-500">Gérez vos tickets de réservation</p>
      </div>

      {/* Filtres */}
      <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-dice-blue text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatus('payé')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'payé'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              Payés
            </button>
            <button
              onClick={() => setFilterStatus('en_attente')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'en_attente'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilterStatus('validé')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'validé'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              Validés
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      {filteredTickets.length > 0 ? (
        <TicketList tickets={filteredTickets} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun ticket trouvé</h3>
          <p className="text-gray-500">Vous n'avez pas encore de tickets correspondant à ces critères.</p>
        </div>
      )}

      <style jsx>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
      `}</style>
    </div>
  )
}