import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
import './home.css'
import { Anton, Barlow_Condensed, Outfit, Cormorant_Garamond } from 'next/font/google'
import AppShell from '@/components/layout/AppShell'
import SessionGuard from '@/components/auth/SessionGuard'
import RoleRouteGuard from '@/components/auth/RoleRouteGuard'
import NotificationLiveToaster from '@/components/notifications/NotificationLiveToaster'
import { Toaster } from 'react-hot-toast'

/* ------------------------------------------------------------------
 * Polices de la refonte (exposées en variables CSS -> tailwind.config.js)
 *  - Anton               : gros titres (hero, panneaux)
 *  - Barlow Condensed    : titres de sections, chiffres, noms
 *  - Outfit              : texte courant, navigation, boutons
 *  - Cormorant Garamond  : signature « Fulfil Your dreams… »
 * ------------------------------------------------------------------ */
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata = {
  title: 'Dice - Formations, Conférences & Ateliers',
  description: 'Plateforme de formations professionnelles, séminaires et ateliers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${barlow.variable} ${outfit.variable} ${cormorant.variable}`}
    >
      <body>
        <AuthProvider>
          <SessionGuard />
          <RoleRouteGuard />
          <NotificationLiveToaster />
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-center"
            containerStyle={{ zIndex: 99999, top: 88 }}
            toastOptions={{ duration: 8000 }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
