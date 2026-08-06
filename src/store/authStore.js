/**
 * Store d'authentification avec Zustand - Version sans persist
 */
import { create } from 'zustand'

export const authStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  setToken: (token) => {
    set({ token })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  clearUser: () => {
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    })
  },

  updateUser: (updates) => {
    const { user } = get()
    if (user) {
      set({ user: { ...user, ...updates } })
    }
  }
}))