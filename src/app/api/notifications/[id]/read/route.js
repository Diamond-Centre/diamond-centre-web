import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockNotifications } from '@/lib/mockData'

export async function PUT(request, { params }) {
  try {
    // await prisma.notification.update({
    //   where: { id: params.id },
    //   data: { read: true },
    // })

    const index = mockNotifications.findIndex((n) => n.id === params.id)
    if (index !== -1) {
      mockNotifications[index] = { ...mockNotifications[index], read: true }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur marquage notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors du marquage de la notification' },
      { status: 500 }
    )
  }
}
