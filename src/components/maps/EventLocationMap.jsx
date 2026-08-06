'use client'

import dynamic from 'next/dynamic'
import { FaExternalLinkAlt, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'
import { parseCoord } from '@/lib/geo'

const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] text-sm text-[#98A2B3]">
      <FaSpinner className="mr-2 animate-spin text-[#0A89F2]" />
      Chargement de la carte…
    </div>
  ),
})

/**
 * Read-only event location map for public / client pages.
 */
export default function EventLocationMap({
  location,
  latitude,
  longitude,
  title = 'Lieu',
  className = '',
}) {
  const lat = parseCoord(latitude)
  const lng = parseCoord(longitude)
  const hasPin = lat != null && lng != null
  const label = location || 'Lieu à confirmer'

  const mapsUrl = hasPin
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#E8EEF5] bg-white ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#F0F2F5] px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
            {title}
          </p>
          <p className="mt-1 flex items-start gap-2 text-sm font-medium text-[#0B1220]">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#0A89F2]" />
            <span className="leading-snug">{label}</span>
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F0F7FF] px-3 py-1.5 text-xs font-semibold text-[#0A89F2] hover:bg-[#E0EFFF]"
        >
          Ouvrir
          <FaExternalLinkAlt className="text-[9px]" />
        </a>
      </div>

      {hasPin ? (
        <MapCanvas
          latitude={lat}
          longitude={lng}
          interactive={false}
          height={260}
          className="rounded-none border-0"
        />
      ) : (
        <div className="flex h-[180px] flex-col items-center justify-center gap-2 bg-[#F8FAFC] px-6 text-center text-sm text-[#667085]">
          <FaMapMarkerAlt className="text-2xl text-[#98A2B3]" />
          <p>Position carte non définie pour cet événement.</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0A89F2] hover:underline"
          >
            Chercher « {label} » sur Google Maps
          </a>
        </div>
      )}
    </section>
  )
}
