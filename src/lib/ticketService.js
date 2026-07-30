/**
 * Service de gestion des tickets - Version robuste
 */
const TICKETS_STORAGE_KEY = 'dice_user_tickets'
const TICKETS_INDEX_KEY = 'dice_tickets_index'

export const ticketService = {
  // Récupérer tous les tickets
  getTickets: () => {
    try {
      const tickets = localStorage.getItem(TICKETS_STORAGE_KEY)
      if (tickets) {
        const parsed = JSON.parse(tickets)
        console.log('📋 Tickets récupérés:', parsed.length)
        return parsed
      }
      return []
    } catch (error) {
      console.error('Erreur récupération tickets:', error)
      return []
    }
  },

  // Ajouter un ticket
  addTicket: (ticket) => {
    try {
      const tickets = ticketService.getTickets()
      const newTicket = {
        ...ticket,
        id: ticket.id || Date.now(),
        added_at: new Date().toISOString()
      }
      tickets.push(newTicket)
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
      
      // Mettre à jour l'index
      const index = ticketService.getIndex()
      index.lastUpdated = Date.now()
      index.totalTickets = tickets.length
      localStorage.setItem(TICKETS_INDEX_KEY, JSON.stringify(index))
      
      console.log('✅ Ticket ajouté:', newTicket)
      console.log('📋 Total tickets:', tickets.length)
      
      // Forcer une mise à jour de l'interface
      window.dispatchEvent(new CustomEvent('tickets-changed', { 
        detail: { tickets, newTicket } 
      }))
      
      return newTicket
    } catch (error) {
      console.error('Erreur ajout ticket:', error)
      return null
    }
  },

  // Supprimer un ticket
  removeTicket: (id) => {
    try {
      let tickets = ticketService.getTickets()
      tickets = tickets.filter(t => t.id !== id)
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
      
      const index = ticketService.getIndex()
      index.totalTickets = tickets.length
      localStorage.setItem(TICKETS_INDEX_KEY, JSON.stringify(index))
      
      window.dispatchEvent(new CustomEvent('tickets-changed', { 
        detail: { tickets } 
      }))
      
      return true
    } catch (error) {
      console.error('Erreur suppression ticket:', error)
      return false
    }
  },

  // Obtenir l'index des tickets
  getIndex: () => {
    try {
      const index = localStorage.getItem(TICKETS_INDEX_KEY)
      if (index) {
        return JSON.parse(index)
      }
      return { lastUpdated: 0, totalTickets: 0 }
    } catch {
      return { lastUpdated: 0, totalTickets: 0 }
    }
  },

  // Vider tous les tickets
  clearTickets: () => {
    localStorage.removeItem(TICKETS_STORAGE_KEY)
    localStorage.removeItem(TICKETS_INDEX_KEY)
    window.dispatchEvent(new CustomEvent('tickets-changed', { detail: { tickets: [] } }))
  },

  // Vérifier si des tickets existent
  hasTickets: () => {
    const tickets = ticketService.getTickets()
    return tickets.length > 0
  }
}