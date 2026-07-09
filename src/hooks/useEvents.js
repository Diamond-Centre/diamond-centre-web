'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/events')
      setEvents(response.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements')
    } finally {
      setLoading(false)
    }
  }, [])

  const getEventById = useCallback(async (id) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de l\'événement')
      throw err
    }
  }, [])

  const createEvent = useCallback(async (data) => {
    try {
      const response = await api.post('/events', data)
      setEvents(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors de la création')
      throw err
    }
  }, [])

  const updateEvent = useCallback(async (id, data) => {
    try {
      const response = await api.put(`/events/${id}`, data)
      setEvents(prev => prev.map(e => e._id === id ? response.data : e))
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour')
      throw err
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await api.delete(`/events/${id}`)
      setEvents(prev => prev.filter(e => e._id !== id))
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
    deleteEvent
  }
}