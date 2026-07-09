/**
 * Système de réservation de ticket avec paiement
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCalendar, 
  FaMapMarker, 
  FaUser, 
  FaEuroSign, 
  FaClock,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaTimes,
  FaSpinner
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import RegisterModal from '@/components/auth/RegisterModal'
import TicketPayment from './TicketPayment'
import TicketConfirmation from './TicketConfirmation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function TicketReservation({ 
  event, 
  isOpen, 
  onClose,
  onSuccess 
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { createTicket, loading: ticketLoading } = useTickets()
  
  const [step, setStep] = useState(1) // 1: Détails, 2: Paiement, 3: Confirmation
  const [ticketData, setTicketData] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const maxPlaces = event?.nbPlaces - event?.nbInscrits || 0
  const prixTotal = (event?.prixPromotion || event?.prix || 0) * selectedQuantity

  // Réinitialiser quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setTicketData(null)
      setSelectedQuantity(1)
      setShowRegister(false)
    }
  }, [isOpen])

  // Vérifier l'authentification
  const handleReserve = () => {
    if (!isAuthenticated) {
      setShowRegister(true)
      return
    }
    setStep(2)
  }

  // Gérer le paiement
  const handlePayment = async (paymentData) => {
    setIsProcessing(true)
    try {
      const ticket = await createTicket({
        userId: user.id,
        eventId: event.id,
        quantity: selectedQuantity,
        prixPaye: prixTotal,
        paymentMethod: paymentData.method,
        paymentId: paymentData.transactionId
      })
      
      setTicketData(ticket)
      setStep(3)
      toast.success('Réservation confirmée !')
      
      if (onSuccess) {
        onSuccess(ticket)
      }
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setIsProcessing(false)
    }
  }

  // Gérer l'inscription réussie
  const handleRegisterSuccess = () => {
    setShowRegister(false)
    toast.success('Inscription réussie ! Vous pouvez maintenant réserver.')
    // Passer à l'étape de paiement
    setStep(2)
  }

  // Rendu des étapes
  const renderStep = () => {
    switch(step) {
      case 1:
        return renderDetailsStep()
      case 2:
        return renderPaymentStep()
      case 3:
        return renderConfirmationStep()
      default:
        return null
    }
  }

  // Étape 1: Détails de la réservation
  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Réserver votre place</h3>
        <p className="text-gray-500">Confirmez les détails de votre réservation</p>
      </div>

      {/* Détails de l'événement */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h4 className="font-semibold text-gray-800">{event?.titre}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-dice-blue" />
            <span>{format(new Date(event?.date), 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-dice-blue" />
            <span>{format(new Date(event?.date), 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarker className="text-dice-blue" />
            <span>{event?.lieu}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-dice-blue" />
            <span>{event?.formateur?.nom}</span>
          </div>
        </div>
      </div>

      {/* Sélection du nombre de places */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de places
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-dice-blue hover:text-dice-blue transition-colors"
            disabled={selectedQuantity <= 1}
          >
            <FaTimes className="text-sm" />
          </button>
          <span className="text-xl font-bold w-12 text-center">{selectedQuantity}</span>
          <button
            onClick={() => setSelectedQuantity(Math.min(maxPlaces, selectedQuantity + 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-dice-blue hover:text-dice-blue transition-colors"
            disabled={selectedQuantity >= maxPlaces}
          >
            <FaArrowRight className="text-sm" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {maxPlaces} place{maxPlaces > 1 ? 's' : ''} disponible{maxPlaces > 1 ? 's' : ''}
        </p>
      </div>

      {/* Résumé du prix */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Prix unitaire</span>
          <span className="font-medium">{event?.prixPromotion || event?.prix} €</span>
        </div>
        {event?.prixPromotion && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Réduction</span>
            <span>-{Math.round((1 - event.prixPromotion/event.prix) * 100)}%</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-dice-blue">{prixTotal} €</span>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} fullWidth>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleReserve}
          fullWidth
          disabled={maxPlaces === 0}
        >
          {maxPlaces === 0 ? 'Complet' : 'Continuer'}
          {maxPlaces > 0 && <FaArrowRight className="ml-2" />}
        </Button>
      </div>

      {/* Modal d'inscription */}
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleRegisterSuccess}
        redirectAfterLogin={false}
      />
    </div>
  )

  // Étape 2: Paiement
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Paiement</h3>
        <p className="text-gray-500">Choisissez votre méthode de paiement</p>
      </div>

      <TicketPayment
        event={event}
        quantity={selectedQuantity}
        totalPrice={prixTotal}
        onPayment={handlePayment}
        onBack={() => setStep(1)}
        isProcessing={isProcessing}
      />
    </div>
  )

  // Étape 3: Confirmation
  const renderConfirmationStep = () => (
    <TicketConfirmation
      ticket={ticketData}
      event={event}
      onClose={onClose}
      onViewTicket={() => router.push('/profile/tickets')}
    />
  )

  // Modal principal
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={step !== 2 && step !== 3}
    >
      <div className="p-6">
        {renderStep()}
      </div>
    </Modal>
  )
}