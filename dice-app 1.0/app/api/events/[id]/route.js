import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        tickets: {
          select: {
            id: true,
            status: true,
            pricePaid: true,
            datePurchase: true,
          },
        },
      },
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
      { error: 'Erreur lors du chargement de l\'événement' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        image: body.image,
        price: body.price ? parseFloat(body.price) : undefined,
        promotion: body.promotion,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        date: body.date ? new Date(body.date) : undefined,
        duration: body.duration ? parseInt(body.duration) : undefined,
        location: body.location,
        instructor: body.instructor,
        totalSeats: body.totalSeats ? parseInt(body.totalSeats) : undefined,
        availableSeats: body.availableSeats ? parseInt(body.availableSeats) : undefined,
        status: body.status,
      },
    })
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Erreur PUT event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'événement' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ message: 'Événement supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'événement' },
      { status: 500 }
    )
  }
}