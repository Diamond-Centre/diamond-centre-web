import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
      },
    })
    
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
    
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: { status },
    })
    
    return NextResponse.json(ticket)
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
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { event: true },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      )
    }

    // Si le ticket est annulé, remettre une place disponible
    if (ticket.status === 'pending' || ticket.status === 'validated') {
      await prisma.event.update({
        where: { id: ticket.eventId },
        data: {
          availableSeats: ticket.event.availableSeats + 1,
        },
      })
    }

    await prisma.ticket.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: 'Ticket supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du ticket' },
      { status: 500 }
    )
  }
}