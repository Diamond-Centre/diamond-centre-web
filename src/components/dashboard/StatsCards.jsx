/**
 * Cartes de statistiques du dashboard
 */
'use client'

import { motion } from 'framer-motion'
import { FaTicketAlt, FaCertificate, FaAward, FaCalendarCheck } from 'react-icons/fa'

const stats = [
  { 
    label: 'Tickets', 
    value: '12', 
    icon: FaTicketAlt, 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  { 
    label: 'Certifications', 
    value: '3', 
    icon: FaCertificate, 
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  { 
    label: 'Attestations', 
    value: '5', 
    icon: FaAward, 
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  { 
    label: 'Réservations', 
    value: '8', 
    icon: FaCalendarCheck, 
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  }
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 hover:bg-white/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="text-white text-lg" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xs text-green-600">+12% ce mois</span>
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