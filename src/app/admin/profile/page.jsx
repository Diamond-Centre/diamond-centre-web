'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** English alias → /admin/profil */
export default function AdminProfileAliasPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/profil')
  }, [router])

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
    </div>
  )
}
