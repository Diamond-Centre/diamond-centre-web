'use client'

import { useState, useCallback, useEffect } from 'react'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  notificationInbox,
  subscribeNotifications,
  emitNotifications,
  clearNotificationCache,
  rememberNotificationIds,
} from '@/lib/notificationInbox'

let inflight = null
let queuedSilentRefresh = false

/**
 * Shared client inbox so the nav badge and the notifications page stay in sync.
 * Only the signed-in user's rows from GET /notifications (or a user-scoped sync).
 */
export async function loadNotifications({
  sync = false,
  silent = false,
} = {}) {
  const token = auth.getToken()
  if (!token) {
    clearNotificationCache()
    return []
  }

  if (inflight) {
    queuedSilentRefresh = true
    return inflight
  }

  inflight = (async () => {
    if (!silent) {
      notificationInbox.loading = true
      notificationInbox.error = null
      emitNotifications()
    }

    try {
      const list = sync
        ? await api.syncNotifications(token)
        : await api.getNotifications(token)
      const rows = Array.isArray(list) ? list : []
      notificationInbox.notifications = rows
      notificationInbox.unreadCount = rows.filter((n) => !n.is_read).length
      rememberNotificationIds(rows)
      return rows
    } catch (err) {
      notificationInbox.error =
        err.message || 'Impossible de charger les notifications'
      return notificationInbox.notifications
    } finally {
      notificationInbox.loading = false
      emitNotifications()
    }
  })().finally(() => {
    inflight = null
    if (queuedSilentRefresh) {
      queuedSilentRefresh = false
      loadNotifications({ silent: true })
    }
  })

  return inflight
}

export function useNotifications({ autoLoad = true, sync = false } = {}) {
  const [, setTick] = useState(0)

  useEffect(() => subscribeNotifications(() => setTick((t) => t + 1)), [])

  useEffect(() => {
    if (!autoLoad) return
    loadNotifications({ sync })
  }, [autoLoad, sync])

  const refresh = useCallback((opts = {}) => loadNotifications(opts), [])

  const markAsRead = useCallback(async (id) => {
    const token = auth.getToken()
    if (!token || !id) return
    const wasUnread = notificationInbox.notifications.some(
      (n) => n.id === id && !n.is_read
    )
    notificationInbox.notifications = notificationInbox.notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    )
    if (wasUnread) {
      notificationInbox.unreadCount = Math.max(
        0,
        notificationInbox.unreadCount - 1
      )
    }
    emitNotifications()
    try {
      await api.markNotificationRead(id, token)
    } catch {
      // keep optimistic state
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const token = auth.getToken()
    if (!token) return
    notificationInbox.notifications = notificationInbox.notifications.map(
      (n) => ({
        ...n,
        is_read: true,
      })
    )
    notificationInbox.unreadCount = 0
    emitNotifications()
    try {
      await api.markAllNotificationsRead(token)
      toast.success('Toutes les notifications sont lues')
    } catch (err) {
      toast.error(err.message || 'Impossible de tout marquer comme lu')
      await loadNotifications({ sync: false })
    }
  }, [])

  return {
    notifications: notificationInbox.notifications,
    unreadCount: notificationInbox.unreadCount,
    loading: notificationInbox.loading,
    error: notificationInbox.error,
    refresh,
    fetchNotifications: () => loadNotifications({ sync: true }),
    markAsRead,
    markAllAsRead,
  }
}
