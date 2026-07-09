/**
 * Statistiques des événements
 */
'use client'

import { motion } from 'framer-motion'
import { FaCalendar, FaUsers, FaClock, FaMapMarker } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function EventStats({ 
  totalEvents, 
  upcomingEvents, 
  participants,
  className 
}) {
  const stats = [
    { icon: FaCalendar, label: 'Total', value: totalEvents },
    { icon: FaClock, label: 'À venir', value: upcomingEvents },
    { icon: FaUsers, label: 'Participants', value: participants },
  ]

  return (
    <div className={cn('flex flex-wrap gap-6', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <stat.icon className="text-dice-blue text-sm" />
          <div>
            <div className="font-semibold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}