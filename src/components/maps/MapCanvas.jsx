'use client'

import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DEFAULT_MAP_CENTER } from '@/lib/geo'

// Fix default marker icons broken by Next/webpack asset hashing
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapClickHandler({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (!enabled || !onPick) return
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function Recenter({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat == null || lng == null) return
    map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true })
  }, [lat, lng, map])
  return null
}

export default function MapCanvas({
  latitude,
  longitude,
  height = 280,
  interactive = false,
  onPick,
  className = '',
}) {
  const hasPin = latitude != null && longitude != null
  const center = useMemo(() => {
    if (hasPin) return [latitude, longitude]
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]
  }, [hasPin, latitude, longitude])

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#E8EEF5] ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={hasPin ? 15 : 12}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <MapClickHandler enabled onPick={onPick} />}
        {hasPin && (
          <>
            <Marker position={[latitude, longitude]} icon={markerIcon} />
            <Recenter lat={latitude} lng={longitude} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
