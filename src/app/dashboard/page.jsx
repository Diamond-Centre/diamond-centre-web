/**
 * Page principale du dashboard
 */
'use client'

import { useAuth } from '@/hooks/useAuth'
import StatsCards from '@/components/dashboard/StatsCards'
import TicketList from '@/components/dashboard/TicketList'
import CertificationCard from '@/components/dashboard/CertificationCard'
import AttestationCard from '@/components/dashboard/AttestationCard'
import AgendaCalendar from '@/components/dashboard/AgendaCalendar'

// Données mockées
const mockTickets = [
  {
    id: '1',
    code: 'TCK-2026-001',
    formation: 'Développement Web avec React',
    date: '2026-08-15',
    lieu: 'Abidjan, Plateau',
    formateur: 'André Marie',
    prix: 150,
    statut: 'payé',
    qrCode: '/images/qr-code-1.png'
  },
  {
    id: '2',
    code: 'TCK-2026-002',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-09-01',
    lieu: 'Lyon, France',
    formateur: 'Brandon',
    prix: 200,
    statut: 'en_attente',
    qrCode: '/images/qr-code-2.png'
  },
  {
    id: '3',
    code: 'TCK-2026-003',
    formation: 'UI/UX Design - Créer des interfaces innovantes',
    date: '2026-08-20',
    lieu: 'Bordeaux, France',
    formateur: 'Stéphane',
    prix: 100,
    statut: 'payé',
    qrCode: '/images/qr-code-3.png'
  }
]

const mockCertifications = [
  {
    id: '1',
    titre: 'Développeur Full Stack React',
    formation: 'Développement Web avec React',
    date: '2026-07-15',
    code: 'CERT-2026-001'
  },
  {
    id: '2',
    titre: 'Architecte Microservices',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-08-01',
    code: 'CERT-2026-002'
  }
]

const mockAttestations = [
  {
    id: '1',
    titre: 'Attestation de formation React',
    formation: 'Développement Web avec React',
    date: '2026-07-15',
    code: 'ATT-2026-001',
    duree: '40 heures'
  },
  {
    id: '2',
    titre: 'Attestation de formation Microservices',
    formation: 'Architecture Microservices avec Spring Boot',
    date: '2026-08-01',
    code: 'ATT-2026-002',
    duree: '32 heures'
  }
]

const mockEvents = [
  {
    id: '1',
    title: 'Développement Web avec React',
    date: '2026-08-15',
    time: '09:00-17:00',
    lieu: 'Abidjan, Plateau',
    type: 'formation',
    status: 'confirmé'
  },
  {
    id: '2',
    title: 'Architecture Microservices',
    date: '2026-09-01',
    time: '10:00-18:00',
    lieu: 'Lyon, France',
    type: 'séminaire',
    status: 'en_attente'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tableau de bord
          </h1>
          <p className="text-gray-500">
            Bienvenue {user?.prenom || 'utilisateur'} ! Voici un résumé de vos activités.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Statistiques */}
      <StatsCards />

      {/* Contenu principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne principale (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tickets récents */}
          <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Mes tickets récents</h2>
              <a href="/dashboard/tickets" className="text-sm text-dice-blue hover:underline">
                Voir tous
              </a>
            </div>
            <TicketList tickets={mockTickets.slice(0, 2)} />
          </div>

          {/* Certifications */}
          <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Certifications</h2>
              <a href="/dashboard/certifications" className="text-sm text-dice-blue hover:underline">
                Voir toutes
              </a>
            </div>
            <CertificationCard certifications={mockCertifications.slice(0, 2)} />
          </div>

          {/* Attestations - En bas des certifications */}
          <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Attestations</h2>
              <a href="/dashboard/attestations" className="text-sm text-dice-blue hover:underline">
                Voir toutes
              </a>
            </div>
            <AttestationCard attestations={mockAttestations.slice(0, 2)} />
          </div>
        </div>

        {/* Colonne droite (1/3) */}
        <div className="space-y-6">
          {/* Agenda */}
          <div className="glass-card-dice rounded-2xl p-6 border border-white/30 shadow-xl backdrop-blur-md bg-white/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Mon agenda</h2>
              <a href="/dashboard/agenda" className="text-sm text-dice-blue hover:underline">
                Voir tout
              </a>
            </div>
            <AgendaCalendar events={mockEvents.slice(0, 3)} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card-dice {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(10, 137, 242, 0.06);
        }
        .glass-card-dice:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
}