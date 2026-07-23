import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Dice - Formations, Conférences & Ateliers',
  description: 'Plateforme de formations professionnelles, séminaires et ateliers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}