import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockNotifications } from '@/lib/mockData'

export async function GET() {
  try {
    // const notifications = await prisma.notification.findMany({ ... })
    return NextResponse.json(mockNotifications)
  } catch (error) {
    console.error('Erreur GET notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des notifications' },
      { status: 500 }
    )
  }
}
