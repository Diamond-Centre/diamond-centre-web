/**
 * Formulaire de paiement
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCreditCard, 
  FaMobileAlt, 
  FaPaypal, 
  FaLock,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa'
import { SiOrange, SiMtn } from 'react-icons/si'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function TicketPayment({ 
  event, 
  quantity, 
  totalPrice, 
  onPayment, 
  onBack,
  isProcessing 
}) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    phoneNumber: ''
  })

  const paymentMethods = [
    { id: 'card', label: 'Carte bancaire', icon: FaCreditCard },
    { id: 'mobile', label: 'Mobile Money', icon: FaMobileAlt },
    { id: 'paypal', label: 'PayPal', icon: FaPaypal },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onPayment({
      method: paymentMethod,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...formData
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Méthodes de paiement */}
      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = paymentMethod === method.id
          return (
            <motion.button
              key={method.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                isSelected 
                  ? 'border-dice-blue bg-dice-blue/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`text-2xl mx-auto ${isSelected ? 'text-dice-blue' : 'text-gray-400'}`} />
              <span className="text-xs font-medium block mt-1">{method.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Champs selon la méthode */}
      {paymentMethod === 'card' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Input
            label="Numéro de carte"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date d'expiration"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
            <Input
              label="CVV"
              name="cvv"
              type="password"
              placeholder="•••"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Nom du titulaire"
            name="cardholderName"
            placeholder="Jean Dupont"
            value={formData.cardholderName}
            onChange={handleChange}
            required
          />
        </motion.div>
      )}

      {paymentMethod === 'mobile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="p-4 border-2 rounded-xl flex items-center gap-3 hover:border-dice-blue transition-colors"
            >
              <SiOrange className="text-3xl text-orange-500" />
              <span className="font-medium">Orange Money</span>
            </button>
            <button
              type="button"
              className="p-4 border-2 rounded-xl flex items-center gap-3 hover:border-dice-blue transition-colors"
            >
              <SiMtn className="text-3xl text-yellow-500" />
              <span className="font-medium">MTN Mobile</span>
            </button>
          </div>
          <Input
            label="Numéro de téléphone"
            name="phoneNumber"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-xl">
            <FaLock className="inline mr-2 text-dice-blue" />
            Vous recevrez un code de confirmation par SMS
          </div>
        </motion.div>
      )}

      {paymentMethod === 'paypal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <FaPaypal className="text-6xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vous serez redirigé vers PayPal</p>
          <p className="text-sm text-gray-500">Paiement sécurisé par PayPal</p>
        </motion.div>
      )}

      {/* Résumé du paiement */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{quantity} place{quantity > 1 ? 's' : ''}</span>
          <span>{event?.prixPromotion || event?.prix} €</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span className="text-dice-blue">{totalPrice} €</span>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          <FaArrowLeft className="mr-2" />
          Retour
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          fullWidth
          loading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? 'Traitement...' : `Payer ${totalPrice} €`}
        </Button>
      </div>

      {/* Sécurité */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <FaLock className="text-dice-blue" />
          Paiement sécurisé
        </span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="flex items-center gap-1">
          <FaShieldAlt className="text-dice-blue" />
          Garantie 100%
        </span>
      </div>
    </form>
  )
}