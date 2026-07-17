'use client'

import { useState, useCallback } from 'react'
import api from '@/lib/api'
import { useAuth } from './useAuth'

/**
 * Tickets API aligned with DICE backend:
 * POST /tickets/reserve
 * GET  /tickets/:id
 */
export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const getTicketById = useCallback(async (id) => {
    try {
      setLoading(true)
      const response = await api.get(`/tickets/${id}`)
      const ticket = response.data
      setError(null)
      return ticket
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erreur lors du chargement du ticket'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTicket = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const payload = {
          event_id: Number(data.event_id ?? data.eventId),
          quantity: Number(data.quantity ?? 1),
          customer_name:
            data.customer_name ||
            [user?.prenom, user?.nom].filter(Boolean).join(' ') ||
            user?.name ||
            data.customerName,
          customer_email: data.customer_email || user?.email || data.customerEmail,
          customer_phone:
            data.customer_phone ||
            user?.telephone ||
            data.customerPhone ||
            '0000000000',
        }

        if (
          !payload.event_id ||
          !payload.quantity ||
          !payload.customer_name ||
          !payload.customer_email ||
          !payload.customer_phone
        ) {
          throw new Error('Informations de réservation incomplètes')
        }

        const response = await api.post('/tickets/reserve', payload)
        const ticket = response.data
        setTickets((prev) => [...prev, ticket])
        setError(null)
        return ticket
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Erreur lors de la création du ticket'
        setError(message)
        throw new Error(message)
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  return {
    tickets,
    loading,
    error,
    createTicket,
    getTicketById,
  }
}
