'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useEvents'
import { useTickets } from '@/hooks/useTickets'
import Link from 'next/link'
import { FaUsers, FaCalendar, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { events } = useEvents()
  const { tickets } = useTickets()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login')
    }
  }, [isAuthenticated, user])

  const stats = [
    { label: 'Utilisateurs', value: '152', icon: FaUsers, color: 'bg-blue-500' },
    { label: 'Formations', value: events.length, icon: FaCalendar, color: 'bg-green-500' },
    { label: 'Tickets vendus', value: tickets.length, icon: FaTicketAlt, color: 'bg-purple-500' },
    { label: 'Revenus', value: `${tickets.reduce((sum, t) => sum + t.price, 0)} €`, icon: FaMoneyBillWave, color: 'bg-yellow-500' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gestion rapide</h2>
          <div className="space-y-3">
            <Link href="/dashboard/users" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              👥 Gérer les utilisateurs
            </Link>
            <Link href="/events/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              ➕ Créer une formation
            </Link>
            <Link href="/dashboard/tickets" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              🎫 Valider les tickets
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{event.title}</span>
                <span className="text-xs text-gray-500">{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}