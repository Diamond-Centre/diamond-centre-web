/**
 * API client — DICE backend (via Next /api proxy)
 * Safe JSON parsing so HTML 404 pages never crash as JSON.parse errors.
 */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/+$/, '')

async function parseJson(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    const snippet = text.replace(/\s+/g, ' ').slice(0, 120)
    throw new Error(
      response.ok
        ? `Réponse invalide du serveur: ${snippet}`
        : `Erreur ${response.status}: ${snippet || response.statusText}`
    )
  }
}

async function request(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const response = await fetch(`${API_URL}${normalizedPath}`, options)
  const data = await parseJson(response)

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${response.status}`

    throw new Error(typeof message === 'string' ? message : `Erreur ${response.status}`)
  }

  return data
}

function authHeaders(token, extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

function formatTimeValue(value, fallback = '09:00') {
  if (!value) return fallback
  const s = String(value)
  const match = s.match(/(\d{1,2}):(\d{2})/)
  if (match) return `${match[1].padStart(2, '0')}:${match[2]}`
  return fallback
}

function formatDateKey(value) {
  if (!value) return ''
  const s = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const api = {
  // ===== AUTH =====
  login: async (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'client',
      telephone: data.telephone || '+237000000000',
      sexe: data.sexe || 'non_precise',
      picture:
        data.picture ||
        'https://ui-avatars.com/api/?name=User&background=0a89f2&color=fff&size=128',
    }
    return request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  },

  // ===== UPLOAD (DICE: POST /uploads/image with base64 JSON) =====
  uploadImage: async (file, token) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = String(reader.result || '')
        const comma = result.indexOf(',')
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    return request('/uploads/image', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        image_base64: base64,
        mime_type: file.type || 'image/jpeg',
      }),
    })
  },

  // ===== EVENTS =====
  getPublicEvents: async () => request('/events'),

  getEvents: async (token) =>
    request('/events', { headers: authHeaders(token) }),

  getEventById: async (id, token) =>
    request(`/events/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  createEvent: async (data, token) => {
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
      latitude:
        data.latitude === undefined || data.latitude === '' || data.latitude === null
          ? null
          : Number(data.latitude),
      longitude:
        data.longitude === undefined || data.longitude === '' || data.longitude === null
          ? null
          : Number(data.longitude),
      category: data.category,
      capacity: Number(data.capacity),
      image_url: data.image_url || '',
      status: data.status || 'published',
    }

    // Same promotion rules as update — only send when complete & valid
    if (data.hasPromotion && data.promotion) {
      const promo = data.promotion
      const nombre = Number(promo.nombre)
      const pourcentage = Number(promo.pourcentage)
      const duree = Number(promo.duree)
      if (nombre > 0 && pourcentage > 0 && duree > 0) {
        payload.promotion = {
          nombre,
          sexe: promo.sexe || 'tous',
          pourcentage,
          duree,
          description: promo.description || '',
        }
      }
    } else if (data.promotion && typeof data.promotion === 'object') {
      const promo = data.promotion
      const nombre = Number(promo.nombre)
      const pourcentage = Number(promo.pourcentage)
      const duree = Number(promo.duree)
      if (nombre > 0 && pourcentage > 0 && duree > 0) {
        payload.promotion = {
          nombre,
          sexe: promo.sexe || 'tous',
          pourcentage,
          duree,
          description: promo.description || '',
        }
      }
    }

    return request('/events', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    })
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
      latitude:
        data.latitude === undefined || data.latitude === '' || data.latitude === null
          ? null
          : Number(data.latitude),
      longitude:
        data.longitude === undefined || data.longitude === '' || data.longitude === null
          ? null
          : Number(data.longitude),
      category: data.category,
      capacity: Number(data.capacity),
      image_url: data.image_url || '',
      status: data.status || 'published',
      promotion: null,
    }

    if (data.hasPromotion && data.promotion) {
      const promo = data.promotion
      const nombre = Number(promo.nombre)
      const pourcentage = Number(promo.pourcentage)
      const duree = Number(promo.duree)
      if (nombre > 0 && pourcentage > 0 && duree > 0) {
        payload.promotion = {
          nombre,
          sexe: promo.sexe || 'tous',
          pourcentage,
          duree,
          description: promo.description || '',
        }
      }
    }

    return request(`/events/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    })
  },

  deleteEvent: async (id, token) =>
    request(`/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),

  // ===== TICKETS (DICE: POST /reserve, GET /:id — list via local index like mobile) =====
  reserveTickets: async (data, token) => {
    const result = await request('/tickets/reserve', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        event_id: Number(data.eventId ?? data.event_id),
        quantity: Number(data.quantity || 1),
        customer_name: String(data.customerName ?? data.customer_name ?? '').trim(),
        customer_email: String(data.customerEmail ?? data.customer_email ?? '').trim(),
        customer_phone:
          String(data.customerPhone ?? data.customer_phone ?? '').trim() ||
          '+237000000000',
      }),
    })

    // Persist all ticket IDs from this booking (1 ticket per place)
    try {
      const { ticketStore } = await import('@/lib/ticketStore')
      const ticketList =
        Array.isArray(result.tickets) && result.tickets.length
          ? result.tickets
          : [
              {
                id: result.id,
                qr_codes: result.qr_codes || [],
              },
            ]

      for (const t of ticketList) {
        const qrItem = Array.isArray(t.qr_codes) && t.qr_codes.length ? t.qr_codes[0] : null
        const qrCode =
          typeof qrItem === 'string' ? qrItem : qrItem?.code || null
        const entryCode =
          typeof qrItem === 'object' && qrItem ? qrItem.entry_code : null

        ticketStore.upsert({
          ticket_id: t.id ?? result.id,
          event_id: result.event_id,
          event_title: result.event_title,
          customer_name: data.customerName ?? data.customer_name,
          qr_code: qrCode,
          entry_code: entryCode,
          date: data.event_date || new Date().toISOString(),
          location: data.location || '',
          time: data.time || null,
        })
      }
    } catch (e) {
      console.warn('ticketStore upsert failed', e)
    }

    return result
  },

  getTicketById: async (id, token) =>
    request(`/tickets/${id}`, { headers: authHeaders(token) }),

  getTicket: async (id, token) => {
    try {
      return await api.getTicketById(id, token)
    } catch {
      return null
    }
  },

  /**
   * Load current user's bookings: local ticket IDs + GET /tickets/:id
   * (same approach as DICE mobile BookingsRepository)
   */
  getMyBookings: async (token) => {
    const { ticketStore } = await import('@/lib/ticketStore')
    const metas = ticketStore.load()
    if (!metas.length) return []

    const results = []
    for (const meta of metas) {
      const id = meta.ticket_id
      try {
        const detail = await api.getTicketById(id, token)
        if (detail.status === 'refunded' || detail.status === 'cancelled') {
          ticketStore.remove(id)
          continue
        }

        const primaryQr =
          Array.isArray(detail.qr_codes) && detail.qr_codes.length
            ? typeof detail.qr_codes[0] === 'string'
              ? detail.qr_codes[0]
              : detail.qr_codes[0]?.code
            : meta.qr_code

        const entryCode =
          detail.entry_code ||
          (Array.isArray(detail.qr_codes) &&
          detail.qr_codes[0] &&
          typeof detail.qr_codes[0] === 'object'
            ? detail.qr_codes[0].entry_code
            : null) ||
          meta.entry_code ||
          null

        const displayCode =
          entryCode
            ? String(entryCode).replace(/\D/g, '').padStart(8, '0').slice(-8)
            : primaryQr || `DC-${detail.id}`

        const eventDate =
          formatDateKey(detail.event_start_date) ||
          formatDateKey(meta.date)
        const start = formatTimeValue(detail.event_start_time, '09:00')
        const end = formatTimeValue(detail.event_end_time, '17:00')

        const booking = {
          id: detail.id,
          event_id: detail.event_id,
          event_title: detail.event_title || meta.event_title,
          quantity: detail.quantity || 1,
          total_price: detail.total_price,
          currency: detail.currency || 'XAF',
          status: detail.status,
          customer_name: detail.customer_name || meta.customer_name,
          customer_email: detail.customer_email,
          qr_codes: detail.qr_codes || [],
          qr_code: displayCode,
          entry_code: entryCode
            ? String(entryCode).replace(/\D/g, '').padStart(8, '0').slice(-8)
            : null,
          created_at: detail.created_at,
          event_start_date: eventDate || meta.date,
          event_end_date: detail.event_end_date,
          event_start_time: start,
          event_end_time: end,
          event_location: detail.event_location || meta.location,
          date: eventDate,
          start,
          end,
          location: detail.event_location || meta.location || '',
          title: detail.event_title || meta.event_title || 'Événement',
          ticketCode: displayCode,
        }

        ticketStore.upsert({
          ticket_id: detail.id,
          event_id: detail.event_id,
          event_title: booking.event_title,
          location: booking.location,
          date: booking.event_start_date,
          time: `${start} - ${end}`,
          customer_name: booking.customer_name,
          qr_code: displayCode,
          entry_code: booking.entry_code,
        })

        results.push(booking)
      } catch {
        // Offline / temporary API error — show cached meta
        const cachedDate = formatDateKey(meta.date)
        const cachedStart = formatTimeValue(
          meta.time?.split?.('-')?.[0]?.trim(),
          '09:00'
        )
        const cachedEnd = formatTimeValue(
          meta.time?.split?.('-')?.[1]?.trim(),
          '17:00'
        )
        results.push({
          id: meta.ticket_id,
          event_id: meta.event_id,
          event_title: meta.event_title || 'Événement',
          title: meta.event_title || 'Événement',
          quantity: 1,
          total_price: 0,
          currency: 'XAF',
          status: 'pending',
          customer_name: meta.customer_name,
          qr_codes: meta.qr_code ? [{ code: meta.qr_code, validated: false }] : [],
          qr_code: meta.qr_code,
          date: cachedDate,
          event_start_date: meta.date,
          start: cachedStart,
          end: cachedEnd,
          location: meta.location || '',
          event_location: meta.location || '',
          ticketCode: meta.qr_code || `DC-${meta.ticket_id}`,
        })
      }
    }
    return results
  },

  getUserTickets: async (token) => api.getMyBookings(token),

  /** Admin: full ticket list from GET /tickets */
  getTickets: async (token) => {
  try {
    const data = await request('/tickets', { headers: authHeaders(token) })
    return Array.isArray(data) ? data : data?.data || []
  } catch (error) {
    // Le swagger ne définit pas GET /api/tickets
    if (String(error.message).includes('404')) {
      return []
    }
    throw error
  }
},

  deleteTicket: async () => {
    throw new Error('La suppression de tickets n’est pas encore disponible sur le backend')
  },

  // ===== CERTIFICATES =====
  getMyCertificates: async (token) => {
    const data = await request('/certificates/me', {
      headers: authHeaders(token),
    })
    return Array.isArray(data) ? data : data?.data || []
  },

  getMyCertificate: async (code, token) =>
    request(`/certificates/me/${encodeURIComponent(code)}`, {
      headers: authHeaders(token),
    }),

  /** Opens authenticated PDF download for the signed-in user */
  downloadMyCertificatePdf: async (code, token) => {
    const response = await fetch(
      `${API_URL}/certificates/me/${encodeURIComponent(code)}/pdf`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (!response.ok) {
      const text = await response.text()
      let message = `Erreur ${response.status}`
      try {
        const json = JSON.parse(text)
        message = json.message || json.error || message
      } catch {
        /* ignore */
      }
      throw new Error(message)
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificat-${code}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  getMyCertificateHtml: async (code, token) => {
    const response = await fetch(
      `${API_URL}/certificates/me/${encodeURIComponent(code)}/html`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (!response.ok) {
      const text = await response.text()
      let message = `Erreur ${response.status}`
      try {
        const json = JSON.parse(text)
        message = json.message || json.error || message
      } catch {
        /* ignore */
      }
      throw new Error(message)
    }
    return response.text()
  },

  getCertificateHtmlUrl: (code, mine = true) =>
    mine
      ? `${API_URL}/certificates/me/${encodeURIComponent(code)}/html`
      : `${API_URL}/certificates/${encodeURIComponent(code)}/html`,

  /** Admin: participants éligibles + déjà délivrés pour une formation */
  getCertificateEligible: async (eventId, token) =>
    request(`/certificates/eligible?event_id=${encodeURIComponent(eventId)}`, {
      headers: authHeaders(token),
    }),

  /** Admin: délivrer des certificats (tous les tickets confirmés, ou ticket_ids) */
  issueCertificates: async ({ event_id, ticket_ids }, token) =>
    request('/certificates/issue', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        event_id: Number(event_id),
        ...(ticket_ids?.length ? { ticket_ids: ticket_ids.map(Number) } : {}),
      }),
    }),

  /** Admin: certificats déjà délivrés pour un événement */
  getCertificatesByEvent: async (eventId, token) => {
    const data = await request(
      `/certificates?event_id=${encodeURIComponent(eventId)}`,
      { headers: authHeaders(token) }
    )
    return Array.isArray(data) ? data : data?.data || []
  },

  // ===== NOTIFICATIONS =====
  getNotifications: async (token) =>
    request('/notifications', { headers: authHeaders(token) }),

  getUnreadNotificationsCount: async (token) =>
    request('/notifications/unread-count', { headers: authHeaders(token) }),

  markNotificationRead: async (id, token) =>
    request(`/notifications/${id}/read`, {
      method: 'POST',
      headers: authHeaders(token),
    }),

  markAllNotificationsRead: async (token) =>
    request('/notifications/read-all', {
      method: 'POST',
      headers: authHeaders(token),
    }),

  syncNotifications: async (token) =>
    request('/notifications/sync', {
      method: 'POST',
      headers: authHeaders(token),
    }),

  // ===== PAYMENTS =====
  initiatePayment: async (data, token) => {
    const ticketId = Number(data.ticketId ?? data.ticket_id)
    const phone = String(
      data.phone || data.telephone || data.customer_phone || ''
    ).trim() || '+237000000000'
    const method = data.method === 'orange_money' ? 'orange_money' : 'mtn_momo'

    if (!ticketId || Number.isNaN(ticketId)) {
      throw new Error('Ticket introuvable pour le paiement')
    }

    return request('/payments/initiate', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        ticket_id: ticketId,
        method,
        phone,
      }),
    })
  },

  getPaymentStatus: async (id, token) =>
    request(`/payments/${id}/status`, { headers: authHeaders(token) }),

  /** Dev/demo: complete a pending MTN payment via provider callback */
  confirmMtnPayment: async (data) => {
    const reference = data.reference || data.payment_reference
    if (!reference) {
      throw new Error('Référence de paiement manquante')
    }
    return request('/payments/callback/mtn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference,
        status: data.status || 'successful',
        transaction_id: data.transaction_id || `TXN-${Date.now()}`,
      }),
    })
  },

  // ===== VALIDATION =====
  validateTicket: async (qrCode, token) =>
    request('/validation/scan', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ qr_code: qrCode }),
    }),

  // ===== USERS =====
  getUsers: async (token) => {
    const data = await request('/users', { headers: authHeaders(token) })
    return Array.isArray(data) ? data : data?.data || []
  },

  createAdmin: async (data, token) =>
    request('/users/admins', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        telephone: data.telephone,
        sexe: data.sexe,
        ...(data.picture ? { picture: data.picture } : {}),
      }),
    }),

  getDashboardStats: async (token) =>
    request('/users/dashboard', { headers: authHeaders(token) }),

  // ===== STATS =====
  getStats: async (token) => {
    try {
      try {
        return await api.getDashboardStats(token)
      } catch {
        /* fall through */
      }

      const [events, users] = await Promise.all([
        api.getEvents(token).catch(() => []),
        api.getUsers(token).catch(() => []),
      ])

      const eventList = Array.isArray(events) ? events : events?.data || []
      const userList = Array.isArray(users) ? users : users?.data || []

      const categories = eventList.reduce((acc, event) => {
        const cat = event.category || 'autre'
        acc[cat] = (acc[cat] || 0) + 1
        return acc
      }, {})

      const totalEvents = eventList.length
      const categoriesData = Object.entries(categories).map(([name, count]) => ({
        name,
        count,
        percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0,
      }))

      return {
        totalEvents,
        totalUsers: userList.length,
        totalRevenue: eventList.reduce((sum, e) => sum + (Number(e.price) || 0), 0),
        totalTickets: 0,
        eventsByMonth: [],
        revenueByMonth: [],
        categories: categoriesData,
        usersByMonth: [],
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
        usersByMonth: [],
      }
    }
  },
}
