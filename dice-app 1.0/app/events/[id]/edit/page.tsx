'use client'

import { useState, useEffect } from 'react'
import EventList from '@/components/events/EventList'
import EventFilters from '@/components/events/EventFilters'
import { useEvents } from '@/hooks/useEvents'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const { events, loading, fetchEvents } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all'
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filters.type === 'all' || event.type === filters.type
    return matchSearch && matchType
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800 mb-4"
        >
          🎯 Dice
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8">
          Formations, Séminaires, Conférences & Ateliers
        </p>
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            className="w-full px-6 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Filters */}
      <EventFilters filters={filters} setFilters={setFilters} />

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <EventList events={filteredEvents} />
      )}
    </div>
  )
}