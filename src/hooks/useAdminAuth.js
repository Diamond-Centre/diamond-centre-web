/**
 * Hook d'authentification admin
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/admin/me')
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
      } else {
        setAdmin(null)
      }
    } catch (error) {
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
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur de connexion')
      }

      const data = await response.json()
      setAdmin(data.admin)
      toast.success('Connexion réussie')
      router.push('/admin')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      setAdmin(null)
      // Supprimer le cookie
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      toast.success('Déconnexion réussie')
      router.push('/auth/admin/login')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return {
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout,
    checkAuth
  }
}