'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useAuth } from './useAuth'
import { ticketStore } from '@/lib/ticketStore'
import { auth } from '@/lib/auth'

/**
 * Tickets API aligned with DICE backend:
 * POST /tickets/reserve
 * GET  /tickets/:id
 * "My tickets" = local ID index + GET by id (mobile pattern)
 */
export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const getTicketById = useCallback(async (id) => {
    try {
      setLoading(true)
      const token = auth.getToken()
      const ticket = await api.getTicketById(id, token)
      setError(null)
      return ticket
    } catch (err) {
      const message = err.message || 'Erreur lors du chargement du ticket'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyTickets = useCallback(async () => {
    try {
      setLoading(true)
      const token = auth.getToken()
      const list = await api.getMyBookings(token)
      setTickets(list)
      setError(null)
      return list
    } catch (err) {
      const message = err.message || 'Erreur lors du chargement des tickets'
      setError(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const createTicket = useCallback(
    async (data) => {
      try {
        setLoading(true)
        const token = auth.getToken()
        const payload = {
          eventId: Number(data.event_id ?? data.eventId),
          quantity: Number(data.quantity ?? 1),
          customerName: String(
            data.customer_name ||
              data.customerName ||
              [user?.prenom, user?.nom].filter(Boolean).join(' ') ||
              user?.name ||
              user?.email ||
              'Client DiCe'
          ).trim(),
          customerEmail: String(
            data.customer_email || data.customerEmail || user?.email || ''
          ).trim(),
          customerPhone: String(
            data.customer_phone ||
              data.customerPhone ||
              user?.telephone ||
              user?.phone ||
              '+237000000000'
          ).trim() || '+237000000000',
          event_date: data.event_date || data.date,
          location: data.location || data.lieu,
          time: data.time,
        }

        if (!payload.eventId || Number.isNaN(payload.eventId)) {
          throw new Error('Événement invalide')
        }
        if (!payload.quantity || payload.quantity < 1) {
          throw new Error('Quantité invalide')
        }
        if (!payload.customerName) {
          throw new Error('Nom client manquant')
        }
        if (!payload.customerEmail) {
          throw new Error('Email client manquant')
        }

        const ticket = await api.reserveTickets(payload, token)
        setTickets((prev) => [ticket, ...prev])
        setError(null)
        return ticket
      } catch (err) {
        const message = err.message || 'Erreur lors de la création du ticket'
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
    fetchMyTickets,
    ticketStore,
  }
}
