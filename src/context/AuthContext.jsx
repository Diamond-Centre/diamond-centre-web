'use client'

import { createContext, useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      setIsAuthenticated(true)
      toast.success('Connexion réussie !')
      
      router.push('/')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur de connexion')
      return { success: false, error: error.response?.data?.error }
    }
  }, [router])

  const register = useCallback(async (data) => {
    try {
      const response = await api.post('/auth/register', data)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      setIsAuthenticated(true)
      toast.success('Inscription réussie !')
      
      router.push('/')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur d\'inscription')
      return { success: false, error: error.response?.data?.error }
    }
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
    router.push('/')
  }, [router])

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}