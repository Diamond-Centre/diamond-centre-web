'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppShell({ children }) {
  const pathname = usePathname()
  
  // Vérifier si on est sur une page admin
  const isAdminPage = pathname?.startsWith('/admin')
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Ne pas afficher la Navbar sur les pages admin */}
      {!isAdminPage && <Navbar />}
      <main className={`flex-grow ${!isAdminPage ? '' : ''}`}>
        {children}
      </main>
      {/* Ne pas afficher le Footer sur les pages admin */}
      {!isAdminPage && <Footer />}
    </div>
  )
}