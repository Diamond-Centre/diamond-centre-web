/**
 * Filtres simplifiés pour les événements - Version toujours visible
 */
'use client'

import { FaFilter } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function EventFilters({ 
  filters, 
  setFilters, 
  types,
  className 
}) {
  const handleFilterChange = (value) => {
    setFilters(prev => ({ ...prev, type: value }))
  }

  const hasActiveFilters = filters.type !== 'all'

  // Formater les types pour l'affichage
  const formatType = (type) => {
    if (type === 'all') return 'Tous les événements'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className={cn('bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4', className)}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <FaFilter className="text-sm" />
          <span className="text-sm font-medium">Filtrer :</span>
        </div>
        
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue/30 focus:border-dice-blue outline-none transition-all text-gray-700 font-medium"
        >
          <option value="all">Tous les événements</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {formatType(type)}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => handleFilterChange('all')}
            className="text-sm text-dice-blue hover:text-dice-blue-dark font-medium transition-colors whitespace-nowrap"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}