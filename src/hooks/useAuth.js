/**
 * Hook d'authentification - Version corrigée
 */
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    console.log('🔍 useAuth init:', { token: !!token, user: !!storedUser })
    
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
      
      auth.setToken(response.access_token)
      auth.setUser(response.user)
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Connexion réussie !')
      
      if (response.user.role === 'admin' || response.user.role === 'super_admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
      
      return response.user
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
      window.location.href = '/auth/login'
      return response
    } catch (error) {
      toast.error(error.message || 'Erreur d\'inscription')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    auth.logout()
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
    window.location.href = '/'
  }

  // Fonction pour forcer la vérification de l'authentification
  const checkAuth = () => {
    const token = auth.getToken()
    const userData = auth.getUser()
    const isAuth = !!(token && userData)
    
    if (isAuth && !isAuthenticated) {
      setUser(userData)
      setIsAuthenticated(true)
    } else if (!isAuth && isAuthenticated) {
      setUser(null)
      setIsAuthenticated(false)
    }
    
    return isAuth
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
}