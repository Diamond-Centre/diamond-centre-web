import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise-ici'

export async function GET(request) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas de token dans le header')
      return NextResponse.json(
        { error: 'Non authentifié - Token manquant' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      console.log('❌ Token invalide:', error.message)
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    console.log('✅ Token valide pour:', decoded.email)

    // Vérifier le rôle admin
    if (decoded.role !== 'admin') {
      console.log('❌ Rôle non autorisé:', decoded.role)
      return NextResponse.json(
        { error: 'Accès non autorisé - Admin requis' },
        { status: 403 }
      )
    }

    // Récupérer les statistiques
    const [totalEvents, totalUsers] = await Promise.all([
      prisma.event.count(),
      prisma.user.count()
    ])

    const eventsByCategory = await prisma.$queryRaw`
      SELECT 
        category,
        COUNT(*) as count
      FROM events
      GROUP BY category
    `

    const recentTickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      totalEvents,
      totalUsers,
      eventsByCategory: eventsByCategory || [],
      recentTickets: recentTickets || [],
      monthlyRevenue: [],
      usersByMonth: [],
      eventsByMonth: []
    })
  } catch (error) {
    console.error('❌ Erreur dashboard stats:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message 
      },
      { status: 500 }
    )
  }
}