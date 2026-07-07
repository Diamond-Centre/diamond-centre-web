import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { generateTicketCode } from '@/lib/validators'
import { mockEvents, mockTickets } from '@/lib/mockData'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // const where = userId ? { userId } : {}
    // const tickets = await prisma.ticket.findMany({
    //   where,
    //   include: { event: true, user: { select: { ... } } },
    //   orderBy: { datePurchase: 'desc' },
    // })

    const tickets = mockTickets
      .filter((t) => !userId || t.userId === userId)
      .sort((a, b) => new Date(b.datePurchase) - new Date(a.datePurchase))

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

    // const event = await prisma.event.findUnique({ where: { id: eventId } })
    const event = mockEvents.find((e) => e.id === eventId)

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

    // let code = generateTicketCode()
    // while (await prisma.ticket.findUnique({ where: { code } })) {
    //   code = generateTicketCode()
    // }
    //
    // const ticket = await prisma.ticket.create({ ... })
    // await prisma.event.update({ ... })

    const ticket = {
      id: `ticket-${Date.now()}`,
      code: generateTicketCode(),
      userId,
      eventId,
      pricePaid: event.price,
      status: 'pending',
      datePurchase: new Date().toISOString(),
      event,
      user: { id: userId, nom: 'Utilisateur', prenom: 'Test', email: 'user@dice.com' },
    }

    event.availableSeats -= 1
    mockTickets.push(ticket)

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Erreur POST ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du ticket' },
      { status: 500 }
    )
  }
}
