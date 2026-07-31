/**
 * Système de réservation de ticket avec paiement
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCalendar, FaMapMarker, FaUser, FaClock, FaArrowRight, FaTimes } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useTickets } from '@/hooks/useTickets'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
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
  onSuccess,
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { createTicket } = useTickets()

  const [step, setStep] = useState(1) // 1: Quantité, 2: Paiement, 3: Confirmation
  const [ticketData, setTicketData] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const maxPlaces = Math.max(
    0,
    Number(event?.available_tickets ?? (event?.nbPlaces - event?.nbInscrits) ?? 0)
  )
  const maxSelectable = Math.max(1, Math.min(10, maxPlaces || 1))
  const unitPrice = Number(
    event?.prixPromotion ?? event?.promoPrice ?? event?.price ?? event?.prix ?? 0
  )
  const currency = event?.currency || 'FCFA'
  const prixTotal = unitPrice * selectedQuantity

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setTicketData(null)
      setSelectedQuantity(1)
      setShowRegister(false)
      setIsProcessing(false)
    }
  }, [isOpen])

  const handleReserve = () => {
    if (maxPlaces <= 0) {
      toast.error('Plus de places disponibles')
      return
    }
    if (!selectedQuantity || selectedQuantity < 1) {
      toast.error('Indiquez le nombre de tickets souhaités')
      return
    }
    if (selectedQuantity > maxPlaces) {
      toast.error(`Seulement ${maxPlaces} place${maxPlaces > 1 ? 's' : ''} disponible${maxPlaces > 1 ? 's' : ''}`)
      return
    }
    if (!isAuthenticated) {
      setShowRegister(true)
      return
    }
    setStep(2)
  }

  const handlePayment = async (paymentData) => {
    setIsProcessing(true)
    try {
      const storedUser = auth.getUser() || user
      const token = auth.getToken()
      const phone = String(
        paymentData?.phoneNumber ||
          storedUser?.telephone ||
          storedUser?.phone ||
          '+237000000000'
      ).trim() || '+237000000000'

      const customerName =
        [storedUser?.prenom, storedUser?.nom].filter(Boolean).join(' ') ||
        storedUser?.name ||
        storedUser?.email ||
        'Client DiCe'

      const customerEmail = storedUser?.email
      if (!customerEmail) {
        throw new Error('Email utilisateur manquant — reconnectez-vous')
      }

      const ticket = await createTicket({
        event_id: event.id,
        quantity: selectedQuantity,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: phone,
        event_date: event.start_date || event.date || event.starts_at,
        location: event.location || event.lieu,
        time:
          event.start_time && event.end_time
            ? `${event.start_time} - ${event.end_time}`
            : null,
      })

      const ticketId = ticket?.id ?? ticket?.ticket_id
      if (!ticketId) {
        throw new Error('La réservation n’a pas renvoyé d’identifiant de ticket')
      }

      const method =
        paymentData?.method === 'orange' || paymentData?.method === 'orange_money'
          ? 'orange_money'
          : 'mtn_momo'

      const payment = await api.initiatePayment(
        {
          ticketId,
          method,
          phone,
        },
        token
      )

      await api.confirmMtnPayment({
        reference: payment.reference,
        status: 'successful',
        transaction_id: paymentData?.transactionId || `TXN-${Date.now()}`,
      })

      const paidTicket = {
        ...ticket,
        id: ticketId,
        quantity: selectedQuantity,
        status: 'confirmed',
      }
      setTicketData(paidTicket)
      setStep(3)
      toast.success(
        `${selectedQuantity} place${selectedQuantity > 1 ? 's' : ''} réservée${selectedQuantity > 1 ? 's' : ''} !`
      )

      if (onSuccess) {
        onSuccess(paidTicket)
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la réservation')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
    toast.success('Inscription réussie ! Vous pouvez maintenant réserver.')
    setStep(2)
  }

  const formatEventDate = (value, pattern) => {
    if (!value) return 'Date à confirmer'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return String(value)
    return format(d, pattern, { locale: fr })
  }

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Réserver votre place</h3>
        <p className="text-gray-500">Combien de tickets souhaitez-vous ?</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h4 className="font-semibold text-gray-800">{event?.titre || event?.title}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-dice-blue" />
            <span>{formatEventDate(event?.date || event?.start_date, 'dd MMMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-dice-blue" />
            <span>{event?.time || formatEventDate(event?.date || event?.start_date, 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarker className="text-dice-blue" />
            <span>{event?.lieu || event?.location || 'Lieu à confirmer'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-dice-blue" />
            <span>{event?.formateur?.nom || 'Diamond Centre'}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de tickets
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-dice-blue hover:text-dice-blue transition-colors text-lg font-bold"
            disabled={selectedQuantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={maxSelectable}
            value={selectedQuantity}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (Number.isNaN(value)) return
              setSelectedQuantity(Math.min(maxSelectable, Math.max(1, value)))
            }}
            className="w-16 text-center text-xl font-bold text-dice-blue border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-dice-blue/30"
          />
          <button
            type="button"
            onClick={() =>
              setSelectedQuantity(Math.min(maxSelectable, selectedQuantity + 1))
            }
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-dice-blue hover:text-dice-blue transition-colors text-lg font-bold"
            disabled={selectedQuantity >= maxSelectable || maxPlaces <= 0}
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {maxPlaces} place{maxPlaces !== 1 ? 's' : ''} disponible{maxPlaces !== 1 ? 's' : ''}
          {maxPlaces > 10 ? ' (max 10 par commande)' : ''}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Prix unitaire</span>
          <span className="font-medium">
            {unitPrice} {currency}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
          <span>Total ({selectedQuantity} ticket{selectedQuantity > 1 ? 's' : ''})</span>
          <span className="text-dice-blue">
            {prixTotal} {currency}
          </span>
        </div>
      </div>

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
          {maxPlaces === 0 ? 'Complet' : 'Continuer vers le paiement'}
          {maxPlaces > 0 && <FaArrowRight className="ml-2" />}
        </Button>
      </div>

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Paiement</h3>
        <p className="text-gray-500">
          {selectedQuantity} ticket{selectedQuantity > 1 ? 's' : ''} · {prixTotal}{' '}
          {currency}
        </p>
      </div>

      <TicketPayment
        event={event}
        quantity={selectedQuantity}
        totalPrice={prixTotal}
        currency={currency}
        onPayment={handlePayment}
        onBack={() => setStep(1)}
        isProcessing={isProcessing}
      />
    </div>
  )

  const renderConfirmationStep = () => (
    <TicketConfirmation
      ticket={ticketData}
      event={event}
      onClose={onClose}
      onViewTicket={() => router.push('/espace-client/tickets')}
    />
  )

  const renderStep = () => {
    switch (step) {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={step !== 2 && step !== 3}
    >
      <div className="p-6">{renderStep()}</div>
    </Modal>
  )
}
