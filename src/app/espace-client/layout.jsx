/**
 * Espace client — chrome de la refonte (header 84 px, onglets, fond quadrillé)
 * Les pages portent le contenu ; le style vit dans ./espace-client.css
 */
'use client'

import './espace-client.css'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'

const tabs = [
  { href: '/espace-client', label: 'Vue d’ensemble', glyph: '⌂', exact: true },
  { href: '/espace-client/tickets', label: 'Mes tickets', glyph: '▣' },
  { href: '/espace-client/certificats', label: 'Certificats', glyph: '✦' },
  { href: '/espace-client/agenda', label: 'Agenda', glyph: '▦' },
  { href: '/espace-client/notifications', label: 'Notifications', glyph: '●' },
  { href: '/espace-client/profil', label: 'Mon profil', glyph: '●' },
]

export default function EspaceClientLayout({ children }) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const { unreadCount } = useNotifications({ autoLoad: true, sync: false })

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.replace('/auth/login')
      return
    }
    // Admins must never stay on /espace-client, even via URL
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/admin')
      return
    }
    setReady(true)
  }, [loading, isAuthenticated, user, router, pathname])

  if (loading || !ready) {
    return (
      <div className="ec-root">
        <div className="ec-loading" style={{ minHeight: '60vh' }}>
          <div className="ec-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="ec-root">
      <div className="ec-container">
        <header className="ec-header">
          <div className="ec-brand">
            <b>DiCe</b>
            <span>· Mon espace</span>
          </div>
          <button type="button" onClick={logout} className="ec-logout">
            <span aria-hidden="true">↪</span>
            Déconnexion
          </button>
        </header>

        <nav className="ec-nav" aria-label="Espace client">
          {tabs.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname?.startsWith(`${tab.href}/`)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="ec-tab"
                aria-current={active ? 'page' : undefined}
              >
                <span className="ec-glyph" aria-hidden="true">
                  {tab.glyph}
                </span>
                {tab.label}
                {tab.href === '/espace-client/notifications' && unreadCount > 0 ? (
                  <span className="ec-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                ) : null}
              </Link>
            )
          })}
        </nav>

        <main className="ec-main">{children}</main>
      </div>
    </div>
  )
}
