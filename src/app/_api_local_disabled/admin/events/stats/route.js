/**
 * API Admin Statistiques
 * GET /api/admin/events/stats
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-here'

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer tous les événements avec Prisma
    const events = await prisma.event.findMany({
      include: {
        promotion: true
      }
    })

    // Statistiques
    const totalEvents = events.length
    const publishedEvents = events.filter(e => e.status === 'published').length
    const draftEvents = events.filter(e => e.status === 'draft').length
    
    // Revenus
    const totalRevenue = events.reduce((acc, e) => acc + (e.price || 0), 0)

    // Événements par mois
    const eventsByMonth = {}
    events.forEach(e => {
      if (e.start_date) {
        const month = new Date(e.start_date).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
        eventsByMonth[month] = (eventsByMonth[month] || 0) + 1
      }
    })

    // Revenus par mois
    const revenueByMonth = {}
    events.forEach(e => {
      if (e.start_date && e.price) {
        const month = new Date(e.start_date).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
        revenueByMonth[month] = (revenueByMonth[month] || 0) + e.price
      }
    })

    // Catégories
    const categories = {}
    events.forEach(e => {
      if (e.category) {
        categories[e.category] = (categories[e.category] || 0) + 1
      }
    })

    // Utilisateurs (simulé - à adapter selon votre modèle User)
    // Si vous avez un modèle User, remplacez par prisma.user.count()
    const usersCount = 0 // À remplacer par le vrai compteur

    return NextResponse.json({
      total: totalEvents,
      published: publishedEvents,
      draft: draftEvents,
      revenue: totalRevenue,
      users: usersCount,
      eventsByMonth,
      revenueByMonth,
      categories
    })

  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    )
  }
}