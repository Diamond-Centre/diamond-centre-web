/**
 * Gestion de l'authentification
 */
import { clearNotificationCache } from '@/lib/notificationInbox'

export const auth = {
  setToken: (token) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('token', token)
    } catch (error) {
      console.error('AUTH : Impossible de stocker le token.', error)
    }

    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`
  },

  getToken: () => {
    if (typeof window === 'undefined') return null

    try {
      const token = localStorage.getItem('token')
      if (token) return token
    } catch (error) {
      console.error('AUTH : Impossible de lire le token.', error)
    }

    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))

    if (!cookie) return null

    const token = decodeURIComponent(cookie.split('=')[1])

    try {
      localStorage.setItem('token', token)
    } catch { }

    return token
  },

  setUser: (user) => {
    if (typeof window === 'undefined') return

    const serialized = JSON.stringify(user)

    try {
      localStorage.setItem('user', serialized)
    } catch (error) {
      // Data-URL photos can exceed quota — keep the rest of the session.
      try {
        const { picture: _picture, ...rest } = user || {}
        localStorage.setItem('user', JSON.stringify(rest))
      } catch (inner) {
        console.error('[AUTH] Impossible de stocker l’utilisateur.', inner || error)
      }
    }

    // Cookies are ~4KB — never put the photo (often a data URL) in them.
    try {
      const { picture: _picture, ...safe } = user || {}
      document.cookie = `user=${encodeURIComponent(JSON.stringify(safe))}; path=/; max-age=86400; SameSite=Lax`
    } catch {
      // Ignore cookie failures; localStorage is the source of truth.
    }
  },

  getUser: () => {
    if (typeof window === 'undefined') return null

    try {
      const cached = localStorage.getItem('user')

      if (cached) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.error('[AUTH] Données utilisateur invalides.', error)
      localStorage.removeItem('user')
    }

    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))

    if (!cookie) return null

    try {
      const user = JSON.parse(
        decodeURIComponent(cookie.split('=')[1])
      )

      localStorage.setItem('user', JSON.stringify(user))

      return user
    } catch (error) {
      console.error('AUTH : Cookie utilisateur invalide.', error)
      return null
    }
  },

  isAuthenticated: () => {
    return Boolean(auth.getToken() && auth.getUser())
  },

  isAdmin: () => {
    const user = auth.getUser()

    return ['admin', 'super_admin'].includes(user?.role)
  },

  logout: () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch (error) {
      console.error('[AUTH] Erreur lors de la suppression des données.', error)
    }

    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax'
    document.cookie = 'user=; path=/; max-age=0; SameSite=Lax'
    clearNotificationCache()
  },
}