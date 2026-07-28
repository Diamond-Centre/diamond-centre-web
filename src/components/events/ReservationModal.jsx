/**
 * Modal de réservation - Synchronisé avec le backend admin
 */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTimes, FaTicketAlt, FaUser, FaEnvelope, FaPhone, 
  FaCreditCard, FaMobileAlt, FaQrcode, FaCheckCircle,
  FaSpinner, FaArrowRight, FaCalendar, FaMapMarker,
  FaClock, FaEuroSign, FaDownload, FaVenusMars, FaTag,
  FaExclamationTriangle
} from 'react-icons/fa'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ReservationModal({ 
  isOpen, 
  onClose, 
  event,
  onSuccess 
}) {
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    quantity: 1
  })
  const [ticket, setTicket] = useState(null)
  const [payment, setPayment] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const maxTickets = Math.min(5, event?.available_tickets || 10)
  const hasPromotion = event?.promotion && event.promotion.pourcentage > 0
  const promoPrice = hasPromotion 
    ? Math.round(event.price - (event.price * event.promotion.pourcentage) / 100)
    : event?.price || 0

  useEffect(() => {
    const user = auth.getUser()
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || '',
        customer_email: user.email || '',
        customer_phone: user.telephone || ''
      }))
    }
  }, [isOpen])

  useEffect(() => {
    if (payment?.status === 'pending' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, payment])

  const handleClose = () => {
    if (step === 'payment' && payment?.status === 'pending') {
      setShowCloseConfirm(true)
    } else {
      onClose()
      resetModal()
    }
  }

  const handleConfirmClose = () => {
    setShowCloseConfirm(false)
    onClose()
    resetModal()
    toast.success('Paiement annulé', {
      icon: 'ℹ️',
      duration: 3000
    })
  }

  const resetModal = () => {
    setStep('form')
    setTicket(null)
    setPayment(null)
    setQrCode(null)
    setCountdown(0)
    setShowCloseConfirm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    try {
      const token = auth.getToken()
      if (!token) {
        toast.error('Veuillez vous connecter pour réserver')
        return
      }

      // 1. Réserver les tickets
      const reservation = await api.reserveTickets({
        eventId: event.id,
        quantity: formData.quantity,
        customerName: formData.customer_name,
        customerEmail: formData.customer_email,
        customerPhone: formData.customer_phone
      }, token)

      setTicket(reservation)
      toast.success('Réservation effectuée !')

      // 2. Initier le paiement
      const paymentData = await api.initiatePayment({
        ticketId: reservation.id,
        method: 'mtn_momo',
        phone: formData.customer_phone
      }, token)

      setPayment(paymentData)
      setCountdown(300)
      setStep('payment')

    } catch (error) {
      toast.error(error.message || 'Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!payment) return
    
    try {
      const token = auth.getToken()
      const status = await api.getPaymentStatus(payment.id, token)
      
      if (status.status === 'successful') {
        setStep('success')
        
        // Générer le QR code
        const qrData = await api.validateTicket(
          ticket?.qr_codes?.[0]?.code || `dc_${ticket?.id}_${Date.now()}`,
          token
        )
        setQrCode(qrData)
        toast.success('Paiement confirmé !')
        
        // Notifier le parent avec les données du ticket
        if (onSuccess) {
          onSuccess({
            ...ticket,
            qrCode: qrData,
            payment: status,
            customer_name: formData.customer_name,
            quantity: formData.quantity
          })
        }
      } else if (status.status === 'failed') {
        toast.error('Le paiement a échoué')
        setStep('form')
        setTicket(null)
        setPayment(null)
      } else {
        // Continuer à vérifier
        setTimeout(checkPaymentStatus, 3000)
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    await checkPaymentStatus()
    setLoading(false)
  }

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 300, 300)
    
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🎫', 150, 100)
    ctx.font = '14px Arial'
    ctx.fillText(`Ticket #${ticket?.id || 'N/A'}`, 150, 150)
    ctx.fillStyle = '#1a1a2e'
    ctx.font = '12px Arial'
    ctx.fillText(event?.title || 'Événement', 150, 180)
    ctx.fillText(formData.customer_name, 150, 200)
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 18px Arial'
    ctx.fillText(qrCode?.qr_code || ticket?.qr_codes?.[0]?.code || 'DC-XXXX', 150, 240)
    
    const link = document.createElement('a')
    link.download = `ticket-${ticket?.id || 'event'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-dice-blue/5 to-purple-500/5">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {step === 'form' && 'Réserver votre place'}
                {step === 'payment' && 'Paiement en cours'}
                {step === 'success' && 'Réservation confirmée !'}
              </h3>
              <p className="text-sm text-gray-500">{event?.title}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={step === 'success'}
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Info événement */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-dice-blue" />
                    <span>{new Date(event?.start_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-dice-blue" />
                    <span>{event?.start_time || '09:00'} - {event?.end_time || '17:00'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarker className="text-dice-blue" />
                    <span>{event?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    {hasPromotion ? (
                      <div className="flex items-center gap-2">
                        <FaEuroSign className="text-dice-blue" />
                        <span className="font-bold text-dice-blue">{promoPrice} FCFA</span>
                        <span className="text-gray-400 line-through text-sm">{event?.price} FCFA</span>
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          -{event?.promotion?.pourcentage}%
                        </span>
                      </div>
                    ) : (
                      <>
                        <FaEuroSign className="text-dice-blue" />
                        <span className="font-bold text-dice-blue">{event?.price} FCFA</span>
                      </>
                    )}
                    <span className="text-gray-400 text-xs">/ personne</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaTicketAlt className="text-dice-blue" />
                    <span>{event?.available_tickets || 0} places disponibles</span>
                  </div>
                  {hasPromotion && event?.promotion?.sexe && (
                    <div className="flex items-center gap-2 text-green-600">
                      <FaVenusMars className="text-green-500" />
                      <span className="text-xs">Ciblé: {event.promotion.sexe === 'tous' ? 'Tous' : event.promotion.sexe === 'homme' ? 'Hommes' : 'Femmes'}</span>
                    </div>
                  )}
                </div>

                {/* Formulaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="jean@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone (Mobile Money) *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="670000000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de places
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        quantity: Math.max(1, prev.quantity - 1) 
                      }))}
                      className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-dice-blue w-12 text-center">
                      {formData.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        quantity: Math.min(maxTickets, prev.quantity + 1) 
                      }))}
                      className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">
                      max {maxTickets}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-dice-blue text-lg">
                      {(hasPromotion ? promoPrice : (event?.price || 0)) * formData.quantity} FCFA
                    </span>
                  </div>
                  {hasPromotion && (
                    <div className="flex justify-between text-xs text-green-600 mt-1">
                      <span>Économie réalisée</span>
                      <span>{(event?.price - promoPrice) * formData.quantity} FCFA</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="text-base py-3"
                >
                  {loading ? 'Réservation...' : 'Réserver maintenant'}
                  <FaArrowRight className="ml-2" />
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-dice-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaMobileAlt className="text-4xl text-dice-blue" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">Paiement Mobile Money</h4>
                  <p className="text-sm text-gray-500">
                    Envoyez le paiement via MTN Mobile Money
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Montant</span>
                    <span className="font-semibold text-dice-blue">
                      {(hasPromotion ? promoPrice : (event?.price || 0)) * formData.quantity} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Numéro</span>
                    <span className="font-semibold">{formData.customer_phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Référence</span>
                    <span className="font-semibold text-xs text-gray-500">
                      {payment?.reference || 'MTN-REF-XXXX'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ticket</span>
                    <span className="font-semibold text-xs text-gray-500">
                      #{ticket?.id || 'N/A'}
                    </span>
                  </div>
                </div>

                {countdown > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Temps restant : {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-dice-blue h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${(countdown / 300) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || countdown === 0}
                  className="text-base py-3"
                >
                  {loading ? (
                    'Vérification du paiement...'
                  ) : countdown === 0 ? (
                    'Temps expiré, veuillez réessayer'
                  ) : (
                    'Confirmer le paiement'
                  )}
                  {!loading && countdown > 0 && <FaCheckCircle className="ml-2" />}
                </Button>

                <div className="text-center text-xs text-gray-400">
                  <p>Vous serez redirigé automatiquement après confirmation du paiement</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-4 space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Réservation confirmée !</h4>
                  <p className="text-sm text-gray-500">
                    Votre réservation a été validée avec succès
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ticket #{ticket?.id} - {formData.quantity} place{formData.quantity > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Le ticket est visible dans la section Tickets du dashboard admin
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white border-2 border-dice-blue/20 rounded-2xl p-6 max-w-xs mx-auto">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <div className="w-40 h-40 bg-dice-blue/5 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🎫</div>
                          <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {qrCode?.qr_code || ticket?.qr_codes?.[0]?.code || 'DC-XXXX'}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            #{ticket?.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 text-left">
                    <p><span className="font-medium">Événement:</span> {event?.title}</p>
                    <p><span className="font-medium">Nom:</span> {formData.customer_name}</p>
                    <p><span className="font-medium">Places:</span> {formData.quantity}</p>
                    <p><span className="font-medium">Ticket:</span> #{ticket?.id}</p>
                    <p><span className="font-medium">Statut:</span> <span className="text-green-600">Payé</span></p>
                    <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleDownloadQR}
                    variant="outline"
                    className="flex-1"
                  >
                    <FaDownload className="mr-2" />
                    Télécharger QR
                  </Button>
                  <Button
                    onClick={() => {
                      if (onSuccess) {
                        onSuccess({
                          ...ticket,
                          qrCode: qrCode,
                          customer_name: formData.customer_name,
                          quantity: formData.quantity
                        })
                      }
                      onClose()
                      resetModal()
                    }}
                    variant="primary"
                    className="flex-1"
                  >
                    Terminer
                    <FaArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Sécurisé par Diamond Centre</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Paiement sécurisé
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation de fermeture */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-sm w-full bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-2xl text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Annuler le paiement ?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Votre paiement est en cours. Si vous fermez cette fenêtre, 
                  la transaction sera annulée.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowCloseConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                  <Button
                    onClick={handleConfirmClose}
                    variant="danger"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}