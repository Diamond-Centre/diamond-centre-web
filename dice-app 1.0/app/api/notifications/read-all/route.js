import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
import { mockNotifications } from '@/lib/mockData'

export async function PUT() {
  try {
    // await prisma.notification.updateMany({
    //   data: { read: true },
    // })

    mockNotifications.forEach((n, i) => {
      mockNotifications[i] = { ...n, read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur marquage notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors du marquage des notifications' },
      { status: 500 }
    )
  }
}
