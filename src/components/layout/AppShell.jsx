'use client'

/**
 * Shell that hides global Navbar/Footer on auth pages
 * and avoids double chrome on full-screen flows.
 */
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function AppShell({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isDashboard ? '' : ''}`}>{children}</main>
      {!isDashboard && <Footer />}
    </div>
  )
}
