import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockEvents, mockTickets } from '@/lib/mockData'

export async function GET(request, { params }) {
  try {
    // const ticket = await prisma.ticket.findUnique({
    //   where: { id: params.id },
    //   include: { event: true, user: { select: { ... } } },
    // })

    const ticket = mockTickets.find((t) => t.id === params.id)

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Erreur GET ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement du ticket' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json()
    const index = mockTickets.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    // const ticket = await prisma.ticket.update({
    //   where: { id: params.id },
    //   data: { status },
    // })

    mockTickets[index] = { ...mockTickets[index], status }

    return NextResponse.json(mockTickets[index])
  } catch (error) {
    console.error('Erreur PUT ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const index = mockTickets.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    const ticket = mockTickets[index]

    // if (ticket.status === 'pending' || ticket.status === 'validated') {
    //   await prisma.event.update({ ... })
    // }
    // await prisma.ticket.delete({ where: { id: params.id } })

    if (ticket.status === 'pending' || ticket.status === 'validated') {
      const event = mockEvents.find((e) => e.id === ticket.eventId)
      if (event) event.availableSeats += 1
    }

    mockTickets.splice(index, 1)

    return NextResponse.json({ message: 'Ticket supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du ticket' },
      { status: 500 }
    )
  }
}
