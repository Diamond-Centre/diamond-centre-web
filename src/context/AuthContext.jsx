'use client'

import { createContext, useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext()

function mapBackendUser(user) {
  if (!user) return null
  const nameParts = String(user.name || '').trim().split(/\s+/)
  const prenom = nameParts[0] || ''
  const nom = nameParts.slice(1).join(' ') || prenom
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    nom,
    prenom,
    role: user.role === 'admin' ? 'admin' : 'user',
  }
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  )
}

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
      const mappedUser = mapBackendUser(response.data.user)
      const token = response.data.access_token

      if (!mappedUser || !token) {
        throw new Error('Réponse d\'authentification invalide')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(mappedUser))

      setUser(mappedUser)
      setIsAuthenticated(true)
      toast.success('Connexion réussie !')

      router.push('/')
      return { success: true }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erreur de connexion'))
      return { success: false, error: getErrorMessage(error, 'Erreur de connexion') }
    }
  }, [router])

  const register = useCallback(async (data) => {
    try {
      const name =
        data.name ||
        [data.prenom, data.nom].filter(Boolean).join(' ').trim()

      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name,
        role: data.role || 'client',
      })

      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      const mappedUser = mapBackendUser(response.data.user)
      const token = response.data.access_token

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(mappedUser))

      setUser(mappedUser)
      setIsAuthenticated(true)
      toast.success('Inscription réussie !')

      router.push('/')
      return { success: true }
    } catch (error) {
      toast.error(getErrorMessage(error, "Erreur d'inscription"))
      return { success: false, error: getErrorMessage(error, "Erreur d'inscription") }
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
