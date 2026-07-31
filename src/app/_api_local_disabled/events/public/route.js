import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Appeler le backend pour récupérer les événements publics
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/public`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des événements')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}