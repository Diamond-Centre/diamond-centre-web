/**
 * Ancien dashboard client → redirige vers l’espace client (consultation).
 * Les admins vont sur /admin.
 */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

export default function DashboardRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const token = auth.getToken()
    const user = auth.getUser()

    if (!token || !user) {
      router.replace('/auth/login')
      return
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      router.replace('/admin')
      return
    }

    router.replace('/espace-client')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dice-blue" />
    </div>
  )
}
