/**
 * Mes certificats - Design élégant sans icônes
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function CertificatesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [certificates, setCertificates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    loadCertificates()
  }, [router])

  const loadCertificates = async () => {
    try {
      // Simuler le chargement des certificats
      setTimeout(() => {
        setCertificates([
          { 
            id: 1, 
            title: 'Certificat de Formation Python', 
            date: '15 juillet 2026', 
            type: 'Formation',
            code: 'CERT-001',
            description: 'Formation avancée en Python et Machine Learning',
            provider: 'Diamond Centre'
          },
          { 
            id: 2, 
            title: 'Certificat d\'Art Oratoire', 
            date: '20 juin 2026', 
            type: 'Conférence',
            code: 'CERT-002',
            description: 'Maîtrise de la prise de parole en public',
            provider: 'Diamond Centre'
          },
          { 
            id: 3, 
            title: 'Certificat de Leadership', 
            date: '5 mai 2026', 
            type: 'Séminaire',
            code: 'CERT-003',
            description: 'Développement du leadership et management d\'équipe',
            provider: 'Diamond Centre'
          }
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Erreur chargement certificats:', error)
      toast.error('Erreur lors du chargement des certificats')
      setLoading(false)
    }
  }

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Mes certificats
          </h1>
          <p className="text-gray-500">
            {certificates.length} certificat{certificates.length > 1 ? 's' : ''} obtenu{certificates.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-8 max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un certificat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none bg-white shadow-sm"
        />
      </div>

      {filteredCertificates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-7xl mb-4">📜</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun certificat</h3>
          <p className="text-gray-400">Vous n'avez pas encore de certificats</p>
          <Link href="/events">
            <button className="mt-4 px-6 py-2.5 bg-dice-blue text-white rounded-xl hover:bg-dice-blue-dark transition-colors">
              Explorer les formations
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <div 
              key={cert.id} 
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* En-tête du certificat */}
              <div className="bg-gradient-to-br from-dice-blue to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/80">Certificat</span>
                  <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded">
                    {cert.code}
                  </span>
                </div>
                <div className="mt-2 text-xl font-bold">
                  {cert.title}
                </div>
              </div>

              {/* Corps du certificat */}
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-800">{cert.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Délivré par</p>
                    <p className="font-medium text-gray-800">{cert.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'obtention</p>
                    <p className="text-sm text-gray-600">{cert.date}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-dice-blue bg-dice-blue/5 hover:bg-dice-blue/10 rounded-xl transition-colors">
                    Voir le certificat
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-dice-blue hover:bg-dice-blue-dark rounded-xl transition-colors">
                    Télécharger
                  </button>
                </div>
              </div>

              {/* Badge de validation */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Certificat valide
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}