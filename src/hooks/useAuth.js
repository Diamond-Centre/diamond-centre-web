/**
 * Hook d'authentification — connecté à DICE-PROJECT-BACKEND
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/store/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'

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

function persistSession(user, token) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  )
}

export function useAuth() {
  const router = useRouter()
  const { user, setUser, clearUser, setToken } = authStore()
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur', error)
      clearSession()
      clearUser()
    } finally {
      setInitialized(true)
    }
  }, [setUser, setToken, clearUser])

  const login = useCallback(
    async (email, password) => {
      setLoading(true)
      try {
        const { data } = await api.post('/auth/login', { email, password })
        const mappedUser = mapBackendUser(data.user)
        const token = data.access_token

        if (!mappedUser || !token) {
          throw new Error("Réponse d'authentification invalide")
        }

        persistSession(mappedUser, token)
        setUser(mappedUser)
        setToken(token)
        toast.success('Connexion réussie !')
        return mappedUser
      } catch (error) {
        const message = getErrorMessage(error, 'Erreur de connexion')
        toast.error(message)
        throw new Error(message)
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken]
  )

  const register = useCallback(
    async (formData) => {
      setLoading(true)
      try {
        const name = [formData.prenom, formData.nom].filter(Boolean).join(' ').trim()
        if (!name) {
          throw new Error('Le nom et le prénom sont requis')
        }

        await api.post('/auth/register', {
          email: formData.email,
          password: formData.password,
          name,
          role: 'client',
        })

        const { data } = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        })

        const mappedUser = mapBackendUser(data.user)
        const token = data.access_token
        persistSession(mappedUser, token)
        setUser(mappedUser)
        setToken(token)

        toast.success('Compte créé avec succès !')
        return mappedUser
      } catch (error) {
        const message = getErrorMessage(error, "Erreur lors de l'inscription")
        toast.error(message)
        throw new Error(message)
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken]
  )

  const logout = useCallback(async () => {
    try {
      clearSession()
      clearUser()
      toast.success('Déconnexion réussie')
      router.push('/')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }, [clearUser, router])

  return {
    user,
    isAuthenticated: !!user,
    loading: loading || !initialized,
    initialized,
    login,
    register,
    logout,
  }
}
