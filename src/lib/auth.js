/**
 * Gestion de l'authentification
 */
export const auth = {
  // Stocker le token
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      // Stocker aussi dans un cookie pour le middleware
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
    }
  },

  // Récupérer le token
  getToken: () => {
    if (typeof window !== 'undefined') {
      // D'abord essayer localStorage
      const token = localStorage.getItem('token')
      if (token) return token
      
      // Sinon essayer les cookies
      const cookies = document.cookie.split('; ')
      const cookie = cookies.find(row => row.startsWith('token='))
      return cookie ? cookie.split('=')[1] : null
    }
    return null
  },

  // Stocker l'utilisateur
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`
    }
  },

  // Récupérer l'utilisateur
  getUser: () => {
    if (typeof window !== 'undefined') {
      // D'abord essayer localStorage
      const user = localStorage.getItem('user')
      if (user) {
        try {
          return JSON.parse(user)
        } catch {
          return null
        }
      }
      
      // Sinon essayer les cookies
      const cookies = document.cookie.split('; ')
      const cookie = cookies.find(row => row.startsWith('user='))
      if (cookie) {
        try {
          return JSON.parse(decodeURIComponent(cookie.split('=')[1]))
        } catch {
          return null
        }
      }
      return null
    }
    return null
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return !!auth.getToken()
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    const user = auth.getUser()
    return user && (user.role === 'admin' || user.role === 'super_admin')
  },

  // Déconnexion
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; max-age=0'
      document.cookie = 'user=; path=/; max-age=0'
    }
  }
}