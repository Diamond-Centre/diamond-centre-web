/**
 * Dashboard Admin - Graphiques et statistiques
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaPlus, FaSignOutAlt, FaDiamond, FaHome,
  FaCalendar, FaTicketAlt, FaUsers
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import StatsCards from '@/components/admin/StatsCards'
import RevenueChart from '@/components/admin/RevenueChart'
import EventsChart from '@/components/admin/EventsChart'
import CategoryChart from '@/components/admin/CategoryChart'
import UsersChart from '@/components/admin/UsersChart'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    
    setUser(storedUser)
    loadStats(token)
  }, [])

  const loadStats = async (token) => {
    try {
      // Récupérer les stats depuis l'API
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    auth.logout()
    window.location.href = '/auth/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Admin */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-dice-blue to-purple-600 rounded-xl flex items-center justify-center">
              <FaDiamond className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Bienvenue, {user?.name || 'Admin'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir le site">
                <FaHome className="text-gray-600" />
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="text-sm font-medium hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <StatsCards stats={stats} />

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/events/create">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dice-blue/10 rounded-xl flex items-center justify-center group-hover:bg-dice-blue/20 transition-colors">
                  <FaPlus className="text-dice-blue text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Créer un événement</h3>
                  <p className="text-sm text-gray-500">Ajouter un nouvel événement</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/events">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dice-blue/10 rounded-xl flex items-center justify-center group-hover:bg-dice-blue/20 transition-colors">
                  <FaCalendar className="text-dice-blue text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Gérer les événements</h3>
                  <p className="text-sm text-gray-500">Voir et modifier vos événements</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/tickets">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dice-blue/10 rounded-xl flex items-center justify-center group-hover:bg-dice-blue/20 transition-colors">
                  <FaTicketAlt className="text-dice-blue text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Tickets</h3>
                  <p className="text-sm text-gray-500">Gérer les réservations</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RevenueChart data={stats?.revenueByMonth || []} />
          <EventsChart data={stats?.eventsByMonth || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CategoryChart data={stats?.categories || []} />
          <UsersChart data={stats?.usersByMonth || []} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
          <p>© 2026 Diamond Centre. Tous droits réservés.</p>
        </div>
      </main>
    </div>
  )
}