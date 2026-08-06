'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppShell({ children }) {
  const pathname = usePathname()

  const isAdminPage = pathname?.startsWith('/admin')
  const isAuthPage = pathname?.startsWith('/auth')
  const isLegacyDashboard = pathname?.startsWith('/dashboard')

  // Auth / admin / old dashboard redirect: no chrome
  if (isAuthPage || isAdminPage || isLegacyDashboard) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
