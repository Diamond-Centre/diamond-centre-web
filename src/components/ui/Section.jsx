/**
 * Composant section avec titre et description
 */
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Section({ 
  children,
  title,
  subtitle,
  badge,
  className,
  centered = true,
  container = true,
  ...props 
}) {
  return (
    <section className={cn('py-16 md:py-20', className)} {...props}>
      <div className={container ? 'container mx-auto px-4' : ''}>
        {/* En-tête de section */}
        {(title || subtitle || badge) && (
          <motion.div 
            className={cn(
              'mb-12',
              centered && 'text-center'
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {badge && (
              <span className="inline-block bg-blue-100 text-blue-600 font-semibold uppercase tracking-wider text-sm px-4 py-2 rounded-full mb-4">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                'text-gray-600 text-lg',
                centered ? 'max-w-2xl mx-auto' : ''
              )}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        
        {children}
      </div>
    </section>
  )
}