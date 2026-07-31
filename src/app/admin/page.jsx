/**
 * Dashboard Admin - Synchronisé avec les événements réels
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { api } from '@/lib/api'
import { 
  FaCalendar, FaUsers, FaTicketAlt, FaChartLine,
  FaPlus, FaEye, FaEdit, FaTrash, FaDollarSign,
  FaArrowUp, FaArrowDown, FaMinus, FaSync,
  FaSpinner, FaTag, FaClock, FaMoneyBillWave
} from 'react-icons/fa'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart, Cell
} from 'recharts'

const COLORS = ['#0a89f2', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'super_admin')) {
      router.push('/auth/login')
      return
    }
    
    setUser(storedUser)
    loadDashboardData(token)
  }, [router])

  const loadDashboardData = async (token) => {
    try {
      setLoading(true)
      setError(null)

      const [eventsRaw, usersRaw, dashboardRaw] = await Promise.all([
        api.getEvents(token).catch(() => []),
        api.getUsers(token).catch((err) => {
          console.warn('Impossible de charger les utilisateurs:', err)
          return []
        }),
        api.getDashboardStats(token).catch(() => null),
      ])

      const eventsData = Array.isArray(eventsRaw) ? eventsRaw : eventsRaw?.data || []
      const usersData = Array.isArray(usersRaw) ? usersRaw : usersRaw?.data || []

      setEvents(eventsData)
      setUsers(usersData)
      setStats(calculateStats(eventsData, usersData, dashboardRaw))
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      setError(error.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const buildLast12Months = () => {
    const now = new Date()
    const buckets = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString('fr-FR', { month: 'short' }),
        count: 0,
        revenue: 0,
      })
    }
    return buckets
  }

  const monthKeyFromDate = (value) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return `${d.getFullYear()}-${d.getMonth()}`
  }

  const soldTicketsForEvent = (event) => {
    const capacity = Number(event.capacity) || 0
    const available = Number(event.available_tickets)
    if (capacity <= 0 || Number.isNaN(available)) return 0
    return Math.max(0, capacity - available)
  }

  const calculateStats = (eventsList, usersList, dashboard = null) => {
    const eventsByMonth = buildLast12Months()
    const revenueByMonth = buildLast12Months()
    const usersByMonth = buildLast12Months()
    const eventIndex = Object.fromEntries(eventsByMonth.map((b, i) => [b.key, i]))
    const revenueIndex = Object.fromEntries(revenueByMonth.map((b, i) => [b.key, i]))
    const userIndex = Object.fromEntries(usersByMonth.map((b, i) => [b.key, i]))

    let totalRevenue = 0
    let soldTickets = 0

    eventsList.forEach((event) => {
      const price = Number(event.price) || 0
      const sold = soldTicketsForEvent(event)
      const eventRevenue = sold * price
      totalRevenue += eventRevenue
      soldTickets += sold

      const startKey = monthKeyFromDate(event.start_date)
      if (startKey != null && eventIndex[startKey] != null) {
        eventsByMonth[eventIndex[startKey]].count += 1
      }

      // Revenus estimés : billets vendus, rattachés au mois de début de l'événement
      if (startKey != null && revenueIndex[startKey] != null) {
        revenueByMonth[revenueIndex[startKey]].revenue += eventRevenue
      }
    })

    usersList.forEach((u) => {
      const key = monthKeyFromDate(u.created_at)
      if (key != null && userIndex[key] != null) {
        usersByMonth[userIndex[key]].count += 1
      }
    })

    const totalEvents = dashboard?.events?.total ?? eventsList.length
    const totalUsers = dashboard?.users?.total ?? usersList.length
    const publishedEvents = dashboard?.events?.published
      ?? eventsList.filter((e) => e.status === 'published').length
    const draftEvents = dashboard?.events?.draft
      ?? eventsList.filter((e) => e.status === 'draft').length
    const cancelledEvents = dashboard?.events?.cancelled
      ?? eventsList.filter((e) => e.status === 'cancelled').length
    const totalTickets = dashboard?.tickets?.total ?? soldTickets

    const now = new Date()
    const upcomingEvents = eventsList.filter((e) => e.start_date && new Date(e.start_date) > now).length

    const averagePrice = eventsList.length > 0
      ? Math.round(eventsList.reduce((sum, e) => sum + (Number(e.price) || 0), 0) / eventsList.length)
      : 0

    const categoriesMap = eventsList.reduce((acc, event) => {
      const cat = event.category || 'autre'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})

    const categoriesData = Object.entries(categoriesMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: eventsList.length > 0 ? Math.round((count / eventsList.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    const eventsWithPromotion = eventsList.filter(
      (e) => e.promotion && Number(e.promotion.pourcentage) > 0
    ).length
    const promotionRate = eventsList.length > 0
      ? Math.round((eventsWithPromotion / eventsList.length) * 100)
      : 0

    const recentEvents = [...eventsList]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5)

    return {
      totalEvents,
      totalUsers,
      totalRevenue,
      publishedEvents,
      draftEvents,
      cancelledEvents,
      upcomingEvents,
      averagePrice,
      eventsByMonth,
      revenueByMonth,
      categories: categoriesData,
      usersByMonth,
      eventsWithPromotion,
      promotionRate,
      recentEvents,
      totalTickets,
      soldTickets,
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    const token = auth.getToken()
    await loadDashboardData(token)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-700">Erreur de chargement</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  // Statistiques pour les cartes
  const statCards = [
    {
      title: 'Total Événements',
      value: stats?.totalEvents || 0,
      icon: FaCalendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Tickets',
      value: stats?.totalTickets || 0,
      icon: FaTicketAlt,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Revenus Totaux',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} FCFA`,
      icon: FaDollarSign,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const title = label || payload[0].name || payload[0].payload?.name
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-sm text-dice-blue font-bold">
            {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  const revenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-sm text-dice-blue font-bold">
            {payload[0].value.toLocaleString()} FCFA
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">
            Bienvenue {user?.name || 'Admin'} ! 
            <span className="ml-2 text-xs text-gray-400">
              {stats?.totalEvents || 0} événements au total
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSync />
            )}
            Rafraîchir
          </button>
          <Link href="/admin/events/create">
            <button className="px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm flex items-center gap-2">
              <FaPlus />
              Nouvel événement
            </button>
          </Link>
        </div>
      </div>

      {/* Stats rapides des événements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-dice-blue">{stats?.totalEvents || 0}</p>
          <p className="text-xs text-gray-400">événements créés</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Publiés</p>
          <p className="text-xl font-bold text-green-500">{stats?.publishedEvents || 0}</p>
          <p className="text-xs text-gray-400">en ligne</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avec promotion</p>
          <p className="text-xl font-bold text-purple-500">{stats?.eventsWithPromotion || 0}</p>
          <p className="text-xs text-gray-400">{stats?.promotionRate || 0}% des événements</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">À venir</p>
          <p className="text-xl font-bold text-orange-500">{stats?.upcomingEvents || 0}</p>
          <p className="text-xs text-gray-400">prochains événements</p>
        </div>
      </div>

      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Derniers événements créés */}
      {stats?.recentEvents && stats.recentEvents.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Derniers événements créés</h3>
            <Link href="/admin/events" className="text-sm text-dice-blue hover:underline">
              Voir tous →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-dice-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalendar className="text-dice-blue" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start_date).toLocaleDateString('fr-FR')} • {event.location}
                      {event.promotion && event.promotion.pourcentage > 0 && (
                        <span className="ml-2 text-green-600">-{event.promotion.pourcentage}%</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    event.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                  <span className="text-sm font-semibold text-dice-blue">
                    {event.price} {event.currency || 'FCFA'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenus mensuels - Graphique en barres */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaMoneyBillWave className="text-dice-blue" />
              Revenus mensuels
            </h3>
            <span className="text-sm font-bold text-dice-blue">
              Total: {stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()} FCFA` : '0 FCFA'}
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.revenueByMonth || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tickFormatter={(value) =>
                    value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value)
                  }
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={revenueTooltip} />
                <Bar 
                  dataKey="revenue" 
                  fill="#0a89f2" 
                  radius={[4, 4, 0, 0]}
                  name="Revenus"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Événements par mois - Graphique en ligne */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendar className="text-dice-blue" />
              Événements par mois
            </h3>
            <span className="text-sm font-bold text-dice-blue">
              Total: {stats?.totalEvents || 0} événements
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.eventsByMonth || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip content={customTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0a89f2" 
                  strokeWidth={3}
                  dot={{ 
                    fill: '#0a89f2', 
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{ 
                    r: 8,
                    fill: '#0a89f2'
                  }}
                  name="Événements"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Catégories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Catégories</h3>
            <span className="text-xs text-gray-400">Distribution</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categories?.length ? stats.categories : [{ name: 'Aucune', count: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {(stats?.categories?.length ? stats.categories : [{ name: 'Aucune', count: 1 }]).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={stats?.categories?.length ? COLORS[index % COLORS.length] : '#e5e7eb'}
                    />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilisateurs par mois */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Utilisateurs par mois</h3>
            <span className="text-xs text-gray-400">{stats?.totalUsers || 0} utilisateurs</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.usersByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={customTooltip} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                  name="Utilisateurs"
                />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Prix moyen</p>
          <p className="text-xl font-bold text-dice-blue">{stats?.averagePrice?.toLocaleString() || 0} FCFA</p>
          <p className="text-xs text-gray-400">par événement</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Taux de promotion</p>
          <p className="text-xl font-bold text-purple-500">{stats?.promotionRate || 0}%</p>
          <p className="text-xs text-gray-400">des événements</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Catégorie populaire</p>
          <p className="text-xl font-bold text-gray-800">
            {stats?.categories && stats.categories.length > 0 ? stats.categories[0]?.name : '-'}
          </p>
          <p className="text-xs text-gray-400">
            {stats?.categories && stats.categories.length > 0 ? stats.categories[0]?.percentage : 0}% des événements
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Mois actif</p>
          <p className="text-xl font-bold text-gray-800">
            {stats?.eventsByMonth?.reduce((max, curr) => curr.count > max.count ? curr : max, { month: '-', count: 0 }).month}
          </p>
          <p className="text-xs text-gray-400">
            {stats?.eventsByMonth?.reduce((max, curr) => curr.count > max.count ? curr : max, { month: '-', count: 0 }).count} événements
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/events">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dice-blue/10 rounded-lg flex items-center justify-center group-hover:bg-dice-blue/20 transition-colors">
                <FaEye className="text-dice-blue" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 group-hover:text-dice-blue transition-colors">Voir les événements</h4>
                <p className="text-sm text-gray-500">{stats?.totalEvents || 0} événements créés</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/events/create">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <FaPlus className="text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 group-hover:text-green-500 transition-colors">Créer un événement</h4>
                <p className="text-sm text-gray-500">Ajouter au calendrier</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/tickets">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-dice-blue transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <FaTicketAlt className="text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 group-hover:text-purple-500 transition-colors">Tickets</h4>
                <p className="text-sm text-gray-500">{stats?.totalTickets || 0} tickets</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}