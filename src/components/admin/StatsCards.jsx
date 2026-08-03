/**
 * Cartes de statistiques
 */
'use client'

import { motion } from 'framer-motion'

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Événements',
      value: stats?.totalEvents || 0,
      icon: '📅',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Tickets Vendus',
      value: stats?.totalTickets || 0,
      icon: '🎫',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Revenus Totaux',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} FCFA`,
      icon: '💰',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}