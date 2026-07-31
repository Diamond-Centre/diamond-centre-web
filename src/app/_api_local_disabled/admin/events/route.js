/**
 * API Admin Événements
 */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { EventModel } from '@/models/Event'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-here'

async function verifyAdmin() {
  const token = cookies().get('admin_token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch {
    return null
  }
}

// GET - Récupérer tous les événements (admin)
export async function GET(request) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const events = await EventModel.findAll()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Erreur GET admin events:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// POST - Créer un événement (admin)
export async function POST(request) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validation des champs requis
    const required = ['title', 'description', 'price', 'start_date', 'location', 'category', 'capacity']
    const missing = required.filter(field => !body[field])
    
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Champs manquants: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Créer l'événement - statut automatiquement "published"
    const newEvent = await EventModel.create(body)
    
    return NextResponse.json(newEvent, { status: 201 })
    
  } catch (error) {
    console.error('Erreur POST admin events:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}