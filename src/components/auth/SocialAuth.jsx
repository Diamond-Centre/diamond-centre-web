/**
 * Composant pour l'authentification via services sociaux
 */
'use client'

import { motion } from 'framer-motion'
import { FaGoogle, FaFacebook, FaApple, FaGithub, FaTwitter } from 'react-icons/fa'

const socialProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: FaGoogle,
    color: '#EA4335',
    bgColor: 'hover:bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FaFacebook,
    color: '#1877F2',
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: FaApple,
    color: '#000000',
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: FaGithub,
    color: '#181717',
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: FaTwitter,
    color: '#1DA1F2',
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-blue-200'
  }
]

export default function SocialAuth({ onSocialLogin, loading = false }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-2">
        {socialProviders.map((provider) => (
          <motion.button
            key={provider.id}
            onClick={() => onSocialLogin?.(provider.id)}
            disabled={loading}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center justify-center p-3 rounded-xl border-2 
              ${provider.bgColor} ${provider.borderColor} 
              transition-all duration-300 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <provider.icon 
              className="text-xl transition-transform duration-300 group-hover:scale-110" 
              style={{ color: provider.color }}
            />
          </motion.button>
        ))}
      </div>
      
      <p className="text-xs text-center text-gray-500">
        Continuez avec l'un de ces services
      </p>
    </div>
  )
}