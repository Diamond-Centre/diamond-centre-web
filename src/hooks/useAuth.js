/**
 * Hook d'authentification personnalisé
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// Mock users pour la démonstration
const mockUsers = [
  {
    id: '1',
    email: 'demo@diamondcentre.com',
    password: 'Demo123!',
    nom: 'Dupont',
    prenom: 'Jean',
    role: 'user',
    telephone: '0612345678',
    sexe: 'M'
  },
  {
    id: '2',
    email: 'admin@diamondcentre.com',
    password: 'Admin123!',
    nom: 'Admin',
    prenom: 'Super',
    role: 'admin',
    telephone: '0623456789',
    sexe: 'M'
  }
]

export function useAuth() {
  const router = useRouter()
  const { user, setUser, clearUser, isAuthenticated } = authStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (cookies)
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]
    
    if (userCookie && !user) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        setUser(userData)
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur', error)
      }
    }
  }, [user, setUser])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect')
      }

      const { password: _, ...userWithoutPassword } = foundUser
      
      document.cookie = `user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}; path=/; max-age=604800`
      document.cookie = `token=mock-token-${Date.now()}; path=/; max-age=604800`
      
      setUser(userWithoutPassword)
      toast.success('Connexion réussie !')
      return userWithoutPassword
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setUser])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (mockUsers.some(u => u.email === data.email)) {
        throw new Error('Cet email est déjà utilisé')
      }

      const newUser = {
        id: String(mockUsers.length + 1),
        ...data,
        role: 'user'
      }
      
      mockUsers.push(newUser)
      
      toast.success('Compte créé avec succès !')
      return newUser
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
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
    loading,
    login,
    register,
    logout
  }
}