/**
 * Layout du dashboard avec sidebar responsive
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }) {
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dice-blue/5 via-white to-purple-500/5 pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar - gère son propre affichage responsive */}
          <Sidebar />

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}