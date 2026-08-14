/** Where a client notification should open in the web app. */
export function notificationTargetHref(notification, { fallback = true } = {}) {
  if (!notification) return fallback ? '/espace-client/notifications' : null

  const type = notification.type
  const eventId = notification.event_id
  const ticketId = notification.ticket_id

  if (type === 'modification' && notification.change_id && ticketId) {
    return `/espace-client/notifications/changement/${notification.change_id}?ticket=${ticketId}`
  }

  if (type === 'certificat') return '/espace-client/certificats'

  if (type === 'info' && eventId) return `/events/${eventId}`

  if (
    (type === 'reservation' ||
      type === 'rappel' ||
      type === 'remboursement' ||
      type === 'annulation') &&
    ticketId
  ) {
    return `/espace-client/tickets?ticket=${ticketId}`
  }

  if (ticketId) return `/espace-client/tickets?ticket=${ticketId}`
  if (eventId) return `/events/${eventId}`
  return fallback ? '/espace-client/notifications' : null
}

export function notificationOpenLabel(notification) {
  switch (notification?.type) {
    case 'modification':
      return 'Voir la modification →'
    case 'certificat':
      return 'Voir le certificat →'
    case 'info':
      return 'Voir l’événement →'
    case 'reservation':
    case 'rappel':
    case 'remboursement':
    case 'annulation':
      return notification.ticket_id ? 'Voir le billet →' : 'Voir l’événement →'
    default:
      return 'Ouvrir →'
  }
}
