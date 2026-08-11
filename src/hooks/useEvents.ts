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
      console.log('📤 Chargement des événements publics...')
      const data = await api.getPublicEvents()
      console.log('📥 Événements reçus:', data?.length || 0)
      setEvents(data || [])
      return data
    } catch (err: any) {
      console.error('❌ Erreur fetchPublicEvents:', err)
      setError(err.message)
      setEvents([])
      throw err
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
      console.log('📤 Chargement des événements avec token...')
      const data = await api.getEvents(token)
      console.log('📥 Événements reçus:', data?.length || 0)
      setEvents(data || [])
      return data
    } catch (err: any) {
      console.error('❌ Erreur fetchEvents:', err)
      setError(err.message)
      setEvents([])
      throw err
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
    } catch (err: any) {
      setError(err.message)
      throw err
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
    } catch (err: any) {
      setError(err.message)
      throw err
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
    } catch (err: any) {
      setError(err.message)
      throw err
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
    } catch (err: any) {
      setError(err.message)
      throw err
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