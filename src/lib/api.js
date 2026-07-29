/**
 * API client centralisé - Version avec promotion corrigée
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = {
  // ===== AUTH =====
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
  // Le backend attend: email, password, name, telephone, sexe, picture, role
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
      telephone: data.telephone || '',
      sexe: data.sexe || '',
      picture: data.picture || '',
      role: data.role || 'user'  // 'user' par défaut, 'admin' pour admin
    })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur d\'inscription')
  }
  return response.json()
},


  // ===== UPLOAD =====
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de l\'upload')
    }
    
    return response.json()
  },

  // ===== EVENTS =====
  getPublicEvents: async () => {
    const response = await fetch(`${API_URL}/events`, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors du chargement des événements')
    }
    return response.json()
  },

  getEvents: async (token) => {
    const response = await fetch(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors du chargement des événements')
    }
    return response.json()
  },

  // lib/api.js - createEvent avec logs
createEvent: async (data, token) => {
  try {
    console.log('📤 API createEvent appelée')
    console.log('📤 Token:', token ? 'Présent' : 'Absent')
    console.log('📤 Données:', JSON.stringify(data, null, 2))

    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    console.log('📥 Statut réponse:', response.status)
    console.log('📥 Headers:', Object.fromEntries(response.headers.entries()))

    const text = await response.text()
    console.log('📥 Corps réponse:', text)

    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}`
      try {
        const error = JSON.parse(text)
        errorMessage = error.message || error.error || errorMessage
      } catch {
        errorMessage = `Erreur ${response.status}: ${text.substring(0, 100)}`
      }
      throw new Error(errorMessage)
    }

    return JSON.parse(text)
  } catch (error) {
    console.error('❌ CreateEvent error:', error)
    throw new Error(error.message || 'Erreur lors de la création')
  }
},

updateEvent: async (id, data, token) => {
  const payload = {
    title: data.title,
    description: data.description,
    price: Number(data.price),
    currency: data.currency || 'XAF',
    start_date: data.start_date,
    end_date: data.end_date,
    start_time: data.start_time || '09:00',
    end_time: data.end_time || '17:00',
    location: data.location,
    category: data.category,
    capacity: Number(data.capacity),
    image_url: data.image_url || '',
    status: data.status || 'published'
  }

  // Gérer la promotion
  if (data.hasPromotion && data.promotion) {
    const promo = data.promotion
    const nombre = Number(promo.nombre)
    const pourcentage = Number(promo.pourcentage)
    const duree = Number(promo.duree)
    
    if (nombre > 0 && pourcentage > 0 && duree > 0) {
      payload.promotion = {
        nombre: nombre,
        sexe: promo.sexe || 'tous',
        pourcentage: pourcentage,
        duree: duree,
        description: promo.description || ''
      }
    } else {
      payload.promotion = null
    }
  } else {
    payload.promotion = null
  }

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
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
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression')
    }
    return response.json()
  },

  getEventById: async (id, token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const response = await fetch(`${API_URL}/events/${id}`, { headers })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Événement non trouvé')
    }
    return response.json()
  },

  // ===== TICKETS =====
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
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone
      })
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Erreur réservation:', text)
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
    throw new Error(error.message || 'Erreur lors de la réservation')
  }
},

// ===== TICKETS =====
getTickets: async (token) => {
  try {
    const response = await fetch(`${API_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Erreur tickets:', text)
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

getTicket: async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Ticket non trouvé')
    }
    return response.json()
  } catch (error) {
    console.error('GetTicket error:', error)
    return null
  }
},

getTicketById: async (id, token) => {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ticket non trouvé')
  }
  return response.json()
},

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

reserveTickets: async (data, token) => {
  const response = await fetch(`${API_URL}/tickets/reserve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      event_id: data.eventId,
      quantity: data.quantity || 1,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone
    })
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la réservation')
  }
  return response.json()
},

  // ===== PAYMENTS =====
  initiatePayment: async (data, token) => {
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
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors du chargement du statut')
    }
    return response.json()
  },

  // ===== VALIDATION QR CODE =====
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

  // ===== USERS =====
  getUsers: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors du chargement des utilisateurs')
    }
    return response.json()
  },

  // ===== STATS =====
  getStats: async (token) => {
    try {
      const [events, users] = await Promise.all([
        api.getEvents(token),
        api.getUsers(token)
      ])
      
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

      const eventsByMonth = events.reduce((acc, event) => {
        const month = new Date(event.start_date).toLocaleString('fr-FR', { month: 'short' })
        if (!acc[month]) acc[month] = 0
        acc[month]++
        return acc
      }, {})

      const usersByMonth = users.reduce((acc, user) => {
        const month = new Date(user.created_at).toLocaleString('fr-FR', { month: 'short' })
        if (!acc[month]) acc[month] = 0
        acc[month]++
        return acc
      }, {})

      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc']
      
      const totalRevenue = events.reduce((sum, e) => sum + (e.price || 0), 0)
      
      return {
        totalEvents: events.length,
        totalUsers: users.length,
        totalRevenue,
        totalTickets: 0,
        eventsByMonth: months.map(m => ({ month: m, count: eventsByMonth[m] || 0 })),
        revenueByMonth: months.map(m => ({ month: m, revenue: 0 })),
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