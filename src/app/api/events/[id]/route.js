import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getAuthCookie } from '@/lib/auth'

// GET - Détail d'un événement
export async function GET(request, { params }) {
  try {
    const { id } = params

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        promotion: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Erreur GET event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'événement' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un événement
export async function PUT(request, { params }) {
  try {
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

    const { id } = params
    const body = await request.json()

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        currency: body.currency,
        startDate: new Date(body.start_date),
        endDate: new Date(body.end_date),
        location: body.location,
        category: body.category,
        capacity: parseInt(body.capacity),
        imageUrl: body.image_url,
        status: body.status || 'published'
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Erreur PUT event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un événement
export async function DELETE(request, { params }) {
  try {
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

    const { id } = params

    await prisma.event.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Événement supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}