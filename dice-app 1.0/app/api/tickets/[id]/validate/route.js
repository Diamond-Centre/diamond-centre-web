import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request, { params }) {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: { status: 'validated' },
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
    })
    
    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Erreur validation ticket:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation du ticket' },
      { status: 500 }
    )
  }
}