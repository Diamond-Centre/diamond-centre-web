/**
 * Service de gestion des tickets - Stockage fiable
 */
const STORAGE_KEY = 'dice_tickets'
const STORAGE_KEY_TIMESTAMP = 'dice_tickets_timestamp'

export const ticketStorage = {
  // Récupérer tous les tickets
  getTickets: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      return JSON.parse(data)
    } catch (error) {
      console.error('Erreur lecture tickets:', error)
      return []
    }
  },

  // Sauvegarder les tickets
  saveTickets: (tickets) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
      localStorage.setItem(STORAGE_KEY_TIMESTAMP, Date.now().toString())
      return true
    } catch (error) {
      console.error('Erreur sauvegarde tickets:', error)
      return false
    }
  },

  // Ajouter un ticket
  addTicket: (ticketData) => {
    const tickets = ticketStorage.getTickets()
    const newTicket = {
      id: ticketData.id || `TICKET-${Date.now()}`,
      ...ticketData,
      created_at: ticketData.created_at || new Date().toISOString()
    }
    tickets.unshift(newTicket) // Ajouter au début
    ticketStorage.saveTickets(tickets)
    return newTicket
  },

  // Mettre à jour un ticket
  updateTicket: (id, updates) => {
    const tickets = ticketStorage.getTickets()
    const index = tickets.findIndex(t => t.id === id)
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates }
      ticketStorage.saveTickets(tickets)
      return tickets[index]
    }
    return null
  },

  // Supprimer un ticket
  removeTicket: (id) => {
    const tickets = ticketStorage.getTickets()
    const filtered = tickets.filter(t => t.id !== id)
    ticketStorage.saveTickets(filtered)
    return filtered
  },

  // Vider les tickets
  clearTickets: () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY_TIMESTAMP)
  },

  // Obtenir le timestamp de la dernière mise à jour
  getLastUpdate: () => {
    return localStorage.getItem(STORAGE_KEY_TIMESTAMP) || null
  }
}