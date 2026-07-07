import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockEvents } from '@/lib/mockData'

export async function GET() {
  try {
    // const events = await prisma.event.findMany({
    //   orderBy: { date: 'asc' },
    // })
    const events = [...mockEvents].sort((a, b) => new Date(a.date) - new Date(b.date))
    return NextResponse.json(events)
  } catch (error) {
    console.error('Erreur GET events:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des événements' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const requiredFields = ['title', 'description', 'type', 'price', 'date', 'duration', 'location', 'instructor', 'totalSeats']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        )
      }
    }

    // const event = await prisma.event.create({
    //   data: {
    //     title: body.title,
    //     description: body.description,
    //     type: body.type,
    //     image: body.image || '/images/events/placeholder.jpg',
    //     price: parseFloat(body.price),
    //     promotion: body.promotion || false,
    //     originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
    //     date: new Date(body.date),
    //     duration: parseInt(body.duration),
    //     location: body.location,
    //     instructor: body.instructor,
    //     totalSeats: parseInt(body.totalSeats),
    //     availableSeats: parseInt(body.totalSeats),
    //     status: body.status || 'upcoming',
    //   },
    // })

    const event = {
      id: `event-${Date.now()}`,
      title: body.title,
      description: body.description,
      type: body.type,
      image: body.image || '/images/events/placeholder.jpg',
      price: parseFloat(body.price),
      promotion: body.promotion || false,
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      date: new Date(body.date).toISOString(),
      duration: parseInt(body.duration),
      location: body.location,
      instructor: body.instructor,
      totalSeats: parseInt(body.totalSeats),
      availableSeats: parseInt(body.totalSeats),
      status: body.status || 'upcoming',
      tickets: [],
    }
    mockEvents.push(event)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Erreur POST event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    )
  }
}
