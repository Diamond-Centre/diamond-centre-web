'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

/** Normalize backend event shape for French UI components */
export function normalizeEvent(event) {
  if (!event) return null

  const id = event.id ?? event._id
  const titre = event.titre || event.title || ''
  const date = event.date || event.starts_at || null
  const lieu = event.lieu || event.location || ''
  const prix = Number(event.prix ?? event.price ?? 0)
  const capacity = Number(event.nbPlaces ?? event.capacity ?? 0)
  const available = Number(
    event.available_tickets ?? event.nbPlacesRestantes ?? capacity
  )
  const nbInscrits = capacity > 0 ? Math.max(0, capacity - available) : 0

  return {
    ...event,
    id,
    _id: id,
    titre,
    title: titre,
    description: event.description || '',
    image: event.image || event.image_url || '/images/events/placeholder.jpg',
    image_url: event.image_url || event.image || '',
    prix,
    price: prix,
    prixPromotion: event.prixPromotion ?? null,
    date,
    time: event.time || '',
    lieu,
    location: lieu,
    category: event.category || event.type || '',
    type: event.type || event.category || 'formation',
    statut: event.statut || event.status || 'published',
    status: event.status || event.statut || 'published',
    nbPlaces: capacity,
    capacity,
    available_tickets: available,
    nbInscrits,
    formateur: event.formateur || { nom: event.instructor || 'Diamond Centre' },
    currency: event.currency || 'XAF',
  }
}

function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.events)) return data.events
  return []
}

function isValidDate(value) {
  if (!value) return false
  const d = new Date(value)
  return !Number.isNaN(d.getTime())
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/events')
      const list = unwrapList(response.data).map(normalizeEvent).filter(Boolean)
      setEvents(list)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getEventById = useCallback(async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return normalizeEvent(response.data?.data || response.data)
    } catch (err) {
      setError(err.message || "Erreur lors du chargement de l'événement")
      throw err
    }
  }, [])

  const createEvent = useCallback(async (data) => {
    try {
      const response = await api.post('/events', data)
      const created = normalizeEvent(response.data)
      setEvents((prev) => [...prev, created])
      return created
    } catch (err) {
      setError(err.message || 'Erreur lors de la création')
      throw err
    }
  }, [])

  const updateEvent = useCallback(async (id, data) => {
    try {
      const response = await api.put(`/events/${id}`, data)
      const updated = normalizeEvent(response.data)
      setEvents((prev) =>
        prev.map((e) => (String(e.id) === String(id) ? updated : e))
      )
      return updated
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour')
      throw err
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await api.delete(`/events/${id}`)
      setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)))
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    fetchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    isValidDate,
  }
}
