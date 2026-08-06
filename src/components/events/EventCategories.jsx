/**
 * Catégories d'événements avec compteurs
 */
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function EventCategories({ 
  categories, 
  selectedCategory, 
  onSelect,
  className 
}) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            selectedCategory === category.id
              ? 'bg-dice-blue text-white shadow-lg shadow-dice-blue/25'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {category.label}
          <span className="ml-2 text-xs opacity-70">
            ({category.count})
          </span>
        </motion.button>
      ))}
    </div>
  )
}