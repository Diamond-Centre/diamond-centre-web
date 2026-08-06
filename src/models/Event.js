import { mockUsers } from './User'

export const EventTypes = {
  CONFERENCE: 'conference',
  SEMINAIRE: 'seminaire',
  FORMATION: 'formation',
  ATELIER: 'atelier'
}

export const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
}

export const mockEvents = [
  {
    id: 1,
    title: 'Conférence sur l\'IA',
    description: 'Une conférence sur les avancées de l\'intelligence artificielle',
    price: 5000,
    currency: 'XAF',
    start_date: '2026-10-10',
    end_date: '2026-10-12',
    location: 'Yaoundé',
    category: EventTypes.CONFERENCE,
    capacity: 200,
    available_tickets: 150,
    image_url: '/images/events/conference-ia.jpg',
    status: EventStatus.PUBLISHED,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Séminaire Entrepreneuriat',
    description: 'Séminaire sur la création d\'entreprise',
    price: 3000,
    currency: 'XAF',
    start_date: '2026-11-05',
    end_date: '2026-11-06',
    location: 'Douala',
    category: EventTypes.SEMINAIRE,
    capacity: 100,
    available_tickets: 80,
    image_url: '/images/events/seminaire-entrepreneuriat.jpg',
    status: EventStatus.PUBLISHED,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const EventModel = {
  findAll: () => mockEvents,
  findById: (id) => mockEvents.find(e => e.id === id),
  findByCategory: (category) => mockEvents.filter(e => e.category === category),
  findByStatus: (status) => mockEvents.filter(e => e.status === status),
  create: (data) => {
    const newEvent = {
      id: mockEvents.length + 1,
      ...data,
      status: EventStatus.PUBLISHED, // Auto-publié en base
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockEvents.push(newEvent)
    return newEvent
  },
  update: (id, data) => {
    const index = mockEvents.findIndex(e => e.id === id)
    if (index === -1) return null
    mockEvents[index] = { ...mockEvents[index], ...data, updated_at: new Date().toISOString() }
    return mockEvents[index]
  },
  delete: (id) => {
    const index = mockEvents.findIndex(e => e.id === id)
    if (index === -1) return false
    mockEvents.splice(index, 1)
    return true
  }
}