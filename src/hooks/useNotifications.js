'use client'

import { useState, useCallback, useEffect } from 'react'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

/**
 * Client notifications — same backend as the mobile app.
 */
export function useNotifications({ autoLoad = true } = {}) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async ({ sync = true } = {}) => {
    const token = auth.getToken()
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return []
    }

    try {
      setLoading(true)
      setError(null)
      const list = sync
        ? await api.syncNotifications(token)
        : await api.getNotifications(token)
      const rows = Array.isArray(list) ? list : []
      setNotifications(rows)
      setUnreadCount(rows.filter((n) => !n.is_read).length)
      return rows
    } catch (err) {
      setError(err.message || 'Impossible de charger les notifications')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id) => {
    const token = auth.getToken()
    if (!token || !id) return
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
    try {
      await api.markNotificationRead(id, token)
    } catch {
      // keep optimistic state
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const token = auth.getToken()
    if (!token) return
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
    try {
      await api.markAllNotificationsRead(token)
      toast.success('Toutes les notifications sont lues')
    } catch (err) {
      toast.error(err.message || 'Impossible de tout marquer comme lu')
      await refresh({ sync: false })
    }
  }, [refresh])

  useEffect(() => {
    if (!autoLoad) return
    refresh({ sync: true })
  }, [autoLoad, refresh])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    fetchNotifications: () => refresh({ sync: true }),
    markAsRead,
    markAllAsRead,
  }
}
