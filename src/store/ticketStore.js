/**
 * Store pour la gestion des tickets avec Zustand
 */
import { create } from 'zustand'

export const ticketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  // Actions
  setTickets: (tickets) => {
    set({ tickets })
  },

  addTicket: (ticket) => {
    const { tickets } = get()
    set({ tickets: [...tickets, ticket] })
  },

  updateTicket: (id, updates) => {
    const { tickets } = get()
    set({
      tickets: tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ...updates } : ticket
      )
    })
  },

  removeTicket: (id) => {
    const { tickets } = get()
    set({
      tickets: tickets.filter(ticket => ticket.id !== id)
    })
  },

  clearTickets: () => {
    set({ tickets: [] })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setError: (error) => {
    set({ error })
  },

  // Récupérer un ticket par ID
  getTicketById: (id) => {
    const { tickets } = get()
    return tickets.find(ticket => ticket.id === id)
  },

  // Récupérer les tickets d'un utilisateur
  getTicketsByUser: (userId) => {
    const { tickets } = get()
    return tickets.filter(ticket => ticket.userId === userId)
  },

  // Récupérer les tickets par statut
  getTicketsByStatus: (status) => {
    const { tickets } = get()
    return tickets.filter(ticket => ticket.statut === status)
  },

  // Récupérer les tickets d'un événement
  getTicketsByEvent: (eventId) => {
    const { tickets } = get()
    return tickets.filter(ticket => ticket.eventId === eventId)
  }
}))