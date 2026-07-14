'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { useAuth } from './useAuth'

export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchTickets = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await api.get('/tickets')
      setTickets(response.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tickets')
    } finally {
      setLoading(false)
    }
  }, [user])

  const createTicket = useCallback(async (data) => {
    try {
      const response = await api.post('/tickets', data)
      setTickets(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du ticket')
      throw err
    }
  }, [])

  const validateTicket = useCallback(async (id) => {
    try {
      const response = await api.put(`/tickets/${id}/validate`)
      setTickets(prev => prev.map(t => t._id === id ? response.data : t))
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation du ticket')
      throw err
    }
  }, [])

  const cancelTicket = useCallback(async (id) => {
    try {
      const response = await api.put(`/tickets/${id}/cancel`)
      setTickets(prev => prev.map(t => t._id === id ? response.data : t))
      return response.data
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'annulation du ticket')
      throw err
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user, fetchTickets])

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    validateTicket,
    cancelTicket
  }
}