/**
 * Hook d'authentification - Version avec redirection forcée
 */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (token && storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await api.login(email, password)
      
      // Stocker les données
      auth.setToken(response.access_token)
      auth.setUser(response.user)
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Connexion réussie !')
      
      // 🔥 REDIRECTION FORCÉE - Utiliser window.location.replace
      if (response.user.role === 'admin' || response.user.role === 'super_admin') {
        // replace() évite que l'utilisateur puisse revenir en arrière
        window.location.replace('/admin')
        return response.user
      } else {
        window.location.replace('/dashboard')
        return response.user
      }
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const response = await api.register(userData)
      toast.success('Inscription réussie ! Connectez-vous pour continuer.')
      router.push('/auth/login')
      return response
    } catch (error) {
      toast.error(error.message || 'Erreur d\'inscription')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    auth.logout()
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
    window.location.replace('/')
  }

  const checkAuth = async () => {
    const token = auth.getToken()
    if (token) {
      const isValid = await api.verifyToken(token)
      if (!isValid) {
        auth.logout()
        setUser(null)
        setIsAuthenticated(false)
        router.push('/auth/login')
        return false
      }
    }
    return !!token
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    isAdmin: () => user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: () => user?.role === 'super_admin'
  }
}