// Données centralisées - Utilisées par toutes les routes API
let events = [
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

// Fonctions pour manipuler les données
export const dataStore = {
  getEvents: () => {
    return events
  },
  
  getPublishedEvents: () => {
    return events.filter(e => e.status === 'published')
  },
  
  getEventById: (id) => {
    return events.find(e => e.id === parseInt(id))
  },
  
  createEvent: (eventData) => {
    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      ...eventData,
      status: 'published',
      available_tickets: eventData.capacity || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    events.push(newEvent)
    console.log('Événement créé:', newEvent)
    console.log('Total événements:', events.length)
    return newEvent
  },
  
  updateEvent: (id, eventData) => {
    const index = events.findIndex(e => e.id === parseInt(id))
    if (index === -1) return null
    
    // Ne pas écraser l'ID et les dates de création
    const { id: _, created_at, ...updatableData } = eventData
    
    events[index] = {
      ...events[index],
      ...updatableData,
      updated_at: new Date().toISOString()
    }
    console.log('Événement mis à jour:', events[index])
    return events[index]
  },
  
  deleteEvent: (id) => {
    const index = events.findIndex(e => e.id === parseInt(id))
    if (index === -1) return false
    events.splice(index, 1)
    console.log('Événement supprimé, reste:', events.length)
    return true
  },
  
  resetEvents: () => {
    events = []
  }
}

export default dataStore