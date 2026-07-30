/**
 * Profil utilisateur
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaUser, FaEnvelope, FaPhone, FaVenusMars, 
  FaEdit, FaArrowLeft, FaCamera, FaCheckCircle,
  FaCalendar, FaClock
} from 'react-icons/fa'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser) {
      router.push('/auth/login')
      return
    }
    
    setUser(storedUser)
    setLoading(false)
  }, [router])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Mon profil</h1>
          <Link href="/profile/edit" className="ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors text-sm">
              <FaEdit className="text-sm" />
              Modifier
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Carte de profil */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* En-tête avec photo */}
          <div className="bg-gradient-to-r from-dice-blue to-dice-blue-dark p-6 relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-white/80 text-sm">{user?.role || 'Client'}</p>
                <div className="flex items-center gap-2 mt-1 text-white/60 text-xs">
                  <FaCalendar className="text-xs" />
                  <span>Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Informations personnelles</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-dice-blue" />
                <div>
                  <p className="text-xs text-gray-400">Nom complet</p>
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-dice-blue" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-dice-blue" />
                <div>
                  <p className="text-xs text-gray-400">Téléphone</p>
                  <p className="text-sm font-medium text-gray-800">{user?.telephone || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaVenusMars className="text-dice-blue" />
                <div>
                  <p className="text-xs text-gray-400">Sexe</p>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.sexe === 'homme' ? 'Homme' : 
                     user?.sexe === 'femme' ? 'Femme' : 
                     'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Statistiques</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-dice-blue">0</p>
                  <p className="text-xs text-gray-500">Tickets</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">0</p>
                  <p className="text-xs text-gray-500">Certificats</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">0</p>
                  <p className="text-xs text-gray-500">Événements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}