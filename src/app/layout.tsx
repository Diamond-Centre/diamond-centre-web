import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import SessionGuard from '@/components/auth/SessionGuard'
import RoleRouteGuard from '@/components/auth/RoleRouteGuard'
import NotificationLiveToaster from '@/components/notifications/NotificationLiveToaster'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Dice - Formations, Conférences & Ateliers',
  description: 'Plateforme de formations professionnelles, séminaires et ateliers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
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