/**
 * API client centralisé
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur de connexion')
    }
    return response.json()
  },

  register: async (data) => {
  // Les données attendues par le backend:
  // { email, password, name, role? }
  // role est optionnel, par défaut 'user' dans le backend
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name
      // Le champ 'role' n'est pas envoyé, le backend met 'user' par défaut
    })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur d\'inscription')
  }
  return response.json()
},

  // Vérifier le token
  verifyToken: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  },

  // Events
  getEvents: async (token) => {
    const response = await fetch(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur lors du chargement des événements')
    return response.json()
  },

  createEvent: async (data, token) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création')
    }
    return response.json()
  },

  getEventById: async (id, token) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Événement non trouvé')
    return response.json()
  },

  updateEvent: async (id, data, token) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour')
    }
    return response.json()
  },

  deleteEvent: async (id, token) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur lors de la suppression')
    return response.json()
  },

  // Users
  getUsers: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs')
    return response.json()
  },

  // Tickets
  getTickets: async (token) => {
    const response = await fetch(`${API_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur lors du chargement des tickets')
    return response.json()
  },

  reserveTickets: async (data, token) => {
    const response = await fetch(`${API_URL}/tickets/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la réservation')
    }
    return response.json()
  },

  // Payments
  initiatePayment: async (data, token) => {
    const response = await fetch(`${API_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de l\'initiation du paiement')
    }
    return response.json()
  },

  getPaymentStatus: async (id, token) => {
    const response = await fetch(`${API_URL}/payments/${id}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Erreur lors du chargement du statut')
    return response.json()
  },

  // Validation
  validateTicket: async (qrCode, token) => {
    const response = await fetch(`${API_URL}/validation/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ qr_code: qrCode })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la validation')
    }
    return response.json()
  },

  // Statistiques Admin
  getStats: async (token) => {
    try {
      const [events, users, tickets] = await Promise.all([
        api.getEvents(token),
        api.getUsers(token),
        api.getTickets(token)
      ])
      
      const totalRevenue = tickets.reduce((sum, t) => sum + (t.total_price || 0), 0)
      
      const eventsByMonth = events.reduce((acc, event) => {
        const month = new Date(event.start_date).toLocaleString('fr-FR', { month: 'short' })
        if (!acc[month]) acc[month] = 0
        acc[month]++
        return acc
      }, {})
      
      const revenueByMonth = tickets.reduce((acc, ticket) => {
        const month = new Date(ticket.created_at).toLocaleString('fr-FR', { month: 'short' })
        if (!acc[month]) acc[month] = 0
        acc[month] += ticket.total_price || 0
        return acc
      }, {})
      
      const categories = events.reduce((acc, event) => {
        const cat = event.category || 'autre'
        if (!acc[cat]) acc[cat] = 0
        acc[cat]++
        return acc
      }, {})
      
      const totalEvents = events.length
      const categoriesData = Object.entries(categories).map(([name, count]) => ({
        name,
        count,
        percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0
      }))

      const usersByMonth = users.reduce((acc, user) => {
        const month = new Date(user.created_at).toLocaleString('fr-FR', { month: 'short' })
        if (!acc[month]) acc[month] = 0
        acc[month]++
        return acc
      }, {})

      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc']
      
      return {
        totalEvents: events.length,
        totalUsers: users.length,
        totalRevenue,
        totalTickets: tickets.length,
        eventsByMonth: months.map(m => ({ month: m, count: eventsByMonth[m] || 0 })),
        revenueByMonth: months.map(m => ({ month: m, revenue: revenueByMonth[m] || 0 })),
        categories: categoriesData,
        usersByMonth: months.map(m => ({ month: m, count: usersByMonth[m] || 0 }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalEvents: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalTickets: 0,
        eventsByMonth: [],
        revenueByMonth: [],
        categories: [],
        usersByMonth: []
      }
    }
  }
}