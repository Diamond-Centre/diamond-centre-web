import { NextResponse } from 'next/server'
import { dataStore } from '@/lib/data'

export async function GET() {
  const events = dataStore.getEvents()
  return NextResponse.json({
    total: events.length,
    events: events.map(e => ({
      id: e.id,
      title: e.title,
      status: e.status
    }))
  })
}