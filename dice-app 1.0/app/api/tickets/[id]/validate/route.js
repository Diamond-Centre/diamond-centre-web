import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockTickets } from '@/lib/mockData'

export async function PUT(request, { params }) {
  try {
    // const ticket = await prisma.ticket.update({
    //   where: { id: params.id },
    //   data: { status: 'validated' },
    //   include: { event: true, user: { select: { ... } } },
    // })

    const index = mockTickets.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    mockTickets[index] = { ...mockTickets[index], status: 'validated' }

    return NextResponse.json(mockTickets[index])
  } catch (error) {
    console.error('Erreur validation ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation du ticket' },
      { status: 500 }
    )
  }
}
