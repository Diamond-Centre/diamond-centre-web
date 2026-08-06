/**
 * Composant statistiques animé
 */
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Stats({ stats, className, variant = 'light' }) {
  const textColors = {
    light: 'text-gray-600',
    dark: 'text-white/60'
  }

  const valueColors = {
    light: 'text-gray-800',
    dark: 'text-white'
  }

  return (
    <motion.div 
      className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + index * 0.1 }}
          className="text-center"
        >
          <stat.icon className="text-3xl text-dice-blue mb-2" />
          <div className={cn('text-2xl font-bold', valueColors[variant])}>
            {stat.value}
          </div>
          <div className={cn('text-sm', textColors[variant])}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}