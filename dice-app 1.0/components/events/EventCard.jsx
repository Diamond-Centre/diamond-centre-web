'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCalendar, FaMapMarker, FaUser, FaEuroSign, FaStar } from 'react-icons/fa'
import { formatDate } from '@/lib/validators'

export default function EventCard({ event }) {
  const { id, title, description, image, price, date, location, instructor, type, rating = 4.5 } = event

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || '/images/events/placeholder.jpg'}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Badge type */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
          {type}
        </div>

        {/* Badge rating */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
          <FaStar className="text-yellow-400 text-xs" />
          {rating}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendar className="text-blue-600 flex-shrink-0" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarker className="text-blue-600 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaUser className="text-blue-600 flex-shrink-0" />
            <span className="truncate">{instructor}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">{price} €</span>
          </div>
          <Link href={`/events/${id}`}>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Réserver
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}