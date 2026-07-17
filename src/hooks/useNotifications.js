'use client'

import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

/**
 * Notifications are not yet exposed by DICE backend.
 * Keep a safe no-op hook so UI can mount without 404 polling.
 */
export function useNotifications() {
  const [notifications] = useState([])
  const [unreadCount] = useState(0)
  const [loading] = useState(false)
  const { user } = useAuth()

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    // Backend endpoint not available yet
  }, [user])

  const markAsRead = useCallback(async () => {}, [])

  const markAllAsRead = useCallback(async () => {
    toast('Les notifications seront bientôt disponibles')
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
