/**
 * Hook d'authentification admin — utilise le login DICE (/auth/login)
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = () => {
    try {
      const token = auth.getToken()
      const user = auth.getUser()
      if (token && user && (user.role === 'admin' || user.role === 'super_admin')) {
        setAdmin(user)
      } else {
        setAdmin(null)
      }
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password)
      const user = data.user

      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        throw new Error('Compte non autorisé pour l’administration')
      }

      auth.setToken(data.access_token)
      auth.setUser(user)
      setAdmin(user)
      toast.success('Connexion réussie')
      router.push('/admin')
      return data
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
      throw error
    }
  }

  const logout = () => {
    auth.logout()
    setAdmin(null)
    toast.success('Déconnexion réussie')
    router.push('/auth/login')
  }

  return {
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout,
    checkAuth,
  }
}
