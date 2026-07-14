'use client'

import { motion } from 'framer-motion'
import EventCard from './EventCard'

export default function EventList({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune formation disponible</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  )
}