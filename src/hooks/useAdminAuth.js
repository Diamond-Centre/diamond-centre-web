/**
 * Hook d'authentification admin
 * Utilise le login DICE (/auth/login)
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  /**
   * Vérifie si l'utilisateur actuellement connecté
   * possède les droits d'administration.
   */
  const checkAuth = useCallback(() => {
    try {
      const token = auth.getToken()
      const user = auth.getUser()

      const isAdmin =
        !!token &&
        !!user &&
        (user.role === 'admin' || user.role === 'super_admin')

      setAdmin(isAdmin ? user : null)

      return isAdmin
    } catch (error) {
      console.error('ADMIN_AUTH : Erreur lors de la vérification de la session.', error)

      setAdmin(null)

      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Vérification initiale de l'authentification.
   */
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  /**
   * Connexion administrateur.
   */
  const login = useCallback(
    async (email, password) => {
      setLoading(true)

      try {
        const data = await api.login(email, password)

        const user = data?.user
        const token = data?.access_token

        /*
         * Vérification de la réponse du backend.
         * On ne laisse pas passer une session incomplète.
         */
        if (!user || !token) {
          throw new Error(
            'Impossible de finaliser la connexion. Veuillez réessayer.'
          )
        }

        /*
         * Vérification des permissions.
         */
        const isAdmin =
          user.role === 'admin' || user.role === 'super_admin'

        if (!isAdmin) {
          throw new Error(
            "Ce compte n'est pas autorisé à accéder à l'administration."
          )
        }

        /*
         * Stockage des informations d'authentification.
         */
        auth.setToken(token)
        auth.setUser(user)

        setAdmin(user)

        toast.success('Connexion réussie')

        router.push('/admin')

        return data
      } catch (error) {
        /*
         * api.js est responsable de normaliser les erreurs
         * provenant du backend.
         *
         * Le hook récupère donc uniquement un message
         * destiné à l'utilisateur.
         */
        console.error(
          'ADMIN_AUTH : Échec de la connexion.',
          error
        )

        const message =
          error instanceof Error
            ? error.message
            : 'Connexion impossible pour le moment. Veuillez réessayer.'

        setAdmin(null)

        toast.error(message)

        /*
         * On retourne null plutôt que de propager l'erreur.
         *
         * Cela évite un "Unhandled Runtime Error" si le composant
         * qui appelle login() ne possède pas lui-même de try/catch.
         */
        return null
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  /**
   * Déconnexion.
   */
  const logout = useCallback(() => {
    try {
      auth.logout()
      setAdmin(null)

      toast.success('Déconnexion réussie')

      router.push('/auth/login')
    } catch (error) {
      console.error(
        'ADMIN_AUTH: Erreur lors de la déconnexion.',
        error
      )

      /*
       * Même si quelque chose se passe mal pendant le nettoyage,
       * on considère localement l'utilisateur comme déconnecté.
       */
      setAdmin(null)

      toast.error(
        'Une erreur est survenue lors de la déconnexion.'
      )
    }
  }, [router])

  return {
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout,
    checkAuth,
  }
}