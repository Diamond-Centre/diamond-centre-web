'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Tableau de bord
      </h1>
      <p className="text-gray-600">
        Bienvenue sur votre tableau de bord, {user?.name || 'Admin'} ! 👋
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-700">Événements</h3>
          <p className="text-3xl font-bold text-dice-blue mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">Total des événements</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-700">Utilisateurs</h3>
          <p className="text-3xl font-bold text-dice-blue mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">Total des utilisateurs</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-700">Tickets</h3>
          <p className="text-3xl font-bold text-dice-blue mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">Total des tickets</p>
        </div>
      </div>
    </div>
  )
}