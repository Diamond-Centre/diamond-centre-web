/**
 * Context d'authentification utilisateur
 */
'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        // Vérifier le token avec l'API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Erreur auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur de connexion')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
      toast.success('Connexion réussie')
      router.push('/espace-client')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }, [router])

  const register = useCallback(async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || error.message || 'Erreur d\'inscription')
      }

      let data = await response.json()

      if (!data?.access_token) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        })
        if (!loginRes.ok) {
          throw new Error(
            'Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter.'
          )
        }
        data = await loginRes.json()
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
      } else if (data.token) {
        localStorage.setItem('token', data.token)
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
      }

      toast.success('Inscription réussie ! Bienvenue.')
      router.push('/espace-client')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Déconnexion réussie')
    router.push('/')
  }, [router])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}