'use client'

export default function EventFilters({ filters, setFilters }) {
  const handleTypeChange = (type) => {
    setFilters({ ...filters, type })
  }

  const handleDateChange = (date) => {
    setFilters({ ...filters, date })
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Type:</span>
        <div className="flex gap-2">
          {['all', 'seminaire', 'conference', 'atelier'].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Date:</span>
        <div className="flex gap-2">
          {['all', 'upcoming', 'past'].map((date) => (
            <button
              key={date}
              onClick={() => handleDateChange(date)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.date === date
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {date === 'all' ? 'Toutes' : date === 'upcoming' ? 'À venir' : 'Passées'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}