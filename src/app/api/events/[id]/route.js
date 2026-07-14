import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockEvents } from '@/lib/mockData'

export async function GET(request, { params }) {
  try {
    // const event = await prisma.event.findUnique({
    //   where: { id: params.id },
    //   include: {
    //     tickets: {
    //       select: {
    //         id: true,
    //         status: true,
    //         pricePaid: true,
    //         datePurchase: true,
    //       },
    //     },
    //   },
    // })

    const event = mockEvents.find((e) => e.id === params.id)

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
    const index = mockEvents.findIndex((e) => e.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // const event = await prisma.event.update({
    //   where: { id: params.id },
    //   data: { ... },
    // })

    const updated = {
      ...mockEvents[index],
      title: body.title ?? mockEvents[index].title,
      description: body.description ?? mockEvents[index].description,
      type: body.type ?? mockEvents[index].type,
      image: body.image ?? mockEvents[index].image,
      price: body.price ? parseFloat(body.price) : mockEvents[index].price,
      promotion: body.promotion ?? mockEvents[index].promotion,
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : mockEvents[index].originalPrice,
      date: body.date ? new Date(body.date).toISOString() : mockEvents[index].date,
      duration: body.duration ? parseInt(body.duration) : mockEvents[index].duration,
      location: body.location ?? mockEvents[index].location,
      instructor: body.instructor ?? mockEvents[index].instructor,
      totalSeats: body.totalSeats ? parseInt(body.totalSeats) : mockEvents[index].totalSeats,
      availableSeats: body.availableSeats ? parseInt(body.availableSeats) : mockEvents[index].availableSeats,
      status: body.status ?? mockEvents[index].status,
    }
    mockEvents[index] = updated

    return NextResponse.json(updated)
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
    // await prisma.event.delete({
    //   where: { id: params.id },
    // })

    const index = mockEvents.findIndex((e) => e.id === params.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }
    mockEvents.splice(index, 1)

    return NextResponse.json({ message: 'Événement supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'événement' },
      { status: 500 }
    )
  }
}
