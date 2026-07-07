import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { generateTicketCode } from '@/lib/validators'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const where = userId ? { userId } : {}
    
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        event: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
      orderBy: { datePurchase: 'desc' },
    })
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Erreur GET tickets:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, eventId } = await request.json()

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: 'userId et eventId sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'événement existe et a des places disponibles
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    if (event.availableSeats <= 0) {
      return NextResponse.json(
        { error: 'Plus de places disponibles' },
        { status: 400 }
      )
    }

    // Générer le code unique du ticket
    let code = generateTicketCode()
    let codeExists = true
    
    // S'assurer que le code est unique
    while (codeExists) {
      const existing = await prisma.ticket.findUnique({
        where: { code },
      })
      if (!existing) {
        codeExists = false
      } else {
        code = generateTicketCode()
      }
    }

    // Créer le ticket
    const ticket = await prisma.ticket.create({
      data: {
        code,
        userId,
        eventId,
        pricePaid: event.price,
        status: 'pending',
      },
    })

    // Mettre à jour les places disponibles
    await prisma.event.update({
      where: { id: eventId },
      data: {
        availableSeats: event.availableSeats - 1,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Erreur POST ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du ticket' },
      { status: 500 }
    )
  }
}