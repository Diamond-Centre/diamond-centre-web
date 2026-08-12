/**
 * Hook d'authentification
 */

import { useState, useEffect, useCallback } from 'react'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /**
   * Vérifie la session locale au chargement du hook.
   */
  useEffect(() => {
    try {
      const token = auth.getToken()
      const storedUser = auth.getUser()

      if (token && storedUser) {
        setUser(storedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error(
        '[AUTH] Impossible de restaurer la session.',
        error
      )

      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Connexion.
   */
  const login = useCallback(async (email, password) => {
    setLoading(true)

    try {
      const response = await api.login(email, password)

      /*
       * Vérification de la réponse avant de stocker
       * les informations d'authentification.
       */
      if (!response?.access_token || !response?.user) {
        throw new Error(
          'Impossible de finaliser la connexion. Veuillez réessayer.'
        )
      }

      const loggedUser = response.user

      auth.setToken(response.access_token)
      auth.setUser(loggedUser)

      setUser(loggedUser)
      setIsAuthenticated(true)

      toast.success('Connexion réussie !')

      /*
       * Redirection selon le rôle.
       */
      if (
        loggedUser.role === 'admin' ||
        loggedUser.role === 'super_admin'
      ) {
        window.location.href = '/admin'
      } else {
        window.location.href = '/espace-client'
      }

      return loggedUser
    } catch (error) {
      /*
       * api.js doit déjà avoir transformé les erreurs
       * techniques en messages compréhensibles.
       */
      console.error('[AUTH] Échec de la connexion.', error)

      setUser(null)
      setIsAuthenticated(false)

      const message =
        error instanceof Error
          ? error.message
          : 'Connexion impossible pour le moment. Veuillez réessayer.'

      toast.error(message)

      /*
       * Ne pas relancer l'erreur :
       * le toast constitue déjà la gestion utilisateur.
       */
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Inscription.
   */
  const register = useCallback(async (userData) => {
    setLoading(true)

    try {
      const response = await api.register(userData)

      toast.success(
        'Inscription réussie ! Connectez-vous pour continuer.'
      )

      window.location.href = '/auth/login'

      return response
    } catch (error) {
      /*
       * Les détails techniques restent dans les logs.
       * L'utilisateur ne reçoit que le message normalisé
       * provenant de api.js.
       */
      console.error('[AUTH] Échec de l’inscription.', error)

      const message =
        error instanceof Error
          ? error.message
          : 'Inscription impossible pour le moment. Veuillez réessayer.'

      toast.error(message)

      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Déconnexion.
   */
  const logout = useCallback(() => {
    try {
      auth.logout()
    } catch (error) {
      console.error(
        '[AUTH] Erreur lors de la déconnexion.',
        error
      )
    } finally {
      /*
       * Même si le nettoyage local rencontre un problème,
       * l'état React doit être réinitialisé.
       */
      setUser(null)
      setIsAuthenticated(false)

      toast.success('Déconnexion réussie')

      window.location.href = '/'
    }
  }, [])

  /**
   * Vérifie si l'utilisateur actuel est administrateur.
   */
  const isAdmin = useCallback(() => {
    return (
      user?.role === 'admin' ||
      user?.role === 'super_admin'
    )
  }, [user])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
  }
}