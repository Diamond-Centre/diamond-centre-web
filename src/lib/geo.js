/**
 * Shared map helpers — OpenStreetMap / Nominatim (no Google API key).
 */
export const DEFAULT_MAP_CENTER = { lat: 4.0511, lng: 9.7679 } // Douala

export function parseCoord(value) {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function geocodeAddress(query) {
  const q = String(query || '').trim()
  if (q.length < 3) return []

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('q', q)
  url.searchParams.set('limit', '5')
  url.searchParams.set('addressdetails', '1')

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'fr',
    },
  })
  if (!res.ok) throw new Error('Recherche de lieu indisponible')

  const data = await res.json()
  if (!Array.isArray(data)) return []

  return data.map((item) => ({
    label: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }))
}

export async function reverseGeocode(lat, lng) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'json')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('zoom', '16')
  url.searchParams.set('addressdetails', '1')

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'fr',
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.display_name || null
}
