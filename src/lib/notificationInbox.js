/**
 * Shared client notification inbox (no React).
 * Scoped to the signed-in user via API calls; emptied on logout.
 */
const listeners = new Set()
const newListeners = new Set()

export const notificationInbox = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  seenIds: new Set(),
  seeded: false,
}

export function subscribeNotifications(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitNotifications() {
  listeners.forEach((fn) => fn())
}

export function subscribeNewNotifications(fn) {
  newListeners.add(fn)
  return () => newListeners.delete(fn)
}

export function emitNewNotifications(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return
  newListeners.forEach((fn) => fn(rows))
}

/**
 * First snapshot is silent. Later unseen unread rows are toasted.
 */
export function rememberNotificationIds(rows) {
  const incoming = []
  const wasSeeded = notificationInbox.seeded
  for (const n of rows) {
    if (n?.id == null) continue
    if (!notificationInbox.seenIds.has(n.id) && !n.is_read) {
      incoming.push(n)
    }
    notificationInbox.seenIds.add(n.id)
  }
  notificationInbox.seeded = true
  if (wasSeeded) emitNewNotifications(incoming)
  return incoming
}

export function clearNotificationCache() {
  notificationInbox.notifications = []
  notificationInbox.unreadCount = 0
  notificationInbox.error = null
  notificationInbox.loading = false
  notificationInbox.seenIds = new Set()
  notificationInbox.seeded = false
  emitNotifications()
}
