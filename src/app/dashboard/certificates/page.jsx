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
            title: 'Certificat Formation Python', 
            date: '15 juillet 2026', 
            type: 'formation', 
            code: 'CERT-001',
            description: 'Formation approfondie sur Python et ses frameworks',
            duration: '40 heures',
            score: '92%'
          },
          { 
            id: 2, 
            title: 'Certificat Art Oratoire', 
            date: '20 juin 2026', 
            type: 'conférence', 
            code: 'CERT-002',
            description: 'Maîtrise de la prise de parole en public',
            duration: '20 heures',
            score: '88%'
          },
          { 
            id: 3, 
            title: 'Certificat Leadership', 
            date: '5 mai 2026', 
            type: 'séminaire', 
            code: 'CERT-003',
            description: 'Développement des compétences en leadership',
            duration: '30 heures',
            score: '95%'
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dice-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mes certificats</h1>
          <p className="text-gray-500">{certificates.length} certificat{certificates.length > 1 ? 's' : ''} obtenu{certificates.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-8">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un certificat par titre, type ou code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dice-blue focus:border-transparent outline-none bg-white shadow-sm"
        />
      </div>

      {filteredCertificates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-7xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun certificat</h3>
          <p className="text-gray-400">Vous n'avez pas encore de certificats</p>
          <Link href="/events">
            <button className="mt-4 px-6 py-2 bg-dice-blue text-white rounded-lg hover:bg-dice-blue-dark transition-colors">
              Explorer les formations
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCertificates.map((cert) => (
            <div 
              key={cert.id} 
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Bandeau supérieur avec dégradé */}
              <div className="h-2 bg-gradient-to-r from-dice-blue/80 to-dice-blue" />
              
              <div className="p-6">
                {/* En-tête du certificat */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl"></span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {cert.type || 'Certificat'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-dice-blue transition-colors">
                      {cert.title}
                    </h3>
                    {cert.description && (
                      <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-xs text-gray-400">Code</div>
                    <div className="text-sm font-mono font-semibold text-dice-blue bg-dice-blue/5 px-3 py-1 rounded-lg">
                      {cert.code}
                    </div>
                  </div>
                </div>

                {/* Détails du certificat */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="text-sm font-medium text-gray-700">{cert.date}</div>
                  </div>
                  {cert.duration && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400">Durée</div>
                      <div className="text-sm font-medium text-gray-700">{cert.duration}</div>
                    </div>
                  )}
                  {cert.score && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400">Score</div>
                      <div className="text-sm font-medium text-green-600">{cert.score}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Validé
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-1.5 text-sm text-dice-blue border border-dice-blue rounded-lg hover:bg-dice-blue hover:text-white transition-colors"
                    >
                      Voir
                    </button>
                    <button 
                      className="px-4 py-1.5 text-sm text-dice-blue border border-dice-blue rounded-lg hover:bg-dice-blue hover:text-white transition-colors"
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}