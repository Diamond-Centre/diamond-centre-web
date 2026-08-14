/** Where a client notification should open in the web app. */
export function notificationTargetHref(notification, { fallback = true } = {}) {
  if (!notification) return fallback ? '/espace-client/notifications' : null
  if (
    notification.type === 'modification' &&
    notification.change_id &&
    notification.ticket_id
  ) {
    return `/espace-client/notifications/changement/${notification.change_id}?ticket=${notification.ticket_id}`
  }
  if (notification.type === 'certificat') return '/espace-client/certificats'
  if (notification.ticket_id) return '/espace-client/tickets'
  if (notification.event_id) return '/espace-client/agenda'
  return fallback ? '/espace-client/notifications' : null
}
