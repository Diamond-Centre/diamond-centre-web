/**
 * Hook de gestion des événements - Avec rafraîchissement
 */
import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'

export function useEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer les événements publics
  const fetchPublicEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getPublicEvents()

      setEvents(Array.isArray(data) ? data : [])

      return data
    } catch (error) {
      console.error("EVENTS : Impossible de charger les événements", error)

      setEvents([])

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger les événements."
      )

      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Récupérer tous les événements (avec token)
  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = auth.getToken()

      const data = await api.getEvents(token)

      setEvents(Array.isArray(data) ? data : [])

      return data
    } catch (error) {
      console.error("[EVENTS] Impossible de charger les événements.", error)

      setEvents([])

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger les événements."
      )

      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getEvent = useCallback(async (id: any) => {
    setLoading(true)
    setError(null)
    try {
      const token = auth.getToken()
      const data = await api.getEventById(id, token)
      return data
    } catch (error) {
      console.error("EVENTS : Impossible de charger l'événement.", error)

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger l'événement."
      )

      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const token = auth.getToken()
      const result = await api.createEvent(data, token)
      // Recharger après création
      await fetchEvents()
      return result
    } catch (error) {
      console.error("EVENTS : Création impossible.", error)

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer l'événement."
      )

      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchEvents])

  const updateEvent = useCallback(async (id: any, data: any) => {
    setLoading(true)
    setError(null)
    try {
      const token = auth.getToken()
      const result = await api.updateEvent(id, data, token)
      // Recharger après mise à jour
      await fetchEvents()
      return result
    } catch (error) {
      console.error("EVENTS : Création impossible.", error)

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer l'événement."
      )

      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchEvents])

  const deleteEvent = useCallback(async (id: any) => {
    setLoading(true)
    setError(null)
    try {
      const token = auth.getToken()
      await api.deleteEvent(id, token)
      // Recharger après suppression
      await fetchEvents()
      return true
    } catch (error) {
      console.error("EVENTS : Création impossible.", error)

      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer l'événement."
      )

      throw error
    } finally {
      setLoading(false)
    }
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    fetchPublicEvents,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
  }
}