import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getAuthCookie } from '@/lib/auth'

// GET - Liste des événements
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming')

    const where = {}
    
    if (category) where.category = category
    if (status) where.status = status
    
    // Événements à venir
    if (upcoming === 'true') {
      where.startDate = { gte: new Date() }
      where.status = 'published'
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        promotion: true
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Erreur GET events:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}

// POST - Créer un événement
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const token = getAuthCookie()
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      currency = 'XAF',
      start_date,
      end_date,
      location,
      category,
      capacity,
      image_url,
      promotion
    } = body

    // Validation
    if (!title || !start_date || !end_date || !location || !category || !capacity) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Créer l'événement avec statut "published"
    const event = await prisma.event.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        currency,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        location,
        category,
        capacity: parseInt(capacity),
        availableTickets: parseInt(capacity),
        imageUrl: image_url,
        status: 'published' // Toujours publié lors de la création
      }
    })

    // Créer la promotion si elle existe
    let promotionData = null
    if (promotion && promotion.nombre > 0 && promotion.pourcentage > 0) {
      const prixPromo = parseFloat(price) * (1 - promotion.pourcentage / 100)
      
      promotionData = await prisma.promotion.create({
        data: {
          eventId: event.id,
          nombre: parseInt(promotion.nombre),
          sexe: promotion.sexe || 'tous',
          pourcentage: parseFloat(promotion.pourcentage),
          prixPromo: prixPromo,
          duree: parseInt(promotion.duree) || 7,
          description: promotion.description
        }
      })
    }

    return NextResponse.json({
      ...event,
      promotion: promotionData
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    )
  }
}