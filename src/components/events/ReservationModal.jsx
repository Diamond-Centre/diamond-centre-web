/**
 * Modal de réservation - Version simplifiée
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTimes, FaTicketAlt, FaUser, FaEnvelope, FaPhone, 
  FaMobileAlt, FaCheckCircle, FaArrowRight, FaCalendar, 
  FaMapMarker, FaClock, FaEuroSign, FaDownload, 
  FaVenusMars, FaTag, FaExclamationTriangle,
  FaSpinner, FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { GiDiamondRing } from 'react-icons/gi'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ReservationModal({ 
  isOpen, 
  onClose, 
  event,
  onSuccess 
}) {
  const router = useRouter()
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Formulaire de réservation - Uniquement la quantité
  const [formData, setFormData] = useState({
    quantity: 1
  })
  
  // Formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState(null)
  
  // Formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    sexe: 'homme',
    acceptTerms: false
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState(null)
  
  // Données du ticket
  const [ticket, setTicket] = useState(null)
  const [payment, setPayment] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [ticketCreated, setTicketCreated] = useState(false)
  const [duplicatePrompt, setDuplicatePrompt] = useState(false)

  const availablePlaces = Math.max(0, Number(event?.available_tickets ?? 0))
  const maxTickets = Math.max(1, Math.min(10, availablePlaces || 1))
  const hasPromotion = event?.promotion && event.promotion.pourcentage > 0
  const promoPrice = hasPromotion 
    ? Math.round(event.price - (event.price * event.promotion.pourcentage) / 100)
    : event?.price || 0

  // Vérifier l'authentification à l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      checkAuth()
      setFormData({ quantity: 1 })
      setTicket(null)
      setPayment(null)
      setQrCode(null)
      setTicketCreated(false)
      setDuplicatePrompt(false)
    }
  }, [isOpen])

  const checkAuth = () => {
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    console.log('🔍 Vérification auth - Token:', !!token)
    console.log('🔍 Vérification auth - User:', storedUser)
    
    if (token && storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
      setStep('form')
    } else {
      setIsAuthenticated(false)
      setStep('login')
    }
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginError(null)
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })
      
      const text = await response.text()
      
      if (!response.ok) {
        let errorMessage
        try {
          const error = JSON.parse(text)
          errorMessage = error.message || error.error || 'Erreur de connexion'
        } catch {
          errorMessage = text || 'Erreur de connexion'
        }
        throw new Error(errorMessage)
      }
      
      const result = (() => {
        try {
          return JSON.parse(text)
        } catch {
          throw new Error(`Réponse invalide du serveur (${response.status})`)
        }
      })()
      
      auth.setToken(result.access_token)
      auth.setUser(result.user)
      
      setUser(result.user)
      setIsAuthenticated(true)
      
      toast.success('Connexion réussie !')
      setStep('form')
      
    } catch (error) {
      console.error('❌ Erreur connexion:', error)
      setLoginError(error.message)
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setRegisterError(null)
    
    const { confirmPassword, acceptTerms, ...userData } = registerData
    
    if (userData.password !== confirmPassword) {
      setRegisterError('Les mots de passe ne correspondent pas')
      toast.error('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }
    
    if (!acceptTerms) {
      setRegisterError('Veuillez accepter les conditions d\'utilisation')
      toast.error('Veuillez accepter les conditions d\'utilisation')
      setLoading(false)
      return
    }
    
    try {
      const registerPayload = {
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name.trim(),
        telephone: userData.telephone?.trim() || '+237000000000',
        sexe: userData.sexe || 'homme',
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}&background=0a89f2&color=fff&size=128`
      }
      
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload)
      })
      
      const registerText = await registerResponse.text()
      
      if (!registerResponse.ok) {
        let errorMessage
        try {
          const error = JSON.parse(registerText)
          errorMessage = error.message || error.error || 'Erreur d\'inscription'
        } catch {
          errorMessage = registerText || 'Erreur d\'inscription'
        }
        throw new Error(errorMessage)
      }
      
      toast.success('Compte créé avec succès !')
      
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email.trim(),
          password: userData.password
        })
      })
      
      const loginText = await loginResponse.text()
      
      if (!loginResponse.ok) {
        throw new Error('Connexion automatique échouée')
      }
      
      const loginResult = JSON.parse(loginText)
      
      auth.setToken(loginResult.access_token)
      auth.setUser(loginResult.user)
      
      setUser(loginResult.user)
      setIsAuthenticated(true)
      
      setStep('form')
      toast.success('Connecté automatiquement !')
      
    } catch (error) {
      console.error('❌ Erreur inscription:', error)
      setRegisterError(error.message)
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const runReservation = async ({ confirmDuplicate = false } = {}) => {
    const token = auth.getToken()
    const storedUser = auth.getUser()

    if (!token || !storedUser) {
      toast.error('Veuillez vous connecter pour réserver')
      setStep('login')
      return
    }

    setIsAuthenticated(true)
    setUser(storedUser)
    setLoading(true)
    try {
      const reservation = await api.reserveTickets({
        eventId: event.id,
        quantity: formData.quantity,
        customerName: storedUser.name || storedUser.email || 'Client DiCe',
        customerEmail: storedUser.email,
        customerPhone:
          String(storedUser.telephone || storedUser.phone || '').trim() ||
          '+237000000000',
        event_date: event.start_date || event.date || event.starts_at,
        location: event.location || event.lieu,
        time:
          event.start_time && event.end_time
            ? `${event.start_time} - ${event.end_time}`
            : null,
        confirmDuplicate,
      }, token)

      setTicket(reservation)

      const ticketId = reservation?.id ?? reservation?.ticket_id
      if (!ticketId) {
        throw new Error('La réservation n’a pas renvoyé d’identifiant de ticket')
      }

      const paymentData = await api.initiatePayment({
        ticketId,
        method: 'mtn_momo',
        phone:
          String(storedUser.telephone || storedUser.phone || '').trim() ||
          '+237000000000',
      }, token)

      setPayment(paymentData)
      setCountdown(300)
      setStep('payment')
    } catch (error) {
      if (error.status === 409 && !confirmDuplicate) {
        setDuplicatePrompt(true)
        return
      }
      console.error('❌ Erreur réservation:', error)
      toast.error(error.message || 'Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const token = auth.getToken()
    const storedUser = auth.getUser()
    
    if (!token || !storedUser) {
      toast.error('Veuillez vous connecter pour réserver')
      setStep('login')
      return
    }

    if (!formData.quantity || formData.quantity < 1) {
      toast.error('Indiquez le nombre de tickets souhaités')
      return
    }

    if (availablePlaces <= 0) {
      toast.error('Plus de places disponibles')
      return
    }

    if (formData.quantity > availablePlaces) {
      toast.error(
        `Seulement ${availablePlaces} place${availablePlaces > 1 ? 's' : ''} disponible${availablePlaces > 1 ? 's' : ''}`
      )
      return
    }

    await runReservation({ confirmDuplicate: false })
  }

  const finishSuccessfulPayment = (status, paidTicket) => {
    const source = paidTicket || ticket
    const ticketsList =
      Array.isArray(source?.tickets) && source.tickets.length
        ? source.tickets
        : [
            {
              id: source?.id,
              qr_codes: source?.qr_codes || [],
            },
          ]

    const firstQr = ticketsList[0]?.qr_codes?.[0]
    const firstCode =
      typeof firstQr === 'string' ? firstQr : firstQr?.code || null
    const firstEntry =
      typeof firstQr === 'object' && firstQr ? firstQr.entry_code : null

    setTicket({ ...source, tickets: ticketsList })
    setQrCode(
      firstCode
        ? { qr_code: firstCode, entry_code: firstEntry }
        : null
    )
    setStep('success')
    toast.success(
      `${formData.quantity} ticket${formData.quantity > 1 ? 's' : ''} généré${formData.quantity > 1 ? 's' : ''} !`
    )
    setTicketCreated(true)

    if (onSuccess) {
      onSuccess({
        ...source,
        quantity: formData.quantity,
        qrCode: firstCode,
        entry_code: firstEntry,
        payment: status,
      })
    }
  }

  const checkPaymentStatus = async (paymentRef = payment) => {
    if (!paymentRef?.id) return

    try {
      const token = auth.getToken()
      const status = await api.getPaymentStatus(paymentRef.id, token)

      if (status.status === 'successful') {
        finishSuccessfulPayment(status, ticket)
      } else if (status.status === 'failed') {
        toast.error('Le paiement a échoué')
        setStep('form')
        setTicket(null)
        setPayment(null)
      } else {
        setTimeout(() => checkPaymentStatus(paymentRef), 3000)
      }
    } catch (error) {
      console.error('Erreur vérification paiement:', error)
    }
  }

  const handlePayment = async () => {
    if (!payment?.reference) {
      toast.error('Paiement introuvable')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Traitement du paiement...')
    try {
      await api.confirmMtnPayment({
        reference: payment.reference,
        status: 'successful',
        transaction_id: `TXN-${Date.now()}`,
      })

      const token = auth.getToken()
      const status = await api.getPaymentStatus(payment.id, token)

      if (status.status === 'successful') {
        toast.dismiss(toastId)
        finishSuccessfulPayment(status, ticket)
      } else {
        toast.dismiss(toastId)
        await checkPaymentStatus(payment)
      }
    } catch (error) {
      console.error('Erreur paiement:', error)
      toast.dismiss(toastId)
      toast.error(error.message || 'Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    
    const firstTicket = ticket?.tickets?.[0] || ticket
    const qr = firstTicket?.qr_codes?.[0]
    const entry =
      (typeof qr === 'object' && qr?.entry_code) ||
      qrCode?.entry_code ||
      '00000000'

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 300, 300)
    
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🎫', 150, 100)
    ctx.font = '14px Arial'
    ctx.fillText(`Ticket #${firstTicket?.id || ticket?.id || 'N/A'}`, 150, 150)
    ctx.fillStyle = '#1a1a2e'
    ctx.font = '12px Arial'
    ctx.fillText(event?.title || 'Événement', 150, 180)
    ctx.fillText(user?.name || 'Utilisateur', 150, 200)
    ctx.fillStyle = '#0a89f2'
    ctx.font = 'bold 28px monospace'
    ctx.fillText(String(entry).padStart(8, '0').slice(0, 8), 150, 245)
    
    const link = document.createElement('a')
    link.download = `ticket-${firstTicket?.id || ticket?.id || 'event'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleClose = () => {
    if (ticketCreated) {
      toast.success('🎫 Ticket disponible dans "Mes tickets"')
    }
    onClose()
    setStep('form')
    setTicket(null)
    setPayment(null)
    setQrCode(null)
    setCountdown(0)
    setLoginError(null)
    setRegisterError(null)
    setTicketCreated(false)
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
          className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-dice-blue/5 to-purple-500/5 flex-shrink-0">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {step === 'form' && 'Réserver votre place'}
                {step === 'login' && 'Connexion requise'}
                {step === 'register' && 'Créer un compte'}
                {step === 'payment' && 'Paiement en cours'}
                {step === 'success' && 'Réservation confirmée !'}
              </h3>
              <p className="text-sm text-gray-500">{event?.title}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={step === 'payment' && payment?.status === 'pending'}
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Contenu - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Formulaire de réservation - Sans nom et email */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informations utilisateur connecté */}
                {isAuthenticated && user && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
                    <p className="text-green-800 font-medium">👤 Connecté en tant que</p>
                    <p className="text-green-700">{user.name}</p>
                    <p className="text-green-600 text-xs">{user.email}</p>
                  </div>
                )}

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
                </div>

                {/* Nombre de tickets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de tickets souhaités
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        quantity: Math.max(1, prev.quantity - 1) 
                      }))}
                      className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                      disabled={formData.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxTickets}
                      value={formData.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (Number.isNaN(value)) return
                        setFormData(prev => ({
                          ...prev,
                          quantity: Math.min(maxTickets, Math.max(1, value)),
                        }))
                      }}
                      className="w-16 text-center text-xl font-bold text-dice-blue border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-dice-blue/30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        quantity: Math.min(maxTickets, prev.quantity + 1) 
                      }))}
                      className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                      disabled={formData.quantity >= maxTickets || availablePlaces <= 0}
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">
                      {availablePlaces} dispo. · max {maxTickets}
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
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || availablePlaces <= 0}
                  className="text-base py-3"
                >
                  {availablePlaces <= 0
                    ? 'Complet'
                    : loading
                      ? 'Réservation...'
                      : 'Réserver et payer'}
                  {availablePlaces > 0 && <FaArrowRight className="ml-2" />}
                </Button>
              </form>
            )}

            {/* Connexion */}
            {step === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-dice-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaLock className="text-2xl text-dice-blue" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Connexion requise</h4>
                  <p className="text-sm text-gray-500">Connectez-vous pour réserver</p>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="exemple@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-500">Pas encore de compte ?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError(null)
                      setStep('register')
                    }}
                    className="text-dice-blue hover:underline font-medium ml-1"
                  >
                    Créer un compte
                  </button>
                </div>
              </form>
            )}

            {/* Inscription */}
            {step === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="text-center mb-3">
                  <div className="w-16 h-16 bg-dice-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <GiDiamondRing className="text-2xl text-dice-blue" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Créer un compte</h4>
                  <p className="text-sm text-gray-500">Inscrivez-vous pour réserver</p>
                </div>

                {registerError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                    {registerError}
                  </div>
                )}



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="exemple@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={registerData.telephone}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="+237 690142918"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="relative flex items-center justify-center py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="sexe"
                        value="homme"
                        checked={registerData.sexe === 'homme'}
                        onChange={handleRegisterChange}
                        className="sr-only peer"
                      />
                      <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                        <FaVenusMars className="text-blue-500" /> Homme
                      </span>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-lg" />
                    </label>
                    <label className="relative flex items-center justify-center py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="sexe"
                        value="femme"
                        checked={registerData.sexe === 'femme'}
                        onChange={handleRegisterChange}
                        className="sr-only peer"
                      />
                      <span className="peer-checked:text-dice-blue peer-checked:font-semibold flex items-center gap-2 text-sm">
                        <FaVenusMars className="text-pink-500" /> Femme
                      </span>
                      <div className="absolute inset-0 border-2 border-transparent peer-checked:border-dice-blue rounded-lg" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showRegisterConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dice-blue focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegisterConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={registerData.acceptTerms}
                    onChange={handleRegisterChange}
                    className="h-4 w-4 text-dice-blue focus:ring-dice-blue/30 border-gray-300 rounded mt-0.5"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    J'accepte les conditions d'utilisation
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Création du compte...' : 'Créer un compte et réserver'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-500">Déjà un compte ?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterError(null)
                      setStep('login')
                    }}
                    className="text-dice-blue hover:underline font-medium ml-1"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            )}

            {/* Paiement */}
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
                  <p className="text-xs text-gray-400 mt-1">
                    Simulation de paiement pour la démonstration
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
                    <span className="font-semibold">{user?.telephone || '+237000000000'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Référence</span>
                    <span className="font-semibold text-xs text-gray-500">
                      {payment?.reference || 'MTN-REF-XXXX'}
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
                  {loading ? 'Vérification...' : countdown === 0 ? 'Temps expiré' : 'Simuler le paiement'}
                  {!loading && countdown > 0 && <FaCheckCircle className="ml-2" />}
                </Button>
              </div>
            )}

            {/* Succès */}
            {step === 'success' && (
              <div className="text-center py-4 space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800">Réservation confirmée !</h4>
                  <p className="text-sm text-gray-500">
                    {(ticket?.tickets?.length || formData.quantity)} ticket
                    {(ticket?.tickets?.length || formData.quantity) > 1 ? 's' : ''} généré
                    {(ticket?.tickets?.length || formData.quantity) > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    Disponibles dans « Mes tickets »
                  </p>
                </div>

                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {(Array.isArray(ticket?.tickets) && ticket.tickets.length
                    ? ticket.tickets
                    : [{ id: ticket?.id, qr_codes: ticket?.qr_codes || [] }]
                  ).map((t, index) => {
                    const qr = t.qr_codes?.[0]
                    const entry =
                      (typeof qr === 'object' && qr?.entry_code) ||
                      qrCode?.entry_code ||
                      '--------'
                    return (
                      <div
                        key={t.id || index}
                        className="rounded-2xl border border-dice-blue/20 bg-white p-4 text-left"
                      >
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-800">
                            {t.shareable
                              ? 'À partager'
                              : `Ticket ${index + 1}`}
                          </span>
                          <span className="text-xs text-gray-400">#{t.id}</span>
                        </div>
                        {t.shareable ? (
                          <p className="mb-2 text-xs text-gray-500">
                            Envoyez le QR ou le code d’entrée à un ami, dans ou hors de l’application.
                          </p>
                        ) : null}
                        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <div className="mb-2 text-4xl">🎫</div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            Code d&apos;entrée
                          </p>
                          <p className="mt-1 font-mono text-2xl font-bold tracking-[0.2em] text-dice-blue">
                            {String(entry).padStart(8, '0').slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleDownloadQR}
                    variant="outline"
                    className="flex-1"
                  >
                    <FaDownload className="mr-2" />
                    QR Code
                  </Button>
                  <Button
                    onClick={() => {
                      if (onSuccess) onSuccess(ticket)
                      handleClose()
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
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>🔒 Sécurisé par Diamond Centre</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Paiement sécurisé
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <ConfirmDialog
        open={duplicatePrompt}
        title="Vous avez déjà des billets"
        message="Vous avez déjà un ou plusieurs billets pour cet événement. Si vous confirmez, les nouvelles places seront vides : uniquement le QR et le code d’entrée, à partager avec un ami."
        confirmLabel="Réserver quand même"
        cancelLabel="Annuler"
        tone="info"
        loading={loading}
        onCancel={() => setDuplicatePrompt(false)}
        onConfirm={() => {
          setDuplicatePrompt(false)
          runReservation({ confirmDuplicate: true })
        }}
      />
    </AnimatePresence>
  )
}