'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  FaCrosshairs,
  FaMapMarkerAlt,
  FaSearch,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa'
import {
  geocodeAddress,
  parseCoord,
  reverseGeocode,
} from '@/lib/geo'

const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm text-[#98A2B3]">
      <FaSpinner className="mr-2 animate-spin text-[#0A89F2]" />
      Chargement de la carte…
    </div>
  ),
})

/**
 * Admin location field: text address + map pin (search or click).
 */
export default function LocationPicker({
  location = '',
  latitude = null,
  longitude = null,
  onChange,
  required = false,
  inputClassName = '',
}) {
  const [query, setQuery] = useState(location || '')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  const lat = parseCoord(latitude)
  const lng = parseCoord(longitude)

  useEffect(() => {
    setQuery(location || '')
  }, [location])

  const emit = useCallback(
    (next) => {
      onChange?.({
        location: next.location ?? query,
        latitude: next.latitude ?? lat,
        longitude: next.longitude ?? lng,
      })
    },
    [onChange, query, lat, lng]
  )

  useEffect(() => {
    const term = query.trim()
    if (term.length < 3) {
      setSuggestions([])
      return undefined
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      setError(null)
      try {
        const results = await geocodeAddress(term)
        setSuggestions(results)
      } catch (err) {
        setSuggestions([])
        setError(err.message || 'Recherche indisponible')
      } finally {
        setSearching(false)
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [query])

  const applySuggestion = (item) => {
    setQuery(item.label)
    setSuggestions([])
    emit({
      location: item.label,
      latitude: item.lat,
      longitude: item.lng,
    })
  }

  const handleMapPick = async ({ lat: nextLat, lng: nextLng }) => {
    setLocating(true)
    setError(null)
    try {
      const label = await reverseGeocode(nextLat, nextLng)
      const nextLocation = label || query || `${nextLat.toFixed(5)}, ${nextLng.toFixed(5)}`
      setQuery(nextLocation)
      setSuggestions([])
      emit({
        location: nextLocation,
        latitude: nextLat,
        longitude: nextLng,
      })
    } catch {
      emit({
        location: query || `${nextLat.toFixed(5)}, ${nextLng.toFixed(5)}`,
        latitude: nextLat,
        longitude: nextLng,
      })
    } finally {
      setLocating(false)
    }
  }

  const clearPin = () => {
    emit({
      location: query,
      latitude: null,
      longitude: null,
    })
  }

  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n’est pas supportée sur cet appareil')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await handleMapPick({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      () => {
        setLocating(false)
        setError('Impossible d’obtenir votre position')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-[#0A89F2]" />
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value
            setQuery(value)
            emit({
              location: value,
              latitude: lat,
              longitude: lng,
            })
          }}
          placeholder="Adresse ou lieu — ex. Douala, Silicon Mountain"
          className={inputClassName || 'w-full rounded-xl border border-[#E8EEF5] py-3 pl-10 pr-10 text-sm outline-none focus:border-[#0A89F2]'}
          required={required}
          autoComplete="off"
        />
        {searching ? (
          <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#0A89F2]" />
        ) : (
          <FaSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
        )}

        {suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-[#E8EEF5] bg-white py-1 shadow-lg">
            {suggestions.map((item) => (
              <li key={`${item.lat}-${item.lng}-${item.label}`}>
                <button
                  type="button"
                  onClick={() => applySuggestion(item)}
                  className="w-full px-3 py-2 text-left text-sm text-[#344054] hover:bg-[#F0F7FF]"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={useDeviceLocation}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF5] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] hover:border-[#0A89F2] hover:text-[#0A89F2] disabled:opacity-60"
        >
          {locating ? (
            <FaSpinner className="animate-spin text-[#0A89F2]" />
          ) : (
            <FaCrosshairs className="text-[#0A89F2]" />
          )}
          Ma position
        </button>
        {(lat != null || lng != null) && (
          <button
            type="button"
            onClick={clearPin}
            className="inline-flex items-center gap-2 rounded-full border border-[#FEE4E2] bg-[#FEF3F2] px-3 py-1.5 text-xs font-semibold text-[#B42318] hover:bg-[#FEE4E2]"
          >
            <FaTimes />
            Retirer le pin
          </button>
        )}
        <p className="text-xs text-[#98A2B3]">
          Tapez une adresse, choisissez une suggestion, ou cliquez sur la carte.
        </p>
      </div>

      {error && (
        <p className="text-xs font-medium text-[#B42318]">{error}</p>
      )}

      <MapCanvas
        latitude={lat}
        longitude={lng}
        interactive
        onPick={handleMapPick}
        height={280}
      />

      {lat != null && lng != null && (
        <p className="font-mono text-[11px] text-[#667085]">
          Coordonnées : {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  )
}
