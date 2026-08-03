/**
 * Gestion de l'authentification
 */
export const auth = {
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      console.log('💾 Stockage du token:', token ? '✅' : '❌')
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      // localStorage d'abord
      const token = localStorage.getItem('token')
      if (token) return token
      
      // Cookies ensuite
      const cookies = document.cookie.split('; ')
      const cookie = cookies.find(row => row.startsWith('token='))
      if (cookie) {
        const value = cookie.split('=')[1]
        localStorage.setItem('token', value)
        return value
      }
      return null
    }
    return null
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      console.log('💾 Stockage de l\'utilisateur:', user ? '✅' : '❌')
      localStorage.setItem('user', JSON.stringify(user))
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      // localStorage d'abord
      const user = localStorage.getItem('user')
      if (user) {
        try {
          return JSON.parse(user)
        } catch {
          return null
        }
      }
      
      // Cookies ensuite
      const cookies = document.cookie.split('; ')
      const cookie = cookies.find(row => row.startsWith('user='))
      if (cookie) {
        try {
          const value = decodeURIComponent(cookie.split('=')[1])
          const userData = JSON.parse(value)
          localStorage.setItem('user', JSON.stringify(userData))
          return userData
        } catch {
          return null
        }
      }
      return null
    }
    return null
  },

  isAuthenticated: () => {
    const token = auth.getToken()
    const user = auth.getUser()
    const isAuth = !!(token && user)
    console.log('🔍 isAuthenticated:', isAuth)
    return isAuth
  },

  isAdmin: () => {
    const user = auth.getUser()
    return user && (user.role === 'admin' || user.role === 'super_admin')
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      console.log('🚪 Déconnexion')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; max-age=0'
      document.cookie = 'user=; path=/; max-age=0'
    }
  }
}