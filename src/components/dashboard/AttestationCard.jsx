/**
 * Carte d'attestation
 */
'use client'

import { motion } from 'framer-motion'
import { FaAward, FaCalendar, FaDownload, FaEye } from 'react-icons/fa'

// Données mockées
const mockAttestations = [
  {
    id: '1',
    titre: 'Attestation de formation React',
    formation: 'Développement Web avec React',
    date: '2026-07-15',
    code: 'ATT-2026-001',
    duree: '40 heures'
  },
  {
    id: '2',
    titre: 'Attestation de formation Microservices',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-08-01',
    code: 'ATT-2026-002',
    duree: '32 heures'
  }
]

export default function AttestationCard({ attestations = mockAttestations }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {attestations.map((att, index) => (
        <motion.div
          key={att.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 hover:bg-white/40 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FaAward className="text-white text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{att.titre}</h4>
              <p className="text-sm text-gray-500">{att.formation}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaCalendar className="text-dice-blue text-xs" />
              {new Date(att.date).toLocaleDateString('fr-FR')}
            </span>
            <span className="text-xs">Code: {att.code}</span>
            <span className="text-xs col-span-2">Durée: {att.duree}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/50 flex gap-2">
            <button className="flex-1 px-4 py-2 bg-dice-blue text-white rounded-xl text-sm font-medium hover:bg-dice-blue-dark transition-colors flex items-center justify-center gap-2">
              <FaDownload className="text-xs" /> Télécharger
            </button>
            <button className="px-4 py-2 bg-dice-blue/10 text-dice-blue rounded-xl text-sm font-medium hover:bg-dice-blue/20 transition-colors flex items-center justify-center gap-2">
              <FaEye className="text-xs" />
            </button>
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