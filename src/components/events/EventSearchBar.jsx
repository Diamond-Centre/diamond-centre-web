/**
 * Barre de recherche pour les événements
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function EventSearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher un événement...',
  className 
}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className={cn(
        'relative flex items-center transition-all duration-300',
        'bg-white rounded-full shadow-md hover:shadow-lg',
        isFocused && 'shadow-lg ring-2 ring-dice-blue/30'
      )}>
        {/* Icône de recherche */}
        <div className="absolute left-4 text-gray-400">
          <FaSearch className="text-sm" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 pl-11 pr-12 bg-transparent rounded-full outline-none text-gray-700 placeholder-gray-400"
        />

        {/* Bouton effacer */}
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-sm" />
          </motion.button>
        )}
      </div>
    </div>
  )
}