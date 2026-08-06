/**
 * Côté image des pages d'authentification
 */
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GiDiamondRing } from 'react-icons/gi'

export default function AuthImageSide({ 
  title = "Diamond Centre",
  subtitle = "L'excellence à chaque étape",
  imageSrc = "/images/auth/auth-bg.jpg",
  badge = "🌟 Depuis 2015"
}) {
  return (
    <div className="relative hidden lg:block lg:w-1/2 h-screen overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Diamond Centre"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dice-blue/80 via-dice-blue/60 to-purple-600/70" />
      </div>

      {/* Contenu superposé */}
      <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <GiDiamondRing className="text-2xl text-white" />
          </div>
          <span className="text-xl font-bold">{title}</span>
        </motion.div>

        {/* Message central */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md"
        >
          <div className="glass-white rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            <div className="text-5xl mb-4">💎</div>
            <h2 className="text-3xl font-bold mb-3">
              {subtitle}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Rejoignez une communauté de professionnels passionnés 
              et développez votre potentiel avec Diamond Centre.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-gradient-to-br from-dice-blue to-purple-500 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/60">+5000 membres</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between text-xs text-white/50"
        >
          <span>{badge}</span>
          <span>© 2026 Diamond Centre</span>
        </motion.div>

        {/* Cercles décoratifs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
    </div>
  )
}