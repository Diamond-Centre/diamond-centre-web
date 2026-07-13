/**
 * Page des certifications
 */
'use client'

import { useState } from 'react'
import { FaCertificate, FaSearch } from 'react-icons/fa'
import CertificationCard from '@/components/dashboard/CertificationCard'

// Données mockées
const mockCertifications = [
  {
    id: '1',
    titre: 'Développeur Full Stack React',
    formation: 'Développement Web avec React',
    date: '2026-07-15',
    code: 'CERT-2026-001'
  },
  {
    id: '2',
    titre: 'Architecte Microservices',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-08-01',
    code: 'CERT-2026-002'
  },
  {
    id: '3',
    titre: 'Expert UI/UX Design',
    formation: 'UI/UX Design - Créer des interfaces innovantes',
    date: '2026-06-20',
    code: 'CERT-2026-003'
  },
  {
    id: '4',
    titre: 'Développeur Mobile Flutter',
    formation: 'Développement Mobile avec Flutter',
    date: '2026-05-10',
    code: 'CERT-2026-004'
  }
]

export default function CertificationsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCertifications = mockCertifications.filter(cert =>
    cert.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.formation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes certifications</h1>
        <p className="text-gray-500">Toutes vos certifications obtenues</p>
      </div>

      {/* Barre de recherche */}
      <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une certification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-dice rounded-2xl p-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 text-center">
          <p className="text-2xl font-bold text-dice-blue">{mockCertifications.length}</p>
          <p className="text-sm text-gray-500">Total certifications</p>
        </div>
        <div className="glass-card-dice rounded-2xl p-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 text-center">
          <p className="text-2xl font-bold text-green-500">4</p>
          <p className="text-sm text-gray-500">Obtenues</p>
        </div>
        <div className="glass-card-dice rounded-2xl p-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 text-center">
          <p className="text-2xl font-bold text-yellow-500">2</p>
          <p className="text-sm text-gray-500">En cours</p>
        </div>
        <div className="glass-card-dice rounded-2xl p-4 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 text-center">
          <p className="text-2xl font-bold text-purple-500">3</p>
          <p className="text-sm text-gray-500">À venir</p>
        </div>
      </div>

      {/* Liste des certifications */}
      {filteredCertifications.length > 0 ? (
        <CertificationCard certifications={filteredCertifications} />
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune certification trouvée</h3>
          <p className="text-gray-500">Vous n'avez pas encore de certifications correspondant à ces critères.</p>
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