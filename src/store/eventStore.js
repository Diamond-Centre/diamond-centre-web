/**
 * Store pour la gestion des événements avec Zustand
 */
import { create } from 'zustand'

export const eventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  filters: {
    type: 'all',
    service: 'all',
    search: ''
  },

  // Actions
  setEvents: (events) => {
    set({ events })
  },

  addEvent: (event) => {
    const { events } = get()
    set({ events: [...events, event] })
  },

  updateEvent: (id, updates) => {
    const { events } = get()
    set({
      events: events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    })
  },

  removeEvent: (id) => {
    const { events } = get()
    set({
      events: events.filter(event => event.id !== id)
    })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  setError: (error) => {
    set({ error })
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
  },

  resetFilters: () => {
    set({
      filters: {
        type: 'all',
        service: 'all',
        search: ''
      }
    })
  },

  // Récupérer un événement par ID
  getEventById: (id) => {
    const { events } = get()
    return events.find(event => event.id === id)
  },

  // Récupérer les événements par type
  getEventsByType: (type) => {
    const { events } = get()
    return events.filter(event => event.type === type)
  },

  // Récupérer les événements par service
  getEventsByService: (service) => {
    const { events } = get()
    return events.filter(event => event.service === service)
  },

  // Récupérer les événements à venir
  getUpcomingEvents: () => {
    const { events } = get()
    const now = new Date()
    return events
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }
}))