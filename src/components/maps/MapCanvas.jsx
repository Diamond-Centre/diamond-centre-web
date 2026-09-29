'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DEFAULT_MAP_CENTER } from '@/lib/geo'

// Correction des icônes par défaut de Leaflet
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

export default function MapCanvas({
  latitude,
  longitude,
  height = 280,
  interactive = false,
  onPick,
  className = '',
}) {
  const [mounted, setMounted] = useState(false)
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  // S'assure que le rendu s'effectue uniquement côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  const hasPin = latitude != null && longitude != null
  const center = useMemo(() => {
    if (hasPin) return [latitude, longitude]
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]
  }, [hasPin, latitude, longitude])

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return

    // 1. Initialisation de la carte si elle n'existe pas encore
    if (!mapInstanceRef.current) {
      // Sécurité : supprime tout ID résiduel sur le conteneur DOM
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id
      }

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: hasPin ? 15 : 12,
        scrollWheelZoom: interactive,
        dragging: interactive,
        doubleClickZoom: interactive,
        zoomControl: interactive,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      if (hasPin) {
        markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map)
      }

      if (interactive && onPick) {
        map.on('click', (e) => {
          onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
        })
      }

      mapInstanceRef.current = map
    } else {
      // 2. Mise à jour de la vue et du marqueur en cas de changement de coordonnées
      const map = mapInstanceRef.current
      map.setView(center, hasPin ? 15 : map.getZoom(), { animate: true })

      if (hasPin) {
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude])
        } else {
          markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map)
        }
      } else {
        if (markerRef.current) {
          markerRef.current.remove()
          markerRef.current = null
        }
      }
    }

    // 3. Nettoyage impératif au démontage du composant (supprime l'instance et libère le DOM)
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [mounted, center, latitude, longitude, hasPin, interactive, onPick])

  if (!mounted) {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-[#E8EEF5] bg-[#F8FAFC] ${className}`}
        style={{ height }}
      />
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className={`overflow-hidden rounded-2xl border border-[#E8EEF5] ${className}`}
      style={{ height, width: '100%' }}
    />
  )
}