/**
 * Shared client notification inbox (no React).
 * Scoped to the signed-in user via API calls; emptied on logout.
 */
const listeners = new Set()

export const notificationInbox = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

export function subscribeNotifications(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitNotifications() {
  listeners.forEach((fn) => fn())
}

export function clearNotificationCache() {
  notificationInbox.notifications = []
  notificationInbox.unreadCount = 0
  notificationInbox.error = null
  notificationInbox.loading = false
  emitNotifications()
}
