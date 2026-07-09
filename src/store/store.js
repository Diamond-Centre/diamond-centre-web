import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Events Store
export const useEventStore = create((set) => ({
  events: [],
  loading: false,
  error: null,
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updated) => set((state) => ({
    events: state.events.map(e => (e._id === id || e.id === id) ? updated : e)
  })),
  removeEvent: (id) => set((state) => ({
    events: state.events.filter(e => e._id !== id && e.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))

// Tickets Store
export const useTicketStore = create((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
  updateTicket: (id, updated) => set((state) => ({
    tickets: state.tickets.map(t => (t._id === id || t.id === id) ? updated : t)
  })),
  removeTicket: (id) => set((state) => ({
    tickets: state.tickets.filter(t => t._id !== id && t.id !== id)
  })),
}))

// Notifications Store
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  }),
  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n =>
      n._id === id || n.id === id ? { ...n, read: true } : n
    )
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length
    }
  }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
}))