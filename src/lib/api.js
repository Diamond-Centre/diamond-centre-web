/**
 * API client centralisé - Version avec gestion d'erreurs améliorée
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  // ===== AUTH =====
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur de connexion')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.')
    }
  },

  register: async (data) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name
        })
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur d\'inscription')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('Register error:', error)
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.')
    }
  },

  // ===== EVENTS =====
  getPublicEvents: async () => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors du chargement des événements')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetPublicEvents error:', error)
      return []
    }
  },

  getEvents: async (token) => {
    try {
      const headers = token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }
      
      const response = await fetch(`${API_URL}/events`, { headers })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors du chargement des événements')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetEvents error:', error)
      return []
    }
  },

  createEvent: async (data, token) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          price: Number(data.price),
          currency: data.currency || 'XAF',
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location,
          category: data.category,
          capacity: Number(data.capacity),
          image_url: data.image_url || '',
          status: 'published'
        })
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors de la création')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('CreateEvent error:', error)
      throw new Error('Erreur lors de la création de l\'événement')
    }
  },

  updateEvent: async (id, data, token) => {
  try {
    // Nettoyer les données avant l'envoi
    const cleanData = {
      title: data.title?.trim() || '',
      description: data.description?.trim() || '',
      price: Number(data.price) || 0,
      currency: data.currency || 'XAF',
      start_date: data.start_date || '',
      end_date: data.end_date || '',
      location: data.location?.trim() || '',
      category: data.category || 'conférence',
      capacity: Number(data.capacity) || 1,
      image_url: data.image_url || ''
    }

    console.log('📤 Mise à jour événement ID:', id)
    console.log('📤 Données envoyées:', cleanData)

    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cleanData)
    })
    
    console.log('📥 Statut réponse:', response.status)
    
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Réponse erreur:', text)
      
      // Essayer de parser le JSON
      try {
        const error = JSON.parse(text)
        throw new Error(error.message || `Erreur ${response.status}`)
      } catch {
        // Si ce n'est pas du JSON, afficher le texte
        if (response.status === 404) {
          throw new Error(`La route /api/events/${id} n'existe pas. Vérifiez que le backend est bien configuré.`)
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
      }
    }
    return response.json()
  } catch (error) {
    console.error('UpdateEvent error:', error)
    throw new Error(error.message || 'Erreur lors de la mise à jour de l\'événement')
  }
},


  deleteEvent: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors de la suppression')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('DeleteEvent error:', error)
      throw new Error('Erreur lors de la suppression de l\'événement')
    }
  },

  getEventById: async (id, token) => {
    try {
      const headers = token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' }
      
      const response = await fetch(`${API_URL}/events/${id}`, { headers })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Événement non trouvé')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetEventById error:', error)
      return null
    }
  },

  // ===== TICKETS =====
  getTickets: async (token) => {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors du chargement des tickets')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetTickets error:', error)
      return []
    }
  },

  reserveTickets: async (data, token) => {
    try {
      const response = await fetch(`${API_URL}/tickets/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          event_id: data.eventId,
          quantity: data.quantity || 1,
          customer_name: data.customerName || data.name,
          customer_email: data.customerEmail || data.email,
          customer_phone: data.customerPhone || data.phone || ''
        })
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors de la réservation')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('ReserveTickets error:', error)
      throw new Error('Erreur lors de la réservation')
    }
  },

  // ===== PAYMENTS =====
  initiatePayment: async (data, token) => {
    try {
      const response = await fetch(`${API_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticket_id: data.ticketId,
          method: data.method || 'mtn_momo',
          phone: data.phone
        })
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors de l\'initiation du paiement')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('InitiatePayment error:', error)
      throw new Error('Erreur lors de l\'initiation du paiement')
    }
  },

  getPaymentStatus: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/payments/${id}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors du chargement du statut')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetPaymentStatus error:', error)
      throw new Error('Erreur lors du chargement du statut du paiement')
    }
  },

  // ===== USERS =====
  getUsers: async (token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        try {
          const error = JSON.parse(text)
          throw new Error(error.message || 'Erreur lors du chargement des utilisateurs')
        } catch {
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 100)}`)
        }
      }
      return response.json()
    } catch (error) {
      console.error('GetUsers error:', error)
      return []
    }
  },

  // ===== STATS =====
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