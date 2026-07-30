/**
 * Dashboard Utilisateur - Épuré sans certificats
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaTicketAlt, FaCalendarCheck, 
  FaDownload, FaEye
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({
    totalTickets: 0,
    upcoming: 0,
    completed: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      router.push('/auth/login')
      return
    }
    
    try {
      setUser(JSON.parse(storedUser))
    } catch (e) {
      router.push('/auth/login')
      return
    }
    
    loadDashboardData(token)
  }, [router])

  const loadDashboardData = async (token) => {
    try {
      setLoading(true)
      
      // Charger les tickets
      const response = await fetch(`${API_URL}/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTickets(data || [])
        
        const upcoming = data.filter(t => t.status === 'pending' || t.status === 'paid').length
        const completed = data.filter(t => t.status === 'validated' || t.status === 'completed').length
        
        setStats({
          totalTickets: data.length || 0,
          upcoming: upcoming,
          completed: completed
        })
      }
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  const displayName = user?.name || 'Utilisateur'

  // Données pour le graphique
  const monthlyData = [
    { month: 'Jan', tickets: 2 },
    { month: 'Fév', tickets: 3 },
    { month: 'Mar', tickets: 1 },
    { month: 'Avr', tickets: 4 },
    { month: 'Mai', tickets: 2 },
    { month: 'Jun', tickets: 5 },
    { month: 'Jul', tickets: 3 },
    { month: 'Aou', tickets: 6 },
    { month: 'Sep', tickets: 4 },
    { month: 'Oct', tickets: 2 },
    { month: 'Nov', tickets: 3 },
    { month: 'Déc', tickets: 1 }
  ]

  const maxTickets = Math.max(...monthlyData.map(d => d.tickets))

  return (
    <div className="p-6 md:p-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tableau de bord
          </h1>
          <p className="text-gray-500">
            Bienvenue, {displayName} 👋
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets</p>
              <p className="text-2xl font-bold text-dice-blue">{stats.totalTickets}</p>
            </div>
            <div className="w-10 h-10 bg-dice-blue/10 rounded-lg flex items-center justify-center">
              <FaTicketAlt className="text-dice-blue" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">À venir</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FaCalendarCheck className="text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Terminés</p>
              <p className="text-2xl font-bold text-orange-500">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <FaCalendarCheck className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique Tickets par mois */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tickets par mois</h3>
          <span className="text-sm text-gray-400">{stats.totalTickets} tickets</span>
        </div>
        <div className="h-64">
          <div className="flex h-full items-end gap-1 md:gap-2">
            {monthlyData.map((data, index) => {
              const height = maxTickets > 0 ? (data.tickets / maxTickets) * 80 : 0
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      backgroundColor: data.tickets > 0 ? '#0a89f2' : '#e5e7eb',
                      minHeight: '4px'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.tickets} tickets
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tickets récents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tickets récents</h3>
          <Link href="/dashboard/tickets" className="text-sm text-dice-blue hover:underline flex items-center gap-1">
            Voir tous →
          </Link>
        </div>
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎫</div>
            <p>Vous n'avez pas encore de tickets</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dice-blue/10 rounded-lg flex items-center justify-center">
                    <FaTicketAlt className="text-dice-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {ticket.event_title || 'Événement'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    ticket.status === 'paid' || ticket.status === 'validated' 
                      ? 'bg-green-100 text-green-700' 
                      : ticket.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status === 'paid' ? 'Payé' : 
                     ticket.status === 'validated' ? 'Validé' :
                     ticket.status === 'pending' ? 'En attente' : 
                     ticket.status || 'Inconnu'}
                  </span>
                  <span className="text-sm font-semibold text-dice-blue">
                    {ticket.total_price?.toLocaleString() || 0} FCFA
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}