/**
 * Activités récentes
 */
'use client'

import { motion } from 'framer-motion'
import { FaTicketAlt, FaCertificate, FaAward, FaCalendarCheck } from 'react-icons/fa'

const activities = [
  {
    id: '1',
    type: 'ticket',
    message: 'Réservation confirmée pour "Développement Web avec React"',
    date: 'Il y a 2 heures',
    icon: FaTicketAlt,
    color: 'text-blue-500'
  },
  {
    id: '2',
    type: 'certification',
    message: 'Certification "Développeur Full Stack React" obtenue',
    date: 'Il y a 1 jour',
    icon: FaCertificate,
    color: 'text-green-500'
  },
  {
    id: '3',
    type: 'attestation',
    message: 'Attestation "Formation React" disponible au téléchargement',
    date: 'Il y a 3 jours',
    icon: FaAward,
    color: 'text-purple-500'
  },
  {
    id: '4',
    type: 'agenda',
    message: 'Séminaire "Architecture Microservices" programmé le 01/09',
    date: 'Il y a 5 jours',
    icon: FaCalendarCheck,
    color: 'text-orange-500'
  }
]

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          <div className={`mt-1 ${activity.color}`}>
            <activity.icon className="text-lg" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">{activity.message}</p>
            <span className="text-xs text-gray-400">{activity.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}