'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Spinner />
      </div>
    )
  }

  const displayName =
    [user?.prenom, user?.nom].filter(Boolean).join(' ') || user?.name || 'Utilisateur'

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <Container>
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dice-blue to-purple-600 text-white flex items-center justify-center text-xl font-bold">
              {(user?.prenom?.[0] || user?.name?.[0] || 'U').toUpperCase()}
              {(user?.nom?.[0] || '').toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-xs text-dice-blue mt-1 capitalize">{user?.role || 'client'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              Tableau de bord
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/tickets')}>
              Mes tickets
            </Button>
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
