/**
 * Service de stockage local pour les événements
 * Persiste les données même après rechargement de la page
 */

const STORAGE_KEY = 'diamond_centre_events'

// Événements par défaut
const defaultEvents = [
  {
    id: 1,
    title: 'Conférence IA',
    description: 'Une conférence sur l\'intelligence artificielle',
    price: 5000,
    currency: 'XAF',
    date: '2026-10-10',
    time: '14:00',
    location: 'Yaoundé',
    category: 'conference',
    capacity: 200,
    available_tickets: 150,
    image_url: '/images/events/conference-ia.jpg',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Séminaire Leadership',
    description: 'Développez vos compétences en leadership',
    price: 7500,
    currency: 'XAF',
    date: '2026-11-15',
    time: '09:00',
    location: 'Douala',
    category: 'seminaire',
    capacity: 100,
    available_tickets: 80,
    image_url: '/images/events/seminaire-leadership.jpg',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Initialiser le stockage si vide
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents))
  }
}

export const localStorageStore = {
  // Récupérer tous les événements
  getEvents: () => {
    if (typeof window === 'undefined') return defaultEvents
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : defaultEvents
    } catch (error) {
      console.error('Erreur lecture localStorage:', error)
      return defaultEvents
    }
  },

  // Récupérer les événements publiés
  getPublishedEvents: () => {
    const events = localStorageStore.getEvents()
    return events.filter(e => e.status === 'published')
  },

  // Récupérer un événement par ID
  getEventById: (id) => {
    const events = localStorageStore.getEvents()
    return events.find(e => e.id === parseInt(id))
  },

  // Créer un nouvel événement
  createEvent: (eventData) => {
    const events = localStorageStore.getEvents()
    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      ...eventData,
      status: 'published',
      available_tickets: eventData.capacity || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    events.push(newEvent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    console.log('Événement créé et sauvegardé:', newEvent)
    return newEvent
  },

  // Mettre à jour un événement
  updateEvent: (id, eventData) => {
    const events = localStorageStore.getEvents()
    const index = events.findIndex(e => e.id === parseInt(id))
    if (index === -1) return null
    events[index] = {
      ...events[index],
      ...eventData,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    return events[index]
  },

  // Supprimer un événement
  deleteEvent: (id) => {
    const events = localStorageStore.getEvents()
    const index = events.findIndex(e => e.id === parseInt(id))
    if (index === -1) return false
    events.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    console.log('Événement supprimé:', id)
    return true
  },

  // Réinitialiser les événements
  resetEvents: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents))
    return defaultEvents
  }
}

export default localStorageStore