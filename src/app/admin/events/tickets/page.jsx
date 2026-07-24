/**
 * Gestion des tickets - Admin
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

export default function AdminTickets() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }
    setTimeout(() => setLoading(false), 1000)
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Tickets</h1>
      <p className="text-gray-500 mb-6">Gérez les réservations de tickets</p>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-6xl mb-4">🎫</div>
        <p className="text-gray-500">Aucune réservation pour le moment</p>
      </div>
    </div>
  )
}